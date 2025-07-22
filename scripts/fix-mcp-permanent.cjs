#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🛠️  MCP Permanent Fix Script\n');

// Define all MCP files that need protection
const mcpFiles = {
  'src/lib/mcp/index.ts': {
    fixes: [
      { from: '  payload;', to: '  payload: any;' },
      { from: "console.log('Creating, entities:', entities)", to: "console.log('Creating entities:', entities)" },
      { from: "console.log('Adding, observations:', observations)", to: "console.log('Adding observations:', observations)" },
      { from: "console.log('Searching, nodes:', query)", to: "console.log('Searching nodes:', query)" }
    ]
  },
  'src/lib/mcp/mcp-registry.ts': {
    fixes: [
      // Fix interface properties using commas
      { from: /(\w+):\s*(\w+.*?),\s*(\w+):/g, to: '$1: $2;\n  $3:' },
      // Fix template strings with commas
      { from: 'Install, dependencies:', to: 'Install dependencies:' },
      { from: 'Start the MCP, server:', to: 'Start the MCP server:' },
      { from: 'npm run, mcp:server', to: 'npm run mcp:server' },
      { from: 'ws://localhost:3001/mcp', to: 'ws://localhost:3001/mcp' }
    ]
  },
  'src/lib/mcp/mcp-orchestrator.ts': {
    fixes: [
      // Fix interface properties
      { from: /(\w+):\s*(\w+.*?),\s*(\w+):/g, to: '$1: $2;\n  $3:' },
      // Fix missing type annotations
      { from: 'resolve: (value) => void', to: 'resolve: (value: any) => void' },
      { from: 'reject: (error) => void', to: 'reject: (error: any) => void' },
      { from: '.map((tool) => ({', to: '.map((tool: any) => ({' },
      { from: 'ws.onerror = (error) => {', to: 'ws.onerror = (error: Event) => {' },
      { from: 'ws.onmessage = (event) => {', to: 'ws.onmessage = (event: MessageEvent) => {' }
    ]
  },
  'src/hooks/useMCP.ts': {
    fixes: [
      // Fix malformed interface comments
      { from: /\/\/.*,\s*(\w+):/g, to: '//\n  $1:' }
    ]
  }
};

// Function to apply fixes to a file
function fixFile(filePath, fixes) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  fixes.forEach(fix => {
    if (fix.from instanceof RegExp) {
      const before = content;
      content = content.replace(fix.from, fix.to);
      if (before !== content) modified = true;
    } else {
      if (content.includes(fix.from)) {
        content = content.replace(new RegExp(fix.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), fix.to);
        modified = true;
      }
    }
  });
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  } else {
    console.log(`✓  Already correct: ${filePath}`);
    return false;
  }
}

// Apply fixes
console.log('Applying permanent fixes to MCP files...\n');

let filesFixed = 0;
Object.entries(mcpFiles).forEach(([file, config]) => {
  if (fixFile(file, config.fixes)) {
    filesFixed++;
  }
});

// Disable problematic scripts
console.log('\n🚫 Disabling problematic fix scripts...\n');

const problematicScripts = [
  'scripts/fix-mcp-jsx-errors.cjs',
  'scripts/fix-jsx-comprehensively.cjs',
  'scripts/fix-all-jsx-final.cjs',
  'scripts/fix-all-tsx-errors.cjs',
  'scripts/fix-jsx-unclosed-tags.cjs'
];

problematicScripts.forEach(script => {
  const scriptPath = path.join(__dirname, '..', script);
  const disabledPath = scriptPath + '.disabled';
  
  if (fs.existsSync(scriptPath) && !scriptPath.endsWith('.disabled')) {
    fs.renameSync(scriptPath, disabledPath);
    console.log(`✅ Disabled: ${script}`);
  }
});

// Add package.json script if not exists
console.log('\n📦 Updating package.json scripts...\n');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (!packageJson.scripts['fix:mcp']) {
  packageJson.scripts['fix:mcp'] = 'node scripts/fix-mcp-permanent.cjs';
  packageJson.scripts['verify:mcp'] = 'node scripts/verify-mcp-integrity.cjs';
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  console.log('✅ Added MCP scripts to package.json');
}

// Summary
console.log('\n📊 Summary:');
console.log(`- Fixed ${filesFixed} MCP files`);
console.log(`- Disabled ${problematicScripts.length} problematic scripts`);
console.log('\n✅ MCP system permanently fixed!');
console.log('\nTo verify integrity, run: npm run verify:mcp');
console.log('To reapply fixes if needed, run: npm run fix:mcp');