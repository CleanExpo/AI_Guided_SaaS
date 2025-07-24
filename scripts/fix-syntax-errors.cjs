#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Starting Syntax Error Auto-Fix...\n');

let totalFiles = 0;
let totalFixes = 0;
const fixPatterns = new Map();

// Common syntax error patterns to fix
const syntaxFixes = [
  // Fix semicolons after object literals in function calls
  {
    pattern: /(\{\s*);(\s*\w+\s*:)/g,
    replacement: '$1,$2',
    description: 'Fix semicolon after object literal opening'
  },
  {
    pattern: /(:\s*['"`][^'"`]+['"`]\s*);(\s*\})/g,
    replacement: '$1$2',
    description: 'Fix semicolon before object closing'
  },
  {
    pattern: /(:\s*['"`][^'"`]+['"`]\s*);(\s*\w+\s*:)/g,
    replacement: '$1,$2',
    description: 'Fix semicolon instead of comma in objects'
  },
  // Fix missing commas in metadata and objects
  {
    pattern: /(title:\s*['"`][^'"`]+['"`])\s*\n(\s*description:)/g,
    replacement: '$1,\n$2',
    description: 'Add missing comma after title'
  },
  {
    pattern: /(description:\s*['"`][^'"`]+['"`])\s*\n(\s*\w+:)/g,
    replacement: '$1,\n$2',
    description: 'Add missing comma after description'
  },
  // Fix function call syntax
  {
    pattern: /\)\s*;\s*\)/g,
    replacement: '))',
    description: 'Remove extra semicolon in nested function calls'
  },
  // Fix array/object destructuring
  {
    pattern: /const\s+\{\s*([^}]+)\s*\}\s*;\s*=/g,
    replacement: 'const { $1 } =',
    description: 'Fix destructuring syntax'
  },
  // Fix JSX syntax
  {
    pattern: /(<\w+[^>]*>)\s*;/g,
    replacement: '$1',
    description: 'Remove semicolon after JSX opening tag'
  },
  // Fix export syntax
  {
    pattern: /export\s+default\s+(\w+)\s*;(\s*;)/g,
    replacement: 'export default $1;',
    description: 'Fix double semicolon in export'
  }
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let fileFixCount = 0;

    // Apply each fix pattern
    syntaxFixes.forEach(({ pattern, replacement, description }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        const fixCount = matches.length;
        fileFixCount += fixCount;
        
        const key = description;
        fixPatterns.set(key, (fixPatterns.get(key) || 0) + fixCount);
      }
    });

    // Additional specific fixes
    // Fix fetch API calls with semicolons
    content = content.replace(/fetch\([^)]+,\s*\{;/g, 'fetch($1, {');
    content = content.replace(/'Content-Type':\s*'application\/json'\s*};/g, "'Content-Type': 'application/json' }");
    
    // Fix React component props
    content = content.replace(/\}\s*;\s*\)/g, ' })');
    
    // Fix import statements
    content = content.replace(/import\s+{([^}]+)}\s*;\s*from/g, 'import {$1} from');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed ${fileFixCount} syntax errors in: ${path.relative(process.cwd(), filePath)}`);
      totalFixes += fileFixCount;
      totalFiles++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Find all TypeScript and TSX files
const files = glob.sync('src/**/*.{ts,tsx}', {
  ignore: ['**/node_modules/**', '**/*.d.ts']
});

console.log(`Found ${files.length} files to check...\n`);

// Process each file
files.forEach(fixFile);

// Summary
console.log('\n📊 Fix Summary:');
console.log(`Total files modified: ${totalFiles}`);
console.log(`Total fixes applied: ${totalFixes}`);

if (fixPatterns.size > 0) {
  console.log('\nFixes by type:');
  for (const [pattern, count] of fixPatterns) {
    console.log(`  - ${pattern}: ${count}`);
  }
}

console.log('\n✨ Syntax error fix complete!');
console.log('Run "npm run typecheck" to see remaining errors.');