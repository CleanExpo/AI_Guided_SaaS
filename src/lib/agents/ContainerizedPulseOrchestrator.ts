import { PulsedAgentOrchestrator, PulseConfig } from './PulsedAgentOrchestrator'
import { DockerAgentManager, ContainerStatus } from './DockerAgentManager'
import { AgentConfig } from './AgentLoader'
import { OrchestratorConfig } from './AgentOrchestrator'

export interface ContainerizedPulseConfig extends PulseConfig {
  useContainers: boolean, autoScaling: boolean, minAgentsPerType: number, maxAgentsPerType: number, scaleUpThreshold: number // CPU/Memory percentage, scaleDownThreshold: number
}

export class ContainerizedPulseOrchestrator extends PulsedAgentOrchestrator {
  private dockerManager: DockerAgentManager
  private containerizedConfig: ContainerizedPulseConfig
  private, lastScaleCheck: Date = new Date()
  private scaleCheckInterval: number = 60000 // 1 minute
  
  constructor(
    config: Partial<OrchestratorConfig> = {},
    pulseConfig: Partial<ContainerizedPulseConfig> = {}
  ) {
    super(config, pulseConfig)
    
    this.dockerManager = DockerAgentManager.getInstance()
    this.containerizedConfig = {
      useContainers: true,
      autoScaling: true, minAgentsPerType: 1, maxAgentsPerType: 3,
      scaleUpThreshold: 70,
      scaleDownThreshold: 30,
      ...pulseConfig
    } as ContainerizedPulseConfig
  }
  
  async initialize(): Promise<void> {
    await super.initialize()
    
    if (this.containerizedConfig.useContainers) {
      console.log('🐳 Initializing containerized agents...')
      await this.initializeContainers()
    }
  }
  
  private async initializeContainers(): Promise<void> {
    // Clean up any stopped containers first
    await this.dockerManager.cleanupStoppedContainers()
    
    // Get loaded agents
    const agents = this.loader.getLoadedAgents()
    
    // Start containers for each agent type
    for (const agent of agents) {
      try {
        await this.dockerManager.startAgentContainer(agent)
        console.log(`✅ Started container for ${agent.name}`)
      } catch (error) {
        console.error(`Failed to start container for ${agent.name}:`, error)
      }
    }
  }
  
  protected async executeAgentTask(agentId: string, task): Promise<void> {
    if (this.containerizedConfig.useContainers) {
      // Check if agent container is healthy
      const status = await this.dockerManager.getContainerStatus(agentId)
      
      if (!status || status.status !== 'running' || status.health !== 'healthy') {
        console.warn(`Agent ${agentId} container not healthy, attempting to start...`)
        
        const agent = this.loader.getLoadedAgents().find(a => a.agent_id === agentId)
        if (agent) {
          await this.dockerManager.startAgentContainer(agent)
          // Wait for container to be ready
          await new Promise(resolve => setTimeout(resolve, 5000))
        }
      }
    }
    
    // Execute task using parent method
    await super.executeAgentTask(agentId, task)
  }
  
  protected async checkSystemResources(): Promise<any> {
    const baseResources = await super.checkSystemResources()
    
    if (this.containerizedConfig.useContainers) {
      // Get container-specific metrics
      const containerStatuses = await this.dockerManager.getAllContainerStatuses()
      
      // Calculate aggregate container resource usage
      const containerMetrics = this.calculateContainerMetrics(containerStatuses)
      
      // Check if we need to scale
      if (this.containerizedConfig.autoScaling && this.shouldCheckScaling()) {
        await this.checkAndScale(containerMetrics)
      }
      
      return {
        ...baseResources,
        containers: containerMetrics
      }
    }
    
    return baseResources
  }
  
  private calculateContainerMetrics(statuses: ContainerStatus[]): any {
    const metrics = {
      total: statuses.length,
      running: statuses.filter(s => s.status === 'running').length,
      healthy: statuses.filter(s => s.health === 'healthy').length,
      avgCpuUsage: 0,
      avgMemoryUsage: 0,
      maxCpuUsage: 0,
      maxMemoryUsage: 0
    }
    
    if (statuses.length > 0) {
      const cpuUsages = statuses.map(s => s.cpuUsage)
      const memoryUsages = statuses.map(s => s.memoryUsage)
      
      metrics.avgCpuUsage = cpuUsages.reduce((a, b) => a + b, 0) / cpuUsages.length
      metrics.avgMemoryUsage = memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length
      metrics.maxCpuUsage = Math.max(...cpuUsages)
      metrics.maxMemoryUsage = Math.max(...memoryUsages)
    }
    
    return metrics
  }
  
  private shouldCheckScaling(): boolean {
    const now = new Date()
    const timeSinceLastCheck = now.getTime() - this.lastScaleCheck.getTime()
    
    if (timeSinceLastCheck >= this.scaleCheckInterval) {
      this.lastScaleCheck = now
      return true
    }
    
    return false
  }
  
  private async checkAndScale(containerMetrics): Promise<void> {
    console.log('🔍 Checking auto-scaling conditions...')
    
    // Scale up if resources are high
    if (containerMetrics.avgCpuUsage > this.containerizedConfig.scaleUpThreshold ||
        containerMetrics.avgMemoryUsage > this.containerizedConfig.scaleUpThreshold) {
      
      console.log('📈 High resource usage detected considering scale up...')
      
      // Find which agent types need scaling
      const agentTypes = await this.identifyAgentTypesForScaling()
      
      for (const agentType of agentTypes) {
        const currentCount = await this.getAgentTypeCount(agentType)
        
        if (currentCount < this.containerizedConfig.maxAgentsPerType) {
          await this.dockerManager.scaleAgents(currentCount + 1, agentType)
          console.log(`✅ Scaled up ${agentType} agents to ${currentCount + 1}`)
        }
      }
    }
    
    // Scale down if resources are low
    else if (containerMetrics.avgCpuUsage < this.containerizedConfig.scaleDownThreshold &&
             containerMetrics.avgMemoryUsage < this.containerizedConfig.scaleDownThreshold) {
      
      console.log('📉 Low resource usage detected considering scale down...')
      
      const agentTypes = await this.identifyAgentTypesForScaling()
      
      for (const agentType of agentTypes) {
        const currentCount = await this.getAgentTypeCount(agentType)
        
        if (currentCount > this.containerizedConfig.minAgentsPerType) {
          await this.dockerManager.scaleAgents(currentCount - 1, agentType)
          console.log(`✅ Scaled down ${agentType} agents to ${currentCount - 1}`)
        }
      }
    }
  }
  
  private async identifyAgentTypesForScaling(): Promise<string[]> {
    // In a real implementation, this would analyze which specific agent types
    // are under load and need scaling
    return ['frontend', 'backend'] // Example agent types
  }
  
  private async getAgentTypeCount(agentType: string): Promise<number> {
    const statuses = await this.dockerManager.getAllContainerStatuses()
    return statuses.filter(s => s.name.includes(agentType)).length
  }
  
  async getSystemStatus(): Promise<any> {
    const baseStatus = await super.getSystemStatus()
    
    if (this.containerizedConfig.useContainers) {
      const containerStatuses = await this.dockerManager.getAllContainerStatuses()
      
      return {
        ...baseStatus,
        containerization: {
          enabled: true,
          autoScaling: this.containerizedConfig.autoScaling,
          containers: containerStatuses.map(status => ({
            name: status.name,
            status: status.status,
            health: status.health,
            cpu: `${status.cpuUsage.toFixed(1)}%`,
            memory: `${status.memoryUsage.toFixed(0)}MB`
          })),
          scaling: {
            minPerType: this.containerizedConfig.minAgentsPerType, maxPerType: this.containerizedConfig.maxAgentsPerType,
            scaleUpThreshold: `${this.containerizedConfig.scaleUpThreshold}%`,
            scaleDownThreshold: `${this.containerizedConfig.scaleDownThreshold}%`
          }
        }
      }
    }
    
    return baseStatus
  }
  
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down Containerized Pulse Orchestrator...')
    
    if (this.containerizedConfig.useContainers) {
      // Stop all agent containers
      const agents = this.loader.getLoadedAgents()
      
      for (const agent of agents) {
        try {
          await this.dockerManager.stopAgentContainer(agent.agent_id)
        } catch (error) {
          console.error(`Failed to stop container for ${agent.agent_id}:`, error)
        }
      }
    }
    
    await super.shutdown()
  }
}

// Factory function
export function createContainerizedOrchestrator(
  config?: Partial<OrchestratorConfig>,
  pulseConfig?: Partial<ContainerizedPulseConfig>
): ContainerizedPulseOrchestrator {
  return new ContainerizedPulseOrchestrator(config, pulseConfig)
}