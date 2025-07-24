#!/usr/bin/env node

/**
 * Enhanced Syntax Fixer Agent
 * Fixes complex syntax patterns found in AI Guided SaaS codebase
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

class EnhancedSyntaxFixer {
  constructor() {
    this.stats = {
      filesProcessed: 0,
      filesFixed: 0,
      totalFixes: 0,
      errors: []
    };
    
    this.patterns = {
      // Multi-line string literals
      multilineString: {
        name: 'Multi-line String',
        detect: (lines, index) => {
          const line = lines[index];
          // Check for opening quote without closing
          const openQuotes = (line.match(/(?<!\\)['"`]/g) || []).length;
          if (openQuotes % 2 !== 0) {
            // Look ahead for continuation
            if (index + 1 < lines.length) {
              const nextLine = lines[index + 1];
              return !nextLine.trim().startsWith('//') && !nextLine.trim().startsWith('*');
            }
          }
          return false;
        },
        fix: (lines, index) => {
          const line = lines[index];
          const quote = line.match(/(?<!\\)(['"`])[^'"`]*$/)[1];
          
          // Look for the pattern in blog files
          if (line.includes('image:') && quote === "'") {
            // Find the closing pattern
            let endIndex = index;
            for (let i = index + 1; i < Math.min(index + 5, lines.length); i++) {
              if (lines[i].includes("'}/")) {
                endIndex = i;
                break;
              }
            }
            
            if (endIndex > index) {
              // Reconstruct the image path
              const pathParts = [];
              for (let i = index; i <= endIndex; i++) {
                const part = lines[i].trim();
                if (i === index) {
                  pathParts.push(part.substring(part.indexOf("'") + 1));
                } else if (i === endIndex) {
                  pathParts.push(part.substring(0, part.indexOf("'")));
                } else {
                  pathParts.push(part);
                }
                if (i > index) lines[i] = ''; // Clear the extra lines
              }
              
              const fullPath = '/' + pathParts.filter(p => p).join('/');
              lines[index] = line.substring(0, line.indexOf("'")) + "'" + fullPath + "'";
              return true;
            }
          }
          
          // Default: just close the string
          lines[index] = line + quote;
          return true;
        }
      },
      
      // JSX closing tags
      jsxClosingTag: {
        name: 'JSX Closing Tag',
        detect: (lines, index) => {
          const line = lines[index];
          return /<\s*$/.test(line) || /<\s*\n/.test(line);
        },
        fix: (lines, index) => {
          const line = lines[index];
          const prevLine = index > 0 ? lines[index - 1] : '';
          
          // Extract tag name from previous line
          const tagMatch = prevLine.match(/<(\w+)[^>]*>([^<]*)<\s*$/);
          if (tagMatch) {
            const tagName = tagMatch[1];
            lines[index] = line.replace(/<\s*/, '</' + tagName + '>');
            return true;
          }
          
          // Try to find tag name in current line context
          const currentMatch = line.match(/>([^<]+)<\s*$/);
          if (currentMatch) {
            // Look backwards for opening tag
            for (let i = index - 1; i >= Math.max(0, index - 10); i--) {
              const checkLine = lines[i];
              const openMatch = checkLine.match(/<(\w+)[^/>]*>\s*$/);
              if (openMatch) {
                lines[index] = line.replace(/<\s*/, '</' + openMatch[1] + '>');
                return true;
              }
            }
          }
          
          return false;
        }
      },
      
      // Missing closing braces
      missingBrace: {
        name: 'Missing Brace',
        detect: (lines, index) => {
          const line = lines[index];
          return /^\s*}}/.test(line) && !/[;,]\s*$/.test(lines[index - 1]);
        },
        fix: (lines, index) => {
          const prevIndex = index - 1;
          if (prevIndex >= 0) {
            const prevLine = lines[prevIndex];
            if (!prevLine.trim().endsWith(';') && !prevLine.trim().endsWith(',')) {
              lines[prevIndex] = prevLine.trimEnd() + ';';
              return true;
            }
          }
          return false;
        }
      },
      
      // Missing semicolons
      missingSemicolon: {
        name: 'Missing Semicolon',
        detect: (lines, index) => {
          const line = lines[index];
          const trimmed = line.trim();
          
          // Skip if it's a control structure or already has proper ending
          if (!trimmed || 
              trimmed.endsWith('{') || 
              trimmed.endsWith('}') || 
              trimmed.endsWith(';') || 
              trimmed.endsWith(',') ||
              trimmed.startsWith('//') ||
              trimmed.startsWith('*') ||
              trimmed.startsWith('import') ||
              trimmed.startsWith('export') ||
              trimmed.includes('=>')) {
            return false;
          }
          
          // Check if it's a statement that needs semicolon
          return /^\s*(return|const|let|var|console|await|throw)\s+/.test(line) ||
                 /\)\s*$/.test(trimmed);
        },
        fix: (lines, index) => {
          lines[index] = lines[index].trimEnd() + ';';
          return true;
        }
      },
      
      // Fix incorrect JSX self-closing tags
      jsxSelfClosing: {
        name: 'JSX Self-Closing',
        detect: (lines, index) => {
          const line = lines[index];
          return /<(\w+)\s+[^>]*\s+\/>/.test(line) && />\s*$/.test(line);
        },
        fix: (lines, index) => {
          const line = lines[index];
          lines[index] = line.replace(/\s+\/>/, ' />');
          return true;
        }
      }
    };
  }
  
  async processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      let modified = false;
      let fixCount = 0;
      
      // Multiple passes to catch cascading issues
      for (let pass = 0; pass < 3; pass++) {
        let passModified = false;
        
        for (let i = 0; i < lines.length; i++) {
          for (const [patternKey, pattern] of Object.entries(this.patterns)) {
            if (pattern.detect(lines, i)) {
              if (pattern.fix(lines, i)) {
                passModified = true;
                modified = true;
                fixCount++;
                console.log(`  ✓ Fixed ${pattern.name} at line ${i + 1}`);
              }
            }
          }
        }
        
        if (!passModified) break;
      }
      
      if (modified) {
        fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
        this.stats.filesFixed++;
        this.stats.totalFixes += fixCount;
        console.log(`✅ Fixed ${fixCount} issues in ${path.basename(filePath)}`);
      }
      
      this.stats.filesProcessed++;
      
    } catch (error) {
      this.stats.errors.push({ file: filePath, error: error.message });
      console.error(`❌ Error processing ${filePath}: ${error.message}`);
    }
  }
  
  async run() {
    console.log('🚀 Enhanced Syntax Fixer Starting...\n');
    
    // Process different file patterns
    const patterns = [
      'src/app/**/page.tsx',
      'src/app/**/layout.tsx',
      'src/app/api/**/route.ts',
      'src/components/**/*.tsx',
      'src/lib/**/*.ts',
      'src/services/**/*.ts'
    ];
    
    for (const pattern of patterns) {
      console.log(`\n📁 Processing pattern: ${pattern}`);
      const files = await glob(path.join(PROJECT_ROOT, pattern));
      
      for (const file of files) {
        await this.processFile(file);
      }
    }
    
    // Generate report
    this.generateReport();
  }
  
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 Enhanced Syntax Fixer Report');
    console.log('='.repeat(60));
    console.log(`Files Processed: ${this.stats.filesProcessed}`);
    console.log(`Files Fixed: ${this.stats.filesFixed}`);
    console.log(`Total Fixes Applied: ${this.stats.totalFixes}`);
    console.log(`Errors Encountered: ${this.stats.errors.length}`);
    
    if (this.stats.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.stats.errors.forEach(({ file, error }) => {
        console.log(`  - ${path.basename(file)}: ${error}`);
      });
    }
    
    console.log('\n✅ Syntax fixing complete!');
  }
}

// Run the fixer
const fixer = new EnhancedSyntaxFixer();
fixer.run().catch(console.error);
