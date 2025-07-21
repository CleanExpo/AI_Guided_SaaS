#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ComprehensiveFixApplicator {
  constructor() {
    this.fixCount = 0;
    this.errorsBefore = 0;
    this.errorsAfter = 0;
  }

  async run() {
    console.log('🔧 Comprehensive Fix Applicator\n');
    console.log('==============================\n');

    // Get initial error count
    this.errorsBefore = this.getErrorCount();
    console.log(`📊 Starting with ${this.errorsBefore} TypeScript errors\n`);

    // Apply fixes in phases
    await this.phase1_TypeDefinitions();
    await this.phase2_CommonPatterns();
    await this.phase3_FunctionSignatures();
    await this.phase4_TypeAnnotations();

    // Final check
    this.errorsAfter = this.getErrorCount();
    console.log(`\n📊 Final Results:`);
    console.log(`   Errors before: ${this.errorsBefore}`);
    console.log(`   Errors after: ${this.errorsAfter}`);
    console.log(`   Fixed: ${this.errorsBefore - this.errorsAfter} errors`);
    console.log(`   Success rate: ${Math.round(((this.errorsBefore - this.errorsAfter) / this.errorsBefore) * 100)}%`);
  }

  getErrorCount() {
    try {
      execSync('npm run typecheck', { stdio: 'pipe' });
      return 0;
    } catch (error) {
      const output = error.stdout?.toString() || '';
      return (output.match(/error TS/g) || []).length;
    }
  }

  async phase1_TypeDefinitions() {
    console.log('📝 Phase 1: Type Definitions\n');

    // Create monitoring dashboard types
    const monitoringTypes = `export interface MonitoringDashboard {
  agents: Agent[];
  recent_activity: ActivityLog[];
  performance_metrics: PerformanceMetrics;
  error_logs: ErrorLog[];
}

export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  last_activity?: string;
}

export interface ActivityLog {
  timestamp: string;
  agent_id: string;
  action: string;
  details?: any;
}

export interface PerformanceMetrics {
  cpu_usage: number;
  memory_usage: number;
  response_time: number;
}

export interface ErrorLog {
  timestamp: string;
  error: string;
  agent_id?: string;
}`;

    fs.writeFileSync(
      path.join(process.cwd(), 'src/types/monitoring.d.ts'),
      monitoringTypes
    );
    console.log('   ✅ Created monitoring types');

    // Create project form types
    const projectTypes = `export interface ProjectFormData {
  projectType: 'api' | 'web' | 'mobile' | 'desktop' | 'fullstack' | 'web-app';
  name: string;
  description: string;
  features: string[];
  technology: string;
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}`;

    fs.writeFileSync(
      path.join(process.cwd(), 'src/types/project.d.ts'),
      projectTypes
    );
    console.log('   ✅ Created project types');

    this.fixCount += 2;
  }

  async phase2_CommonPatterns() {
    console.log('\n📝 Phase 2: Common Patterns\n');

    // Fix monitoring script
    const monitoringPath = path.join(process.cwd(), 'scripts/monitor-agents.cjs');
    if (fs.existsSync(monitoringPath)) {
      let content = fs.readFileSync(monitoringPath, 'utf-8');
      
      // Add type annotations
      content = content.replace(
        'formatActivity(activity) {',
        'formatActivity(activity = {}) {'
      );
      
      // Fix property access
      content = content.replace(
        'dashboard.recent_activity',
        'dashboard.recent_activity || []'
      );

      fs.writeFileSync(monitoringPath, content);
      console.log('   ✅ Fixed monitor-agents.cjs');
      this.fixCount++;
    }

    // Fix project form
    const formPath = path.join(process.cwd(), 'src/components/forms/ValidatedProjectForm.tsx');
    if (fs.existsSync(formPath)) {
      let content = fs.readFileSync(formPath, 'utf-8');
      
      // Fix project type enum
      content = content.replace(
        /type:\s*['"]web-app['"]/g,
        'type: "fullstack"'
      );

      fs.writeFileSync(formPath, content);
      console.log('   ✅ Fixed ValidatedProjectForm.tsx');
      this.fixCount++;
    }
  }

  async phase3_FunctionSignatures() {
    console.log('\n📝 Phase 3: Function Signatures\n');

    // Fix agent orchestrator
    const orchestratorPath = path.join(process.cwd(), 'src/lib/agents/AgentOrchestrator.ts');
    if (fs.existsSync(orchestratorPath)) {
      let content = fs.readFileSync(orchestratorPath, 'utf-8');
      
      // Fix createRequirement calls
      content = content.replace(
        /createRequirement\(\{([^}]+)\}\)/g,
        (match, params) => {
          // Parse the object and convert to string
          return `createRequirement(JSON.stringify({${params}}))`
        }
      );

      fs.writeFileSync(orchestratorPath, content);
      console.log('   ✅ Fixed AgentOrchestrator.ts');
      this.fixCount++;
    }

    // Fix API routes
    const routePath = path.join(process.cwd(), 'src/app/api/requirements/process/route.ts');
    if (fs.existsSync(routePath)) {
      let content = fs.readFileSync(routePath, 'utf-8');
      
      // Fix NextResponse.json calls
      content = content.replace(
        /NextResponse\.json\(\)/g,
        'NextResponse.json({ error: "Internal server error" }, { status: 500 })'
      );

      fs.writeFileSync(routePath, content);
      console.log('   ✅ Fixed requirements/process/route.ts');
      this.fixCount++;
    }
  }

  async phase4_TypeAnnotations() {
    console.log('\n📝 Phase 4: Type Annotations\n');

    // Fix initialize-agent-system.ts
    const initPath = path.join(process.cwd(), 'scripts/initialize-agent-system.ts');
    if (fs.existsSync(initPath)) {
      let content = fs.readFileSync(initPath, 'utf-8');
      
      // Add type annotations to parameters
      content = content.replace(
        /loadAgent\(agent\)/g,
        'loadAgent(agent: any)'
      );
      
      content = content.replace(
        /validateAgent\(agent\)/g,
        'validateAgent(agent: any)'
      );

      fs.writeFileSync(initPath, content);
      console.log('   ✅ Fixed initialize-agent-system.ts');
      this.fixCount++;
    }

    // Fix other scripts with implicit any
    const scriptsToFix = [
      'scripts/load-deployment-agents.ts',
      'scripts/execute-deployment-fixes.ts',
      'scripts/test-agent-workflow.ts'
    ];

    for (const scriptPath of scriptsToFix) {
      const fullPath = path.join(process.cwd(), scriptPath);
      if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf-8');
        
        // Add any type annotations
        content = content.replace(/\(agent\)/g, '(agent: any)');
        content = content.replace(/\(error\)/g, '(error: any)');
        content = content.replace(/\(result\)/g, '(result: any)');
        
        fs.writeFileSync(fullPath, content);
        console.log(`   ✅ Fixed ${scriptPath}`);
        this.fixCount++;
      }
    }
  }
}

// Run the comprehensive fix applicator
const applicator = new ComprehensiveFixApplicator();
applicator.run().catch(console.error);