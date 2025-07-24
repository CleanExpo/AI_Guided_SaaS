#!/usr/bin/env node

/**
 * Fix "function if" pattern introduced by comprehensive fixer
 */

const fs = require('fs');
const path = require('path');

let totalFiles = 0;
let fixedFiles = 0;
let totalFixes = 0;

function fixFunctionIfPattern(content) {
  let fixed = content;
  let changes = 0;
  
  // Fix "function if" pattern
  fixed = fixed.replace(/function\s+if\s*\(/gm, 'if (');
  if (fixed !== content) changes++;
  
  // Fix "function for" pattern
  fixed = fixed.replace(/function\s+for\s*\(/gm, 'for (');
  if (fixed !== content) changes++;
  
  // Fix "function while" pattern
  fixed = fixed.replace(/function\s+while\s*\(/gm, 'while (');
  if (fixed !== content) changes++;
  
  // Fix "function switch" pattern
  fixed = fixed.replace(/function\s+switch\s*\(/gm, 'switch (');
  if (fixed !== content) changes++;
  
  // Fix "function constructor" in classes
  fixed = fixed.replace(/function\s+constructor\s*\(/gm, 'constructor(');
  if (fixed !== content) changes++;
  
  // Fix async function declarations
  fixed = fixed.replace(/async\s+function\s+function\s+/gm, 'async function ');
  if (fixed !== content) changes++;
  
  // Fix method declarations in classes/objects
  fixed = fixed.replace(/:\s*function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/gm, ': $1(');
  if (fixed !== content) changes++;
  
  // Fix standalone method declarations
  fixed = fixed.replace(/^(\s*)function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/gm, '$1$2(');
  if (fixed !== content) changes++;
  
  // Fix array declarations
  fixed = fixed.replace(/:\s*(any|string|number|boolean|void)\[\]\s+as\s+(any|string|number|boolean)\[\]/gm, ': $1[]');
  if (fixed !== content) changes++;
  
  // Fix const declarations with semicolons
  fixed = fixed.replace(/const\s+([^=]+)=\s*([^;]+);\s*const\s+/gm, 'const $1 = $2;\nconst ');
  if (fixed !== content) changes++;
  
  // Fix line continuation issues
  fixed = fixed.replace(/;\n(\s*)const\s+/gm, ';\n$1\nconst ');
  if (fixed !== content) changes++;

  return { fixed, changes };
}

function processFile(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { fixed, changes } = fixFunctionIfPattern(content);

    if (changes > 0) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      fixedFiles++;
      totalFixes += changes;
      console.log(`✓ Fixed ${changes} issues in: ${path.relative(process.cwd(), filePath)}`);
    }

    totalFiles++;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function findFiles(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') {
          continue;
        }
        findFiles(fullPath);
      } else if (entry.isFile()) {
        processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
}

console.log('🔧 Fix "function if" Pattern');
console.log('============================');

const startTime = Date.now();

// Process all TypeScript files
const srcPath = path.join(process.cwd(), 'src');
if (fs.existsSync(srcPath)) {
  findFiles(srcPath);
}

const duration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log('\n📊 Summary:');
console.log(`- Files processed: ${totalFiles}`);
console.log(`- Files fixed: ${fixedFiles}`);
console.log(`- Total fixes applied: ${totalFixes}`);
console.log(`- Duration: ${duration}s`);

console.log('\n✅ Pattern fixes complete!');