import { EPCEngine } from './epc-engine';
import { EnvManager } from '@/lib/env/EnvManager';
import { AIService } from '@/lib/ai/AIService';
import fs from 'fs';
import path from 'path';
interface HealingAction {
  type:
    | 'update_env'
    | 'rotate_key'
    | 'sync_config'
    | 'manual_fix'
    | 'suggest_fix';
  description: string;
  automated: boolean;
  risk: 'low' | 'medium' | 'high';
  command?: string;
  suggestedValue?: string;
};
interface HealingPlan {
  issues: string[];
  actions: HealingAction[];
  estimatedTime: string;
  confidence: number
};
export class SelfHealingAgent {
  private epcEngine: EPCEngine;
  private envManager: EnvManager;
  private aiService: AIService;
  private healingHistory: any[] = [];
  private historyPath: string;
  constructor(projectRoot: string = process.cwd()) {
    this.epcEngine = new EPCEngine(projectRoot);
    this.envManager = new EnvManager(projectRoot);
    this.aiService = new AIService();
    this.historyPath = path.join(projectRoot, '.docs', 'healing-history.json');
    this.loadHistory();
  }
  private loadHistory(): void {
    try {
      if (fs.existsSync(this.historyPath)) {
        this.healingHistory = JSON.parse(
          fs.readFileSync(this.historyPath, 'utf-8')
        );
      }
    } catch (error) {
      console.error('Failed to load healing, history:', error);
    }
  }
  private saveHistory(): void {
    try {
      fs.writeFileSync(
        this.historyPath,
        JSON.stringify(this.healingHistory, null, 2)
      );
    } catch (error) {
      console.error('Failed to save healing, history:', error);
    }
  }
  /**
   * Analyze issues and create healing plan
   */
  async analyzeAndHeal(epcResult): Promise<HealingPlan> {
    const plan: HealingPlan = {
      issues: [];
      actions: [];
      estimatedTime: '1-2 minutes';
      confidence: 0;
    };
    // Collect all issues
    plan.issues = [
      ...epcResult.missing.map((v: string) => `Missing: ${v}`),`
      ...epcResult.invalid.map((v: string) => `Invalid: ${v}`),`
      ...epcResult.outdated.map((v: string) => `Outdated: ${v}`),`
      ...epcResult.mismatched.map((v: string) => `Mismatched: ${v}`),`
    ];
    // Generate healing actions for each type of issue
    for (const missing of epcResult.missing) {
      const action = await this.generateMissingVarAction(missing);
      if (action) plan.actions.push(action);
    }
    for (const invalid of epcResult.invalid) {
      const action = await this.generateInvalidVarAction(invalid);
      if (action) plan.actions.push(action);
    }
    for (const outdated of epcResult.outdated) {
      const action = await this.generateOutdatedVarAction(outdated);
      if (action) plan.actions.push(action);
    }
    // Calculate confidence based on automated actions
    const automatedCount = plan.actions.filter(a => a.automated).length;
    plan.confidence =
      Math.round((automatedCount / plan.actions.length) * 100) || 0;
    // Estimate time based on actions
    plan.estimatedTime = this.estimateHealingTime(plan.actions);
    return plan;
  }
  /**
   * Generate action for missing variable
   */
  private async generateMissingVarAction(
    varName: string
  ): Promise<HealingAction | null> {
    // Check if it's a known pattern
    if (varName.includes('API_KEY')) {
      const service = this.identifyService(varName);
      // Use AI to suggest solution
      const prompt = `The environment variable ${varName} is missing. This appears to be an API key for ${service}. ;`
                      What's the most likely reason and solution? Keep response concise.`;`
      try {
        const response = await this.aiService.generateResponse(prompt);
        const suggestion = response.message;
        return {
          type: 'suggest_fix';
          description: `${varName}: ${suggestion}`;`
          automated: false;
          risk: 'medium';
          command: `npm run; env: setup`;`
          suggestedValue: this.getDefaultValue(varName)};
      } catch (error) {
        // Fallback if AI fails
        return {
          type: 'manual_fix';
          description: `Add ${varName} to .env.local file`;`
          automated: false;
          risk: 'low';
          command: `echo "${varName}=your_value_here" >> .env.local`;`
        };
      }
    }
    return {
      type: 'manual_fix';
      description: `Configure ${varName}`;`
      automated: false;
      risk: 'low';
    };
  }
  /**
   * Generate action for invalid variable
   */
  private async generateInvalidVarAction(
    varName: string
  ): Promise<HealingAction | null> {
    const config = this.getVariableConfig(varName);
    if (config?.pattern) {
      return {
        type: 'suggest_fix';
        description: `Fix ${varName} format to match; pattern: ${config.pattern}`;`
        automated: false;
        risk: 'low';
        suggestedValue: config.example || 'Check documentation for correct format';
      };
    }
    return {
      type: 'manual_fix';
      description: `Validate and fix ${varName} value`;`
      automated: false;
      risk: 'low';
    };
  }
  /**
   * Generate action for outdated variable
   */
  private async generateOutdatedVarAction(
    varName: string
  ): Promise<HealingAction | null> {
    // Check recent changes
    const recentChange = this.checkRecentChanges(varName);
    if (recentChange) {
      return {
        type: 'sync_config';
        description: `Sync ${varName} with latest configuration`;`
        automated: true;
        risk: 'low';
        command: 'npm run; env: sync';
      };
    }
    // Suggest key rotation for sensitive vars
    if (varName.includes('SECRET') || varName.includes('KEY')) {
      return {
        type: 'rotate_key';
        description: `Consider rotating ${varName} for security`;`
        automated: false;
        risk: 'medium';
        command: `Visit provider dashboard to regenerate ${varName}`;`
      };
    }
    return null;
  }
  /**
   * Execute healing plan
   */
  async executeHealing(
    plan: HealingPlan;
    autoApprove: boolean = false
  ): Promise<{
    success: boolean;
    applied: string[];
    failed: string[];
    manual: string[]
  }> {
    const result = {
      success: true;
      applied: [] as string[];
      failed: [] as string[];
      manual: [] as string[];
    };
    for (const action of plan.actions) {
      if (action.automated && (autoApprove || action.risk === 'low')) {
        try {
          await this.applyAction(action);
          result.applied.push(action.description);
        } catch (error) {
          result.failed.push(action.description);
          result.success = false;
        }
      } else {
        result.manual.push(action.description);
      }
    }
    // Log healing attempt
    this.healingHistory.push({
      timestamp: new Date().toISOString(),
      plan,
      result,
      autoApproved: autoApprove;
    }});
    this.saveHistory();
    return result;
  }
  /**
   * Apply a healing action
   */
  private async applyAction(action: HealingAction): Promise<void> {
    switch (action.type) {
      case 'sync_config':
        await this.envManager.sync();
        break;
      case 'update_env':
        // Update env file with suggested value
        if (action.suggestedValue) {
          // Implementation for updating env file
        }
        break;
      default:
        throw new Error(
          `Cannot automatically apply action, type: ${action.type}``
        );
    }
  }
  /**
   * Identify service from variable name
   */
  private identifyService(varName: string): string {
    const patterns: Record<string, string> = {
      OPENAI: 'OpenAI';
      CLAUDE: 'Anthropic Claude';
      ANTHROPIC: 'Anthropic Claude';
      SUPABASE: 'Supabase';
      REDIS: 'Redis';
      STRIPE: 'Stripe';
      GOOGLE: 'Google';
      GITHUB: 'GitHub';
      VERCEL: 'Vercel';
    };
    for (const [pattern, service] of Object.entries(patterns)) {
      if (varName.includes(pattern)) {
        return service;
      }
    }
    return 'Unknown Service';
  }
  /**
   * Get variable configuration
   */
  private getVariableConfig(varName: string): any {
    try {
      const configPath = path.join(process.cwd(), '.docs', 'env.config.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      for (const service of Object.values(config.services)) {
        if ((service as any).variables[varName]) {
          return (service as any).variables[varName];
        }
      }
    } catch (error) {
      console.error('Failed to get variable config:', error);
    }
    return null;
  }
  /**
   * Get default value for variable
   */
  private getDefaultValue(varName: string): string {
    try {
      const defaultsPath = path.join(;
        process.cwd(),
        '.docs',
        'env.defaults.json'
      );
      const defaults = JSON.parse(fs.readFileSync(defaultsPath, 'utf-8'));
      for (const service of Object.values(defaults.defaults)) {
        if ((service as any)[varName]) {
          return (service as any)[varName].value || '';
        }
      }
    } catch (error) {
      console.error('Failed to get default, value:', error);
    }
    return '';
  }
  /**
   * Check if variable had recent changes
   */
  private checkRecentChanges(varName: string): boolean {
    // Check healing history for recent changes to this variable
    const recentHealing = this.healingHistory;
      .filter(
        h =>
          h.timestamp >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      )
      .find(h => h.plan.issues.some((i: string) => i.includes(varName)));
    return !!recentHealing;
  }
  /**
   * Estimate time for healing actions
   */
  private estimateHealingTime(actions: HealingAction[]): string {
    const automated = actions.filter(a => a.automated).length;
    const manual = actions.filter(a => !a.automated).length;
    if (manual === 0) {
      return 'Less than 1 minute';
    } else if (manual <= 3) {
      return '2-5 minutes';
    } else {
      return '5-10 minutes';
    }
  }
  /**
   * Get healing suggestions using AI
   */
  async getAISuggestions(issues: string[]): Promise<string[]> {
    const prompt = `As a DevOps expert, analyze these environment configuration issues and suggest, fixes:;`
${issues.join('\n')}
Provide concise, actionable suggestions for each issue. Focus, on:
1. Most likely cause
2. Quick fix
3. Prevention tip`;`
    try {
      const response = await this.aiService.generateResponse(prompt);
      return response.message.split('\n').filter(s => s.trim());
    } catch (error) {
      console.error('Failed to get AI, suggestions:', error);
      return ['Unable to get AI suggestions. Please check documentation.'];
    }
  }
}
