#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const fixPatterns = [
  // Fix JSX syntax errors
  {
    regex: /className="([^"]+)"\s+className="([^"]+)"/g,
    replacement: 'className="$1 $2"',
    description: 'Fix duplicate className attributes'
  },
  {
    regex: /(<\w+[^>]*>)\s*<\/\w+>\s*<\/\w+>/g,
    replacement: '$1',
    description: 'Fix self-closing tags with extra closing tags'
  },
  {
    regex: /(<\w+)([^>]*>)\s*<\/\1>\s*<\/CardContent>/g,
    replacement: '$1$2',
    description: 'Fix duplicate closing tags'
  },
  // Fix interface/type syntax
  {
    regex: /interface\s+(\w+)\s*{\s*([^}]+);\s*}/g,
    replacement: (match, name, body) => {
      const fixedBody = body.replace(/;(?=\s*[\w}])/g, ',');
      return `interface ${name} {\n${fixedBody}\n}`;
    },
    description: 'Fix semicolons in interfaces'
  },
  {
    regex: /type\s+(\w+)\s*=\s*{\s*([^}]+);\s*}/g,
    replacement: (match, name, body) => {
      const fixedBody = body.replace(/;(?=\s*[\w}])/g, ',');
      return `type ${name} = {\n${fixedBody}\n}`;
    },
    description: 'Fix semicolons in type definitions'
  },
  // Fix function/method syntax
  {
    regex: /export\s+default\s+function\s+(\w+)\s*\(\s*\)\s*{/g,
    replacement: 'export default function $1() {',
    description: 'Fix function syntax'
  },
  {
    regex: /async\s+(\w+)\s*\(\s*([^)]*)\s*\)\s*:\s*Promise<([^>]+)>\s*{\s*}/g,
    replacement: 'async $1($2): Promise<$3> {',
    description: 'Fix async function syntax'
  },
  // Fix import/export syntax
  {
    regex: /export\s*{\s*([^}]+);\s*}/g,
    replacement: (match, exports) => {
      const fixedExports = exports.replace(/;/g, ',');
      return `export { ${fixedExports} }`;
    },
    description: 'Fix export syntax'
  },
  // Fix React component syntax
  {
    regex: /(<\w+)([^>]*)\s*>\s*<\/\w+>\s*<\/\w+>/g,
    replacement: '$1$2 />',
    description: 'Fix self-closing components'
  },
  {
    regex: /(<\w+)([^>]*)>\s*<TaskQueueVisualizer\s*\/>\s*<\/div><\/div>/g,
    replacement: '$1$2>\n  <TaskQueueVisualizer />\n</div>',
    description: 'Fix nested component syntax'
  }
];

async function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let fixCount = 0;

    for (const pattern of fixPatterns) {
      const matches = content.match(pattern.regex);
      if (matches && matches.length > 0) {
        if (typeof pattern.replacement === 'string') {
          content = content.replace(pattern.regex, pattern.replacement);
        } else {
          content = content.replace(pattern.regex, pattern.replacement);
        }
        fixCount += matches.length;
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      const relativePath = path.relative(process.cwd(), filePath);
      console.log(`✅ Fixed ${fixCount} issues in ${relativePath}`);
      return fixCount;
    }
    return 0;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

async function main() {
  console.log('🔧 Fixing TypeScript errors...\n');
  
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