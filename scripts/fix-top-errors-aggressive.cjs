const fs = require('fs');
const path = require('path');

// Most problematic files identified
const targetFiles = [
  'src/lib/agents/AgentCommunication.ts',
  'src/components/ui/form-enhanced.tsx',
  'src/lib/mcp/mcp-orchestrator.ts',
  'src/lib/admin-queries.ts',
  'src/lib/backend/adapters/supabase.ts',
  'src/lib/database.ts',
  'src/lib/ide/kiro-client.ts',
  'src/lib/docs/DynamicDocumentationSystem.ts',
  'src/lib/collaboration.ts',
  'src/lib/analytics/PredictiveAnalytics.ts'
];

const fixes = [
  // Fix interface property separators (comma to semicolon)
  {
    pattern: /^(\s*)([\w$]+\??)\s*:\s*([^,;}\n]+),(\s*(?:\/\/.*)?)\s*$/gm,
    replacement: '$1$2: $3;$4'
  },
  
  // Fix type definitions with commas
  {
    pattern: /type\s+(\w+)\s*=\s*\{([^}]+)\}/gs,
    replacement: (match, name, content) => {
      const _fixed = content.replace(/,(\s*(?:\/\/.*)?)\s*$/gm, ';$1');
      return `type ${name} = {${fixed}}`;
}
  },
  
  // Fix interface definitions with commas
  {
    pattern: /interface\s+(\w+)(?:<[^>]+>)?\s*(?:extends\s+[^{]+)?\s*\{([^}]+)\}/gs,
    replacement: (match, name, content) => {
      const _fixed = content.replace(/,(\s*(?:\/\/.*)?)\s*$/gm, ';$1');
      const _extends_ = match.match(/extends\s+([^{]+)/)?.[0] || '';
      const _generics = match.match(/<[^>]+>/)?.[0] || '';
      return `interface ${name}${generics} ${extends_} {${fixed}}`;
}
  },
  
  // Fix object type annotations
  {
    pattern: /:\s*\{([^}]+)\}(?=[;)\s])/gs,
    replacement: (match, content) => {
      const _fixed = content.replace(/,(\s*(?:\/\/.*)?)\s*$/gm, ';$1');
      return `: {${fixed}}`;
}
  },
  
  // Fix function return type objects
  {
    pattern: /\)\s*:\s*\{([^}]+)\}\s*\{/gs,
    replacement: (match, returnType) => {
      const _fixed = returnType.replace(/,(\s*(?:\/\/.*)?)\s*$/gm, ';$1');
      return `): {${fixed}} {`;
}
  },
  
  // Fix async function declarations
  {
    pattern: /async\s+(\w+)\s*\(([^)]*)\)\s*:\s*Promise<([^>]+)>\s*\{/g,
    replacement: 'async $1($2): Promise<$3> {'
  },
  
  // Fix arrow function type annotations
  {
    pattern: /const\s+(\w+)\s*:\s*\(([^)]*)\)\s*=>\s*([^=]+)\s*=\s*(?:async\s*)?\(/g,
    replacement: 'const $1: ($2) => $3 = async ('
  },
  
  // Fix multiline object literals
  {
    pattern: /{\s*\n([^}]+),\s*\n\s*}/gm,
    replacement: (match, content) => {
      const lines = content.split('\n');
      const _fixed = lines.map(line => {
        if (line.trim() && !line.trim().endsWith(',') && !line.trim().endsWith(';')) {
          return line + ',';
}
        return line;
      }).join('\n');
      return `{\n${fixed}\n}`;
}
  },
  
  // Fix JSX attribute objects
  {
    pattern: /(\w+)=\{\{([^}]+)\}\}/g,
    replacement: (match, attr, content) => {
      // Don't add semicolons in JSX attributes
      return `${attr}={ {${content }`;
}
  },
  
  // Fix import statements
  {
    pattern: /^import\s+(?:type\s+)?(?:\*\s+as\s+\w+|\{[^}]+\}|\w+)\s+from\s+['"][^'"]+['"]\s*$/gm,
    replacement: (match) => {
      if (!match.endsWith(';')) {
        return match + ';';
}
      return match;
}
  },
  
  // Fix export statements
  {
    pattern: /^export\s+(?:type\s+|const\s+|function\s+|class\s+|interface\s+|enum\s+)?[^;]+$/gm,
    replacement: (match) => {
      // Don't add semicolon to export declarations with braces
      if (match.includes('{') && !match.includes('}')) {
        return match;
}
      if (!match.endsWith(';') && !match.endsWith('{') && !match.endsWith('}')) {
        return match + ';';
}
      return match;
}
}
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changeCount = 0;
    const _originalContent = content;
    
    // Apply fixes in order
    fixes.forEach((fix, index) => {
      const _before = content;
      content = content.replace(fix.pattern, fix.replacement);
      if (before !== content) {
        changeCount++;
        console.log(`  Applied fix ${index + 1} to ${filePath}`);
}
    });
    
    // Additional specific fixes for common patterns
    // Fix object properties in interfaces
    content = content.replace(/^(\s*)(readonly\s+)?(\w+\??)\s*:\s*([^,;}\n]+),\s*$/gm, '$1$2$3: $4;');
    
    // Fix method signatures in interfaces
    content = content.replace(/^(\s*)(\w+)\s*\(([^)]*)\)\s*:\s*([^,;}\n]+),\s*$/gm, '$1$2($3): $4;');
    
    // Fix enum members
    content = content.replace(/^(\s*)(\w+)\s*=\s*([^}\n]+),\s*$/gm, '$1$2 = $3,');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed ${filePath} (${changeCount} patterns applied)`);
      return true;
    } else {
      console.log(`⏭️  No changes needed for ${filePath}`);
      return false;
}
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
}
}
console.log('🔧 Aggressively fixing top error-prone files...\n');

let totalFixed = 0;
targetFiles.forEach(file => {
  const _fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    if (fixFile(fullPath)) {
      totalFixed++;
}
  } else {
    console.log(`❌ File not found: ${file}`);
}
});

console.log(`\n✅ Total files fixed: ${totalFixed}`);

// Also fix any .ts and .tsx files in src/ that might have similar issues
console.log('\n🔍 Scanning for additional files with similar patterns...');

const { execSync } = require('child_process');
try {
  const allTsFiles = execSync('find src -name "*.ts" -o -name "*.tsx" | head -100', { encoding: 'utf8' })
    .split('\n')
    .filter(f => f.trim());
  
  let additionalFixed = 0;
  allTsFiles.forEach(file => { if (!targetFiles.includes(file) && fs.existsSync(file)) {
      if (fixFile(file)) {
        additionalFixed++;
       });
  
  console.log(`\n✅ Additional files fixed: ${additionalFixed}`);
  console.log(`\n🎯 Total files processed: ${totalFixed + additionalFixed}`);
} catch (error) {
  console.log('Could not scan additional files');
}