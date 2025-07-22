const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Color codes for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Track all fixes
let totalFilesFixed = 0;
let totalTagsFixed = 0;

function analyzeJSXStructure(content, filepath) {
  const lines = content.split('\n');
  let inComponent = false;
  let componentDepth = 0;
  let tagStack = [];
  let fixes = [];
  
  // Find component functions
  const componentRegex = /^(export\s+)?(default\s+)?function\s+\w+.*?\{|^(export\s+)?const\s+\w+.*?=.*?=>.*?\{/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    
    // Track component boundaries
    if (componentRegex.test(line.trim())) {
      inComponent = true;
      componentDepth = 1;
      tagStack = [];
    }
    
    if (inComponent) {
      // Count braces to track component depth
      for (const char of line) {
        if (char === '{') componentDepth++;
        if (char === '}') {
          componentDepth--;
          if (componentDepth === 0) {
            // End of component - check for unclosed tags
            if (tagStack.length > 0) {
              fixes.push({
                line: i,
                action: 'insert_before',
                tags: [...tagStack].reverse(),
                message: `Missing ${tagStack.length} closing tags at end of component`
              });
            }
            inComponent = false;
            tagStack = [];
          }
        }
      }
      
      // Track JSX tags
      const openTagRegex = /<(\w+)(?:\s+[^>]*)?>/g;
      const closeTagRegex = /<\/(\w+)>/g;
      const selfClosingRegex = /<(\w+)(?:\s+[^>]*)?\/>/g;
      
      // Skip self-closing tags
      let cleanLine = line.replace(selfClosingRegex, '');
      
      // Find opening tags
      let match;
      while ((match = openTagRegex.exec(cleanLine)) !== null) {
        const tagName = match[1];
        if (!['input', 'img', 'br', 'hr', 'meta', 'link'].includes(tagName.toLowerCase())) {
          tagStack.push(tagName);
        }
      }
      
      // Find closing tags
      while ((match = closeTagRegex.exec(cleanLine)) !== null) {
        const tagName = match[1];
        const lastTag = tagStack[tagStack.length - 1];
        
        if (lastTag === tagName) {
          tagStack.pop();
        } else {
          // Mismatched closing tag
          console.log(`${colors.yellow}${filepath}:${lineNum} - Mismatched closing tag </${tagName}> (expected </${lastTag}>)${colors.reset}`);
        }
      }
    }
  }
  
  return fixes;
}

function applyFixes(content, fixes) {
  if (fixes.length === 0) return content;
  
  const lines = content.split('\n');
  
  // Sort fixes by line number in reverse order to avoid index shifting
  fixes.sort((a, b) => b.line - a.line);
  
  for (const fix of fixes) {
    if (fix.action === 'insert_before') {
      const indent = lines[fix.line].match(/^(\s*)/)[1];
      const closingTags = fix.tags.map(tag => `${indent}</${tag}>`).join('\n');
      lines.splice(fix.line, 0, closingTags);
      totalTagsFixed += fix.tags.length;
    }
  }
  
  return lines.join('\n');
}

// Process files
function processFiles(pattern) {
  const files = glob.sync(pattern, { 
    cwd: '/mnt/d/AI Guided SaaS',
    absolute: true,
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/scripts/**']
  });
  
  console.log(`${colors.blue}Found ${files.length} files to analyze${colors.reset}\n`);
  
  files.forEach(filepath => {
    try {
      const content = fs.readFileSync(filepath, 'utf8');
      const fixes = analyzeJSXStructure(content, filepath);
      
      if (fixes.length > 0) {
        console.log(`${colors.yellow}${filepath}: Found ${fixes.length} issues${colors.reset}`);
        fixes.forEach(fix => {
          console.log(`  - ${fix.message}`);
        });
        
        const fixedContent = applyFixes(content, fixes);
        fs.writeFileSync(filepath, fixedContent, 'utf8');
        console.log(`${colors.green}✓ Fixed${colors.reset}\n`);
        totalFilesFixed++;
      }
    } catch (error) {
      console.error(`${colors.red}✗ Error processing ${filepath}: ${error.message}${colors.reset}`);
    }
  });
}

// Main execution
console.log(`${colors.blue}Starting JSX closing tag fixes...${colors.reset}\n`);

// Process TSX and JSX files
processFiles('src/**/*.{tsx,jsx}');

// Print summary
console.log(`\n${colors.blue}=== Fix Summary ===${colors.reset}`);
console.log(`${colors.green}Files fixed: ${totalFilesFixed}${colors.reset}`);
console.log(`${colors.green}Tags added: ${totalTagsFixed}${colors.reset}`);