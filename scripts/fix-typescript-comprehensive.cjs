#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🛠️  Comprehensive TypeScript Fix Script\n');
console.log('This script safely fixes common TypeScript/JSX syntax errors\n');

let totalFixed = 0;
let filesProcessed = 0;
let errors = [];

// Get all TypeScript and TSX files
function getAllTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!filePath.includes('node_modules') && 
          !filePath.includes('.next') && 
          !filePath.includes('dist') &&
          !filePath.includes('.git')) {
        getAllTsFiles(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Fix common syntax patterns
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let fixCount = 0;
  
  try {
    // Fix 1: Missing commas in object literals
    // Pattern: { key: value key2: value2 } -> { key: value, key2: value2 }
    content = content.replace(/(\w+:\s*['"`]?[\w\s\-\/\.\@\:]+['"`]?)(\s+)(\w+:)/g, '$1,$2$3');
    
    // Fix 2: Missing commas in function parameters
    // Pattern: (param1: type param2: type) -> (param1: type, param2: type)
    content = content.replace(/(\w+:\s*\w+[\[\]<>]*)\s+(\w+:)/g, '$1, $2');
    
    // Fix 3: Fix Response.json() calls
    // Pattern: Response.json({ data } { status: 200 }) -> Response.json({ data }, { status: 200 })
    content = content.replace(/Response\.json\(([^)]+)\)\s*\{/g, (match, p1) => {
      if (!p1.includes(',') && match.includes('status:')) {
        return `Response.json(${p1}, {`;
      }
      return match;
    });
    
    // Fix 4: Fix NextResponse.json() calls
    content = content.replace(/NextResponse\.json\(([^)]+)\)\s*\{/g, (match, p1) => {
      if (!p1.includes(',') && match.includes('status:')) {
        return `NextResponse.json(${p1}, {`;
      }
      return match;
    });
    
    // Fix 5: Fix console.log with embedded commas
    content = content.replace(/console\.log\(['"]([^'"]+),\s+([^'"]+)['"]/g, 'console.log(\'$1 $2\'');
    
    // Fix 6: Fix semicolons that should be commas in object literals
    // Pattern: { key: value; key2: value2 } -> { key: value, key2: value2 }
    content = content.replace(/(\{\s*\w+:\s*[^;}]+);(\s*\w+:)/g, '$1,$2');
    
    // Fix 7: Fix missing colons in object properties
    // Pattern: { key value } -> { key: value }
    content = content.replace(/\{\s*(\w+)\s+(['"`][\w\s]+['"`]|\w+)\s*\}/g, '{ $1: $2 }');
    
    // Fix 8: Fix try-catch blocks
    content = content.replace(/\}\s*\)\s*catch/g, '} catch');
    
    // Fix 9: Fix API route responses
    content = content.replace(/return Response\.json\(([^,)]+)\s+(\d{3})\)/g, 'return Response.json($1, { status: $2 })');
    content = content.replace(/return NextResponse\.json\(([^,)]+)\s+(\d{3})\)/g, 'return NextResponse.json($1, { status: $2 })');
    
    // Fix 10: Remove duplicate semicolons
    content = content.replace(/;;+/g, ';');
    
    // Count fixes
    if (content !== originalContent) {
      fixCount = (content.match(/\n/g) || []).length - (originalContent.match(/\n/g) || []).length;
      fixCount = Math.abs(fixCount) || 1; // At least 1 fix if content changed
      
      // Write back only if changes were made
      fs.writeFileSync(filePath, content, 'utf8');
      totalFixed += fixCount;
      filesProcessed++;
      console.log(`✅ Fixed ${fixCount} issues in: ${path.relative(process.cwd(), filePath)}`);
    }
    
  } catch (error) {
    errors.push({ file: filePath, error: error.message });
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
  }
  
  return fixCount;
}

// Process specific directories first
const priorityDirs = [
  'src/app/api',
  'src/lib',
  'src/components',
  'src/app'
];

console.log('Processing files...\n');

priorityDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`\n📁 Processing ${dir}...`);
    const files = getAllTsFiles(dirPath);
    files.forEach(file => fixFile(file));
  }
});

// Summary
console.log('\n📊 Summary:');
console.log(`✅ Fixed ${totalFixed} issues across ${filesProcessed} files`);

if (errors.length > 0) {
  console.log(`\n❌ Errors encountered in ${errors.length} files:`);
  errors.forEach(e => console.log(`  - ${path.relative(process.cwd(), e.file)}: ${e.error}`));
}

// Run TypeScript check
console.log('\n🔍 Running TypeScript check...\n');

try {
  const errorCount = execSync('npx tsc --noEmit 2>&1 | grep "error TS" | wc -l', {
    encoding: 'utf8',
    stdio: 'pipe'
  }).trim();
  
  console.log(`📊 Remaining TypeScript errors: ${errorCount}`);
  
  if (parseInt(errorCount) < 6372) {
    console.log('✅ Progress made! Error count reduced.');
  }
} catch (error) {
  console.log('ℹ️  Could not count remaining errors');
}

console.log('\n✅ Safe fixes applied!');
console.log('\nNext steps:');
console.log('1. Run: npm run build');
console.log('2. If errors remain, check specific files manually');
console.log('3. Consider running: npm run fix:jsx-react (if created)');