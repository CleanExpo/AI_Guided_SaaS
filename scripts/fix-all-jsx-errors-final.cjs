#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🚀 Final JSX Error Fix Script\n');

// Find all TSX files
const tsxFiles = glob.sync('src/**/*.tsx', {
  ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**']
});

console.log(`Found ${tsxFiles.length} TSX files to process\n`);

let totalFixed = 0;
let filesWithErrors = [];

function fixJSXErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    
    // Track if we made changes
    let changed = false;
    
    // Fix 1: Ensure proper return statement formatting
    content = content.replace(/return\s*\(\s*\n\s*<(\w+)/gm, 'return (\n    <$1');
    if (content !== original) changed = true;
    
    // Fix 2: Count opening and closing tags
    const openingTags = (content.match(/<(\w+)(?:\s|>)/g) || []).map(tag => {
      const match = tag.match(/<(\w+)/);
      return match ? match[1] : null;
    }).filter(tag => tag && !['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tag.toLowerCase()));
    
    const closingTags = (content.match(/<\/(\w+)>/g) || []).map(tag => {
      const match = tag.match(/<\/(\w+)>/);
      return match ? match[1] : null;
    }).filter(Boolean);
    
    // Count occurrences of each tag
    const openCount = {};
    const closeCount = {};
    
    openingTags.forEach(tag => {
      openCount[tag] = (openCount[tag] || 0) + 1;
    });
    
    closingTags.forEach(tag => {
      closeCount[tag] = (closeCount[tag] || 0) + 1;
    });
    
    // Find mismatches
    let hasIssues = false;
    for (const tag in openCount) {
      const open = openCount[tag] || 0;
      const close = closeCount[tag] || 0;
      if (open !== close) {
        hasIssues = true;
        console.log(`  ⚠️  ${filePath}: ${tag} - ${open} opening, ${close} closing`);
      }
    }
    
    // Fix 3: Remove duplicate closing divs at end of file
    content = content.replace(/(}\s*)((?:<\/div>\s*){3,})(\s*}\s*$)/gm, '$1\n  );\n$3');
    
    // Fix 4: Fix common patterns that cause JSX errors
    // Remove closing tags in variable declarations
    content = content.replace(/useState<([^>]+)>\([^)]*\)<\/\1>/g, 'useState<$1>($2)');
    content = content.replace(/\)\s*<\/\w+>\s*;\s*$/gm, ');');
    
    // Fix 5: Ensure component ends properly
    const lines = content.split('\n');
    const lastNonEmptyLine = lines.filter(l => l.trim()).pop();
    
    if (lastNonEmptyLine && !lastNonEmptyLine.includes('export') && !lastNonEmptyLine.match(/}\s*$/)) {
      // Add proper closing
      content = content.trimRight() + '\n}\n';
      changed = true;
    }
    
    // Fix 6: Ensure newline at end
    if (!content.endsWith('\n')) {
      content += '\n';
      changed = true;
    }
    
    if (hasIssues || changed) {
      filesWithErrors.push(filePath);
      fs.writeFileSync(filePath, content, 'utf8');
      totalFixed++;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Process all files
console.log('Processing TSX files...\n');
tsxFiles.forEach(file => {
  fixJSXErrors(file);
});

console.log(`\n📊 Summary:`);
console.log(`✅ Processed ${tsxFiles.length} files`);
console.log(`🔧 Fixed issues in ${totalFixed} files`);

if (filesWithErrors.length > 0) {
  console.log('\n📋 Files that had issues:');
  filesWithErrors.slice(0, 20).forEach(file => {
    console.log(`  - ${file}`);
  });
  if (filesWithErrors.length > 20) {
    console.log(`  ... and ${filesWithErrors.length - 20} more`);
  }
}

// Check specific problem files
console.log('\n🎯 Checking known problem files...');
const problemFiles = [
  'src/components/health/TaskQueueVisualizer.tsx',
  'src/components/admin/AdminAnalytics.tsx',
  'src/app/admin/dashboard/page.tsx',
  'src/app/about/page.tsx',
];

problemFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`\nChecking ${file}...`);
    const content = fs.readFileSync(file, 'utf8');
    const openDivs = (content.match(/<div/g) || []).length;
    const closeDivs = (content.match(/<\/div>/g) || []).length;
    console.log(`  <div> tags: ${openDivs} opening, ${closeDivs} closing`);
    
    if (openDivs !== closeDivs) {
      console.log('  ❌ Mismatch detected!');
    } else {
      console.log('  ✅ Tags balanced');
    }
  }
});