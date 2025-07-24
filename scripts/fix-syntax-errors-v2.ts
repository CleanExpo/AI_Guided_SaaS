#!/usr/bin/env tsx

/**
 * Enhanced Syntax Error Fixer v2
 * Targets the most common syntax errors with more aggressive fixes
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';

interface FixStats {
  totalFiles: number;
  filesFixed: number;
  totalFixes: number;
  errorsByType: Record<string, number>;
}

class EnhancedSyntaxFixer {
  private stats: FixStats = {
    totalFiles: 0,
    filesFixed: 0,
    totalFixes: 0,
    errorsByType: {}
  };

  async fixAll(): Promise<void> {
    console.log(chalk.blue.bold('\n🔧 Enhanced Syntax Fixer v2\n'));

    const files = await glob('src/**/*.{ts,tsx}', {
      ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**']
    });

    this.stats.totalFiles = files.length;
    console.log(chalk.gray(`Processing ${files.length} files...\n`));

    // Process files sequentially to avoid memory issues
    for (const file of files) {
      await this.processFile(file);
    }

    this.displayResults();
  }

  private async processFile(filePath: string): Promise<void> {
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      const originalContent = content;
      let fixes = 0;

      // Apply all fix strategies
      content = this.fixJSXSyntax(content);
      content = this.fixTypeScriptSyntax(content);
      content = this.fixFunctionSyntax(content);
      content = this.fixImportExportSyntax(content);
      content = this.fixObjectArraySyntax(content);
      content = this.fixControlFlowSyntax(content);
      content = this.fixTemplateLiterals(content);
      content = this.fixAsyncAwaitSyntax(content);
      content = this.fixClassSyntax(content);
      content = this.fixDestructuringSyntax(content);

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        fixes = this.countDifferences(originalContent, content);
        this.stats.filesFixed++;
        this.stats.totalFixes += fixes;
        console.log(chalk.green(`✓ ${path.relative(process.cwd(), filePath)} - ${fixes} fixes`));
      }
    } catch (error) {
      console.error(chalk.red(`✗ Error in ${filePath}: ${error.message}`));
    }
  }

  private fixJSXSyntax(content: string): string {
    // Fix JSX closing tags
    content = content.replace(/<(\w+)([^>]*)>([^<]*)<\/>/g, '<$1$2>$3</$1>');
    
    // Fix self-closing tags
    content = content.replace(/<(\w+)([^/>]*)\/\s*>/g, '<$1$2 />');
    
    // Fix JSX expressions
    content = content.replace(/\{([^}]*)\s*,\s*\}/g, '{$1}');
    
    // Fix JSX attribute syntax
    content = content.replace(/(\w+)\s*=\s*{([^}]+)}/g, '$1={$2}');
    
    // Fix empty JSX expressions
    content = content.replace(/\{\s*\}/g, '{null}');
    
    // Fix JSX fragments
    content = content.replace(/<>\s*<\/>/g, '<></>');
    
    // Fix unclosed JSX elements
    content = content.replace(/<(\w+)([^>]*)>([^<]*?)$/gm, '<$1$2>$3</$1>');

    this.stats.errorsByType['JSX'] = (this.stats.errorsByType['JSX'] || 0) + 1;
    return content;
  }

  private fixTypeScriptSyntax(content: string): string {
    // Fix type annotations
    content = content.replace(/:\s*(\w+)\s*\?/g, '?: $1');
    content = content.replace(/\?\s*:\s*(\w+)/g, '?: $1');
    
    // Fix interface/type declarations
    content = content.replace(/interface\s+(\w+)\s*{([^}]*)}/g, (match, name, body) => {
      const fixedBody = body.replace(/(\w+)\s*:\s*([^,;}\n]+)(?=[,;}]|$)/g, '$1: $2');
      return `interface ${name} {${fixedBody}}`;
    });
    
    // Fix type parameters
    content = content.replace(/<\s*>/g, '<any>');
    content = content.replace(/<\s*,/g, '<any,');
    
    // Fix null/undefined type syntax
    content = content.replace(/:\s*null\s*\|/g, ': null |');
    content = content.replace(/\|\s*null\s*:/g, '| null:');

    this.stats.errorsByType['TypeScript'] = (this.stats.errorsByType['TypeScript'] || 0) + 1;
    return content;
  }

  private fixFunctionSyntax(content: string): string {
    // Fix arrow functions
    content = content.replace(/=>\s*{([^}]*)}([^;])/g, '=> {$1};$2');
    content = content.replace(/\)\s*=>\s*([^{][^;]+)$/gm, ') => $1;');
    
    // Fix function declarations
    content = content.replace(/function\s+(\w+)\s*\(\s*\)\s*{/g, 'function $1() {');
    
    // Fix method syntax in objects/classes
    content = content.replace(/(\w+)\s*\(\s*\)\s*{/g, '$1() {');
    
    // Fix async functions
    content = content.replace(/async\s+\(\s*\)/g, 'async ()');
    content = content.replace(/async\s+function\s+function/g, 'async function');

    this.stats.errorsByType['Function'] = (this.stats.errorsByType['Function'] || 0) + 1;
    return content;
  }

  private fixImportExportSyntax(content: string): string {
    // Fix import statements
    content = content.replace(/import\s*{\s*}/g, 'import');
    content = content.replace(/import\s*{\s*,/g, 'import {');
    content = content.replace(/,\s*}\s*from/g, ' } from');
    
    // Fix export statements
    content = content.replace(/export\s*{\s*}/g, 'export {}');
    content = content.replace(/export\s+default\s+default/g, 'export default');
    
    // Fix module paths
    content = content.replace(/from\s*["']([^"']+)["']\s*$/gm, 'from "$1";');

    this.stats.errorsByType['Import/Export'] = (this.stats.errorsByType['Import/Export'] || 0) + 1;
    return content;
  }

  private fixObjectArraySyntax(content: string): string {
    // Fix object literals
    content = content.replace(/{\s*,/g, '{');
    content = content.replace(/,\s*}/g, ' }');
    content = content.replace(/{\s*(\w+)\s*:\s*([^,}]+)\s*([,}])/g, '{ $1: $2$3');
    
    // Fix array literals
    content = content.replace(/\[\s*,/g, '[');
    content = content.replace(/,\s*\]/g, ' ]');
    
    // Fix trailing commas
    content = content.replace(/,(\s*[}\]])/g, '$1');
    
    // Fix property shorthand
    content = content.replace(/{\s*(\w+)\s*:\s*\1\s*}/g, '{ $1 }');

    this.stats.errorsByType['Object/Array'] = (this.stats.errorsByType['Object/Array'] || 0) + 1;
    return content;
  }

  private fixControlFlowSyntax(content: string): string {
    // Fix if statements
    content = content.replace(/if\s*\(\s*([^)]+)\s*\)\s*([^{])/g, 'if ($1) {$2}');
    
    // Fix for loops
    content = content.replace(/for\s*\(\s*([^;]+);\s*([^;]+);\s*([^)]+)\s*\)/g, 'for ($1; $2; $3)');
    
    // Fix switch statements
    content = content.replace(/case\s+([^:]+)\s*$/gm, 'case $1:');
    content = content.replace(/default\s*$/gm, 'default:');
    
    // Fix try-catch
    content = content.replace(/catch\s*\(\s*\)/g, 'catch');
    content = content.replace(/catch\s+{/g, 'catch {');

    this.stats.errorsByType['Control Flow'] = (this.stats.errorsByType['Control Flow'] || 0) + 1;
    return content;
  }

  private fixTemplateLiterals(content: string): string {
    // Fix unterminated template literals
    const lines = content.split('\n');
    let inTemplate = false;
    let templateStart = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const backticks = (line.match(/`/g) || []).length;
      
      if (!inTemplate && backticks % 2 === 1) {
        inTemplate = true;
        templateStart = i;
      } else if (inTemplate && backticks % 2 === 1) {
        inTemplate = false;
      } else if (inTemplate && i === lines.length - 1) {
        // Unterminated template literal at end of file
        lines[i] += '`';
      }
    }

    this.stats.errorsByType['Template Literals'] = (this.stats.errorsByType['Template Literals'] || 0) + 1;
    return lines.join('\n');
  }

  private fixAsyncAwaitSyntax(content: string): string {
    // Fix async/await syntax
    content = content.replace(/async\s+await/g, 'await');
    content = content.replace(/await\s+async/g, 'async');
    
    // Fix missing await
    content = content.replace(/=\s*(fetch|axios|Promise)/g, '= await $1');
    
    // Fix async function syntax
    content = content.replace(/async\s*:\s*\(/g, 'async (');

    this.stats.errorsByType['Async/Await'] = (this.stats.errorsByType['Async/Await'] || 0) + 1;
    return content;
  }

  private fixClassSyntax(content: string): string {
    // Fix class method syntax
    content = content.replace(/class\s+(\w+)\s*{([^}]*)}/g, (match, className, body) => {
      let fixedBody = body;
      // Fix constructor
      fixedBody = fixedBody.replace(/function\s+constructor/g, 'constructor');
      // Fix method declarations
      fixedBody = fixedBody.replace(/function\s+(\w+)/g, '$1');
      return `class ${className} {${fixedBody}}`;
    });

    this.stats.errorsByType['Class'] = (this.stats.errorsByType['Class'] || 0) + 1;
    return content;
  }

  private fixDestructuringSyntax(content: string): string {
    // Fix object destructuring
    content = content.replace(/const\s*{\s*([^}]*)\s*}\s*:\s*any/g, 'const { $1 }: any');
    content = content.replace(/const\s*{\s*([^}]*)\s*}\s*=\s*{}/g, 'const { $1 } = {}');
    
    // Fix array destructuring
    content = content.replace(/const\s*\[\s*([^\]]*)\s*\]\s*:\s*any/g, 'const [ $1 ]: any');
    
    // Fix parameter destructuring
    content = content.replace(/\({\s*([^}]*)\s*}\s*:\s*any\)/g, '({ $1 }: any)');

    this.stats.errorsByType['Destructuring'] = (this.stats.errorsByType['Destructuring'] || 0) + 1;
    return content;
  }

  private countDifferences(original: string, fixed: string): number {
    const originalLines = original.split('\n');
    const fixedLines = fixed.split('\n');
    let differences = 0;
    
    const maxLines = Math.max(originalLines.length, fixedLines.length);
    for (let i = 0; i < maxLines; i++) {
      if (originalLines[i] !== fixedLines[i]) {
        differences++;
      }
    }
    
    return differences;
  }

  private displayResults(): void {
    console.log(chalk.yellow.bold('\n📊 Fix Results\n'));
    console.log(chalk.white(`Total files: ${this.stats.totalFiles}`));
    console.log(chalk.white(`Files fixed: ${this.stats.filesFixed}`));
    console.log(chalk.white(`Total fixes: ${this.stats.totalFixes}`));
    
    console.log(chalk.yellow.bold('\n🔧 Fixes by Type:\n'));
    Object.entries(this.stats.errorsByType).forEach(([type, count]) => {
      console.log(chalk.white(`${type}: ${count}`));
    });
    
    console.log(chalk.green.bold('\n✅ Next Steps:\n'));
    console.log('1. Run npm run typecheck to verify error reduction');
    console.log('2. Run npm run lint:fix for additional formatting');
    console.log('3. Test the application to ensure fixes didn\'t break functionality');
    console.log('4. Commit changes if satisfied\n');
  }
}

// Run the fixer
async function main() {
  const fixer = new EnhancedSyntaxFixer();
  try {
    await fixer.fixAll();
  } catch (error) {
    console.error(chalk.red('Enhanced fixer failed:'), error);
    process.exit(1);
  }
}

main();