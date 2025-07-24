#!/usr/bin/env node

/**
 * MCAS Comprehensive JSX and Syntax Fixer
 * Targets all remaining TypeScript errors systematically
 */

const fs = require('fs');
const path = require('path');

let totalFiles = 0;
let fixedFiles = 0;
let totalFixes = 0;
const fixedFilesList = [];

function comprehensiveFix(content, filePath) {
  let fixed = content;
  let changes = 0;

  // JSX Fixes
  // Pattern 1: Fix unclosed JSX tags
  fixed = fixed.replace(/<(\w+)([^>]*)>\s*<\s*\n\s*\1>/gm, '<$1$2></$1>');
  
  // Pattern 2: Fix JSX closing tags with wrong format
  fixed = fixed.replace(/<\/\s*(\w+)\s*\n\s*>/gm, '</$1>');
  
  // Pattern 3: Fix self-closing tags
  fixed = fixed.replace(/<(\w+)([^>]*[^/])>\s*}/gm, '<$1$2 />');
  
  // Pattern 4: Fix JSX expression containers
  fixed = fixed.replace(/{\s*}\s*}/gm, '{}');
  
  // Pattern 5: Fix JSX attribute values
  fixed = fixed.replace(/(\w+)=\s*{([^}]+)}\s*}/gm, '$1={$2}');
  
  // Syntax Fixes
  // Pattern 6: Fix variable declarations
  fixed = fixed.replace(/^(\s*)(\w+)\s*=\s*{/gm, '$1const $2 = {');
  fixed = fixed.replace(/^(\s*)(\w+)\s*=\s*\[/gm, '$1const $2 = [');
  
  // Pattern 7: Fix function declarations
  fixed = fixed.replace(/^(\s*)(\w+)\s*\(\s*([^)]*)\s*\)\s*{/gm, '$1function $2($3) {');
  
  // Pattern 8: Fix missing semicolons more aggressively
  fixed = fixed.replace(/([^{};,\s])\s*\n\s*(\w+\s*[:=])/gm, '$1;\n$2');
  fixed = fixed.replace(/([^{};,\s])\s*\n\s*(export|import|const|let|var|function|class)/gm, '$1;\n$2');
  
  // Pattern 9: Fix object method syntax
  fixed = fixed.replace(/(\w+)\s*:\s*\(\s*([^)]*)\s*\)\s*=>\s*{/gm, '$1: ($2) => {');
  
  // Pattern 10: Fix implements clause
  fixed = fixed.replace(/class\s+(\w+)\s+implements\s+([^{]+)\s*}/gm, 'class $1 implements $2 {');
  
  // Pattern 11: Fix interface extends
  fixed = fixed.replace(/interface\s+(\w+)\s+extends\s+([^{]+)\s*}/gm, 'interface $1 extends $2 {');
  
  // Pattern 12: Fix async function syntax
  fixed = fixed.replace(/async\s+(\w+)\s*\(/gm, 'async function $1(');
  
  // Pattern 13: Fix arrow function returns
  fixed = fixed.replace(/=>\s*\n\s*{/gm, '=> {');
  fixed = fixed.replace(/=>\s*return\s*{/gm, '=> ({');
  
  // Pattern 14: Fix template literal syntax
  fixed = fixed.replace(/\${\s*}/gm, '${');
  fixed = fixed.replace(/\${([^}]+)}\s*}/gm, '${$1}');
  
  // Pattern 15: Fix type annotations
  fixed = fixed.replace(/:\s*}\s*}/gm, ': any }');
  fixed = fixed.replace(/:\s*\[\s*\]/gm, ': any[]');
  
  // Pattern 16: Fix React component returns
  fixed = fixed.replace(/return\s*\(\s*\n\s*</gm, 'return (\n    <');
  fixed = fixed.replace(/>\s*\)\s*}\s*}/gm, '>\n  );\n}');
  
  // Pattern 17: Fix conditional rendering
  fixed = fixed.replace(/{\s*(\w+)\s*&&\s*\(/gm, '{$1 && (');
  fixed = fixed.replace(/\)\s*}\s*}/gm, ')}');
  
  // Pattern 18: Fix map functions
  fixed = fixed.replace(/\.map\s*\(\s*\(\s*([^)]+)\s*\)\s*=>\s*\(/gm, '.map(($1) => (');
  
  // Pattern 19: Fix destructuring
  fixed = fixed.replace(/const\s*{\s*}\s*=/gm, 'const {} =');
  fixed = fixed.replace(/const\s*\[\s*\]\s*=/gm, 'const [] =');
  
  // Pattern 20: Fix export syntax
  fixed = fixed.replace(/export\s*{\s*}\s*}/gm, 'export {}');
  fixed = fixed.replace(/export\s+default\s+}/gm, 'export default');
  
  // Pattern 21: Fix import syntax
  fixed = fixed.replace(/import\s*{\s*}\s*from/gm, 'import {} from');
  fixed = fixed.replace(/from\s*['"]([^'"]+)['"]\s*}/gm, 'from \'$1\';');
  
  // Pattern 22: Fix switch/case
  fixed = fixed.replace(/case\s+([^:]+)\s*:\s*\n\s*([^b])/gm, 'case $1:\n      $2');
  fixed = fixed.replace(/default\s*:\s*\n\s*([^b])/gm, 'default:\n      $1');
  
  // Pattern 23: Fix try/catch
  fixed = fixed.replace(/try\s*{\s*\n\s*}/gm, 'try {\n    ');
  fixed = fixed.replace(/catch\s*\(\s*([^)]+)\s*\)\s*{\s*\n\s*}/gm, 'catch ($1) {\n    ');
  
  // Pattern 24: Fix className syntax
  fixed = fixed.replace(/class=\s*{/gm, 'className={');
  fixed = fixed.replace(/class=\s*"/gm, 'className="');
  
  // Pattern 25: Fix React Fragment
  fixed = fixed.replace(/<>\s*</gm, '<><');
  fixed = fixed.replace(/>\s*<\/>/gm, '></');

  // Count changes
  if (fixed !== content) {
    // Count actual line differences
    const originalLines = content.split('\n');
    const fixedLines = fixed.split('\n');
    changes = 0;
    
    for (let i = 0; i < Math.max(originalLines.length, fixedLines.length); i++) {
      if (originalLines[i] !== fixedLines[i]) {
        changes++;
      }
    }
  }

  return { fixed, changes };
}

function processFile(filePath) {
  // Skip non-TypeScript/JavaScript files
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && 
      !filePath.endsWith('.js') && !filePath.endsWith('.jsx')) {
    return;
  }

  // Skip declaration files
  if (filePath.endsWith('.d.ts')) {
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { fixed, changes } = comprehensiveFix(content, filePath);

    if (changes > 0) {
      // Backup original
      const backupPath = filePath + '.mcas-backup';
      if (!fs.existsSync(backupPath)) {
        fs.writeFileSync(backupPath, content, 'utf8');
      }

      // Write fixed content
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
        // Skip directories
        if (entry.name === 'node_modules' || 
            entry.name === '.next' || 
            entry.name === '.git' ||
            entry.name === 'dist' ||
            entry.name === 'build') {
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

console.log('🔧 MCAS Comprehensive JSX and Syntax Fixer');
console.log('==========================================');
console.log('Applying comprehensive fixes to all TypeScript/JavaScript files...\n');

const startTime = Date.now();

// Process all source files
const srcPath = path.join(process.cwd(), 'src');
if (fs.existsSync(srcPath)) {
  console.log('Processing src directory...');
  findFiles(srcPath);
}

// Process test files
const testsPath = path.join(process.cwd(), 'tests');
if (fs.existsSync(testsPath)) {
  console.log('\nProcessing tests directory...');
  findFiles(testsPath);
}

// Process scripts
const scriptsPath = path.join(process.cwd(), 'scripts');
if (fs.existsSync(scriptsPath)) {
  console.log('\nProcessing scripts directory...');
  findFiles(scriptsPath);
}

const duration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log('\n📊 Summary:');
console.log(`- Files processed: ${totalFiles}`);
console.log(`- Files fixed: ${fixedFiles}`);
console.log(`- Total fixes applied: ${totalFixes}`);
console.log(`- Duration: ${duration}s`);
console.log(`- Average: ${(totalFixes / (duration || 1)).toFixed(1)} fixes/second`);

if (fixedFilesList.length > 0) {
  console.log('\n📝 Top fixed files:');
  fixedFilesList
    .sort((a, b) => b.fixes - a.fixes)
    .slice(0, 20)
    .forEach(({ file, fixes }) => {
      console.log(`  - ${path.relative(process.cwd(), file)} (${fixes} fixes)`);
    });
}

// Save detailed report
const report = {
  timestamp: new Date().toISOString(),
  filesProcessed: totalFiles,
  filesFixed: fixedFiles,
  totalFixes: totalFixes,
  duration: `${duration}s`,
  fixesPerSecond: (totalFixes / (duration || 1)).toFixed(1),
  allFixedFiles: fixedFilesList.map(({ file, fixes }) => ({
    file: path.relative(process.cwd(), file),
    fixes
  }))
};

fs.writeFileSync(
  path.join(__dirname, 'comprehensive-fix-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n✅ Comprehensive fixes complete!');
console.log('📄 Report saved to: .mcas-cleanup/comprehensive-fix-report.json');
console.log('\n💡 Run "npm run typecheck" to see remaining errors');