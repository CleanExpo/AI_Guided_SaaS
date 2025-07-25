const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to fix common syntax errors in TypeScript files
function fixSyntaxErrors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const originalContent = content;

  // Fix missing function declarations
  content = content.replace(/^(\s*)(\w+)\(([\w\s:,]+)\):\s*(\w+)\s*{/gm, '$1function $2($3): $4 {');
  if (content !== originalContent) modified = true;

  // Fix object syntax errors (missing commas)
  content = content.replace(/(\w+):\s*z\.(string|number|boolean|enum|record|object|any)\([^)]*\)\s+(\w+):/g, 
    '$1: z.$2(),$3:');
  if (content !== originalContent) modified = true;

  // Fix object literal errors - replace ; with ,
  content = content.replace(/({[^}]*?);\s*(\w+:)/g, '$1,$2');
  if (content !== originalContent) modified = true;

  // Fix function parameter lists
  content = content.replace(/z\.(string|number|boolean)\(\s*,/g, 'z.$1(),');
  if (content !== originalContent) modified = true;

  // Fix object property syntax errors
  content = content.replace(/(\w+):\s*([^,;{}]+);(\s*})/g, '$1: $2$3');
  if (content !== originalContent) modified = true;

  // Fix trailing }) at end of files
  content = content.replace(/}\s*}\s*\)\s*$/g, '    }\n}');
  if (content !== originalContent) modified = true;

  // Fix missing commas in object properties
  content = content.replace(/(\w+):\s*(['"]?[\w\s-]+['"]?)\s+(\w+):/g, '$1: $2, $3:');
  if (content !== originalContent) modified = true;

  // Fix parenthesis errors in new Date().toISOString(
  content = content.replace(/new Date\(\)\.toISOString\(\s*,/g, 'new Date().toISOString(),');
  if (content !== originalContent) modified = true;

  // Fix Math.random() syntax errors
  content = content.replace(/Math\.random\(\)\.toString\(36\)\.substr\(2,\s*9\s*,/g, 
    'Math.random().toString(36).substr(2, 9),');
  if (content !== originalContent) modified = true;

  // Fix z.object parameters
  content = content.replace(/z\.object\(\{\s*(\w+):\s*z\.([\w]+)\(([^)]*)\)\s*,\s*(\w+):\s*z/g,
    'z.object({ $1: z.$2($3), $4: z');
  if (content !== originalContent) modified = true;

  // Fix const object = { syntax
  content = content.replace(/const\s+(\w+)\s*=\s*{\s*id:\s*['"]\w+['"]?\s*\+\s*Math\.random\(\)\.toString\(36\)\.substr\(2,\s*9\s*,/g,
    'const $1 = { id: \'$1_\' + Math.random().toString(36).substr(2, 9),');
  if (content !== originalContent) modified = true;

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed syntax errors in: ${filePath}`);
    return true;
  }
  return false;
}

// Find all TypeScript files in src/app/api
const files = glob.sync('src/app/api/**/*.ts', { cwd: process.cwd() });

console.log(`Found ${files.length} TypeScript files to check...`);

let fixedCount = 0;
files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fixSyntaxErrors(fullPath)) {
    fixedCount++;
  }
});

console.log(`\nFixed syntax errors in ${fixedCount} files.`);