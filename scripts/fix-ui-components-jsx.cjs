const fs = require('fs');
const path = require('path');

const _uiPath = '/mnt/d/AI Guided SaaS/src/components/ui';

// Files that need fixing based on grep results
const _filesToFix = [
  'scroll-area.tsx',
  'toast.tsx',
  'button-basic.tsx',
  'dropdown-menu.tsx',
  'label.tsx',
  'navigation-menu.tsx',
  'radio-group.tsx',
  'resizable.tsx',
  'select.tsx',
  'sheet.tsx',
  'use-toast.tsx',
  'button-premium.tsx',
  'separator.tsx',
  'switch.tsx'
];

function fixUIComponent(filePath) {
  try {
    console.log(`Fixing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove malformed closing tags
    content = content.replace(/\s*<\/typeof>\s*/g, '');
    content = content.replace(/\s*<\/HTMLButtonElement>\s*/g, '');
    content = content.replace(/\s*<\/Comp>\s*/g, '');
    content = content.replace(/\s*<\/[A-Z][a-zA-Z]*>\s*\)\)/g, '))');
    
    // Fix malformed className concatenations (missing commas)
    content = content.replace(/className\s*\}\s*\)\)/g, ', className }))}');
    content = content.replace(/(\w+)\s+className\s*\}\s*\)\)/g, '$1, className }))}');
    
    // Fix malformed closing braces at end of files
    content = content.replace(/\}\s*$/, '');
    
    // Fix CSS class strings that are missing commas
    content = content.replace(/(\w+):\s*"([^"]*),\s+([^"]*)",/g, '$1: "$2 $3",');
    content = content.replace(/(\w+):\s*"([^"]*),\s+([^"]*)",/g, '$1: "$2 $3",');
    
    // Ensure proper line endings
    content = content.trim() + '\n';
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;}}
function main() {
  console.log('🔧 Fixing UI component JSX syntax errors...\n');
  
  let fixedCount = 0;
  let totalCount = 0;
  
  for (const fileName of filesToFix) {
    const _filePath = path.join(uiPath, fileName);
    if (fs.existsSync(filePath)) {
      totalCount++;
      if (fixUIComponent(filePath)) {
        fixedCount++;}
    } else {
      console.log(`⚠️ File not found: ${filePath}`);}}
  console.log(`\n📊 Results: ${fixedCount}/${totalCount} files fixed`);
  
  if (fixedCount === totalCount) {
    console.log('✅ All UI components fixed successfully!');
  } else {
    console.log('⚠️ Some files may need manual review');}}
main();