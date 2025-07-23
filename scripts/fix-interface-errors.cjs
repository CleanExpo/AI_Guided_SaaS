#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const interfaceFixPatterns = [
  // Fix interface property separators
  {
    regex: /interface\s+(\w+)\s*{([^}]+)}/g,
    replacement: (match, name, body) => {
      // Replace semicolons with commas between properties
      const fixedBody = body
        .split('\n')
        .map(line => {
          // Skip empty lines and comments
          if (!line.trim() || line.trim().startsWith('//') || line.trim().startsWith('/*')) {
            return line;
          }
          // Replace semicolon with comma if not the last property
          return line.replace(/;(\s*)$/, ',$1');
        })
        .join('\n');
      
      // Remove trailing comma from last property
      const lines = fixedBody.split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        const trimmed = lines[i].trim();
        if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
          lines[i] = lines[i].replace(/,(\s*)$/, '$1');
          break;
        }
      }
      
      return `interface ${name} {${lines.join('\n')}}`;
    }
  },
  // Fix type definitions
  {
    regex: /type\s+(\w+)\s*=\s*{([^}]+)}/g,
    replacement: (match, name, body) => {
      // Replace semicolons with commas between properties
      const fixedBody = body
        .split('\n')
        .map(line => {
          // Skip empty lines and comments
          if (!line.trim() || line.trim().startsWith('//') || line.trim().startsWith('/*')) {
            return line;
          }
          // Replace semicolon with comma if not the last property
          return line.replace(/;(\s*)$/, ',$1');
        })
        .join('\n');
      
      // Remove trailing comma from last property
      const lines = fixedBody.split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        const trimmed = lines[i].trim();
        if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
          lines[i] = lines[i].replace(/,(\s*)$/, '$1');
          break;
        }
      }
      
      return `type ${name} = {${lines.join('\n')}}`;
    }
  },
  // Fix object literal types in function parameters
  {
    regex: /\(([^)]*{\s*[^}]+}[^)]*)\)/g,
    replacement: (match, params) => {
      // Fix object literals in parameters
      const fixed = params.replace(/(\w+):\s*{\s*([^}]+)\s*}/g, (objMatch, name, props) => {
        const fixedProps = props
          .split(/[,;]/)
          .filter(p => p.trim())
          .map(p => p.trim())
          .join(', ');
        return `${name}: { ${fixedProps} }`;
      });
      return `(${fixed})`;
    }
  }
];

async function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let fixCount = 0;

    for (const pattern of interfaceFixPatterns) {
      const matches = content.match(pattern.regex);
      if (matches && matches.length > 0) {
        content = content.replace(pattern.regex, pattern.replacement);
        fixCount += matches.length;
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      const relativePath = path.relative(process.cwd(), filePath);
      console.log(`✅ Fixed ${fixCount} interface/type issues in ${relativePath}`);
      return fixCount;
    }
    return 0;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

async function main() {
  console.log('🔧 Fixing interface and type errors...\n');
  
  const files = await glob('src/**/*.{ts,tsx}', {
    cwd: process.cwd(),
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
  });

  console.log(`Found ${files.length} TypeScript files\n`);

  let totalFixes = 0;
  let filesFixed = 0;

  for (const file of files) {
    const fixes = await fixFile(file);
    if (fixes > 0) {
      totalFixes += fixes;
      filesFixed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 FIX SUMMARY');
  console.log('='.repeat(60));
  console.log(`📁 Files processed: ${files.length}`);
  console.log(`✅ Files fixed: ${filesFixed}`);
  console.log(`🔧 Total fixes: ${totalFixes}`);
  console.log('\n✨ Fix script completed!');
}

main().catch(console.error);