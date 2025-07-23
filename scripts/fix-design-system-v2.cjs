const fs = require('fs');
const path = require('path');

const _filePath = path.join(__dirname, '..', 'src', 'lib', 'design-system', 'components.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix interface declarations with semicolons
  content = content.replace(/interface (\w+Props) extends ([^{]+)\s*\{;/g, 'interface $1 extends $2{');
  content = content.replace(/interface (\w+)\s*\{;/g, 'interface $1 {');
  
  // Fix object declarations
  content = content.replace(/const (\w+) = \{;/g, 'const $1 = {');
  
  // Fix hover/focus/active/disabled pseudo-classes
  content = content.replace(/; hover:/g, ' hover:');
  content = content.replace(/; focus:/g, ' focus:');
  content = content.replace(/; disabled:/g, ' disabled:');
  content = content.replace(/; active:/g, ' active:');
  content = content.replace(/ hover: /g, ' hover:');
  content = content.replace(/ focus: /g, ' focus:');
  content = content.replace(/ disabled: /g, ' disabled:');
  content = content.replace(/ active: /g, ' active:');
  
  // Fix string concatenation in className
  content = content.replace(/'([^']+)' '([^']+)' '([^']+)'/g, "'$1', '$2', '$3'");
  content = content.replace(/'([^']+)' '([^']+)'/g, "'$1', '$2'");
  
  // Fix object property syntax
  content = content.replace(/: '([^']+)';/g, ": '$1',");
  
  // Fix cn function calls
  content = content.replace(/'rounded-xl transition-all duration-200' variants\[variant\], paddings\[padding\],/g, "'rounded-xl transition-all duration-200', variants[variant], paddings[padding],");
  content = content.replace(/'rounded-xl transition-all duration-200' variants\[variant\] sizes\[size\] className/g, "'rounded-xl transition-all duration-200', variants[variant], sizes[size], className");
  content = content.replace(/'inline-flex items-center gap-1 font-medium rounded-full' variants\[variant\] sizes\[size\] className/g, "'inline-flex items-center gap-1 font-medium rounded-full', variants[variant], sizes[size], className");
  content = content.replace(/'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors' isCompleted/g, "'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors', isCompleted");
  content = content.replace(/'text-sm font-medium' isActive/g, "'text-sm font-medium', isActive");
  
  // Fix template literal issues
  content = content.replace(/\)`}``/g, ')}');
  content = content.replace(/``}/g, '`}');
  content = content.replace(/\${percentage}%``/g, '${percentage}%`');
  
  // Fix JSX syntax errors
  content = content.replace(/<Info className="h-5 w-5 text-blue-600" \/>;/g, '<Info className="h-5 w-5 text-blue-600" />,');
  content = content.replace(/<CheckCircle className="h-5 w-5 text-green-600" \/>;/g, '<CheckCircle className="h-5 w-5 text-green-600" />,');
  content = content.replace(/<AlertTriangle className="h-5 w-5 text-yellow-600" \/>;/g, '<AlertTriangle className="h-5 w-5 text-yellow-600" />,');
  content = content.replace(/<AlertCircle className="h-5 w-5 text-red-600" \/>;/g, '<AlertCircle className="h-5 w-5 text-red-600" />,');
  
  // Fix closing tags in wrong places
  content = content.replace(/<\/Info>/g, '');
  content = content.replace(/<\/CheckCircle>/g, '');
  content = content.replace(/<\/AlertTriangle>/g, '');
  
  // Fix function declarations
  content = content.replace(/}: (\w+Props)\): string \{/g, '}: $1) {');
  content = content.replace(/export function (\w+)\(\{ ;/g, 'export function $1({');
  
  // Fix React Fragment syntax
  content = content.replace(/<React.Fragment key=\{step\.id\}><\/React>/g, '<React.Fragment key={step.id}>');
  
  // Fix return type annotations
  content = content.replace(/\): void \{/g, ') {');
  
  // Fix animation syntax
  content = content.replace(/transition: \{ duration: 0\.5; delay: 0\.2 \}/g, 'transition={{ duration: 0.5, delay: 0.2 }}');
  content = content.replace(/transition: \{ duration: animated \? 0\.5 : 0; ease: "easeOut" \}/g, 'transition={{ duration: animated ? 0.5 : 0, ease: "easeOut" }}');
  
  // Fix initial/animate syntax
  content = content.replace(/initial: \{ opacity: 0; y: -10 \}/g, 'initial={{ opacity: 0, y: -10 }}');
  content = content.replace(/animate: \{ opacity: 1; y: 0 \}/g, 'animate={{ opacity: 1, y: 0 }}');
  content = content.replace(/exit: \{ opacity: 0; y: -10 \}/g, 'exit={{ opacity: 0, y: -10 }}');
  
  // Fix default export syntax
  content = content.replace(/export default \{;/g, 'export default {');
  
  // Remove extra closing tags
  content = content.replace(/\)\s*\}\s*<\/HTMLButtonElement>/g, ')');
  content = content.replace(/\)\s*\}\s*<\/HTMLDivElement>/g, ')');
  
  // Fix empty paddings
  content = content.replace(/none: '';/g, "none: '',");
  
  // Fix boolean logic in className
  content = content.replace(/interactive && 'cursor-pointer hover: shadow-xl hover:-translate-y-1' className/g, "interactive && 'cursor-pointer hover:shadow-xl hover:-translate-y-1', className");
  content = content.replace(/fullWidth && 'w-full' className/g, "fullWidth && 'w-full', className");
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed design-system/components.tsx (v2)');
} catch (err) {
  console.error('Error:', err.message);
}