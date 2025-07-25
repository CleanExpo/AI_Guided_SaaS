import { EnhancedAgentOrchestrator } from './EnhancedAgentOrchestrator';
import { AgentWorkflow, WorkflowStep } from './types';
import { EventEmitter } from 'events';
import { createMCPIntegration, MCPIntegration } from './mcp/MCPIntegration';
import { AgentMCPBridge, AGENT_MCP_CAPABILITIES, enhanceAgentWithMCP } from './mcp/AgentMCPBridge';
import { PulsedExecutor } from './runtime/PulsedExecutor';
import { ResourceMonitor } from './runtime/ResourceMonitor';
import { ContainerOrchestrator } from './docker/ContainerOrchestrator';

export interface AgentSystemConfig { enabled: boolean;
  maxConcurrentTasks?: number;
  enableMonitoring?: boolean;
  enableSelfHealing?: boolean;
  enablePulsedExecution?: boolean;
  enableContainerization?: boolean;
  mcp? null : {
    enabled: boolean;
    servers: string[]
 }

export class AgentSystem extends EventEmitter {
  private static instance: AgentSystem;
  private orchestrator: EnhancedAgentOrchestrator;
  private workflows: Map<string AgentWorkflow> = new Map();</string>
  private config: AgentSystemConfig;
  private isInitialized: boolean = false;
  private mcpIntegration?: MCPIntegration;
  private mcpBridge?: AgentMCPBridge;
  private pulsedExecutor?: PulsedExecutor;
  private resourceMonitor?: ResourceMonitor;
  private containerOrchestrator?: ContainerOrchestrator;

  private constructor(config: AgentSystemConfig) {
    super();
    this.config = config;
    
    if (config.enabled) {
      this.initialize()
}
  }

  public static getInstance(config? null : AgentSystemConfig): AgentSystem {
    if (!AgentSystem.instance) {
      if (!config) {
        throw new Error('AgentSystem must be initialized with config on first call')
}
      AgentSystem.instance = new AgentSystem(config)
}
    return AgentSystem.instance
}

  private initialize(): void {
    this.orchestrator = new EnhancedAgentOrchestrator({ maxConcurrentTasks: this.config.maxConcurrentTasks || 5,
      enableMonitoring: this.config.enableMonitoring ?? true,
      enableSelfHealing: this.config.enableSelfHealing ?? true
   
    });

    this.setupWorkflows();
    this.setupEventHandlers();
    
    // Initialize MCP if enabled
    if (this.config.mcp?.enabled) {
      this.initializeMCP()
}
    
    // Initialize pulsed execution if enabled
    if (this.config.enablePulsedExecution) {
      this.initializePulsedExecution()
}
    
    // Initialize resource monitoring
    if (this.config.enableMonitoring) {
      this.initializeResourceMonitoring()
}
    
    // Initialize containerization if enabled
    if (this.config.enableContainerization) {
      this.initializeContainerization()
}
    
    this.isInitialized = true;
    this.emit('system:initialized')
}

  private setupWorkflows(): void {
    // Feature Development Workflow
    this.registerWorkflow({ id: 'feature-development',
      name: 'Feature Development Pipeline',
      description: 'Complete feature development from design to deployment',
      steps: [
        { id: 'design',
          agent: 'architect-agent',
          task: 'design-feature',
          parameters: { includeDatabase: true }
        },
        { id: 'backend-impl',
          agent: 'backend-agent',
          task: 'implement-api',
          dependsOn: ['design'],
          parameters: { framework: 'nextjs' }
        },
        { id: 'frontend-impl',
          agent: 'frontend-agent',
          task: 'implement-ui',
          dependsOn: ['design'],
          parameters: { framework: 'react' }
        },
        { id: 'type-check',
          agent: 'typescript-agent',
          task: 'analyze',
          dependsOn: ['backend-impl', 'frontend-impl']
        },
        { id: 'testing',
          agent: 'qa-agent',
          task: 'test',
          dependsOn: ['type-check'],
          onFailure: 'fix-issues'
        },
        { id: 'deploy',
          agent: 'devops-agent',
          task: 'deploy',
          dependsOn: ['testing'],
          parameters: { environment: 'staging' }
        }
      ]
    });

    // Bug Fix Workflow
    this.registerWorkflow({ id: 'bug-fix',
      name: 'Bug Fix Pipeline',
      description: 'Automated bug detection and fixing',
      steps: [
        { id: 'analyze-bug',
          agent: 'qa-agent',
          task: 'analyze',
          parameters: { deep: true }
        },
        { id: 'identify-fix',
          agent: 'self-healing-agent',
          task: 'diagnose',
          dependsOn: ['analyze-bug']
        },
        { id: 'apply-fix',
          agent: 'typescript-agent',
          task: 'fix',
          dependsOn: ['identify-fix'],
          retries: 3
        },
        { id: 'verify-fix',
          agent: 'qa-agent',
          task: 'test',
          dependsOn: ['apply-fix']
        }
      ]
    });

    // Deployment Workflow
    this.registerWorkflow({ id: 'deployment',
      name: 'Production Deployment',
      description: 'Safe production deployment with rollback',
      steps: [
        { id: 'pre-checks',
          agent: 'qa-agent',
          task: 'validate',
          parameters: { environment: 'production' }
        },
        { id: 'type-safety',
          agent: 'typescript-agent',
          task: 'analyze',
          dependsOn: ['pre-checks']
        },
        { id: 'backup',
          agent: 'devops-agent',
          task: 'backup',
          dependsOn: ['pre-checks']
        },
        { id: 'deploy-prod',
          agent: 'devops-agent',
          task: 'deploy',
          dependsOn: ['type-safety', 'backup'],
          parameters: { environment: 'production' },
          onFailure: 'rollback'
        },
        { id: 'health-check',
          agent: 'devops-agent',
          task: 'health-check',
          dependsOn: ['deploy-prod'],
          onFailure: 'rollback'
        },
        { id: 'rollback',
          agent: 'devops-agent',
          task: 'rollback',
          condition: 'context.deploymentFailed === true'
        }
      ]
    });

    // Code Quality Improvement Workflow
    this.registerWorkflow({ id: 'code-quality',
      name: 'Code Quality Enhancement',
      description: 'Improve code quality and fix issues',
      steps: [
        { id: 'analyze-quality',
          agent: 'qa-agent',
          task: 'analyzeCodeQuality',
          parameters: { targetPath: 'src' }
        },
        { id: 'fix-typescript',
          agent: 'typescript-agent',
          task: 'fix',
          dependsOn: ['analyze-quality'],
          parameters: { errorCodes: ['TS2339', 'TS2345', 'TS7006'] }
        },
        { id: 'refactor',
          agent: 'typescript-agent',
          task: 'refactor',
          dependsOn: ['fix-typescript'],
          parameters: { strict: true }
        },
        { id: 'final-test',
          agent: 'qa-agent',
          task: 'test',
          dependsOn: ['refactor']
        }
      ]    })
}

  private setupEventHandlers(): void {
    this.orchestrator.on('workflow:completed', (data) => {
      this.emit('workflow:completed', data)
};);

    this.orchestrator.on('workflow:failed', (data) => {
      this.emit('workflow:failed', data)
};);

    this.orchestrator.on('task:complete', (data) => {
      this.emit('task:complete', data)
};);

    this.orchestrator.on('agent:status', (data) => {
      this.emit('agent:status', data)
};);

    this.orchestrator.on('resources:throttled', (data) => {
      this.emit('system:throttled', data)    })
}

  public registerWorkflow(workflow: AgentWorkflow): void {
    this.workflows.set(workflow.id, workflow);
    this.emit('workflow:registered', workflow)
}

  public async executeWorkflow(workflowId: string, context: any = {}): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Agent system is not initialized')
}

    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`)
}

    return this.orchestrator.executeWorkflow(workflow, context)
}

  public async executeTask(agentId: string, taskType: string, payload: any): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Agent system is not initialized')
}

    return this.orchestrator.executeTask({ id: `task-${Date.now()}`,
      type: taskType;
      assignedTo: agentId;
      status: 'pending',
      priority: 'medium',
      payload,
      createdAt: new Date()   
    })
}

  public getMetrics() {
    return this.orchestrator?.getMetrics()
}

  public getAgents() {
    return this.orchestrator?.getAgents()
}

  public getWorkflows(): Map<string AgentWorkflow> {</string>
    return new Map(this.workflows)
}

  public async shutdown(): Promise<void> {
    if (this.orchestrator) {
      await this.orchestrator.shutdown()
}
    this.removeAllListeners();
    this.isInitialized = false
}

  // Convenience methods for common operations
  public async developFeature(description: string, requirements: any = {}): Promise<any> {
    return this.executeWorkflow('feature-development', {
      description,
      requirements,
      timestamp: new Date()   
    })
}

  public async fixBug(bugReport: any): Promise<any> {
    return this.executeWorkflow('bug-fix', {
      bugReport,
      timestamp: new Date()   
    })
}

  public async deployToProduction(version: string, config: any = {}): Promise<any> {
    return this.executeWorkflow('deployment', {
      version,
      config,
      timestamp: new Date()   
    })
}

  public async improveCodeQuality(targetPath: string = 'src'): Promise<any> {
    return this.executeWorkflow('code-quality', {
      targetPath,
      timestamp: new Date()   
    })
}

  // Initialize MCP integration
  private initializeMCP(): void {
    this.mcpIntegration = createMCPIntegration();
    this.mcpBridge = new AgentMCPBridge(this.mcpIntegration, { enabledServers: this.config.mcp?.servers || ['context7', 'sequential-thinking', 'serena'],
      autoConnect: true;
      cacheResponses: true
   
    });
    
    // Enhance agents with MCP capabilities
    const agents = this.orchestrator.getAgents();
    agents.forEach(agent => { const agentType = agent.getConfig().type;
      
      // Map agent types to MCP capabilities
      const capabilities: Record<string any> = { };</string>
      
      if (agentType === 'specialist') {
        capabilities.documentation = AGENT_MCP_CAPABILITIES.documentation;
        capabilities.reasoning = AGENT_MCP_CAPABILITIES.reasoning
}
      
      if (agent.getConfig() {.}id.includes('typescript')) {
        capabilities.semanticSearch = AGENT_MCP_CAPABILITIES.semanticSearch
}
      
      if (agent.getConfig() {.}id.includes('devops')) {
        capabilities.github = AGENT_MCP_CAPABILITIES.github
}
      
      if (Object.keys(capabilities) {.}length > 0) {
        enhanceAgentWithMCP(agent, this.mcpBridge, capabilities)
}
    });
    
    this.emit('mcp:initialized')
}
  
  // Initialize pulsed execution
  private initializePulsedExecution(): void {
    this.pulsedExecutor = new PulsedExecutor({ minInterval: 1000;
      maxInterval: 3000;
      adaptiveScaling: true;
      maxExecutionTime: 500
   
    });
    
    // Register all agents with pulsed executor
    const agents = this.orchestrator.getAgents();
    agents.forEach(agent => {
      this.pulsedExecutor!.registerAgent(agent)
};);
    
    // Start pulsed execution
    this.pulsedExecutor.start();
    
    this.emit('pulsed:execution:started')
}
  
  // Initialize resource monitoring
  private initializeResourceMonitoring(): void {
    this.resourceMonitor = new ResourceMonitor({ cpu: { warning: 70, critical: 85 },
      memory: { warning: 75, critical: 90 },
      diskSpace: { warning: 80, critical: 95 }
    });
    
    this.resourceMonitor.start();
    
    // Handle resource alerts
    this.resourceMonitor.on('alert', (alert) => {
      this.emit('resource:alert', alert);
      
      // Take action on critical alerts
      if (alert.level === 'critical') {
        this.handleCriticalResourceAlert(alert)
}
});
    
    this.emit('resource:monitoring:started')
}
  
  // Initialize containerization
  private async initializeContainerization(): Promise<void> {
    this.containerOrchestrator = new ContainerOrchestrator({ maxContainers: 10;
      baseImage: 'node:20-alpine',
      networkName: 'agent-network',
      enableHealthChecks: true
   
    });
    
    await this.containerOrchestrator.start();
    
    this.emit('containerization:started')
}
  
  // Handle critical resource alerts
  private handleCriticalResourceAlert(alert: any): void {
    if (alert.type === 'cpu' && this.pulsedExecutor) {
      // Increase pulse intervals to reduce CPU load
      this.pulsedExecutor.updateConfig({ minInterval: 2000;
        maxInterval: 5000   
    })
}
    
    if (alert.type === 'memory') {
      // Trigger garbage collection if possible
      if (global.gc) {
        global.gc()
}
      
      // Clear MCP cache
      if (this.mcpBridge) {
        this.mcpBridge.clearCache()
}
}
  
  // Deploy agent in container
  public async deployAgentInContainer(agentId: string): Promise<void> {
    if (!this.containerOrchestrator) {
      throw new Error('Containerization is not enabled')
}
    
    const agent = this.orchestrator.getAgents().get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`)
}
    
    await this.containerOrchestrator.deployAgent(agent)
}
  
  // Get system metrics
  public getSystemMetrics(): any {
    return { orchestration: this.orchestrator.getMetrics(, resources: this.resourceMonitor?.getLatestSnapshot(),
      containers: this.containerOrchestrator?.getStatus(, pulsedExecution: this.pulsedExecutor?.getResourceMetrics()
    }
}
  
  // MCP Integration
  public async connectMCP(servers: string[]): Promise<void> {
    if (!this.config.mcp?.enabled) {
      throw new Error('MCP is not enabled in configuration')
}

    if (!this.mcpIntegration) {
      this.initializeMCP()
}
    
    // Start specified servers
    for (const server of servers) {
      await this.mcpIntegration!.startServer(server)
}
    
    this.emit('mcp:connected', servers)
}
}

// Export singleton getter
export function getAgentSystem(config? null : AgentSystemConfig): AgentSystem {
  return AgentSystem.getInstance(config)
}
}}