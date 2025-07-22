const fs = require('fs');
const path = require('path');

const adminPagesPath = '/mnt/d/AI Guided SaaS/src/app/admin';

function fixAdminPageJSX(filePath) {
  try {
    console.log(`🔧 Fixing ${path.basename(filePath)}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix malformed closing tags at end of files
    content = content.replace(/\s*<\/\w+>\s*<\/\w+>\s*\)\s*;\s*$/s, '\n  );\n}');
    content = content.replace(/\s*<\/\w+>\s*<\/\w+>\s*$/s, '\n  );\n}');
    
    // Fix missing commas in className expressions
    content = content.replace(/("[\w\s-]+")(\s+\w+\s+&&)/g, '$1,$2');
    
    // Fix missing semicolons in state declarations
    content = content.replace(/useState\([^)]+\)(\s*const)/g, 'useState$1;$2');
    content = content.replace(/useRouter\(\)(\s*const)/g, 'useRouter();$2');
    
    // Fix interface definitions with malformed semicolons
    content = content.replace(/:\s*string\s*;\s*\w+:/g, ': string;\n  $2:');
    content = content.replace(/\[](\s*;\s*})/g, '[]$1');
    
    // Remove duplicate closing braces
    content = content.replace(/}\s*}\s*$/, '}');
    
    // Ensure proper file ending
    content = content.trim();
    if (!content.endsWith('}')) {
      content += '\n}';
    }
    if (!content.endsWith('\n')) {
      content += '\n';
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Error fixing ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

function getAllTsxFiles(dir) {
  const files = [];
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        files.push(...getAllTsxFiles(fullPath));
      } else if (item.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  return files;
}

function main() {
  console.log('🚀 Fixing JSX syntax errors in admin pages...\n');
  
  const allFiles = getAllTsxFiles(adminPagesPath);
  let successCount = 0;
  
  console.log(`Found ${allFiles.length} TSX files in admin pages\n`);
  
  for (const filePath of allFiles) {
    if (fixAdminPageJSX(filePath)) {
      successCount++;
    }
  }
  
  console.log(`\n📊 Results: ${successCount}/${allFiles.length} admin pages fixed`);
  console.log('✨ Admin pages JSX fixes complete!');
}

main();