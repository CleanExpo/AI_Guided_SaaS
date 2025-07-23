const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Comprehensive fixes for all remaining syntax errors
const fixes = [
  // Missing commas in metadata objects
  {
    pattern: /title:\s*'[^']+'\s*description:/g,
    replacement: (match) => match.replace(/'\s*description:/, "',\n  description:")
  },
  // Missing commas in theme/config objects
  {
    pattern: /label:\s*'[^']+'\s*icon:/g,
    replacement: (match) => match.replace(/'\s*icon:/, "', icon:")
  },
  {
    pattern: /label:\s*'[^']+'\s*value:/g,
    replacement: (match) => match.replace(/'\s*value:/, "', value:")
  },
  // Fix unterminated JSX
  {
    pattern: /<\/div>\s*\n\s*<\/div>\s*\);/g,
    replacement: '</div>\n    </div>\n  );'
  },
  // Fix duplicate closing tags in JSX
  {
    pattern: /<\/[^>]+><\/[^>]+>/g,
    replacement: (match) => {
      const tag = match.match(/<\/([^>]+)>/)[1];
      return `</${tag}>`;
    }
  },
  // Fix malformed JSX structures
  {
    pattern: />\s*<p className="[^"]+">([^<]+)<\/p>\s*\)/g,
    replacement: '>\n          <p className="$1">$2</p>\n        </div>\n      </div>\n    );'
  },
  // Fix missing closing divs
  {
    pattern: /<div className="[^"]+"\s*>\s*<p/g,
    replacement: '<div className="$1">\n        <p'
  }
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Apply general fixes
    fixes.forEach(fix => {
      const newContent = content.replace(fix.pattern, fix.replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    // File-specific fixes
    if (filePath.includes('Dashboard.tsx')) {
      // Fix missing closing div before grid
      content = content.replace(
        /<\/div>\s*<div className="grid/g,
        '</div>\n        </div>\n        <div className="grid'
      );
      modified = true;
    }
    
    if (filePath.includes('design-system/page.tsx')) {
      // Fix Card structure
      content = content.replace(
        /<\/CardContent>\s*<\/Card>\s*\{\/\* Badges \*\/\}/g,
        '</CardContent>\n              </Card>\n            </div>\n            {/* Badges */}'
      );
      modified = true;
    }
    
    if (filePath.includes('docs/page.tsx')) {
      // Fix malformed JSX and array structure
      const fixedContent = content.replace(
        /<div className="animate-spin[^>]+>\s*<p[^>]+>[^<]+<\/p>\s*\)/g,
        '<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>\n          <p className="text-muted-foreground">Loading documentation...</p>\n        </div>\n      </div>\n    );'
      );
      if (fixedContent !== content) {
        content = fixedContent;
        modified = true;
      }
    }
    
    if (filePath.includes('docs/[slug]/page.tsx')) {
      // Fix closing div structure
      content = content.replace(
        /<\/div>\s*<\/div>\s*\);/g,
        '</div>\n      </div>\n    </div>\n  );'
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Target specific files with errors
const specificFiles = [
  'src/components/Dashboard.tsx',
  'src/app/demo/design-system/page.tsx',
  'src/app/docs/[slug]/page.tsx',
  'src/app/docs/page.tsx',
  'src/app/enterprise/page.tsx'
];

// Also scan for all files with common patterns
const allFiles = glob.sync('src/**/*.{ts,tsx}', { cwd: process.cwd() });

let totalFixed = 0;

// Fix specific files first
specificFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    if (fixFile(fullPath)) {
      totalFixed++;
    }
  }
});

// Then fix any remaining files with common patterns
allFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!specificFiles.includes(file) && fixFile(fullPath)) {
    totalFixed++;
  }
});

console.log(`\nTotal files fixed: ${totalFixed}`);