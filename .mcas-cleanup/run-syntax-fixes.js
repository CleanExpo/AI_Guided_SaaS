#!/usr/bin/env node

/**
 * Direct syntax fixing script for Windows compatibility
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

class SyntaxFixer {
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
            // Skip node_modules and .next
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
        console.error(`Error reading directory ${currentDir}:`, error.message);
      }
    };
    
    walk(dir);
    return files;
  }

  fixMultilineStrings(content) {
    let fixed = content;
    let changes = 0;
    
    // Fix image strings broken across lines
    fixed = fixed.replace(/image:\s*'\s*\n\s*images\s*\n\s*([^']+)'\s*\}\s*\/\s*}/g, (match, imagePath) => {
      changes++;
      return `image: '/images/${imagePath.trim()}'`;
    });
    
    // Fix other broken strings
    fixed = fixed.replace(/(['"])\s*\n\s*([^'"]+)\s*\n\s*\1/g, (match, quote, content) => {
      changes++;
      return `${quote}${content.trim()}${quote}`;
    });
    
    return { fixed, changes };
  }

  fixJSXTags(content) {
    let fixed = content;
    let changes = 0;
    
    // Fix broken closing tags like "<\n    TagName>"
    fixed = fixed.replace(/<\s*\n\s*(\w+)\s*>/g, (match, tagName) => {
      changes++;
      return `</${tagName}>`;
    });
    
    // Fix self-closing tags
    fixed = fixed.replace(/<(\w+)([^>]*)\s+\/\s*>/g, (match, tagName, attrs) => {
      changes++;
      return `<${tagName}${attrs} />`;
    });
    
    return { fixed, changes };
  }

  fixMissingSemicolons(content) {
    let fixed = content;
    let changes = 0;
    
    // Add semicolons after return statements
    fixed = fixed.replace(/\breturn\s+([^;{}\n]+)(\s*\n)/g, (match, statement, newline) => {
      if (!statement.trim().endsWith(';')) {
        changes++;
        return `return ${statement.trim()};${newline}`;
      }
      return match;
    });
    
    // Add semicolons after const/let/var declarations
    fixed = fixed.replace(/\b(const|let|var)\s+([^;{}\n]+)(\s*\n)/g, (match, keyword, declaration, newline) => {
      if (!declaration.trim().endsWith(';') && !declaration.includes('=>')) {
        changes++;
        return `${keyword} ${declaration.trim()};${newline}`;
      }
      return match;
    });
    
    return { fixed, changes };
  }

  fixMissingBraces(content) {
    let fixed = content;
    let changes = 0;
    
    // Fix missing closing braces
    fixed = fixed.replace(/\}\s*\n\s*\}\s*\n/g, (match) => {
      const lines = match.split('\n');
      let result = match;
      
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (line === '}}') {
          changes++;
          result = result.replace('}}', '};\n}');
        }
      }
      
      return result;
    });
    
    return { fixed, changes };
  }

  processFile(filePath) {
    try {
      console.log(`Processing: ${path.relative(PROJECT_ROOT, filePath)}`);
      
      let content = fs.readFileSync(filePath, 'utf8');
      let totalChanges = 0;
      
      // Apply fixes
      const multilineResult = this.fixMultilineStrings(content);
      if (multilineResult.changes > 0) {
        content = multilineResult.fixed;
        totalChanges += multilineResult.changes;
        console.log(`  ✓ Fixed ${multilineResult.changes} multiline strings`);
      }
      
      const jsxResult = this.fixJSXTags(content);
      if (jsxResult.changes > 0) {
        content = jsxResult.fixed;
        totalChanges += jsxResult.changes;
        console.log(`  ✓ Fixed ${jsxResult.changes} JSX tags`);
      }
      
      const semicolonResult = this.fixMissingSemicolons(content);
      if (semicolonResult.changes > 0) {
        content = semicolonResult.fixed;
        totalChanges += semicolonResult.changes;
        console.log(`  ✓ Fixed ${semicolonResult.changes} missing semicolons`);
      }
      
      const braceResult = this.fixMissingBraces(content);
      if (braceResult.changes > 0) {
        content = braceResult.fixed;
        totalChanges += braceResult.changes;
        console.log(`  ✓ Fixed ${braceResult.changes} missing braces`);
      }
      
      this.stats.filesProcessed++;
      
      if (totalChanges > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.stats.filesFixed++;
        this.stats.totalFixes += totalChanges;
        console.log(`✅ Total fixes: ${totalChanges}`);
      }
      
    } catch (error) {
      this.stats.errors.push({ file: filePath, error: error.message });
      console.error(`❌ Error: ${error.message}`);
    }
  }

  async run() {
    console.log('🚀 Running Syntax Fixes...\n');
    
    // Find all TypeScript/TSX files
    const srcDir = path.join(PROJECT_ROOT, 'src');
    
    console.log('📁 Finding TypeScript files...');
    const tsFiles = this.findFiles(srcDir, /\.tsx?$/);
    console.log(`Found ${tsFiles.length} files\n`);
    
    // Process each file
    for (const file of tsFiles) {
      this.processFile(file);
    }
    
    // Report
    console.log('\n' + '='.repeat(60));
    console.log('📊 Syntax Fix Report');
    console.log('='.repeat(60));
    console.log(`Files Processed: ${this.stats.filesProcessed}`);
    console.log(`Files Fixed: ${this.stats.filesFixed}`);
    console.log(`Total Fixes Applied: ${this.stats.totalFixes}`);
    console.log(`Errors: ${this.stats.errors.length}`);
    
    if (this.stats.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.stats.errors.forEach(({ file, error }) => {
        console.log(`  - ${path.relative(PROJECT_ROOT, file)}: ${error}`);
      });
    }
    
    // Check current error count
    console.log('\n📊 Checking TypeScript errors...');
    try {
      execSync('npx tsc --noEmit', { cwd: PROJECT_ROOT, stdio: 'pipe' });
      console.log('✅ No TypeScript errors!');
    } catch (error) {
      const output = error.stdout?.toString() || '';
      const errorCount = (output.match(/error TS/g) || []).length;
      console.log(`⚠️ TypeScript errors remaining: ${errorCount}`);
    }
  }
}

// Run the fixer
const fixer = new SyntaxFixer();
fixer.run().catch(console.error);