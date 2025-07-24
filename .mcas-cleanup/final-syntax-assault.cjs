#!/usr/bin/env node

/**
 * MCAS Final Syntax Assault
 * Comprehensive syntax error fixer targeting the most common patterns
 */

const fs = require('fs');
const path = require('path');

// Track statistics
let totalFiles = 0;
let filesFixed = 0;
let totalFixes = 0;
const errorsByFile = new Map();

/**
 * Aggressive syntax fixing
 */
function fixSyntaxErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    let fixes = 0;

    // Fix 1: Missing semicolons (TS1005)
    // Add semicolons after statements
    content = content.replace(/^(\s*(?:const|let|var|return|throw|break|continue)\s+[^;{}\n]+)$/gm, '$1;');
    content = content.replace(/^(\s*(?:import|export)\s+[^;{}\n]+)$/gm, '$1;');
    
    // Fix semicolons after function calls
    content = content.replace(/(\w+\([^)]*\))(\s*\n)/g, (match, call, newline) => {
      if (!match.includes(';') && !match.includes('{')) {
        fixes++;
        return call + ';' + newline;
      }
      return match;
    });

    // Fix 2: Array syntax issues (TS1109, TS1003)
    // Fix array declarations with wrong syntax
    content = content.replace(/:\s*any\s*\[\s*\]/g, ': any[]');
    content = content.replace(/:\s*string\s*\[\s*\]/g, ': string[]');
    content = content.replace(/:\s*number\s*\[\s*\]/g, ': number[]');
    
    // Fix array literal issues
    content = content.replace(/=\s*any\s*\[\s*\]/g, '= []');
    content = content.replace(/artifacts:\s*any\[\]/g, 'artifacts: []');

    // Fix 3: Object/Interface syntax (TS1128)
    // Fix interface property separators
    content = content.replace(/^(\s*\w+\s*:\s*[^,;}\n]+);(\s*\n\s*\w+\s*:)/gm, '$1,$2');
    
    // Fix object literal syntax
    content = content.replace(/(\{\s*[^}]*?);\s*([^}]*?\})/g, '$1, $2');

    // Fix 4: Function syntax issues
    // Fix async function syntax
    content = content.replace(/async\s+function\s+(\w+)/g, 'async $1');
    content = content.replace(/function\s+if\s*\(/g, 'if (');
    content = content.replace(/function\s+else\s+if\s*\(/g, 'else if (');
    content = content.replace(/function\s+for\s*\(/g, 'for (');
    content = content.replace(/function\s+while\s*\(/g, 'while (');

    // Fix 5: Import/Export issues
    // Fix multiline imports
    content = content.replace(/from\s+'([^']+)'\s*;\s*\n\s*'([^']+)'/g, "from '$1'");
    content = content.replace(/from\s+"([^"]+)"\s*;\s*\n\s*"([^"]+)"/g, 'from "$1"');

    // Fix 6: Type annotation issues
    // Fix malformed type annotations
    content = content.replace(/:\s*Record<string,\s*\n\s*any\s*\/>/g, ': Record<string, any>');
    content = content.replace(/:\s*\(\s*:\s*any\s*\)/g, ': any');

    // Fix 7: JSX/TSX specific issues
    if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
      // Fix self-closing tags
      content = content.replace(/<(\w+)([^>]*?)\/\s*>/g, '<$1$2 />');
      
      // Fix JSX expression containers
      content = content.replace(/\{\s*\}/g, '{}');
    }

    // Fix 8: Specific patterns from error analysis
    // Fix const declarations with wrong syntax
    content = content.replace(/const\s+\[\s*;\s*/g, 'const [');
    content = content.replace(/const\s+\{\s*;\s*/g, 'const {');
    
    // Fix return statement issues
    content = content.replace(/return\s+;\s*\{/g, 'return {');
    content = content.replace(/return\s+;\s*\[/g, 'return [');

    // Fix 9: Clean up double semicolons
    content = content.replace(/;;\s*/g, '; ');
    content = content.replace(/;\s*;/g, ';');

    // Fix 10: Ensure file ends with newline
    if (!content.endsWith('\n')) {
      content += '\n';
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesFixed++;
      totalFixes += fixes;
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Process directory recursively
 */
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && 
          entry.name !== 'node_modules' && 
          entry.name !== '.next' &&
          entry.name !== 'dist' &&
          entry.name !== 'build') {
        processDirectory(fullPath);
      }
    } else if (entry.isFile() && 
               (entry.name.endsWith('.ts') || 
                entry.name.endsWith('.tsx') || 
                entry.name.endsWith('.js') || 
                entry.name.endsWith('.jsx'))) {
      totalFiles++;
      if (fixSyntaxErrors(fullPath)) {
        console.log(`✓ Fixed ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
}

console.log('🔥 MCAS Final Syntax Assault');
console.log('============================\n');

// Process all source directories
const dirs = [
  'src',
  'tests',
  'lib',
  'components',
  'pages',
  'api',
  'services',
  'hooks',
  'utils',
  'types'
];

for (const dir of dirs) {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`Processing ${dir}...`);
    processDirectory(fullPath);
  }
}

console.log(`\n✅ Summary:`);
console.log(`   Total files: ${totalFiles}`);
console.log(`   Files fixed: ${filesFixed}`);
console.log(`   Total fixes: ${totalFixes}`);

// Write a detailed log
const logPath = path.join(process.cwd(), '.mcas-cleanup', 'final-syntax-assault.log');
const logContent = `MCAS Final Syntax Assault Log
Generated: ${new Date().toISOString()}
Total files processed: ${totalFiles}
Files fixed: ${filesFixed}
Total fixes applied: ${totalFixes}
`;

fs.writeFileSync(logPath, logContent, 'utf8');
console.log(`\n📝 Log written to: ${logPath}`);