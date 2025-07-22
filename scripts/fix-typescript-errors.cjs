#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing TypeScript syntax errors...\n');

// Pattern to fix: "private, " -> "private "
const fixPatterns = [
  {
    pattern: /private,\s+/g,
    replacement: 'private '
  },
  {
    pattern: /public,\s+/g,
    replacement: 'public '
  },
  {
    pattern: /protected,\s+/g,
    replacement: 'protected '
  },
  {
    pattern: /readonly,\s+/g,
    replacement: 'readonly '
  },
  {
    pattern: /static,\s+/g,
    replacement: 'static '
  }
];

// Find all TypeScript files
const files = glob.sync('**/*.{ts,tsx}', {
  ignore: ['node_modules/**', 'dist/**', '.next/**'],
  cwd: process.cwd()
});

let totalFixed = 0;
let filesFixed = 0;

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fileFixCount = 0;

  fixPatterns.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
      fileFixCount += matches.length;
      content = content.replace(pattern, replacement);
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${fileFixCount} errors in ${file}`);
    totalFixed += fileFixCount;
    filesFixed++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`Fixed ${totalFixed} errors in ${filesFixed} files`);