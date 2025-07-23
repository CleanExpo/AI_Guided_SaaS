const fs = require('fs');
const path = require('path');

// Fix patterns
const fixes = [
  // Missing commas in metadata objects
  {
    pattern: /title:\s*'[^']+'\s*description:/g,
    replacement: (match) => match.replace(/'\s*description:/, "',\n  description:")
  },
  // Missing commas in arrays of objects
  {
    pattern: /label:\s*'[^']+'\s*value:/g,
    replacement: (match) => match.replace(/'\s*value:/, "', value:")
  },
  {
    pattern: /label:\s*'[^']+'\s*icon:/g,
    replacement: (match) => match.replace(/'\s*icon:/, "', icon:")
  },
  // Missing commas in theme objects
  {
    pattern: /value:\s*'[^']+'\s*icon:/g,
    replacement: (match) => match.replace(/'\s*icon:/, "', icon:")
  },
  // Fix JSX structure issues
  {
    pattern: /<div className="[^"]+"><\/div>\s*<div className="/g,
    replacement: '<div className="$1">\n        <div className="'
  }
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    fixes.forEach(fix => {
      const newContent = content.replace(fix.pattern, fix.replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Files to fix based on the error output
const filesToFix = [
  'src/app/community/guidelines/page.tsx',
  'src/app/community/page.tsx',
  'src/app/config/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/cookies/page.tsx'
];

let totalFixed = 0;
filesToFix.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    if (fixFile(fullPath)) {
      totalFixed++;
    }
  } else {
    console.log(`File not found: ${fullPath}`);
  }
});

console.log(`\nTotal files fixed: ${totalFixed}`);