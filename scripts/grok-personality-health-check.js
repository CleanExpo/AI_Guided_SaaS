#!/usr/bin/env node

/**
 * Grok 4 Personality Integration Health Check
 * Comprehensive system validation for personality modes
 */

const fs = require('fs');
const path = require('path');

class GrokPersonalityHealthCheck {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      details: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '✓',
      'warn': '⚠',
      'error': '✗',
      'success': '✅'
    }[type] || 'ℹ';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
    
    this.results.details.push({
      timestamp,
      type,
      message
    });
  }

  checkFileExists(filePath, description) {
    const fullPath = path.resolve(filePath);
    if (fs.existsSync(fullPath)) {
      this.log(`${description} exists: ${filePath}`, 'success');
      this.results.passed++;
      return true;
    } else {
      this.log(`${description} missing: ${filePath}`, 'error');
      this.results.failed++;
      return false;
    }
  }

  checkFileContent(filePath, searchTerms, description) {
    try {
      const content = fs.readFileSync(path.resolve(filePath), 'utf8');
      const missingTerms = searchTerms.filter(term => !content.includes(term));
      
      if (missingTerms.length === 0) {
        this.log(`${description} contains all required content`, 'success');
        this.results.passed++;
        return true;
      } else {
        this.log(`${description} missing content: ${missingTerms.join(', ')}`, 'error');
        this.results.failed++;
        return false;
      }
    } catch (error) {
      this.log(`Error reading ${filePath}: ${error.message}`, 'error');
      this.results.failed++;
      return false;
    }
  }

  checkTypeScriptErrors() {
    this.log('Checking TypeScript compilation...', 'info');
    
    try {
      const { execSync } = require('child_process');
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      this.log('TypeScript compilation successful', 'success');
      this.results.passed++;
      return true;
    } catch (error) {
      this.log(`TypeScript errors detected: ${error.message}`, 'error');
      this.results.failed++;
      return false;
    }
  }

  checkESLintErrors() {
    this.log('Checking ESLint compliance...', 'info');
    
    try {
      const { execSync } = require('child_process');
      execSync('npx eslint src/lib/personality-*.ts src/components/ui/tone-switch.tsx --quiet', { stdio: 'pipe' });
      this.log('ESLint checks passed', 'success');
      this.results.passed++;
      return true;
    } catch (error) {
      this.log(`ESLint errors detected in personality files`, 'warn');
      this.results.warnings++;
      return false;
    }
  }

  async runHealthCheck() {
    this.log('🎭 Starting Grok 4 Personality Integration Health Check', 'info');
    this.log('=' * 60, 'info');

    // 1. Check Core Files
    this.log('\n📁 Checking Core Files...', 'info');
    this.checkFileExists('src/lib/personality-engine.ts', 'Personality Engine');
    this.checkFileExists('src/lib/personality-config.ts', 'Personality Configuration');
    this.checkFileExists('src/lib/ai-personality-integration.ts', 'AI Personality Integration');
    this.checkFileExists('src/components/ui/tone-switch.tsx', 'Tone Switch Component');

    // 2. Check Documentation
    this.log('\n📚 Checking Documentation...', 'info');
    this.checkFileExists('docs/personality-modes.md', 'Personality Modes Documentation');
    this.checkFileExists('docs/shadcn-cli-reference.md', 'ShadCN CLI Reference');

    // 3. Check Test Files
    this.log('\n🧪 Checking Test Files...', 'info');
    this.checkFileExists('src/tests/personality-integration.test.ts', 'Personality Integration Tests');

    // 4. Check Content Requirements
    this.log('\n🔍 Checking Content Requirements...', 'info');
    
    // Personality Engine Content
    this.checkFileContent('src/lib/personality-engine.ts', [
      'class PersonalityEngine',
      'grok-4',
      'candid, authentic communication style',
      'transformResponse',
      'generateSystemPrompt'
    ], 'Personality Engine Implementation');

    // AI Integration Content
    this.checkFileContent('src/lib/ai-personality-integration.ts', [
      'class AIPersonalityIntegration',
      'enhancePrompt',
      'processResponse',
      'makeAICall',
      'callAIWithPersonality'
    ], 'AI Integration Implementation');

    // Configuration Content
    this.checkFileContent('src/lib/personality-config.ts', [
      'class PersonalityConfigManager',
      'getRecommendedPersonality',
      'detectContextualPersonality',
      'recordPersonalityUsage'
    ], 'Configuration Manager Implementation');

    // Tone Switch Component
    this.checkFileContent('src/components/ui/tone-switch.tsx', [
      'ToneSwitch',
      'PersonalityMode',
      'onPersonalityChange',
      'Standard',
      'Grok'
    ], 'Tone Switch Component Implementation');

    // 5. Check CLAUDE.md Integration
    this.log('\n📝 Checking CLAUDE.md Integration...', 'info');
    this.checkFileContent('CLAUDE.md', [
      'GROK 4 PERSONALITY INTEGRATION',
      'Personality Engine',
      'Tone Switch UI',
      'Smart Context Detection',
      'Response Transformation'
    ], 'CLAUDE.md Documentation Update');

    // 6. Check Types Integration
    this.log('\n🏷️ Checking Types Integration...', 'info');
    this.checkFileContent('src/types/index.ts', [
      'PersonalityMode',
      'PersonalityCharacteristics',
      'TransformContext'
    ], 'Type Definitions');

    // 7. TypeScript Compilation Check
    this.log('\n🔧 Running TypeScript Compilation Check...', 'info');
    this.checkTypeScriptErrors();

    // 8. ESLint Check
    this.log('\n🔍 Running ESLint Check...', 'info');
    this.checkESLintErrors();

    // 9. Integration Points Check
    this.log('\n🔗 Checking Integration Points...', 'info');
    
    // Check if personality system is properly exported
    const integrationChecks = [
      {
        file: 'src/lib/personality-engine.ts',
        exports: ['PersonalityEngine', 'personalityEngine', 'getAvailablePersonalityModes'],
        description: 'Personality Engine Exports'
      },
      {
        file: 'src/lib/personality-config.ts',
        exports: ['PersonalityConfigManager', 'personalityConfigManager', 'getPersonalityForContext'],
        description: 'Configuration Manager Exports'
      },
      {
        file: 'src/lib/ai-personality-integration.ts',
        exports: ['AIPersonalityIntegration', 'aiPersonalityIntegration', 'callAIWithPersonality'],
        description: 'AI Integration Exports'
      }
    ];

    integrationChecks.forEach(check => {
      this.checkFileContent(check.file, check.exports, check.description);
    });

    // 10. Performance and Memory Check
    this.log('\n⚡ Checking Performance Considerations...', 'info');
    
    // Check for potential memory leaks or performance issues
    const performanceChecks = [
      {
        file: 'src/lib/personality-engine.ts',
        antiPatterns: ['setInterval', 'setTimeout', 'new Date().getTime()'],
        description: 'Personality Engine Performance'
      },
      {
        file: 'src/lib/personality-config.ts',
        antiPatterns: ['setInterval', 'setTimeout'],
        description: 'Configuration Manager Performance'
      }
    ];

    performanceChecks.forEach(check => {
      try {
        const content = fs.readFileSync(path.resolve(check.file), 'utf8');
        const foundIssues = check.antiPatterns.filter(pattern => content.includes(pattern));
        
        if (foundIssues.length === 0) {
          this.log(`${check.description} - No performance issues detected`, 'success');
          this.results.passed++;
        } else {
          this.log(`${check.description} - Potential issues: ${foundIssues.join(', ')}`, 'warn');
          this.results.warnings++;
        }
      } catch (error) {
        this.log(`Error checking ${check.file}: ${error.message}`, 'error');
        this.results.failed++;
      }
    });

    // 11. Security Check
    this.log('\n🔒 Checking Security Considerations...', 'info');
    
    // Check for potential security issues
    const securityChecks = [
      'eval(',
      'Function(',
      'innerHTML =',
      'dangerouslySetInnerHTML',
      'document.write'
    ];

    const filesToCheck = [
      'src/lib/personality-engine.ts',
      'src/lib/personality-config.ts',
      'src/lib/ai-personality-integration.ts',
      'src/components/ui/tone-switch.tsx'
    ];

    let securityIssuesFound = false;
    filesToCheck.forEach(file => {
      try {
        const content = fs.readFileSync(path.resolve(file), 'utf8');
        const foundIssues = securityChecks.filter(pattern => content.includes(pattern));
        
        if (foundIssues.length > 0) {
          this.log(`Security issues in ${file}: ${foundIssues.join(', ')}`, 'error');
          this.results.failed++;
          securityIssuesFound = true;
        }
      } catch (error) {
        // File doesn't exist, already reported earlier
      }
    });

    if (!securityIssuesFound) {
      this.log('No security issues detected', 'success');
      this.results.passed++;
    }

    // Final Results
    this.log('\n' + '=' * 60, 'info');
    this.log('🎭 Grok 4 Personality Integration Health Check Complete', 'info');
    this.log('=' * 60, 'info');
    
    const total = this.results.passed + this.results.failed + this.results.warnings;
    const successRate = ((this.results.passed / total) * 100).toFixed(1);
    
    this.log(`\n📊 Results Summary:`, 'info');
    this.log(`   ✅ Passed: ${this.results.passed}`, 'success');
    this.log(`   ✗ Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'info');
    this.log(`   ⚠ Warnings: ${this.results.warnings}`, this.results.warnings > 0 ? 'warn' : 'info');
    this.log(`   📈 Success Rate: ${successRate}%`, successRate >= 90 ? 'success' : successRate >= 70 ? 'warn' : 'error');

    if (this.results.failed === 0) {
      this.log('\n🎉 All critical checks passed! Grok 4 personality integration is ready.', 'success');
    } else {
      this.log('\n❌ Some critical issues need to be addressed before deployment.', 'error');
    }

    if (this.results.warnings > 0) {
      this.log(`\n⚠️ ${this.results.warnings} warnings detected. Consider reviewing for optimization.`, 'warn');
    }

    // Save detailed report
    const reportPath = 'grok-personality-health-report.json';
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        passed: this.results.passed,
        failed: this.results.failed,
        warnings: this.results.warnings,
        successRate: successRate + '%'
      },
      details: this.results.details
    }, null, 2));

    this.log(`\n📄 Detailed report saved to: ${reportPath}`, 'info');

    return {
      success: this.results.failed === 0,
      summary: {
        passed: this.results.passed,
        failed: this.results.failed,
        warnings: this.results.warnings,
        successRate: successRate + '%'
      }
    };
  }
}

// Run the health check
if (require.main === module) {
  const healthCheck = new GrokPersonalityHealthCheck();
  healthCheck.runHealthCheck()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Health check failed:', error);
      process.exit(1);
    });
}

module.exports = GrokPersonalityHealthCheck;
