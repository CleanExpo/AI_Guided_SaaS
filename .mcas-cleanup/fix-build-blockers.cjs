#!/usr/bin/env node

/**
 * MCAS Fix Build Blockers
 * Fix the specific syntax errors preventing build
 */

const fs = require('fs');
const path = require('path');

console.log('🚨 MCAS Fix Build Blockers');
console.log('==========================\n');

const fixes = [
  {
    file: 'src/components/ui/button.tsx',
    fixes: [
      {
        pattern: /const Button = React\.forwardRef<HTMLButtonElement, ButtonProps>\(\s*\(/g,
        replacement: 'const Button = React.forwardRef<HTMLButtonElement, ButtonProps>('
      }
    ]
  },
  {
    file: 'src/app/api/admin/analytics/route.ts',
    fixes: [
      {
        pattern: /NextResponse\.json\s*\(\s*;/g,
        replacement: 'NextResponse.json('
      }
    ]
  },
  {
    file: 'src/app/api/admin/auth/route.ts',
    fixes: [
      {
        pattern: /NextResponse\.json\s*\(\s*;/g,
        replacement: 'NextResponse.json('
      }
    ]
  },
  {
    file: 'src/app/api/admin/cleanup/route.ts',
    fixes: [
      {
        pattern: /NextResponse\.json\s*\(\s*;/g,
        replacement: 'NextResponse.json('
      }
    ]
  },
  {
    file: 'src/app/api/admin/dashboard/route.ts',
    fixes: [
      {
        pattern: /NextResponse\.json\s*\(\s*;/g,
        replacement: 'NextResponse.json('
      }
    ]
  },
  {
    file: 'src/app/api/agents/route.ts',
    fixes: [
      {
        pattern: /NextResponse\.json\s*\(\s*;/g,
        replacement: 'NextResponse.json('
      }
    ]
  },
  {
    file: 'src/app/api/agents/[id]/route.ts',
    fixes: [
      {
        pattern: /NextResponse\.json\s*\(\s*;/g,
        replacement: 'NextResponse.json('
      }
    ]
  },
  {
    file: 'src/app/api/ai/complete/route.ts',
    fixes: [
      {
        pattern: /NextResponse\.json\s*\(\s*;/g,
        replacement: 'NextResponse.json('
      }
    ]
  },
  {
    file: 'src/app/api/ai/execute/route.ts',
    fixes: [
      {
        pattern: /NextResponse\.json\s*\(\s*;/g,
        replacement: 'NextResponse.json('
      }
    ]
  },
  {
    file: 'src/app/api/code-generation/route.ts',
    fixes: [
      {
        pattern: /NextResponse\.json\s*\(\s*;/g,
        replacement: 'NextResponse.json('
      }
    ]
  },
  {
    file: 'src/app/api/cycle-detection/route.ts',
    fixes: [
      {
        pattern: /NextResponse\.json\s*\(\s*;/g,
        replacement: 'NextResponse.json('
      }
    ]
  },
  {
    file: 'src/components/ui/badge.tsx',
    fixes: [
      {
        pattern: /Badge\.displayName = "Badge";/g,
        replacement: 'Badge.displayName = "Badge";\n\nexport { Badge, badgeVariants };'
      }
    ]
  },
  {
    file: 'src/components/health/TaskQueueVisualizer.tsx',
    fixes: [
      {
        pattern: /const tasks = \[;/g,
        replacement: 'const tasks = ['
      }
    ]
  }
];

let totalFixes = 0;
let filesFixed = 0;

for (const fileConfig of fixes) {
  const filePath = path.join(process.cwd(), fileConfig.file);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${fileConfig.file}`);
      continue;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    let fixCount = 0;
    
    for (const fix of fileConfig.fixes) {
      const beforeLength = content.length;
      content = content.replace(fix.pattern, fix.replacement);
      if (content.length !== beforeLength) {
        fixCount++;
      }
    }
    
    // Additional common fixes
    // Fix semicolon after opening parenthesis
    content = content.replace(/\(\s*;/g, '(');
    content = content.replace(/\[\s*;/g, '[');
    content = content.replace(/\{\s*;/g, '{');
    
    // Fix trailing comma followed by closing brace
    content = content.replace(/,\s*\}/g, '}');
    content = content.replace(/,\s*\)/g, ')');
    content = content.replace(/,\s*\]/g, ']');
    
    // Fix double semicolons
    content = content.replace(/;;\s*/g, '; ');
    
    // Fix function declarations missing 'function' keyword
    content = content.replace(/^(\s*)([A-Z][a-zA-Z]*)\s*\(([^)]*)\)\s*:\s*([^{]+)\s*\{/gm, 
      '$1function $2($3): $4 {');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed ${fileConfig.file} (${fixCount} fixes)`);
      filesFixed++;
      totalFixes += fixCount;
    } else {
      console.log(`  No changes needed: ${fileConfig.file}`);
    }
  } catch (error) {
    console.log(`❌ Error processing ${fileConfig.file}: ${error.message}`);
  }
}

// Now let's scan for more syntax errors
console.log('\n🔍 Scanning for additional syntax errors...\n');

function scanAndFix(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && 
          entry.name !== 'node_modules' && 
          entry.name !== '.next' &&
          entry.name !== '.git') {
        scanAndFix(fullPath);
      }
    } else if (entry.isFile() && 
               (entry.name.endsWith('.ts') || 
                entry.name.endsWith('.tsx'))) {
      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        let original = content;
        
        // Fix NextResponse.json( ; pattern
        content = content.replace(/NextResponse\.json\s*\(\s*;/g, 'NextResponse.json(');
        
        // Fix cva( ; pattern
        content = content.replace(/cva\s*\(\s*;/g, 'cva(');
        
        // Fix array/object literal issues
        content = content.replace(/\[\s*;/g, '[');
        content = content.replace(/\{\s*;/g, '{');
        
        // Fix function/interface issues
        content = content.replace(/export\s+interface\s+(\w+)\s+extends\s+([^;]+);(\s*\n\s*VariantProps)/g,
          'export interface $1 extends $2,$3');
        
        // Fix component function declarations
        content = content.replace(/^(\s*)([A-Z][a-zA-Z]*)\s*\(([^)]*)\)\s*\{/gm,
          '$1function $2($3) {');
        
        // Fix trailing commas in destructuring
        content = content.replace(/,\s*\}\s*=/g, '} =');
        
        if (content !== original) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`✓ Fixed ${path.relative(process.cwd(), fullPath)}`);
          filesFixed++;
        }
      } catch (error) {
        // Ignore read errors
      }
    }
  }
}

scanAndFix(path.join(process.cwd(), 'src'));

console.log(`\n✅ Fixed ${filesFixed} files with ${totalFixes} specific fixes`);
console.log('\n🚀 Next: Run npm run build to check if build succeeds');