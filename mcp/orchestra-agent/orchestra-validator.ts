#!/usr/bin/env node

/**
 * Orchestra Validation Agent
 * Prevents bullshit claims by enforcing actual production readiness validation
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

interface ValidationResult {
  passed: boolean;
  score: number;
  errors: string[];
  warnings: string[];
  evidence: any[];
}

class OrchestraValidator {
  private projectRoot: string;
  private buildTimeout = 300000; // 5 minutes max for build

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * HARD RULE: No production readiness claims without actual build success
   */
  async validateProductionReadiness(): Promise<ValidationResult> {
    console.log('🎯 ORCHESTRA VALIDATOR: Starting comprehensive validation');
    console.log('📋 RULE: No bullshit claims allowed - must pass ALL validations\n');
    
    const result: ValidationResult = {
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
      return result;
    }
    console.log('✅ Production build passed');

    // 3. MANDATORY: Real Data Enforcer MCP validation
    console.log('3️⃣ Running Real Data Enforcer MCP validation...');
    const rdeResult = await this.validateWithRDE();
    result.evidence.push({ step: 'rde', result: rdeResult });
    
    if (!rdeResult.passed) {
      result.errors.push(`BLOCKING: RDE MCP validation failed`);
      result.errors.push(...rdeResult.errors);
      console.log('❌ RDE MCP VALIDATION FAILED');
      // Note: We might allow this to pass with warnings depending on severity
    }

    // 4. Calculate final score and determine pass/fail
    const criticalIssues = result.errors.filter(e => e.includes('BLOCKING')).length;
    
    if (criticalIssues === 0) {
      result.passed = true;
      result.score = this.calculateScore(syntaxResult, buildResult, rdeResult);
      console.log(`\n🎉 VALIDATION PASSED! Score: ${result.score}%`);
    } else {
      result.passed = false;
      result.score = 0;
      console.log(`\n❌ VALIDATION FAILED! ${criticalIssues} blocking issues`);
    }

    return result;
  }

  private async validateSyntax(): Promise<ValidationResult> {
    const result: ValidationResult = {
      passed: false,
      score: 0,
      errors: [],
      warnings: [],
      evidence: []
    };

    try {
      // Use TypeScript compiler for syntax checking
      const tscOutput = execSync('npx tsc --noEmit --skipLibCheck 2>&1', { 
        encoding: 'utf8',
        cwd: this.projectRoot,
        timeout: 60000
      });
      
      // If we get here without error, syntax is clean
      result.passed = true;
      result.score = 100;
      console.log('  ✅ TypeScript syntax validation passed');
      
    } catch (error: any) {
      // Parse TypeScript errors
      const errorOutput = error.stdout || error.message || '';
      const errors = errorOutput.split('\n')
        .filter((line: string) => line.includes('error TS'))
        .slice(0, 50); // Limit to first 50 errors
      
      result.errors = errors;
      result.passed = errors.length === 0;
      result.score = Math.max(0, 100 - (errors.length * 2)); // Penalty per error
      
      console.log(`  ❌ Found ${errors.length} syntax errors`);
      if (errors.length > 0) {
        console.log('  First 5 errors:');
        errors.slice(0, 5).forEach(err => console.log(`    ${err}`));
      }
    }

    return result;
  }

  private async validateBuild(): Promise<ValidationResult> {
    const result: ValidationResult = {
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

    } catch (error: any) {
      const errorOutput = error.stdout || error.message || '';
      
      // Parse build errors
      const buildErrors = errorOutput.split('\n')
        .filter((line: string) => 
          line.includes('Error:') || 
          line.includes('Failed to compile') ||
          line.includes('error TS') ||
          line.includes('Syntax Error')
        )
        .slice(0, 10);

      result.errors = buildErrors.length > 0 ? buildErrors : ['Build failed with unknown error'];
      result.passed = false;
      result.score = 0;
      
      console.log(`  ❌ Build failed with ${buildErrors.length} errors`);
      if (buildErrors.length > 0) {
        console.log('  Build errors:');
        buildErrors.forEach(err => console.log(`    ${err.trim()}`));
      }
    }

    return result;
  }

  private async validateWithRDE(): Promise<ValidationResult> {
    const result: ValidationResult = {
      passed: false,
      score: 0,
      errors: [],
      warnings: [],
      evidence: []
    };

    try {
      // Check if RDE MCP is available
      const rdePath = path.join(this.projectRoot, 'mcp/real-data-enforcer');
      if (!existsSync(rdePath)) {
        result.errors.push('Real Data Enforcer MCP not found');
        return result;
      }

      // Run RDE validation
      const rdeOutput = execSync('node mcp/real-data-enforcer/dist/index.js --validate', {
        encoding: 'utf8',
        cwd: this.projectRoot,
        timeout: 30000
      });

      // Parse RDE results (this would need to match your RDE output format)
      if (rdeOutput.includes('VALIDATION PASSED') || rdeOutput.includes('100% PRODUCTION READY')) {
        result.passed = true;
        result.score = 100;
        console.log('  ✅ RDE MCP validation passed');
      } else {
        result.warnings.push('RDE validation completed with warnings');
        result.score = 75;
        console.log('  ⚠️ RDE validation completed with warnings');
      }

    } catch (error: any) {
      result.errors.push(`RDE MCP validation failed: ${error.message}`);
      result.passed = false;
      result.score = 0;
      console.log('  ❌ RDE MCP validation failed');
    }

    return result;
  }

  private calculateScore(syntax: ValidationResult, build: ValidationResult, rde: ValidationResult): number {
    // Weighted scoring: Build is most critical, then syntax, then RDE
    const buildWeight = 0.6;
    const syntaxWeight = 0.3;
    const rdeWeight = 0.1;

    return Math.round(
      (build.score * buildWeight) +
      (syntax.score * syntaxWeight) +
      (rde.score * rdeWeight)
    );
  }

  /**
   * Generate anti-bullshit report
   */
  generateReport(result: ValidationResult): string {
    const report = `
🎯 ORCHESTRA VALIDATION REPORT
===============================

VALIDATION STATUS: ${result.passed ? '✅ PASSED' : '❌ FAILED'}
PRODUCTION READINESS SCORE: ${result.score}%

${result.passed ? 
  '🎉 VERIFIED PRODUCTION READY - Claims are substantiated by evidence!' :
  '🚫 NOT PRODUCTION READY - Claims would be bullshit without fixes!'
}

EVIDENCE SUMMARY:
${result.evidence.map(e => `- ${e.step}: ${e.result.passed ? '✅' : '❌'} (${e.result.score}%)`).join('\n')}

${result.errors.length > 0 ? 
  `\n❌ BLOCKING ERRORS:\n${result.errors.map(e => `- ${e}`).join('\n')}` :
  ''
}

${result.warnings.length > 0 ? 
  `\n⚠️ WARNINGS:\n${result.warnings.map(w => `- ${w}`).join('\n')}` :
  ''
}

VALIDATION TIMESTAMP: ${new Date().toISOString()}
PROJECT: AI Guided SaaS

---
Generated by Orchestra Validation Agent
No bullshit allowed ✨
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
      
      // Exit with error code if validation failed
      process.exit(result.passed ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Orchestra validation failed:', error);
      process.exit(1);
    });
}

export { OrchestraValidator };