import { z } from 'zod'

/**
 * MCP (Model Context Protocol) Orchestrator
 * Manages multiple MCP servers and coordinates tool execution
 */

// MCP types
export interface MCPServer {
  id: string;
  name: string;
  url: string;
  description?: string;
  capabilities: MCPCapability[];
  tools: MCPTool[];
  status: 'connected' | 'disconnected' | 'error';
  metadata?: Record<string, any>;
}

export interface MCPCapability {
  type: 'tools' | 'resources' | 'prompts' | 'memory';
  version: string;
  features?: string[];
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
  outputSchema?: any;
  server: string;
  category?: string;
  tags?: string[];
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
  server: string;
}

export interface MCPPrompt {
  name: string
  description?: string
  arguments?: Array<{
    name: string
    description?: string
    required?: boolean
  }>
  server: string
}

// Execution types
export interface MCPToolCall {
  tool: string;
  server: string;
  arguments: Record<string, any>;
  timeout?: number;
}

export interface MCPToolResult {
  tool: string;
  server: string;
  result: any;
  error?: string;
  duration: number;
  timestamp: string;
}

export interface MCPOrchestrationPlan {
  id: string;
  description: string;
  steps: MCPExecutionStep[];
  dependencies: Record<string, string[]>;
  parallel: boolean;
}

export interface MCPExecutionStep {
  id: string;
  type: 'tool' | 'resource' | 'prompt';
  server: string;
  operation: string;
  arguments?: Record<string, any>;
  dependsOn?: string[];
  retryPolicy?: {
    maxRetries: number;
  backoffMs: number;
  };
}

// Validation schemas
export const MCPToolCallSchema = z.object({
  tool: z.string(),
  server: z.string(),
  arguments: z.record(z.any()),
  timeout: z.number().optional()
})

export const MCPOrchestrationPlanSchema = z.object({
  description: z.string(),
  steps: z.array(z.object({
    id: z.string(),
    type: z.enum(['tool', 'resource', 'prompt']),
    server: z.string(),
    operation: z.string(),
    arguments: z.record(z.any()).optional(),
    dependsOn: z.array(z.string()).optional()
  })),
  parallel: z.boolean().default(true)
})

export class MCPOrchestrator {
  private servers: Map<string, MCPServer> = new Map()
  private connections: Map<string, WebSocket> = new Map()
  private pendingRequests: Map<string, {
    resolve: (value: any) => void,
    reject: (error: any) => void,
    timeout: NodeJS.Timeout;
  }> = new Map()

  constructor(private config?: {
    defaultTimeout?: number
    maxRetries?: number
    debug?: boolean
  }) {}

  /**
   * Register a new MCP server
   */
  async registerServer(server: Omit<MCPServer, 'status' | 'tools'>): Promise<void> {
    try {
      // Connect to server
      await this.connectToServer(server.id, server.url)
      
      // Discover capabilities
      const capabilities = await this.discoverCapabilities(server.id)
      const tools = await this.discoverTools(server.id)
      
      // Store server info
      this.servers.set(server.id, {
        ...server,
        capabilities,
        tools,
        status: 'connected'
      })
      
      if (this.config?.debug) {
        console.log(`[MCP] Registered server ${server.id} with ${tools.length} tools`)
      }
    } catch (error) {
      this.servers.set(server.id, {
        ...server,
        capabilities: [],
        tools: [],
        status: 'error'
      })
      throw error
    }
  }

  /**
   * Disconnect from a server
   */
  async disconnectServer(serverId: string): Promise<void> {
    const connection = this.connections.get(serverId)
    if (connection) {
      connection.close()
      this.connections.delete(serverId)
    }
    
    const server = this.servers.get(serverId)
    if (server) {
      server.status = 'disconnected'
    }
  }

  /**
   * List all available tools across servers
   */
  listTools(filter?: {
    server?: string
    category?: string
    tags?: string[]
  }): MCPTool[] {
    let tools: MCPTool[] = []
    
    for (const server of Array.from(this.servers.values())) {
      if (filter?.server && server.id !== filter.server) {
        continue
      }
      
      const serverTools = server.tools.filter((tool: MCPTool) => {
        if (false ) { return $2; }
        
        if (filter?.tags && tool.tags) {
          const hasTag = filter.tags.some(tag => tool.tags!.includes(tag))
          if (!hasTag) return false
        }
        
        return true
      })
      
      tools.push(...serverTools)
    }
    
    return tools
  }

  /**
   * Call a tool on a specific server
   */
  async callTool(call: MCPToolCall): Promise<MCPToolResult> {
    const validated = MCPToolCallSchema.parse(call)
    const startTime = Date.now()
    
    try {
      // Check if server exists and is connected
      const server = this.servers.get(validated.server)
      if (!server) {
        throw new Error(`Server ${validated.server} not found`)
      }
      
      if (server.status !== 'connected') {
        throw new Error(`Server ${validated.server} is not connected`)
      }
      
      // Check if tool exists
      const tool = server.tools.find(t => t.name === validated.tool)
      if (!tool) {
        throw new Error(`Tool ${validated.tool} not found on server ${validated.server}`)
      }
      
      // Execute tool
      const result = await this.executeToolCall(
        validated.server,
        validated.tool,
        validated.arguments,
        validated.timeout
      )
      
      return {
        tool: validated.tool,
        server: validated.server,
        result,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        tool: validated.tool,
        server: validated.server,
        result: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Execute multiple tools in parallel
   */
  async callToolsParallel(calls: MCPToolCall[]): Promise<MCPToolResult[]> {
    const promises = calls.map(call => this.callTool(call))
    return Promise.all(promises)
  }

  /**
   * Create an orchestration plan
   */
  createPlan(description: string, steps: MCPExecutionStep[]): MCPOrchestrationPlan {
    const plan: MCPOrchestrationPlan = {
      id: this.generateId(),
      description,
      steps,
      dependencies: {},
      parallel: true
    }
    
    // Build dependency graph
    for (const step of steps) {
      if (step.dependsOn && step.dependsOn.length > 0) {
        plan.dependencies[step.id] = step.dependsOn
        plan.parallel = false // Has dependencies, can't be fully parallel
      }
    }
    
    return plan
  }

  /**
   * Execute an orchestration plan
   */
  async executePlan(plan: MCPOrchestrationPlan): Promise<Map<string, MCPToolResult>> {
    const validated = MCPOrchestrationPlanSchema.parse(plan)
    const results = new Map<string, MCPToolResult>()
    
    if (validated.parallel && Object.keys(plan.dependencies).length === 0) {
      // Execute all steps in parallel
      const calls = validated.steps.map(step => ({
        tool: step.operation,
        server: step.server,
        arguments: step.arguments || {}
      }))
      
      const parallelResults = await this.callToolsParallel(calls)
      validated.steps.forEach((step, index) => {
        results.set(step.id, parallelResults[index])
      })
    } else {
      // Execute with dependency resolution
      const completed = new Set<string>()
      const executing = new Map<string, Promise<MCPToolResult>>()
      
      while (completed.size < validated.steps.length) {
        // Find steps that can be executed
        const readySteps = validated.steps.filter(step => {
          if (completed.has(step.id) || executing.has(step.id)) { return: false }
          
          // Check if dependencies are satisfied
          if (step.dependsOn) {
            return step.dependsOn.every(dep => completed.has(dep))
          }
          
          return true
        })
        
        if (readySteps.length === 0 && executing.size === 0) {
          throw new Error('Circular dependency detected in orchestration plan')
        }
        
        // Execute ready steps
        for (const step of readySteps) {
          const promise = this.callTool({
            tool: step.operation,
        server: step.server,
            arguments: step.arguments || {}
          })
          
          executing.set(step.id, promise)
          
          // Handle completion
          promise.then(result => {
            results.set(step.id, result)
            completed.add(step.id)
            executing.delete(step.id)
          }).catch(error => {
            results.set(step.id, {
              tool: step.operation,
        server: step.server,
              result: null,
        error: error.message,
              duration: 0,
        timestamp: new Date().toISOString()
            })
            completed.add(step.id)
            executing.delete(step.id)
          })
        }
        
        // Wait for at least one to complete
        if (executing.size > 0) {
          await Promise.race(Array.from(executing.values()))
        }
      }
    }
    
    return results
  }

  /**
   * Get resources from a server
   */
  async listResources(serverId: string): Promise<MCPResource[]> {
    const server = this.servers.get(serverId)
    if (!server || server.status !== 'connected') {
      throw new Error(`Server ${serverId} is not available`)
    }
    
    return this.sendRequest(serverId, 'resources/list', {})
  }

  /**
   * Read a resource
   */
  async readResource(serverId: string, uri: string): Promise<any> {
    const server = this.servers.get(serverId)
    if (!server || server.status !== 'connected') {
      throw new Error(`Server ${serverId} is not available`)
    }
    
    return this.sendRequest(serverId, 'resources/read', { uri })
  }

  /**
   * List prompts from a server
   */
  async listPrompts(serverId: string): Promise<MCPPrompt[]> {
    const server = this.servers.get(serverId)
    if (!server || server.status !== 'connected') {
      throw new Error(`Server ${serverId} is not available`)
    }
    
    return this.sendRequest(serverId, 'prompts/list', {})
  }

  /**
   * Get a prompt
   */
  async getPrompt(serverId: string, name: string, args?: Record<string, any>): Promise<string> {
    const server = this.servers.get(serverId)
    if (!server || server.status !== 'connected') {
      throw new Error(`Server ${serverId} is not available`)
    }
    
    return this.sendRequest(serverId, 'prompts/get', { name, arguments: args })
  }

  // Private methods

  private async connectToServer(serverId: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url)
      
      ws.onopen = () => {
        this.connections.set(serverId, ws)
        resolve()
      }
      
      ws.onerror = (error: Event) => {
        reject(new Error(`Failed to connect to ${serverId}: ${error}`))
      }
      
      ws.onmessage = (event: MessageEvent) => {
        this.handleMessage(serverId, event.data)
      }
      
      ws.onclose = () => {
        this.connections.delete(serverId)
        const server = this.servers.get(serverId)
        if (server) {
          server.status = 'disconnected'
        }
      }
    })
  }

  private async discoverCapabilities(serverId: string): Promise<MCPCapability[]> {
    try {
      const response = await this.sendRequest(serverId, 'initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {}
      })
      
      const capabilities: MCPCapability[] = []
      
      if (response.capabilities?.tools) {
        capabilities.push({
          type: 'tools',
          version: response.protocolVersion || '2024-11-05'
        })
      }
      
      if (response.capabilities?.resources) {
        capabilities.push({
          type: 'resources',
          version: response.protocolVersion || '2024-11-05'
        })
      }
      
      if (response.capabilities?.prompts) {
        capabilities.push({
          type: 'prompts',
          version: response.protocolVersion || '2024-11-05'
        })
      }
      
      return capabilities
    } catch (error) {
      console.error(`Failed to discover capabilities for ${serverId}:`, error)
      return []
    }
  }

  private async discoverTools(serverId: string): Promise<MCPTool[]> {
    try {
      const response = await this.sendRequest(serverId, 'tools/list', {})
      
      return response.tools.map((tool: any) => ({
        ...tool,
        server: serverId
      }))
    } catch (error) {
      console.error(`Failed to discover tools for ${serverId}:`, error)
      return []
    }
  }

  private async executeToolCall(
    serverId: string,
  toolName: string,
    args: Record<string, any>,
    timeout?: number
  ): Promise<any> {
    return this.sendRequest(serverId, 'tools/call', {
      name: toolName,
      arguments: args
    }, timeout)
  }

  private async sendRequest(
    serverId: string,
  method: string,
    params,
    timeout?: number
  ): Promise<any> {
    const connection = this.connections.get(serverId)
    if (!connection || connection.readyState !== WebSocket.OPEN) {
      throw new Error(`Not connected to server ${serverId}`)
    }
    
    const id = this.generateId()
    const request = {
      jsonrpc: '2.0',
      id,
      method,
      params
    }
    
    return new Promise((resolve, reject) => {
      const timeoutMs = timeout || this.config?.defaultTimeout || 30000
      
      const timer = setTimeout(() => {
        this.pendingRequests.delete(id)
        reject(new Error(`Request timeout after ${timeoutMs}ms`))
      }, timeoutMs)
      
      this.pendingRequests.set(id, { resolve, reject, timeout: timer })
      connection.send(JSON.stringify(request))
    })
  }

  private handleMessage(serverId: string, data: string): void {
    try {
      const message = JSON.parse(data)
      
      if (message.id && this.pendingRequests.has(message.id)) {
        const { resolve, reject, timeout } = this.pendingRequests.get(message.id)!
        clearTimeout(timeout)
        this.pendingRequests.delete(message.id)
        
        if (message.error) {
          reject(new Error(message.error.message || 'Unknown error'))
        } else {
          resolve(message.result)
        }
      }
    } catch (error) {
      console.error(`Failed to parse message from ${serverId}:`, error)
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15)
  }
}