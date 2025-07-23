const fs = require('fs');
const path = require('path');

const _filePath = path.join(__dirname, '..', 'src', 'lib', 'design-system', 'components.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix object syntax with semicolons
  content = content.replace(/const variants = \{;/g, 'const variants = {');
  content = content.replace(/const _sizes = \{;/g, 'const _sizes = {');
  content = content.replace(/const paddings = \{;/g, 'const paddings = {');
  
  // Fix property syntax
  content = content.replace(/: '([^']+)';/g, ": '$1',");
  content = content.replace(/: '([^']+)'\}/g, ": '$1'\n    }");
  
  // Fix hover/focus/active/disabled syntax
  content = content.replace(/; hover:/g, ' hover:');
  content = content.replace(/; focus:/g, ' focus:');
  content = content.replace(/; disabled:/g, ' disabled:');
  content = content.replace(/; active:/g, ' active:');
  content = content.replace(/, hover:/g, ' hover:');
  content = content.replace(/, focus:/g, ' focus:');
  content = content.replace(/, disabled:/g, ' disabled:');
  content = content.replace(/, active:/g, ' active:');
  
  // Fix template literal syntax
  content = content.replace(/className=\{``cn\(``/g, 'className={cn(');
  content = content.replace(/\)``\}``/g, ')}');
  
  // Fix React.forwardRef syntax
  content = content.replace(/React\.forwardRef<([^>]+)>\(;/g, 'React.forwardRef<$1>(');
  
  // Fix interface syntax
  content = content.replace(/interface (\w+) \{;/g, 'interface $1 {');
  content = content.replace(/interface (\w+Props) extends ([^{]+)\{;/g, 'interface $1 extends $2{');
  
  // Fix function syntax
  content = content.replace(/export function (\w+)\(\{ ;/g, 'export function $1({');
  
  // Fix JSX syntax
  content = content.replace(/<\/motion>/g, '');
  content = content.replace(/<\/Loader2>/g, '');
  content = content.replace(/\{loading && \(</g, '{loading && (');
  content = content.replace(/\)\}/g, ')}');
  
  // Fix closing tags
  content = content.replace(/\)\s*\}\s*<\/HTMLButtonElement>/g, ')\n');
  content = content.replace(/\)\s*\}\s*<\/HTMLDivElement>/g, ')\n');
  
  // Fix cn function calls
  content = content.replace(/className=\{cn\("([^"]+)" children && "([^"]+)"\)\}/g, 'className={cn("$1", children && "$2")}');
  content = content.replace(/className=\{cn\(children && "([^"]+)"\)\}/g, 'className={cn(children && "$1")}');
  
  // Fix multi-line string concatenations
  content = content.replace(/'([^']+)' '([^']+)' '([^']+)'/g, "'$1', '$2', '$3'");
  content = content.replace(/'([^']+)' '([^']+)'/g, "'$1', '$2'");
  
  // Fix variants and paddings usage
  content = content.replace(/variants\[variant\] paddings\[padding\]/g, 'variants[variant], paddings[padding]');
  
  // Fix boolean expressions
  content = content.replace(/fullWidth && 'w-full' className/g, "fullWidth && 'w-full', className");
  content = content.replace(/interactive && 'cursor-pointer, hover: shadow-xl; hover:-translate-y-1' className/g, "interactive && 'cursor-pointer hover:shadow-xl hover:-translate-y-1', className");
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed design-system/components.tsx');
} catch (err) {
  console.error('Error:', err.message);
}