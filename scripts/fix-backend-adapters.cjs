const fs = require('fs');
const path = require('path');

const fixes = [
  // Fix import statements with missing semicolons
  {
    pattern: /^import\s+.*from\s+['"][^'"]+['"](import\s+)/gm,
    replacement: (match, nextImport) => match.replace(nextImport, ';\n' + nextImport)
  },
  
  // Fix function declarations with improper syntax
  {
    pattern: /function\s+(\w+)\(\):\s*void\s*\{/g,
    replacement: 'function $1(): string {'
  },
  
  // Fix object/array declarations with improper semicolons
  {
    pattern: /(\w+):\s*([^,\n]+);(\s*\})/g,
    replacement: '$1: $2$3'
  },
  
  // Fix arrow function parameters
  {
    pattern: /\((:\s*any)\)/g,
    replacement: '()'
  },
  
  // Fix conditional statements
  {
    pattern: /if\s*\(([^:]+):\s*any\)\s*:\s*any\s*\{/g,
    replacement: 'if ($1) {'
  },
  
  // Fix return statements with improper commas
  {
    pattern: /return,\s*/g,
    replacement: 'return '
  },
  
  // Fix template literals
  {
    pattern: /`([^`]+)```/g,
    replacement: '`$1`'
  },
  
  // Fix Record type declarations
  {
    pattern: /const\s+(\w+):\s*Record<string,\s*string>\s*=\s*\{(\s*\r?);/g,
    replacement: 'const $1: Record<string, string> = {$2'
  },
  
  // Fix semicolons in object properties
  {
    pattern: /(['"]\w+['"]\s*:\s*[^,\}]+);(\s*\})/g,
    replacement: '$1$2'
  },
  
  // Fix array/object property access
  {
    pattern: /\[([^:\]]+):\s*any\]/g,
    replacement: '[$1]'
  },
  
  // Fix function parameters
  {
    pattern: /\(([^,\)]+),\s*(\w+):\s*any\)/g,
    replacement: '($1, $2: any)'
  },
  
  // Fix break statements
  {
    pattern: /break,(\s|$)/g,
    replacement: 'break;$1'
  },
  
  // Fix object destructuring
  {
    pattern: /const\s*\{\s*(\w+)\s*\}\s*:\s*any\s*=/g,
    replacement: 'const { $1 } ='
  },
  
  // Fix async arrow functions
  {
    pattern: /\((:\s*any)\)\s*=>/g,
    replacement: '() =>'
  },
  
  // Fix conditional returns
  {
    pattern: /if\s*\(!adminUser:\s*any\)\s*:\s*any\s*\{\s*return\s+([^;]+);\s*\}/g,
    replacement: 'if (!adminUser) { return $1; }'
  },
  
  // Fix property access with colons
  {
    pattern: /description:\s*type,/g,
    replacement: 'description: data.description,\n          type:'
  },
  
  // Fix import merging
  {
    pattern: /^import\s+\{([^}]+)\}\s+from\s+(['"][^'"]+['"])([^;]*)$/gm,
    replacement: 'import { $1 } from $2;'
  },
  
  // Fix constructor parameters
  {
    pattern: /if\s*\(!config\.url\s*\|\|\s*!config\.apiKey:\s*any\)\s*:\s*any\s*\{/g,
    replacement: 'if (!config.url || !config.apiKey) {'
  },
  
  // Fix template literal backticks
  {
    pattern: /`;`(\r?)\n/g,
    replacement: '`;\n'
}
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changeCount = 0;
    
    fixes.forEach(fix => {
      const _originalContent = content;
      content = content.replace(fix.pattern, fix.replacement);
      if (content !== originalContent) {
        changeCount++;
}
    });
    
    if (changeCount > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed ${changeCount} patterns in ${filePath}`);
      return true;
}
    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
}
}
// Fix specific problematic files
const filesToFix = [
  'src/lib/backend/adapters/nocodb.ts',
  'src/lib/backend/adapters/strapi.ts',
  'src/lib/docs/DynamicDocumentationSystem.ts',
  'src/lib/tutorials/InteractiveTutorialSystem.ts',
  'src/lib/semantic/SemanticSearchService.ts'
];

let totalFixed = 0;
filesToFix.forEach(file => {
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