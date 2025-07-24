#!/usr/bin/env node

/**
 * Fix remaining syntax errors that the first pass missed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

class RemainingSyntaxFixer {
  constructor() {
    this.stats = {
      filesProcessed: 0,
      filesFixed: 0,
      totalFixes: 0,
      errors: []
    };
  }

  findFiles(dir, pattern) {
    const files = [];
    
    const walk = (currentDir) => {
      try {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
          const fullPath = path.join(currentDir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            if (item !== 'node_modules' && item !== '.next') {
              walk(fullPath);
            }
          } else if (stat.isFile()) {
            if (pattern.test(item)) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        // Ignore errors
      }
    };
    
    walk(dir);
    return files;
  }

  fixArrayDeclarations(content) {
    let fixed = content;
    let changes = 0;
    
    // Fix "const arr = [;" pattern
    fixed = fixed.replace(/^(\s*(?:const|let|var)\s+\w+\s*)=\s*\[;/gm, (match, prefix) => {
      changes++;
      return prefix + '= [';
    });
    
    // Fix "} = {;" pattern
    fixed = fixed.replace(/\}\s*=\s*\{;/g, (match) => {
      changes++;
      return '} = {';
    });
    
    // Fix "return (;" pattern
    fixed = fixed.replace(/\breturn\s*\(;/g, (match) => {
      changes++;
      return 'return (';
    });
    
    // Fix ")) {return (;" pattern
    fixed = fixed.replace(/\)\)\s*\{\s*return\s*\(;/g, (match) => {
      changes++;
      return ')) {\n    return (';
    });
    
    // Fix object/array initialization with semicolon
    fixed = fixed.replace(/^(\s*(?:const|let|var)\s+\w+(?:\s*:\s*[^=]+)?)\s*=\s*([{\[])\s*;/gm, (match, decl, bracket) => {
      changes++;
      return decl + ' = ' + bracket;
    });
    
    return { fixed, changes };
  }

  fixBrokenJSX(content) {
    let fixed = content;
    let changes = 0;
    
    // Fix component returns with semicolon
    fixed = fixed.replace(/export\s+default\s+function\s+\w+\([^)]*\)\s*\{[^}]*return\s*\(;/g, (match) => {
      changes++;
      return match.replace('return (;', 'return (');
    });
    
    // Fix JSX fragments
    fixed = fixed.replace(/<>\s*;/g, (match) => {
      changes++;
      return '<>';
    });
    
    // Fix closing tags with extra characters
    fixed = fixed.replace(/<\/(\w+)>\s*;(?=\s*<)/g, (match, tag) => {
      changes++;
      return `</${tag}>`;
    });
    
    return { fixed, changes };
  }

  fixBrokenImports(content) {
    let fixed = content;
    let changes = 0;
    
    // Fix destructured imports with semicolons
    fixed = fixed.replace(/^(\s*import\s*\{[^}]+\}\s*from\s*['"][^'"]+['"]);/gm, (match) => {
      if (match.includes(';') && match.split(';').length > 2) {
        changes++;
        return match.replace(/;(?=[^;]*;$)/, '');
      }
      return match;
    });
    
    // Fix export statements
    fixed = fixed.replace(/^(\s*export\s+(?:const|let|var|function|class)\s+\w+[^;{]*);(?=\s*[{=])/gm, (match, prefix) => {
      changes++;
      return prefix;
    });
    
    return { fixed, changes };
  }

  fixMiscSyntax(content) {
    let fixed = content;
    let changes = 0;
    
    // Fix double closing braces without semicolon
    fixed = fixed.replace(/\}\s*\n\s*\}\s*$/gm, (match) => {
      if (!match.includes(';')) {
        changes++;
        return match.replace(/\}(\s*\n\s*)\}/, '};$1}');
      }
      return match;
    });
    
    // Fix arrow functions with semicolons in wrong places
    fixed = fixed.replace(/=>\s*;/g, (match) => {
      changes++;
      return '=> ';
    });
    
    // Fix property declarations
    fixed = fixed.replace(/^(\s*\w+\s*:\s*[^,;]+),\s*;/gm, (match, prop) => {
      changes++;
      return prop + ',';
    });
    
    return { fixed, changes };
  }

  processFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let totalChanges = 0;
      
      // Apply fixes
      const arrayResult = this.fixArrayDeclarations(content);
      if (arrayResult.changes > 0) {
        content = arrayResult.fixed;
        totalChanges += arrayResult.changes;
      }
      
      const jsxResult = this.fixBrokenJSX(content);
      if (jsxResult.changes > 0) {
        content = jsxResult.fixed;
        totalChanges += jsxResult.changes;
      }
      
      const importResult = this.fixBrokenImports(content);
      if (importResult.changes > 0) {
        content = importResult.fixed;
        totalChanges += importResult.changes;
      }
      
      const miscResult = this.fixMiscSyntax(content);
      if (miscResult.changes > 0) {
        content = miscResult.fixed;
        totalChanges += miscResult.changes;
      }
      
      this.stats.filesProcessed++;
      
      if (totalChanges > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.stats.filesFixed++;
        this.stats.totalFixes += totalChanges;
        console.log(`✅ Fixed ${totalChanges} issues in ${path.relative(PROJECT_ROOT, filePath)}`);
      }
      
    } catch (error) {
      this.stats.errors.push({ file: filePath, error: error.message });
    }
  }

  async run() {
    console.log('🚀 Fixing Remaining Syntax Errors...\n');
    
    // Get current error count
    let initialErrors = 0;
    try {
      execSync('npx tsc --noEmit', { cwd: PROJECT_ROOT, stdio: 'pipe' });
    } catch (error) {
      const output = error.stdout?.toString() || '';
      initialErrors = (output.match(/error TS/g) || []).length;
    }
    
    console.log(`📊 Initial TypeScript errors: ${initialErrors}\n`);
    
    // Find all TypeScript/TSX files
    const srcDir = path.join(PROJECT_ROOT, 'src');
    const tsFiles = this.findFiles(srcDir, /\.tsx?$/);
    
    // Process each file
    for (const file of tsFiles) {
      this.processFile(file);
    }
    
    // Report
    console.log('\n' + '='.repeat(60));
    console.log('📊 Remaining Syntax Fix Report');
    console.log('='.repeat(60));
    console.log(`Files Processed: ${this.stats.filesProcessed}`);
    console.log(`Files Fixed: ${this.stats.filesFixed}`);
    console.log(`Total Fixes Applied: ${this.stats.totalFixes}`);
    
    // Check final error count
    let finalErrors = 0;
    try {
      execSync('npx tsc --noEmit', { cwd: PROJECT_ROOT, stdio: 'pipe' });
      console.log('\n✅ No TypeScript errors!');
    } catch (error) {
      const output = error.stdout?.toString() || '';
      finalErrors = (output.match(/error TS/g) || []).length;
      console.log(`\n⚠️ TypeScript errors remaining: ${finalErrors}`);
      console.log(`📉 Errors reduced by: ${initialErrors - finalErrors}`);
    }
  }
}

// Run the fixer
const fixer = new RemainingSyntaxFixer();
fixer.run().catch(console.error);