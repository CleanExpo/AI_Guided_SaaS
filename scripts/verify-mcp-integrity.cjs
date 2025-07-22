const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verifying MCP Module Integrity...\n');

const mcpFiles = [
  'src/lib/mcp/index.ts',
  'src/lib/mcp/mcp-registry.ts',
  'src/lib/mcp/mcp-orchestrator.ts',
  'src/components/mcp/MCPOrchestrator.tsx',
  'src/hooks/useMCP.ts'
];

let hasErrors = false;

// Check each MCP file
mcpFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing file: ${file}`);
    hasErrors = true;
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for common syntax errors
  const syntaxIssues = [];
  
  // Check for malformed interface properties (comma instead of semicolon)
  if (content.match(/^\s*\w+:\s*\w+.*,\s*\w+:/gm)) {
    syntaxIssues.push('Interface properties using commas instead of semicolons');
  }
  
  // Check for missing type annotations
  if (content.match(/\(([\w\s]*)\)\s*=>/g)) {
    const matches = content.match(/\(([\w\s]*)\)\s*=>/g);
    matches.forEach(match => {
      if (!match.includes(':') && !match.includes('()')) {
        syntaxIssues.push(`Missing type annotation in: ${match}`);
      }
    });
  }
  
  // Check for malformed console.log with embedded commas
  if (content.match(/console\.log\(['"][\w\s]+,\s+[\w\s]+:/g)) {
    syntaxIssues.push('Malformed console.log statements with embedded commas');
  }
  
  if (syntaxIssues.length > 0) {
    console.error(`❌ ${file} has syntax issues:`);
    syntaxIssues.forEach(issue => console.error(`   - ${issue}`));
    hasErrors = true;
  } else {
    console.log(`✅ ${file} - OK`);
  }
});

// Run TypeScript compiler check on MCP files
console.log('\n🔧 Running TypeScript check on MCP modules...\n');

try {
  const tscOutput = execSync('npx tsc --noEmit 2>&1 | grep -E "(src/lib/mcp|src/components/mcp|src/hooks/useMCP)" || true', {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8'
  });
  
  if (tscOutput.trim()) {
    console.error('❌ TypeScript errors found in MCP modules:');
    console.error(tscOutput);
    hasErrors = true;
  } else {
    console.log('✅ No TypeScript errors in MCP modules');
  }
} catch (error) {
  console.error('❌ Failed to run TypeScript check');
  hasErrors = true;
}

// Check for problematic fix scripts
console.log('\n🔍 Checking for problematic fix scripts...\n');

const problematicScripts = [
  'scripts/fix-mcp-jsx-errors.cjs',
  'scripts/fix-jsx-comprehensively.cjs',
  'scripts/fix-all-jsx-final.cjs'
];

problematicScripts.forEach(script => {
  const scriptPath = path.join(__dirname, '..', script);
  if (fs.existsSync(scriptPath)) {
    console.warn(`⚠️  Found active problematic script: ${script}`);
    console.warn('   This script may corrupt MCP TypeScript files');
    hasErrors = true;
  }
});

// Summary
console.log('\n📊 Summary:');
if (hasErrors) {
  console.error('❌ MCP module integrity check FAILED');
  console.error('\nRecommended actions:');
  console.error('1. Run: npm run fix:mcp');
  console.error('2. Disable problematic fix scripts');
  console.error('3. Manually review and fix syntax errors');
  process.exit(1);
} else {
  console.log('✅ MCP module integrity check PASSED');
  console.log('All MCP files are properly formatted and error-free');
}