#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Simple TypeScript Error Fixer');
console.log('================================\n');

// Common error patterns and their fixes
const fixes = [
  // Fix 1: Remove incorrect type annotations from destructuring
  {
    pattern: /const\s+\[(\w+),\s*(\w+)\]:\s*any\[\]\s*=\s*useState/g,
    replacement: 'const [$1, $2] = useState',
    description: 'Fix useState type annotations'
  },
  
  // Fix 2: Remove type annotations from catch clauses
  {
    pattern: /catch\s*\(\s*(\w+):\s*any\s*\)/g,
    replacement: 'catch ($1)',
    description: 'Remove type from catch clause'
  },
  
  // Fix 3: Fix incorrect function return type syntax
  {
    pattern: /function\s+(\w+)\s*\([^)]*\)\s*:\s*void\s*{/g,
    replacement: 'function $1() {',
    description: 'Remove void return type'
  },
  
  // Fix 4: Fix incorrect variable type annotations
  {
    pattern: /const\s+(\w+):\s*any\s*=/g,
    replacement: 'const $1 =',
    description: 'Remove any type annotation'
  },
  
  // Fix 5: Fix missing semicolons
  {
    pattern: /^(\s*)(const|let|var|interface|type|export)\s+[^;{\n]*[^;{}\n]$/gm,
    replacement: '$&;',
    description: 'Add missing semicolons'
  },
  
  // Fix 6: Fix interface property separators
  {
    pattern: /(\w+):\s*([^;,\n]+),(\s*(?:\/\/[^\n]*)?\s*(?=\w+\s*:|}))/g,
    replacement: '$1: $2;$3',
    description: 'Fix interface property separators'
  },
  
  // Fix 7: Fix incorrect JSX syntax
  {
    pattern: /className\s*=\s*{\s*cn\s*\(\s*"([^"]+)"\s+"([^"]+)"\s*\)\s*}/g,
    replacement: 'className={cn("$1", "$2")}',
    description: 'Fix className concatenation'
  },
  
  // Fix 8: Remove extra closing tags
  {
    pattern: /<\/(\w+)>\s*<\/\1>/g,
    replacement: '</$1>',
    description: 'Remove duplicate closing tags'
  }
];

// Get all TypeScript files
function getAllFiles() {
  const patterns = [
    'src/**/*.{ts,tsx}',
    'scripts/**/*.{ts,tsx}',
    'tests/**/*.{ts,tsx}'
  ];
  
  const excludePatterns = [
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/build/**'
  ];
  
  const files = [];
  patterns.forEach(pattern => {
    const matches = glob.sync(pattern, {
      ignore: excludePatterns,
      nodir: true
    });
    files.push(...matches);
  });
  
  return files;
}

// Fix a single file
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let appliedFixes = [];
    
    // Apply all fixes
    fixes.forEach(fix => {
      const newContent = content.replace(fix.pattern, fix.replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
        appliedFixes.push(fix.description);
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${filePath}`);
      appliedFixes.forEach(fix => console.log(`   - ${fix}`));
      return 1;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
    return 0;
  }
}

// Main execution
async function main() {
  const files = getAllFiles();
  console.log(`📁 Found ${files.length} TypeScript files\n`);
  
  let fixedFiles = 0;
  let processedFiles = 0;
  
  for (const file of files) {
    processedFiles++;
    fixedFiles += fixFile(file);
    
    // Progress update
    if (processedFiles % 50 === 0) {
      console.log(`\n📊 Progress: ${processedFiles}/${files.length} files processed...\n`);
    }
  }
  
  console.log('\n✅ TypeScript fix complete!');
  console.log(`📊 Files processed: ${processedFiles}`);
  console.log(`🔧 Files fixed: ${fixedFiles}`);
  console.log(`📈 Success rate: ${((fixedFiles/processedFiles) * 100).toFixed(1)}%`);
}

// Run the script
main().catch(console.error);