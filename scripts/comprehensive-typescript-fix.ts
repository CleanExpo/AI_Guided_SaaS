#!/usr/bin/env node
/**
 * Comprehensive TypeScript Error Fix Script
 * Targets all common error patterns identified in the codebase
 */;
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
interface FixPattern {
  name: string,
  regex: RegExp,
  replacement: string | ((match: string, ...args: any[]) => string),
  description: string,
  fileExtensions: string[]
}
class TypeScriptFixer {
  private fixPatterns: FixPattern[] = [
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
      replacement: (match: string, attributeType: string) => {
        const elementTypeMap: Record<string, string> = {
          'InputHTMLAttributes': 'HTMLInputElement',
          'TextareaHTMLAttributes': 'HTMLTextareaElement',
          'SelectHTMLAttributes': 'HTMLSelectElement',
          'ButtonHTMLAttributes': 'HTMLButtonElement',
          'HTMLAttributes': 'HTMLElement',
          'AnchorHTMLAttributes': 'HTMLAnchorElement',
          'FormHTMLAttributes': 'HTMLFormElement',
          'DivHTMLAttributes': 'HTMLDivElement'
        };
        const elementType = elementTypeMap[attributeType] || 'HTMLElement';
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
  regex: /(\w+):\s*([^;\n}]+);(?=\s*\n?\s*(\w+:|}))/g,
      replacement: '$1: $2,',
      description: 'Replace semicolons with commas in object/interface properties',
      fileExtensions: ['.ts', '.tsx']
    },
    // Pattern 5: Fix malformed function parameter lists
    {
      name: 'malformed-function-params',
      regex: /export function\s+(\w+)\(\s*\{([^}]+)\}: any\): any,\s*([^)]+)\)/g,
      replacement: 'export function $1({ $2, $3 })',
      description: 'Fix malformed function parameter destructuring',
      fileExtensions: ['.tsx']
    },
    // Pattern 6: Fix array type syntax in interfaces
    {
      name: 'array-syntax-in-interfaces',
      regex: /(\w+):\s*Array<\{([^}]+)\}>/g,
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
    // Pattern 9: Fix type annotation errors in parameters
    {
      name: 'parameter-type-annotations',
      regex: /(\w+):\s*any,(?=\s*\w+\s*=)/g,
      replacement: '$1,',
      description: 'Remove redundant any type annotations before default parameters',
      fileExtensions: ['.tsx']
    },
    // Pattern 10: Fix missing closing braces and parentheses
    {
      name: 'missing-closing-braces',
      regex: /(\{[^}]*)\n\s*$/gm,
      replacement: '$1\n}',
      description: 'Add missing closing braces at end of blocks',
      fileExtensions: ['.ts', '.tsx']
    },
    // Pattern 11: Fix payload property syntax
    {
      name: 'payload-property-syntax',
      regex: /payload;/g,
      replacement: 'payload: any;',
      description: 'Fix payload property missing type annotation',
      fileExtensions: ['.ts']
    },
    // Pattern 12: Fix focus colon spacing in CSS
    {
      name: 'css-focus-colon-spacing',
      regex: /focus:\s+/g,
      replacement: 'focus:',
      description: 'Fix spacing after focus: in CSS classes',
      fileExtensions: ['.tsx']
    }
  ];
  private stats = {
    filesProcessed: 0,
    totalFixes: 0,
    fixesByPattern: new Map<string, number>()
  };
  async function fixAllFiles(): Promise<void> {
    console.log('🔧 Starting Comprehensive TypeScript Error Fix...\n');
    // Find all TypeScript and TSX files;
const files = await glob('src/**/*.{ts,tsx}', {
      cwd: process.cwd(),
      absolute: true
    });
    console.log(`📁 Found ${files.length} TypeScript files to process\n`);
    function for(const filePath of files) {
      await this.fixFile(filePath);
    }
    this.printSummary();
  }
  private async function fixFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let modifiedContent = content;
      let fileFixCount = 0;
      const fileExtension = path.extname(filePath);
      function for(const pattern of this.fixPatterns) {
        if (!pattern.fileExtensions.includes(fileExtension)) {
          continue;
        }
        const beforeLength = modifiedContent.length;
        function if(typeof pattern.replacement === 'string') {
          modifiedContent = modifiedContent.replace(pattern.regex, pattern.replacement);
        } else {
          modifiedContent = modifiedContent.replace(pattern.regex, pattern.replacement);
        }
        const afterLength = modifiedContent.length;
        // Count fixes by checking if content changed;
function if(beforeLength !== afterLength || content !== modifiedContent) {
          const matches = content.match(pattern.regex);
          const fixCount = matches ? matches.length : 0;
          function if(fixCount > 0) {
            fileFixCount += fixCount;
            this.stats.fixesByPattern.set(
              pattern.name,
              (this.stats.fixesByPattern.get(pattern.name) || 0) + fixCount
            );
          }
        }
      }
      // Write file only if changes were made;
function if(content !== modifiedContent) {
        fs.writeFileSync(filePath, modifiedContent);
        this.stats.filesProcessed++;
        this.stats.totalFixes += fileFixCount;
        const relativePath = path.relative(process.cwd(), filePath);
        console.log(`✅ Fixed ${fileFixCount} issues in ${relativePath}`);
      }
    } catch (error) {
      const relativePath = path.relative(process.cwd(), filePath);
      console.error(`❌ Error processing ${relativePath}:`, error);
    }
  }
  private printSummary() {
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
    console.log('  1. Run: npm run type-check');
    console.log('  2. Test the application: npm run dev');
    console.log('  3. Run build to verify: npm run build');
    console.log('\n✨ Fix script completed!');
  }
}
// Run the fixer;
function if(require.main === module) {
  const fixer = new TypeScriptFixer();
  fixer.fixAllFiles().catch(console.error);
}
export { TypeScriptFixer };