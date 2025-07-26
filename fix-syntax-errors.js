#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

console.log('🔧 Starting comprehensive syntax error fixing...');

// Get all TypeScript and TSX files in src/
const files = glob.sync('src/**/*.{ts,tsx}', { ignore: ['node_modules/**', 'dist/**', '.next/**'] });

console.log(`Found ${files.length} files to process`);

let totalFixesApplied = 0;
let filesModified = 0;

const fixes = [
  // Fix malformed object properties with comma placement
  {
    name: 'Fix malformed object comma placement',
    pattern: /(\w+: [^,}\n]+)\n\s*,\s*(\w+:)/g,
    replacement: '$1,\n    $2'
  },
  
  // Fix missing closing brackets in JSX
  {
    name: 'Fix missing closing bracket in Card components',
    pattern: /<Card\s+className="[^"]*"\s+className="[^"]*"\n/g,
    replacement: (match) => match.replace(/className="[^"]*"\s+className="([^"]*)"/, 'className="$1">')
  },
  
  // Fix duplicate className attributes
  {
    name: 'Fix duplicate className attributes',
    pattern: /className="([^"]*)"\s+className="([^"]*)"/g,
    replacement: 'className="$1 $2"'
  },
  
  // Fix malformed function signatures
  {
    name: 'Fix malformed function signatures',
    pattern: /(\w+)\(\{([^}]*)\}:\s*\w+\):\s*\w+\)\s*\{/g,
    replacement: '$1({ $2 }) {'
  },
  
  // Fix broken useState calls
  {
    name: 'Fix broken useState calls',
    pattern: /useState<[^>]*>\(\[\]\)/g,
    replacement: (match) => {
      if (match.includes('boolean')) return 'useState<boolean>(false)';
      if (match.includes('string')) return 'useState<string>("")';
      if (match.includes('number')) return 'useState<number>(0)';
      return match.replace('[]', 'null');
    }
  },
  
  // Fix JSX closing tags in wrong places
  {
    name: 'Fix misplaced JSX closing tags',
    pattern: /<\/\w+>\s*\n\s*useState/g,
    replacement: (match) => match.replace(/<\/\w+>\s*\n\s*/, '')
  },
  
  // Fix broken template literals
  {
    name: 'Fix broken template literals',
    pattern: /`\$\{([^}]*)\s*\};\s*([^`]*)`/g,
    replacement: '`${$1}$2`'
  },
  
  // Fix missing opening brackets in JSX
  {
    name: 'Fix missing opening brackets',
    pattern: /(<\w+[^>]*)\n\s*([^<>\n]*>)/g,
    replacement: '$1>$2'
  },
  
  // Fix malformed select elements
  {
    name: 'Fix malformed select elements',
    pattern: /<select;\s*\n\s*value=\{([^}]*)\}\s*onChange=\{([^}]*)\};\s*([^>]*)>/g,
    replacement: '<select value={$1} onChange={$2} $3>'
  },
  
  // Fix broken arrow functions
  {
    name: 'Fix broken arrow functions',
    pattern: /\(\)\s*=\s*className="[^"]*"\s*([^;]*);/g,
    replacement: '() => $1'
  }
];

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let fileFixesApplied = 0;
    
    fixes.forEach(fix => {
      const before = content;
      if (typeof fix.pattern === 'object' && fix.pattern.global) {
        content = content.replace(fix.pattern, fix.replacement);
      } else {
        content = content.replace(fix.pattern, fix.replacement);
      }
      
      if (content !== before) {
        fileFixesApplied++;
        console.log(`  ✓ Applied ${fix.name} to ${filePath}`);
      }
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      filesModified++;
      totalFixesApplied += fileFixesApplied;
      console.log(`📝 Modified ${filePath} (${fileFixesApplied} fixes)`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n✅ Syntax error fixing complete!`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Total fixes applied: ${totalFixesApplied}`);
console.log(`\n🔍 Run 'npm run typecheck' to verify fixes...`);