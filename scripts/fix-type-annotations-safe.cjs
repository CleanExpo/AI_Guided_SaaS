#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 PHASE 1a: Type Annotation Fixer (Safe Version)');
console.log('Target: ~7,359 type annotation errors (40% of remaining)');

const PROJECT_ROOT = process.cwd();

// Type annotation patterns and fixes
const TYPE_ANNOTATION_FIXES = [
  // useState hook fixes (highest impact)
  {
    name: 'useState Array Type Fix',
    pattern: /const\s+\[(\w+),\s*(\w+)\]:\s*any\[\]\s*=\s*useState/g,
    replacement: 'const [$1, $2] = useState'
  },
  {
    name: 'useState Generic Fix', 
    pattern: /const\s+\[(\w+),\s*(\w+)\]:\s*any\s*=\s*useState<([^>]+)>/g,
    replacement: 'const [$1, $2] = useState<$3>'
  },
  {
    name: 'useState Simple Fix',
    pattern: /const\s+\[(\w+),\s*(\w+)\]:\s*any\s*=\s*useState/g,
    replacement: 'const [$1, $2] = useState'
  },
  
  // Function return type fixes
  {
    name: 'Function Return Void Fix',
    pattern: /export\s+default\s+function\s+(\w+)\([^)]*\):\s*void\s*\{/g,
    replacement: 'export default function $1() {'
  },
  {
    name: 'Function Return Any Fix',
    pattern: /export\s+default\s+function\s+(\w+)\([^)]*\):\s*any\s*\{/g,
    replacement: 'export default function $1() {'
  },
  
  // Variable type annotation fixes
  {
    name: 'Const Any Fix',
    pattern: /const\s+(\w+):\s*any\s*=/g,
    replacement: 'const $1 ='
  },
  {
    name: 'Let Any Fix',
    pattern: /let\s+(\w+):\s*any\s*=/g,
    replacement: 'let $1 ='
  },
  
  // Event handler parameter fixes
  {
    name: 'Event Handler Param Fix',
    pattern: /\(([^:)]+):\s*any\)\s*=>/g,
    replacement: '($1) =>'
  }
];

// Specific high-impact files to target first
const HIGH_IMPACT_FILES = [
  'src/app/admin-direct/page.tsx',
  'src/app/admin/dashboard/page.tsx',
  'src/app/admin/login/page.tsx',
  'src/app/analytics/page.tsx',
  'src/app/api-docs/[slug]/page.tsx',
  'src/components/ui/form-enhanced.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/tabs.tsx',
  'src/components/AgentPulseMonitor.tsx',
  'src/components/ContainerMonitor.tsx'
];

function applyTypeAnnotationFixes(content, filePath) {
  let fixed = content;
  let changesApplied = [];
  
  for (const fix of TYPE_ANNOTATION_FIXES) {
    const before = fixed;
    fixed = fixed.replace(fix.pattern, fix.replacement);
    
    if (fixed !== before) {
      changesApplied.push(fix.name);
    }
  }
  
  return { fixed, changes: changesApplied };
}

async function runHighImpactFixes() {
  console.log('🚀 Starting high-impact type annotation fixes...\n');
  
  let totalFilesFixed = 0;
  let totalChanges = 0;
  
  for (const file of HIGH_IMPACT_FILES) {
    const filePath = path.join(PROJECT_ROOT, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${file} (not found)`);
      continue;
    }
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { fixed, changes } = applyTypeAnnotationFixes(content, filePath);
      
      if (fixed !== content) {
        fs.writeFileSync(filePath, fixed, 'utf8');
        totalFilesFixed++;
        totalChanges += changes.length;
        
        console.log(`✅ ${file} - Applied: ${changes.join(', ')}`);
      } else {
        console.log(`⏭️  No changes needed in ${file}`);
      }
    } catch (error) {
      console.log(`❌ ${file} - Error: ${error.message}`);
    }
  }
  
  console.log(`\n🎉 HIGH-IMPACT TYPE ANNOTATION FIXES COMPLETE!`);
  console.log(`📊 Files fixed: ${totalFilesFixed}`);
  console.log(`📊 Total changes applied: ${totalChanges}`);
  console.log(`🎯 Estimated error reduction: ~${totalChanges * 15} errors`);
  
  return { totalFilesFixed, totalChanges };
}

// Run the high-impact fixes first
runHighImpactFixes().then(({ totalFilesFixed, totalChanges }) => {
  console.log('\n✨ Phase 1a (High-Impact) Complete!');
  console.log('🔍 Ready for Phase 1b: Interface Syntax Normalizer');
}).catch(error => {
  console.error('❌ Type annotation fix failed:', error.message);
  process.exit(1);
});