#!/usr/bin/env node

/**
 * MCAS Build Blocker Fixer
 * Targets specific syntax errors preventing build
 */

const fs = require('fs');
const path = require('path');

// Track fixes
const fixes = [];

/**
 * Fix specific syntax patterns blocking build
 */
function fixBuildBlockers(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix 1: Return statement with comma instead of parenthesis
    // Pattern: return (, <jsx> => return (<jsx>
    content = content.replace(/return\s*\(\s*,\s*</g, 'return (');
    
    // Fix 2: Import statement with colon instead of from
    // Pattern: import { x } from: 'module' => import { x } from 'module'
    content = content.replace(/from\s*:\s*'/g, "from '");
    content = content.replace(/from\s*:\s*"/g, 'from "');
    
    // Fix 3: Multiple commas in variable declarations
    // Pattern: let x, let y => let x; let y
    content = content.replace(/let\s+(\w+)\s*,\s*let\s+/g, 'let $1; let ');
    content = content.replace(/const\s+(\w+)\s*,\s*const\s+/g, 'const $1; const ');
    
    // Fix 4: Stray semicolons in arrays
    // Pattern: const [; => const [
    content = content.replace(/const\s*\[\s*;/g, 'const [');
    
    // Fix 5: Missing function keyword
    // Pattern: export async functionName => export async function functionName
    content = content.replace(/export\s+async\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, 'export async function $1(');
    
    // Fix 6: Double commas in JSX
    content = content.replace(/,\s*,\s*</g, ', <');
    
    // Fix 7: Semicolons where commas should be in objects
    content = content.replace(/(\w+)\s*:\s*([^,;}\n]+);\s*(\w+\s*:)/g, '$1: $2,\n  $3');
    
    // Fix 8: Array syntax issues
    content = content.replace(/:\s*any\[\]/g, ': any[]');
    content = content.replace(/linked_to:\s*any\[\]/g, 'linked_to: []');
    
    // Fix 9: Missing semicolons after statements
    content = content.replace(/^(\s*(?:const|let|var|return|import|export)\s+[^;{}\n]+)$/gm, '$1;');
    
    // Fix 10: Clean up return statements
    content = content.replace(/return\s+;\s*{/g, 'return {');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixes.push(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

console.log('🔨 MCAS Build Blocker Fixer');
console.log('==========================\n');

// Fix specific files mentioned in build errors
const problemFiles = [
  'src/app/about/page.tsx',
  'src/app/admin-direct/page.tsx',
  'src/app/admin/agent-monitor/page.tsx',
  'src/lib/admin-auth.ts',
  'src/lib/breadcrumb/breadcrumb-agent.ts',
  'src/app/api/agent-chat/route.ts'
];

// Also process test files
const testFiles = [
  'tests/e2e/basic-flow.test.ts',
  'tests/e2e/comprehensive-validation.spec.ts',
  'tests/integration/api/health.test.ts',
  'tests/unit/lib/agents/CPURateLimiter.test.ts',
  'tests/unit/lib/requirements/ClientRequirementsProcessor.test.ts'
];

const allFiles = [...problemFiles, ...testFiles];

for (const file of allFiles) {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    if (fixBuildBlockers(fullPath)) {
      console.log(`✓ Fixed ${file}`);
    }
  }
}

// Also scan for more files with similar issues
function scanAndFix(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && 
          entry.name !== 'node_modules' && 
          entry.name !== '.next') {
        scanAndFix(fullPath);
      }
    } else if (entry.isFile() && 
               (entry.name.endsWith('.ts') || 
                entry.name.endsWith('.tsx'))) {
      if (fixBuildBlockers(fullPath)) {
        console.log(`✓ Fixed ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
}

console.log('\nScanning for more files...');
scanAndFix(path.join(process.cwd(), 'src'));

console.log(`\n✅ Fixed ${fixes.length} files`);