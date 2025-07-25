#!/usr/bin/env tsx
import * as fs from 'fs/promises';
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkMCPStatus() {
  console.clear();
  console.log(chalk.blue.bold('🎯 MCP Server Status Dashboard\n'));
  
  const config = JSON.parse(await fs.readFile('mcp-config.json', 'utf-8'));
  
  for (const server of config.servers) {
    process.stdout.write(`${server.name.padEnd(25)}`);
    
    if (server.port) {
      try {
        await execAsync(`curl -s http://localhost:${server.port}/health`);
        console.log(chalk.green('● RUNNING'));
      } catch {
        console.log(chalk.red('● STOPPED'));
      }
    } else {
      // Check process
      try {
        const { stdout } = await execAsync('ps aux | grep -i mcp');
        if (stdout.includes(server.name.toLowerCase())) {
          console.log(chalk.green('● RUNNING'));
        } else {
          console.log(chalk.yellow('● UNKNOWN'));
        }
      } catch {
        console.log(chalk.red('● ERROR'));
      }
    }
  }
  
  console.log(chalk.blue('\n📊 tmux Sessions:'));
  try {
    const { stdout } = await execAsync('tmux ls');
    console.log(chalk.gray(stdout));
  } catch {
    console.log(chalk.yellow('No active sessions'));
  }
  
  console.log(chalk.gray('\nPress Ctrl+C to exit'));
}

// Run status check every 5 seconds
setInterval(checkMCPStatus, 5000);
checkMCPStatus();
