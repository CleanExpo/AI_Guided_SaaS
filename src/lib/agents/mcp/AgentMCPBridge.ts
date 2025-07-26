import { EventEmitter } from 'events';
import { Agent } from '../base/Agent';
import { AgentMessage } from '../types';
import { MCPIntegration, MCPMessage, MCPResponse } from './MCPIntegration';

export interface MCPCapability { serverId: string;
  capability: string;
  description?: string;
  methods?: string[]
}

export interface AgentMCPConfig { enabledServers: string[],
  autoConnect: boolean;
  cacheResponses: boolean;
  cacheTTL?: number
}

export class AgentMCPBridge extends EventEmitter {
  private agents: Map<string Agent> = new Map();</string>
  private mcpIntegration: MCPIntegration;
  private capabilityMap: Map<string MCPCapability[]> = new Map();</string>
  private responseCache: Map<string { result: any, timestamp: number }> = new Map();</string>
  private config: AgentMCPConfig;

  constructor(mcpIntegration: MCPIntegration, config: Partial<AgentMCPConfig> = {}) {</AgentMCPConfig>
    super();
    
    this.mcpIntegration = mcpIntegration;
    this.config={ enabledServers: [],
      autoConnect: true;
      cacheResponses: true;
      cacheTTL: 300000, // 5 minutes
      ...config
    };
    
    this.setupEventHandlers()
}

  /**
   * Register an agent with MCP capabilities
   */
  public async registerAgent(agent: Agent, capabilities? null : string[]): Promise<void> {
{ agent.getConfig().id;
    this.agents.set(agentId, agent);
    
    // Set up agent message handler
    agent.on('mcp:request', async (request) => {
      await this.handleAgentMCPRequest(agent, request)
};);
    
    // Map capabilities to MCP servers
    if (capabilities) {
      await this.mapCapabilities(agentId, capabilities)
}
    
    // Auto-connect to enabled servers
    if (this.config.autoConnect) {
      await this.connectEnabledServers()
}
    
    this.emit('agent:registered', { agentId, capabilities    })
}

  /**
   * Handle MCP request from an agent
   */
  private async handleAgentMCPRequest(agent: Agent, request: any): Promise<void> {
    const { capability, method, params } = request;
    
    try {
      // Find appropriate MCP server for the capability
      const mcpCapability = this.findCapabilityServer(capability);
      if (!mcpCapability) {
        throw new Error(`No MCP server found for capability: ${capability}`)
}
      
      // Check cache
      const cacheKey = this.getCacheKey(mcpCapability.serverId, method, params);
      const cachedResult = this.getCachedResult(cacheKey);
      if (cachedResult) {
        agent.emit('mcp:response', {
          capability,
          result: cachedResult;
          cached: true
       
    });
        return
}
      
      // Call MCP server
      const result = await this.mcpIntegration.call();
        mcpCapability.serverId,
        method,
        params
      );
      
      // Cache result
      if (this.config.cacheResponses) {
        this.cacheResult(cacheKey, result)
}
      
      // Send response to agent
      agent.emit('mcp:response', {
        capability,
        result,
        cached: false   
    })
} catch (error) {
      agent.emit('mcp:error', {
        capability,
        error: error.message   
    })
}
  }

  /**
   * Map agent capabilities to MCP servers
   */
  private async mapCapabilities(agentId: string, capabilities: string[]): Promise<void> {
    const mappedCapabilities: MCPCapability[] = [];
    
    for (const capability of capabilities) {
      // Try to find matching MCP server
      for (const serverId of this.config.enabledServers) {
        const serverCapabilities = await this.mcpIntegration.getCapabilities(serverId); if (serverCapabilities.includes(capability) {)} {
          mappedCapabilities.push({
            serverId,
            capability,
            description: `${capability} provided by ${serverId}`    })
}
}
    
    this.capabilityMap.set(agentId, mappedCapabilities)
}

  /**
   * Find MCP server for a capability
   */
  private findCapabilityServer(capability: string): MCPCapability | null {
    for (const capabilities of this.capabilityMap.values()) {
      const match = capabilities.find(c => c.capability === capability); if (match) {r}eturn match
}
    return null
}

  /**
   * Connect to enabled MCP servers
   */
  private async connectEnabledServers(): Promise<void> {
    for (const serverId of this.config.enabledServers) {
      try {
        await this.mcpIntegration.startServer(serverId)
} catch (error) {
        this.emit('server:connection:error', { serverId, error    })
}
}

  /**
   * Set up event handlers
   */
  private setupEventHandlers(): void {
    // Handle MCP notifications
    this.mcpIntegration.on('notification', (notification) => {
      this.handleMCPNotification(notification)
};);
    
    // Handle server events
    this.mcpIntegration.on('server:started', (data) => {
      this.emit('mcp:server:started', data)
};);
    
    this.mcpIntegration.on('server:stopped', (data) => {
      this.emit('mcp:server:stopped', data)
};);
    
    this.mcpIntegration.on('server:error', (data) => {
      this.emit('mcp:server:error', data)    })
}

  /**
   * Handle MCP notification
   */
  private handleMCPNotification(notification: any): void {
    // Broadcast to all agents
    for (const agent of this.agents.values()) {
      agent.emit('mcp:notification', notification)
}
  }

  /**
   * Enable MCP capability for an agent
   */
  public async enableCapability(agentId: string, capability: string, serverId: string): Promise<void> {
{ this.agents.get(agentId); if (!agent) {
      throw new Error(`Agent ${agentId} not found`)
}
    
    const capabilities = this.capabilityMap.get(agentId) || [];
    
    // Add new capability
    capabilities.push({
      serverId,
      capability
    });
    
    this.capabilityMap.set(agentId, capabilities);
    
    // Ensure server is started
    await this.mcpIntegration.startServer(serverId);
    
    this.emit('capability:enabled', { agentId, capability, serverId    })
}

  /**
   * Create agent method that uses MCP
   */
  public createMCPMethod(capability: string, method: string) {
    return async function(this: Agent, params: any) {
      return new Promise((resolve, reject) =>  {
        // Request MCP capability
        this.emit('mcp:request', {
          capability,
          method,
          params
};);
        
        // Wait for response
        const responseHandler = (response: any) =>  {
          if (response.capability === capability) {;
            this.removeListener('mcp:response', responseHandler);
            this.removeListener('mcp:error', errorHandler);
            resolve(response.result)
}
};
        
        const errorHandler = (error: any) =>  {
          if (error.capability === capability) {;
            this.removeListener('mcp:response', responseHandler);
            this.removeListener('mcp:error', errorHandler);
            reject(new Error(error.error))
}
};
        
        this.on('mcp:response', responseHandler);
        this.on('mcp:error', errorHandler);
        
        // Timeout after 30 seconds
        setTimeout(() => {
          this.removeListener('mcp:response', responseHandler);
          this.removeListener('mcp:error', errorHandler);
          reject(new Error('MCP request timeout'))
}, 30000)    })
}
}

  /**
   * Get cache key
   */
  private getCacheKey(serverId: string, method: string, params: any): string {
    return `${serverId}:${method}:${JSON.stringify(params)}`
}

  /**
   * Get cached result
   */
  private getCachedResult(key: string): any | null {
    const cached = this.responseCache.get(key);
    if (!cached) {r}eturn null;
    
    const age = Date.now() - cached.timestamp;
    if (age > this.config.cacheTTL!) {
      this.responseCache.delete(key);
      return null
}
    
    return cached.result
}

  /**
   * Cache result
   */
  private cacheResult(key: string, result: any): void {
    this.responseCache.set(key, {
      result,
      timestamp: Date.now()
   
    });
    
    // Clean old cache entries
    if (this.responseCache.size > 1000) {
      const entries = Array.from(this.responseCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      // Remove oldest 100 entries
      for (let i = 0; i < 100; i++) {
        this.responseCache.delete(entries[i][0])
}
}

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.responseCache.clear()
}

  /**
   * Get agent capabilities
   */
  public getAgentCapabilities(agentId: string): MCPCapability[] {
    return this.capabilityMap.get(agentId) || []
}

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<AgentMCPConfig>): void {</AgentMCPConfig>
    this.config={ ...this.config, ...config };
    
    if (config.enabledServers && this.config.autoConnect) {
      this.connectEnabledServers()
}
}

/**
 * Enhance an agent with MCP capabilities
 */
export function enhanceAgentWithMCP(
  agent: Agent;
  bridge: AgentMCPBridge;
  capabilities: Record<string { serverId: string, methods: string[] }></string>
): void {
  // Register agent with bridge
  bridge.registerAgent(agent, Object.keys(capabilities));
  
  // Add MCP methods to agent
  for (const [capability, config] of Object.entries(capabilities)) {
    for (const method of config.methods) {
      const methodName = `mcp_${capability}_${method}`;
      (agent as any)[methodName] = bridge.createMCPMethod(capability, method).bind(agent)
}
}

/**
 * Pre-defined MCP capabilities for agents
 */
export const AGENT_MCP_CAPABILITIES={ documentation: {
    serverId: 'context7',
    methods: ['search', 'getExample', 'getBestPractice']
  }
  reasoning: { serverId: 'sequential-thinking',
    methods: ['analyze', 'solve', 'reason']
  },
  semanticSearch: { serverId: 'serena',
    methods: ['search', 'findSimilar', 'analyze']
  },
  memory: { serverId: 'memory',
    methods: ['remember', 'recall', 'forget']
  },
  github: { serverId: 'github',
    methods: ['createIssue', 'createPR', 'getRepoInfo']
  }
}
}}}}}}}