#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Comprehensive Component Syntax Fixer...');

const PROJECT_ROOT = process.cwd();

const syntaxFixes = [
  {
    pattern: /'use client'import/g,
    replacement: "'use client';\nimport",
    description: "Fix 'use client' semicolon"
  },
  {
    pattern: /props: anyexport/g,
    replacement: 'export',
    description: 'Remove props:anyexport'
  },
  {
    pattern: /props: any\s*export/g,
    replacement: 'export',
    description: 'Remove props:any export'
  },
  {
    pattern: /\): void \{/g,
    replacement: ') {',
    description: 'Fix void return type'
  },
  {
    pattern: /: any\[\]/g,
    replacement: '',
    description: 'Remove any[] type annotations'
  },
  {
    pattern: /return \(;/g,
    replacement: 'return (',
    description: 'Fix return (; syntax'
  },
  {
    pattern: /}\s*props: any\s*/g,
    replacement: '}\n\n',
    description: 'Remove trailing props:any'
  },
  {
    pattern: /;\s*props: any\s*/g,
    replacement: ';\n\n',
    description: 'Remove props:any after semicolon'
  },
  {
    pattern: /,\s*props: any\s*/g,
    replacement: '\n',
    description: 'Remove props:any after comma'
  }
];

function fixComponentSyntax(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    for (const { pattern, replacement, description } of syntaxFixes) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
        console.log(`    ✅ ${description}`);
      }
    }
    
    // Additional specific fixes
    
    // Fix broken JSX closing tags
    content = content.replace(/>\s*\|\s*</g, '><');
    
    // Fix malformed function parameters
    content = content.replace(/\(\s*{\s*([^}]+)\s*}\s*,\s*{\s*([^}]+)\s*}\s*\)/g, '({ $1, $2 })');
    
    // Fix import statements that got merged
    content = content.replace(/';import/g, "';\nimport");
    content = content.replace(/;import/g, ';\nimport');
    
    if (modified || content !== fs.readFileSync(filePath, 'utf8')) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`    ❌ Error: ${error.message}`);
    return false;
  }
}

async function fixAllComponents() {
  console.log('📁 Finding all component files with syntax errors...');
  
  try {
    // Get all component files with syntax issues
    const result = execSync(`find src/components -name "*.tsx" -exec grep -l "props: any\\|'use client'import\\|return (;" {} \\;`, 
      { encoding: 'utf8', cwd: PROJECT_ROOT });
    
    const files = result.trim().split('\n').filter(f => f.trim());
    
    console.log(`Found ${files.length} component files to fix`);
    
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const file of files) {
      console.log(`🔧 Fixing ${file}...`);
      
      const filePath = path.join(PROJECT_ROOT, file);
      
      if (fixComponentSyntax(filePath)) {
        fixedCount++;
        console.log(`  ✅ Fixed ${file}`);
      } else {
        console.log(`  ⏭️  No changes needed in ${file}`);
      }
    }
    
    console.log(`\n🎯 Results:`);
    console.log(`  ✅ Fixed: ${fixedCount} files`);
    console.log(`  ⏭️  Unchanged: ${files.length - fixedCount} files`);
    
    return fixedCount;
  } catch (error) {
    console.log('❌ Error finding component files:', error.message);
    return 0;
  }
}

// Also fix any remaining page files
async function fixRemainingPages() {
  console.log('\n📁 Fixing remaining page files...');
  
  const pageFiles = [
    'src/app/admin/dashboard/page.tsx',
    'src/app/admin/debug/page.tsx',
    'src/app/admin/login/page.tsx',
    'src/app/admin/mcp/page.tsx',
    'src/app/admin/page.tsx',
    'src/app/admin/performance/page.tsx'
  ];
  
  let fixedPages = 0;
  
  for (const file of pageFiles) {
    const filePath = path.join(PROJECT_ROOT, file);
    
    if (fs.existsSync(filePath)) {
      console.log(`🔧 Fixing ${file}...`);
      
      if (fixComponentSyntax(filePath)) {
        fixedPages++;
        console.log(`  ✅ Fixed ${file}`);
      }
    }
  }
  
  return fixedPages;
}

// Run the comprehensive fixes
async function main() {
  const componentsFixed = await fixAllComponents();
  const pagesFixed = await fixRemainingPages();
  
  const totalFixed = componentsFixed + pagesFixed;
  
  console.log(`\n🎉 Comprehensive syntax fix completed!`);
  console.log(`📊 Total files fixed: ${totalFixed}`);
  
  if (totalFixed > 0) {
    console.log('\n💡 You can now try building again with: npm run build');
  }
}

main().catch(error => {
  console.error('❌ Comprehensive fix failed:', error.message);
  process.exit(1);
});