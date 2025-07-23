#!/usr/bin/env node

/**
 * Comprehensive Type Error Fixer
 * Processes all TypeScript files to add missing types
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Statistics
let stats = {
  filesProcessed: 0,
  filesModified: 0,
  totalFixes: 0
};

// Apply type fixes to content
function applyTypeFixes(content, filePath) {
  let fixed = content;
  let fixes = 0;
  
  // 1. Fix function parameters without types
  fixed = fixed.replace(/function\s+(\w+)\s*\(([^)]*)\)\s*{/g, (match, name, params) => {
    if (!params) return match;
    
    const _fixedParams = params.split(',').map(param => {
      param = param.trim();
      if (!param) return param;
      
      // Skip if already has a type
      if (param.includes(':')) return param;
      
      // Skip if it's a destructuring pattern
      if (param.includes('{') || param.includes('[')) {
        fixes++;
        return `${param}: any`;
}
      // Add any type to simple parameters
      if (param.match(/^\w+$/)) {
        fixes++;
        return `${param}: any`;
}
      return param;
    }).join(', ');
    
    return `function ${name}(${fixedParams}) {`;
  });
  
  // 2. Fix arrow function parameters
  fixed = fixed.replace(/(?:^|\s|=)\s*\(([^)]*)\)\s*=>/gm, (match, params) => {
    if (!params) return match;
    
    const _fixedParams = params.split(',').map(param => {
      param = param.trim();
      if (!param || param.includes(':')) return param;
      
      if (param.match(/^\w+$/)) {
        fixes++;
        return `${param}: any`;
}
      return param;
    }).join(', ');
    
    return match.replace(params, fixedParams);
  });
  
  // 3. Fix single parameter arrow functions
  fixed = fixed.replace(/(?:^|\s|=)\s*(\w+)\s*=>/gm, (match, param) => {
    if (!match.includes(':')) {
      fixes++;
      return match.replace(param, `${param}: any`);
}
    return match;
  });
  
  // 4. Fix React functional components
  if (filePath.endsWith('.tsx')) {
    // Add React import if needed
    if (!fixed.includes('import React') && fixed.includes('export')) {
      fixed = `import React from 'react';\n${fixed}`;
      fixes++;
}
    // Fix function components
    fixed = fixed.replace(/export\s+(?:const|function)\s+(\w+)\s*(?::\s*React\.FC)?\s*=\s*\(/g, (match, name) => {
      if (!match.includes('React.FC')) {
        fixes++;
        return `export const ${name}: React.FC<any> = (`;
}
      return match;
    });
}
  // 5. Fix async function return types
  fixed = fixed.replace(/async\s+function\s+(\w+)\s*\(([^)]*)\)\s*{/g, (match, name, params) => {
    if (!match.includes(':') || !match.includes('Promise')) {
      fixes++;
      return `async function ${name}(${params}): Promise<any> {`;
}
    return match;
  });
  
  // 6. Fix object destructuring in function parameters
  fixed = fixed.replace(/function\s+(\w+)\s*\(\s*{\s*([^}]+)\s*}\s*\)/g, (match, name, props) => {
    if (!match.includes(':')) {
      fixes++;
      return `function ${name}({ ${props} }: any)`;
}
    return match;
  });
  
  // 7. Fix catch blocks
  fixed = fixed.replace(/catch\s*\((\w+)\)\s*{/g, (match, error) => {
    if (!match.includes(':')) {
      fixes++;
      return `catch (${error}: any) {`;
}
    return match;
  });
  
  // 8. Fix empty object/array declarations
  fixed = fixed.replace(/(const|let|var)\s+(\w+)\s*=\s*{}/g, (match, keyword, name) => {
    if (!content.includes(`${name}:`)) {
      fixes++;
      return `${keyword} ${name}: any = {}`;
}
    return match;
  });
  
  fixed = fixed.replace(/(const|let|var)\s+(\w+)\s*=\s*\[\]/g, (match, keyword, name) => {
    if (!content.includes(`${name}:`)) {
      fixes++;
      return `${keyword} ${name}: any[] = []`;
}
    return match;
  });
  
  // 9. Fix method parameters in classes
  fixed = fixed.replace(/^\s*(\w+)\s*\(([^)]*)\)\s*{/gm, (match, methodName, params) => {
    // Skip constructors and already typed methods
    if (methodName === 'constructor' || match.includes(':') || !params) return match;
    
    const _fixedParams = params.split(',').map(param => {
      param = param.trim();
      if (!param || param.includes(':')) return param;
      
      if (param.match(/^\w+$/)) {
        fixes++;
        return `${param}: any`;
}
      return param;
    }).join(', ');
    
    return match.replace(params, fixedParams);
  });
  
  // 10. Fix useState hooks
  fixed = fixed.replace(/const\s*\[\s*(\w+)\s*,\s*(\w+)\s*\]\s*=\s*useState\(/g, (match, state, setter) => {
    if (!match.includes('<')) {
      fixes++;
      return `const [${state}, ${setter}] = useState<any>(`;
}
    return match;
  });
  
  stats.totalFixes += fixes;
  return { fixed, changesMade: fixes > 0 };
}
// Process a single file
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { fixed, changesMade } = applyTypeFixes(content, filePath);
    
    if (changesMade) {
      fs.writeFileSync(filePath, fixed);
      stats.filesModified++;
      console.log(`✓ Fixed ${path.relative(process.cwd(), filePath)}`);
}
    stats.filesProcessed++;
    return changesMade;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}: ${error.message}`);
    return false;
}
}
// Main execution
function main() {
  console.log('🔧 Comprehensive Type Error Fixer');
  console.log('=================================\n');
  
  const patterns = [
    'src/**/*.{ts,tsx}',
    'scripts/**/*.ts',
    'tests/**/*.{ts,tsx}',
    '.agent-os/**/*.ts',
    'mcp/**/*.ts'
  ];
  
  const _excludePatterns = [
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/build/**',
    '**/*.d.ts'
  ];
  
  console.log('📂 Scanning for TypeScript files...');
  
  const files = [];
  patterns.forEach(pattern => {
    const _matches = glob.sync(pattern, {
      ignore: excludePatterns,
      nodir: true
    });
    files.push(...matches);
  });
  
  console.log(`📝 Found ${files.length} TypeScript files\n`);
  
  console.log('🔧 Processing files...\n');
  
  files.forEach((file, index) => {
    processFile(file);
    
    if ((index + 1) % 50 === 0) {
      console.log(`\n📊 Progress: ${index + 1}/${files.length} files...\n`);
}
  });
  
  console.log('\n✅ Summary:');
  console.log(`   Total files processed: ${stats.filesProcessed}`);
  console.log(`   Files modified: ${stats.filesModified}`);
  console.log(`   Total fixes applied: ${stats.totalFixes}`);
  
  console.log('\n💡 Next steps:');
  console.log('   1. Run "npm run build" to check remaining errors');
  console.log('   2. Consider adding proper types instead of "any"');
  console.log('   3. Configure tsconfig.json for stricter type checking');
}
main();