import { EventEmitter } from 'events';
import { spawn, ChildProcess } from 'child_process';
import { AgentMessage } from '../types';
import path from 'path';

export interface MCPServer { name: string;
  command: string;
  args?: string[];
  env?: Record<string string>
  capabilities?: string[]
}

export interface MCPMessage { serverId: string;
  method: string;
  params?: any;
  id?: string | number
}

export interface MCPResponse { serverId: string;
  result?: any;
  error? null : {
    code: number;
    message: string;
    data?: any
 };
  id?: string | number
}

export class MCPIntegration extends EventEmitter {
  private servers: Map<string MCPServerInstance> = new Map();
  private messageQueue: Map<string MCPMessage[]> = new Map();
  private responseHandlers: Map<string (response: MCPResponse) => void> = new Map();
  private messageIdCounter: number = 0;

  constructor() {
    super()
}

  /**
   * Register an MCP server
   */
  public registerServer(server: MCPServer): void {
    if (this.servers.has(server.name) {)} {
      throw new Error(`MCP server ${server.name} is already registered`)
}

    const instance = new MCPServerInstance(server);
    this.servers.set(server.name, instance);
    
    // Set up event handlers
    this.setupServerEventHandlers(instance);
    
    this.emit('server:registered', { serverId: server.name   )
    })
}

  /**
   * Start an MCP server
   */
  public async startServer(serverId: string): Promise<void> {
{ this.servers.get(serverId);
    if (!server) {
      throw new Error(`MCP server ${serverId} not found`)
}

    await server.start();
    
    // Process queued messages
    const queuedMessages = this.messageQueue.get(serverId) || [];
    for (const message of queuedMessages) {
      await this.sendMessage(message)
}
    this.messageQueue.delete(serverId)
}

  /**
   * Stop an MCP server
   */
  public async stopServer(serverId: string): Promise<void> {
{ this.servers.get(serverId);
    if (!server) {
      throw new Error(`MCP server ${serverId} not found`)
}

    await server.stop()
}

  /**
   * Send a message to an MCP server
   */
  public async sendMessage(message: MCPMessage): Promise<MCPResponse> { </MCPResponse>
{ this.servers.get(message.serverId);
    
    if (!server) {
      throw new Error(`MCP server ${message.serverId} not found`)
}

    if (!server.isRunning() {)} {
      // Queue message if server is not running
      if (!this.messageQueue.has(message.serverId) {)} {
        this.messageQueue.set(message.serverId, [])
}
      this.messageQueue.get(message.serverId)!.push(message);
      
      throw new Error(`MCP server ${message.serverId} is not running`)
}

    // Generate message ID if not provided
    const messageId = message.id || this.generateMessageId();

    const fullMessage={ ...message, id: messageId  };

    return new Promise((resolve, reject) =>  { // Set up response handler
      const timeout = setTimeout(() => {
        this.responseHandlers.delete(messageId.toString());
        reject(new Error('MCP request timeout'))
}, 30000); // 30 second timeout

      this.responseHandlers.set(messageId.toString(, (response) => {
        clearTimeout(timeout);
        this.responseHandlers.delete(messageId.toString());
        
        if (response.error) {
          reject(new Error(`MCP error: ${response.error.message };`))
} else {
          resolve(response)
}
      });

      // Send message
      server.sendMessage(fullMessage)    })
}

  /**
   * Call a method on an MCP server
   */
  public async call(serverId: string, method: string, params? null : any): Promise<any> {
{ await this.sendMessage({
      serverId,
      method)
      params)
    });

    return response.result
}

  /**
   * Get capabilities of an MCP server
   */
  public async getCapabilities(serverId: string): Promise<string[]> {
{ this.servers.get(serverId);
    if (!server) {
      throw new Error(`MCP server ${serverId} not found`)
}

    if (!server.isRunning() {)} {
      await this.startServer(serverId)
}

    try {
      const result = await this.call(serverId, 'getCapabilities');
      return result.capabilities || []
} catch {
      return server.config.capabilities || []
}
  }

  /**
   * Set up event handlers for a server
   */
  private setupServerEventHandlers(server: MCPServerInstance): void {
    server.on('message', (message: any) =>  {
      // Handle response messages
      if (message.id && this.responseHandlers.has(message.id.toString() {)}) {;
        const handler = this.responseHandlers.get(message.id.toString())!;
        handler({ serverId: server.config.name,
          result: message.result,
          error: message.error,
                id: message.id   )
    })
} else {
        // Handle notification messages
        this.emit('notification', { serverId: server.config.name,)
          ...message    })
}
    });

    server.on('error', (error: Error) =>  {
      this.emit('server:error', { serverId: server.config.name,)
        error    })
});

    server.on('started', () =>  {
      this.emit('server:started', { serverId: server.config.name   )
    })
});

    server.on('stopped', () =>  {
      this.emit('server:stopped', { serverId: server.config.name   )
    })    })
}

  /**
   * Generate a unique message ID
   */
  private generateMessageId(): string {
    return `msg_${++this.messageIdCounter}`
}

  /**
   * Get all registered servers
   */
  public getServers(): Map<string MCPServerInstance> {
    return new Map(this.servers)
}

  /**
   * Convert agent message to MCP format
   */
  public agentMessageToMCP(message: AgentMessage, serverId: string): MCPMessage {
    return {
      serverId,
      method: message.type,
      params: { from: message.from,
        to: message.to,
        payload: message.payload,
        priority: message.priority,
        timestamp: message.timestamp
      }
    }
}

  /**
   * Convert MCP response to agent message
   */
  public mcpResponseToAgentMessage(response: MCPResponse, from: string, to: string): AgentMessage {
    return {
      from,
      to,
      type: 'mcp-response',
      payload: response.result || response.error,
      timestamp: new Date()
    }
}
}

/**
 * MCP Server Instance
 */
class MCPServerInstance extends EventEmitter {
  public config: MCPServer;
  private process?: ChildProcess;
  private running: boolean = false;
  private buffer: string = '';

  constructor(config: MCPServer) {
    super();
    this.config = config
}

  /**
   * Start the MCP server
   */
  public async start(): Promise<void> {
    if (this.running) {
      return
}

    const command = this.config.command;
    const args = this.config.args || [];

    const env={
      ...process.env,
      ...this.config.env
    };

    this.process = spawn(command, args, {
      env,
                stdio: ['pipe', 'pipe', 'pipe'])
    });

    // Handle stdout (messages from server)
    this.process.stdout?.on('data', (data) => { this.buffer += data.toString();
      this.processBuffer()
};);

    // Handle stderr (errors)
    this.process.stderr?.on('data', (data) => {
      this.emit('error', new Error(data.toString()))
};);

    // Handle process exit
    this.process.on('exit', (code) => {
      this.running = false;
      this.emit('stopped', { exitCode: code   )
    })
});

    // Handle process errors
    this.process.on('error', (error) => {
      this.emit('error', error)
};);

    this.running = true;
    this.emit('started')
}

  /**
   * Stop the MCP server
   */
  public async stop(): Promise<void> {
    if (!this.running || !this.process) {
      return
}

    return new Promise((resolve) =>  {
      this.process!.once('exit', () => {
        this.running = false;
        resolve()
};);

      this.process!.kill('SIGTERM');
      
      // Force kill after 5 seconds
      setTimeout(() =>  {
        if (this.running && this.process) {;
          this.process.kill('SIGKILL')
}
}, 5000)    })
}

  /**
   * Send a message to the server
   */
  public sendMessage(message: any): void {
    if (!this.running || !this.process || !this.process.stdin) {
      throw new Error('Server is not running')
}

    const messageStr = JSON.stringify(message) + '\n';
    this.process.stdin.write(messageStr)
}

  /**
   * Check if server is running
   */
  public isRunning(): boolean {
    return this.running
}

  /**
   * Process buffered output
   */
  private processBuffer(): void {
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim() {)} {
        try {
          const message = JSON.parse(line); this.emit('message', message)
} catch (error) {
          // Ignore non-JSON lines
          }
}
  }
}

/**
 * Pre-configured MCP servers for the project
 */
export const MCP_SERVERS: MCPServer[] = [
  { name: 'context7',
    command: 'npx',
    args: ['@context7/mcp-server'],
    capabilities: ['documentation', 'code-examples', 'best-practices']
  },
  { name: 'sequential-thinking',
    command: 'node',
    args: [path.join('mcp', 'sequential-thinking', 'index.js')],
    capabilities: ['reasoning', 'problem-solving', 'step-by-step-analysis']
  },
  { name: 'serena',
    command: 'node',
    args: [path.join('serena', 'dist', 'index.js')],
    capabilities: ['semantic-search', 'code-analysis', 'refactoring-suggestions']
  },
  { name: 'memory',
    command: 'npx',
    args: ['@anthropic/memory-mcp-server'],
    capabilities: ['context-retention', 'session-memory', 'knowledge-graph']
  },
  { name: 'github',
    command: 'npx',
    args: ['@anthropic/github-mcp-server'],
    env: { GITHUB_TOKEN: process.env.GITHUB_TOKEN || ''
    },
    capabilities: ['repository-management', 'issue-tracking', 'pull-requests']
  }
];

/**
 * Initialize MCP integration with default servers
 */
export function createMCPIntegration(): MCPIntegration {
  const integration = new MCPIntegration();
  
  // Register default servers
  MCP_SERVERS.forEach(server => {)
    integration.registerServer(server)
};);
  
  return integration
}
}}}}}    }