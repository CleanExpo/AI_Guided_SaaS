#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing JSX closing tag issues...\n');

// Get all TSX files
const files = glob.sync('src/**/*.tsx', { 
  cwd: process.cwd(),
  ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**']
});

let totalFixed = 0;

files.forEach(file => {
  try {
    const filePath = path.join(process.cwd(), file);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Count opening and closing tags
    const jsxTags = [];
    const tagRegex = /<(\/?)([\w.]+)(?:\s+[^>]*)?>/g;
    let match;
    
    while ((match = tagRegex.exec(content)) !== null) {
      const isClosing = match[1] === '/';
      const tagName = match[2];
      
      if (!isClosing) {
        // Check if it's self-closing
        const selfClosing = match[0].endsWith('/>');
        if (!selfClosing && !['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tagName.toLowerCase())) {
          jsxTags.push(tagName);
        }
      } else {
        // Find matching opening tag
        const lastIndex = jsxTags.lastIndexOf(tagName);
        if (lastIndex !== -1) {
          jsxTags.splice(lastIndex, 1);
        }
      }
    }
    
    // If we have unclosed tags, try to fix them
    if (jsxTags.length > 0) {
      console.log(`Found ${jsxTags.length} unclosed tags in ${file}: ${jsxTags.join(', ')}`);
      
      // Add closing tags before the final closing brace
      const lastBraceIndex = content.lastIndexOf('}');
      if (lastBraceIndex !== -1) {
        const closingTags = jsxTags.reverse().map(tag => `</${tag}>`).join('\n    ');
        content = content.slice(0, lastBraceIndex) + '\n    ' + closingTags + '\n  ' + content.slice(lastBraceIndex);
        totalFixed++;
      }
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log(`\n✨ Complete! Fixed ${totalFixed} files with JSX closing tag issues.`);