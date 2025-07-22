#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing additional TypeScript syntax errors...\n');

// Find all TypeScript files
const files = glob.sync('**/*.{ts,tsx}', {
  ignore: ['node_modules/**', 'dist/**', '.next/**'],
  cwd: process.cwd()
});

let totalFixed = 0;
let filesFixed = 0;

// Function to fix parameter syntax errors
function fixParameterSyntax(content) {
  let fixed = 0;
  
  // Fix pattern: "param: type: param2:" -> "param: type, param2:"
  content = content.replace(/(\w+):\s*(\w+(?:<[^>]+>)?(?:\[\])?)\s*:\s*(\w+):/g, (match, p1, p2, p3) => {
    fixed++;
    return `${p1}: ${p2}, ${p3}:`;
  });
  
  // Fix pattern in function definitions
  content = content.replace(/\(([^)]+)\)/g, (match, params) => {
    if (params.includes(':') && params.match(/:\s*\w+\s*:/)) {
      const fixedParams = params.replace(/:\s*(\w+(?:<[^>]+>)?(?:\[\])?)\s*:/g, ': $1,');
      if (fixedParams !== params) {
        fixed++;
        return `(${fixedParams})`;
      }
    }
    return match;
  });
  
  return { content, fixed };
}

// Function to fix object literal syntax
function fixObjectLiteralSyntax(content) {
  let fixed = 0;
  
  // Fix pattern: "{ prop: value: prop2: value2 }" -> "{ prop: value, prop2: value2 }"
  const objectPattern = /\{([^}]+)\}/g;
  content = content.replace(objectPattern, (match, contents) => {
    // Skip if it's a type definition or import
    if (match.includes('import') || match.includes('export') || match.includes('interface') || match.includes('type ')) {
      return match;
    }
    
    // Check if it looks like an object literal with syntax errors
    if (contents.match(/\w+:\s*[^,}]+:\s*\w+:/)) {
      const fixedContents = contents.replace(/(\w+:\s*[^,:}]+):\s*(\w+:)/g, '$1, $2');
      if (fixedContents !== contents) {
        fixed++;
        return `{${fixedContents}}`;
      }
    }
    
    return match;
  });
  
  return { content, fixed };
}

// Function to fix JSX syntax errors
function fixJSXSyntax(content) {
  let fixed = 0;
  
  // Fix unclosed JSX tags
  content = content.replace(/(<\w+[^>]*>)([^<]+)$/gm, (match, tag, content) => {
    const tagName = tag.match(/<(\w+)/)[1];
    if (!content.includes(`</${tagName}>`)) {
      fixed++;
      return `${tag}${content}</${tagName}>`;
    }
    return match;
  });
  
  return { content, fixed };
}

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fileFixCount = 0;

  // Apply parameter syntax fixes
  const paramResult = fixParameterSyntax(content);
  content = paramResult.content;
  fileFixCount += paramResult.fixed;
  
  // Apply object literal fixes
  const objectResult = fixObjectLiteralSyntax(content);
  content = objectResult.content;
  fileFixCount += objectResult.fixed;
  
  // Apply JSX fixes for .tsx files
  if (file.endsWith('.tsx')) {
    const jsxResult = fixJSXSyntax(content);
    content = jsxResult.content;
    fileFixCount += jsxResult.fixed;
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${fileFixCount} errors in ${file}`);
    totalFixed += fileFixCount;
    filesFixed++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`Fixed ${totalFixed} errors in ${filesFixed} files`);