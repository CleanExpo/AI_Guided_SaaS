#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 SYSTEMATIC ERROR ELIMINATION - Phase FINAL');

const PROJECT_ROOT = process.cwd();

// Priority error patterns with systematic fixes
const ERROR_PATTERNS = [
  // JSX Syntax Fixes (Highest Priority)
  {
    name: 'JSX Closing Tags',
    pattern: />\s*{`([^`]*)`}\s*</g,
    replacement: '>{`$1`}<',
    priority: 1
  },
  {
    name: 'JSX Expression Fix',
    pattern: /{\s*'([^']*)'}\s*or\s*`&gt;`/g,
    replacement: '{">"}',
    priority: 1
  },
  {
    name: 'Form Closing Tags',
    pattern: /(<form[^>]*>[\s\S]*?)(?=<\/div>|<\/Card>|$)/g,
    replacement: (match) => match.includes('</form>') ? match : match + '</form>',
    priority: 1
  },
  
  // Function Parameter Fixes (High Priority)
  {
    name: 'Function Parameters',
    pattern: /\(:\s*any\)\s*=>/g,
    replacement: '() =>',
    priority: 2
  },
  {
    name: 'Async Parameters',
    pattern: /async\s*\(:\s*any\)\s*=>/g,
    replacement: 'async () =>',
    priority: 2
  },
  {
    name: 'Function Type Annotations',
    pattern: /\)\s*:\s*any\s*,\s*async/g,
    replacement: ', async',
    priority: 2
  },
  
  // Interface & Type Fixes (Medium Priority)
  {
    name: 'Interface Property Syntax',
    pattern: /(\w+):\s*([^,;}]+);,/g,
    replacement: '$1: $2,',
    priority: 3
  },
  {
    name: 'Property Assignment',
    pattern: /(\w+):\s*([^,;}]+),;/g,
    replacement: '$1: $2,',
    priority: 3
  },
  {
    name: 'Interface Closing',
    pattern: /}\s*;,/g,
    replacement: '}',
    priority: 3
  },
  
  // API & Export Fixes (Lower Priority)
  {
    name: 'Export Default Function',
    pattern: /export\s+default\s+function\s+(\w+)\s*\(([^)]*)\)\s*:\s*any/g,
    replacement: 'export default function $1($2)',
    priority: 4
  },
  {
    name: 'API Response JSON',
    pattern: /NextResponse\.json\s*\(\s*;/g,
    replacement: 'NextResponse.json(',
    priority: 4
  }
];

// File categorization for targeted fixes
const FILE_CATEGORIES = {
  admin: [
    'src/app/admin-direct/page.tsx',
    'src/app/admin/dashboard/page.tsx',
    'src/app/admin/debug/page.tsx',
    'src/app/admin/login/page.tsx',
    'src/app/admin/login/layout.tsx'
  ],
  pages: [
    'src/app/analytics/page.tsx',
    'src/app/api-docs/[slug]/page.tsx',
    'src/app/api-docs/page.tsx'
  ],
  api: [
    'src/app/api/health/route.ts',
    'src/app/api/admin/route.ts',
    'src/app/api/*/route.ts'
  ],
  components: [
    'src/components/**/*.tsx'
  ]
};

function applySystematicFixes(content, filePath) {
  let fixed = content;
  const fileName = path.basename(filePath);
  let changesApplied = [];

  // Apply fixes by priority
  const sortedPatterns = ERROR_PATTERNS.sort((a, b) => a.priority - b.priority);
  
  for (const fix of sortedPatterns) {
    const before = fixed;
    
    if (typeof fix.replacement === 'function') {
      fixed = fixed.replace(fix.pattern, fix.replacement);
    } else {
      fixed = fixed.replace(fix.pattern, fix.replacement);
    }
    
    if (fixed !== before) {
      changesApplied.push(fix.name);
    }
  }

  // File-specific fixes
  if (fileName.includes('admin-direct') || fileName.includes('admin/login')) {
    // Fix form JSX structure
    fixed = fixed.replace(
      /(<form[^>]*>[\s\S]*?)\s*}\s*>\s*$/gm,
      '$1\n          </form>\n        </CardContent>\n      </Card>\n    </div>\n  );\n}'
    );
  }

  if (fileName.includes('page.tsx')) {
    // Fix export default syntax
    fixed = fixed.replace(
      /export\s+default\s+function\s+(\w+).*?:\s*any.*?\{/g,
      'export default function $1() {'
    );
  }

  if (fileName.includes('route.ts')) {
    // Fix API route exports
    fixed = fixed.replace(
      /export\s+async\s+function\s+(GET|POST|PUT|DELETE).*?:\s*Promise.*?\{/g,
      'export async function $1(request: NextRequest) {'
    );
  }

  return { fixed, changes: changesApplied };
}

async function fixFilesByCategory(category, files) {
  console.log(`\n📂 Processing ${category} files...`);
  let totalFixed = 0;
  
  for (const filePattern of files) {
    const filePaths = await glob(filePattern, { cwd: PROJECT_ROOT });
    
    for (const filePath of filePaths) {
      const fullPath = path.join(PROJECT_ROOT, filePath);
      
      if (!fs.existsSync(fullPath)) continue;
      
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const { fixed, changes } = applySystematicFixes(content, fullPath);
        
        if (fixed !== content) {
          fs.writeFileSync(fullPath, fixed, 'utf8');
          totalFixed++;
          console.log(`✅ ${filePath} - Applied: ${changes.join(', ')}`);
        }
      } catch (error) {
        console.log(`❌ ${filePath} - Error: ${error.message}`);
      }
    }
  }
  
  return totalFixed;
}

async function runSystematicFixes() {
  console.log('🚀 Starting systematic error elimination...');
  
  let totalFilesFixed = 0;
  
  // Process by category in priority order
  const categories = ['admin', 'pages', 'api', 'components'];
  
  for (const category of categories) {
    const fixed = await fixFilesByCategory(category, FILE_CATEGORIES[category]);
    totalFilesFixed += fixed;
  }
  
  console.log(`\n🎉 SYSTEMATIC FIXES COMPLETE!`);
  console.log(`📊 Total files fixed: ${totalFilesFixed}`);
  console.log(`🎯 Next: Run TypeScript check to validate improvements`);
  
  return totalFilesFixed;
}

// Simple glob implementation for file pattern matching
async function glob(pattern, options) {
  const { cwd } = options;
  
  if (pattern.includes('**')) {
    // Recursive search
    const baseDir = pattern.split('**')[0];
    const extension = pattern.split('**')[1];
    return findFilesRecursive(path.join(cwd, baseDir), extension);
  } else if (pattern.includes('*')) {
    // Simple wildcard
    const dir = path.dirname(pattern);
    const filename = path.basename(pattern);
    return findFilesInDir(path.join(cwd, dir), filename);
  } else {
    // Exact file
    return fs.existsSync(path.join(cwd, pattern)) ? [pattern] : [];
  }
}

function findFilesRecursive(dir, extension) {
  const files = [];
  
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findFilesRecursive(fullPath, extension));
    } else if (stat.isFile() && item.endsWith(extension)) {
      files.push(path.relative(PROJECT_ROOT, fullPath));
    }
  }
  
  return files;
}

function findFilesInDir(dir, pattern) {
  const files = [];
  
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    if (pattern === '*' || item.includes(pattern.replace('*', ''))) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isFile()) {
        files.push(path.relative(PROJECT_ROOT, fullPath));
      }
    }
  }
  
  return files;
}

// Run the systematic fixes
runSystematicFixes().catch(error => {
  console.error('❌ Systematic fix failed:', error.message);
  process.exit(1);
});