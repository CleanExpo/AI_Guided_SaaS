#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🧹 Final syntax cleanup...\n');

// Get all TS/TSX files
const files = glob.sync('src/**/*.{ts,tsx}', { 
  cwd: process.cwd(),
  ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**']
});

let totalFixed = 0;

files.forEach(file => {
  try {
    const filePath = path.join(process.cwd(), file);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fileFixed = false;
    
    // Remove duplicate "No newline at end of file" and closing tags at end
    content = content.replace(/(\n\s*<\/\w+>\s*)+\n\s*\}\s*\nNo newline at end of file$/gm, '\n}\n');
    
    // Fix function signatures with extra colons
    content = content.replace(/: void: \(any\)/g, ': void');
    content = content.replace(/\): void: \(any\)/g, '): void');
    
    // Fix semicolons after commas in object literals
    content = content.replace(/,\s*;/g, ',');
    
    // Fix interface property syntax
    content = content.replace(/(\w+)\s*:\s*;/g, '$1: any;');
    
    // Fix missing semicolons in interfaces
    content = content.replace(/interface\s+\w+\s*{([^}]+)}/g, (match, props) => {
      const fixed = props.replace(/(\w+\s*:\s*[^,;]+)(?=[^\s,;])/g, '$1;');
      return match.replace(props, fixed);
    });
    
    // Remove extra closing braces at end of files
    content = content.replace(/\}\s*\n\s*\}\s*$/g, '}\n');
    
    // Fix common import issues
    content = content.replace(/^'use client';?\s*import/gm, "'use client';\n\nimport");
    
    // Fix double exports
    content = content.replace(/export\s+default\s+.*?\n\s*export\s+default\s+/g, 'export default ');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      totalFixed++;
      console.log(`✅ Cleaned ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log(`\n✨ Complete! Cleaned ${totalFixed} files.`);