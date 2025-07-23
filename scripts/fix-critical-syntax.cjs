#!/usr/bin/env node

/**
 * Critical Syntax Error Fixer
 * Fixes the most severe syntax errors in TypeScript files
 */

const fs = require('fs');
const path = require('path');

// Files with the most critical errors
const criticalFiles = [
  'src/lib/tutorials/InteractiveTutorialSystem.ts',
  'src/lib/backend/adapters/nocodb.ts',
  'src/lib/docs/DynamicDocumentationSystem.ts',
  'src/lib/backend/adapters/strapi.ts',
  'src/lib/database.ts',
  'src/components/ui/form-enhanced.tsx',
  'src/components/SemanticSearchDemo.tsx',
  'scripts/index-project-semantic.ts'
];

function fixCriticalSyntax(content) {
  let fixed = content;
  
  // Fix interface property syntax errors
  // Replace comma+semicolon combinations
  fixed = fixed.replace(/,\s*;/g, ';');
  
  // Fix object literal syntax
  fixed = fixed.replace(/{\s*,/g, '{');
  fixed = fixed.replace(/,\s*,/g, ',');
  fixed = fixed.replace(/,\s*}/g, '}');
  
  // Fix array literal syntax
  fixed = fixed.replace(/\[\s*;,/g, '[');
  fixed = fixed.replace(/;\s*,/g, ',');
  
  // Fix property definitions with wrong separators
  fixed = fixed.replace(/(\w+)\s*:\s*([^,;}\n]+),\s*(\w+)\s*:/g, '$1: $2;\n  $3:');
  
  // Fix interface properties that incorrectly use comma
  fixed = fixed.replace(/interface\s+\w+\s*{([^}]+)}/g, (match, body) => {
    const _fixedBody = body.replace(/,(\s*\w+\s*:)/g, ';$1');
    return match.replace(body, fixedBody);
  });
  
  // Fix type definitions
  fixed = fixed.replace(/type\s+\w+\s*=\s*{([^}]+)}/g, (match, body) => {
    const _fixedBody = body.replace(/,(\s*\w+\s*:)/g, ';$1');
    return match.replace(body, fixedBody);
  });
  
  // Fix broken array syntax
  fixed = fixed.replace(/\[;,/g, '[');
  fixed = fixed.replace(/const\s+\w+:\s*\w+\[\]\s*=\s*\[;,/g, (match) => {
    return match.replace('[;,', '[');
  });
  
  // Fix broken validation object syntax
  fixed = fixed.replace(/validation:\s*{/g, 'validation: {');
  fixed = fixed.replace(/action:\s*{/g, 'action: {');
  fixed = fixed.replace(/config:\s*{/g, 'config: {');
  fixed = fixed.replace(/metadata:\s*{/g, 'metadata: {');
  fixed = fixed.replace(/preferences:\s*{/g, 'preferences: {');
  
  // Fix property declarations that end with semicolon+comma
  fixed = fixed.replace(/;,(\s*})/g, '$1');
  
  // Fix incorrect property assignments
  fixed = fixed.replace(/(\w+)\s*:\s*([^:,;}\n]+);(\s*\w+\s*:)/g, '$1: $2,\n  $3');
  
  // Fix broken completionRewards syntax
  fixed = fixed.replace(/completionRewards:\s*{/g, 'completionRewards: {');
  
  // Fix incorrect semicolons in object literals
  fixed = fixed.replace(/({[^}]*?);\s*(\w+\s*:)/g, '$1,\n  $2');
  
  // Fix broken if statements
  fixed = fixed.replace(/if\s*\([^)]*\)\s*:\s*any/g, (match) => {
    return match.replace(': any', '');
  });
  
  // Fix broken return statements
  fixed = fixed.replace(/return\s+\$2;/g, 'return false;');
  
  // Fix arrow function parameter types
  fixed = fixed.replace(/\(([^)]+):\s*any\s*=>/g, '($1) =>');
  
  // Fix broken break statements
  fixed = fixed.replace(/break;\s*break;/g, 'break;');
  
  // Fix class member visibility
  fixed = fixed.replace(/private,\s*(\w+)/g, 'private $1');
  
  // Fix broken syntax in specific patterns
  fixed = fixed.replace(/^\s*]$/gm, '');
  fixed = fixed.replace(/^\s*}$/gm, '}');
  
  // Remove stray semicolons after closing braces in interfaces
  fixed = fixed.replace(/}\s*;\s*(\w+\s*:)/g, '}\n  $1');
  
  // Fix incorrect comma usage in interface/type definitions
  fixed = fixed.replace(/(:\s*[^,;}\n]+),(\s*})/g, '$1$2');
  
  return fixed;
}
function processFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    const _content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixCriticalSyntax(content);
    
    if (fixed !== content) {
      fs.writeFileSync(filePath, fixed);
      console.log(`✓ Fixed ${filePath}`);
      return true;
    } else {
      console.log(`  No changes needed for ${filePath}`);
      return false;
}
  } catch (error) {
    console.error(`✗ Error processing ${filePath}: ${error.message}`);
    return false;
}
}
// Main execution
function main() {
  console.log('🔧 Critical Syntax Error Fixer');
  console.log('==============================\n');
  
  let fixedCount = 0;
  
  criticalFiles.forEach(file => {
    const _fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      if (processFile(fullPath)) {
        fixedCount++;
}
    } else {
      console.log(`⚠️  File not found: ${file}`);
}
  });
  
  console.log(`\n✅ Fixed ${fixedCount} files`);
}
main();