const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixSyntaxErrors(content) {
  // Fix semicolons in object literals - more comprehensive
  let fixed = content;
  
  // Fix semicolons in object properties
  fixed = fixed.replace(/(\w+)\s*:\s*([^,;{}]+);(\s*\n?\s*\w+\s*:)/g, '$1: $2,$3');
  fixed = fixed.replace(/(\w+)\s*:\s*([^,;{}]+);(\s*\n?\s*})/g, '$1: $2$3');
  
  // Fix semicolons in function parameters
  fixed = fixed.replace(/\.min\((\d+)\)\.max\((\d+)\);/g, '.min($1).max($2),');
  fixed = fixed.replace(/\.max\((\d+)\);/g, '.max($1),');
  fixed = fixed.replace(/\.optional\(\);/g, '.optional(),');
  
  // Fix template strings with semicolons
  fixed = fixed.replace(/(\w+)\s*:\s*(["'`][^"'`]+["'`]);(\s*\n?\s*\w+\s*:)/g, '$1: $2,$3');
  
  // Fix specific known patterns
  fixed = fixed.replace(/authenticated: false;/g, 'authenticated: false,');
  fixed = fixed.replace(/settings \|\| \{\};/g, 'settings || {},');
  fixed = fixed.replace(/\.toISOString\(\);(\s*\n?\s*\w+\s*:)/g, '.toISOString(),$1');
  
  return fixed;
}

// Find all TypeScript/JavaScript files
const files = glob.sync('src/**/*.{ts,tsx}', { cwd: process.cwd() });

let totalFixed = 0;
files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixSyntaxErrors(content);
    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed);
      console.log('Fixed: ' + file);
      totalFixed++;
    }
  } catch (err) {
    // Skip files that can't be read
  }
});

console.log(`\nTotal files fixed: ${totalFixed}`);