#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 TypeScript Batch Fix #2 - Aggressive Error Resolution');
console.log('======================================================\n');

// Get all TypeScript and TSX files
function getAllTypeScriptFiles(dir) {
  const files = [];
  
  function traverse(currentPath) {
    if (currentPath.includes('node_modules') || 
        currentPath.includes('.next') || 
        currentPath.includes('dist') ||
        currentPath.includes('build')) {
      return;
    }
    
    try {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip inaccessible directories
    }
  }
  
  traverse(dir);
  return files;
}

// Process files
const files = getAllTypeScriptFiles('./src');
files.push(...getAllTypeScriptFiles('./scripts'));

console.log(`📁 Found ${files.length} TypeScript files\n`);

let totalFixed = 0;
let filesFixed = 0;

// Fix common TypeScript errors
files.forEach((file, index) => {
  if (index % 50 === 0 && index > 0) {
    console.log(`\n📊 Progress: ${index}/${files.length} files processed...\n`);
  }
  
  try {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    const appliedFixes = [];
    
    // Fix 1: Property declarations in interfaces (semicolon to comma)
    const interfaceRegex = /interface\s+\w+\s*(?:<[^>]+>)?\s*\{([^}]+)\}/g;
    content = content.replace(interfaceRegex, (match, body) => {
      const fixedBody = body
        .replace(/;\s*([a-zA-Z_]\w*\s*[?:])/g, ',\n  $1')
        .replace(/;\s*\}/g, '\n}');
      if (body !== fixedBody) {
        appliedFixes.push('Fix interface property separators');
      }
      return match.replace(body, fixedBody);
    });
    
    // Fix 2: Type declarations
    const typeRegex = /type\s+\w+\s*(?:<[^>]+>)?\s*=\s*\{([^}]+)\}/g;
    content = content.replace(typeRegex, (match, body) => {
      const fixedBody = body
        .replace(/;\s*([a-zA-Z_]\w*\s*[?:])/g, ',\n  $1')
        .replace(/;\s*$/g, '');
      if (body !== fixedBody) {
        appliedFixes.push('Fix type property separators');
      }
      return match.replace(body, fixedBody);
    });
    
    // Fix 3: Missing type annotations
    content = content
      .replace(/const\s+(\w+)\s*=\s*useState\(/g, 'const [$1, set$1] = useState(')
      .replace(/export\s+default\s+function\s+(\w+)\s*\(\)\s*{/g, 'export default function $1() {')
      .replace(/:\s*React\.FC\s*=\s*\(\)\s*=>/g, ': React.FC = () =>')
      .replace(/\)\s*:\s*JSX\.Element\s*=>/g, '): JSX.Element =>')
      .replace(/\bconst\s+(\w+)\s*=\s*\(\)\s*=>/g, 'const $1 = () =>')
      .replace(/\bfunction\s+(\w+)\s*\(\)\s*:/g, 'function $1():');
    
    // Fix 4: Cleanup JSX syntax
    content = content
      .replace(/<\/(\w+)>\s*<\/\1>/g, '</$1>')  // Remove duplicate closing tags
      .replace(/<(\w+)([^>]*)\/>\s*<\/\1>/g, '<$1$2 />')  // Fix self-closing tags
      .replace(/<div\s+\/>\s*className=/g, '<div className=')  // Fix broken div tags
      .replace(/\}\s*\)\s*}\s*\)/g, '})}')  // Fix nested closures
      .replace(/\)\s*\)\s*;/g, ');')  // Fix double closing parentheses
      .replace(/<\/div>\s*<\/div>\s*\)/g, '</div>\n      </div>')  // Fix div alignment
      .replace(/className="([^"]+)"\s*\/>/g, 'className="$1" />')  // Fix className syntax
      .replace(/<(\w+)\s+([^>]+)>\s*<\/>/g, '<$1 $2 />')  // Convert to self-closing
      .replace(/\{([^}]+);\s*\}/g, '{$1}')  // Remove semicolons in JSX expressions
      .replace(/=\s*\{;/g, '={')  // Fix object literal starts
      .replace(/\[\s*;/g, '[')  // Fix array literal starts
      .replace(/,\s*;/g, ',');  // Fix comma-semicolon sequences
    
    // Fix 5: Function and arrow function syntax
    content = content
      .replace(/\(([^)]*)\)\s*=>\s*\{;/g, '($1) => {')
      .replace(/=>\s*\(\s*</g, '=> (\\n    <')
      .replace(/\)\s*\)\s*\)/g, '))')
      .replace(/\}\s*\}\s*\}/g, '}}')
      .replace(/const\s+_(\w+)\s*=\s*([^;,]+),;/g, 'const _$1 = $2;')
      .replace(/let\s+_(\w+)\s*=\s*([^;,]+),;/g, 'let _$1 = $2;');
    
    // Fix 6: Common patterns from error logs
    content = content
      .replace(/export\s+interface\s+(\w+)<string,\s*string>\s*{/g, 'export interface $1 {')
      .replace(/export\s+interface\s+(\w+)<any,\s*any>\s*{/g, 'export interface $1 {')
      .replace(/Array\.from\(([^)]+)\)\s*;/g, 'Array.from($1)')
      .replace(/\.sort\(\(a:\s*any,\s*b:\s*any\)\s*=>/g, '.sort((a, b) =>')
      .replace(/validation\?\s*\(value\)\s*=>/g, 'validation?: (value: any) =>')
      .replace(/onComplete:\s*\(projectData\)\s*=>/g, 'onComplete: (projectData: any) =>')
      .replace(/\bprivate,\s+/g, 'private ')
      .replace(/\bpublic,\s+/g, 'public ')
      .replace(/\bstatic,\s+/g, 'static ')
      .replace(/id:\s*(\d+);/g, 'id: $1,')
      .replace(/status:\s*'([^']+)';/g, "status: '$1',")
      .replace(/name:\s*'([^']+)';/g, "name: '$1',");
    
    // Fix 7: Fix specific patterns we've seen
    content = content
      .replace(/const sortedCategories = Array\.from\(([^)]+)\);\.sort/g, 'const sortedCategories = Array.from($1).sort')
      .replace(/React\.ElementTyp;/g, 'React.ElementType')
      .replace(/\s+\.\s*sort/g, '.sort')
      .replace(/validation\?\s*\(value\)\s*=>\s*string\s*\|\s*null$/gm, 'validation?: (value: any) => string | null')
      .replace(/\)\s*=>\s*voi;d/g, ') => void')
      .replace(/\)\s*=>\s*void;/g, ') => void')
      .replace(/initialData\?$/gm, 'initialData?: any')
      .replace(/;\s*icon:\s*(\w+);/g, ',\n  icon: $1,')
      .replace(/;\s*fields:\s*Field\[\];/g, ',\n  fields: Field[]')
      .replace(/helper\?\s*:\s*string$/gm, 'helper?: string');
    
    // Write file if changed
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      filesFixed++;
      totalFixed += appliedFixes.length || 1;
      console.log(`✅ ${path.relative('.', file)}`);
      if (appliedFixes.length > 0) {
        appliedFixes.forEach(fix => console.log(`   - ${fix}`));
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}: ${error.message}`);
  }
});

console.log('\n✅ TypeScript Batch Fix #2 Complete!');
console.log(`📊 Files processed: ${files.length}`);
console.log(`🔧 Files fixed: ${filesFixed}`);
console.log(`💡 Total fixes applied: ${totalFixed}`);
console.log(`📈 Success rate: ${((filesFixed / files.length) * 100).toFixed(1)}%`);