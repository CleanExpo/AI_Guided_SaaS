const fs = require('fs');
const path = require('path');

console.log('🔧 Critical Syntax Error Fixer');
console.log('================================\n');

// Critical files that need fixing based on the error output
const criticalFiles = [
  'src/lib/design-system/components.tsx',
  'src/components/AIChat.tsx',
  'src/components/AIChatWithSemantic.tsx',
  'src/lib/semantic/SemanticSearchService.ts',
  'src/hooks/useSemanticSearch.ts',
  'src/components/SemanticSearchDemo.tsx',
  'scripts/comprehensive-health-check.ts',
  'scripts/env-cli.ts',
  'scripts/execute-deployment-fixes.ts',
  'scripts/test-agent-workflow.ts',
  'scripts/update-claude-memory.ts',
  'scripts/initialize-agent-system.ts',
  'scripts/load-deployment-agents.ts',
  'scripts/monitor-agents.ts'
];

// Fix patterns specific to the current errors
const fixes = [
  // Fix import statement issues
  { pattern: /import\s+\{([^}]+)\}from\s+'([^']+)'/g, replacement: "import { $1 } from '$2'" },
  { pattern: /import\s+\*\s+as\s+(\w+)from\s+'([^']+)'/g, replacement: "import * as $1 from '$2'" },
  
  // Fix variable declaration issues
  { pattern: /const,\s*(\w+):/g, replacement: 'const $1:' },
  { pattern: /let,\s*(\w+):/g, replacement: 'let $1:' },
  { pattern: /export const,\s*(\w+):/g, replacement: 'export const $1:' },
  
  // Fix interface/type declarations
  { pattern: /interface\s+(\w+)\s*\{;/g, replacement: 'interface $1 {' },
  { pattern: /interface\s+(\w+)\s*\{\s*;/g, replacement: 'interface $1 {' },
  { pattern: /type\s+(\w+)\s*=\s*\{;/g, replacement: 'type $1 = {' },
  
  // Fix object literal issues
  { pattern: /const\s+(\w+)\s*=\s*\[;/g, replacement: 'const $1 = [' },
  { pattern: /:\s*'([^']+)';/g, replacement: ": '$1'," },
  { pattern: /:\s*"([^"]+)";/g, replacement: ': "$1",' },
  
  // Fix function syntax
  { pattern: /async function main\(\) \{;/g, replacement: 'async function main() {' },
  { pattern: /export default function\s+(\w+)\(\)\s*\{;/g, replacement: 'export default function $1() {' },
  
  // Fix arrow function issues
  { pattern: /\)\s*=>\s*\{;/g, replacement: ') => {' },
  { pattern: /\}\s*,\s*\(/g, replacement: '}, (' },
  
  // Fix JSX issues
  { pattern: /<\/(\w+)><\/\1>/g, replacement: '</$1>' },
  { pattern: /className={cn\("([^"]+)"\s+"([^"]+)"\s*\)}/g, replacement: 'className={cn("$1", "$2")}' },
  { pattern: /'([^']+)'\s+'([^']+)'/g, replacement: "'$1', '$2'" },
  
  // Fix template literal issues
  { pattern: /\${([^}]+)}`}``/g, replacement: '${$1}`}' },
  { pattern: /``\}/g, replacement: '`}' },
  { pattern: /\)`}``/g, replacement: ')}' },
  
  // Fix semicolon/comma issues
  { pattern: /;\s*\n\s*(\w+):/g, replacement: ',\n    $1:' },
  { pattern: /}\s*;\s*(\w+):/g, replacement: '},\n    $1:' },
  { pattern: /'\s*;\s*(\w+):/g, replacement: "',\n    $1:" },
  { pattern: /"\s*;\s*(\w+):/g, replacement: '",\n    $1:' },
  
  // Fix closing bracket/brace issues
  { pattern: /\)\s*\}\s*<\/HTML\w+Element>/g, replacement: ')' },
  { pattern: /\}\s*;\s*\}/g, replacement: '}\n}' },
  
  // Fix React Fragment
  { pattern: /<React\.Fragment key={([^}]+)}><\/React>/g, replacement: '<React.Fragment key={$1}>' },
  
  // Fix async/await
  { pattern: /async\s+\(\)\s*=>\s*\{;/g, replacement: 'async () => {' }
];

function fixFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ File not found: ${filePath}`);
      return false;
}
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Apply all fixes
    fixes.forEach(fix => {
      const _newContent = content.replace(fix.pattern, fix.replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
}
    });
    
    // Additional manual fixes for specific patterns
    
    // Fix missing semicolons at end of statements
    content = content.replace(/^(\s*(?:const|let|var)\s+\w+\s*=\s*[^;{\n]+)$/gm, '$1;');
    
    // Fix object property syntax
    content = content.replace(/,\s*}/g, '\n}');
    
    // Fix interface extends syntax
    content = content.replace(/interface\s+(\w+)\s+extends\s+([^{]+)\s*\{\s*;/g, 'interface $1 extends $2 {');
    
    // Fix JSX multiline issues
    content = content.replace(/>\s*,\s*</g, '><');
    
    // Fix trailing commas in JSX
    content = content.replace(/,\s*\)/g, ')');
    
    // Fix specific component syntax errors
    if (filePath.includes('components.tsx')) {
      // Fix the specific pattern in design-system components
      content = content.replace(/'use client'import/g, "'use client';\nimport");
      content = content.replace(/transition:\s*\{\s*duration:\s*([^;]+);\s*([^}]+)\s*\}/g, 'transition={{ duration: $1, $2 }}');
      content = content.replace(/interface UnifiedButtonProps extends HTMLMotionProps<"button">\s*\{;/g, 'interface UnifiedButtonProps extends HTMLMotionProps<"button"> {');
}
    if (filePath.includes('AIChat')) {
      // Fix AIChat specific issues
      content = content.replace(/'use client'import/g, "'use client';\nimport");
      content = content.replace(/const _chatQuestions = \[;/g, 'const _chatQuestions = [');
      content = content.replace(/export default function AIChat\(.*?\) \{;/g, 'export default function AIChat({ persona, onProjectConfigReady }: AIChatProps) {');
}
    if (filePath.includes('SemanticSearchService')) {
      // Fix import issues
      content = content.replace(/import \{ logger \} from '@\/lib\/logger';export/g, "import { logger } from '@/lib/logger';\n\nexport");
}
    if (filePath.includes('useSemanticSearch')) {
      // Fix import and syntax issues
      content = content.replace(/import \{([^}]+)\}from/g, 'import { $1 } from');
      content = content.replace(/const _errorMessage = ([^;]+),/g, 'const _errorMessage = $1;');
}
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
      return true;
}
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
}
  return false;
}
// Main execution
let totalFixed = 0;

console.log('🎯 Fixing critical files with syntax errors...\n');

criticalFiles.forEach(file => {
  const _fullPath = path.join(process.cwd(), file);
  if (fixFile(fullPath)) {
    totalFixed++;
}
});

// Also scan and fix any .ts/.tsx files in src and scripts
const directories = ['src', 'scripts'];

directories.forEach(dir => {
  const _dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    const _scanDirectory = (directory) => {
      const files = fs.readdirSync(directory);
      
      files.forEach(file => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !['node_modules', '.next', 'dist'].includes(file)) {
          scanDirectory(filePath);
        } else if ((file.endsWith('.ts') || file.endsWith('.tsx')) && !criticalFiles.some(cf => filePath.includes(cf))) { if (fixFile(filePath)) {
            totalFixed++;
           });
    };
    
    scanDirectory(dirPath);
}
});

console.log(`\n✨ Fixed ${totalFixed} files`);
console.log('\n📊 Running quick error check...');

// Check if we can at least build the semantic search service
try {
  const { execSync } = require('child_process');
  execSync('npx tsc src/lib/semantic/SemanticSearchService.ts --noEmit', { stdio: 'pipe' });
  console.log('✅ Semantic Search Service compiles successfully!');
} catch (error) {
  console.log('⚠️ Semantic Search Service still has errors');
}