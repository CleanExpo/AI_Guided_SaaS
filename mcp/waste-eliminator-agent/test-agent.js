#!/usr/bin/env node

/**
 * Test script for Waste Eliminator Agent
 * This tests the agent's core functionality
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testing Waste Eliminator Agent...\n');

// Test data
const testRequests = [
  {
    jsonrpc: '2.0',
    method: 'tools/list',
    id: 1,
  },
  {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'analyze_project',
      arguments: {
        projectPath: path.join(__dirname, '../../src'),
        depth: 'quick',
      },
    },
    id: 2,
  },
];

// Start the agent
const agentProcess = spawn('node', ['dist/index.js'], {
  cwd: __dirname,
  stdio: ['pipe', 'pipe', 'pipe'],
});

let responseBuffer = '';

agentProcess.stdout.on('data', (data) => {
  responseBuffer += data.toString();
  
  // Try to parse complete JSON-RPC messages
  const lines = responseBuffer.split('\n');
  
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    if (line) {
      try {
        const response = JSON.parse(line);
        console.log('📥 Response:', JSON.stringify(response, null, 2));
        
        if (response.id === 1) {
          console.log('\n✅ Tools listed successfully');
          console.log(`Found ${response.result.tools.length} tools\n`);
          
          // Send analyze request
          sendRequest(testRequests[1]);
        } else if (response.id === 2) {
          console.log('\n✅ Analysis completed successfully');
          
          // Gracefully exit
          setTimeout(() => {
            console.log('\n🎉 All tests passed!');
            agentProcess.kill();
            process.exit(0);
          }, 1000);
        }
      } catch (e) {
        // Not a complete JSON message yet
      }
    }
  }
  
  // Keep the last incomplete line
  responseBuffer = lines[lines.length - 1];
});

agentProcess.stderr.on('data', (data) => {
  console.error('❌ Agent error:', data.toString());
});

agentProcess.on('error', (error) => {
  console.error('❌ Failed to start agent:', error);
  process.exit(1);
});

agentProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`❌ Agent exited with code ${code}`);
    process.exit(1);
  }
});

// Send a request to the agent
function sendRequest(request) {
  console.log('📤 Sending request:', request.method);
  agentProcess.stdin.write(JSON.stringify(request) + '\n');
}

// Wait for agent to initialize
setTimeout(() => {
  console.log('🚀 Agent should be ready, sending first request...\n');
  sendRequest(testRequests[0]);
}, 2000);

// Timeout handler
setTimeout(() => {
  console.error('❌ Test timeout - no response from agent');
  agentProcess.kill();
  process.exit(1);
}, 30000);