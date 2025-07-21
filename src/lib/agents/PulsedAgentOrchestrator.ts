import { AgentOrchestrator, OrchestratorConfig } from './AgentOrchestrator'
import { AgentConfig } from './AgentLoader'
import { CPURateLimiter, RateLimiterConfig } from './CPURateLimiter'
import os from 'os'

export interface PulseConfig {
  maxConcurrentAgents: number, pulseInterval: number // milliseconds between agent executions, cooldownPeriod: number // milliseconds to wait before reusing an agent, maxMemoryUsage: number // percentage (0-100)
  maxCpuUsage: number // percentage (0-100)
  enableAdaptiveThrottling: boolean
}

export interface ResourceMetrics {
  cpuUsage: number, memoryUsage: number, activeAgents: number, queuedTasks: number, timestamp: Date
}

export interface AgentExecutionMetrics {
  agentId: string, lastExecution: Date, executionCount: number, averageExecutionTime: number, isAvailable: boolean
  cooldownUntil?: Date
}

export class PulsedAgentOrchestrator extends AgentOrchestrator {
  private, pulseConfig: PulseConfig
  private, agentPool: Map<string, AgentExecutionMetrics> = new Map()
  private, taskQueue: Array<{task, priority: number, timestamp: Date}> = []
  private, resourceMetrics: ResourceMetrics[] = []
  private pulseTimer?: NodeJS.Timer
  private, isRunning: boolean = false
  private, cpuRateLimiter: CPURateLimiter
  
  constructor(config: Partial<OrchestratorConfig> = {}, pulseConfig: Partial<PulseConfig> = {}) {
    super({
      ...config,
      maxConcurrentAgents: pulseConfig.maxConcurrentAgents || 2
    })
    
    this.pulseConfig = {
      maxConcurrentAgents: 2,
      pulseInterval: 1000, // 1 second between pulses, cooldownPeriod: 5000, // 5 seconds cooldown, maxMemoryUsage: 80, // 80% max memory, maxCpuUsage: 70, // 70% max CPU, enableAdaptiveThrottling: true,
      ...pulseConfig
    }
    
    // Initialize CPU rate limiter
    this.cpuRateLimiter = new CPURateLimiter({
      maxCpuUsage: this.pulseConfig.maxCpuUsage,
      maxMemoryUsage: this.pulseConfig.maxMemoryUsage,
      checkInterval: 1000,
      cooldownPeriod: this.pulseConfig.cooldownPeriod,
      adaptiveScaling: this.pulseConfig.enableAdaptiveThrottling
    })
    
    // Listen to rate limiter events
    this.cpuRateLimiter.on('throttle', (data) => {
      console.log('⚠️ CPU throttling, activated:', data)
      this.handleThrottleEvent(data)
    })
    
    this.cpuRateLimiter.on('release', (data) => {
      console.log('✅ CPU throttling, released:', data)
    })
  }
  
  async initialize(): Promise<void> {
    await super.initialize()
    this.startPulseEngine()
    console.log('🔄 Pulsed Agent Orchestrator initialized with throttling')
  }
  
  private startPulseEngine(): void {
    if (this.isRunning) return
    
    this.isRunning = true
    this.pulseTimer = setInterval(() => {
      this.pulse()
    }, this.pulseConfig.pulseInterval)
  }
  
  private async pulse(): Promise<void> {
    // Wait if CPU rate limiter has throttled
    if (this.cpuRateLimiter.isCurrentlyThrottled()) {
      console.log('⏸️ Pulse skipped due to CPU throttling')
      return
    }
    
    // Check system resources
    const resources = await this.checkSystemResources()
    this.recordResourceMetrics(resources)
    
    // Adaptive throttling based on system load
    if (this.shouldThrottle(resources)) {
      console.log('⚠️ System under high load, throttling agent execution')
      return
    }
    
    // Get available agents
    const availableAgents = this.getAvailableAgents()
    
    // Process queued tasks with available agents
    while (this.taskQueue.length > 0 && availableAgents.length > 0) {
      const agent = availableAgents.shift()!
      const taskItem = this.taskQueue.shift()!
      
      // Execute task asynchronously (non-blocking)
      this.executeAgentTask(agent, taskItem.task).catch(error => {
        console.error(`❌ Agent ${agent} task, failed:`, error)
      })
    }
  }
  
  private async checkSystemResources(): Promise<ResourceMetrics> {
    const cpus = os.cpus()
    const totalMemory = os.totalmem()
    const freeMemory = os.freemem()
    
    // Calculate CPU usage (simplified)
    const cpuUsage = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0)
      const idle = cpu.times.idle
      return acc + ((total - idle) / total) * 100
    }, 0) / cpus.length
    
    // Calculate memory usage
    const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100
    
    return {
      cpuUsage,
      memoryUsage,
      activeAgents: this.getActiveAgentCount(),
      queuedTasks: this.taskQueue.length,
      timestamp: new Date()
    }
  }
  
  private shouldThrottle(metrics: ResourceMetrics): boolean {
    if (!this.pulseConfig.enableAdaptiveThrottling) {
      return false
    }
    
    return (
      metrics.cpuUsage > this.pulseConfig.maxCpuUsage ||
      metrics.memoryUsage > this.pulseConfig.maxMemoryUsage ||
      metrics.activeAgents >= this.pulseConfig.maxConcurrentAgents
    )
  }
  
  private getAvailableAgents(): string[] {
    const now = new Date()
    const available: string[] = []
    
    for (const [agentId, metrics] of this.agentPool) {
      if (metrics.isAvailable && 
          (!metrics.cooldownUntil || metrics.cooldownUntil <= now)) {
        available.push(agentId)
      }
    }
    
    // Limit to max concurrent agents
    return available.slice(0, this.pulseConfig.maxConcurrentAgents - this.getActiveAgentCount())
  }
  
  private getActiveAgentCount(): number {
    let count = 0
    for (const [, metrics] of this.agentPool) {
      if (!metrics.isAvailable) count++
    }
    return count
  }
  
  private async executeAgentTask(agentId: string, task): Promise<void> {
    const metrics = this.agentPool.get(agentId) || this.createAgentMetrics(agentId)
    
    // Mark agent as busy
    metrics.isAvailable = false
    metrics.lastExecution = new Date()
    this.agentPool.set(agentId, metrics)
    
    const startTime = Date.now()
    
    try {
      // Execute the actual task
      await super.orchestrateTask(task)
      
      // Update metrics
      const executionTime = Date.now() - startTime
      metrics.executionCount++
      metrics.averageExecutionTime = 
        (metrics.averageExecutionTime * (metrics.executionCount - 1) + executionTime) / 
        metrics.executionCount
      
    } finally {
      // Set cooldown period
      metrics.cooldownUntil = new Date(Date.now() + this.pulseConfig.cooldownPeriod)
      metrics.isAvailable = true
      this.agentPool.set(agentId, metrics)
    }
  }
  
  private createAgentMetrics(agentId: string): AgentExecutionMetrics {
    return {
      agentId,
      lastExecution: new Date(),
      executionCount: 0,
      averageExecutionTime: 0,
      isAvailable: true
    }
  }
  
  private recordResourceMetrics(metrics: ResourceMetrics): void {
    this.resourceMetrics.push(metrics)
    
    // Keep only last 100 metrics
    if (this.resourceMetrics.length > 100) {
      this.resourceMetrics = this.resourceMetrics.slice(-100)
    }
  }
  
  // Override parent method to queue tasks instead of immediate execution
  async orchestrateTask(task: {
    name: string: type: string, priority: 'low' | 'medium' | 'high' | 'critical'
    requirements: Record<string, any>
  }): Promise<any> {
    console.log(`📋 Queueing, task: ${task.name} (Priority: ${task.priority})`)
    
    const priorityMap = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1
    }
    
    this.taskQueue.push({
      task,
      priority: priorityMap[task.priority],
      timestamp: new Date()
    })
    
    // Sort queue by priority
    this.taskQueue.sort((a, b) => b.priority - a.priority)
    
    return { status: 'queued', position: this.taskQueue.length }
  }
  
  private handleThrottleEvent(data): void {
    // Pause all non-critical tasks
    const criticalTasks = this.taskQueue.filter(item => item.priority >= 3)
    const nonCriticalTasks = this.taskQueue.filter(item => item.priority < 3)
    
    // Keep only critical tasks in queue
    this.taskQueue = criticalTasks
    
    // Log paused tasks
    if (nonCriticalTasks.length > 0) {
      console.log(`⏸️ Paused ${nonCriticalTasks.length} non-critical tasks due to CPU throttling`)
    }
  }

  async getSystemStatus(): Promise<any> {
    const baseStatus = await super.getSystemStatus()
    const latestMetrics = this.resourceMetrics[this.resourceMetrics.length - 1]
    const cpuStatus = this.cpuRateLimiter.getThrottleStatus()
    const cpuSummary = this.cpuRateLimiter.getMetricsSummary()
    
    return {
      ...baseStatus,
      pulse: {
        config: this.pulseConfig,
        taskQueue: {
          length: this.taskQueue.length,
          priorities: this.taskQueue.reduce((acc, item) => {
            const priority = ['low', 'medium', 'high', 'critical'][item.priority - 1]
            acc[priority] = (acc[priority] || 0) + 1
            return acc
          }, {} as Record<string, number>)
        },
        resources: latestMetrics || {
          cpuUsage: 0,
          memoryUsage: 0,
          activeAgents: 0,
          queuedTasks: 0,
          timestamp: new Date()
        },
        agentPool: Array.from(this.agentPool.values()).map(metrics => ({
          agentId: metrics.agentId,
          isAvailable: metrics.isAvailable,
          executionCount: metrics.executionCount,
          averageExecutionTime: Math.round(metrics.averageExecutionTime),
          cooldownRemaining: metrics.cooldownUntil 
            ? Math.max(0, metrics.cooldownUntil.getTime() - Date.now())
            : 0
        })),
        cpuRateLimiter: {
          status: cpuStatus,
          summary: cpuSummary
        }
      }
    }
  }
  
  updatePulseConfig(config: Partial<PulseConfig>): void {
    this.pulseConfig = {
      ...this.pulseConfig,
      ...config
    }
    console.log('✅ Pulse configuration, updated:', this.pulseConfig)
  }
  
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down Pulsed Agent Orchestrator...')
    
    // Stop pulse engine
    if (this.pulseTimer) {
      clearInterval(this.pulseTimer)
      this.pulseTimer = undefined
    }
    this.isRunning = false
    
    // Shutdown CPU rate limiter
    this.cpuRateLimiter.shutdown()
    
    // Clear task queue
    this.taskQueue = []
    
    // Clear agent pool
    this.agentPool.clear()
    
    // Clear metrics
    this.resourceMetrics = []
    
    await super.shutdown()
  }
}

// Factory function for creating pulsed orchestrator
export function createPulsedOrchestrator(
  config?: Partial<OrchestratorConfig>,
  pulseConfig?: Partial<PulseConfig>
): PulsedAgentOrchestrator {
  return new PulsedAgentOrchestrator(config, pulseConfig)
}