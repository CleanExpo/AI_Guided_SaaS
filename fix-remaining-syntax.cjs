const fs = require('fs');
const path = require('path');

// Fix specific patterns that cause syntax errors
const fixes = [
  // Fix missing closing divs
  {
    pattern: /(\s+)<\/div>\s*\);\s*\}$/gm,
    replacement: '$1  </div>\n    </div>\n  );\n}'
  },
  // Fix missing closing braces in JSX
  {
    pattern: /(\s+)<\/Card>\s*<\/div>\s*\);\s*\}$/gm,
    replacement: '$1  </Card>\n      </div>\n    </div>\n  );\n}'
  },
  // Fix incorrectly closed JSX
  {
    pattern: /(\s+)(<\/[^>]+>)\s*\)\s*\}$/gm,
    replacement: '$1$2\n    </div>\n  );\n}'
  }
];

const filesToFix = [
  'src/app/admin/analytics/page.tsx',
  'src/app/analytics/page.tsx',
  'src/app/api-docs/[slug]/page.tsx',
  'src/app/api-docs/page.tsx',
  'src/app/auth/signin/page.tsx'
];

console.log('Fixing remaining syntax errors...\n');

filesToFix.forEach(file => {
  const fullPath = path.join(__dirname, file);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;
    
    // Apply fixes
    fixes.forEach(fix => {
      content = content.replace(fix.pattern, fix.replacement);
    });
    
    // Manual fixes for specific patterns
    // Fix interface commas
    content = content.replace(/(\w+): ([^,}\n]+),(\s*\n\s*\w+:)/g, '$1: $2;$3');
    content = content.replace(/(\w+): ([^,}\n]+)(\s*\n\s*\})/g, '$1: $2;$3');
    
    // Fix missing closing divs pattern
    if (content.includes('  );') && !content.includes('    </div>\n  );')) {
      content = content.replace(/(\s+)(\);)(\s*\})\s*$/m, '$1  </div>\n$1$2\n$3');
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Fixed: ${file}`);
    } else {
      console.log(`⚪ No changes: ${file}`);
    }
  } else {
    console.log(`❌ Not found: ${file}`);
  }
});

console.log('\nFix script complete.');