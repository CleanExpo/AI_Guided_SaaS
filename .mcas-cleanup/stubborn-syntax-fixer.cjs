#!/usr/bin/env node

/**
 * MCAS Stubborn Syntax Fixer
 * Final assault on the most stubborn syntax patterns
 */

const fs = require('fs');
const path = require('path');

// Track fixes
let totalFiles = 0;
let filesFixed = 0;
let totalFixes = 0;

/**
 * Fix stubborn syntax patterns
 */
function fixStubbornSyntax(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    let fixes = 0;
    
    // Fix 1: Multiple commas in variable declarations
    // Pattern: const a = x, const b = y => const a = x; const b = y
    content = content.replace(/(\w+)\s*=\s*([^,;]+),\s*const\s+/g, '$1 = $2; const ');
    content = content.replace(/(\w+)\s*=\s*([^,;]+),\s*let\s+/g, '$1 = $2; let ');
    
    // Fix 2: Return statements with JSX and commas
    // Pattern: return (, <div> => return (<div>
    // Pattern: return (div className => return (<div className
    content = content.replace(/return\s*\(\s*,?\s*([<a-zA-Z])/g, 'return ($1');
    content = content.replace(/return\s*\(\s*([a-zA-Z]+)\s+className/g, 'return (<$1 className');
    
    // Fix 3: Missing closing tags in return statements
    content = content.replace(/return\s*\(\s*<([^>]+)>\s*,\s*<([^>]+)>\s*;/g, 'return (<$1>);');
    
    // Fix 4: Semicolons inside JSX
    content = content.replace(/>\s*;\s*\n\s*</g, '>\n        <');
    
    // Fix 5: Wrong syntax in conditionals
    // Pattern: if (; condition) => if (condition)
    content = content.replace(/if\s*\(\s*;\s*/g, 'if (');
    
    // Fix 6: Array declarations with wrong syntax
    // Pattern: linked_to: any[] => linked_to: []
    content = content.replace(/linked_to:\s*any\[\]/g, 'linked_to: []');
    content = content.replace(/dependencies:\s*any\[\]/g, 'dependencies: []');
    
    // Fix 7: Stray commas and semicolons in statements
    content = content.replace(/,\s*}\s*catch/g, '} catch');
    content = content.replace(/,\s*return\s+null,\s*}/g, '; return null; }');
    
    // Fix 8: Test file specific patterns
    if (filePath.includes('.test.') || filePath.includes('.spec.')) {
      // Fix test declarations
      content = content.replace(/test\('([^']+)':\s*any,\s*async/g, "test('$1', async");
      content = content.replace(/it\('([^']+)':\s*any,\s*async/g, "it('$1', async");
      content = content.replace(/describe\('([^']+)':\s*any,/g, "describe('$1',");
    }
    
    // Fix 9: Missing closing braces in interfaces
    content = content.replace(/interface\s+(\w+)\s*{([^}]*);(\s*)$/gm, 'interface $1 {$2\n}$3');
    
    // Fix 10: Clean up double semicolons and commas
    content = content.replace(/;;\s*/g, '; ');
    content = content.replace(/,,\s*/g, ', ');
    content = content.replace(/,\s*;/g, ';');
    
    // Fix 11: Ensure proper file endings
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

console.log('💪 MCAS Stubborn Syntax Fixer');
console.log('=============================\n');

// Target specific problem files first
const problemFiles = [
  'src/app/about/page.tsx',
  'src/app/admin-direct/page.tsx',
  'src/app/admin/agent-monitor/page.tsx',
  'src/lib/admin-auth.ts',
  'src/lib/breadcrumb/breadcrumb-agent.ts',
  'src/app/api/agent-chat/route.ts',
  'tests/e2e/comprehensive-validation.spec.ts'
];

console.log('Fixing known problem files...');
for (const file of problemFiles) {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    totalFiles++;
    if (fixStubbornSyntax(fullPath)) {
      console.log(`✓ Fixed ${file}`);
    }
  }
}

// Process all directories
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && 
          entry.name !== 'node_modules' && 
          entry.name !== '.next' &&
          entry.name !== 'dist') {
        processDirectory(fullPath);
      }
    } else if (entry.isFile() && 
               (entry.name.endsWith('.ts') || 
                entry.name.endsWith('.tsx'))) {
      totalFiles++;
      if (fixStubbornSyntax(fullPath)) {
        console.log(`✓ Fixed ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
}

console.log('\nProcessing all source files...');
processDirectory(path.join(process.cwd(), 'src'));

console.log(`\n✅ Summary:`);
console.log(`   Total files: ${totalFiles}`);
console.log(`   Files fixed: ${filesFixed}`);