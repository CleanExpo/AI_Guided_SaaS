#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🎯 Focused TypeScript Error Fixer');
console.log('=================================\n');

// Target the most common error patterns based on the codebase
const errorPatterns = [
  // Pattern 1: Fix syntax errors in interfaces and types
  {
    name: 'Interface syntax fixes',
    patterns: [
      // Fix trailing semicolons in interfaces
      { regex: /;(\s*})(?=\s*;|\s*,|\s*\))/g, replacement: '$1' },
      // Fix mixed separators
      { regex: /;,/g, replacement: ';' },
      { regex: /,;/g, replacement: ',' },
      // Fix property definitions
      { regex: /(\w+)\s*:\s*([^;,\n}]+);(\s*})/g, replacement: '$1: $2$3' },
    ]
  },
  
  // Pattern 2: Fix function and method syntax
  {
    name: 'Function syntax fixes',
    patterns: [
      // Fix parameter type annotations
      { regex: /\(([^:)]+):\s*any\)\s*:\s*any/g, replacement: '($1)' },
      // Fix if statement conditions with type annotations
      { regex: /if\s*\(([^:)]+):\s*any\)/g, replacement: 'if ($1)' },
      // Fix catch clause type annotations
      { regex: /catch\s*\(([^:)]+):\s*(any|unknown|Error)\)/g, replacement: 'catch ($1)' },
    ]
  },
  
  // Pattern 3: Fix object and array literals
  {
    name: 'Object/Array literal fixes',
    patterns: [
      // Fix array declarations
      { regex: /const\s+(\w+)\s*:\s*any\[\]\s*=\s*\[/g, replacement: 'const $1 = [' },
      // Fix object property syntax
      { regex: /{\s*;/g, replacement: '{' },
      { regex: /\[\s*;/g, replacement: '[' },
      // Fix trailing semicolons in objects
      { regex: /;(\s*})/g, replacement: '$1' },
    ]
  },
  
  // Pattern 4: Fix specific TypeScript patterns
  {
    name: 'TypeScript-specific fixes',
    patterns: [
      // Fix return type annotations
      { regex: /\)\s*:\s*void\s*{/g, replacement: ') {' },
      // Fix const declarations with type annotations
      { regex: /const\s+(\w+)\s*:\s*any\s*=/g, replacement: 'const $1 =' },
      // Fix let declarations with type annotations
      { regex: /let\s+(\w+)\s*:\s*any\s*=/g, replacement: 'let $1 =' },
      // Fix variable declarations in for loops
      { regex: /for\s*\(\s*const\s+(\w+)\s*:\s*any\s+of\s+/g, replacement: 'for (const $1 of ' },
    ]
  },
  
  // Pattern 5: Fix React-specific patterns
  {
    name: 'React-specific fixes',
    patterns: [
      // Fix useState type annotations
      { regex: /const\s+\[(\w+),\s*(\w+)\]\s*:\s*any\[\]\s*=\s*useState/g, replacement: 'const [$1, $2] = useState' },
      // Fix event handler type annotations
      { regex: /\(e\s*:\s*any\)\s*=>/g, replacement: '(e) =>' },
      // Fix className syntax
      { regex: /className={cn\("([^"]+)"\s+"([^"]+)"\)}/g, replacement: 'className={cn("$1", "$2")}' },
    ]
  },
  
  // Pattern 6: Fix broken syntax patterns
  {
    name: 'Broken syntax fixes',
    patterns: [
      // Fix broken if statements
      { regex: /if\s*\(([^)]+)\)\s*:\s*any/g, replacement: 'if ($1)' },
      // Fix $2 placeholders
      { regex: /return\s+\$2\s*;/g, replacement: 'return;' },
      { regex: /if\s*\(false\)\s*{\s*return\s+\$2\s*}/g, replacement: 'if (false) { return; }' },
      // Fix duplicate breaks
      { regex: /break;\s*break;/g, replacement: 'break;' },
    ]
  }
];

// Files to prioritize based on error count
const priorityFiles = [
  'src/lib/mcp/mcp-orchestrator.ts',
  'src/config/pulse.config.ts',
  'src/components/AdvancedCodeEditor.tsx',
  'src/components/GuidedProjectBuilder.tsx',
  'src/lib/agents/PulsedAgentOrchestrator.ts',
  'src/lib/agents/DockerAgentManager.ts',
  'src/scripts/comprehensive-typescript-fix.ts',
  'src/scripts/production-framework/fix-typescript-errors.ts'
];

function applyFixes(content, filePath) {
  let fixed = content;
  let totalFixes = 0;
  const appliedFixes = [];
  
  errorPatterns.forEach(category => {
    category.patterns.forEach(pattern => {
      const before = fixed;
      fixed = fixed.replace(pattern.regex, pattern.replacement);
      if (before !== fixed) {
        totalFixes++;
        appliedFixes.push(category.name);
      }
    });
  });
  
  return { fixed, totalFixes, appliedFixes: [...new Set(appliedFixes)] };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = applyFixes(content, filePath);
    
    if (result.totalFixes > 0) {
      fs.writeFileSync(filePath, result.fixed, 'utf8');
      console.log(`✅ ${path.relative(process.cwd(), filePath)}`);
      console.log(`   Fixed: ${result.appliedFixes.join(', ')}`);
      console.log(`   Total fixes: ${result.totalFixes}\n`);
      return result.totalFixes;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
    return 0;
  }
}

async function main() {
  // First process priority files
  console.log('📌 Processing priority files...\n');
  let totalFixes = 0;
  
  for (const file of priorityFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      totalFixes += processFile(fullPath);
    }
  }
  
  // Then process all other TypeScript files
  console.log('\n📂 Processing remaining TypeScript files...\n');
  
  const patterns = [
    'src/**/*.{ts,tsx}',
    'scripts/**/*.{ts,tsx}',
    'tests/**/*.{ts,tsx}'
  ];
  
  const excludePatterns = [
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/build/**'
  ];
  
  const files = [];
  patterns.forEach(pattern => {
    const matches = glob.sync(pattern, {
      ignore: excludePatterns,
      nodir: true
    });
    files.push(...matches);
  });
  
  // Filter out priority files already processed
  const remainingFiles = files.filter(file => {
    const relative = path.relative(process.cwd(), file).replace(/\\/g, '/');
    return !priorityFiles.includes(relative);
  });
  
  console.log(`📁 Found ${remainingFiles.length} remaining files to process\n`);
  
  let processedCount = 0;
  for (const file of remainingFiles) {
    totalFixes += processFile(file);
    processedCount++;
    
    if (processedCount % 50 === 0) {
      console.log(`📊 Progress: ${processedCount}/${remainingFiles.length} files...\n`);
    }
  }
  
  console.log('\n✅ TypeScript error fixing complete!');
  console.log(`📊 Total fixes applied: ${totalFixes}`);
  console.log('\n💡 Run "npm run build" to check remaining errors');
}

main().catch(console.error);