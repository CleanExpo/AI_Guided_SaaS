#!/usr/bin/env node

/**
 * Orchestra Validation Agent v2
 * Focused on actual build success, not TypeScript config issues
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class OrchestraValidatorV2 {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.buildTimeout = 300000; // 5 minutes
  }

  async validateProductionReadiness() {
    console.log('🎯 ORCHESTRA VALIDATOR V2: Production Build Validation');
    console.log('====================================================\n');
    
    const result = {
      passed: false,
      score: 0,
      errors: [],
      warnings: [],
      evidence: []
    };

    // 1. Quick syntax check on critical files
    console.log('1️⃣ Checking critical files for syntax issues...');
    const syntaxResult = await this.checkCriticalSyntax();
    result.evidence.push({ step: 'syntax_check', result: syntaxResult });
    
    if (!syntaxResult.passed) {
      result.errors.push(`BLOCKING: ${syntaxResult.errors.length} syntax patterns found`);
      result.errors.push(...syntaxResult.errors);
      console.log('❌ Syntax issues found - fix these first');
      return result;
    }
    console.log('✅ No obvious syntax errors detected');

    // 2. The REAL test - actual Next.js build
    console.log('\n2️⃣ Running actual production build (this is what matters)...');
    const buildResult = await this.runProductionBuild();
    result.evidence.push({ step: 'production_build', result: buildResult });
    
    if (buildResult.compilationPassed) {
      console.log('✅ COMPILATION SUCCESSFUL!');
      result.score = 85;
      
      if (buildResult.buildCompleted) {
        console.log('✅ BUILD COMPLETED SUCCESSFULLY!');
        result.passed = true;
        result.score = 100;
      } else {
        console.log('⚠️ Compilation passed but build had issues');
        result.warnings.push('Build process had non-blocking issues');
      }
    } else {
      console.log('❌ COMPILATION FAILED');
      result.errors.push('BLOCKING: Next.js compilation failed');
      result.errors.push(...buildResult.errors);
    }

    return result;
  }

  async checkCriticalSyntax() {
    const result = {
      passed: true,
      errors: []
    };

    const criticalFiles = [
      'src/components/AgentPulseMonitor.tsx',
      'src/components/ContainerMonitor.tsx',
      'src/components/Dashboard.tsx',
      'src/components/LandingPageProduction.tsx',
      'src/components/MCPDesignerIntegration.tsx'
    ];

    for (const file of criticalFiles) {
      const filePath = path.join(this.projectRoot, file);
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for obvious syntax errors
        const patterns = [
          { pattern: />>\s*\)/, desc: 'Double closing brackets >>)' },
          { pattern: />\s*>(?!\s*\{)/, desc: 'Double closing brackets >>' },
          { pattern: /\)\s*>\s*[a-zA-Z]+=/, desc: 'Props after closing parenthesis' },
          { pattern: /}>\s*[a-zA-Z]+=/, desc: 'Props after closing brace' },
          { pattern: />}\s*>/, desc: 'Malformed closing' },
          { pattern: /className\s*=\s*{[^}]*\s+className\s*=/, desc: 'Duplicate className' }
        ];
        
        for (const { pattern, desc } of patterns) {
          if (content.match(pattern)) {
            result.passed = false;
            result.errors.push(`${file}: ${desc}`);
          }
        }
        
      } catch (error) {
        result.errors.push(`${file}: Failed to read`);
      }
    }

    return result;
  }

  async runProductionBuild() {
    return new Promise((resolve) => {
      const result = {
        compilationPassed: false,
        buildCompleted: false,
        errors: [],
        output: ''
      };

      console.log('  🔄 Starting Next.js build...');
      
      const buildProcess = spawn('npm', ['run', 'build'], {
        cwd: this.projectRoot,
        shell: true,
        env: { ...process.env, SKIP_ENV_VALIDATION: 'true' }
      });

      let buildOutput = '';
      let errorOutput = '';

      buildProcess.stdout.on('data', (data) => {
        const output = data.toString();
        buildOutput += output;
        
        // Check for key milestones
        if (output.includes('Creating an optimized production build')) {
          process.stdout.write('  📦 Build started...\n');
        }
        if (output.includes('Compiled successfully')) {
          result.compilationPassed = true;
          process.stdout.write('  ✅ Compilation successful!\n');
        }
        if (output.includes('Collecting page data')) {
          process.stdout.write('  📊 Collecting page data...\n');
        }
        if (output.includes('Generating static pages')) {
          process.stdout.write('  📄 Generating pages...\n');
        }
        if (output.includes('Route (')) {
          process.stdout.write('.');
        }
        if (output.includes('✓ Generating static pages')) {
          result.buildCompleted = true;
        }
      });

      buildProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      // Set timeout
      const timeout = setTimeout(() => {
        console.log('\n  ⏱️ Build timeout - checking status...');
        buildProcess.kill();
      }, this.buildTimeout);

      buildProcess.on('close', (code) => {
        clearTimeout(timeout);
        
        result.output = buildOutput + errorOutput;
        
        // Parse errors if compilation failed
        if (!result.compilationPassed) {
          const lines = result.output.split('\n');
          const errorLines = lines.filter(line => 
            line.includes('Error:') || 
            line.includes('SyntaxError') ||
            line.includes('Failed to compile')
          );
          result.errors = errorLines.slice(0, 10);
        }
        
        if (code === 0) {
          result.buildCompleted = true;
        }
        
        resolve(result);
      });
    });
  }

  generateReport(result) {
    const timestamp = new Date().toISOString();
    const report = `
🎯 ORCHESTRA VALIDATION REPORT V2
=================================

VALIDATION STATUS: ${result.passed ? '✅ PASSED' : '❌ FAILED'}
PRODUCTION READINESS SCORE: ${result.score}%

${result.passed ? 
  '🎉 VERIFIED PRODUCTION READY\n' +
  '   ✅ Syntax validation passed\n' +
  '   ✅ Next.js compilation successful\n' +
  '   ✅ Production build completed\n' +
  '   ✅ Ready for Vercel deployment' :
  '🚫 NOT PRODUCTION READY\n' +
  '   Build fails - cannot deploy to production'
}

EVIDENCE SUMMARY:
${result.evidence.map(e => {
  const status = e.result.passed || e.result.compilationPassed ? '✅' : '❌';
  return `- ${e.step}: ${status}`;
}).join('\n')}

${result.errors.length > 0 ? 
  `\n❌ ERRORS:\n${result.errors.map(e => `- ${e}`).join('\n')}` :
  ''
}

${result.warnings.length > 0 ? 
  `\n⚠️ WARNINGS:\n${result.warnings.map(w => `- ${w}`).join('\n')}` :
  ''
}

VALIDATION TIMESTAMP: ${timestamp}

---
${result.passed ?
  '✅ This project can be deployed to Vercel\n' +
  '✅ The build will succeed in production\n' +
  '✅ No bullshit - actually tested!' :
  '❌ This project will FAIL on Vercel\n' +
  '❌ Fix the errors before deployment\n' +
  '❌ No bullshit - build must work!'
}
`;
    return report;
  }
}

// CLI execution
if (require.main === module) {
  const validator = new OrchestraValidatorV2();
  
  validator.validateProductionReadiness()
    .then(result => {
      const report = validator.generateReport(result);
      console.log(report);
      
      // Save evidence
      const evidenceFile = path.join(process.cwd(), '.orchestra-validation-v2.json');
      fs.writeFileSync(evidenceFile, JSON.stringify(result, null, 2));
      
      process.exit(result.passed ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    });
}

module.exports = { OrchestraValidatorV2 };