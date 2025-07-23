#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Critical Build Errors...');

const PROJECT_ROOT = process.cwd();

// Fix specific critical syntax errors that prevent build
const criticalFixes = [
  {
    pattern: /props: anyexport default function/g,
    replacement: 'export default function',
    description: 'Fix props:anyexport syntax error'
  },
  {
    pattern: /'use client'import React/g,
    replacement: "'use client';\nimport React",
    description: 'Fix missing semicolon after use client'
  },
  {
    pattern: /import ([^;]+);import/g,
    replacement: 'import $1;\nimport',
    description: 'Fix merged import statements'
  },
  {
    pattern: /}\s*props: any\s*export/g,
    replacement: '}\n\nexport',
    description: 'Fix malformed export statements'
  },
  {
    pattern: /;\s*props: any\s*/g,
    replacement: ';\n\n',
    description: 'Remove invalid props:any statements'
  },
  {
    pattern: /\): void \{/g,
    replacement: ') {',
    description: 'Fix void return type syntax'
  },
  {
    pattern: /: any\[\]/g,
    replacement: '',
    description: 'Remove invalid type annotations'
  }
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    for (const { pattern, replacement, description } of criticalFixes) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
        console.log(`  ✅ Applied: ${description}`);
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`  ❌ Error fixing ${filePath}: ${error.message}`);
    return false;
  }
}

function fixNextConfig() {
  const configPath = path.join(PROJECT_ROOT, 'next.config.mjs');
  if (!fs.existsSync(configPath)) return false;
  
  try {
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Remove deprecated serverActions option
    content = content.replace(/experimental: \{\s*serverActions: true\s*\},?/g, '');
    content = content.replace(/experimental: \{\s*\},?/g, '');
    
    // Clean up any empty experimental objects
    content = content.replace(/,\s*experimental: \{\s*\}/g, '');
    
    fs.writeFileSync(configPath, content, 'utf8');
    console.log('✅ Fixed next.config.mjs - removed deprecated serverActions');
    return true;
  } catch (error) {
    console.log(`❌ Error fixing next.config.mjs: ${error.message}`);
    return false;
  }
}

async function fixCriticalFiles() {
  console.log('📋 Fixing critical build errors...');
  
  // Fix next.config.mjs first
  fixNextConfig();
  
  // Get the specific files that failed in the build
  const failedFiles = [
    'src/app/about/page.tsx',
    'src/app/admin-direct/page.tsx', 
    'src/app/admin/agent-monitor/page.tsx',
    'src/app/admin/analytics/page.tsx',
    'src/app/admin/causal/page.tsx'
  ];
  
  let fixedCount = 0;
  
  for (const file of failedFiles) {
    const filePath = path.join(PROJECT_ROOT, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${file} (not found)`);
      continue;
    }
    
    console.log(`🔧 Fixing ${file}...`);
    
    if (fixFile(filePath)) {
      fixedCount++;
      console.log(`✅ Fixed ${file}`);
    } else {
      console.log(`⏭️  No changes needed in ${file}`);
    }
  }
  
  console.log(`\n🎯 Fixed ${fixedCount} critical files`);
  return fixedCount;
}

// Run the fixes
fixCriticalFiles().then((fixedCount) => {
  if (fixedCount > 0) {
    console.log('\n🎉 Critical build errors fixed! You can now try building again.');
  } else {
    console.log('\n⚠️  No critical fixes applied. Check the files manually.');
  }
}).catch(error => {
  console.error('❌ Critical fix failed:', error.message);
  process.exit(1);
});