const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to fix common syntax errors in TypeScript files
function fixSyntaxErrors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const originalContent = content;

  // Fix 1: Replace {</NextResponse> with {
  if (content.includes('{</NextResponse>')) {
    content = content.replace(/{<\/NextResponse>/g, '{');
    modified = true;
  }

  // Fix 2: Replace {</string> with {
  if (content.includes('{</string>')) {
    content = content.replace(/{<\/string>/g, '{');
    modified = true;
  }

  // Fix 3: Replace {</typeof> with {
  if (content.includes('{</typeof>')) {
    content = content.replace(/{<\/typeof>/g, '{');
    modified = true;
  }

  // Fix 4: Fix object property syntax - replace ; with ,
  content = content.replace(/(\w+):\s*([^,;{}]+);(\s*\w+:)/g, '$1: $2,$3');
  if (content !== originalContent) modified = true;

  // Fix 5: Fix object literal syntax - replace ={ with = {
  content = content.replace(/=\{(\s*\w+:)/g, '= {$1');
  if (content !== originalContent) modified = true;

  // Fix 6: Fix missing commas in function parameters
  content = content.replace(/(\w+):\s*z\.string\(\)\.[\w]+\([^)]+\)\s+(\w+:)/g, '$1: z.string().$2');
  if (content !== originalContent) modified = true;

  // Fix 7: Fix Record<string type> syntax
  content = content.replace(/Record<string\s+(\w+)>/g, 'Record<string, $1>');
  if (content !== originalContent) modified = true;

  // Fix 8: Fix function declaration syntax
  content = content.replace(/^(\s*)(\w+)\(([^)]+)\)\s*\{/gm, '$1function $2($3) {');
  if (content !== originalContent) modified = true;

  // Fix 9: Fix closing braces at end of file
  content = content.replace(/\}\};(\s*\))*$/g, '    }\n}');
  if (content !== originalContent) modified = true;

  // Fix 10: Remove trailing semicolons after comments
  content = content.replace(/\/\/[^;]+;$/gm, (match) => match.slice(0, -1));
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