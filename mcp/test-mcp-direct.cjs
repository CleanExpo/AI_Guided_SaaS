#!/usr/bin/env node

/**
 * Direct test of the WSL Sequential Thinking MCP Server
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testing MCP WSL Sequential Thinking Server...\n');

// Path to the compiled server
const _serverPath = path.join(__dirname, 'dist', 'wsl-sequential-thinking-server.js');

// Test if the server file exists
const fs = require('fs');
if (!fs.existsSync(serverPath)) {
    console.error('❌ Compiled server not found. Run "npm run build" first.');
    process.exit(1);
}
console.log('✅ Server file found at:', serverPath);

// Try to spawn the server
const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env }
});

// Handle server output
server.stdout.on('data', (data) => {
    console.log('📤 Server output:', data.toString());
});

server.stderr.on('data', (data) => {
    console.error('❌ Server error:', data.toString());
});

server.on('error', (error) => {
    console.error('❌ Failed to start server:', error);
});

server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
});

// Send a test request after a short delay
setTimeout(() => {
    console.log('\n📨 Sending list tools request...');
    const request = {
        jsonrpc: '2.0',
        method: 'tools/list',
        id: 1
    };
    
    server.stdin.write(JSON.stringify(request) + '\n');
}, 1000);

// Exit after 5 seconds
setTimeout(() => {
    console.log('\n🛑 Stopping test...');
    server.kill();
    process.exit(0);
}, 5000);