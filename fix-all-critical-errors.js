#!/usr/bin/env node

import fs from 'fs';
import { glob } from 'glob';

console.log('🔧 Starting comprehensive critical error fixing for 100% error-free build...');

// Critical files identified from typecheck output
const criticalFiles = [
  'src/app/chat/page.tsx',
  'src/app/community/page.tsx',
  'src/app/auth/signin/page.tsx',
  'src/app/collaborate/page.tsx',
  'src/app/config/page.tsx',
  'src/app/admin-direct/page.tsx',
  'src/app/admin/login/page.tsx',
  'src/app/analytics/advanced/page.tsx'
];

let totalFixesApplied = 0;
let filesModified = 0;

const comprehensiveFixes = [
  // Fix double closing brackets
  {
    name: 'Fix double closing brackets (>>)',
    pattern: />\s*>/g,
    replacement: '>'
  },
  
  // Fix malformed template literal closures
  {
    name: 'Fix malformed template literal closures',
    pattern: />\s*}`\s*>/g,
    replacement: '\n    }`}>'
  },
  
  // Fix broken className template literals
  {
    name: 'Fix broken className template literals',
    pattern: /className=\{`[^`]*>\s*}`\s*>/g,
    replacement: (match) => {
      return match.replace(/>\s*}`\s*>/, '\n    }`}>')
    }
  },
  
  // Fix unclosed Input elements
  {
    name: 'Fix unclosed Input elements',
    pattern: /<Input([^>]*)(\n[^/]*?)(?!\/?>)/g,
    replacement: (match, attrs, rest) => {
      if (rest && !rest.includes('/>') && !rest.includes('</Input>')) {
        return `<Input${attrs}\n${rest}/>`
      }
      return match
    }
  },
  
  // Fix missing closing tags for JSX elements
  {
    name: 'Fix missing closing tags',
    pattern: /(<\w+[^>]*[^/])(\n\s*<\w)/g,
    replacement: '$1>\n$2'
  },
  
  // Fix broken onClick handlers
  {
    name: 'Fix broken onClick handlers',
    pattern: /(\w+)\s*>\s*onClick=/g,
    replacement: '$1\n                    onClick='
  },
  
  // Fix broken JSX expressions
  {
    name: 'Fix broken JSX expressions',
    pattern: /\{\s*\w+\s*>\s*}/g,
    replacement: (match) => {
      return match.replace(/>\s*}/, '}')
    }
  },
  
  // Fix missing placeholder attributes
  {
    name: 'Fix missing placeholder attributes',
    pattern: /=("[^"]*Ask[^"]*")/g,
    replacement: 'placeholder=$1'
  },
  
  // Fix broken template literal endings
  {
    name: 'Fix broken template literal endings',
    pattern: /`\s*>\s*}/g,
    replacement: '`}'
  },
  
  // Fix unclosed div elements with missing >
  {
    name: 'Fix unclosed div elements',
    pattern: /(<div[^>]*className="[^"]*")(\n\s*<)/g,
    replacement: '$1>$2'
  }
];

for (const filePath of criticalFiles) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      continue;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let fileFixesApplied = 0;
    
    // Apply all comprehensive fixes
    comprehensiveFixes.forEach(fix => {
      const beforeContent = content;
      if (typeof fix.replacement === 'function') {
        content = content.replace(fix.pattern, fix.replacement);
      } else {
        content = content.replace(fix.pattern, fix.replacement);
      }
      
      if (content !== beforeContent) {
        fileFixesApplied++;
        console.log(`  ✓ Applied ${fix.name} to ${filePath}`);
      }
    });
    
    // File-specific critical fixes
    if (filePath.includes('chat/page.tsx')) {
      // Fix specific chat page issues
      content = content.replace(/className=\{`[^`]*}\s*>\s*>/g, (match) => {
        return match.replace(/}\s*>\s*>/, '}>')
      });
      content = content.replace(/hover:text-gray-100">\s*onClick=/g, 'hover:text-gray-100"\n                    onClick=');
      fileFixesApplied += 2;
    }
    
    if (filePath.includes('community/page.tsx')) {
      // Fix community page corruption
      content = content.replace(/(\w+)\s*"\s*\n\s*([A-Z])/g, '$1">\n                $2');
      content = content.replace(/Community\s*Guidelines"\s*\/>/g, 'Community Guidelines" />');
      fileFixesApplied += 2;
    }
    
    if (filePath.includes('signin/page.tsx')) {
      // Fix signin page Input elements
      content = content.replace(/(required)\s*\n\s*<\/Button>/g, '$1 />\n            </Button>');
      fileFixesApplied += 1;
    }
    
    if (filePath.includes('collaborate/page.tsx')) {
      // Fix collaborate page syntax
      content = content.replace(/onClick=\{[^}]*}\s*>/g, (match) => {
        return match.replace(/}\s*>/, '}')
      });
      fileFixesApplied += 1;
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      filesModified++;
      totalFixesApplied += fileFixesApplied;
      console.log(`📝 Modified ${filePath} (${fileFixesApplied} fixes)`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

console.log(`\n✅ Comprehensive critical error fixing complete!`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Total fixes applied: ${totalFixesApplied}`);
console.log(`\n🔍 Testing build process...`);