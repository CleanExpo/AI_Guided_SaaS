#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Common syntax error patterns to fix
const patterns = [
  // Fix semicolon before comma in arrays
  { pattern: /\[;,/g, replacement: '[' },
  { pattern: /,;,/g, replacement: ',' },
  
  // Fix semicolon in object literals
  { pattern: /\({ ;/g, replacement: '({' },
  { pattern: /\{;/g, replacement: '{' },
  { pattern: /\(;/g, replacement: '(' },
  
  // Fix NextResponse.json syntax
  { pattern: /NextResponse\.json\({ ;/g, replacement: 'NextResponse.json({' },
  { pattern: /NextResponse\.json\(;/g, replacement: 'NextResponse.json(' },
  
  // Fix property definitions with semicolons
  { pattern: /: ;/g, replacement: ': ' },
  { pattern: /= ;/g, replacement: '= ' },
  
  // Fix double semicolons
  { pattern: /;;/g, replacement: ';' },
  
  // Fix semicolon after closing brace in wrong places
  { pattern: /\};,/g, replacement: '},' },
  { pattern: /\};(\s*\))/g, replacement: '}$1' },
  
  // Fix return statement issues
  { pattern: /return ;/g, replacement: 'return ' },
  { pattern: /return\s+NextResponse\.json\s*\(\s*;\s*/g, replacement: 'return NextResponse.json(' },
  
  // Fix array and object endings
  { pattern: /,\s*;\s*\]/g, replacement: ']' },
  { pattern: /,\s*;\s*\}/g, replacement: '}' },
  
  // Fix function parameter issues
  { pattern: /\(\s*;\s*/g, replacement: '(' },
  { pattern: /,\s*;\s*\)/g, replacement: ')' },
  
  // Fix template literal issues
  { pattern: /\$\{;\s*/g, replacement: '${' },
  
  // Fix JSX attribute issues
  { pattern: /=\s*;\s*"/g, replacement: '="' },
  { pattern: /=\s*;\s*\{/g, replacement: '={' },
];

// Files to process
const filePatterns = [
  'src/**/*.ts',
  'src/**/*.tsx',
  'app/**/*.ts',
  'app/**/*.tsx',
  'components/**/*.ts',
  'components/**/*.tsx',
  'lib/**/*.ts',
  'lib/**/*.tsx'
];

let totalFixed = 0;
let filesProcessed = 0;

console.log('🔧 Starting TypeScript syntax fix...\n');

filePatterns.forEach(pattern => {
  const files = glob.sync(pattern, { 
    cwd: process.cwd(),
    ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**']
  });

  files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fileFixed = 0;

    // Apply all patterns
    patterns.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        fileFixed += matches.length;
      }
    });

    // Additional complex fixes
    
    // Fix object literal syntax with semicolons
    content = content.replace(/([{,]\s*\n?\s*)(\w+)\s*:\s*;/g, '$1$2: ');
    
    // Fix function calls with semicolons
    content = content.replace(/(\w+)\s*\(\s*;\s*/g, '$1(');
    
    // Fix JSX props
    content = content.replace(/(\w+)=\{;\s*/g, '$1={');
    
    // Fix array destructuring
    content = content.replace(/\[\s*;\s*/g, '[');
    
    // Fix object destructuring  
    content = content.replace(/\{\s*;\s*/g, '{');

    // Remove duplicate closing tags (common in JSX)
    content = content.replace(/(<\/\w+>)\s*\1/g, '$1');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      filesProcessed++;
      totalFixed += fileFixed;
      console.log(`✅ Fixed ${fileFixed} issues in ${file}`);
    }
  });
});

console.log(`\n✨ Complete! Fixed ${totalFixed} syntax issues in ${filesProcessed} files.`);
console.log('\n📊 Next steps:');
console.log('1. Run "npm run typecheck" to see remaining errors');
console.log('2. Run "npm run lint:fix" to fix additional formatting issues');
console.log('3. Check for any remaining manual fixes needed');