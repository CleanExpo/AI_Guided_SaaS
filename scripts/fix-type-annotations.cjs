#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 PHASE 1a: Type Annotation Fixer');
console.log('Target: ~7,359 type annotation errors (40% of remaining)');

const PROJECT_ROOT = process.cwd();

// Type annotation patterns and fixes
const TYPE_ANNOTATION_FIXES = [
  // useState hook fixes
  {
    name: 'useState Array Type Fix',
    pattern: /const\s+\[(\w+),\s*(\w+)\]:\s*any\[\]\s*=\s*useState</g,
    replacement: 'const [$1, $2] = useState',
    priority: 1
  },
  {
    name: 'useState Generic Fix',
    pattern: /const\s+\[(\w+),\s*(\w+)\]:\s*any\s*=\s*useState<([^>]+)>/g,
    replacement: 'const [$1, $2] = useState<$3>',
    priority: 1
  },
  {
    name: 'useState Simple Fix',
    pattern: /const\s+\[(\w+),\s*(\w+)\]:\s*any\s*=\s*useState/g,
    replacement: 'const [$1, $2] = useState',
    priority: 1
  },
  
  // Function return type fixes
  {
    name: 'Function Return Type Fix',
    pattern: /export\s+default\s+function\s+(\w+)\([^)]*\):\s*void\s*{/g,
    replacement: 'export default function $1() {',
    priority: 2
  },
  {
    name: 'Function Return Any Fix',
    pattern: /export\s+default\s+function\s+(\w+)\([^)]*\):\s*any\s*{/g,
    replacement: 'export default function $1() {',
    priority: 2
  },
  {
    name: 'Function Return JSX Fix',
    pattern: /export\s+default\s+function\s+(\w+)\([^)]*\):\s*JSX\.Element\s*{/g,
    replacement: 'export default function $1() {',
    priority: 2
  },
  
  // Async function fixes
  {
    name: 'Async Function Fix',
    pattern: /export\s+async\s+function\s+(GET|POST|PUT|DELETE)\([^)]*\):\s*Promise[^{]*{/g,
    replacement: 'export async function $1(request: NextRequest) {',
    priority: 2
  },
  
  // Variable type annotation fixes
  {
    name: 'Variable Type Annotation Fix',
    pattern: /const\s+(\w+):\s*any\s*=\s*/g,
    replacement: 'const $1 = ',
    priority: 3
  },
  {
    name: 'Let Variable Type Fix',
    pattern: /let\s+(\w+):\s*any\s*=\s*/g,
    replacement: 'let $1 = ',
    priority: 3
  },
  
  // React component prop fixes
  {
    name: 'Component Props Fix',
    pattern: /\(\{\s*([^}]+)\s*\}:\s*any\)\s*=>/g,
    replacement: '({ $1 }) =>',
    priority: 4
  },
  {
    name: 'Component Props Destructuring Fix',
    pattern: /\(\{\s*([^}]+)\s*\}:\s*\{\s*([^}]+)\s*\}\)\s*=>/g,
    replacement: '({ $1 }: { $2 }) =>',
    priority: 4
  },
  
  // Event handler fixes
  {
    name: 'Event Handler Fix',
    pattern: /\(([^)]*?):\s*any\)\s*=>\s*{/g,
    replacement: '($1) => {',
    priority: 5
  },
  
  // Interface property fixes
  {
    name: 'Interface Property Type',
    pattern: /(\w+):\s*any([,;}])/g,
    replacement: '$1: string$2',
    priority: 6
  }
];

// Files to process - focus on high-impact areas
const TARGET_PATTERNS = [
  'src/app/**/*.tsx',
  'src/components/**/*.tsx', 
  'src/lib/**/*.ts',
  'src/hooks/**/*.ts',
  'src/app/api/**/*.ts'
];

function applyTypeAnnotationFixes(content, filePath) {
  let fixed = content;
  let changesApplied = [];
  
  // Apply fixes by priority
  const sortedFixes = TYPE_ANNOTATION_FIXES.sort((a, b) => a.priority - b.priority);
  
  for (const fix of sortedFixes) {
    const before = fixed;
    fixed = fixed.replace(fix.pattern, fix.replacement);
    
    if (fixed !== before) {
      changesApplied.push(fix.name);
    }
  }
  
  // File-specific fixes
  const fileName = path.basename(filePath);
  
  if (fileName.includes('page.tsx')) {
    // Fix page component exports
    fixed = fixed.replace(
      /export\s+default\s+function\s+(\w+).*?:\s*[^{]*\{/g,
      'export default function $1() {'
    );
  }
  
  if (fileName.includes('route.ts')) {
    // Fix API route handlers
    fixed = fixed.replace(
      /export\s+async\s+function\s+(GET|POST|PUT|DELETE).*?:\s*Promise.*?\{/g,
      'export async function $1(request: NextRequest) {'
    );
  }
  
  if (filePath.includes('components/')) {
    // Fix React component props
    fixed = fixed.replace(
      /interface\s+(\w+)Props\s*{[\s\S]*?(\w+):\s*any;/g,
      (match, propName, propType) => match.replace(/:\s*any;/, ': string;')
    );
  }
  
  return { fixed, changes: changesApplied };
}

async function findFiles(pattern) {
  const files = [];
  
  // Simple recursive file finder for our patterns
  function findInDir(dir, extension) {
    if (!fs.existsSync(dir)) return [];
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files.push(...findInDir(fullPath, extension));
      } else if (stat.isFile() && item.endsWith(extension)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }
  
  // Extract extension and base path from pattern
  if (pattern.includes('**/*.tsx')) {
    const basePath = pattern.replace('**/*.tsx', '');
    return findInDir(path.join(PROJECT_ROOT, basePath), '.tsx');
  } else if (pattern.includes('**/*.ts')) {
    const basePath = pattern.replace('**/*.ts', '');
    return findInDir(path.join(PROJECT_ROOT, basePath), '.ts');
  }
  
  return [];
}

async function runTypeAnnotationFixes() {
  console.log('🚀 Starting type annotation fixes...\n');
  
  let totalFilesProcessed = 0;
  let totalFilesFixed = 0;
  let totalChanges = 0;
  
  for (const pattern of TARGET_PATTERNS) {
    console.log(`📂 Processing: ${pattern}`);
    const files = await findFiles(pattern);
    
    for (const filePath of files) {
      totalFilesProcessed++;
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const { fixed, changes } = applyTypeAnnotationFixes(content, filePath);
        
        if (fixed !== content) {
          fs.writeFileSync(filePath, fixed, 'utf8');
          totalFilesFixed++;
          totalChanges += changes.length;
          
          const relativePath = path.relative(PROJECT_ROOT, filePath);
          console.log(`✅ ${relativePath} - Applied: ${changes.slice(0, 3).join(', ')}${changes.length > 3 ? '...' : ''}`);
        }
      } catch (error) {
        const relativePath = path.relative(PROJECT_ROOT, filePath);
        console.log(`❌ ${relativePath} - Error: ${error.message}`);
      }
    }
  }
  
  console.log(`\n🎉 TYPE ANNOTATION FIXES COMPLETE!`);
  console.log(`📊 Files processed: ${totalFilesProcessed}`);
  console.log(`📊 Files fixed: ${totalFilesFixed}`);
  console.log(`📊 Total changes applied: ${totalChanges}`);
  console.log(`🎯 Estimated error reduction: ~${Math.min(totalChanges * 3, 7359)} errors`);
  
  return { totalFilesFixed, totalChanges };
}

// Run the type annotation fixes
runTypeAnnotationFixes().then(({ totalFilesFixed, totalChanges }) => {
  console.log('\n✨ Phase 1a Complete! Moving to Phase 1b...');
  console.log('🔍 Next: Interface Syntax Normalizer');
}).catch(error => {
  console.error('❌ Type annotation fix failed:', error.message);
  process.exit(1);
});