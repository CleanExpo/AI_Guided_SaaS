#!/usr/bin/env node

/**
 * MCAS Test File Syntax Fixer
 * Fixes common syntax errors in test files
 */

const fs = require('fs');
const path = require('path');

// Track statistics
let totalFiles = 0;
let filesFixed = 0;
let totalFixes = 0;

/**
 * Fix test file syntax errors
 */
function fixTestFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  let changes = 0;

  // Fix malformed function declarations in tests
  // Pattern: (: any) => should be () =>
  content = content.replace(/\(\s*:\s*any\s*\)\s*=>/g, '() =>');
  if (content !== original) changes++;

  // Fix describe/it declarations
  // Pattern: describe('name': any, (: any) => should be describe('name', () =>
  content = content.replace(/describe\s*\(\s*'([^']+)'\s*:\s*any\s*,\s*\(\s*:\s*any\s*\)\s*=>/g, "describe('$1', () =>");
  content = content.replace(/it\s*\(\s*'([^']+)'\s*:\s*any\s*,\s*\(\s*:\s*any\s*\)\s*=>/g, "it('$1', () =>");
  content = content.replace(/beforeEach\s*\(\s*\(\s*:\s*any\s*\)\s*=>/g, 'beforeEach(() =>');
  content = content.replace(/afterEach\s*\(\s*\(\s*:\s*any\s*\)\s*=>/g, 'afterEach(() =>');
  
  // Fix async test functions
  content = content.replace(/async\s*\(\s*:\s*any\s*\)\s*=>/g, 'async () =>');
  
  // Fix object syntax in tests
  // Pattern: { property: value; should be { property: value,
  content = content.replace(/(\{\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*:\s*[^;}]+);/g, '$1,');
  
  // Fix multi-line object syntax
  content = content.replace(/(\n\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*:\s*[^;}\n]+);(\s*\n)/g, '$1,$2');

  // Fix arrow function parameters
  content = content.replace(/\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\)\s*=>/g, '($1) =>');
  
  // Fix done callback pattern
  content = content.replace(/\(\s*done\s*:\s*any\s*\)\s*=>/g, '(done) =>');
  
  // Fix event handler patterns
  content = content.replace(/\.on\s*\(\s*'([^']+)'\s*:\s*any\s*,/g, ".on('$1',");
  
  // Fix variable declarations with wrong syntax
  content = content.replace(/const\s+_([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g, 'const $1 =');

  // Fix missing closing braces for functions
  let openBraces = (content.match(/\{/g) || []).length;
  let closeBraces = (content.match(/\}/g) || []).length;
  if (openBraces > closeBraces) {
    content += '\n' + '}'.repeat(openBraces - closeBraces);
  }

  // Fix missing closing parentheses
  let openParens = (content.match(/\(/g) || []).length;
  let closeParens = (content.match(/\)/g) || []).length;
  if (openParens > closeParens) {
    content += ')'.repeat(openParens - closeParens);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesFixed++;
    totalFixes += changes;
    console.log(`✓ Fixed ${filePath}`);
    return true;
  }
  return false;
}

/**
 * Process directory recursively
 */
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        processDirectory(fullPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.tsx') || entry.name.endsWith('.spec.ts') || entry.name.endsWith('.spec.tsx'))) {
      totalFiles++;
      fixTestFile(fullPath);
    }
  }
}

console.log('🧪 MCAS Test File Syntax Fixer');
console.log('==============================\n');

// Process test directories
const testDirs = [
  path.join(process.cwd(), 'tests'),
  path.join(process.cwd(), 'src') // Some tests might be colocated
];

for (const dir of testDirs) {
  if (fs.existsSync(dir)) {
    console.log(`Processing ${dir}...`);
    processDirectory(dir);
  }
}

console.log(`\n✅ Summary:`);
console.log(`   Total test files: ${totalFiles}`);
console.log(`   Files fixed: ${filesFixed}`);
console.log(`   Total fixes: ${totalFixes}`);