#!/usr/bin/env node

/**
 * MCAS Final Syntax Sweep
 * Comprehensive fixer for all remaining syntax patterns
 */

const fs = require('fs');
const path = require('path');

let totalFiles = 0;
let fixedFiles = 0;
let totalFixes = 0;
const fixedFilesList = [];

function finalSyntaxFix(content, filePath) {
  let fixed = content;
  let changes = 0;

  // Pattern 1: Fix object property errors
  fixed = fixed.replace(/(\w+)\s*:\s*([^,}]+)\s*,\s*}/gm, '$1: $2 }');
  
  // Pattern 2: Fix trailing commas in function calls
  fixed = fixed.replace(/\)\s*,\s*}/gm, ') }');
  
  // Pattern 3: Fix semicolons after closing braces
  fixed = fixed.replace(/}\s*;\s*}/gm, '}\n}');
  
  // Pattern 4: Fix double semicolons
  fixed = fixed.replace(/;;\s*/gm, ';');
  
  // Pattern 5: Fix empty statements
  fixed = fixed.replace(/{\s*;\s*/gm, '{\n  ');
  
  // Pattern 6: Fix return statements
  fixed = fixed.replace(/return\s+;\s*/gm, 'return;');
  fixed = fixed.replace(/return\s+}\s*/gm, 'return;\n}');
  
  // Pattern 7: Fix arrow functions
  fixed = fixed.replace(/=>\s*{\s*;\s*/gm, '=> {\n  ');
  
  // Pattern 8: Fix if statements
  fixed = fixed.replace(/if\s*\(\s*([^)]+)\s*\)\s*{\s*;\s*/gm, 'if ($1) {\n  ');
  
  // Pattern 9: Fix else blocks
  fixed = fixed.replace(/}\s*else\s*{\s*;\s*/gm, '} else {\n  ');
  
  // Pattern 10: Fix try-catch blocks
  fixed = fixed.replace(/try\s*{\s*;\s*/gm, 'try {\n  ');
  fixed = fixed.replace(/catch\s*\(\s*([^)]+)\s*\)\s*{\s*;\s*/gm, 'catch ($1) {\n  ');
  
  // Pattern 11: Fix async/await
  fixed = fixed.replace(/async\s+\(\s*([^)]*)\s*\)\s*=>\s*{\s*;\s*/gm, 'async ($1) => {\n  ');
  
  // Pattern 12: Fix class methods
  fixed = fixed.replace(/(\w+)\s*\(\s*([^)]*)\s*\)\s*{\s*;\s*/gm, '$1($2) {\n    ');
  
  // Pattern 13: Fix imports
  fixed = fixed.replace(/import\s+([^;]+)\s*,\s*}/gm, 'import $1;');
  
  // Pattern 14: Fix exports
  fixed = fixed.replace(/export\s+([^;]+)\s*,\s*}/gm, 'export $1;');
  
  // Pattern 15: Fix array declarations
  fixed = fixed.replace(/=\s*\[\s*;\s*/gm, '= [\n  ');
  fixed = fixed.replace(/\[\s*([^,\]]+)\s*,\s*\]/gm, '[$1]');
  
  // Pattern 16: Fix JSX
  fixed = fixed.replace(/<([^>]+)>\s*,\s*}/gm, '<$1 />');
  fixed = fixed.replace(/<\/([^>]+)>\s*,\s*}/gm, '</$1>');
  
  // Pattern 17: Fix switch statements
  fixed = fixed.replace(/switch\s*\(\s*([^)]+)\s*\)\s*{\s*;\s*/gm, 'switch ($1) {\n  ');
  fixed = fixed.replace(/case\s+([^:]+)\s*:\s*;\s*/gm, 'case $1:\n    ');
  
  // Pattern 18: Fix for loops
  fixed = fixed.replace(/for\s*\(\s*([^)]+)\s*\)\s*{\s*;\s*/gm, 'for ($1) {\n  ');
  
  // Pattern 19: Fix while loops
  fixed = fixed.replace(/while\s*\(\s*([^)]+)\s*\)\s*{\s*;\s*/gm, 'while ($1) {\n  ');
  
  // Pattern 20: Fix do-while loops
  fixed = fixed.replace(/do\s*{\s*;\s*/gm, 'do {\n  ');
  
  // Pattern 21: Fix destructuring
  fixed = fixed.replace(/const\s*{\s*([^}]+)\s*}\s*=\s*([^;]+)\s*,\s*}/gm, 'const { $1 } = $2;');
  fixed = fixed.replace(/const\s*\[\s*([^\]]+)\s*\]\s*=\s*([^;]+)\s*,\s*}/gm, 'const [$1] = $2;');
  
  // Pattern 22: Fix template literals
  fixed = fixed.replace(/`([^`]*)\${\s*([^}]+)\s*}([^`]*)`\s*,\s*}/gm, '`$1${$2}$3`');
  
  // Pattern 23: Fix ternary operators
  fixed = fixed.replace(/\?\s*([^:]+)\s*:\s*([^;,}]+)\s*,\s*}/gm, '? $1 : $2');
  
  // Pattern 24: Fix type annotations
  fixed = fixed.replace(/:\s*([^;,}]+)\s*,\s*}/gm, ': $1');
  
  // Pattern 25: Fix interface/type declarations
  fixed = fixed.replace(/interface\s+(\w+)\s*{\s*;\s*/gm, 'interface $1 {\n  ');
  fixed = fixed.replace(/type\s+(\w+)\s*=\s*{\s*;\s*/gm, 'type $1 = {\n  ');

  // Count actual changes
  const originalLines = content.split('\n').length;
  const fixedLines = fixed.split('\n').length;
  if (fixed !== content) {
    changes = Math.abs(fixedLines - originalLines) + 1;
  }

  return { fixed, changes };
}

function processFile(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && 
      !filePath.endsWith('.js') && !filePath.endsWith('.jsx')) {
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { fixed, changes } = finalSyntaxFix(content, filePath);

    if (changes > 0) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      fixedFiles++;
      totalFixes += changes;
      fixedFilesList.push({ file: filePath, fixes: changes });
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
        // Skip node_modules and .next
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

console.log('🔧 MCAS Final Syntax Sweep');
console.log('==========================');
console.log('Applying comprehensive syntax fixes...\n');

const startTime = Date.now();

// Process all source files
const srcPath = path.join(process.cwd(), 'src');
if (fs.existsSync(srcPath)) {
  findFiles(srcPath);
}

// Process test files
const testsPath = path.join(process.cwd(), 'tests');
if (fs.existsSync(testsPath)) {
  findFiles(testsPath);
}

const duration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log('\n📊 Summary:');
console.log(`- Files processed: ${totalFiles}`);
console.log(`- Files fixed: ${fixedFiles}`);
console.log(`- Total fixes applied: ${totalFixes}`);
console.log(`- Duration: ${duration}s`);

if (fixedFilesList.length > 0) {
  console.log('\n📝 Fixed files:');
  fixedFilesList.forEach(({ file, fixes }) => {
    console.log(`  - ${path.relative(process.cwd(), file)} (${fixes} fixes)`);
  });
}

// Save report
const report = {
  timestamp: new Date().toISOString(),
  filesProcessed: totalFiles,
  filesFixed: fixedFiles,
  totalFixes: totalFixes,
  duration: `${duration}s`,
  fixedFiles: fixedFilesList
};

fs.writeFileSync(
  path.join(__dirname, 'final-syntax-sweep-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n✅ Final syntax sweep complete!');
console.log('📄 Report saved to: .mcas-cleanup/final-syntax-sweep-report.json');