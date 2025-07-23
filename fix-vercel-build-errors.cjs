const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Common syntax error patterns to fix
const fixes = [
  // Fix duplicate closing tags
  {
    pattern: /<\/(\w+)>\s*<\/\1>/g,
    replacement: (match, tag) => `</${tag}>`
  },
  // Fix missing commas in objects
  {
    pattern: /(['"]\s*)(page|icon|status|role|type|slug|title|name|description):/g,
    replacement: '$1, $2:'
  },
  // Fix missing commas after numbers
  {
    pattern: /(\d+)\s+(page|icon|status|role|type|slug|title|name|description):/g,
    replacement: '$1, $2:'
  },
  // Fix className with invalid values
  {
    pattern: /className="\$\d+"/g,
    replacement: 'className=""'
  },
  // Fix unclosed JSX
  {
    pattern: /<\/p>\s*<\/p>/g,
    replacement: '</p>'
  },
  // Fix malformed return statements
  {
    pattern: /\);\s*}/g,
    replacement: ');\n}'
  },
  // Fix missing semicolons after closing braces
  {
    pattern: /}\s*\n\s*export/g,
    replacement: '}\n\nexport'
  }
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Apply general fixes
    fixes.forEach(fix => {
      const newContent = content.replace(fix.pattern, fix.replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    // File-specific fixes
    if (filePath.includes('dashboard/page.tsx')) {
      content = content.replace(/}\s*$/m, ');\n}');
      modified = true;
    }
    
    if (filePath.includes('SelfCheckTrigger.tsx')) {
      content = content.replace(/onReportGenerated\?\s*\(/g, 'onReportGenerated?: (');
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Get all TypeScript/TSX files
const files = glob.sync('src/**/*.{ts,tsx}', { cwd: process.cwd() });

let totalFixed = 0;
files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fixFile(fullPath)) {
    totalFixed++;
    console.log(`Fixed: ${file}`);
  }
});

console.log(`\nTotal files fixed: ${totalFixed}`);