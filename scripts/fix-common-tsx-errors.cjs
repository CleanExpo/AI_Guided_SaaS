const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Common error patterns and their fixes
const fixes = {
  // Fix incorrect return syntax
  fixIncorrectReturn: (content) => {
    return content.replace(/if\s*\([^)]+\)\s*{\s*return:\s*([^}]+)\s*}/g, 'if ($1) { return $2; }');
  },
  
  // Fix extra spaces in className attributes
  fixExtraSpaces: (content) => {
    return content.replace(/className="([^"]*\s{2,}[^"]*)"/g, (match, classes) => {
      const fixed = classes.replace(/\s+/g, ' ').trim();
      return `className="${fixed}"`;
    });
  },
  
  // Remove duplicate closing tags at end of files
  fixDuplicateClosingTags: (content) => {
    // Remove extra closing tags after the export default function's closing brace
    return content.replace(/^}\s*\n(<\/\w+>\s*\n)+$/gm, '}\n');
  },
  
  // Fix unclosed JSX tags (basic attempt)
  analyzeUnclosedTags: (content, filepath) => {
    const openTags = [];
    const tagRegex = /<(\/?)([\w]+)([^>]*?)(\/?)?>/g;
    let match;
    
    while ((match = tagRegex.exec(content)) !== null) {
      const [fullMatch, closeSlash, tagName, attributes, selfClose] = match;
      
      if (selfClose || tagName.match(/^(input|img|br|hr|meta|link)$/i)) {
        // Self-closing tag
        continue;
      }
      
      if (closeSlash) {
        // Closing tag
        const lastOpen = openTags.pop();
        if (!lastOpen || lastOpen !== tagName) {
          console.log(`${filepath}: Mismatched closing tag </${tagName}> at position ${match.index}`);
        }
      } else {
        // Opening tag
        openTags.push(tagName);
      }
    }
    
    if (openTags.length > 0) {
      console.log(`${filepath}: Unclosed tags: ${openTags.join(', ')}`);
    }
    
    return content;
  }
};

// Process files
function processFiles(pattern) {
  const files = glob.sync(pattern, { 
    cwd: '/mnt/d/AI Guided SaaS',
    absolute: true,
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**']
  });
  
  console.log(`Found ${files.length} files to process`);
  
  let fixedCount = 0;
  
  files.forEach(filepath => {
    try {
      let content = fs.readFileSync(filepath, 'utf8');
      const originalContent = content;
      
      // Apply fixes
      content = fixes.fixIncorrectReturn(content);
      content = fixes.fixExtraSpaces(content);
      content = fixes.fixDuplicateClosingTags(content);
      
      // Analyze for unclosed tags (doesn't modify, just reports)
      fixes.analyzeUnclosedTags(content, filepath);
      
      if (content !== originalContent) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Fixed: ${filepath}`);
        fixedCount++;
      }
    } catch (error) {
      console.error(`Error processing ${filepath}:`, error.message);
    }
  });
  
  console.log(`\nFixed ${fixedCount} files`);
}

// Run the script
console.log('Starting TypeScript/JSX error fixes...\n');
processFiles('src/**/*.{tsx,jsx,ts,js}');
processFiles('src/app/**/*.{tsx,jsx,ts,js}');
processFiles('src/components/**/*.{tsx,jsx,ts,js}');