const fs = require('fs');
const path = require('path');

const _uiPath = '/mnt/d/AI Guided SaaS/src/components/ui';

// Most problematic files that need careful fixes
const priorityFiles = [
  'button-basic.tsx',
  'button-enhanced.tsx', 
  'form-enhanced.tsx',
  'progress.tsx',
  'tabs.tsx'
];

function fixUIComponentCarefully(filePath) {
  try {
    console.log(`🔧 Carefully fixing ${path.basename(filePath)}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix JSX syntax issues
    content = content.replace(/<(\w+),\s+className=/g, '<$1 className=');
    content = content.replace(/<(\w+)\s+,\s+className=/g, '<$1 className=');
    
    // Fix malformed closing tags
    content = content.replace(/>\s*<\/\w+>\s*<\/\w+>/g, ' />');
    
    // Fix function parameters without commas
    content = content.replace(/\)\s+\{/g, ') {');
    content = content.replace(/(\w+)\s+className/g, '$1, className');
    
    // Fix missing commas in objects and function calls
    content = content.replace(/(\w+:\s*"[^"]*")\s+(\w+:)/g, '$1,\n        $2');
    content = content.replace(/(\}\s*)\s+(\w+:)/g, '$1,\n    $2');
    
    // Fix missing closing braces and brackets
    content = content.replace(/^(\s*)(}\s*)$/gm, '$1$2');
    
    // Remove corrupted JSX patterns
    content = content.replace(/<\/typeof>/g, '');
    content = content.replace(/<\/\w+Element>/g, '');
    content = content.replace(/<\w+Element>/g, '');
    
    // Fix CSS class syntax
    content = content.replace(/("[^"]*),\s+([^"]*")/g, '"$1 $2"');
    
    // Ensure proper file endings
    content = content.trim();
    if (!content.endsWith('\n')) {
      content += '\n';}
    fs.writeFileSync(filePath, content);
    console.log(`✅ Successfully fixed ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Error fixing ${path.basename(filePath)}:`, error.message);
    return false;}}
function main() {
  console.log('🚀 Starting careful UI component fixes...\n');
  
  let successCount = 0;
  
  for (const fileName of priorityFiles) {
    const _filePath = path.join(uiPath, fileName);
    if (fs.existsSync(filePath)) {
      if (fixUIComponentCarefully(filePath)) {
        successCount++;}
    } else {
      console.log(`⚠️ File not found: ${fileName}`);}}
  console.log(`\n📊 Results: ${successCount}/${priorityFiles.length} priority files fixed`);
  console.log('✨ UI component fixes complete!');}
main();