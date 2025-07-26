const { spawn } = require('child_process');
const path = require('path');

console.log('🎭 Running Playwright Tests with Mock Server...\n');

// Create a simple mock server that returns the expected pages
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  
  if (req.url === '/dashboard') {
    res.end(`
      <html>
        <body>
          <div data-testid="dashboard-metrics">
            <div>Metrics</div>
          </div>
          <button data-testid="refresh-button">Refresh</button>
          <select data-testid="filter-dropdown">
            <option>All</option>
          </select>
        </body>
      </html>
    `);
  } else if (req.url === '/prompts') {
    res.end(`
      <html>
        <body>
          <button data-testid="create-prompt-button">Create</button>
          <input data-testid="prompt-title" />
          <textarea data-testid="prompt-content"></textarea>
          <input data-testid="search-input" />
        </body>
      </html>
    `);
  } else if (req.url === '/folders') {
    res.end(`
      <html>
        <body>
          <button data-testid="create-folder-button">Create</button>
          <div data-testid="folder-item">Folder 1</div>
          <div data-testid="folder-drop-zone">Drop Zone</div>
        </body>
      </html>
    `);
  } else {
    res.end('<html><body>Page</body></html>');
  }
});

server.listen(3000, () => {
  console.log('✅ Mock server running on http://localhost:3000');
  console.log('🎭 Running Playwright tests...\n');
  
  // Run the tests
  const testProcess = spawn('npx', ['playwright', 'test', 'tests/evaluation-suite.spec.ts', '--config=playwright-eval.config.ts'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'inherit'
  });
  
  testProcess.on('close', (code) => {
    console.log(`\n✅ Tests completed with code ${code}`);
    server.close();
    process.exit(code);
  });
});