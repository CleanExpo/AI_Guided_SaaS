const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixJSXClosingTags(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Remove all "No newline at end of file" markers
    content = content.replace(/No newline at end of file/g, '');
    
    // Fix patterns where JSX is broken across multiple lines incorrectly
    // Fix pattern: </div>\n);\n\n No newline at end of file\n      }
    content = content.replace(/(<\/\w+>)\s*\n\s*\);\s*\n\s*\n\s*}\s*$/gm, '$1\n  );\n}');
    
    // Fix pattern where there's content after the closing of a file
    content = content.replace(/}\s*\n\s*<\/\w+>\s*$/g, '}');
    content = content.replace(/}\s*\n\s*\)\s*$/g, '}');
    
    // Fix broken JSX returns
    content = content.replace(/return\s*\(\s*\n\s*<div([^>]*)>\s*\n\s*<div([^>]*)>;/g, 
      'return (\n    <div$1>\n      <div$2>');
    
    // Fix patterns with extra closing tags
    content = content.replace(/(<\/div>\s*\n\s*){2,};\s*$/gm, '    </div>\n  );\n}');
    
    // Fix patterns where closing tags are misaligned
    content = content.replace(/\n\s*\);\s*\n\s*}\s*\n\s*<\/\w+>\s*\n/g, '\n  );\n}\n');
    
    // Fix conditional rendering issues
    content = content.replace(/\)\s*,\s*}/g, ')\n            }');
    content = content.replace(/\)\s*}\s*,/g, ')\n            }');
    
    // Fix interface definitions with mixed syntax
    content = content.replace(/interface\s+(\w+)\s*{\s*([^}]+)}/g, function(match, name, body) {
      const lines = body.split('\n').map(line => {
        if (line.trim() && !line.trim().startsWith('//')) {
          // Ensure each property ends with semicolon
          return line.replace(/[,;]?\s*$/, ';');
        }
        return line;
      }).join('\n');
      return `interface ${name} {\n${lines}\n}`;
    });
    
    // Fix broken closing patterns at end of components
    content = content.replace(/\n\s*\);\s*\n\s*\n\s*}\s*$/g, '\n  );\n}');
    
    // Clean up extra whitespace
    content = content.replace(/\n{3,}/g, '\n\n');
    
    // Ensure file ends with single newline
    content = content.trimEnd() + '\n';
    
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

// Find all TSX files in problem directories
const srcDir = path.join(__dirname, '..', 'src');
const problemDirs = ['app/admin', 'app/analytics', 'app/about', 'app/api-docs', 
                     'app/blog', 'app/community', 'app/collaborate', 'app/config',
                     'app/contact', 'app/demo', 'app/docs', 'app/enterprise',
                     'app/features', 'app/form-builder', 'app/gdpr', 'app/help',
                     'app/press', 'app/pricing', 'app/auth', 'components'];

let fixedCount = 0;

console.log('Fixing JSX closing tag issues...\n');

problemDirs.forEach(dir => {
  const pattern = path.join(srcDir, dir, '**/*.tsx');
  const files = glob.sync(pattern);
  
  files.forEach(file => {
    if (fixJSXClosingTags(file)) {
      console.log(`Fixed: ${path.relative(srcDir, file)}`);
      fixedCount++;
    }
  });
});

console.log(`\nFixed ${fixedCount} files`);