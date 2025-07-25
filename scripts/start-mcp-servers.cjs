#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting MCP Servers...\n');

// Start Sequential Thinking server
console.log('🧠 Starting Sequential Thinking Server...');
const mcpPath = path.join(__dirname, '..', 'mcp');

const sequentialProcess = spawn('node', ['wsl-sequential-thinking-server.cjs'], {
  cwd: mcpPath,
  stdio: 'inherit',
  shell: true
});

sequentialProcess.on('error', (err) => {
  console.error('❌ Failed to start Sequential Thinking:', err.message);
});

// Handle exit
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down MCP servers...');
  process.exit(0);
});

console.log('\n✅ MCP Servers starting up...');
console.log('📡 Sequential Thinking: stdio transport\n');