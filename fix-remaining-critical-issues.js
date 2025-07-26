#!/usr/bin/env node

import fs from 'fs';

console.log('🔧 Starting final critical error cleanup for 100% error-free build...');

const finalFixes = [
  {
    file: 'src/app/chat/page.tsx',
    fixes: [
      {
        from: /\/>\s*value={input}>/g,
        to: '\n                value={input}'
      },
      {
        from: /onChange=\{[^}]+\}>\s*onChange=/g,
        to: '\n                onChange='
      },
      {
        from: /placeholderplaceholder=/g,
        to: 'placeholder='
      },
      {
        from: /bg-purple-100'>\s*}`\s*>/g,
        to: "bg-purple-100'\n                    }`}"
      },
      {
        from: /bg-gray-900'>\s*}`\s*>/g,
        to: "bg-gray-900'\n                    }`}"
      }
    ]
  },
  {
    file: 'src/app/community/page.tsx',
    fixes: [
      {
        from: /(\w+)"\s*\n\s*([A-Z])/g,
        to: '$1">\n                $2'
      },
      {
        from: /Community Guidelines"\s*\/>/g,
        to: 'Community Guidelines" />'
      }
    ]
  },
  {
    file: 'src/app/auth/signin/page.tsx',
    fixes: [
      {
        from: /required\s*\n\s*<\/Button>/g,
        to: 'required />\n            </Button>'
      }
    ]
  }
];

let totalFixed = 0;

for (const fileConfig of finalFixes) {
  try {
    if (!fs.existsSync(fileConfig.file)) {
      console.log(`⚠️  File not found: ${fileConfig.file}`);
      continue;
    }

    let content = fs.readFileSync(fileConfig.file, 'utf8');
    const originalContent = content;
    let fileFixed = 0;

    for (const fix of fileConfig.fixes) {
      const before = content;
      content = content.replace(fix.from, fix.to);
      if (content !== before) {
        fileFixed++;
        console.log(`  ✓ Applied fix ${fileFixed} to ${fileConfig.file}`);
      }
    }

    if (content !== originalContent) {
      fs.writeFileSync(fileConfig.file, content);
      totalFixed += fileFixed;
      console.log(`📝 Updated ${fileConfig.file} with ${fileFixed} fixes`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${fileConfig.file}:`, error.message);
  }
}

console.log(`\n✅ Final critical cleanup complete!`);
console.log(`   Total fixes applied: ${totalFixed}`);