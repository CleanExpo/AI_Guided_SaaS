const fs = require('fs');
const path = require('path');

const _uiPath = '/mnt/d/AI Guided SaaS/src/components/ui';

function fixComplexJSXErrors(filePath) {
  try {
    console.log(`Fixing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Fix missing commas in className concatenation
    content = content.replace(/(\w+)\s+className/g, '$1, className');
    content = content.replace(/className\s+\}\)/g, ', className })');
    
    // Fix malformed JSX self-closing tags with extra content
    content = content.replace(/<(\w+)([^>]*)>\s*<\/[^>]*>\s*<\/\w+>/g, '<$1$2 />');
    
    // Fix malformed spinner syntax
    content = content.replace(/<Spinner([^>]*)>\s*<\/Spinner>/g, '<Spinner$1 />');
    
    // Fix missing commas in function parameters
    content = content.replace(/icon:\s*React\.ReactNode,?\s*$/gm, 'icon: React.ReactNode;');
    
    // Fix stray closing braces and brackets
    content = content.replace(/^\s*}\s*$/gm, '');
    
    // Fix missing return statements in components
    content = content.replace(/(\s+)(<\w+[^>]*>[\s\S]*?<\/\w+>)(\s+})/g, '$1return ($2)$3');
    
    // Fix malformed forwardRef patterns
    content = content.replace(/\)\s*}\s*$/g, ')\n');
    
    // Remove duplicate export statements at the end
    content = content.replace(/export\s*\{\s*\}\s*$/, '');
    
    // Ensure proper file ending
    content = content.trim() + '\n';
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️ No changes needed for ${filePath}`);
      return true;}
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;}}
// Get all tsx files in ui directory
function getAllTsxFiles() {
  try {
    return fs.readdirSync(uiPath)
      .filter(file => file.endsWith('.tsx'))
      .map(file => path.join(uiPath, file));
  } catch (error) {
    console.error('Error reading UI directory:', error.message);
    return [];}}
function main() {
  console.log('🔧 Fixing remaining JSX syntax errors in UI components...\n');
  
  const allFiles = getAllTsxFiles();
  let fixedCount = 0;
  
  for (const filePath of allFiles) {
    if (fixComplexJSXErrors(filePath)) {
      fixedCount++;}}
  console.log(`\n📊 Results: ${fixedCount}/${allFiles.length} files processed`);
  console.log('✅ Complex JSX error fixing complete!');}
main();