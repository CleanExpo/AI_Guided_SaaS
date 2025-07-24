#!/usr/bin/env node

/**
 * MCAS Syntax Specialist Agent Deployer
 * 
 * Purpose: Deploy specialized agent to fix fundamental syntax errors
 * that are blocking TypeScript compilation and automated fixes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

class SyntaxSpecialistDeployer {
  constructor() {
    this.errorPatterns = {
      unterminatedString: /Unterminated string literal/,
      missingBracket: /Expected ['}\])']/,
      unexpectedToken: /Unexpected token/,
      invalidJSX: /<\/[^>]+>(?![\s\S]*<[^>]+>)/,
      malformedImport: /import\s+[^;]+(?!;)$/m,
      brokenExport: /export\s+(?:default\s+)?[^;{]+(?!;|})/m
    };
    
    this.criticalFiles = [
      'src/app/blog/[id]/page.tsx',
      'src/app/blog/page.tsx',
      'src/lib/breadcrumb/breadcrumb-agent.ts',
      'src/lib/agents/AgentOrchestrator.ts',
      'src/lib/admin-auth.ts'
    ];
  }

  async deploy() {
    console.log('🚀 Deploying MCAS Syntax Specialist Agent...\n');
    
    try {
      // Step 1: Analyze syntax errors
      const syntaxErrors = await this.analyzeSyntaxErrors();
      console.log(`📊 Found ${syntaxErrors.length} files with syntax errors\n`);
      
      // Step 2: Create fix strategy
      const fixStrategy = this.createFixStrategy(syntaxErrors);
      console.log(`📋 Created fix strategy for ${fixStrategy.length} files\n`);
      
      // Step 3: Apply syntax fixes
      const results = await this.applySyntaxFixes(fixStrategy);
      console.log(`✅ Applied fixes to ${results.fixed} files\n`);
      
      // Step 4: Validate fixes
      const validation = await this.validateFixes();
      console.log(`🔍 Validation: ${validation.passed ? 'PASSED' : 'FAILED'}\n`);
      
      // Step 5: Generate report
      await this.generateReport(results, validation);
      
      return results;
    } catch (error) {
      console.error('❌ Syntax specialist deployment failed:', error);
      throw error;
    }
  }

  async analyzeSyntaxErrors() {
    console.log('🔍 Analyzing syntax errors...');
    const errors = [];
    
    // Run TypeScript compiler to get fresh error list
    try {
      execSync('npx tsc --noEmit', { 
        cwd: PROJECT_ROOT,
        stdio: 'pipe'
      });
    } catch (error) {
      const output = error.stdout?.toString() || '';
      const lines = output.split('\n');
      
      for (const line of lines) {
        // Parse TypeScript error format: file.ts(line,col): error TS1234: message
        const match = line.match(/^(.+?)\((\d+),(\d+)\): error (TS\d+): (.+)$/);
        if (match) {
          const [, file, line, col, code, message] = match;
          
          // Check if it's a syntax error
          if (this.isSyntaxError(code, message)) {
            errors.push({
              file: path.resolve(PROJECT_ROOT, file),
              line: parseInt(line),
              col: parseInt(col),
              code,
              message,
              type: this.categorizeError(code, message)
            });
          }
        }
      }
    }
    
    return errors;
  }

  isSyntaxError(code, message) {
    const syntaxCodes = ['TS1002', 'TS1003', 'TS1005', 'TS1009', 'TS1010', 'TS1128', 'TS1161'];
    return syntaxCodes.includes(code) || 
           message.includes('Unterminated') ||
           message.includes('Expected') ||
           message.includes('Unexpected token');
  }

  categorizeError(code, message) {
    if (message.includes('Unterminated string')) return 'unterminated_string';
    if (message.includes('Expected')) return 'missing_token';
    if (message.includes('Unexpected token')) return 'unexpected_token';
    if (message.includes('JSX')) return 'jsx_error';
    return 'syntax_error';
  }

  createFixStrategy(errors) {
    const strategy = [];
    const fileGroups = {};
    
    // Group errors by file
    for (const error of errors) {
      if (!fileGroups[error.file]) {
        fileGroups[error.file] = [];
      }
      fileGroups[error.file].push(error);
    }
    
    // Create fix strategy for each file
    for (const [file, fileErrors] of Object.entries(fileGroups)) {
      strategy.push({
        file,
        errors: fileErrors,
        fixes: this.determineFixes(fileErrors),
        priority: this.criticalFiles.includes(path.relative(PROJECT_ROOT, file)) ? 'high' : 'normal'
      });
    }
    
    // Sort by priority
    strategy.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return b.errors.length - a.errors.length;
    });
    
    return strategy;
  }

  determineFixes(errors) {
    const fixes = [];
    
    for (const error of errors) {
      switch (error.type) {
        case 'unterminated_string':
          fixes.push({
            type: 'close_string',
            line: error.line,
            col: error.col,
            action: 'add_quote'
          });
          break;
          
        case 'missing_token':
          const token = this.extractExpectedToken(error.message);
          fixes.push({
            type: 'add_token',
            line: error.line,
            col: error.col,
            token,
            action: 'insert'
          });
          break;
          
        case 'jsx_error':
          fixes.push({
            type: 'fix_jsx',
            line: error.line,
            col: error.col,
            action: 'balance_tags'
          });
          break;
          
        default:
          fixes.push({
            type: 'generic',
            line: error.line,
            col: error.col,
            action: 'review'
          });
      }
    }
    
    return fixes;
  }

  extractExpectedToken(message) {
    const match = message.match(/Expected '([^']+)'/);
    return match ? match[1] : '}';
  }

  async applySyntaxFixes(strategy) {
    const results = {
      total: strategy.length,
      fixed: 0,
      failed: 0,
      changes: []
    };
    
    for (const fileStrategy of strategy) {
      try {
        console.log(`🔧 Fixing ${path.basename(fileStrategy.file)}...`);
        const fixed = await this.fixFile(fileStrategy);
        
        if (fixed) {
          results.fixed++;
          results.changes.push({
            file: fileStrategy.file,
            fixes: fixed.length,
            type: fileStrategy.priority
          });
        }
      } catch (error) {
        console.error(`❌ Failed to fix ${fileStrategy.file}:`, error.message);
        results.failed++;
      }
    }
    
    return results;
  }

  async fixFile(fileStrategy) {
    const { file, fixes } = fileStrategy;
    
    if (!fs.existsSync(file)) {
      throw new Error(`File not found: ${file}`);
    }
    
    let content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    const appliedFixes = [];
    
    // Sort fixes by line number (descending) to avoid offset issues
    fixes.sort((a, b) => b.line - a.line);
    
    for (const fix of fixes) {
      try {
        const lineIndex = fix.line - 1;
        if (lineIndex >= 0 && lineIndex < lines.length) {
          const originalLine = lines[lineIndex];
          let fixedLine = originalLine;
          
          switch (fix.type) {
            case 'close_string':
              // Find unclosed string and close it
              fixedLine = this.closeUnclosedString(originalLine);
              break;
              
            case 'add_token':
              // Add missing token
              fixedLine = this.insertToken(originalLine, fix.col, fix.token);
              break;
              
            case 'fix_jsx':
              // Balance JSX tags
              fixedLine = this.balanceJSXTags(originalLine);
              break;
          }
          
          if (fixedLine !== originalLine) {
            lines[lineIndex] = fixedLine;
            appliedFixes.push(fix);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Could not apply fix at line ${fix.line}:`, error.message);
      }
    }
    
    if (appliedFixes.length > 0) {
      // Write fixed content back
      const fixedContent = lines.join('\n');
      fs.writeFileSync(file, fixedContent, 'utf8');
      return appliedFixes;
    }
    
    return null;
  }

  closeUnclosedString(line) {
    // Detect unclosed strings and close them
    const singleQuoteCount = (line.match(/'/g) || []).length;
    const doubleQuoteCount = (line.match(/"/g) || []).length;
    const backtickCount = (line.match(/`/g) || []).length;
    
    if (singleQuoteCount % 2 !== 0) {
      return line + "'";
    }
    if (doubleQuoteCount % 2 !== 0) {
      return line + '"';
    }
    if (backtickCount % 2 !== 0) {
      return line + '`';
    }
    
    return line;
  }

  insertToken(line, col, token) {
    // Insert missing token at specified column
    if (col <= line.length) {
      return line.slice(0, col - 1) + token + line.slice(col - 1);
    }
    return line + token;
  }

  balanceJSXTags(line) {
    // Simple JSX tag balancing
    const openTags = line.match(/<(\w+)[^>]*>/g) || [];
    const closeTags = line.match(/<\/(\w+)>/g) || [];
    
    // Count unmatched tags
    const tagCounts = {};
    
    openTags.forEach(tag => {
      const tagName = tag.match(/<(\w+)/)[1];
      tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
    });
    
    closeTags.forEach(tag => {
      const tagName = tag.match(/<\/(\w+)>/)[1];
      tagCounts[tagName] = (tagCounts[tagName] || 0) - 1;
    });
    
    // Add missing closing tags
    let fixedLine = line;
    for (const [tagName, count] of Object.entries(tagCounts)) {
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          fixedLine += `</${tagName}>`;
        }
      }
    }
    
    return fixedLine;
  }

  async validateFixes() {
    console.log('🔍 Validating syntax fixes...');
    
    try {
      // Run TypeScript compiler again
      execSync('npx tsc --noEmit', { 
        cwd: PROJECT_ROOT,
        stdio: 'pipe'
      });
      
      return {
        passed: true,
        remainingErrors: 0
      };
    } catch (error) {
      const output = error.stdout?.toString() || '';
      const errorCount = (output.match(/error TS/g) || []).length;
      
      return {
        passed: false,
        remainingErrors: errorCount
      };
    }
  }

  async generateReport(results, validation) {
    const report = {
      timestamp: new Date().toISOString(),
      phase: 'MCAS Syntax Cleanup',
      results: {
        filesProcessed: results.total,
        filesFixed: results.fixed,
        filesFailed: results.failed,
        totalFixes: results.changes.reduce((sum, c) => sum + c.fixes, 0)
      },
      validation: validation,
      changes: results.changes,
      nextSteps: validation.passed ? 
        ['Run import resolution phase', 'Deploy type safety agents'] :
        ['Manual review required for remaining syntax errors', 'Re-run syntax specialist']
    };
    
    const reportPath = path.join(__dirname, 'syntax-specialist-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📄 Report saved to: ${reportPath}`);
    console.log('\n📊 Summary:');
    console.log(`   - Files processed: ${report.results.filesProcessed}`);
    console.log(`   - Files fixed: ${report.results.filesFixed}`);
    console.log(`   - Total fixes applied: ${report.results.totalFixes}`);
    console.log(`   - Remaining errors: ${validation.remainingErrors || 'Unknown'}`);
  }
}

// Execute deployment
const deployer = new SyntaxSpecialistDeployer();
deployer.deploy()
  .then(() => {
    console.log('\n✅ Syntax specialist deployment complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  });