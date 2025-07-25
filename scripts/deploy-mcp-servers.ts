#!/usr/bin/env tsx
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs/promises';
import chalk from 'chalk';

const execAsync = promisify(exec);

interface MCPServer {
  name: string;
  description: string;
  command: string;
  cwd?: string;
  port?: number;
  transport?: string;
  repo?: string;
  setup?: () => Promise<void>;
}

const mcpServers: MCPServer[] = [
  {
    name: 'Serena Semantic Search',
    description: 'Semantic code search and navigation',
    command: 'python -m serena_mcp_server --transport sse --port 9121',
    cwd: 'serena',
    port: 9121,
    transport: 'sse',
    repo: 'https://github.com/CleanExpo/serena.git'
  },
  {
    name: 'Sequential Thinking',
    description: 'Complex reasoning chains',
    command: 'node wsl-sequential-thinking-server.cjs',
    cwd: 'mcp',
    transport: 'stdio'
  },
  {
    name: 'Context7',
    description: 'Documentation lookup and context management',
    command: 'npx @upstash/context7-mcp',
    port: 9122,
    transport: 'http',
    setup: async () => {
      console.log(chalk.cyan('Installing Context7...'));
      await execAsync('npm install -g @upstash/context7-mcp');
    }
  },
  {
    name: 'ESLint MCP',
    description: 'Code quality and linting',
    command: 'npx @eslint/mcp',
    port: 9123,
    transport: 'http',
    setup: async () => {
      console.log(chalk.cyan('Installing ESLint MCP...'));
      await execAsync('npm install -g @eslint/mcp');
    }
  },
  {
    name: 'Memory Server',
    description: 'Context retention across sessions',
    command: 'tsx mcp/memory-server.ts',
    cwd: '.',
    port: 9124,
    transport: 'websocket'
  }
];

const tmuxSessions = [
  {
    name: 'Task-frontend',
    description: 'Frontend Team',
    windows: [
      { name: 'Frontend-PM', command: 'echo "Frontend PM ready"' },
      { name: 'Frontend-Dev', command: 'npm run dev' },
      { name: 'Frontend-Server', command: 'npm run eval:continuous' }
    ]
  },
  {
    name: 'Task-backend',
    description: 'Backend Team',
    windows: [
      { name: 'Backend-PM', command: 'echo "Backend PM ready"' },
      { name: 'Backend-Dev', command: 'echo "Backend dev environment"' },
      { name: 'Backend-Server', command: 'echo "Backend server ready"' }
    ]
  },
  {
    name: 'Task-monitoring',
    description: 'Monitoring & DevOps',
    windows: [
      { name: 'Eval-Monitor', command: 'npm run eval:monitor' },
      { name: 'MCP-Status', command: 'echo "MCP status dashboard"' },
      { name: 'Logs', command: 'tail -f logs/*.log' }
    ]
  }
];

async function checkPrerequisites() {
  console.log(chalk.blue.bold('\n🔍 Checking prerequisites...\n'));
  
  // Check Python
  try {
    await execAsync('python --version');
    console.log(chalk.green('✓ Python installed'));
  } catch {
    console.log(chalk.red('✗ Python not found - required for Serena'));
  }
  
  // Check Node
  try {
    const { stdout } = await execAsync('node --version');
    console.log(chalk.green(`✓ Node.js installed: ${stdout.trim()}`));
  } catch {
    console.log(chalk.red('✗ Node.js not found'));
  }
  
  // Check tmux
  try {
    await execAsync('tmux -V');
    console.log(chalk.green('✓ tmux installed'));
  } catch {
    console.log(chalk.yellow('⚠ tmux not installed - team orchestration unavailable'));
  }
}

async function setupMCPServers() {
  console.log(chalk.blue.bold('\n🚀 Setting up MCP Servers...\n'));
  
  for (const server of mcpServers) {
    console.log(chalk.cyan(`\n📦 ${server.name}`));
    console.log(chalk.gray(`   ${server.description}`));
    
    // Run setup if needed
    if (server.setup) {
      try {
        await server.setup();
      } catch (error) {
        console.log(chalk.yellow(`   ⚠ Setup failed: ${error}`));
      }
    }
    
    // Check if directory exists
    if (server.cwd) {
      const serverPath = path.join(process.cwd(), server.cwd);
      try {
        await fs.access(serverPath);
        console.log(chalk.green(`   ✓ Directory exists: ${server.cwd}`));
      } catch {
        console.log(chalk.yellow(`   ⚠ Directory missing: ${server.cwd}`));
        
        // Clone repo if provided
        if (server.repo) {
          console.log(chalk.cyan(`   Cloning ${server.repo}...`));
          try {
            await execAsync(`git clone ${server.repo} ${server.cwd}`);
            console.log(chalk.green(`   ✓ Cloned successfully`));
          } catch (error) {
            console.log(chalk.red(`   ✗ Clone failed: ${error}`));
          }
        }
      }
    }
    
    if (server.port) {
      console.log(chalk.gray(`   Port: ${server.port}`));
    }
    console.log(chalk.gray(`   Transport: ${server.transport || 'stdio'}`));
  }
}

async function createMCPConfig() {
  console.log(chalk.blue.bold('\n📄 Creating MCP Configuration...\n'));
  
  const mcpConfig = {
    servers: mcpServers.map(server => ({
      name: server.name,
      transport: server.transport || 'stdio',
      port: server.port,
      command: server.command,
      enabled: true
    })),
    settings: {
      retryAttempts: 3,
      retryDelay: 1000,
      healthCheckInterval: 30000
    }
  };
  
  await fs.writeFile(
    path.join(process.cwd(), 'mcp-config.json'),
    JSON.stringify(mcpConfig, null, 2)
  );
  
  console.log(chalk.green('✓ Created mcp-config.json'));
}

async function createStartScript() {
  const startScript = `#!/usr/bin/env node
const { spawn } = require('child_process');
const config = require('./mcp-config.json');
const chalk = require('chalk');

console.log(chalk.blue.bold('\\n🚀 Starting MCP Servers...\\n'));

const processes = [];

config.servers.forEach((server, index) => {
  if (!server.enabled) return;
  
  setTimeout(() => {
    console.log(chalk.cyan(\`Starting \${server.name}...\`));
    
    const [cmd, ...args] = server.command.split(' ');
    const proc = spawn(cmd, args, {
      stdio: 'inherit',
      shell: true,
      cwd: server.cwd || process.cwd()
    });
    
    proc.on('error', (err) => {
      console.error(chalk.red(\`Failed to start \${server.name}:\`), err.message);
    });
    
    processes.push(proc);
  }, index * 2000); // Stagger starts
});

process.on('SIGINT', () => {
  console.log(chalk.yellow('\\n👋 Shutting down MCP servers...'));
  processes.forEach(proc => proc.kill());
  process.exit(0);
});
`;

  await fs.writeFile(
    path.join(process.cwd(), 'scripts/start-all-mcp.cjs'),
    startScript,
    { mode: 0o755 }
  );
  
  console.log(chalk.green('✓ Created start-all-mcp.cjs'));
}

async function setupTmuxSessions() {
  console.log(chalk.blue.bold('\n🖥️  Setting up tmux sessions...\n'));
  
  // Check if tmux is available
  try {
    await execAsync('tmux -V');
  } catch {
    console.log(chalk.yellow('⚠ tmux not available - skipping team setup'));
    return;
  }
  
  for (const session of tmuxSessions) {
    console.log(chalk.cyan(`\n📋 ${session.description}`));
    
    try {
      // Kill existing session if it exists
      await execAsync(`tmux kill-session -t ${session.name} 2>/dev/null || true`);
      
      // Create new session
      await execAsync(`tmux new-session -d -s ${session.name}`);
      console.log(chalk.green(`   ✓ Created session: ${session.name}`));
      
      // Create windows
      for (let i = 0; i < session.windows.length; i++) {
        const window = session.windows[i];
        
        if (i === 0) {
          // Rename first window
          await execAsync(`tmux rename-window -t ${session.name}:0 '${window.name}'`);
        } else {
          // Create new windows
          await execAsync(`tmux new-window -t ${session.name}:${i} -n '${window.name}'`);
        }
        
        // Send command to window
        await execAsync(`tmux send-keys -t ${session.name}:${i} '${window.command}' Enter`);
        console.log(chalk.gray(`   + Window: ${window.name}`));
      }
    } catch (error) {
      console.log(chalk.red(`   ✗ Failed to create session: ${error}`));
    }
  }
  
  // Create master control script
  const tmuxControlScript = `#!/bin/bash
# tmux session control script

case "$1" in
  attach)
    echo "Available sessions:"
    tmux ls
    echo ""
    echo "Attach with: tmux attach -t <session-name>"
    ;;
  status)
    tmux ls
    ;;
  frontend)
    tmux attach -t Task-frontend
    ;;
  backend)
    tmux attach -t Task-backend
    ;;
  monitoring)
    tmux attach -t Task-monitoring
    ;;
  killall)
    tmux kill-server
    echo "All sessions terminated"
    ;;
  *)
    echo "Usage: $0 {attach|status|frontend|backend|monitoring|killall}"
    ;;
esac
`;

  await fs.writeFile(
    path.join(process.cwd(), 'tmux-control.sh'),
    tmuxControlScript,
    { mode: 0o755 }
  );
  
  console.log(chalk.green('\n✓ Created tmux-control.sh'));
}

async function createStatusDashboard() {
  const statusScript = `#!/usr/bin/env tsx
import * as fs from 'fs/promises';
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkMCPStatus() {
  console.clear();
  console.log(chalk.blue.bold('🎯 MCP Server Status Dashboard\\n'));
  
  const config = JSON.parse(await fs.readFile('mcp-config.json', 'utf-8'));
  
  for (const server of config.servers) {
    process.stdout.write(\`\${server.name.padEnd(25)}\`);
    
    if (server.port) {
      try {
        await execAsync(\`curl -s http://localhost:\${server.port}/health\`);
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
  
  console.log(chalk.blue('\\n📊 tmux Sessions:'));
  try {
    const { stdout } = await execAsync('tmux ls');
    console.log(chalk.gray(stdout));
  } catch {
    console.log(chalk.yellow('No active sessions'));
  }
  
  console.log(chalk.gray('\\nPress Ctrl+C to exit'));
}

// Run status check every 5 seconds
setInterval(checkMCPStatus, 5000);
checkMCPStatus();
`;

  await fs.writeFile(
    path.join(process.cwd(), 'scripts/mcp-status.ts'),
    statusScript
  );
  
  console.log(chalk.green('✓ Created MCP status dashboard'));
}

async function main() {
  console.log(chalk.blue.bold('🚀 AI Guided SaaS - MCP Deployment System\n'));
  
  await checkPrerequisites();
  await setupMCPServers();
  await createMCPConfig();
  await createStartScript();
  await setupTmuxSessions();
  await createStatusDashboard();
  
  // Update package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
  
  packageJson.scripts = {
    ...packageJson.scripts,
    'mcp:start:all': 'node scripts/start-all-mcp.cjs',
    'mcp:status': 'tsx scripts/mcp-status.ts',
    'tmux:attach': './tmux-control.sh attach',
    'tmux:frontend': './tmux-control.sh frontend',
    'tmux:backend': './tmux-control.sh backend',
    'tmux:monitoring': './tmux-control.sh monitoring'
  };
  
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  console.log(chalk.green.bold('\n✅ MCP Deployment Complete!\n'));
  
  console.log(chalk.cyan('Quick Start Commands:'));
  console.log(chalk.white('1. Start all MCP servers: npm run mcp:start:all'));
  console.log(chalk.white('2. Check status: npm run mcp:status'));
  console.log(chalk.white('3. Attach to frontend: npm run tmux:frontend'));
  console.log(chalk.white('4. Attach to backend: npm run tmux:backend'));
  console.log(chalk.white('5. View monitoring: npm run tmux:monitoring\n'));
  
  console.log(chalk.yellow('Note: Some servers may require additional setup.'));
  console.log(chalk.yellow('Check the logs for any installation requirements.\n'));
}

main().catch(console.error);