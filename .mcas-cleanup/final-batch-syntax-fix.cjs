#!/usr/bin/env node

/**
 * MCAS Final Batch Syntax Fix
 * Fix all remaining syntax errors in one batch
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 MCAS Final Batch Syntax Fix');
console.log('==============================\n');

let totalFixes = 0;
let filesFixed = 0;

function fixSyntaxErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    let fixCount = 0;
    
    // Fix interface without closing brace
    content = content.replace(/interface\s+(\w+)\s*{\s*([^}]+?)\s*interface/g, (match, name, body) => {
      fixCount++;
      return `interface ${name} {\n${body}\n}\n\ninterface`;
    });
    
    // Fix multiple const declarations with commas
    content = content.replace(/(const|let|var)\s+(\w+)\s*=\s*([^,;]+),\s*(const|let|var)\s+(\w+)\s*=/g, 
      '$1 $2 = $3;\n        $4 $5 =');
    
    // Fix property declarations with commas instead of semicolons
    content = content.replace(/(\w+):\s*([^,;]+),\s*$/gm, '$1: $2;');
    
    // Fix missing semicolons at end of statements
    content = content.replace(/^(\s*)(const|let|var|return|throw|await|yield)\s+([^;]+[^;\s])\s*$/gm, '$1$2 $3;');
    
    // Fix trailing commas before closing braces
    content = content.replace(/,\s*\n\s*}/g, '\n}');
    
    // Fix multiple semicolons
    content = content.replace(/;{2,}/g, ';');
    
    // Fix object literal properties
    content = content.replace(/{\s*(\w+):\s*([^,}]+),\s*(\w+):\s*([^,}]+),\s*(\w+):\s*([^,}]+)\s*interface/g,
      '{ $1: $2, $3: $4, $5: $6 }\n\ninterface');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Process all TypeScript files
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && 
          entry.name !== 'node_modules' && 
          entry.name !== '.next' &&
          entry.name !== '.git') {
        processDirectory(fullPath);
      }
    } else if (entry.isFile() && 
               (entry.name.endsWith('.ts') || 
                entry.name.endsWith('.tsx'))) {
      if (fixSyntaxErrors(fullPath)) {
        console.log(`✓ Fixed ${path.relative(process.cwd(), fullPath)}`);
        filesFixed++;
      }
    }
  }
}

console.log('🔍 Processing all source files...');
processDirectory(path.join(process.cwd(), 'src'));

// Fix specific known issues
const specificFixes = [
  {
    file: 'src/app/api/agents/pulse-status/route.ts',
    fix: (content) => {
      // Fix specific syntax in this file
      return content.replace(/}\s*catch\s*\(error\)\s*{/g, '} catch (error) {');
    }
  }
];

for (const fix of specificFixes) {
  const filePath = path.join(process.cwd(), fix.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const fixed = fix.fix(content);
    if (fixed !== content) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`✓ Applied specific fix to ${fix.file}`);
      filesFixed++;
    }
  }
}

console.log(`\n✅ Fixed ${filesFixed} files`);
console.log('🚀 Ready to try building again!');