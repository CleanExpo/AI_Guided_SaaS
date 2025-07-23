const fs = require('fs');
const path = require('path');

// Common syntax error patterns to fix
const fixes = [
  // Fix cva function calls with semicolons
  { pattern: /const (\w+) = cva\(;/g, replacement: 'const $1 = cva(' },
  
  // Fix object properties with semicolons instead of commas
  { pattern: /: "(.*?)";/g, replacement: ': "$1",' },
  
  // Fix React.forwardRef with semicolons
  { pattern: /React\.forwardRef<;/g, replacement: 'React.forwardRef<' },
  
  // Fix template literal issues
  { pattern: /className=\{``cn\(``/g, replacement: 'className={cn(' },
  { pattern: /\)``\}``/g, replacement: ')}' },
  
  // Fix hover/focus/disabled syntax
  { pattern: /; hover:/g, replacement: ' hover:' },
  { pattern: /; focus:/g, replacement: ' focus:' },
  { pattern: /; disabled:/g, replacement: ' disabled:' },
  { pattern: /; active:/g, replacement: ' active:' },
  { pattern: /, hover:/g, replacement: ' hover:' },
  { pattern: /, focus:/g, replacement: ' focus:' },
  { pattern: /, disabled:/g, replacement: ' disabled:' },
  { pattern: /, active:/g, replacement: ' active:' },
  
  // Fix object syntax with semicolons
  { pattern: /\{;/g, replacement: '{' },
  { pattern: /};/g, replacement: '},' },
  
  // Fix array/object ending
  { pattern: /\}\)/g, replacement: '}\n  )' },
  { pattern: /\}\]/g, replacement: '}\n  ]' }
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Apply all fixes
    fixes.forEach(fix => {
      content = content.replace(fix.pattern, fix.replacement);
    });
    
    // Add 'use client' if file uses hooks and doesn't have it
    if ((content.includes('useState') || content.includes('useEffect') || 
         content.includes('useContext') || content.includes('useReducer') ||
         content.includes('useCallback') || content.includes('useMemo') ||
         content.includes('useRef')) && !content.startsWith("'use client'")) {
      content = "'use client';\n\n" + content;
}
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${path.basename(filePath)}`);
      return true;
}
    return false;
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
    return false;
}
}
// Process all UI component files
const _uiDir = path.join(__dirname, '..', 'src', 'components', 'ui');
const files = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx'));

let fixedCount = 0;
files.forEach(file => {
  if (fixFile(path.join(uiDir, file))) {
    fixedCount++;
}
});

console.log(`\nFixed ${fixedCount} files out of ${files.length} total UI components.`);