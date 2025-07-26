#!/usr/bin/env node

/**
 * Windows-compatible MCP Server Starter
 * Handles permissions and path issues on Windows
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

console.log('🚀 Starting MCP Servers (Windows Mode)...\n');

// Check if running with proper permissions flag
const args = process.argv.slice(2);
const skipPermissions = args.includes('--dangerously-skip-permissions');

if (!skipPermissions) {
  console.log('⚠️  Warning: Running without --dangerously-skip-permissions flag');
  console.log('   Add this flag to bypass permission issues on Windows\n');
}

// Load MCP configuration
const configPath = path.join(__dirname, '..', '.mcp.json');
let mcpConfig;

try {
  const configContent = fs.readFileSync(configPath, 'utf8');
  mcpConfig = JSON.parse(configContent);
  console.log('✅ Loaded MCP configuration from .mcp.json\n');
} catch (error) {
  console.error('❌ Failed to load .mcp.json:', error.message);
  process.exit(1);
}

// Get user home directory
const userHome = os.homedir();
const mcpGlobalPath = path.join(userHome, '.mcp-global');

// Create necessary directories
const directories = [
  mcpGlobalPath,
  path.join(mcpGlobalPath, 'scripts'),
  path.join(mcpGlobalPath, 'logs'),
  path.join(mcpGlobalPath, 'configs')
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    } catch (err) {
      console.warn(`⚠️  Could not create directory ${dir}:`, err.message);
    }
  }
});

// Function to start a server
function startServer(name, config) {
  console.log(`🔧 Starting ${name} server...`);
  
  let command = config.command;
  let args = [...(config.args || [])];
  
  // Add skip permissions flag if needed
  if (skipPermissions && !args.includes('--dangerously-skip-permissions')) {
    args.push('--dangerously-skip-permissions');
  }
  
  // Handle Windows-specific command adjustments
  if (os.platform() === 'win32') {
    // Convert WSL paths to Windows paths
    args = args.map(arg => {
      if (arg.startsWith('/mnt/c/')) {
        return arg.replace('/mnt/c/', 'C:\\').replace(/\//g, '\\');
      }
      // Quote paths with spaces
      if (arg.includes(' ') && !arg.startsWith('"')) {
        return `"${arg}"`;
      }
      return arg;
    });
    
    // Use cmd.exe for npx commands
    if (command === 'npx' || command === 'cmd') {
      // Already using cmd, just ensure proper args
      if (command === 'npx') {
        command = 'cmd';
        args = ['/c', 'npx', ...args];
      }
    }
    
    // For node commands with paths containing spaces
    if (command === 'node' && args.length > 0 && args[0].includes(' ')) {
      // Ensure the path is properly quoted
      if (!args[0].startsWith('"')) {
        args[0] = `"${args[0]}"`;
      }
    }
  }
  
  // Set up environment
  const env = {
    ...process.env,
    ...(config.env || {}),
    MCP_SKIP_PERMISSIONS: 'true',
    NODE_OPTIONS: '--max-old-space-size=4096'
  };
  
  // Log the command being executed
  console.log(`  Command: ${command} ${args.join(' ')}`);
  
  try {
    const serverProcess = spawn(command, args, {
      cwd: process.cwd(),
      env,
      stdio: 'pipe',
      shell: true,
      windowsHide: true
    });
    
    // Log output
    serverProcess.stdout.on('data', (data) => {
      console.log(`[${name}] ${data.toString().trim()}`);
    });
    
    serverProcess.stderr.on('data', (data) => {
      const message = data.toString().trim();
      // Filter out common non-error messages
      if (!message.includes('ExperimentalWarning') && 
          !message.includes('npm WARN') &&
          message.length > 0) {
        console.error(`[${name}] ❌ ${message}`);
      }
    });
    
    serverProcess.on('error', (err) => {
      console.error(`[${name}] ❌ Failed to start:`, err.message);
      if (err.code === 'EACCES') {
        console.error(`    Try running with administrator privileges or use --dangerously-skip-permissions`);
      }
    });
    
    serverProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.log(`[${name}] ⚠️  Process exited with code ${code}`);
      }
    });
    
    console.log(`✅ ${name} server started (PID: ${serverProcess.pid})\n`);
    return serverProcess;
    
  } catch (error) {
    console.error(`❌ Failed to start ${name}:`, error.message);
    return null;
  }
}

// Start all configured servers
const servers = [];
const serverNames = Object.keys(mcpConfig.mcpServers || {});

console.log(`📋 Found ${serverNames.length} MCP servers to start:\n`);

serverNames.forEach(name => {
  const config = mcpConfig.mcpServers[name];
  const process = startServer(name, config);
  if (process) {
    servers.push({ name, process });
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down MCP servers...');
  servers.forEach(({ name, process }) => {
    try {
      process.kill();
      console.log(`  ✅ Stopped ${name}`);
    } catch (err) {
      console.error(`  ❌ Failed to stop ${name}:`, err.message);
    }
  });
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.emit('SIGINT');
});

// Keep the process running
console.log('\n🎯 All MCP servers are starting up...');
console.log('Press Ctrl+C to stop all servers\n');

// Create a simple health check
setTimeout(() => {
  const runningCount = servers.filter(s => s.process && !s.process.killed).length;
  console.log(`\n📊 Health Check: ${runningCount}/${servers.length} servers running`);
  
  if (runningCount === 0) {
    console.error('\n❌ No servers are running. Check the logs above for errors.');
    console.log('\n💡 Tips:');
    console.log('  - Ensure Node.js has proper permissions');
    console.log('  - Try running with: npm run mcp:start -- --dangerously-skip-permissions');
    console.log('  - Check if required packages are installed');
  }
}, 5000);