const { spawn, exec } = require('child_process');
const path = require('path');

console.log('🎭 Starting Playwright Tests with Dev Server...\n');

// Function to check if server is running
function checkServer() {
  return new Promise((resolve) => {
    exec('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000', (error, stdout) => {
      if (!error && stdout === '200') {
        resolve(true);
      } else {
        // Try with node fetch
        fetch('http://localhost:3000')
          .then(() => resolve(true))
          .catch(() => resolve(false));
      }
    });
  });
}

// Function to wait for server
async function waitForServer(maxAttempts = 30) {
  console.log('⏳ Waiting for dev server to start...');
  
  for (let i = 0; i < maxAttempts; i++) {
    const isRunning = await checkServer();
    if (isRunning) {
      console.log('✅ Dev server is ready!\n');
      return true;
    }
    process.stdout.write('.');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n❌ Dev server failed to start');
  return false;
}

// Start dev server
console.log('🚀 Starting development server...');
const devServer = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '..'),
  shell: true,
  stdio: 'pipe'
});

let devServerReady = false;

devServer.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Ready') || output.includes('started') || output.includes('3000')) {
    devServerReady = true;
  }
});

devServer.stderr.on('data', (data) => {
  console.error(`Dev server error: ${data}`);
});

devServer.on('error', (error) => {
  console.error('Failed to start dev server:', error);
  process.exit(1);
});

// Wait for server then run tests
setTimeout(async () => {
  const serverReady = await waitForServer();
  
  if (!serverReady) {
    console.log('❌ Server not ready, exiting...');
    devServer.kill();
    process.exit(1);
  }
  
  console.log('🎭 Running Playwright evaluation tests...\n');
  
  // Run the evaluation tests
  const testProcess = spawn('npx', ['playwright', 'test', 'tests/evaluation-suite.spec.ts', '--config=playwright-eval.config.ts'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'inherit'
  });
  
  testProcess.on('close', (code) => {
    console.log(`\n🏁 Tests completed with code ${code}`);
    
    // Kill dev server
    console.log('🛑 Stopping dev server...');
    devServer.kill();
    
    // Exit with test result code
    process.exit(code);
  });
  
  testProcess.on('error', (error) => {
    console.error('Test process error:', error);
    devServer.kill();
    process.exit(1);
  });
}, 5000); // Give server 5 seconds to start

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Interrupted, cleaning up...');
  devServer.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  devServer.kill();
  process.exit(0);
});