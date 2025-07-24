#!/usr/bin/env node

/**
 * MCAS Ultra-Aggressive Syntax Fixer
 * Targets the most stubborn syntax errors
 */

const fs = require('fs');
const path = require('path');

// Track statistics
let totalFiles = 0;
let filesFixed = 0;
let totalFixes = 0;
const fixesByType = new Map();

/**
 * Ultra-aggressive syntax fixing
 */
function fixSyntaxErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    let fixes = 0;

    // Fix 1: Malformed array syntax
    // Pattern: const [; => const [
    content = content.replace(/const\s+\[\s*;/g, () => {
      fixes++;
      fixesByType.set('malformed-array', (fixesByType.get('malformed-array') || 0) + 1);
      return 'const [';
    });
    
    // Fix 2: Interface/type syntax issues
    // Fix semicolons that should be commas in interfaces
    content = content.replace(/^(\s*\w+\s*:\s*[^,;}\n]+);(\s*)$/gm, (match, prop, space) => {
      // Don't fix if it's the last property before }
      if (space.trim() === '' || space.includes('}')) {
        fixes++;
        fixesByType.set('interface-semicolon', (fixesByType.get('interface-semicolon') || 0) + 1);
        return prop + ',' + space;
      }
      return match;
    });

    // Fix 3: Function declaration issues
    // Pattern: async function funcName => async funcName
    content = content.replace(/async\s+function\s+(\w+)/g, (match, name) => {
      fixes++;
      fixesByType.set('async-function', (fixesByType.get('async-function') || 0) + 1);
      return `async ${name}`;
    });

    // Fix 4: Multiple semicolons in statements
    content = content.replace(/(\w+\([^)]*\))\s*,\s*([^,\n]+);/g, (match, call, rest) => {
      fixes++;
      fixesByType.set('multiple-semicolons', (fixesByType.get('multiple-semicolons') || 0) + 1);
      return `${call}; ${rest};`;
    });

    // Fix 5: Specific test file patterns
    if (filePath.includes('.test.') || filePath.includes('.spec.')) {
      // Fix malformed expect chains
      content = content.replace(/expect\(([^)]+)\)\.(\w+)\(([^)]*)\)\s*,\s*(\w)/g, (match, expr, method, args, next) => {
        fixes++;
        fixesByType.set('expect-chain', (fixesByType.get('expect-chain') || 0) + 1);
        return `expect(${expr}).${method}(${args});\n${next}`;
      });
    }

    // Fix 6: Variable declaration issues
    // Pattern: let var1, let var2 => let var1; let var2
    content = content.replace(/(\w+)\s*,\s*let\s+(\w+)/g, (match, var1, var2) => {
      fixes++;
      fixesByType.set('let-comma', (fixesByType.get('let-comma') || 0) + 1);
      return `${var1}; let ${var2}`;
    });

    // Fix 7: Export/Import issues
    // Fix export async function => export async
    content = content.replace(/export\s+async\s+function\s+(\w+)/g, (match, name) => {
      fixes++;
      fixesByType.set('export-async', (fixesByType.get('export-async') || 0) + 1);
      return `export async function ${name}`;
    });

    // Fix 8: Arrow function parameter issues
    // Pattern: (: any) => => () =>
    content = content.replace(/\(\s*:\s*any\s*\)\s*=>/g, () => {
      fixes++;
      fixesByType.set('arrow-param', (fixesByType.get('arrow-param') || 0) + 1);
      return '() =>';
    });

    // Fix 9: Object literal syntax
    // Fix trailing commas in single-line objects
    content = content.replace(/(\{[^{}\n]+),\s*\}/g, (match, obj) => {
      fixes++;
      fixesByType.set('object-trailing-comma', (fixesByType.get('object-trailing-comma') || 0) + 1);
      return obj + '}';
    });

    // Fix 10: Clean up any remaining issues
    // Remove stray semicolons before closing braces
    content = content.replace(/;\s*\}/g, () => {
      fixes++;
      fixesByType.set('semicolon-brace', (fixesByType.get('semicolon-brace') || 0) + 1);
      return '\n}';
    });

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

console.log('💪 MCAS Ultra-Aggressive Syntax Fixer');
console.log('====================================\n');

// Process all source directories
const dirs = ['src', 'tests', 'lib', 'components', 'pages'];

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

if (fixesByType.size > 0) {
  console.log('\n📊 Fixes by type:');
  for (const [type, count] of fixesByType) {
    console.log(`   ${type}: ${count}`);
  }
}