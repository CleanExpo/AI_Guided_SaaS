import fs from 'fs';
import path from 'path';
import { EnvManager } from '@/lib/env/EnvManager';

interface EPCCheckResult {
  env_check: 'pass' | 'fail' | 'warning';
  missing: string[];
  outdated: string[];
  invalid: string[];
  mismatched: string[];
  action: 'allow_inference' | 'block_inference' | 'warn_proceed';
  recommendations?: string[];
  score: number; // 0-100 confidence score
};

interface ServiceRequirements {
  openai?: boolean;
  anthropic?: boolean;
  supabase?: boolean;
  redis?: boolean;
  stripe?: boolean;
  google?: boolean;
};

export class EPCEngine {
  private envManager: EnvManager;
  private configPath: string;
  private schemaPath: string;
  private lastCheckTime: number = 0;
  private cacheExpiry: number = 60000; // 1 minute cache
  private cachedResult: EPCCheckResult | null = null;

  constructor(projectRoot: string = process.cwd()) {
    this.envManager = new EnvManager(projectRoot);
    this.configPath = path.join(projectRoot, '.docs', 'env.config.json');
    this.schemaPath = path.join(projectRoot, '.docs', 'env.validation.schema');
  }

  /**
   * Perform pre-inference environment check
   * @param requiredServices - Services required for this inference
   * @returns EPCCheckResult with detailed status
   */
  async performPreflightCheck(
    requiredServices?: ServiceRequirements
  ): Promise<EPCCheckResult> {
    // Check cache
    if (
      this.cachedResult &&
      Date.now() - this.lastCheckTime < this.cacheExpiry
    ) {
      return this.cachedResult;
    }

    const result: EPCCheckResult = {
      env_check: 'pass',
      missing: [],
      outdated: [],
      invalid: [],
      mismatched: [],
      action: 'allow_inference',
      recommendations: [],
      score: 100,
    };

    try {
      // Run validation
      const validation = this.envManager.validate();

      // Check for missing required variables
      for (const error of validation.errors) {
        if (error.severity === 'error' && error.message.includes('missing')) {
          result.missing.push(error.variable);
        } else if (error.message.includes('match pattern')) {
          result.invalid.push(error.variable);
        }
      }

      // Check specific service requirements
      if (requiredServices) {
        const criticalMissing = this.checkServiceRequirements(
          requiredServices,
          validation
        );
        result.missing.push(...criticalMissing);
      }

      // Check for outdated values (compare with defaults)
      const outdatedVars = await this.checkOutdatedVariables();
      result.outdated = outdatedVars;

      // Check for mismatches between environments
      const mismatched = this.checkEnvironmentMismatches();
      result.mismatched = mismatched;

      // Calculate score and determine action
      const totalIssues =
        result.missing.length +
        result.invalid.length +
        result.outdated.length +
        result.mismatched.length;

      result.score = Math.max(0, 100 - totalIssues * 10);

      // Determine action based on issues
      if (result.missing.length > 0 || result.invalid.length > 0) {
        result.env_check = 'fail';
        result.action = 'block_inference';
        result.recommendations = this.generateRecommendations(result);
      } else if (result.outdated.length > 0 || result.mismatched.length > 0) {
        result.env_check = 'warning';
        result.action = 'warn_proceed';
        result.recommendations = this.generateRecommendations(result);
      }

      // Cache the result
      this.cachedResult = result;
      this.lastCheckTime = Date.now();

      return result;
    } catch (error) {
      console.error('EPC Engine, error:', error);
      return {
        env_check: 'fail',
        missing: [],
        outdated: [],
        invalid: [],
        mismatched: [],
        action: 'block_inference',
        recommendations: [
          'Failed to perform environment check. Please check your configuration.',
        ],
        score: 0,
      };
    }
  }

  /**
   * Check if specific services have required variables
   */
  private checkServiceRequirements(
    required: ServiceRequirements,
    validation
  ): string[] {
    const criticalMissing: string[] = [];
    const config = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));

    if (required.openai) {
      const openaiVars = Object.keys(config.services.openai.variables);
      for (const varName of openaiVars) {
        if (config.services.openai.variables[varName].required) {
          const error = validation.errors.find(e => e.variable === varName);
          if (error && error.severity === 'error') {
            criticalMissing.push(varName);
          }
        }
      }
    }

    if (required.anthropic) {
      const claudeVars = Object.keys(config.services.anthropic.variables);
      for (const varName of claudeVars) {
        if (config.services.anthropic.variables[varName].required) {
          const error = validation.errors.find(e => e.variable === varName);
          if (error && error.severity === 'error') {
            criticalMissing.push(varName);
          }
        }
      }
    }

    // Check other services similarly...

    return [...new Set(criticalMissing)]; // Remove duplicates
  }

  /**
   * Check for outdated variables by comparing with defaults
   */
  private async checkOutdatedVariables(): Promise<string[]> {
    const outdated: string[] = [];

    try {
      const defaultsPath = path.join(
        process.cwd(),
        '.docs',
        'env.defaults.json'
      );
      if (fs.existsSync(defaultsPath)) {
        const defaults = JSON.parse(fs.readFileSync(defaultsPath, 'utf-8'));
        // Logic to compare current values with defaults
        // This is a placeholder - implement actual comparison logic
      }
    } catch (error) {
      console.error('Error checking outdated, variables:', error);
    }

    return outdated;
  }

  /**
   * Check for mismatches between development and production configs
   */
  private checkEnvironmentMismatches(): string[] {
    const mismatched: string[] = [];

    try {
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
      const envOverrides = config.environments || {};

      // Compare development vs production overrides
      const devOverrides = envOverrides.development?.overrides || {};
      const prodOverrides = envOverrides.production?.overrides || {};

      for (const key of Object.keys(devOverrides)) {
        if (prodOverrides[key] && devOverrides[key] !== prodOverrides[key]) {
          // Check if the difference is expected (like test vs live keys)
          if (
            !this.isExpectedEnvironmentDifference(
              key,
              devOverrides[key],
              prodOverrides[key]
            )
          ) {
            mismatched.push(key);
          }
        }
      }
    } catch (error) {
      console.error('Error checking environment, mismatches:', error);
    }

    return mismatched;
  }

  /**
   * Check if environment difference is expected
   */
  private isExpectedEnvironmentDifference(
    key: string,
    devValue: string,
    prodValue: string
  ): boolean {
    // Expected differences
    if (key === 'NEXTAUTH_URL') return true;
    if (
      key.includes('STRIPE') &&
      devValue.includes('test') &&
      prodValue.includes('live')
    )
      return true;
    if (key === 'REDIS_TLS' && devValue === 'false' && prodValue === 'true')
      return true;

    return false;
  }

  /**
   * Generate recommendations based on issues found
   */
  private generateRecommendations(result: EPCCheckResult): string[] {
    const recommendations: string[] = [];

    if (result.missing.length > 0) {
      recommendations.push(
        `Missing ${result.missing.length} required, variables: ${result.missing.join(', ')}`
      );
      recommendations.push(
        'Run "npm run, env: setup" to configure missing variables'
      )
    }

    if (result.invalid.length > 0) {
      recommendations.push(
        `Invalid ${result.invalid.length} variables: ${result.invalid.join(', ')}`
      );
      recommendations.push('Check variable formats match expected patterns');
    }

    if (result.outdated.length > 0) {
      recommendations.push(
        `${result.outdated.length} variables may be outdated`
      );
      recommendations.push(
        'Consider running "npm run, env: sync" to update configuration'
      )
    }

    if (result.mismatched.length > 0) {
      recommendations.push(
        `${result.mismatched.length} variables differ between environments`
      );
      recommendations.push('Review environment-specific configurations');
    }

    // AI-specific recommendations
    if (
      result.missing.includes('OPENAI_API_KEY') ||
      result.missing.includes('CLAUDE_API_KEY')
    ) {
      recommendations.push('AI service keys are missing - inference will fail');
      recommendations.push(
        'Did you recently rotate API keys? Update .env.local'
      );
    }

    return recommendations;
  }

  /**
   * Quick check method for UI components
   */
  async quickCheck(): Promise<{
    status: 'ready' | 'warning' | 'error',
    message: string
  }> {
    const result = await this.performPreflightCheck();

    if (result.env_check === 'pass') {
      return { status: 'ready', message: 'Environment ready for inference' };
    } else if (result.env_check === 'warning') {
      return {
        status: 'warning',
        message: `${result.outdated.length + result.mismatched.length} warnings`,
      };
    } else {
      return {
        status: 'error',
        message: `${result.missing.length + result.invalid.length} errors`,
      };
    }
  }

  /**
   * Clear cache to force fresh check
   */
  clearCache(): void {
    this.cachedResult = null;
    this.lastCheckTime = 0;
  }
}
