const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Pattern to fix: "props: anyexport" -> "export"
function fixSyntaxErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix "props: anyexport default function" pattern
    content = content.replace(/props: anyexport default function (\w+)\(\): void {/g, 'export default function $1() {');
    
    // Fix "props: anyexport function" pattern
    content = content.replace(/props: anyexport function (\w+)\(\): void {/g, 'export function $1() {');
    
    // Fix standalone closing tags (e.g., "<Component   />")
    content = content.replace(/<(\w+)\s+\/>/g, '<$1 />');
    
    // Fix comma errors in class names
    content = content.replace(/className="([^"]*),\s*([^"]*)"/g, 'className="$1 $2"');
    
    // Fix template literal errors with extra backticks
    content = content.replace(/>`\n/g, '>\n');
    content = content.replace(/\n`</g, '\n<');
    
    // Fix semicolons that should be commas in object literals
    content = content.replace(/(\w+):\s*\[([^\]]+)\];\n(\s+)(\w+):/g, '$1: [$2],\n$3$4:');
    
    // Fix unterminated template literals
    content = content.replace(/content: `([^`]+)`,`/g, 'content: `$1`,');
    
    // Fix object syntax errors with semicolons
    content = content.replace(/(\w+);\n(\s+)(\w+):/g, '$1,\n$2$3:');
    content = content.replace(/(\w+):\s*'([^']+)';\n(\s+)(\w+):/g, "$1: '$2',\n$3$4:");
    
    // Write fixed content back
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Find all TSX files with syntax errors
const srcDir = path.join(__dirname, '..', 'src');
const files = glob.sync('**/*.tsx', { cwd: srcDir, absolute: true });

let fixedCount = 0;
let errorCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('props: anyexport') || 
      content.includes('   />') ||
      content.includes('`,`') ||
      content.includes('className="') && content.includes(',')) {
    console.log(`Fixing: ${path.relative(srcDir, file)}`);
    if (fixSyntaxErrors(file)) {
      fixedCount++;
    } else {
      errorCount++;
    }
  }
});

console.log(`\nFixed ${fixedCount} files`);
if (errorCount > 0) {
  console.log(`Failed to fix ${errorCount} files`);
}