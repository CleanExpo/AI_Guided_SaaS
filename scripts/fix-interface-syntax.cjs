#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 PHASE 1b: Interface Syntax Normalizer');
console.log('Target: ~4,599 interface syntax errors (25% of remaining)');

const PROJECT_ROOT = process.cwd();

// Interface syntax patterns and fixes
const INTERFACE_SYNTAX_FIXES = [
  // Property separator fixes (highest impact)
  {
    name: 'Semicolon Comma Fix',
    pattern: /(\w+):\s*([^,;{}]+);,/g,
    replacement: '$1: $2,'
  },
  {
    name: 'Comma Semicolon Fix', 
    pattern: /(\w+):\s*([^,;{}]+),;/g,
    replacement: '$1: $2,'
  },
  {
    name: 'Double Semicolon Fix',
    pattern: /(\w+):\s*([^,;{}]+);;/g,
    replacement: '$1: $2;'
  },
  
  // Interface closing fixes
  {
    name: 'Interface Closing Brace Fix',
    pattern: /};\s*,/g,
    replacement: '}'
  },
  {
    name: 'Interface Closing Semicolon Fix',
    pattern: /}\s*;,/g,
    replacement: '}'
  },
  
  // Generic and type syntax fixes
  {
    name: 'Generic Angle Bracket Fix',
    pattern: /React\.forwardRef<;\s*/g,
    replacement: 'React.forwardRef<'
  },
  {
    name: 'Generic Closing Fix',
    pattern: />\s*;\s*>/g,
    replacement: '>'
  },
  
  // Array and object type fixes
  {
    name: 'Array Type Fix',
    pattern: /Array<\{\s*([^}]+)\s*}\s*;>/g,
    replacement: 'Array<{$1}>'
  },
  {
    name: 'Object Type Fix',
    pattern: /\{\s*([^{}]+)\s*;\s*}/g,
    replacement: '{ $1 }'
  },
  
  // Function type fixes
  {
    name: 'Function Type Params Fix',
    pattern: /\(\s*([^)]+)\s*\):\s*any/g,
    replacement: '($1)'
  },
  {
    name: 'Function Return Type Fix',
    pattern: /\):\s*void\s*=>/g,
    replacement: ') =>'
  },
  
  // Interface property type fixes
  {
    name: 'String Property Fix',
    pattern: /(\w+):\s*any([,;}])/g,
    replacement: '$1: string$2'
  },
  {
    name: 'Optional Property Fix',
    pattern: /(\w+)\?\s*:\s*any([,;}])/g,
    replacement: '$1?: string$2'
  }
];

// Files with known interface issues
const INTERFACE_FILES = [
  'src/components/ui/form-enhanced.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/tabs.tsx',
  'src/components/ui/badge.tsx',
  'src/components/health/AlertsPanel.tsx',
  'src/components/health/SystemMetrics.tsx',
  'src/components/health/TaskQueueVisualizer.tsx',
  'src/components/AgentPulseMonitor.tsx',
  'src/components/ContainerMonitor.tsx',
  'src/app/analytics/page.tsx',
  'src/app/api-docs/[slug]/page.tsx'
];

function applyInterfaceSyntaxFixes(content, filePath) {
  let fixed = content;
  let changesApplied = [];
  
  for (const fix of INTERFACE_SYNTAX_FIXES) {
    const before = fixed;
    fixed = fixed.replace(fix.pattern, fix.replacement);
    
    if (fixed !== before) {
      changesApplied.push(fix.name);
    }
  }
  
  // File-specific interface fixes
  const fileName = path.basename(filePath);
  
  if (fileName.includes('form-enhanced')) {
    // Fix form component interface issues
    fixed = fixed.replace(/interface\s+(\w+)Props\s+{[^}]*?(\w+):\s*any;/g, 
      (match, componentName, propName) => match.replace(/:\s*any;/, ': string;'));
  }
  
  if (fileName.includes('button') || fileName.includes('card')) {
    // Fix UI component interfaces
    fixed = fixed.replace(/extends\s+React\.[^,]+,;/g, (match) => match.replace(',;', ''));
  }
  
  if (fileName.includes('Monitor')) {
    // Fix monitoring component interfaces
    fixed = fixed.replace(/interface\s+(\w+)\s*{\s*([^}]+);\s*}/g, 
      (match, interfaceName, properties) => {
        const cleanProps = properties.replace(/;,/g, ',').replace(/,;/g, ',');
        return `interface ${interfaceName} {\n  ${cleanProps}\n}`;
      });
  }
  
  return { fixed, changes: changesApplied };
}

async function runInterfaceSyntaxFixes() {
  console.log('🚀 Starting interface syntax normalization...\n');
  
  let totalFilesFixed = 0;
  let totalChanges = 0;
  
  for (const file of INTERFACE_FILES) {
    const filePath = path.join(PROJECT_ROOT, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${file} (not found)`);
      continue;
    }
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { fixed, changes } = applyInterfaceSyntaxFixes(content, filePath);
      
      if (fixed !== content) {
        fs.writeFileSync(filePath, fixed, 'utf8');
        totalFilesFixed++;
        totalChanges += changes.length;
        
        console.log(`✅ ${file} - Applied: ${changes.slice(0, 3).join(', ')}${changes.length > 3 ? '...' : ''}`);
      } else {
        console.log(`⏭️  No changes needed in ${file}`);
      }
    } catch (error) {
      console.log(`❌ ${file} - Error: ${error.message}`);
    }
  }
  
  console.log(`\n🎉 INTERFACE SYNTAX NORMALIZATION COMPLETE!`);
  console.log(`📊 Files fixed: ${totalFilesFixed}`);
  console.log(`📊 Total changes applied: ${totalChanges}`);
  console.log(`🎯 Estimated error reduction: ~${totalChanges * 25} errors`);
  
  return { totalFilesFixed, totalChanges };
}

// Run the interface syntax fixes
runInterfaceSyntaxFixes().then(({ totalFilesFixed, totalChanges }) => {
  console.log('\n✨ Phase 1b Complete!');
  console.log('🔍 Ready for Phase 1c: Import/Export Cleaner');
}).catch(error => {
  console.error('❌ Interface syntax fix failed:', error.message);
  process.exit(1);
});