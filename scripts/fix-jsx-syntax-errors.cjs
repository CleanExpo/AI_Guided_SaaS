#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing JSX Syntax Errors...');

const PROJECT_ROOT = process.cwd();

function fixJSXSyntax(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix return (; -> return (
    if (content.includes('return (;')) {
      content = content.replace(/return \(;/g, 'return (');
      modified = true;
      console.log(`  ✅ Fixed return (; syntax`);
    }
    
    // Fix malformed function calls and object syntax
    content = content.replace(/body: JSON\.stringify\([^)]+\)\);/g, (match) => {
      return match.replace(/\)\);$/, ')}\n      });');
    });
    
    // Fix missing closing braces in fetch calls
    content = content.replace(/body: JSON\.stringify\(([^)]+)\)\s*$/gm, 'body: JSON.stringify($1)\n      }');
    
    // Fix broken object syntax
    content = content.replace(/headers: \{\s*'Content-Type': 'application\/json',\s*body:/g, 
      "headers: {\n        'Content-Type': 'application/json'\n      },\n      body:");
    
    if (modified || content !== fs.readFileSync(filePath, 'utf8')) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`  ❌ Error fixing ${filePath}: ${error.message}`);
    return false;
  }
}

async function fixJSXFiles() {
  // Files that specifically failed with JSX syntax errors
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
    
    console.log(`🔧 Fixing JSX in ${file}...`);
    
    if (fixJSXSyntax(filePath)) {
      fixedCount++;
      console.log(`✅ Fixed ${file}`);
    } else {
      console.log(`⏭️  No JSX changes needed in ${file}`);
    }
  }
  
  console.log(`\n🎯 Fixed JSX syntax in ${fixedCount} files`);
  return fixedCount;
}

// Run the fixes
fixJSXFiles().then((fixedCount) => {
  console.log('\n🎉 JSX syntax errors fixed!');
}).catch(error => {
  console.error('❌ JSX fix failed:', error.message);
  process.exit(1);
});