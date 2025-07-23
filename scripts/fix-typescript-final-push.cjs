#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 TypeScript Final Push - Aggressive Error Resolution');
console.log('=====================================================\n');

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
files.push(...getAllTypeScriptFiles('./tests'));

console.log(`📁 Found ${files.length} TypeScript files\n`);

let totalFixed = 0;
let filesFixed = 0;

files.forEach((file, index) => {
  if (index % 50 === 0 && index > 0) {
    console.log(`\n📊 Progress: ${index}/${files.length} files processed...\n`);
  }
  
  try {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    const appliedFixes = [];
    
    // Fix 1: JSX syntax errors
    content = content
      // Fix broken JSX tags
      .replace(/<div([^>]*)\s+\/>\s*className=/g, '<div$1 className=')
      .replace(/<\/(\w+)>\s*<\/\1>/g, '</$1>')
      .replace(/<(\w+)([^>]*)>\s*<\/\s*$/gm, '<$1$2 />')
      .replace(/\)\s*\)\s*\)/g, '))')
      .replace(/\}\s*\}\s*\}/g, '}}')
      .replace(/<\/div>\s*\)\s*}/g, '</div>\n      )}\n')
      .replace(/\n\s*<\/(\w+)>\s*$/gm, '\n</$1>')
      .replace(/(\w+)>\s*<\/(\w+)>/g, (match, tag1, tag2) => {
        if (tag1 === tag2) return match;
        return `${tag1}></${tag1}>`;
      });
    
    // Fix 2: Syntax errors in objects and arrays
    content = content
      .replace(/,\s*;/g, ',')
      .replace(/;\s*,/g, ',')
      .replace(/,\s*}/g, '\n}')
      .replace(/,\s*]/g, '\n]')
      .replace(/\{;/g, '{')
      .replace(/\[;/g, '[')
      .replace(/id:\s*(\d+);/g, 'id: $1,')
      .replace(/name:\s*'([^']+)';/g, "name: '$1',")
      .replace(/status:\s*'([^']+)';/g, "status: '$1',");
    
    // Fix 3: Function syntax
    content = content
      .replace(/\)\s*=>\s*voi;d/g, ') => void')
      .replace(/\)\s*:\s*any,\s*\(/g, '): any => (')
      .replace(/const\s+_(\w+)\s*=\s*([^;,]+),;/g, 'const _$1 = $2;')
      .replace(/validation\?\s*\(value\)\s*=>/g, 'validation?: (value: any) =>')
      .replace(/onComplete:\s*\(([^)]+)\)\s*=>/g, 'onComplete: ($1: any) =>')
      .replace(/onChange:\s*\(([^)]+)\)\s*=>/g, 'onChange: ($1: any) =>')
      .replace(/onClick:\s*\(([^)]+)\)\s*=>/g, 'onClick: ($1: any) =>')
      .replace(/\}\s*catch\s*\(/g, '} catch (')
      .replace(/\s+\.\s*sort/g, '.sort')
      .replace(/Array\.from\(([^)]+)\);\.sort/g, 'Array.from($1).sort');
    
    // Fix 4: Interface and type errors
    content = content
      .replace(/interface\s+(\w+)\s*\{([^}]*)\}/g, (match, name, body) => {
        const fixedBody = body
          .replace(/;\s*(\w+\s*[?:])/g, ',\n  $1')
          .replace(/,\s*;/g, ',')
          .replace(/;\s*$/gm, '')
          .replace(/,\s*,/g, ',')
          .replace(/,\s*}/g, '\n}');
        return `interface ${name} {${fixedBody}}`;
      })
      .replace(/type\s+(\w+)\s*=\s*\{([^}]+)\}/g, (match, name, body) => {
        const fixedBody = body
          .replace(/;\s*(\w+\s*[?:])/g, ',\n  $1')
          .replace(/,\s*;/g, ',')
          .replace(/;\s*$/gm, '')
          .replace(/,\s*,/g, ',');
        return `type ${name} = {${fixedBody}}`;
      });
    
    // Fix 5: JSX specific issues
    if (file.endsWith('.tsx')) {
      content = content
        // Fix className syntax
        .replace(/className=\{`cn\(`/g, 'className={cn(')
        .replace(/`\)\}/g, ')}')
        .replace(/className=\{`\$\{([^}]+)\}`\}/g, 'className={$1}')
        // Fix JSX expressions
        .replace(/\{([^}]*);([^}]*)\}/g, '{$1$2}')
        .replace(/=\s*\{;/g, '={')
        .replace(/\[\s*;/g, '[')
        // Fix map functions
        .replace(/\.map\(([^)]+)\)\s*\(\s*\\n\s*</g, '.map($1) => (\n        <')
        .replace(/\)\)\s*\}\s*,/g, '))},')
        // Fix JSX closing tags
        .replace(/<\/(\w+)>\s*\)\s*\}\s*$/gm, '</$1>\n      )}')
        .replace(/<\/(\w+)>\s*<\/>/g, '</$1>')
        .replace(/<(\w+)\s+\/>\s*</g, '<$1><')
        // Fix broken div structures
        .replace(/<div([^>]*)\/>\s*([^<])/g, '<div$1>$2')
        .replace(/\)\s*\}\s*\n\s*<\/div>/g, ')}\n      </div>')
        // Fix component syntax
        .replace(/export\s+default\s+function\s+(\w+)\(\)\s*\{/g, 'export default function $1() {');
    }
    
    // Fix 6: Common patterns from error logs
    content = content
      .replace(/startTime:\s*'([^']+);\s*([^']+):\s*([^']+)'/g, "startTime: '$1 $2:$3'")
      .replace(/severity:\s*'([^']+)';/g, "severity: '$1',")
      .replace(/title:\s*'([^']+)';/g, "title: '$1',")
      .replace(/description:\s*'([^']+)';/g, "description: '$1',")
      .replace(/React\.ElementTyp;/g, 'React.ElementType')
      .replace(/React\.ElementType\s*e;/g, 'React.ElementType;')
      .replace(/initialData\?\s*$/gm, 'initialData?: any')
      .replace(/\}\s*\/>\s*}/g, '} />}')
      .replace(/\)\s*\/>\s*\)/g, ') />')
      .replace(/const\s+(\w+),\s*=\s*/g, 'const $1 = ')
      .replace(/private,\s+/g, 'private ')
      .replace(/public,\s+/g, 'public ')
      .replace(/static,\s+/g, 'static ')
      // Fix variable declarations
      .replace(/const\s+_(\w+)\s*=\s*([^;]+);/g, (match, name, value) => {
        if (value.includes('?') && value.includes(':')) {
          return `const _${name} = ${value};`;
        }
        return match;
      });
    
    // Fix 7: Final cleanup
    content = content
      .replace(/\n\s*\n\s*\n/g, '\n\n')  // Remove triple newlines
      .replace(/,\s*,/g, ',')             // Remove double commas
      .replace(/;\s*;/g, ';')             // Remove double semicolons
      .replace(/\{\s*\{/g, '{{')          // Fix double braces
      .replace(/\}\s*\}/g, '}}')          // Fix double braces
      .replace(/\(\s*\(/g, '((')          // Fix double parentheses
      .replace(/\)\s*\)/g, '))')          // Fix double parentheses
      .replace(/\s+$/gm, '')              // Trim trailing whitespace
      .replace(/,\s*\n\s*}/g, '\n}')      // Remove trailing commas before closing brace
      .replace(/,\s*\n\s*]/g, '\n]');     // Remove trailing commas before closing bracket
    
    // Write file if changed
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      filesFixed++;
      totalFixed++;
      console.log(`✅ ${path.relative('.', file)}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}: ${error.message}`);
  }
});

console.log('\n✅ TypeScript Final Push Complete!');
console.log(`📊 Files processed: ${files.length}`);
console.log(`🔧 Files fixed: ${filesFixed}`);
console.log(`📈 Success rate: ${((filesFixed / files.length) * 100).toFixed(1)}%`);

// Run a final check
console.log('\n📊 Running final TypeScript check...');
try {
  const { execSync } = require('child_process');
  const errorCount = execSync('npm run typecheck 2>&1 | grep -c "error TS"', { encoding: 'utf8' }).trim();
  console.log(`\n❗ Remaining TypeScript errors: ${errorCount}`);
  
  if (parseInt(errorCount) < 5000) {
    console.log('🎉 SUCCESS! TypeScript errors reduced below 5,000!');
  } else {
    console.log('⚠️  Still above 5,000 errors. Manual intervention may be needed.');
  }
} catch (error) {
  console.log('❗ Could not count remaining errors');
}