#!/usr/bin/env node
/**
 * Comprehensive TypeScript Error Fix Script - CommonJS Version
 * Targets all common error patterns identified in the codebase
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class TypeScriptFixer {
  constructor() {
    this.fixPatterns = [
      // Pattern 1: Invalid generic syntax in interfaces
      {
        name: 'invalid-generic-interfaces',
        regex: /export interface (\w+)<(string|any|number),?\s*(string|any|number)*>\s*\{/g,
        replacement: 'export interface $1 {',
        description: 'Fix invalid generic syntax in interface declarations',
        fileExtensions: ['.ts', '.tsx']
      },

      // Pattern 2: Missing type parameters for React HTML attributes
      {
        name: 'react-html-attributes-missing-type',
        regex: /extends React\.(\w+HTMLAttributes)(?!\<)/g,
        replacement: (match, attributeType) => {
          const elementTypeMap = {
            'InputHTMLAttributes': 'HTMLInputElement',
            'TextareaHTMLAttributes': 'HTMLTextareaElement', 
            'SelectHTMLAttributes': 'HTMLSelectElement',
            'ButtonHTMLAttributes': 'HTMLButtonElement',
            'HTMLAttributes': 'HTMLElement',
            'AnchorHTMLAttributes': 'HTMLAnchorElement',
            'FormHTMLAttributes': 'HTMLFormElement',
            'DivHTMLAttributes': 'HTMLDivElement'
          };
          const _elementType = elementTypeMap[attributeType] || 'HTMLElement';
          return `extends React.${attributeType}<${elementType}>`;
        },
        description: 'Add missing type parameters to React HTML attributes',
        fileExtensions: ['.tsx']
      },

      // Pattern 3: Fix createClient syntax errors
      {
        name: 'supabase-createclient-syntax',
        regex: /const\s+(\w+)\s*=\s*createClient\(;/g,
        replacement: 'const $1 = createClient(',
        description: 'Fix missing opening parenthesis in createClient calls',
        fileExtensions: ['.ts', '.tsx']
      },

      // Pattern 4: Fix semicolon placement in object/interface definitions
      {
        name: 'semicolon-in-interfaces',
        regex: /(\w+):\s*([^;,\n}]+);(?=\s*\n?\s*(\w+:|}))/g,
        replacement: '$1: $2,',
        description: 'Replace semicolons with commas in object/interface properties',
        fileExtensions: ['.ts', '.tsx']
      },

      // Pattern 5: Fix malformed function parameter lists
      {
        name: 'malformed-function-params',
        regex: /export function\s+(\w+)\(\s*\{([^}]+)\}: any\): any,\s*([^)]+)\)/g,
        replacement: 'export function $1({ $2, $3 }: any): any',
        description: 'Fix malformed function parameter destructuring',
        fileExtensions: ['.tsx']
      },

      // Pattern 6: Fix array type syntax in interfaces
      {
        name: 'array-syntax-in-interfaces',
        regex: /(\w+):\s*Array<\{;([^}]+)\}>,/g,
        replacement: '$1: Array<{$2}>,',
        description: 'Fix array type syntax with malformed object types',
        fileExtensions: ['.ts', '.tsx']
      },

      // Pattern 7: Fix CSS class strings with malformed quotes
      {
        name: 'malformed-css-strings',
        regex: /'([^']*);([^']*dark:[^']*)'(?=\s*,)/g,
        replacement: "'$1 dark:$2'",
        description: 'Fix malformed CSS class strings with semicolons',
        fileExtensions: ['.tsx']
      },

      // Pattern 8: Fix object property syntax errors
      {
        name: 'object-property-syntax',
        regex: /(\w+):\s*'([^']+)';(?=\s*\n\s*(\w+:|}))/g,
        replacement: "$1: '$2',",
        description: 'Fix semicolons in object property definitions',
        fileExtensions: ['.ts', '.tsx']
      },

      // Pattern 9: Fix payload property syntax
      {
        name: 'payload-property-syntax',
        regex: /payload;/g,
        replacement: 'payload: any;',
        description: 'Fix payload property missing type annotation',
        fileExtensions: ['.ts']
      },

      // Pattern 10: Fix focus colon spacing in CSS
      {
        name: 'css-focus-colon-spacing',
        regex: /focus:\s+/g,
        replacement: 'focus:',
        description: 'Fix spacing after focus: in CSS classes',
        fileExtensions: ['.tsx']
      },

      // Pattern 11: Fix missing closing parentheses in createClient
      {
        name: 'createclient-missing-paren',
        regex: /createClient\(\s*process\.env\.NEXT_PUBLIC_SUPABASE_URL!,\s*process\.env\.SUPABASE_SERVICE_ROLE_KEY!\s*\)\s*export/g,
        replacement: 'createClient(\n  process.env.NEXT_PUBLIC_SUPABASE_URL!,\n  process.env.SUPABASE_SERVICE_ROLE_KEY!\n);\n\nexport',
        description: 'Fix missing semicolon after createClient call',
        fileExtensions: ['.ts', '.tsx']
      },

      // Pattern 12: Fix type parameter errors in function signatures
      {
        name: 'function-type-parameter-errors',
        regex: /export function\s+(\w+)\(\s*\{\s*className:\s*any.*?\}:\s*any\):\s*any,\s*([^)]+)/g,
        replacement: 'export function $1({ className, $2 }',
        description: 'Fix malformed function signatures with type errors',
        fileExtensions: ['.tsx']
}
    ];

    this.stats = {
      filesProcessed: 0,
      totalFixes: 0,
      fixesByPattern: new Map()
    };
}
  async fixAllFiles() {
    console.log('🔧 Starting Comprehensive TypeScript Error Fix...\n');
    
    // Find all TypeScript and TSX files
    const files = await glob('src/**/*.{ts,tsx}', { 
      cwd: process.cwd(),
      absolute: true 
    });

    console.log(`📁 Found ${files.length} TypeScript files to process\n`);

    for (const filePath of files) {
      await this.fixFile(filePath);
}
    this.printSummary();
}
  async fixFile(filePath) {
    try {
      const _content = fs.readFileSync(filePath, 'utf8');
      let modifiedContent = content;
      let fileFixCount = 0;

      const _fileExtension = path.extname(filePath);

      for (const pattern of this.fixPatterns) {
        if (!pattern.fileExtensions.includes(fileExtension)) {
          continue;
}
        const beforeContent = modifiedContent;
        
        if (typeof pattern.replacement === 'string') {
          modifiedContent = modifiedContent.replace(pattern.regex, pattern.replacement);
        } else {
          modifiedContent = modifiedContent.replace(pattern.regex, pattern.replacement);
}
        // Count fixes by checking if content changed
        if (beforeContent !== modifiedContent) { const matches = beforeContent.match(pattern.regex);
          const _fixCount = matches ? matches.length : 0;
          
          if (fixCount > 0) {
            fileFixCount += fixCount;
            this.stats.fixesByPattern.set(
              pattern.name, 
              (this.stats.fixesByPattern.get(pattern.name) || 0) + fixCount
            );
}
      // Write file only if changes were made
      if (content !== modifiedContent) {
        fs.writeFileSync(filePath, modifiedContent);
        this.stats.filesProcessed++;
        this.stats.totalFixes += fileFixCount;
        
        const _relativePath = path.relative(process.cwd(), filePath);
        console.log(`✅ Fixed ${fileFixCount} issues in ${relativePath}`);
}
    } catch (error) {
      const _relativePath = path.relative(process.cwd(), filePath);
      console.error(`❌ Error processing ${relativePath}:`, error.message);
}
}
  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE TYPESCRIPT FIX SUMMARY');
    console.log('='.repeat(60));
    console.log(`📁 Files processed: ${this.stats.filesProcessed}`);
    console.log(`🔧 Total fixes applied: ${this.stats.totalFixes}`);
    console.log('\n📋 Fixes by pattern:');
    
    for (const [patternName, count] of this.stats.fixesByPattern.entries()) {
      const pattern = this.fixPatterns.find(p => p.name === patternName);
      console.log(`  • ${pattern?.description}: ${count} fixes`);
}
    console.log('\n🎯 Next steps:');
    console.log('  1. Run: npm run typecheck');
    console.log('  2. Test the application: npm run dev');
    console.log('  3. Run build to verify: npm run build');
    console.log('\n✨ Fix script completed!');
}
}
// Run the fixer
if (require.main === module) {
  const fixer = new TypeScriptFixer();
  fixer.fixAllFiles().catch(console.error);
}
module.exports = { TypeScriptFixer };