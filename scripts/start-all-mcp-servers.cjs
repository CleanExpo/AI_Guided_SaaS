#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const MCP_SERVERS_CONFIG = path.join(PROJECT_ROOT, 'mcp-servers.json');

async function startMCPServers() {
  console.log('🚀 Starting MCP Servers...\n');

  try {
    // Read MCP servers configuration
    const configData = fs.readFileSync(MCP_SERVERS_CONFIG, 'utf-8');
    const config = JSON.parse(configData);
    
    if (!config.servers) {
      throw new Error('No servers configuration found');
    }

    const servers = Object.entries(config.servers);
    console.log(`Found ${servers.length} MCP servers to start:\n`);

    // Start each server
    for (const [name, serverConfig] of servers) {
      console.log(`📦 Starting ${name} MCP Server...`);
      console.log(`   Description: ${serverConfig.description}`);
      console.log(`   Command: ${serverConfig.command} ${serverConfig.args.join(' ')}`);

      try {
        // Set up environment variables
        const env = { ...process.env };
        if (serverConfig.env) {
          Object.entries(serverConfig.env).forEach(([key, value]) => {
            // Replace ${VAR} with actual environment variable
            const actualValue = value.replace(/\$\{(\w+)\}/g, (match, varName) => {
              return process.env[varName] || match;
            });
            env[key] = actualValue;
          });
        }

        // Spawn the server process
        const serverProcess = spawn(serverConfig.command, serverConfig.args, {
          cwd: PROJECT_ROOT,
          env,
          stdio: 'inherit',
          shell: true
        });

        serverProcess.on('error', (error) => {
          console.error(`❌ Error starting ${name}: ${error.message}`);
        });

        console.log(`✅ ${name} MCP Server started successfully\n`);
      } catch (error) {
        console.error(`❌ Failed to start ${name}: ${error.message}\n`);
      }
    }

    console.log('\n🎉 All MCP servers have been started!');
    console.log('\n📝 Available MCP Servers:');
    servers.forEach(([name, config]) => {
      console.log(`   - ${name}: ${config.description}`);
    });

    console.log('\n💡 Tips:');
    console.log('   - Make sure to set required environment variables');
    console.log('   - Check logs for any connection issues');
    console.log('   - Use Ctrl+C to stop all servers');

  } catch (error) {
    console.error('❌ Error starting MCP servers:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping all MCP servers...');
  process.exit(0);
});

// Start the servers
startMCPServers();