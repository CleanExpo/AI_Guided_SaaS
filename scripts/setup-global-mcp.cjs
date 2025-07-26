const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

console.log('🌐 Setting up Global MCP Configuration...\n');

// Get user home directory
const homeDir = os.homedir();
const platform = os.platform();

// Step 1: Create global MCP configuration directory
const globalMcpDir = path.join(homeDir, '.mcp-global');
const configDir = path.join(globalMcpDir, 'config');
const scriptsDir = path.join(globalMcpDir, 'scripts');
const agentsDir = path.join(globalMcpDir, 'agents');

[globalMcpDir, configDir, scriptsDir, agentsDir].forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
});

console.log(`✅ Created global MCP directory at: ${globalMcpDir}`);

// Step 2: Create MCP configuration file
const mcpConfig = {
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      "autoStart": true,
      "restartOnFailure": true,
      "maxRestarts": 3
    },
    "memory": {
      "command": "npx", 
      "args": ["-y", "@modelcontextprotocol/server-memory", "--dangerously-skip-permissions"],
      "autoStart": true,
      "restartOnFailure": true
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github", "--dangerously-skip-permissions"],
      "env": {
        "GITHUB_TOKEN": process.env.GITHUB_TOKEN || "YOUR_GITHUB_TOKEN"
      },
      "autoStart": true
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "playwright-mcp", "--dangerously-skip-permissions"],
      "autoStart": true
    },
    "eslint": {
      "command": "npx",
      "args": ["-y", "eslint-mcp", "--dangerously-skip-permissions"],
      "autoStart": true
    }
  },
  "globalSettings": {
    "autoStartOnBoot": true,
    "logLevel": "info",
    "healthCheckInterval": 30000,
    "restartDelay": 5000
  }
};

fs.writeFileSync(
  path.join(configDir, 'mcp-config.json'),
  JSON.stringify(mcpConfig, null, 2)
);

// Step 3: Create MCP auto-start script
const autoStartScript = `#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const configPath = '${path.join(configDir, 'mcp-config.json').replace(/\\/g, '\\\\')}';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const runningServers = new Map();

function startMcpServer(name, serverConfig) {
  console.log(\`Starting MCP server: \${name}...\`);
  
  const proc = spawn(serverConfig.command, serverConfig.args, {
    env: { ...process.env, ...serverConfig.env },
    stdio: 'pipe',
    shell: true
  });
  
  proc.stdout.on('data', (data) => {
    console.log(\`[\${name}] \${data.toString().trim()}\`);
  });
  
  proc.stderr.on('data', (data) => {
    console.error(\`[\${name}] ERROR: \${data.toString().trim()}\`);
  });
  
  proc.on('exit', (code) => {
    console.log(\`[\${name}] Exited with code \${code}\`);
    runningServers.delete(name);
    
    if (serverConfig.restartOnFailure && code !== 0) {
      console.log(\`[\${name}] Restarting in 5 seconds...\`);
      setTimeout(() => startMcpServer(name, serverConfig), 5000);
    }
  });
  
  runningServers.set(name, proc);
}

// Start all auto-start servers
Object.entries(config.mcpServers).forEach(([name, serverConfig]) => {
  if (serverConfig.autoStart) {
    startMcpServer(name, serverConfig);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\\nShutting down MCP servers...');
  runningServers.forEach((proc, name) => {
    console.log(\`Stopping \${name}...\`);
    proc.kill();
  });
  process.exit(0);
});

console.log('MCP servers started. Press Ctrl+C to stop.');
`;

fs.writeFileSync(path.join(scriptsDir, 'mcp-autostart.js'), autoStartScript);
fs.chmodSync(path.join(scriptsDir, 'mcp-autostart.js'), '755');

// Step 4: Create shell profile integration
const shellIntegration = `
# MCP Global Configuration
export MCP_GLOBAL_HOME="${globalMcpDir}"
export PATH="$PATH:${scriptsDir}"

# Auto-start MCP servers in new terminals
if [ -z "$MCP_SERVERS_STARTED" ]; then
  export MCP_SERVERS_STARTED=1
  node "${path.join(scriptsDir, 'mcp-autostart.js')}" > "${path.join(globalMcpDir, 'mcp.log')}" 2>&1 &
  echo "🚀 MCP servers starting in background..."
fi

# MCP helper functions
mcp-status() {
  ps aux | grep -E "mcp|modelcontextprotocol" | grep -v grep
}

mcp-restart() {
  pkill -f "mcp-autostart.js" 2>/dev/null || true
  unset MCP_SERVERS_STARTED
  node "${path.join(scriptsDir, 'mcp-autostart.js')}" > "${path.join(globalMcpDir, 'mcp.log')}" 2>&1 &
  echo "🔄 MCP servers restarted"
}

mcp-logs() {
  tail -f "${path.join(globalMcpDir, 'mcp.log')}"
}
`;

// Determine shell profile file
let profileFiles = [];
if (platform === 'win32') {
  // Windows PowerShell profile
  const psProfileDir = path.join(homeDir, 'Documents', 'WindowsPowerShell');
  fs.mkdirSync(psProfileDir, { recursive: true });
  profileFiles.push(path.join(psProfileDir, 'Microsoft.PowerShell_profile.ps1'));
  
  // Also create a batch file for CMD
  const cmdIntegration = `@echo off
set MCP_GLOBAL_HOME=${globalMcpDir}
set PATH=%PATH%;${scriptsDir}

if not defined MCP_SERVERS_STARTED (
  set MCP_SERVERS_STARTED=1
  start /B node "${path.join(scriptsDir, 'mcp-autostart.js')}" > "${path.join(globalMcpDir, 'mcp.log')}" 2>&1
  echo MCP servers starting in background...
)
`;
  fs.writeFileSync(path.join(scriptsDir, 'mcp-init.bat'), cmdIntegration);
} else {
  // Unix-like systems
  profileFiles = [
    path.join(homeDir, '.bashrc'),
    path.join(homeDir, '.zshrc'),
    path.join(homeDir, '.profile')
  ];
}

// Step 5: Create VS Code settings for global MCP
const vscodeSettingsDir = path.join(homeDir, '.vscode');
fs.mkdirSync(vscodeSettingsDir, { recursive: true });

const vscodeSettings = {
  "mcp.servers": {
    "sequential-thinking": {
      "command": "node",
      "args": [path.join(scriptsDir, 'mcp-autostart.js')],
      "enabled": true
    }
  },
  "terminal.integrated.env.windows": {
    "MCP_GLOBAL_HOME": globalMcpDir
  },
  "terminal.integrated.env.linux": {
    "MCP_GLOBAL_HOME": globalMcpDir
  },
  "terminal.integrated.env.osx": {
    "MCP_GLOBAL_HOME": globalMcpDir
  }
};

const existingVsCodeSettings = fs.existsSync(path.join(vscodeSettingsDir, 'settings.json'))
  ? JSON.parse(fs.readFileSync(path.join(vscodeSettingsDir, 'settings.json'), 'utf8'))
  : {};

const mergedSettings = { ...existingVsCodeSettings, ...vscodeSettings };
fs.writeFileSync(
  path.join(vscodeSettingsDir, 'settings.json'),
  JSON.stringify(mergedSettings, null, 2)
);

// Step 6: Create systemd service for Linux or Task Scheduler for Windows
if (platform === 'linux') {
  const serviceContent = `[Unit]
Description=MCP Global Servers
After=network.target

[Service]
Type=simple
User=${os.userInfo().username}
WorkingDirectory=${globalMcpDir}
ExecStart=/usr/bin/node ${path.join(scriptsDir, 'mcp-autostart.js')}
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
`;
  
  fs.writeFileSync(path.join(configDir, 'mcp-global.service'), serviceContent);
  console.log('\n📝 To enable auto-start on boot (Linux):');
  console.log(`   sudo cp ${path.join(configDir, 'mcp-global.service')} /etc/systemd/system/`);
  console.log('   sudo systemctl enable mcp-global.service');
  console.log('   sudo systemctl start mcp-global.service');
} else if (platform === 'win32') {
  const taskXml = `<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <Triggers>
    <LogonTrigger>
      <Enabled>true</Enabled>
    </LogonTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">
      <LogonType>InteractiveToken</LogonType>
      <RunLevel>HighestAvailable</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <ExecutionTimeLimit>PT0S</ExecutionTimeLimit>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>node.exe</Command>
      <Arguments>"${path.join(scriptsDir, 'mcp-autostart.js')}"</Arguments>
      <WorkingDirectory>${globalMcpDir}</WorkingDirectory>
    </Exec>
  </Actions>
</Task>`;
  
  fs.writeFileSync(path.join(configDir, 'mcp-task.xml'), taskXml);
  console.log('\n📝 To enable auto-start on boot (Windows):');
  console.log(`   schtasks /create /tn "MCP Global Servers" /xml "${path.join(configDir, 'mcp-task.xml')}"`);
}

// Step 7: Create installation summary
const summaryContent = `
🎉 Global MCP Setup Complete!

Installation Directory: ${globalMcpDir}

📁 Directory Structure:
${globalMcpDir}/
├── config/
│   └── mcp-config.json    # MCP server configurations
├── scripts/
│   └── mcp-autostart.js   # Auto-start script
└── agents/
    └── (MCP agents will be installed here)

🔧 Shell Integration:
${platform === 'win32' ? 
`- PowerShell: Add to your profile with:
    notepad $PROFILE
  Then add:
    . "${path.join(scriptsDir, 'mcp-init.ps1')}"
    
- CMD: Run this in each session:
    "${path.join(scriptsDir, 'mcp-init.bat')}"` :
`- Add to your shell profile (~/.bashrc, ~/.zshrc, etc.):
    ${shellIntegration}`}

🚀 Available Commands:
- mcp-status    # Check running MCP servers
- mcp-restart   # Restart all MCP servers
- mcp-logs      # View MCP server logs

📝 VS Code Integration:
Settings have been added to: ${path.join(vscodeSettingsDir, 'settings.json')}

🔄 Auto-start on Boot:
${platform === 'win32' ? 
`Run: schtasks /create /tn "MCP Global Servers" /xml "${path.join(configDir, 'mcp-task.xml')}"` :
platform === 'linux' ?
`Run: 
  sudo cp ${path.join(configDir, 'mcp-global.service')} /etc/systemd/system/
  sudo systemctl enable mcp-global.service
  sudo systemctl start mcp-global.service` :
'Configure login items in System Preferences'}

✅ Next Steps:
1. Restart your terminal or run: source ~/.bashrc (or equivalent)
2. Test with: mcp-status
3. View logs with: mcp-logs
`;

fs.writeFileSync(path.join(globalMcpDir, 'SETUP_COMPLETE.md'), summaryContent);
console.log(summaryContent);

// Create PowerShell init script for Windows
if (platform === 'win32') {
  const psInit = `
# MCP Global Configuration for PowerShell
$env:MCP_GLOBAL_HOME = "${globalMcpDir}"
$env:PATH += ";${scriptsDir}"

if (-not $env:MCP_SERVERS_STARTED) {
  $env:MCP_SERVERS_STARTED = 1
  Start-Process -NoNewWindow -FilePath "node" -ArgumentList "${path.join(scriptsDir, 'mcp-autostart.js')}" -RedirectStandardOutput "${path.join(globalMcpDir, 'mcp.log')}" -RedirectStandardError "${path.join(globalMcpDir, 'mcp-error.log')}"
  Write-Host "🚀 MCP servers starting in background..." -ForegroundColor Green
}

function mcp-status {
  Get-Process | Where-Object { $_.ProcessName -match "node" -and $_.CommandLine -match "mcp" }
}

function mcp-restart {
  Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "mcp-autostart" }
  Remove-Item env:MCP_SERVERS_STARTED -ErrorAction SilentlyContinue
  & "${path.join(scriptsDir, 'mcp-init.ps1')}"
}

function mcp-logs {
  Get-Content "${path.join(globalMcpDir, 'mcp.log')}" -Tail 50 -Wait
}
`;
  fs.writeFileSync(path.join(scriptsDir, 'mcp-init.ps1'), psInit);
}

console.log(`\n✅ Setup complete! Check ${path.join(globalMcpDir, 'SETUP_COMPLETE.md')} for details.`);