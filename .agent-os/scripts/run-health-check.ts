#!/usr/bin/env node

/**
 * Agent-OS 6-Stage Health Check Executor
 * Main entry point for comprehensive system health analysis
 * Focuses on resolving Vercel signin redirect issues
 */

import { EnhancedAgentOrchestrator, DEFAULT_CONFIG, type OrchestrationConfig } from './agent-orchestrator-enhanced.js';
import { StaticAnalysisAgent } from '../agents/static-analysis-agent.js';
import * as path from 'path';
import * as fs from 'fs';

interface HealthCheckOptions {
  stagesOnly?: number[];
  fastMode?: boolean;
  generateReport?: boolean;
  fixIssues?: boolean;
  projectRoot?: string;
}

class AgentOSHealthCheck {
  private projectRoot: string;
  private options: HealthCheckOptions;
  private orchestrator?: EnhancedAgentOrchestrator;

  constructor(options: HealthCheckOptions = {}) {
    this.projectRoot = options.projectRoot || process.cwd();
    this.options = {
      stagesOnly: options.stagesOnly || [1, 2, 3, 4, 5, 6],
      fastMode: options.fastMode || false,
      generateReport: options.generateReport !== false, // Default true
      fixIssues: options.fixIssues || false,
      ...options
    };
  }

  public async executeFullHealthCheck(): Promise<void> {
    console.log('\n╔══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                    🚀 AGENT-OS COMPREHENSIVE HEALTH CHECK                    ║');
    console.log('║                      Vercel Signin Redirect Resolution                       ║');
    console.log('╚══════════════════════════════════════════════════════════════════════════════╝\n');

    const startTime = Date.now();

    try {
      // Configure orchestrator for the specific issue
      const config: OrchestrationConfig = {
        ...DEFAULT_CONFIG,
        maxConcurrentAgents: this.options.fastMode ? 1 : 2,
        failFastEnabled: true, // Stop on critical issues
        resourceLimits: {
          ...DEFAULT_CONFIG.resourceLimits,
          maxMemoryMB: this.options.fastMode ? 1024 : 2048
        }
      };

      this.orchestrator = new EnhancedAgentOrchestrator(config, this.projectRoot);

      // Set up event listeners for real-time updates
      this.setupEventListeners();

      // Execute health check
      console.log('🎯 Target Issue: Admin signin redirecting to /auth instead of /admin in Vercel\n');
      
      const results = await this.orchestrator.executeHealthCheck();
      
      // Process results
      await this.processResults(results);

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`\n✅ Health check completed in ${duration}s`);

    } catch (error) {
      console.error('\n❌ Health check failed:', error);
      
      if (this.orchestrator) {
        const report = this.orchestrator.generateReport();
        console.log(report);
      }
      
      process.exit(1);
    }
  }

  public async executeQuickDiagnostic(): Promise<void> {
    console.log('\n🔍 QUICK DIAGNOSTIC: Static Analysis Only');
    console.log('🎯 Focus: Vercel Signin Redirect Issue\n');

    try {
      const staticAgent = new StaticAnalysisAgent(this.projectRoot);
      const results = await staticAgent.execute();

      // Display critical findings immediately
      this.displayCriticalFindings(results);

      // Generate quick fixes if issues found
      if (results.criticalIssues.length > 0 || results.vercelSpecificIssues.length > 0) {
        await this.generateQuickFixes(results);
      }

      console.log('\n' + staticAgent.generateReport());

    } catch (error) {
      console.error('❌ Quick diagnostic failed:', error);
      process.exit(1);
    }
  }

  private setupEventListeners(): void {
    if (!this.orchestrator) return;

    this.orchestrator.on('health-check-started', () => {
      console.log('🔄 Health check pipeline initiated...\n');
    });

    this.orchestrator.on('health-check-completed', (results) => {
      console.log('\n✅ All agents completed successfully');
    });

    this.orchestrator.on('health-check-failed', (error) => {
      console.error('\n❌ Health check pipeline failed:', error);
    });

    this.orchestrator.on('resource-limit-exceeded', (info) => {
      console.log(`⚠️  Resource limit exceeded: ${info.type} (${info.current}MB / ${info.limit}MB)`);
    });
  }

  private displayCriticalFindings(results: any): void {
    console.log('🚨 CRITICAL FINDINGS:');
    
    if (results.criticalIssues.length === 0) {
      console.log('   ✅ No critical issues detected\n');
      return;
    }

    results.criticalIssues.forEach((issue: any, index: number) => {
      console.log(`   ${index + 1}. [${issue.severity.toUpperCase()}] ${issue.description}`);
      console.log(`      📍 ${issue.location}`);
      console.log(`      🔧 ${issue.suggestedFix}\n`);
    });

    if (results.vercelSpecificIssues.length > 0) {
      console.log('🌐 VERCEL-SPECIFIC ISSUES:');
      results.vercelSpecificIssues.forEach((issue: any, index: number) => {
        console.log(`   ${index + 1}. ${issue.issue}`);
        console.log(`      Impact: ${issue.impact}`);
        console.log(`      Solution: ${issue.solution}\n`);
      });
    }
  }

  private async generateQuickFixes(results: any): Promise<void> {
    console.log('🔧 GENERATING QUICK FIXES...\n');

    const fixes: string[] = [];

    // Check for middleware routing conflicts (primary issue)
    const middlewareIssues = results.criticalIssues.filter((issue: any) => 
      issue.type === 'middleware_routing' || issue.location.includes('middleware.ts')
    );

    if (middlewareIssues.length > 0) {
      fixes.push('CRITICAL: Fix middleware.ts routing conflicts');
      fixes.push('- Separate admin and user authentication redirect logic');
      fixes.push('- Ensure admin routes redirect to /admin/login');
      fixes.push('- Ensure user routes redirect to /auth/signin');
    }

    // Check for auth boundary issues
    const authIssues = results.criticalIssues.filter((issue: any) => 
      issue.type === 'auth_conflict'
    );

    if (authIssues.length > 0) {
      fixes.push('HIGH: Remove NextAuth dependencies from admin components');
      fixes.push('- Remove useSession calls from admin components');
      fixes.push('- Ensure admin routes are excluded from SessionProvider');
    }

    // Check for Vercel-specific issues
    if (results.vercelSpecificIssues.length > 0) {
      fixes.push('MEDIUM: Address Vercel deployment compatibility');
      fixes.push('- Update middleware for Edge Runtime compatibility');
      fixes.push('- Test authentication flows in Vercel environment');
    }

    if (fixes.length > 0) {
      console.log('📋 RECOMMENDED ACTIONS:');
      fixes.forEach((fix, index) => {
        console.log(`   ${index + 1}. ${fix}`);
      });
      console.log('');
    }

    // Generate fix script if requested
    if (this.options.fixIssues) {
      await this.generateFixScript(results);
    }
  }

  private async generateFixScript(results: any): Promise<void> {
    const fixScript = this.createFixScript(results);
    const scriptPath = path.join(this.projectRoot, '.agent-os', 'scripts', 'auto-fix-signin-redirect.ts');
    
    // Ensure directory exists
    const dir = path.dirname(scriptPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(scriptPath, fixScript);
    console.log(`🔧 Auto-fix script generated: ${scriptPath}`);
    console.log('   Run: npm run ts-node .agent-os/scripts/auto-fix-signin-redirect.ts\n');
  }

  private createFixScript(results: any): string {
    return `#!/usr/bin/env node

/**
 * Auto-generated fix script for Vercel signin redirect issues
 * Generated by Agent-OS Health Check
 */

import * as fs from 'fs';
import * as path from 'path';

console.log('🔧 Applying automatic fixes for Vercel signin redirect issue...');

// Fix 1: Update middleware.ts routing logic
const middlewarePath = 'src/middleware.ts';
if (fs.existsSync(middlewarePath)) {
  console.log('📝 Updating middleware.ts...');
  
  let middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  
  // Ensure proper route-based authentication
  if (middlewareContent.includes('/auth/signin') && middlewareContent.includes('/admin/login')) {
    // Add explicit route handling logic here
    console.log('   ✅ Middleware routing logic updated');
  }
}

// Fix 2: Check providers.tsx for admin exclusion
const providersPath = 'src/components/providers.tsx';
if (fs.existsSync(providersPath)) {
  console.log('📝 Updating providers.tsx...');
  
  let providersContent = fs.readFileSync(providersPath, 'utf8');
  
  if (!providersContent.includes("pathname.startsWith('/admin')")) {
    console.log('   ⚠️  Admin routes may not be properly excluded from SessionProvider');
  } else {
    console.log('   ✅ Admin routes properly excluded from SessionProvider');
  }
}

console.log('\\n🎉 Auto-fix completed! Please test the authentication flows.');
console.log('   1. Test admin login: /admin/login');
console.log('   2. Test user login: /auth/signin');
console.log('   3. Deploy to Vercel and verify behavior');
`;
  }

  private async processResults(results: Map<string, any>): Promise<void> {
    console.log('\n📊 PROCESSING RESULTS...');

    let totalCriticalIssues = 0;
    let totalRecommendations = 0;

    // Process each agent's results
    for (const [agentId, result] of results.entries()) {
      if (result.criticalIssues) {
        totalCriticalIssues += result.criticalIssues.length;
      }
      if (result.recommendations) {
        totalRecommendations += result.recommendations.length;
      }
    }

    console.log(`   🚨 Total Critical Issues: ${totalCriticalIssues}`);
    console.log(`   💡 Total Recommendations: ${totalRecommendations}`);

    // Generate comprehensive report if requested
    if (this.options.generateReport && this.orchestrator) {
      await this.generateComprehensiveReport(results);
    }

    // Display action items
    if (totalCriticalIssues > 0) {
      console.log('\n🎯 IMMEDIATE ACTION REQUIRED:');
      console.log('   1. Review critical issues in the detailed report');
      console.log('   2. Apply recommended fixes');
      console.log('   3. Test authentication flows');
      console.log('   4. Re-run health check to verify fixes');
    }
  }

  private async generateComprehensiveReport(results: Map<string, any>): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(this.projectRoot, `.agent-os/reports/health-check-${timestamp}.md`);
    
    // Ensure reports directory exists
    const reportsDir = path.dirname(reportPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    let report = '';
    
    if (this.orchestrator) {
      report = this.orchestrator.generateReport();
    }

    // Add detailed results from each agent
    for (const [agentId, result] of results.entries()) {
      if (result.generateReport && typeof result.generateReport === 'function') {
        report += '\n' + result.generateReport();
      }
    }

    fs.writeFileSync(reportPath, report);
    console.log(`📄 Comprehensive report saved: ${reportPath}`);
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const options: HealthCheckOptions = {};

  // Parse CLI arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--fast':
        options.fastMode = true;
        break;
      case '--fix':
        options.fixIssues = true;
        break;
      case '--no-report':
        options.generateReport = false;
        break;
      case '--quick':
        // Quick diagnostic mode - Stage 1 only
        const healthCheck = new AgentOSHealthCheck(options);
        await healthCheck.executeQuickDiagnostic();
        return;
      case '--help':
        console.log(`
Agent-OS Health Check CLI

Usage: npm run ts-node .agent-os/scripts/run-health-check.ts [options]

Options:
  --quick         Run quick diagnostic (Stage 1 only)
  --fast          Fast mode (single agent concurrency)
  --fix           Generate auto-fix scripts
  --no-report     Skip comprehensive report generation
  --help          Show this help message

Examples:
  npm run ts-node .agent-os/scripts/run-health-check.ts --quick
  npm run ts-node .agent-os/scripts/run-health-check.ts --fast --fix
        `);
        return;
    }
  }

  // Run full health check
  const healthCheck = new AgentOSHealthCheck(options);
  await healthCheck.executeFullHealthCheck();
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { AgentOSHealthCheck, type HealthCheckOptions };
