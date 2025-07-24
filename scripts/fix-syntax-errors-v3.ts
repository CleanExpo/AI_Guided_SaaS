#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { Project, SyntaxKind, Node, SourceFile } from 'ts-morph';

interface FixResult {
  file: string;
  fixCount: number;
  fixes: string[];
}

class EnhancedSyntaxFixerV3 {
  private project: Project;
  private results: FixResult[] = [];
  private totalFixes = 0;

  constructor() {
    this.project = new Project({
      tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
      skipAddingFilesFromTsConfig: true,
    });
  }

  async fix() {
    console.log('🔧 Enhanced Syntax Fixer v3 - Targeted Pattern Fixes');
    console.log('================================================\n');

    // Target files with the most errors first
    const priorityFiles = [
      'src/components/ui/empty-states.tsx',
      'src/lib/validate-env.ts',
      'src/lib/database.ts',
      'src/components/ide/KiroProjectSetup.tsx',
      'src/components/ProductionShowcasePage.tsx',
      'src/components/LandingPageEnhanced.tsx',
      'src/lib/docs/DynamicDocumentationSystem.ts',
      'src/components/admin/SafeModeHealthCheck.tsx',
      'src/components/admin/AdminPanel.tsx',
      'src/components/ui/icons.tsx'
    ];

    // Add priority files first
    for (const file of priorityFiles) {
      const fullPath = path.join(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        this.project.addSourceFileAtPath(fullPath);
      }
    }

    // Then add all other TypeScript files
    this.project.addSourceFilesAtPaths([
      'src/**/*.{ts,tsx}',
      '!src/**/*.d.ts',
      '!src/**/*.test.{ts,tsx}',
      '!src/**/*.spec.{ts,tsx}',
    ]);

    const sourceFiles = this.project.getSourceFiles();
    console.log(`Found ${sourceFiles.length} files to analyze\n`);

    for (const sourceFile of sourceFiles) {
      await this.fixFile(sourceFile);
    }

    this.printResults();
  }

  private async fixFile(sourceFile: SourceFile) {
    const filePath = sourceFile.getFilePath();
    const relativePath = path.relative(process.cwd(), filePath);
    
    const result: FixResult = {
      file: relativePath,
      fixCount: 0,
      fixes: []
    };

    try {
      // Apply fixes in order of severity and commonality
      this.fixMisplacedSemicolons(sourceFile, result);
      this.fixMalformedConditionals(sourceFile, result);
      this.fixIncorrectPropertySyntax(sourceFile, result);
      this.fixMalformedJSX(sourceFile, result);
      this.fixIncompleteStatements(sourceFile, result);
      this.fixMisplacedKeywords(sourceFile, result);
      this.fixBrokenFunctionDeclarations(sourceFile, result);
      this.fixMalformedObjectLiterals(sourceFile, result);
      this.fixIncorrectTypeAnnotations(sourceFile, result);
      this.fixBrokenImportExports(sourceFile, result);

      if (result.fixCount > 0) {
        await sourceFile.save();
        this.results.push(result);
        this.totalFixes += result.fixCount;
        console.log(`✅ Fixed ${result.fixCount} issues in ${relativePath}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${relativePath}:`, error);
    }
  }

  private fixMisplacedSemicolons(sourceFile: SourceFile, result: FixResult) {
    const text = sourceFile.getText();
    let newText = text;
    let fixCount = 0;

    // Fix semicolons after closing braces in wrong places
    newText = newText.replace(/\}\s*;\s*{/g, '} {');
    if (newText !== text) fixCount++;

    // Fix semicolons in interface property definitions
    newText = newText.replace(/(\w+)\?\s*null\s*:\s*(\w+),/g, '$1?: $2;');
    if (newText !== text) fixCount++;

    // Fix double semicolons
    newText = newText.replace(/;;+/g, ';');
    if (newText !== text) fixCount++;

    // Fix semicolons before closing braces
    newText = newText.replace(/;\s*\}/g, '\n}');
    if (newText !== text) fixCount++;

    if (fixCount > 0) {
      sourceFile.replaceWithText(newText);
      result.fixCount += fixCount;
      result.fixes.push(`Fixed ${fixCount} misplaced semicolons`);
    }
  }

  private fixMalformedConditionals(sourceFile: SourceFile, result: FixResult) {
    const text = sourceFile.getText();
    let newText = text;
    let fixCount = 0;

    // Fix if statements with wrong brace placement
    newText = newText.replace(/if\s*\([^)]+\)\s*\{\s*\}\s*\{/g, (match) => {
      const condition = match.match(/if\s*\(([^)]+)\)/)?.[1] || '';
      fixCount++;
      return `if (${condition}) {`;
    });

    // Fix malformed ternary operators
    newText = newText.replace(/\?\s*null\s*:/g, '?: ');
    if (newText !== text) fixCount++;

    // Fix if-else chains with wrong syntax
    newText = newText.replace(/\}\s*\{\s*else/g, '} else');
    if (newText !== text) fixCount++;

    if (fixCount > 0) {
      sourceFile.replaceWithText(newText);
      result.fixCount += fixCount;
      result.fixes.push(`Fixed ${fixCount} malformed conditionals`);
    }
  }

  private fixIncorrectPropertySyntax(sourceFile: SourceFile, result: FixResult) {
    const text = sourceFile.getText();
    let newText = text;
    let fixCount = 0;

    // Fix property definitions with wrong syntax
    newText = newText.replace(/(\w+)\?\s*null\s*:\s*([^,;]+)([,;])/g, '$1?: $2$3');
    if (newText !== text) fixCount++;

    // Fix const declarations in wrong places
    newText = newText.replace(/const\s+(\w+)\s*=\s*\{([^}]+)\}\s*;/g, (match, name, props) => {
      if (match.includes('const variant=') || match.includes('const size=')) {
        fixCount++;
        return `${name}={${props}}`;
      }
      return match;
    });

    // Fix object property syntax
    newText = newText.replace(/(\w+):\s*{\s*}/g, '$1: {}');
    if (newText !== text) fixCount++;

    if (fixCount > 0) {
      sourceFile.replaceWithText(newText);
      result.fixCount += fixCount;
      result.fixes.push(`Fixed ${fixCount} property syntax issues`);
    }
  }

  private fixMalformedJSX(sourceFile: SourceFile, result: FixResult) {
    if (!sourceFile.getFilePath().endsWith('.tsx')) return;

    const text = sourceFile.getText();
    let newText = text;
    let fixCount = 0;

    // Fix JSX tags with commas
    newText = newText.replace(/<(\w+),\s*/g, '<$1 ');
    if (newText !== text) fixCount++;

    // Fix self-closing tags
    newText = newText.replace(/\/>\s*<\/\w+>/g, '/>');
    if (newText !== text) fixCount++;

    // Fix JSX attributes with wrong syntax
    newText = newText.replace(/(\w+);\s*(\w+)=/g, '$1 $2=');
    if (newText !== text) fixCount++;

    // Fix JSX closing tags
    newText = newText.replace(/<\/(\w+)>\s*;/g, '</$1>');
    if (newText !== text) fixCount++;

    // Fix malformed JSX expressions
    newText = newText.replace(/\{([^}]+)\},/g, '{$1}');
    if (newText !== text) fixCount++;

    if (fixCount > 0) {
      sourceFile.replaceWithText(newText);
      result.fixCount += fixCount;
      result.fixes.push(`Fixed ${fixCount} JSX syntax issues`);
    }
  }

  private fixIncompleteStatements(sourceFile: SourceFile, result: FixResult) {
    const text = sourceFile.getText();
    let newText = text;
    let fixCount = 0;

    // Fix incomplete return statements
    newText = newText.replace(/return:\s*(\w+)/g, 'return $1');
    if (newText !== text) fixCount++;

    // Fix incomplete variable declarations
    newText = newText.replace(/const\s+(\w+)\s*=\s*$/gm, 'const $1 = null;');
    if (newText !== text) fixCount++;

    // Fix statements ending with colons instead of semicolons
    newText = newText.replace(/(\w+):\s*$/gm, '$1;');
    if (newText !== text) fixCount++;

    if (fixCount > 0) {
      sourceFile.replaceWithText(newText);
      result.fixCount += fixCount;
      result.fixes.push(`Fixed ${fixCount} incomplete statements`);
    }
  }

  private fixMisplacedKeywords(sourceFile: SourceFile, result: FixResult) {
    const text = sourceFile.getText();
    let newText = text;
    let fixCount = 0;

    // Fix const in wrong places
    newText = newText.replace(/>\s*const\s+/g, '>\n');
    if (newText !== text) fixCount++;

    // Fix export statements
    newText = newText.replace(/\}\s*,\s*export/g, '}\n\nexport');
    if (newText !== text) fixCount++;

    // Fix import statements
    newText = newText.replace(/;\s*import/g, ';\nimport');
    if (newText !== text) fixCount++;

    if (fixCount > 0) {
      sourceFile.replaceWithText(newText);
      result.fixCount += fixCount;
      result.fixes.push(`Fixed ${fixCount} misplaced keywords`);
    }
  }

  private fixBrokenFunctionDeclarations(sourceFile: SourceFile, result: FixResult) {
    const text = sourceFile.getText();
    let newText = text;
    let fixCount = 0;

    // Fix function parameter syntax
    newText = newText.replace(/\(([^)]+)\),\s*([^)]+)\)/g, '($1, $2)');
    if (newText !== text) fixCount++;

    // Fix arrow function syntax
    newText = newText.replace(/=>\s*{([^}]+)}\s*,/g, '=> {\n$1\n}');
    if (newText !== text) fixCount++;

    // Fix async function declarations
    newText = newText.replace(/async\s+(\w+)\s*\(/g, 'async $1(');
    if (newText !== text) fixCount++;

    if (fixCount > 0) {
      sourceFile.replaceWithText(newText);
      result.fixCount += fixCount;
      result.fixes.push(`Fixed ${fixCount} function declaration issues`);
    }
  }

  private fixMalformedObjectLiterals(sourceFile: SourceFile, result: FixResult) {
    const text = sourceFile.getText();
    let newText = text;
    let fixCount = 0;

    // Fix object literals with wrong syntax
    newText = newText.replace(/\{null\}/g, '{}');
    if (newText !== text) fixCount++;

    // Fix object property separators
    newText = newText.replace(/(\w+):\s*([^,}]+)\s*}/g, '$1: $2 }');
    if (newText !== text) fixCount++;

    // Fix nested object syntax
    newText = newText.replace(/\}\s*}\s*;/g, '}\n};');
    if (newText !== text) fixCount++;

    if (fixCount > 0) {
      sourceFile.replaceWithText(newText);
      result.fixCount += fixCount;
      result.fixes.push(`Fixed ${fixCount} object literal issues`);
    }
  }

  private fixIncorrectTypeAnnotations(sourceFile: SourceFile, result: FixResult) {
    const text = sourceFile.getText();
    let newText = text;
    let fixCount = 0;

    // Fix type annotations with wrong syntax
    newText = newText.replace(/:\s*\{([^}]+)\}</g, ': { $1 }');
    if (newText !== text) fixCount++;

    // Fix generic type syntax
    newText = newText.replace(/<([^>]+)>\s*,/g, '<$1>');
    if (newText !== text) fixCount++;

    // Fix union type syntax
    newText = newText.replace(/\|\s*null\s*:/g, '| null');
    if (newText !== text) fixCount++;

    if (fixCount > 0) {
      sourceFile.replaceWithText(newText);
      result.fixCount += fixCount;
      result.fixes.push(`Fixed ${fixCount} type annotation issues`);
    }
  }

  private fixBrokenImportExports(sourceFile: SourceFile, result: FixResult) {
    const text = sourceFile.getText();
    let newText = text;
    let fixCount = 0;

    // Fix import statements
    newText = newText.replace(/import\s*{([^}]+)}\s*;/g, 'import { $1 }');
    if (newText !== text) fixCount++;

    // Fix export statements
    newText = newText.replace(/export\s*{([^}]+)}\s*;/g, 'export { $1 };');
    if (newText !== text) fixCount++;

    // Fix default exports
    newText = newText.replace(/export\s+default\s+(\w+)\s*,/g, 'export default $1;');
    if (newText !== text) fixCount++;

    if (fixCount > 0) {
      sourceFile.replaceWithText(newText);
      result.fixCount += fixCount;
      result.fixes.push(`Fixed ${fixCount} import/export issues`);
    }
  }

  private printResults() {
    console.log('\n================================================');
    console.log('Enhanced Syntax Fixer v3 - Results');
    console.log('================================================\n');

    if (this.results.length === 0) {
      console.log('No syntax errors found to fix.');
      return;
    }

    // Sort by fix count
    this.results.sort((a, b) => b.fixCount - a.fixCount);

    console.log('Files with fixes:\n');
    this.results.forEach(result => {
      console.log(`📄 ${result.file} (${result.fixCount} fixes)`);
      result.fixes.forEach(fix => console.log(`   - ${fix}`));
    });

    console.log('\n================================================');
    console.log(`Total files processed: ${this.project.getSourceFiles().length}`);
    console.log(`Files with fixes: ${this.results.length}`);
    console.log(`Total fixes applied: ${this.totalFixes}`);
    console.log('================================================\n');

    console.log('Next step: Run "npm run typecheck" to see remaining errors');
  }
}

// Run the fixer
const fixer = new EnhancedSyntaxFixerV3();
fixer.fix().catch(console.error);