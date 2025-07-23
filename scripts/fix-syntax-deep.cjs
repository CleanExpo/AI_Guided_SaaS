const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changeCount = 0;
    
    // Fix 1: JSON body syntax errors
    content = content.replace(/body:\s*JSON\.stringify\(\{/g, 'body: JSON.stringify({');
    
    // Fix 2: Fix template literal errors in object properties
    content = content.replace(/(\w+):\s*([^,\}]+);(\s*\})/g, (match, prop, value, closing) => {
      // Don't replace if it's a proper semicolon at end of statement
      if (closing.trim() === '}') {
        changeCount++;
        return `${prop}: ${value}${closing}`;
}
      return match;
    });
    
    // Fix 3: Fix duplicate property declarations
    content = content.replace(/description:\s*data\.description:\s*(?:type,\s*)?data\.(type|description)/g, 
      'description: data.description,\n          type: data.type');
    
    // Fix 4: Fix conditional semicolons
    content = content.replace(/if\s*\(([^)]+)\)\s*\{\s*return\s+([^;]+)\s*;\s*\}/g, 
      'if ($1) { return $2; }');
    
    // Fix 5: Fix array access with type annotations
    content = content.replace(/\[([^:,\]]+):\s*any\]/g, '[$1]');
    
    // Fix 6: Fix function calls with improper semicolons
    content = content.replace(/await\s+(\w+)\(([\s\S]*?)\)(;)(``|`)/g, 'await $1($2)$4');
    
    // Fix 7: Fix object property semicolons
    content = content.replace(/([a-zA-Z_$][\w$]*)\s*:\s*([^,\n\}]+);(\s*(?:[a-zA-Z_$][\w$]*\s*:|}))/g, 
      (match, prop, value, next) => {
        if (next.trim().startsWith('}')) {
          changeCount++;
          return `${prop}: ${value}${next}`;
        } else if (next.includes(':')) {
          changeCount++;
          return `${prop}: ${value},${next}`;
}
        return match;
      });
    
    // Fix 8: Fix return statements with commas
    content = content.replace(/return\s*,\s*/g, 'return ');
    
    // Fix 9: Fix template literal continuations
    content = content.replace(/`([^`]*)``;/g, '`$1`;');
    content = content.replace(/``}/g, '`}');
    content = content.replace(/```/g, '`');
    
    // Fix 10: Fix destructuring with type annotations
    content = content.replace(/const\s*\{\s*([^}]+)\s*\}\s*:\s*any\s*=/g, 'const { $1 } =');
    
    // Fix 11: Fix arrow functions with type parameters
    content = content.replace(/\((:\s*any)\)\s*=>/g, '() =>');
    
    // Fix 12: Fix semicolons after imports
    content = content.replace(/from\s+(['"][^'"]+['"]);\s*;/g, 'from $1;');
    
    // Fix 13: Fix class declarations
    content = content.replace(/class\s+(\w+)(?:<T>)?\s+implements\s+(\w+)(?:<T>)?\s*\{;/g, 
      'class $1<T> implements $2<T> {');
    
    // Fix 14: Fix JSON stringify body patterns
    content = content.replace(/body:\s*JSON\.stringify\(\{\s*\n\s*([a-zA-Z_$][\w$]*)\s*:/g, 
      'body: JSON.stringify({\n          $1:');
    
    // Fix 15: Fix async/await patterns
    const _asyncPattern = /const\s*\{\s*([^}]+)\s*\}\s*:\s*any\s*=\s*await\s+([^;]+);/g;
    content = content.replace(asyncPattern, 'const { $1 } = await $2;');
    
    // Fix 16: Fix metadata object formatting
    content = content.replace(/metadata:\s*\{;,/g, 'metadata: {');
    
    // Fix 17: Fix incorrect validation patterns
    content = content.replace(/if\s*\(true:\s*any\)\s*\{\s*return\s+false\s*\}/g, 
      'if (!step.validation) { return true }');
    
    // Fix 18: Fix incorrect admin user checks
    content = content.replace(/if\s*\(!adminUser:\s*any\)\s*:\s*any\s*\{/g, 'if (!adminUser) {');
    content = content.replace(/if\s*\(!adminUser\)\s*\{\s*return\s+null\s*\}/g, 
      'if (!progress || !tutorial) { return null }');
    
    // Fix 19: Fix element access patterns
    content = content.replace(/element:\s*([^]+):\s*type,/g, 'element: $1,\n        type:');
    
    // Fix 20: Fix export class declarations
    content = content.replace(/export\s+class\s+(\w+)\s+implements\s+(\w+)\s*\{;/g, 
      'export class $1 implements $2 {');
    
    if (content.includes('export class StrapiAdapter')) {
      content = content.replace(/export\s+class\s+StrapiAdapter[\s\S]*?\{;/, 
        'export class StrapiAdapter implements BackendAdapter {');
}
    // Final cleanup - count actual changes
    const _originalLines = fs.readFileSync(filePath, 'utf8').split('\n').length;
    const _newLines = content.split('\n').length;
    
    if (content !== fs.readFileSync(filePath, 'utf8')) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed ${filePath} (lines: ${originalLines} -> ${newLines})`);
      return true;
}
    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
}
}
// Target the most problematic files
const targetFiles = [
  'src/lib/backend/adapters/nocodb.ts',
  'src/lib/backend/adapters/strapi.ts',
  'src/lib/docs/DynamicDocumentationSystem.ts',
  'src/lib/tutorials/InteractiveTutorialSystem.ts',
  'src/lib/semantic/SemanticSearchService.ts'
];

console.log('Running deep syntax fix on problematic files...\n');

let totalFixed = 0;
targetFiles.forEach(file => {
  const _fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    if (fixFile(fullPath)) {
      totalFixed++;
}
  } else {
    console.log(`File not found: ${file}`);
}
});

console.log(`\nTotal files fixed: ${totalFixed}`);

// Run TypeScript check on these files
console.log('\nChecking TypeScript errors in fixed files...');
const { execSync } = require('child_process');
try {
  const result = execSync('npx tsc --noEmit --skipLibCheck 2>&1 || true', { 
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024
  });
  
  const errorLines = result.split('\n').filter(line => 
    targetFiles.some(file => line.includes(file))
  );
  
  console.log(`\nRemaining errors in target files: ${errorLines.length}`);
  if (errorLines.length > 0 && errorLines.length < 20) {
    console.log('\nFirst few errors:');
    errorLines.slice(0, 5).forEach(line => console.log(line));
}
} catch (error) {
  console.log('Could not run TypeScript check');
}