const fs = require('fs');
const path = require('path');

const syntaxErrorPatterns = [
  // Fix semicolons instead of commas in objects
  {
    pattern: /(\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*:\s*[^,\n]+);(\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*:)/g,
    replacement: '$1,$2'
  },
  // Fix trailing semicolons in JSX
  {
    pattern: /(<\/[^>]+>)\s*;\s*(\n\s*\))/g,
    replacement: '$1$2'
  },
  // Fix fetch syntax with extra commas
  {
    pattern: /fetch\([^,]+,\s*\{,/g,
    replacement: 'fetch($1, {'
  },
  // Fix object/array syntax errors
  {
    pattern: /\[\s*;/g,
    replacement: '['
  },
  {
    pattern: /\{\s*,/g,
    replacement: '{'
  },
  // Fix cva function call syntax
  {
    pattern: /cva\(\s*;/g,
    replacement: 'cva('
  },
  // Fix function declaration with extra semicolon
  {
    pattern: /=>\s*\{;/g,
    replacement: '=> {'
  },
  // Fix extra semicolons after closing braces in JSX
  {
    pattern: /\}\s*;\s*\)/g,
    replacement: '}'
  }
];

function fixSyntaxErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    syntaxErrorPatterns.forEach(({ pattern, replacement }) => {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let fixedCount = 0;
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
      fixedCount += processDirectory(fullPath);
    } else if (file.isFile() && (file.name.endsWith('.tsx') || file.name.endsWith('.ts'))) {
      if (fixSyntaxErrors(fullPath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

// Process src directory
const srcDir = path.join(process.cwd(), 'src');
console.log('Scanning for syntax errors in:', srcDir);

const totalFixed = processDirectory(srcDir);
console.log(`\nTotal files fixed: ${totalFixed}`);