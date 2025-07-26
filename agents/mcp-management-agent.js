/**
 * MCP Management Agent
 * 
 * This specialized agent handles all MCP server operations across projects.
 * It ensures MCP servers are always available and properly configured.
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const EventEmitter = require('events');

class MCPManagementAgent extends EventEmitter {
  constructor() {
    super();
    this.servers = new Map();
    this.config = null;
    this.homeDir = os.homedir();
    this.configPath = path.join(this.homeDir, '.mcp-global', 'config', 'mcp-config.json');
    this.logPath = path.join(this.homeDir, '.mcp-global', 'logs');
    this.healthCheckInterval = null;
    this.restartAttempts = new Map();
    
    // Create log directory
    fs.mkdirSync(this.logPath, { recursive: true });
    
    // Load configuration
    this.loadConfig();
  }

  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      } else {
        // Default configuration
        this.config = {
          mcpServers: {
            'sequential-thinking': {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-sequential-thinking', '--dangerously-skip-permissions'],
              autoStart: true,
              restartOnFailure: true,
              maxRestarts: 3,
              healthCheck: {
                type: 'port',
                port: 3001
              }
            },
            'memory': {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-memory', '--dangerously-skip-permissions'],
              autoStart: true,
              restartOnFailure: true,
              maxRestarts: 3,
              healthCheck: {
                type: 'port',
                port: 3002
              }
            },
            'github': {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-github', '--dangerously-skip-permissions'],
              env: {
                GITHUB_TOKEN: process.env.GITHUB_TOKEN
              },
              autoStart: true,
              restartOnFailure: true,
              maxRestarts: 3
            }
          },
          globalSettings: {
            healthCheckInterval: 30000,
            restartDelay: 5000,
            logLevel: 'info',
            maxLogSize: 10485760 // 10MB
          }
        };
        this.saveConfig();
      }
    } catch (error) {
      this.log('error', `Failed to load config: ${error.message}`);
    }
  }

  saveConfig() {
    const configDir = path.dirname(this.configPath);
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
  }

  log(level, message, serverName = 'agent') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] [${serverName}] ${message}\n`;
    
    // Console output
    if (this.config?.globalSettings?.logLevel === 'debug' || level !== 'debug') {
      console.log(logEntry.trim());
    }
    
    // File output
    const logFile = path.join(this.logPath, `mcp-${serverName}.log`);
    fs.appendFileSync(logFile, logEntry);
    
    // Rotate log if too large
    this.rotateLogIfNeeded(logFile);
    
    // Emit log event
    this.emit('log', { level, message, serverName, timestamp });
  }

  rotateLogIfNeeded(logFile) {
    try {
      const stats = fs.statSync(logFile);
      if (stats.size > this.config.globalSettings.maxLogSize) {
        const rotatedFile = `${logFile}.${Date.now()}`;
        fs.renameSync(logFile, rotatedFile);
        this.log('info', `Rotated log file: ${path.basename(logFile)}`);
      }
    } catch (error) {
      // Ignore errors
    }
  }

  async startServer(name, serverConfig = null) {
    if (this.servers.has(name)) {
      this.log('warn', `Server already running`, name);
      return;
    }

    const config = serverConfig || this.config.mcpServers[name];
    if (!config) {
      this.log('error', `No configuration found for server`, name);
      return;
    }

    this.log('info', `Starting server...`, name);

    const env = {
      ...process.env,
      ...config.env,
      MCP_SERVER_NAME: name
    };

    const proc = spawn(config.command, config.args, {
      env,
      stdio: 'pipe',
      shell: true,
      cwd: config.cwd || process.cwd()
    });

    proc.stdout.on('data', (data) => {
      this.log('info', data.toString().trim(), name);
    });

    proc.stderr.on('data', (data) => {
      this.log('error', data.toString().trim(), name);
    });

    proc.on('error', (error) => {
      this.log('error', `Failed to start: ${error.message}`, name);
      this.servers.delete(name);
    });

    proc.on('exit', (code, signal) => {
      this.log('info', `Exited with code ${code} (signal: ${signal})`, name);
      this.servers.delete(name);
      this.emit('serverExit', { name, code, signal });

      // Handle restart
      if (config.restartOnFailure && code !== 0) {
        this.handleRestart(name, config);
      }
    });

    this.servers.set(name, {
      process: proc,
      config,
      startTime: Date.now(),
      status: 'running'
    });

    this.emit('serverStart', { name, config });
  }

  handleRestart(name, config) {
    const attempts = this.restartAttempts.get(name) || 0;
    
    if (attempts >= (config.maxRestarts || 3)) {
      this.log('error', `Max restart attempts reached`, name);
      this.restartAttempts.delete(name);
      return;
    }

    this.restartAttempts.set(name, attempts + 1);
    const delay = this.config.globalSettings.restartDelay || 5000;
    
    this.log('info', `Restarting in ${delay}ms (attempt ${attempts + 1})...`, name);
    
    setTimeout(() => {
      this.startServer(name, config);
    }, delay);
  }

  async stopServer(name) {
    const server = this.servers.get(name);
    if (!server) {
      this.log('warn', `Server not running`, name);
      return;
    }

    this.log('info', `Stopping server...`, name);
    
    return new Promise((resolve) => {
      const proc = server.process;
      
      const timeout = setTimeout(() => {
        this.log('warn', `Force killing server`, name);
        proc.kill('SIGKILL');
        resolve();
      }, 5000);

      proc.once('exit', () => {
        clearTimeout(timeout);
        this.servers.delete(name);
        this.log('info', `Server stopped`, name);
        resolve();
      });

      proc.kill('SIGTERM');
    });
  }

  async restartServer(name) {
    await this.stopServer(name);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.startServer(name);
  }

  async startAll() {
    const servers = Object.entries(this.config.mcpServers)
      .filter(([_, config]) => config.autoStart);

    for (const [name, config] of servers) {
      await this.startServer(name, config);
      // Small delay between starts
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  async stopAll() {
    const stopPromises = Array.from(this.servers.keys())
      .map(name => this.stopServer(name));
    
    await Promise.all(stopPromises);
  }

  getStatus() {
    const status = {};
    
    for (const [name, server] of this.servers.entries()) {
      status[name] = {
        status: server.status,
        pid: server.process.pid,
        uptime: Date.now() - server.startTime,
        restarts: this.restartAttempts.get(name) || 0
      };
    }

    return status;
  }

  async checkHealth(name) {
    const server = this.servers.get(name);
    if (!server) return false;

    const healthCheck = server.config.healthCheck;
    if (!healthCheck) return true; // No health check configured

    try {
      switch (healthCheck.type) {
        case 'port':
          return await this.checkPort(healthCheck.port);
        
        case 'http':
          return await this.checkHttp(healthCheck.url);
        
        case 'process':
          return server.process && !server.process.killed;
        
        default:
          return true;
      }
    } catch (error) {
      this.log('error', `Health check failed: ${error.message}`, name);
      return false;
    }
  }

  checkPort(port) {
    return new Promise((resolve) => {
      const net = require('net');
      const socket = new net.Socket();
      
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });
      
      socket.on('error', () => {
        resolve(false);
      });
      
      socket.connect(port, 'localhost');
    });
  }

  async checkHttp(url) {
    try {
      const response = await fetch(url);
      return response.ok;
    } catch {
      return false;
    }
  }

  startHealthChecks() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    const interval = this.config.globalSettings.healthCheckInterval || 30000;
    
    this.healthCheckInterval = setInterval(async () => {
      for (const [name, server] of this.servers.entries()) {
        const healthy = await this.checkHealth(name);
        
        if (!healthy && server.status === 'running') {
          this.log('warn', `Health check failed`, name);
          server.status = 'unhealthy';
          this.emit('healthCheckFailed', { name });
          
          // Restart if configured
          if (server.config.restartOnFailure) {
            this.handleRestart(name, server.config);
          }
        } else if (healthy && server.status === 'unhealthy') {
          this.log('info', `Health check passed`, name);
          server.status = 'running';
          this.emit('healthCheckPassed', { name });
        }
      }
    }, interval);
  }

  stopHealthChecks() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  // Project-specific configurations
  async configureForProject(projectPath) {
    const projectConfig = path.join(projectPath, '.mcp', 'config.json');
    
    if (fs.existsSync(projectConfig)) {
      const config = JSON.parse(fs.readFileSync(projectConfig, 'utf8'));
      
      // Merge with global config
      for (const [name, serverConfig] of Object.entries(config.servers || {})) {
        this.config.mcpServers[name] = {
          ...this.config.mcpServers[name],
          ...serverConfig
        };
      }
      
      this.log('info', `Loaded project configuration from ${projectPath}`);
    }
  }

  // Utility methods
  async ensureGlobalSetup() {
    const setupScript = path.join(__dirname, '..', 'scripts', 'setup-global-mcp.cjs');
    
    if (!fs.existsSync(this.configPath)) {
      this.log('info', 'Running global setup...');
      
      return new Promise((resolve, reject) => {
        const proc = spawn('node', [setupScript], {
          stdio: 'inherit'
        });
        
        proc.on('exit', (code) => {
          if (code === 0) {
            this.loadConfig();
            resolve();
          } else {
            reject(new Error(`Setup failed with code ${code}`));
          }
        });
      });
    }
  }

  // CLI interface
  async handleCommand(command, args) {
    switch (command) {
      case 'start':
        if (args[0]) {
          await this.startServer(args[0]);
        } else {
          await this.startAll();
        }
        break;
      
      case 'stop':
        if (args[0]) {
          await this.stopServer(args[0]);
        } else {
          await this.stopAll();
        }
        break;
      
      case 'restart':
        if (args[0]) {
          await this.restartServer(args[0]);
        } else {
          await this.stopAll();
          await this.startAll();
        }
        break;
      
      case 'status':
        console.log(JSON.stringify(this.getStatus(), null, 2));
        break;
      
      case 'logs':
        const serverName = args[0] || 'agent';
        const logFile = path.join(this.logPath, `mcp-${serverName}.log`);
        
        if (fs.existsSync(logFile)) {
          const tail = spawn('tail', ['-f', logFile], {
            stdio: 'inherit'
          });
          
          process.on('SIGINT', () => {
            tail.kill();
            process.exit(0);
          });
        } else {
          console.log(`No logs found for ${serverName}`);
        }
        break;
      
      case 'config':
        console.log(JSON.stringify(this.config, null, 2));
        break;
      
      default:
        console.log(`Unknown command: ${command}`);
        console.log('Available commands: start, stop, restart, status, logs, config');
    }
  }
}

// Export the agent
module.exports = MCPManagementAgent;

// CLI mode
if (require.main === module) {
  const agent = new MCPManagementAgent();
  const [command, ...args] = process.argv.slice(2);
  
  agent.handleCommand(command, args).catch(console.error);
}