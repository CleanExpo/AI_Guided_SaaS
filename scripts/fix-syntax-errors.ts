#!/usr/bin/env tsx

/**
 * Automated Syntax Error Fixer
 * Fixes common TypeScript syntax errors in the codebase
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';

interface FixResult {
  file: string;
  fixCount: number;
  errors: string[];
}

class SyntaxErrorFixer {
  private totalFixed = 0;
  private filesFixed = 0;
  private errors: string[] = [];

  async fixAll(): Promise<void> {
    console.log(chalk.blue.bold('\n🔧 Starting Automated Syntax Fixes...\n'));

    // Get all TypeScript files
    const files = await glob('src/**/*.{ts,tsx}', {
      ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**']
    });

    console.log(chalk.gray(`Found ${files.length} TypeScript files to check\n`));

    // Process files in batches to avoid memory issues
    const batchSize = 50;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      await Promise.all(batch.map(file => this.fixFile(file)));
      
      // Progress update
      const progress = Math.min(i + batchSize, files.length);
      console.log(chalk.gray(`Progress: ${progress}/${files.length} files processed`));
    }

    this.displaySummary();
  }

  private async fixFile(filePath: string): Promise<void> {
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      const originalContent = content;
      let fixCount = 0;

      // Fix TS1005: Missing semicolons
      content = this.fixMissingSemicolons(content);
      
      // Fix TS1128: Declaration or statement expected
      content = this.fixDeclarationErrors(content);
      
      // Fix TS1109: Expression expected
      content = this.fixExpressionErrors(content);
      
      // Fix TS1003: Identifier expected
      content = this.fixIdentifierErrors(content);
      
      // Fix TS1434: Unexpected keyword or identifier
      content = this.fixUnexpectedKeywords(content);

      // Only write if changes were made
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        this.filesFixed++;
        
        // Count actual fixes
        fixCount = this.countChanges(originalContent, content);
        this.totalFixed += fixCount;
        
        console.log(chalk.green(`✓ ${path.relative(process.cwd(), filePath)} - ${fixCount} fixes`));
      }
    } catch (error) {
      this.errors.push(`Error processing ${filePath}: ${error.message}`);
    }
  }

  private fixMissingSemicolons(content: string): string {
    // Fix missing semicolons after statements
    content = content.replace(/^(\s*(?:const|let|var|return|throw|break|continue)\s+[^;{}\n]+)$/gm, '$1;');
    
    // Fix missing semicolons after method calls
    content = content.replace(/^(\s*[a-zA-Z_$][\w$]*\([^)]*\))$/gm, '$1;');
    
    // Fix missing semicolons after property assignments
    content = content.replace(/^(\s*[a-zA-Z_$][\w$]*\s*=\s*[^;{}\n]+)$/gm, '$1;');
    
    return content;
  }

  private fixDeclarationErrors(content: string): string {
    // Fix invalid constructor syntax
    content = content.replace(/function\s+constructor\s*\(/g, 'constructor(');
    
    // Fix incorrect const declarations
    content = content.replace(/const:\s*(\w+)/g, 'const $1');
    
    // Fix class method syntax
    content = content.replace(/^(\s*)function\s+(\w+)\s*\(/gm, '$1$2(');
    
    // Fix async method syntax in classes
    content = content.replace(/^(\s*)async\s+function\s+(\w+)\s*\(/gm, '$1async $2(');
    
    return content;
  }

  private fixExpressionErrors(content: string): string {
    // Fix empty expressions in conditionals
    content = content.replace(/if\s*\(\s*\)/g, 'if (true)');
    content = content.replace(/while\s*\(\s*\)/g, 'while (true)');
    
    // Fix incomplete ternary operators
    content = content.replace(/\?\s*:/g, '? null :');
    content = content.replace(/\?\s*([^:]+)\s*:$/gm, '? $1 : null');
    
    // Fix empty array/object destructuring
    content = content.replace(/const\s*\{\s*\}\s*=/g, 'const {} =');
    content = content.replace(/const\s*\[\s*\]\s*=/g, 'const [] =');
    
    return content;
  }

  private fixIdentifierErrors(content: string): string {
    // Fix missing identifiers in imports
    content = content.replace(/import\s*{\s*,\s*/g, 'import { ');
    content = content.replace(/,\s*,/g, ',');
    
    // Fix trailing commas in destructuring
    content = content.replace(/,\s*}/g, ' }');
    content = content.replace(/,\s*\]/g, ' ]');
    
    // Fix double commas
    content = content.replace(/,,+/g, ',');
    
    return content;
  }

  private fixUnexpectedKeywords(content: string): string {
    // Fix duplicate export keywords
    content = content.replace(/export\s+export/g, 'export');
    
    // Fix invalid async positions
    content = content.replace(/async\s+async/g, 'async');
    
    // Fix duplicate const/let/var
    content = content.replace(/const\s+const/g, 'const');
    content = content.replace(/let\s+let/g, 'let');
    content = content.replace(/var\s+var/g, 'var');
    
    // Fix invalid static positions
    content = content.replace(/static\s+static/g, 'static');
    
    return content;
  }

  private countChanges(original: string, fixed: string): number {
    // Simple line-based diff count
    const originalLines = original.split('\n');
    const fixedLines = fixed.split('\n');
    let changes = 0;
    
    for (let i = 0; i < Math.max(originalLines.length, fixedLines.length); i++) {
      if (originalLines[i] !== fixedLines[i]) {
        changes++;
      }
    }
    
    return changes;
  }

  private displaySummary(): void {
    console.log(chalk.yellow.bold('\n📊 Fix Summary\n'));
    console.log(chalk.white(`Files processed: ${this.filesFixed}`));
    console.log(chalk.white(`Total fixes applied: ${this.totalFixed}`));
    
    if (this.errors.length > 0) {
      console.log(chalk.red.bold('\n❌ Errors encountered:\n'));
      this.errors.slice(0, 10).forEach(error => {
        console.log(chalk.red(`  - ${error}`));
      });
      if (this.errors.length > 10) {
        console.log(chalk.red(`  ... and ${this.errors.length - 10} more`));
      }
    }
    
    console.log(chalk.green.bold('\n✅ Next steps:\n'));
    console.log('1. Run npm run typecheck to verify fixes');
    console.log('2. Run npm run lint:fix for additional formatting');
    console.log('3. Review changes with git diff');
    console.log('4. Commit fixes before proceeding\n');
  }
}

// Run fixer
async function main() {
  const fixer = new SyntaxErrorFixer();
  try {
    await fixer.fixAll();
  } catch (error) {
    console.error(chalk.red('Fix process failed:'), error);
    process.exit(1);
  }
}

main();