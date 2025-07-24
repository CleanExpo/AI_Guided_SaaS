const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Patterns to fix
const patterns = [
  // Fix semicolons in object literals (inside arrays)
  {
    pattern: /(\{[^}]*\}),?\s*;(\s*\{)/g,
    replacement: '$1,$2',
    description: 'Fix semicolons between objects in arrays'
  },
  // Fix semicolons at end of object properties (when followed by another property)
  {
    pattern: /([,:])\s*([^,;{}]+);(\s*[a-zA-Z_$][\w$]*\s*:)/g,
    replacement: '$1 $2,$3',
    description: 'Fix semicolons in object properties'
  },
  // Fix trailing semicolons in JSX
  {
    pattern: /(<\/[^>]+>)\s*;(\s*\))/g,
    replacement: '$1$2',
    description: 'Fix trailing semicolons after JSX closing tags'
  },
  // Fix cva() or cn() calls with semicolons
  {
    pattern: /((?:cva|cn)\s*\(\s*);/g,
    replacement: '$1',
    description: 'Fix semicolons after cva/cn opening parenthesis'
  },
  // Fix missing commas in fetch options
  {
    pattern: /(headers:\s*\{[^}]+\})\s+(?=body:)/g,
    replacement: '$1,\n        ',
    description: 'Fix missing commas between fetch options'
  },
  // Fix semicolons in arrays (generic)
  {
    pattern: /(\[[^\]]*\{[^}]*\})\s*;(\s*\{)/g,
    replacement: '$1,$2',
    description: 'Fix semicolons in arrays'
  },
  // Fix object property ending with semicolon when inside object literal
  {
    pattern: /(\w+:\s*['"`][^'"`]+['"`])\s*;\s*(\w+:)/g,
    replacement: '$1,\n    $2',
    description: 'Fix object properties ending with semicolon'
  },
  // Fix numbers/values ending with semicolon in objects
  {
    pattern: /(\w+:\s*\d+(?:\.\d+)?)\s*;\s*(\w+:)/g,
    replacement: '$1,\n    $2',
    description: 'Fix numeric properties ending with semicolon'
  },
  // Fix array items ending with semicolon
  {
    pattern: /(\})\s*;\s*(\])/g,
    replacement: '$1\n  $2',
    description: 'Fix closing brace semicolon before array close'
  },
  // Fix specific pattern for object definitions in arrays
  {
    pattern: /(\w+:\s*\d+(?:\.\d+)?)\s*}\s*;/g,
    replacement: '$1 }',
    description: 'Fix object closing with semicolon'
  },
  // Fix specific URL placeholder pattern
  {
    pattern: /fetch\(\$\d+,/g,
    replacement: "fetch('/api/admin/auth',",
    description: 'Fix URL placeholder in fetch calls'
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
      const matches = content.match(pattern);
      if (matches) {
        newContent = newContent.replace(pattern, replacement);
        fileChanged = true;
        console.log(`  ${description}: ${matches.length} fixes in ${file}`);
      }
    });
    
    // Additional specific fixes
    
    // Fix tabs.tsx specific pattern
    if (file.includes('tabs.tsx') && newContent.includes('className={cn(;')) {
      newContent = newContent.replace(
        /className=\{cn\(;\s*"([^"]+)";\s*className\s*\)\}/g,
        'className={cn(\n      "$1",\n      className\n    )}'
      );
      fileChanged = true;
      console.log(`  Fixed tabs.tsx cn() pattern in ${file}`);
    }
    
    // Fix analytics page pattern
    if (file.includes('analytics/page.tsx') && newContent.includes('percentage: 17.5 };')) {
      newContent = newContent.replace(/percentage: 17\.5 \};/g, 'percentage: 17.5 },');
      fileChanged = true;
      console.log(`  Fixed analytics percentage semicolon in ${file}`);
    }
    
    // Fix api-docs pattern
    if (file.includes('api-docs') && newContent.match(/}\s*;\s*\w+:\s*{/g)) {
      newContent = newContent.replace(/}\s*;\s*(\w+:\s*{)/g, '},\n  $1');
      fileChanged = true;
      console.log(`  Fixed api-docs object separator in ${file}`);
    }
    
    // Fix semicolons after numbers in objects
    if (newContent.match(/(\w+:\s*\d+(?:\.\d+)?)\s*;(\s*\w+:)/g)) {
      newContent = newContent.replace(/(\w+:\s*\d+(?:\.\d+)?)\s*;(\s*\w+:)/g, '$1,$2');
      fileChanged = true;
      console.log(`  Fixed numeric property semicolons in ${file}`);
    }
    
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