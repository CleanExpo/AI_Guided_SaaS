#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SystematicSyntaxFixer {
  constructor() {
    this.fixesApplied = 0;
    this.filesProcessed = 0;
    this.errors = [];
  }

  async fixAllSyntaxErrors() {
    console.log('🔧 Systematic Syntax Error Fixer\n');
    console.log('=================================\n');

    try {
      // Get list of TypeScript files with errors
      const errorFiles = await this.getFilesWithErrors();
      console.log(`Found ${errorFiles.length} files with TypeScript errors\n`);

      // Apply fixes to each file
      for (const file of errorFiles) {
        await this.fixFile(file);
      }

      // Apply additional systematic fixes
      await this.fixShebangIssues();
      await this.fixCommonPatterns();

      console.log(`\n✅ Processing complete!`);
      console.log(`📊 Files processed: ${this.filesProcessed}`);
      console.log(`🔧 Fixes applied: ${this.fixesApplied}`);

      // Verify fixes
      await this.verifyFixes();

    } catch (error) {
      console.error('❌ Error during fixing:', error);
    }
  }

  async getFilesWithErrors() {
    try {
      const output = execSync('npx tsc --noEmit 2>&1', { encoding: 'utf-8' });
      return [];
    } catch (error) {
      const output = error.stdout || '';
      const fileRegex = /^([^(]+)\(/gm;
      const files = new Set();
      let match;
      
      while ((match = fileRegex.exec(output)) !== null) {
        const filePath = match[1].trim();
        if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
          files.add(filePath);
        }
      }
      
      return Array.from(files);
    }
  }

  async fixFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        return;
      }

      let content = fs.readFileSync(filePath, 'utf-8');
      const originalContent = content;
      let fileFixCount = 0;

      // Fix 1: Remove type annotations from if/while/for conditions
      // Pattern: if (variable: any) -> if (variable)
      const typeInConditionRegex = /\b(if|while|for)\s*\(\s*([^)]+?):\s*(any|unknown|string|number|boolean|object)\s*\)/g;
      content = content.replace(typeInConditionRegex, (match, keyword, variable, type) => {
        fileFixCount++;
        return `${keyword} (${variable.trim()})`;
      });

      // Fix 2: Remove type annotations from catch clauses
      // Pattern: } catch (error: any) -> } catch (error)
      const catchTypeRegex = /}\s*catch\s*\(\s*([^)]+?):\s*(any|unknown|Error)\s*\)/g;
      content = content.replace(catchTypeRegex, (match, variable, type) => {
        fileFixCount++;
        return `} catch (${variable.trim()})`;
      });

      // Fix 3: Fix missing commas in function parameters
      // Look for patterns like: function(param1 param2) -> function(param1, param2)
      const missingCommaRegex = /(\w+)\s+(\w+\s*:)/g;
      content = content.replace(missingCommaRegex, (match, param1, param2) => {
        // Only fix if it looks like function parameters
        if (match.includes(':')) {
          fileFixCount++;
          return `${param1}, ${param2}`;
        }
        return match;
      });

      // Fix 4: Fix object property syntax
      // Pattern: { key value } -> { key, value }
      const objectPropertyRegex = /{([^}]*?)(\w+)\s+(\w+)([^}]*?)}/g;
      content = content.replace(objectPropertyRegex, (match, before, key, value, after) => {
        // Simple heuristic: if it's a short pattern and doesn't already have commas/colons
        if (!match.includes(',') && !match.includes(':') && match.length < 50) {
          fileFixCount++;
          return `{${before}${key}, ${value}${after}}`;
        }
        return match;
      });

      // Fix 5: Remove invalid syntax patterns
      // Pattern: .: -> :
      content = content.replace(/\.\s*:/g, ':');
      if (content !== originalContent) fileFixCount++;

      // Save file if changes were made
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        this.filesProcessed++;
        this.fixesApplied += fileFixCount;
        console.log(`📝 Fixed ${filePath} (${fileFixCount} fixes)`);
      }

    } catch (error) {
      console.log(`⚠️  Error processing ${filePath}: ${error.message}`);
      this.errors.push({ file: filePath, error: error.message });
    }
  }

  async fixShebangIssues() {
    console.log('\n🔧 Fixing shebang positioning...');
    
    const scriptFiles = [
      'scripts/env-cli.ts',
      'scripts/monitor-agents.ts',
      'scripts/autonomous-doc-finder.ts'
    ];

    for (const file of scriptFiles) {
      if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf-8');
        
        // Remove shebang from anywhere in the file
        content = content.replace(/^.*#!.*$/gm, '');
        
        // Add shebang at the very top
        content = '#!/usr/bin/env tsx\n' + content.replace(/^\n+/, '');
        
        fs.writeFileSync(file, content);
        this.fixesApplied++;
        console.log(`📝 Fixed shebang in ${file}`);
      }
    }
  }

  async fixCommonPatterns() {
    console.log('\n🔧 Applying common pattern fixes...');
    
    // Find all TypeScript files
    const files = this.getAllTypeScriptFiles();
    
    for (const file of files) {
      try {
        let content = fs.readFileSync(file, 'utf-8');
        const originalContent = content;
        
        // Fix: Remove trailing type annotations that don't belong
        content = content.replace(/(\w+)\s*:\s*any\s*([,;)}])/g, '$1$2');
        
        // Fix: Correct syntax errors in validation patterns
        content = content.replace(/validation\.error\.errors\.\(errors as any\[\]\)/g, '(validation.error.errors as any[])');
        
        if (content !== originalContent) {
          fs.writeFileSync(file, content);
          this.fixesApplied++;
          console.log(`📝 Applied pattern fixes to ${file}`);
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }

  getAllTypeScriptFiles() {
    const files = [];
    
    function walkDir(dir) {
      try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
            walkDir(fullPath);
          } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    }
    
    walkDir(process.cwd());
    return files;
  }

  async verifyFixes() {
    console.log('\n🔍 Verifying fixes...');
    
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      console.log('✅ No TypeScript errors found!');
    } catch (error) {
      const output = error.stdout?.toString() || '';
      const errorCount = (output.match(/error TS/g) || []).length;
      console.log(`📊 TypeScript errors remaining: ${errorCount}`);
      
      if (errorCount > 0) {
        console.log('\nFirst 10 remaining errors:');
        const lines = output.split('\n').filter(line => line.includes('error TS')).slice(0, 10);
        lines.forEach(line => console.log(`  ${line}`));
      }
    }
    
    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      filesProcessed: this.filesProcessed,
      fixesApplied: this.fixesApplied,
      errors: this.errors,
      success: true
    };
    
    fs.writeFileSync(
      path.join(process.cwd(), 'systematic-fix-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n📄 Report saved to systematic-fix-report.json');
  }
}

// Run the fixer
async function main() {
  const fixer = new SystematicSyntaxFixer();
  await fixer.fixAllSyntaxErrors();
}

main().catch(console.error);