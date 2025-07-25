#!/usr/bin/env node
const { spawn } = require('child_process');
const config = require('./mcp-config.json');
const chalk = require('chalk');

console.log(chalk.blue.bold('\n🚀 Starting MCP Servers...\n'));

const processes = [];

config.servers.forEach((server, index) => {
  if (!server.enabled) return;
  
  setTimeout(() => {
    console.log(chalk.cyan(`Starting ${server.name}...`));
    
    const [cmd, ...args] = server.command.split(' ');
    const proc = spawn(cmd, args, {
      stdio: 'inherit',
      shell: true,
      cwd: server.cwd || process.cwd()
    });
    
    proc.on('error', (err) => {
      console.error(chalk.red(`Failed to start ${server.name}:`), err.message);
    });
    
    processes.push(proc);
  }, index * 2000); // Stagger starts
});

process.on('SIGINT', () => {
  console.log(chalk.yellow('\n👋 Shutting down MCP servers...'));
  processes.forEach(proc => proc.kill());
  process.exit(0);
});
