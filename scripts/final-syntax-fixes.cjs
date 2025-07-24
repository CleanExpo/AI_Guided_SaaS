const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Specific files with known issues
const specificFixes = [
  {
    file: 'src/app/analytics/page.tsx',
    fixes: [
      { find: '        ];', replace: '        ],' }
    ]
  },
  {
    file: 'src/app/api/admin/analytics/route.ts',
    fixes: [
      { find: 'bounceRate: 23.4;', replace: 'bounceRate: 23.4,' }
    ]
  },
  {
    file: 'src/app/api/admin/debug/route.ts',
    fixes: [
      { find: '            };', replace: '            },' }
    ]
  },
  {
    file: 'src/app/api/admin/stats/route.ts',
    fixes: [
      { find: '            };', replace: '            },' }
    ]
  },
  {
    file: 'src/app/api/admin/users/[id]/route.ts',
    fixes: [
      { find: 'id: userId;', replace: 'id: userId,' }
    ]
  }
];

// More general patterns to fix
const patterns = [
  // Fix semicolons after closing braces in object property contexts
  {
    pattern: /(\s+)};(\s+\w+:)/g,
    replacement: '$1},$2',
    description: 'Fix object closing with semicolon before property'
  },
  // Fix semicolons after array closing brackets in object property contexts  
  {
    pattern: /(\s+)];(\s+\w+:)/g,
    replacement: '$1],$2',
    description: 'Fix array closing with semicolon before property'
  },
  // Fix semicolons after values in object literals
  {
    pattern: /(\w+:\s*[\d.]+);(\s*\w+[,:])/g,
    replacement: '$1,$2',
    description: 'Fix numeric property semicolons'
  },
  // Fix object property with spread operator
  {
    pattern: /(\w+:\s*\w+);(\s*\.\.\.)/g,
    replacement: '$1,$2',
    description: 'Fix property semicolon before spread'
  }
];

console.log('Applying specific fixes...');

// Apply specific fixes first
specificFixes.forEach(({ file, fixes }) => {
  const filePath = path.join(__dirname, '..', file);
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    fixes.forEach(({ find, replace }) => {
      if (content.includes(find)) {
        content = content.replace(find, replace);
        changed = true;
        console.log(`Fixed in ${file}: ${find} -> ${replace}`);
      }
    });
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log('\nApplying general pattern fixes...');

// Find all TypeScript and JavaScript files
const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
  cwd: path.join(__dirname, '..')
});

let totalFixed = 0;

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
    
    if (fileChanged) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      totalFixed++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nFixed syntax errors in ${totalFixed} files`);