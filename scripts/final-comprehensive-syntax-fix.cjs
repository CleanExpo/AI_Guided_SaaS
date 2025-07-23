const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixAllSyntaxErrors(content) {
  let fixed = content;
  
  // Fix semicolons in object literals - comprehensive patterns
  // Pattern 1: property: value; with newline and next property
  fixed = fixed.replace(/(\w+)\s*:\s*([^,;{}]+);(\s*\n\s*\w+\s*:)/g, '$1: $2,$3');
  
  // Pattern 2: property: value; with closing brace
  fixed = fixed.replace(/(\w+)\s*:\s*([^,;{}]+);(\s*\n\s*})/g, '$1: $2$3');
  
  // Pattern 3: string property values with semicolons
  fixed = fixed.replace(/(\w+)\s*:\s*(["'`][^"'`]+["'`]);(\s*\n\s*\w+\s*:)/g, '$1: $2,$3');
  fixed = fixed.replace(/(\w+)\s*:\s*(["'`][^"'`]+["'`]);(\s*\n\s*})/g, '$1: $2$3');
  
  // Pattern 4: boolean/null values with semicolons
  fixed = fixed.replace(/(\w+)\s*:\s*(true|false|null|undefined);(\s*\n\s*\w+\s*:)/g, '$1: $2,$3');
  fixed = fixed.replace(/(\w+)\s*:\s*(true|false|null|undefined);(\s*\n\s*})/g, '$1: $2$3');
  
  // Pattern 5: function calls with semicolons
  fixed = fixed.replace(/(\w+)\s*:\s*(!!?[^,;]+);(\s*\n\s*\w+\s*:)/g, '$1: $2,$3');
  fixed = fixed.replace(/(\w+)\s*:\s*(!!?[^,;]+);(\s*\n\s*})/g, '$1: $2$3');
  
  // Pattern 6: array/object property values
  fixed = fixed.replace(/(\w+)\s*:\s*(\[[^\]]+\]);(\s*\n\s*\w+\s*:)/g, '$1: $2,$3');
  fixed = fixed.replace(/(\w+)\s*:\s*(\{[^}]+\});(\s*\n\s*\w+\s*:)/g, '$1: $2,$3');
  
  // Fix interface/type definitions with semicolons instead of commas
  fixed = fixed.replace(/(\w+)\s*:\s*(\w+),(\s*\n\s*\w+)\s*:\s*(\w+);/g, '$1: $2,$3: $4,');
  
  // Fix specific patterns found in error messages
  fixed = fixed.replace(/process\.env\.EMAIL_PROVIDER \|\| 'none';/g, "process.env.EMAIL_PROVIDER || 'none',");
  fixed = fixed.replace(/process\.env\.npm_package_version \|\| '1\.0\.0';/g, "process.env.npm_package_version || '1.0.0',");
  fixed = fixed.replace(/feedback: feedbackList;/g, 'feedback: feedbackList,');
  fixed = fixed.replace(/!!process\.env\.DATABASE_URL;/g, '!!process.env.DATABASE_URL,');
  fixed = fixed.replace(/!!process\.env\.NEXTAUTH_SECRET;/g, '!!process.env.NEXTAUTH_SECRET,');
  
  // Fix method chaining with semicolons
  fixed = fixed.replace(/\.min\((\d+)\)\.max\((\d+)\);(\s*\n\s*\w+\s*:)/g, '.min($1).max($2),$3');
  fixed = fixed.replace(/\.max\((\d+)\);(\s*\n\s*\w+\s*:)/g, '.max($1),$2');
  fixed = fixed.replace(/\.optional\(\);(\s*\n\s*\w+\s*:)/g, '.optional(),$1');
  
  // Fix trailing semicolons in object/array definitions
  fixed = fixed.replace(/,(\s*\n\s*);/g, '$1');
  
  // Fix double semicolons
  fixed = fixed.replace(/;;/g, ';');
  
  // Fix closing braces with extra semicolons
  fixed = fixed.replace(/}\s*;\s*}/g, '}}');
  
  return fixed;
}

// Process all TypeScript/JavaScript files
console.log('Starting comprehensive syntax fix...\n');

const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', { cwd: process.cwd() });
console.log(`Found ${files.length} files to check\n`);

let totalFixed = 0;
const fixedFiles = [];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixAllSyntaxErrors(content);
    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed);
      fixedFiles.push(file);
      totalFixed++;
    }
  } catch (err) {
    // Skip files that can't be read
  }
});

console.log('\nFixed files:');
fixedFiles.forEach(file => console.log(`  - ${file}`));
console.log(`\nTotal files fixed: ${totalFixed}`);
console.log('\nSyntax fix complete!');