#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 TypeScript Batch Fix #1 - Targeting Top Errors');
console.log('=================================================\n');

// Get all TypeScript and TSX files
function getAllTypeScriptFiles(dir) {
  const files = [];
  
  function traverse(currentPath) {
    if (currentPath.includes('node_modules') || 
        currentPath.includes('.next') || 
        currentPath.includes('dist') ||
        currentPath.includes('build')) {
      return;
    }
    
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Fix patterns
const fixes = [
  // Fix JSX unclosed tags
  {
    name: 'Fix unclosed JSX tags',
    pattern: /<(\w+)([^>]*)>\s*<(\w+)/g,
    fix: (match, tag1, attrs, tag2) => {
      if (tag1 === tag2) {
        return `<${tag1}${attrs} />`;
      }
      return match;
    }
  },
  
  // Fix missing closing tags
  {
    name: 'Add missing closing tags',
    pattern: /<(div|span|button|Card|CardContent|CardHeader)([^>]*)>([^<]+)$/gm,
    fix: (match, tag, attrs, content) => `<${tag}${attrs}>${content}</${tag}>`
  },
  
  // Fix syntax errors in function parameters
  {
    name: 'Fix function parameter syntax',
    pattern: /\(([^)]*)\)\s*=>\s*(voi);d/g,
    fix: (match, params) => `(${params}) => void`
  },
  
  // Fix semicolon placement errors
  {
    name: 'Fix semicolon placement',
    pattern: /([}\]>])\s*;(\s*[,\)])/g,
    fix: '$1$2'
  },
  
  // Fix array/object literal syntax
  {
    name: 'Fix array literal syntax',
    pattern: /=\s*\[;/g,
    fix: '= ['
  },
  
  // Fix object literal syntax
  {
    name: 'Fix object literal syntax',
    pattern: /=\s*\{;/g,
    fix: '= {'
  },
  
  // Fix property syntax errors
  {
    name: 'Fix property syntax',
    pattern: /([a-zA-Z_]\w*)\s*:\s*([^;,}]+);(\s*[,}])/g,
    fix: '$1: $2$3'
  },
  
  // Fix interface property errors
  {
    name: 'Fix interface properties',
    pattern: /interface\s+\w+\s*\{([^}]*);([^}]*)\}/g,
    fix: (match, before, after) => {
      const fixed = match.replace(/;(\s*[a-zA-Z_])/g, ';\n$1');
      return fixed;
    }
  },
  
  // Fix const array syntax
  {
    name: 'Fix const array declarations',
    pattern: /const\s+(\w+)\s*=\s*\[;/g,
    fix: 'const $1 = ['
  },
  
  // Fix JSX expression syntax
  {
    name: 'Fix JSX expression syntax',
    pattern: /\{([^}]*);(\s*)\}/g,
    fix: '{$1$2}'
  }
];

// Process files
const files = getAllTypeScriptFiles('./src');
files.push(...getAllTypeScriptFiles('./scripts'));
files.push(...getAllTypeScriptFiles('./tests'));

console.log(`📁 Found ${files.length} TypeScript files\n`);

let totalFixed = 0;
let filesFixed = 0;

files.forEach((file, index) => {
  if (index % 50 === 0 && index > 0) {
    console.log(`\n📊 Progress: ${index}/${files.length} files processed...\n`);
  }
  
  try {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    let fileFixed = false;
    const appliedFixes = [];
    
    // Apply each fix
    fixes.forEach(fix => {
      const before = content;
      content = content.replace(fix.pattern, fix.fix);
      if (before !== content) {
        appliedFixes.push(fix.name);
        fileFixed = true;
      }
    });
    
    // Additional targeted fixes
    // Fix specific error patterns from the logs
    content = content
      .replace(/\}\s*catch\s*\(/g, '} catch (')
      .replace(/const\s+_emoji\s*=\s*([^;]+),;/g, 'const _emoji = $1;')
      .replace(/\)\s*=>\s*string\s*\|\s*null$/gm, '): string | null')
      .replace(/validation\?\s*\(value\)\s*=>/g, 'validation?: (value: any) =>')
      .replace(/onComplete:\s*\(projectData\)\s*=>/g, 'onComplete: (projectData: any) =>')
      .replace(/\.sort\(\(a,\s*b\)\s*=>/g, '.sort((a: any, b: any) =>')
      .replace(/startTime:\s*'([^']+);\s*([^']+):\s*([^']+)'/g, "startTime: '$1 $2:$3'")
      .replace(/\s+\.\s*sort/g, '.sort')
      .replace(/id:\s*(\d+);/g, 'id: $1,');
    
    // Write file if changed
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      filesFixed++;
      totalFixed += appliedFixes.length;
      console.log(`✅ ${path.relative('.', file)}`);
      appliedFixes.forEach(fix => console.log(`   - ${fix}`));
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}: ${error.message}`);
  }
});

console.log('\n✅ TypeScript Batch Fix #1 Complete!');
console.log(`📊 Files processed: ${files.length}`);
console.log(`🔧 Files fixed: ${filesFixed}`);
console.log(`💡 Total fixes applied: ${totalFixed}`);
console.log(`📈 Success rate: ${((filesFixed / files.length) * 100).toFixed(1)}%`);

// Run typecheck to see remaining errors
console.log('\n📊 Checking remaining errors...');
try {
  const result = execSync('npm run typecheck 2>&1 | grep "error TS" | wc -l', { encoding: 'utf8' });
  console.log(`❗ Remaining TypeScript errors: ${result.trim()}`);
} catch (error) {
  console.log('❗ Could not count remaining errors');
}