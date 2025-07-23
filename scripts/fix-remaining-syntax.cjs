const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Enhanced syntax error fixes
function fixRemainingSyntaxErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Fix 'use client' directive position
    content = content.replace(/^import React from 'react';\n'use client';/, "'use client';\n\nimport React from 'react';");
    
    // Fix missing closing JSX tags
    content = content.replace(/(\s+)<\/div>\s*\);\s*}\s*$/gm, '$1      </div>\n$1    );\n$1  }');
    
    // Fix conditions without closing brackets
    content = content.replace(/\s+\);\n}\n\s+if\(/g, '      </div>\n    );\n  }\n  \n  if(');
    
    // Fix return statements with missing closing div
    content = content.replace(/(<div[^>]*>)<div/g, function(match, p1) {
      const openDivs = (content.substring(0, content.indexOf(match)).match(/<div/g) || []).length;
      const closeDivs = (content.substring(0, content.indexOf(match)).match(/<\/div>/g) || []).length;
      if (openDivs > closeDivs) {
        return p1 + '\n        <div';
      }
      return match;
    });
    
    // Fix JSX elements with spaces before self-closing
    content = content.replace(/<(\w+)(\s+[^>]*?)\s+\/>/g, '<$1$2 />');
    
    // Fix incorrect commas in grid classes
    content = content.replace(/grid gap-6,\s*md:grid-cols/g, 'grid gap-6 md:grid-cols');
    content = content.replace(/grid gap-4,\s*md:grid-cols/g, 'grid gap-4 md:grid-cols');
    content = content.replace(/grid gap-8,\s*md:grid-cols/g, 'grid gap-8 md:grid-cols');
    
    // Fix focus classes with commas
    content = content.replace(/rounded-md,\s*focus:outline-none,\s*focus:ring-2/g, 'rounded-md focus:outline-none focus:ring-2');
    
    // Fix conditional rendering syntax
    content = content.replace(/\{([^}]+)\s+&&\s*\(([^)]+)\s*\)\s*}/g, '{$1 && (\n$2\n              )}');
    
    // Fix template literal in JSX
    content = content.replace(/href=\{`([^`]+)`}`/g, 'href={`$1`}');
    
    // Fix inline comments in JSX
    content = content.replace(/>\s*\/\/\s*([^<\n]+)\s*</g, '>\n                    $1\n                  <');
    
    // Fix object syntax in interfaces
    content = content.replace(/interface\s+(\w+)\s*{\s*([^}]+),\s*}/g, function(match, name, props) {
      const fixedProps = props.replace(/,(\s*[a-zA-Z])/g, ';\n  $1').replace(/,\s*$/g, ';');
      return `interface ${name} {\n  ${fixedProps}\n}`;
    });
    
    // Fix missing closing brackets in nested JSX
    let openDivCount = (content.match(/<div/g) || []).length;
    let closeDivCount = (content.match(/<\/div>/g) || []).length;
    
    if (openDivCount > closeDivCount) {
      const missingDivs = openDivCount - closeDivCount;
      // Add missing closing divs before the final closing brace
      content = content.replace(/(\s*)\);?\s*}\s*$/, (match, spaces) => {
        let closingDivs = '';
        for (let i = 0; i < missingDivs; i++) {
          closingDivs += spaces + '</div>\n';
        }
        return closingDivs + match;
      });
    }
    
    // Fix props declaration at the beginning
    content = content.replace(/^props: any/gm, '');
    
    // Fix object/array trailing commas
    content = content.replace(/,(\s*[}\]])/g, '$1');
    
    // Fix template string issues
    content = content.replace(/`\n\s*}/g, '`\n  }');
    
    // Only write if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Find all TSX files
const srcDir = path.join(__dirname, '..', 'src');
const files = glob.sync('**/*.tsx', { cwd: srcDir, absolute: true });

let fixedCount = 0;
let errorCount = 0;

console.log('Scanning files for remaining syntax errors...\n');

files.forEach(file => {
  if (fixRemainingSyntaxErrors(file)) {
    console.log(`Fixed: ${path.relative(srcDir, file)}`);
    fixedCount++;
  }
});

console.log(`\nFixed ${fixedCount} files`);
if (errorCount > 0) {
  console.log(`Failed to fix ${errorCount} files`);
}