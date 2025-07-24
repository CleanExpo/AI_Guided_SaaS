const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Comprehensive patterns to fix
const patterns = [
  // Fix semicolons in Zod schema definitions
  {
    pattern: /(\w+:\s*z\.[^,;]+)\);/g,
    replacement: '$1)',
    description: 'Fix semicolons after Zod schema properties'
  },
  // Fix semicolons in enum definitions
  {
    pattern: /z\.enum\(\[[^\]]+\]\),;/g,
    replacement: (match) => match.replace(/,;/, ','),
    description: 'Fix semicolons after z.enum'
  },
  // Fix duplicate variable declarations with semicolons
  {
    pattern: /const body = await request\.json\(\),\s*\/\/[^,]+,\s*const/g,
    replacement: 'const body = await request.json();\n    // Validate input\n    const',
    description: 'Fix malformed const declarations'
  },
  // Fix object property semicolons
  {
    pattern: /(\w+:\s*['"`][^'"`]+['"`]),;/g,
    replacement: '$1,',
    description: 'Fix semicolons after string properties'
  },
  // Fix multiple closing braces
  {
    pattern: /}\s*}\s*}/g,
    replacement: '  }\n}',
    description: 'Fix multiple closing braces'
  },
  // Fix try-catch errors
  {
    pattern: /} catch \(error\) {\s*;/g,
    replacement: '} catch (error) {',
    description: 'Fix try-catch syntax'
  },
  // Fix invalid const declarations
  {
    pattern: /;\s*\n\s*const (\w+) = \{/g,
    replacement: ';\n\n    const $1 = {',
    description: 'Fix const declarations after semicolons'
  },
  // Fix array type declarations
  {
    pattern: /(\w+):\s*any\[\],/g,
    replacement: '$1: [] as any[],',
    description: 'Fix array type declarations'
  }
];

let totalFixed = 0;
const filesToProcess = [];

// Find all TypeScript and JavaScript files
const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
  cwd: path.join(__dirname, '..')
});

console.log(`Found ${files.length} files to check`);

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let fileChanged = false;
    
    patterns.forEach(({ pattern, replacement, description }) => {
      const matches = [...content.matchAll(pattern)];
      if (matches.length > 0) {
        newContent = newContent.replace(pattern, replacement);
        fileChanged = true;
        console.log(`  ${description}: ${matches.length} fixes in ${file}`);
      }
    });
    
    if (fileChanged) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      filesToProcess.push(file);
      totalFixed++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nFixed syntax errors in ${totalFixed} files`);
if (filesToProcess.length > 0) {
  console.log('\nFiles processed:');
  filesToProcess.forEach(file => console.log(`  - ${file}`));
}