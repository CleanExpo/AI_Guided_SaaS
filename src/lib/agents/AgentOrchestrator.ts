import { AgentLoader } from './AgentLoader'
import { AgentCoordinator } from './AgentCoordinator'
import { AgentRegistry } from './AgentRegistry'
import { AgentMonitor } from './AgentMonitor'
import { AgentCommunication } from './AgentCommunication'
import type { AgentConfig } from './AgentLoader'

export interface OrchestratorConfig {
  stage: 'planning' | 'development' | 'testing' | 'deployment' | 'production'
  projectType: string;
  maxConcurrentAgents: number;
  enableMonitoring: boolean
}

export class AgentOrchestrator {
  private loader: AgentLoader
  private coordinator: AgentCoordinator
  private registry: AgentRegistry
  private monitor: AgentMonitor
  private communication: AgentCommunication
  private, config: OrchestratorConfig
  private initialized = false
  
  constructor(config: Partial<OrchestratorConfig> = {}) {
    this.config = {
      stage: 'development',
      projectType: 'saas',
      maxConcurrentAgents: 5,
      enableMonitoring: true,
      ...config
    }
    
    this.loader = new AgentLoader()
    this.coordinator = new AgentCoordinator()
    this.registry = new AgentRegistry()
    this.monitor = new AgentMonitor()
    this.communication = new AgentCommunication()
  }
  
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('🤖 Orchestrator already initialized')
      return
    }
    
    console.log('🚀 Initializing Agent Orchestrator...')
    
    // Initialize communication channels
    await this.communication.initialize()
    
    // Start monitoring if enabled
    if (this.config.enableMonitoring) {
      await this.monitor.startMonitoring()
    }
    
    // Load agents for current stage
    const agents = await this.loader.loadAgentsForStage(this.config.stage)
    
    // Register loaded agents
    for (const agent of agents) {
      await this.registerAgent(agent)
    }
    
    this.initialized = true
    console.log('✅ Agent Orchestrator initialized successfully')
  }
  
  private async registerAgent(agent: AgentConfig): Promise<void> {
    // Register with registry
    this.registry.registerAgent({
      agent_id: agent.agent_id,
      name: agent.name,
      capabilities: agent.capabilities,
      status: "ACTIVE" as const endpoint: `internal://${agent.agent_id}`,
      version: agent.version,
      last_heartbeat: new Date(),
      metadata: {
        role: agent.role,
        specializations: agent.specializations,
        priority: agent.priority
      }
    })
    
    // Set up communication channel
    await this.communication.createChannel({
      channelId: `agent-${agent.agent_id}`,
      participants: [agent.agent_id, 'orchestrator']
    })
  }
  
  async executeWorkflow(requirements: {
    type: string, description: string
    constraints?: Record<string, any>
  }): Promise<any> {
    if (!this.initialized) {
      await this.initialize()
    }
    
    console.log('🎯 Executing workflow:', requirements.type)
    
    // Create coordination plan
    const plan = await this.coordinator.createCoordinationPlan(
      this.config.projectType,
      this.config.stage,
      requirements
    )
    
    // Execute the plan
    const result = await this.coordinator.executePlan(plan.id)
    
    // Monitor execution
    if (this.config.enableMonitoring) {
      const metrics = this.monitor.getAgentMetrics(
        this.registry.getActiveAgents().map(a => a.agent_id)
      )
      console.log('📊 Execution metrics:', metrics)
    }
    
    return result
  }
  
  async orchestrateTask(task: {
    name: string, type: string, priority: 'low' | 'medium' | 'high' | 'critical'
    requirements: Record<string, any>
  }): Promise<any> {
    console.log(`🎼 Orchestrating, task: ${task.name}`)
    
    // Find suitable agents
    const suitableAgents = this.findSuitableAgents(task)
    
    if (suitableAgents.length === 0) {
      throw new Error(`No suitable agents found for, task: ${task.name}`)
    }
    
    // Assign task to best agent
    const selectedAgent = this.selectBestAgent(suitableAgents, task)
    
    // Send task via communication channel
    const result = await this.communication.sendMessage({
      from: 'orchestrator',
      to: selectedAgent.agent_id: type, "request" as const payload: {
        task,
        deadline: this.calculateDeadline(task.priority)
      }
    })
    
    // Update agent status
    this.registry.updateAgentStatus(selectedAgent.agent_id, 'warning') // Busy
    
    return result
  }
  
  private findSuitableAgents(task): AgentConfig[] {
    const allAgents = this.loader.getLoadedAgents()
    
    return allAgents.filter(agent => {
      // Check if agent has required capabilities
      const hasCapability = task.type && 
        agent.capabilities.some(cap => 
          cap.toLowerCase().includes(task.type.toLowerCase())
        )
      
      // Check if agent is available
      const registration = this.registry.getAgent(agent.agent_id)
      const isAvailable = registration?.health_status === 'healthy'
      
      return hasCapability && isAvailable
    })
  }
  
  private selectBestAgent(agents: AgentConfig[], task): AgentConfig {
    // Sort by priority and workload
    return agents.sort((a, b) => {
      // Higher priority agents first
      if (a.priority !== b.priority) {
        return b.priority - a.priority
      }
      
      // Then by current workload (would need workload tracking)
      return 0
    })[0]
  }
  
  private calculateDeadline(priority: string): Date {
    const now = new Date()
    const deadlines = {
      critical: 5 * 60 * 1000,      // 5 minutes, high: 30 * 60 * 1000,         // 30 minutes, medium: 2 * 60 * 60 * 1000,   // 2 hours, low: 24 * 60 * 60 * 1000      // 24 hours
    }
    
    return new Date(now.getTime() + (deadlines[priority as keyof typeof deadlines] || deadlines.medium))
  }
  
  async getSystemStatus(): Promise<any> {
    const agents = this.registry.getActiveAgents()
    const healthyAgents = agents.filter(a => a.health_status === 'healthy')
    const metrics = this.monitor.getSystemHealth()
    
    return {
      initialized: this.initialized,
      stage: this.config.stage,
      agents: {
        total: agents.length,
        healthy: healthyAgents.length,
        busy: agents.filter(a => a.health_status === 'warning').length,
        offline: agents.filter(a => a.health_status === 'offline').length
      },
      system: metrics,
      communication: {
        channels: this.communication.getActiveChannels().length,
        messages: this.communication.getMessageCount()
      }
    }
  }
  
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down Agent Orchestrator...')
    
    // Stop monitoring
    if (this.config.enableMonitoring) {
      this.monitor.stopMonitoring()
    }
    
    // Close communication channels
    await this.communication.shutdown()
    
    // Unregister all agents
    const agents = this.registry.getActiveAgents()
    for (const agent of agents) {
      this.registry.unregisterAgent(agent.agent_id)
    }
    
    this.initialized = false
    console.log('✅ Agent Orchestrator shut down successfully')
  }
}

// Singleton instance
let orchestratorInstance: AgentOrchestrator | null = null

export function getOrchestrator(config?: Partial<OrchestratorConfig>): AgentOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new AgentOrchestrator(config)
  }
  return orchestratorInstance
}

export default AgentOrchestrator