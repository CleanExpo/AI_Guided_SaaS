const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testing Waste Eliminator Agent...\n');

// Create a direct connection to the waste-eliminator server
const agent = spawn('node', [
  path.join(__dirname, 'mcp', 'waste-eliminator-agent', 'dist', 'index.js')
], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, LOG_LEVEL: 'error' }
});

let responseBuffer = '';
let isReady = false;

// Handle responses
agent.stdout.on('data', (data) => {
  const text = data.toString();
  responseBuffer += text;
  
  const lines = responseBuffer.split('\n');
  responseBuffer = lines[lines.length - 1];
  
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    if (line) {
      try {
        const msg = JSON.parse(line);
        
        if (msg.method === 'initialized') {
          console.log('✅ Agent initialized\n');
          isReady = true;
          // List available tools
          sendRequest({
            jsonrpc: '2.0',
            method: 'tools/list',
            id: 1
          });
        } else if (msg.id === 1) {
          console.log('📋 Available tools:');
          msg.result.tools.forEach(tool => {
            console.log(`  - ${tool.name}: ${tool.description}`);
          });
          console.log('\n🔍 Running project analysis...\n');
          
          // Run analysis
          sendRequest({
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
              name: 'analyze_project',
              arguments: {
                projectPath: path.join(__dirname, 'src'),
                depth: 'quick'
              }
            },
            id: 2
          });
        } else if (msg.id === 2) {
          console.log('📊 Analysis Results:');
          const result = JSON.parse(msg.result.content[0].text);
          console.log(`  - Total Files: ${result.metrics.totalFiles}`);
          console.log(`  - Total Lines: ${result.metrics.totalLines}`);
          console.log(`  - Total Issues: ${result.issues.length}`);
          console.log(`  - Quality Score: ${JSON.parse(result.summary).codeQualityScore}/100`);
          
          // Show top issues
          if (result.issues.length > 0) {
            console.log('\n⚠️  Top Issues Found:');
            const issueCounts = {};
            result.issues.forEach(issue => {
              issueCounts[issue.type] = (issueCounts[issue.type] || 0) + 1;
            });
            
            Object.entries(issueCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .forEach(([type, count]) => {
                console.log(`  - ${type}: ${count} occurrences`);
              });
          }
          
          console.log('\n✨ Analysis complete!');
          
          // Graceful shutdown
          setTimeout(() => {
            agent.kill();
            process.exit(0);
          }, 1000);
        }
      } catch (e) {
        // Not JSON or incomplete
      }
    }
  }
});

agent.stderr.on('data', (data) => {
  // Suppress non-error output
  const text = data.toString();
  if (!text.includes('info:') && !text.includes('warn:')) {
    console.error('❌ Error:', text);
  }
});

// Send request to agent
function sendRequest(request) {
  agent.stdin.write(JSON.stringify(request) + '\n');
}

// Initialize the connection
setTimeout(() => {
  sendRequest({
    jsonrpc: '2.0',
    method: 'initialize',
    params: {
      protocolVersion: '0.1.0',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    },
    id: 0
  });
}, 500);

// Timeout handler
setTimeout(() => {
  if (!isReady) {
    console.error('❌ Timeout waiting for agent');
    agent.kill();
    process.exit(1);
  }
}, 10000);