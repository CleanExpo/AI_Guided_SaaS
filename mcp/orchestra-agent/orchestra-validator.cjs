#!/usr/bin/env node

/**
 * Orchestra Validation Agent
 * Prevents bullshit claims by enforcing actual production readiness validation
 */

const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

class OrchestraValidator {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.buildTimeout = 300000; // 5 minutes max for build
  }

  /**
   * HARD RULE: No production readiness claims without actual build success
   */
  async validateProductionReadiness() {
    console.log('🎯 ORCHESTRA VALIDATOR: Starting comprehensive validation');
    console.log('📋 RULE: No bullshit claims allowed - must pass ALL validations\n');
    
    const result = {
      passed: false,
      score: 0,
      errors: [],
      warnings: [],
      evidence: []
    };

    // 1. MANDATORY: Syntax validation (MUST PASS)
    console.log('1️⃣ Running syntax validation (BLOCKING)...');
    const syntaxResult = await this.validateSyntax();
    result.evidence.push({ step: 'syntax', result: syntaxResult });
    
    if (!syntaxResult.passed) {
      result.errors.push(`BLOCKING: ${syntaxResult.errors.length} syntax errors found`);
      result.errors.push(...syntaxResult.errors.slice(0, 10)); // Show first 10
      console.log('❌ SYNTAX VALIDATION FAILED - STOPPING HERE');
      console.log('  Critical syntax errors prevent build:');
      syntaxResult.errors.slice(0, 5).forEach(err => console.log(`    ${err}`));
      return result;
    }
    console.log('✅ Syntax validation passed');

    // 2. MANDATORY: Build test (MUST PASS)
    console.log('2️⃣ Running production build test (BLOCKING)...');
    const buildResult = await this.validateBuild();
    result.evidence.push({ step: 'build', result: buildResult });
    
    if (!buildResult.passed) {
      result.errors.push(`BLOCKING: Build failed - ${buildResult.errors.join(', ')}`);
      console.log('❌ BUILD VALIDATION FAILED - STOPPING HERE');
      console.log('  Build errors:');
      buildResult.errors.slice(0, 5).forEach(err => console.log(`    ${err}`));
      return result;
    }
    console.log('✅ Production build passed');

    // 3. Calculate final score and determine pass/fail
    const criticalIssues = result.errors.filter(e => e.includes('BLOCKING')).length;
    
    if (criticalIssues === 0) {
      result.passed = true;
      result.score = this.calculateScore(syntaxResult, buildResult);
      console.log(`\n🎉 VALIDATION PASSED! Score: ${result.score}%`);
      console.log('✅ Production readiness claims are VERIFIED and substantiated!');
    } else {
      result.passed = false;
      result.score = 0;
      console.log(`\n❌ VALIDATION FAILED! ${criticalIssues} blocking issues`);
      console.log('🚫 Production readiness claims would be BULLSHIT without fixes!');
    }

    return result;
  }

  async validateSyntax() {
    const result = {
      passed: false,
      score: 0,
      errors: [],
      warnings: [],
      evidence: []
    };

    try {
      // Use TypeScript compiler for syntax checking on critical files first
      const criticalFiles = [
        'src/components/AgentPulseMonitor.tsx',
        'src/components/ContainerMonitor.tsx', 
        'src/components/Dashboard.tsx',
        'src/components/LandingPageProduction.tsx',
        'src/components/MCPDesignerIntegration.tsx'
      ];

      console.log('  🔍 Checking critical component files...');
      for (const file of criticalFiles) {
        try {
          execSync(`npx tsc --noEmit --skipLibCheck ${file} 2>&1`, { 
            encoding: 'utf8',
            cwd: this.projectRoot,
            timeout: 10000
          });
          console.log(`    ✅ ${file} - syntax OK`);
        } catch (error) {
          const errorOutput = error.stdout || error.message || '';
          const fileErrors = errorOutput.split('\n')
            .filter(line => line.includes('error TS'))
            .slice(0, 5);
          
          result.errors.push(`${file}: ${fileErrors.length} syntax errors`);
          result.errors.push(...fileErrors);
          console.log(`    ❌ ${file} - ${fileErrors.length} syntax errors`);
        }
      }

      if (result.errors.length === 0) {
        result.passed = true;
        result.score = 100;
        console.log('  ✅ Critical file syntax validation passed');
      } else {
        result.passed = false;
        result.score = 0;
        console.log(`  ❌ Found syntax errors in ${result.errors.length} locations`);
      }
      
    } catch (error) {
      result.errors.push(`Syntax validation failed: ${error.message}`);
      result.passed = false;
      result.score = 0;
    }

    return result;
  }

  async validateBuild() {
    const result = {
      passed: false,
      score: 0,
      errors: [],
      warnings: [],
      evidence: []
    };

    try {
      console.log('  🔄 Starting production build (timeout: 5min)...');
      
      const buildOutput = execSync('npm run build 2>&1', {
        encoding: 'utf8',
        cwd: this.projectRoot,
        timeout: this.buildTimeout
      });

      // Check for build success indicators
      if (buildOutput.includes('✓ Compiled successfully') || 
          buildOutput.includes('Build completed') ||
          (!buildOutput.includes('Failed to compile') && !buildOutput.includes('Error:'))) {
        result.passed = true;
        result.score = 100;
        console.log('  ✅ Production build completed successfully');
      } else {
        result.errors.push('Build completed but with potential issues');
        result.score = 80;
        console.log('  ⚠️ Build completed with warnings');
      }

    } catch (error) {
      const errorOutput = error.stdout || error.message || '';
      
      // Parse build errors
      const buildErrors = errorOutput.split('\n')
        .filter(line => 
          line.includes('Error:') || 
          line.includes('Failed to compile') ||
          line.includes('error TS') ||
          line.includes('Syntax Error') ||
          line.includes('SyntaxError')
        )
        .slice(0, 10);

      result.errors = buildErrors.length > 0 ? buildErrors : ['Build failed with unknown error'];
      result.passed = false;
      result.score = 0;
      
      console.log(`  ❌ Build failed with ${buildErrors.length} errors`);
    }

    return result;
  }

  calculateScore(syntax, build) {
    // Build success is mandatory (60%), syntax cleanliness is critical (40%)
    const buildWeight = 0.6;
    const syntaxWeight = 0.4;

    return Math.round(
      (build.score * buildWeight) +
      (syntax.score * syntaxWeight)
    );
  }

  /**
   * Generate anti-bullshit report
   */
  generateReport(result) {
    const timestamp = new Date().toISOString();
    const report = `
🎯 ORCHESTRA VALIDATION REPORT
===============================

VALIDATION STATUS: ${result.passed ? '✅ PASSED' : '❌ FAILED'}
PRODUCTION READINESS SCORE: ${result.score}%

${result.passed ? 
  '🎉 VERIFIED PRODUCTION READY\n   Claims are substantiated by evidence!\n   Build succeeds, syntax is clean.' :
  '🚫 NOT PRODUCTION READY\n   Claims would be BULLSHIT without fixes!\n   Build fails or critical syntax errors exist.'
}

EVIDENCE SUMMARY:
${result.evidence.map(e => `- ${e.step}: ${e.result.passed ? '✅' : '❌'} (${e.result.score}%)`).join('\n')}

${result.errors.length > 0 ? 
  `\n❌ BLOCKING ERRORS (${result.errors.length}):\n${result.errors.slice(0, 15).map(e => `- ${e}`).join('\n')}${result.errors.length > 15 ? '\n... and more' : ''}` :
  ''
}

${result.warnings.length > 0 ? 
  `\n⚠️ WARNINGS:\n${result.warnings.map(w => `- ${w}`).join('\n')}` :
  ''
}

VALIDATION TIMESTAMP: ${timestamp}
PROJECT: AI Guided SaaS

---
Generated by Orchestra Validation Agent
No bullshit allowed ✨

${!result.passed ? 
  '\n🔧 REQUIRED ACTIONS:\n' +
  '1. Fix all blocking syntax errors\n' +
  '2. Ensure production build succeeds\n' +
  '3. Re-run validation: npm run validate:no-bullshit\n' +
  '4. Only then make production readiness claims\n' :
  '\n🚀 DEPLOYMENT APPROVED:\n' +
  '- Syntax validation passed\n' +
  '- Production build succeeds\n' +
  '- Ready for Vercel deployment\n'
}
`;
    return report;
  }
}

// CLI execution
if (require.main === module) {
  const validator = new OrchestraValidator();
  
  validator.validateProductionReadiness()
    .then(result => {
      const report = validator.generateReport(result);
      console.log(report);
      
      // Write evidence file
      const fs = require('fs');
      const evidenceFile = path.join(process.cwd(), '.orchestra-validation-evidence.json');
      fs.writeFileSync(evidenceFile, JSON.stringify(result, null, 2));
      console.log(`📁 Evidence saved to: ${evidenceFile}`);
      
      // Exit with error code if validation failed
      process.exit(result.passed ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Orchestra validation failed:', error);
      process.exit(1);
    });
}

module.exports = { OrchestraValidator };