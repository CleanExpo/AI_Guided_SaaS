#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting MCP Servers...\n');

// Start Serena server
const serenaPath = path.join(__dirname, '..', 'serena');
console.log('📚 Starting Serena Semantic Search Server...');

const serenaProcess = spawn('python', ['-m', 'serena_mcp_server', '--transport', 'sse', '--port', '9121'], {
  cwd: serenaPath,
  stdio: 'inherit',
  shell: true
});

serenaProcess.on('error', (err) => {
  console.error('❌ Failed to start Serena:', err.message);
  console.log('💡 Try running: cd serena && pip install -e .');
});

// Start Sequential Thinking server
setTimeout(() => {
  console.log('\n🧠 Starting Sequential Thinking Server...');
  const mcpPath = path.join(__dirname, '..', 'mcp');
  
  const sequentialProcess = spawn('node', ['wsl-sequential-thinking-server.cjs'], {
    cwd: mcpPath,
    stdio: 'inherit',
    shell: true
  });

  sequentialProcess.on('error', (err) => {
    console.error('❌ Failed to start Sequential Thinking:', err.message);
  });
}, 2000);

// Handle exit
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down MCP servers...');
  process.exit(0);
});

console.log('\n✅ MCP Servers starting up...');
console.log('📡 Serena: http://localhost:9121');
console.log('📡 Sequential Thinking: stdio transport\n');