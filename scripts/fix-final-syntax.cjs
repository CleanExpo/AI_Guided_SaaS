const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixFinalSyntaxErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Fix "No newline at end of file" markers appearing in middle of file
    content = content.replace(/\n\s*No newline at end of file\s*\n/g, '\n');
    
    // Fix multiple closing braces and parentheses at end of files
    content = content.replace(/\n\s*}\s*\n\s*No newline at end of file$/g, '\n}');
    content = content.replace(/\n\s*\)\s*;\s*\n\s*}\s*\n\s*No newline at end of file$/g, '\n  );\n}');
    
    // Fix duplicate closing JSX and function syntax
    content = content.replace(/(<\/div>\s*\n\s*){2,}/g, '      </div>\n');
    content = content.replace(/(\)\s*;\s*\n\s*}\s*\n){2,}/g, '  );\n}\n');
    
    // Fix return statement patterns with extra closing tags
    content = content.replace(/return\s*\(\s*<div([^>]*)>\s*<div([^>]*)>/g, 'return (\n    <div$1>\n      <div$2>');
    
    // Fix JSX conditional rendering with && operator
    content = content.replace(/\{([^}]+)\s+&&\s*\(\s*\n([^)]+)\)\s*}/g, '{$1 && (\n$2\n            )}');
    
    // Fix interface syntax with mixed commas and semicolons
    content = content.replace(/interface\s+(\w+)\s*{\s*([^}]+)}/g, function(match, name, body) {
      const fixedBody = body
        .split('\n')
        .map(line => {
          // Fix property definitions
          if (line.trim() && !line.trim().startsWith('//')) {
            return line.replace(/,\s*$/, ';').replace(/;\s*;/, ';');
          }
          return line;
        })
        .join('\n');
      return `interface ${name} {\n${fixedBody}\n}`;
    });
    
    // Fix any[] syntax patterns
    content = content.replace(/:\s*any\[\]\s*=\s*useState<any>/g, ' = useState');
    content = content.replace(/\[\w+,\s*\w+\]:\s*any\[\]\s*=\s*useState/g, function(match) {
      const varMatch = match.match(/\[(\w+),\s*(\w+)\]/);
      if (varMatch) {
        return `[${varMatch[1]}, ${varMatch[2]}] = useState`;
      }
      return match;
    });
    
    // Fix closing tag issues
    content = content.replace(/<\/any>\s*}/g, '}');
    content = content.replace(/<\/div>\s*\n\s*\);\s*\n\s*}\s*\n\s*<\/div>/g, '      </div>\n    );\n  }');
    
    // Fix extra closing braces at end of file
    content = content.replace(/}\s*\n\s*No newline at end of file\s*$/g, '}');
    
    // Fix onChange handlers with type annotations
    content = content.replace(/onChange:\s*any=\{/g, 'onChange={');
    
    // Fix JSX comments
    content = content.replace(/>\s*\/\/\s*([^<\n]+)\n\s*</g, '>\n              {/* $1 */}\n            <');
    
    // Clean up any remaining "No newline at end of file" markers
    content = content.replace(/No newline at end of file/g, '');
    
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

// Find all TSX files
const srcDir = path.join(__dirname, '..', 'src');
const files = glob.sync('**/*.tsx', { cwd: srcDir, absolute: true });

let fixedCount = 0;

console.log('Applying final syntax fixes...\n');

files.forEach(file => {
  if (fixFinalSyntaxErrors(file)) {
    console.log(`Fixed: ${path.relative(srcDir, file)}`);
    fixedCount++;
  }
});

console.log(`\nFixed ${fixedCount} files`);