const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Aggressive TypeScript Error Fixer');
console.log('=====================================\n');

// Common syntax error patterns to fix
const fixes = [
  // Fix semicolon/comma issues in interfaces
  { pattern: /interface (\w+Props?) \{;/g, replacement: 'interface $1 {' },
  { pattern: /interface (\w+) extends ([^{]+)\{;/g, replacement: 'interface $1 extends $2{' },
  
  // Fix object/const declarations
  { pattern: /const (\w+) = \{;/g, replacement: 'const $1 = {' },
  { pattern: /const _types = \{;/g, replacement: 'const _types = {' },
  
  // Fix property syntax
  { pattern: /: '([^']+)';/g, replacement: ": '$1'," },
  { pattern: /: "([^"]+)";/g, replacement: ': "$1",' },
  
  // Fix className concatenation
  { pattern: /'([^']+)' '([^']+)'/g, replacement: "'$1', '$2'" },
  { pattern: /"([^"]+)" "([^"]+)"/g, replacement: '"$1", "$2"' },
  
  // Fix template literal issues
  { pattern: /\)`}``/g, replacement: ')}' },
  { pattern: /``}/g, replacement: '`}' },
  { pattern: /className=\{``cn\(/g, replacement: 'className={cn(' },
  
  // Fix arrow function type annotations
  { pattern: /\): void \{/g, replacement: ') {' },
  { pattern: /\): string \{/g, replacement: ') {' },
  { pattern: /\): JSX\.Element \{/g, replacement: ') {' },
  
  // Fix React.forwardRef
  { pattern: /React\.forwardRef<([^>]+)>\(;/g, replacement: 'React.forwardRef<$1>(' },
  
  // Fix export default
  { pattern: /export default \{;/g, replacement: 'export default {' },
  
  // Fix pseudo-class syntax
  { pattern: /; hover:/g, replacement: ' hover:' },
  { pattern: /; focus:/g, replacement: ' focus:' },
  { pattern: /; active:/g, replacement: ' active:' },
  { pattern: /; disabled:/g, replacement: ' disabled:' },
  
  // Fix animation props
  { pattern: /initial: \{ opacity: 0; y: -10 \}/g, replacement: 'initial={{ opacity: 0, y: -10 }}' },
  { pattern: /animate: \{ opacity: 1; y: 0 \}/g, replacement: 'animate={{ opacity: 1, y: 0 }}' },
  { pattern: /exit: \{ opacity: 0; y: -10 \}/g, replacement: 'exit={{ opacity: 0, y: -10 }}' },
  { pattern: /transition: \{ duration: ([^;]+); ([^}]+) \}/g, replacement: 'transition={{ duration: $1, $2 }}' },
  
  // Fix JSX closing tags
  { pattern: /<\/motion>/g, replacement: '' },
  { pattern: /<\/React>/g, replacement: '' },
  { pattern: /<\/Info>/g, replacement: '' },
  { pattern: /<\/CheckCircle>/g, replacement: '' },
  { pattern: /<\/AlertTriangle>/g, replacement: '' },
  { pattern: /<\/Loader2>/g, replacement: '' },
  
  // Fix variable declarations
  { pattern: /export function (\w+)\(\{ ;/g, replacement: 'export function $1({' },
  { pattern: /}\): (\w+Props)\): string \{/g, replacement: '}: $1) {' },
  
  // Fix import statements
  { pattern: /import \{ ;/g, replacement: 'import {' },
  
  // Fix array/object syntax
  { pattern: /\[\s*;\s*\]/g, replacement: '[]' },
  { pattern: /\{\s*;\s*\}/g, replacement: '{}' },
  
  // Fix component syntax errors  
  { pattern: /className\s*=\s*\{\s*cn\(\s*"([^"]+)"\s*"([^"]+)"\s*\)\s*\}/g, replacement: 'className={cn("$1", "$2")}' },
  { pattern: /className\s*=\s*\{cn\("([^"]+)"\s+children\s+&&\s+"([^"]+)"\)\}/g, replacement: 'className={cn("$1", children && "$2")}' },
  
  // Fix boolean expressions in className
  { pattern: /fullWidth && 'w-full' className/g, replacement: "fullWidth && 'w-full', className" },
  { pattern: /interactive && 'cursor-pointer hover: shadow-xl hover:-translate-y-1' className/g, replacement: "interactive && 'cursor-pointer hover:shadow-xl hover:-translate-y-1', className" },
  
  // Fix React Fragment syntax
  { pattern: /<React\.Fragment key=\{([^}]+)\}><\/React>/g, replacement: '<React.Fragment key={$1}>' },
  
  // Fix closing tags in wrong places
  { pattern: /\)\s*\}\s*<\/HTMLButtonElement>/g, replacement: ')' },
  { pattern: /\)\s*\}\s*<\/HTMLDivElement>/g, replacement: ')' },
  
  // Fix cn function calls
  { pattern: /'rounded-xl transition-all duration-200' variants\[variant\], paddings\[padding\],/g, replacement: "'rounded-xl transition-all duration-200', variants[variant], paddings[padding]," },
  { pattern: /'inline-flex items-center gap-1 font-medium rounded-full' variants\[variant\] sizes\[size\] className/g, replacement: "'inline-flex items-center gap-1 font-medium rounded-full', variants[variant], sizes[size], className" },
  
  // Fix unterminated strings and template literals
  { pattern: /(['"`])([^\1\n]*)\n\s*([^\1]*)\1/g, replacement: '$1$2$3$1' },
  
  // Fix variable declaration issues
  { pattern: /const\s+(\w+)\s*=\s*\{[\s\n]*;/g, replacement: 'const $1 = {' },
  { pattern: /let\s+(\w+)\s*=\s*\{[\s\n]*;/g, replacement: 'let $1 = {' },
  
  // Fix async/await syntax
  { pattern: /async\s+\(\s*\)\s*=>\s*\{;/g, replacement: 'async () => {' },
  { pattern: /\)\s*=>\s*\{;/g, replacement: ') => {' },
  
  // Fix JSX icon syntax
  { pattern: /<Info className="h-5 w-5 text-blue-600" \/>;/g, replacement: '<Info className="h-5 w-5 text-blue-600" />,' },
  { pattern: /<CheckCircle className="h-5 w-5 text-green-600" \/>;/g, replacement: '<CheckCircle className="h-5 w-5 text-green-600" />,' },
  { pattern: /<AlertTriangle className="h-5 w-5 text-yellow-600" \/>;/g, replacement: '<AlertTriangle className="h-5 w-5 text-yellow-600" />,' },
  { pattern: /<AlertCircle className="h-5 w-5 text-red-600" \/>;/g, replacement: '<AlertCircle className="h-5 w-5 text-red-600" />,' }
];

// Get all TypeScript and TSX files
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const _filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(file)) {
        getAllFiles(filePath, fileList);
}
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
}
  });
  
  return fileList;
}
// Fix a single file
function fixFile(filePath) {
  try {
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
    
    // Additional complex fixes
    
    // Fix multiple string concatenations in className
    content = content.replace(/className={cn\(([^)]+)\)}/g, (match, args) => {
      const _fixedArgs = args.replace(/'\s+'/g, "', '").replace(/"\s+"/g, '", "');
      return `className={cn(${fixedArgs})}`;
    });
    
    // Fix object property endings
    content = content.replace(/(['}"])\s*;\s*\n\s*}/g, '$1\n    }');
    
    // Fix missing commas in object literals
    content = content.replace(/(['"}])\s*\n\s*(['"{])/g, '$1,\n    $2');
    
    // Fix interface/type syntax
    content = content.replace(/interface\s+(\w+)\s*\{\s*;/g, 'interface $1 {');
    content = content.replace(/type\s+(\w+)\s*=\s*\{\s*;/g, 'type $1 = {');
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
}
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
}
  return false;
}
// Main execution
const targetDirs = ['src', 'scripts'];
let totalFixed = 0;

targetDirs.forEach(dir => {
  const _dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`\n📁 Processing ${dir} directory...`);
    const files = getAllFiles(dirPath);
    
    files.forEach(file => {
      if (fixFile(file)) {
        console.log(`✅ Fixed: ${path.relative(process.cwd(), file)}`);
        totalFixed++;
}
    });
}
});

console.log(`\n✨ Fixed ${totalFixed} files`);

// Run TypeScript check
console.log('\n📊 Running TypeScript check...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('\n✅ TypeScript check passed!');
} catch (error) {
  console.log('\n⚠️ TypeScript still has errors. Running error count...');
  try {
    const _errorCount = execSync('npx tsc --noEmit 2>&1 | grep -c "error TS"', { encoding: 'utf8' }).trim();
    console.log(`📊 Remaining errors: ${errorCount}`);
  } catch (e) {
    console.log('Could not count errors');
}
}