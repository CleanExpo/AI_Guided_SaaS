#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🛠️  Final MCP Syntax Fix\n');

// Read mcp-orchestrator.ts
const orchestratorPath = path.join(__dirname, '..', 'src', 'lib', 'mcp', 'mcp-orchestrator.ts');
let content = fs.readFileSync(orchestratorPath, 'utf8');

// Fix semicolons that should be commas in object literals
// Pattern: property: value; (within object context)
content = content.replace(/(\s+\w+:\s*[^,\n]+);(\s*\n\s*\w+:)/g, '$1,$2');

// Fix specific problematic lines
const specificFixes = [
  // Fix tool/server property pairs
  { from: /tool:\s*([^;]+);\s*\n\s*server:/g, to: 'tool: $1,\n        server:' },
  { from: /duration:\s*([^;]+);\s*\n\s*timestamp:/g, to: 'duration: $1,\n        timestamp:' },
  { from: /result:\s*([^;]+);\s*\n\s*error:/g, to: 'result: $1,\n        error:' },
  { from: /name:\s*([^;]+);\s*\n\s*arguments:/g, to: 'name: $1,\n      arguments:' },
  
  // Fix function parameter semicolons
  { from: /\((\w+:\s*\w+);\s*(\w+:\s*)/g, to: '($1, $2' },
  { from: /async\s+(\w+)\(([^:]+:\s*[^;]+);\s*([^:]+:\s*)/g, to: 'async $1($2, $3' },
];

specificFixes.forEach(fix => {
  content = content.replace(fix.from, fix.to);
});

// Write fixed content
fs.writeFileSync(orchestratorPath, content, 'utf8');
console.log('✅ Fixed src/lib/mcp/mcp-orchestrator.ts');

// Run TypeScript check to verify
const { execSync } = require('child_process');

console.log('\n🔍 Verifying fixes...\n');

try {
  const errors = execSync('npx tsc --noEmit 2>&1 | grep -E "(src/lib/mcp|MCPOrchestrator|useMCP)" | wc -l', {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8'
  }).trim();
  
  if (errors === '0') {
    console.log('✅ All MCP TypeScript errors fixed!');
  } else {
    console.log(`⚠️  Still ${errors} MCP-related errors remaining`);
  }
} catch (error) {
  console.log('❌ Failed to verify fixes');
}

console.log('\nDone!');