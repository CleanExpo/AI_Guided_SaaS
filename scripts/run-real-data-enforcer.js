#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🔍 Starting Real Data Enforcer MCP...');
console.log(`Project Root: ${projectRoot}`);

const mcpProcess = spawn('node', [
  path.join(projectRoot, 'mcp/real-data-enforcer/dist/index.js')
], {
  cwd: projectRoot,
  stdio: ['inherit', 'inherit', 'inherit'],
  env: {
    ...process.env,
    NODE_ENV: 'production'
  }
});

mcpProcess.on('error', (error) => {
  console.error('❌ Real Data Enforcer MCP failed to start:', error);
  process.exit(1);
});

mcpProcess.on('exit', (code, signal) => {
  if (code !== 0 && code !== null) {
    console.error(`❌ Real Data Enforcer MCP exited with code ${code}`);
    process.exit(code);
  }
  if (signal) {
    console.log(`🔍 Real Data Enforcer MCP terminated by signal ${signal}`);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down Real Data Enforcer MCP...');
  mcpProcess.kill('SIGTERM');
});

process.on('SIGTERM', () => {
  console.log('🛑 Terminating Real Data Enforcer MCP...');
  mcpProcess.kill('SIGTERM');
});