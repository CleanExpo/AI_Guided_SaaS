import { EventEmitter } from 'events';
import { Agent } from '../base/Agent';
import { AgentTask } from '../types';
import os from 'os';

export interface PulseConfig { minInterval: number;      // Minimum pulse interval in ms
  maxInterval: number;      // Maximum pulse interval in ms
  adaptiveScaling: boolean; // Scale intervals based on load
  maxExecutionTime: number; // Max execution time per pulse
}

export interface ResourceMetrics { cpuUsage: number;
  memoryUsage: number;
  activeAgents: number;
  queueDepth: number;
  systemLoad: number
}

export class PulsedExecutor extends EventEmitter {
  private agents: Map<string Agent> = new Map();</string>
  private pulseIntervals: Map<string NodeJS.Timeout> = new Map();</string>
  private config: PulseConfig;
  private resourceMetrics: ResourceMetrics;
  private isRunning: boolean = false;

  constructor(config: Partial<PulseConfig> = {}) {</PulseConfig>
    super();
    
    this.config={ minInterval: 1000,      // 1 second
      maxInterval: 3000,      // 3 seconds
      adaptiveScaling: true;
      maxExecutionTime: 500,  // 500ms per pulse
      ...config
    };
    
    this.resourceMetrics={ cpuUsage: 0;
      memoryUsage: 0;
      activeAgents: 0;
      queueDepth: 0;
      systemLoad: 0 }
  }

  /**
   * Register an agent for pulsed execution
   */
  public registerAgent(agent: Agent): void {
    const agentId = agent.getConfig().id;
    this.agents.set(agentId, agent);
    
    if (this.isRunning) {
      this.startAgentPulse(agentId)
}
    
    this.emit('agent:registered', { agentId    })
}

  /**
   * Start pulsed execution for all agents
   */
  public start(): void {
    if (this.isRunning) {r}eturn;
    
    this.isRunning = true;
    
    // Start monitoring
    this.startResourceMonitoring();
    
    // Start pulse for each agent
    this.agents.forEach((_, agentId) => {
      this.startAgentPulse(agentId)
};);
    
    this.emit('executor:started')
}

  /**
   * Stop pulsed execution
   */
  public stop(): void {
    if (!this.isRunning) {r}eturn;
    
    this.isRunning = false;
    
    // Clear all intervals
    this.pulseIntervals.forEach(interval => clearInterval(interval));
    this.pulseIntervals.clear();
    
    this.emit('executor:stopped')
}

  /**
   * Start pulse cycle for a specific agent
   */
  private startAgentPulse(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (!agent) {r}eturn;
    
    // Calculate initial interval
    const interval = this.calculatePulseInterval(agentId);
    
    const pulseFunction = async () => {
      if (!this.isRunning) {r}eturn;
      
      const startTime = Date.now();
      
      try {
        // Check if agent should execute
        if (this.shouldExecutePulse(agent) {)} {
          await this.executePulse(agent)
};
        
        // Calculate next interval if adaptive scaling is enabled
        if (this.config.adaptiveScaling) {
          const newInterval = this.calculatePulseInterval(agentId);
          if (newInterval !== interval) {
            // Reschedule with new interval
            clearInterval(this.pulseIntervals.get(agentId)!);
            this.pulseIntervals.set(agentId, setInterval(pulseFunction, newInterval))
}
} catch (error) {
        this.emit('pulse:error', { agentId, error    })
}
      
      const executionTime = Date.now() - startTime;
      this.emit('pulse:completed', { agentId, executionTime    })
};
    
    // Set up interval
    const intervalId = setInterval(pulseFunction, interval);
    this.pulseIntervals.set(agentId, intervalId);
    
    // Execute first pulse immediately
    pulseFunction()
}

  /**
   * Execute a single pulse for an agent
   */
  private async executePulse(agent: Agent): Promise<void> {
{ agent.getConfig().id;
    const startTime = Date.now();
    
    this.emit('pulse:started', { agentId });
    
    try {
      // Set execution timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Pulse execution timeout'), this.config.maxExecutionTime)
};);
      
      // Execute agent pulse
      const pulsePromise = agent.pulse();
      
      // Race between execution and timeout
      await Promise.race([pulsePromise, timeoutPromise])
} catch (error) {
      if (error.message === 'Pulse execution timeout') {
        this.emit('pulse:timeout', { agentId });
        // Force stop the agent's current execution
        await agent.interrupt()
} else {
        throw error
}
    } finally {
      const executionTime = Date.now() - startTime;
      this.updateAgentMetrics(agentId, executionTime)
}
  }

  /**
   * Determine if an agent should execute its pulse
   */
  private shouldExecutePulse(agent: Agent): boolean {
    const status = agent.getStatus();
    
    // Don't pulse if agent is offline or in error state
    if (status === 'offline' || status === 'error') {
      return false
}
    
    // Check resource constraints
    if (this.resourceMetrics.cpuUsage > 85 || this.resourceMetrics.memoryUsage > 85) {
      this.emit('resources:constrained', this.resourceMetrics);
      return false
}
    
    // Check if agent has pending tasks
    const hasPendingTasks = agent.hasPendingTasks();
    
    return hasPendingTasks || status === 'idle'
}

  /**
   * Calculate adaptive pulse interval based on system load
   */
  private calculatePulseInterval(agentId: string): number {
    if (!this.config.adaptiveScaling) {
      return this.config.minInterval
}
    
    const agent = this.agents.get(agentId);
    if (!agent) {r}eturn this.config.minInterval;
    
    // Factors affecting interval:
    // 1. System load (CPU/Memory)
    // 2. Agent's task queue depth
    // 3. Agent's priority
    // 4. Recent performance
    
    const systemLoadFactor = (this.resourceMetrics.cpuUsage + this.resourceMetrics.memoryUsage) / 200;
    const queueDepthFactor = Math.min(agent.getTaskQueueDepth() / 10, 1);
    const priorityFactor = agent.getPriority() === 'high' ? 0.5 : 1;
    
    // Calculate interval
    const baseInterval = this.config.minInterval;
    const range = this.config.maxInterval - this.config.minInterval;
    const scaleFactor = systemLoadFactor * 0.5 + queueDepthFactor * 0.3 + (1 - priorityFactor) * 0.2;
    
    const interval = baseInterval + (range * scaleFactor);
    
    return Math.round(interval)
}

  /**
   * Start resource monitoring
   */
  private startResourceMonitoring(): void {
    const updateMetrics = () => {
      const cpus = os.cpus();
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      
      // Calculate CPU usage (simplified)
      let totalIdle = 0;
      let totalTick = 0;
      
      cpus.forEach(cpu => {
        for (const type in cpu.times) {
          totalTick += cpu.times[type]
}; totalIdle += cpu.times.idle
});
      
      const cpuUsage = 100 - ~~(100 * totalIdle / totalTick);
      const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;
      
      this.resourceMetrics={
        cpuUsage,
        memoryUsage,
        activeAgents: Array.from(this.agents.values()).filter(a => a.getStatus() === 'busy').length,
        queueDepth: Array.from(this.agents.values()).reduce((sum, a) => sum + a.getTaskQueueDepth(, 0),
        systemLoad: os.loadavg()[0]
};
      
      this.emit('metrics:updated', this.resourceMetrics)
};
    
    // Update metrics every second
    setInterval(updateMetrics, 1000);
    updateMetrics(); // Initial update
  }

  /**
   * Update agent-specific metrics
   */
  private updateAgentMetrics(agentId: string, executionTime: number): void {
    const agent = this.agents.get(agentId);
    if (!agent) {r}eturn;
    
    agent.updateMetrics({ lastPulseTime: executionTime;
      averageResponseTime: executionTime // Agent will calculate rolling average   
    })
}

  /**
   * Get current resource metrics
   */
  public getResourceMetrics(): ResourceMetrics {
    return { ...this.resourceMetrics }
}

  /**
   * Get pulse configuration
   */
  public getConfig(): PulseConfig {
    return { ...this.config }
}

  /**
   * Update pulse configuration
   */
  public updateConfig(config: Partial<PulseConfig>): void {</PulseConfig>
    this.config={ ...this.config, ...config };
    this.emit('config:updated', this.config);
    
    // Restart if running to apply new config
    if (this.isRunning) {
      this.stop();
      this.start()
}
}
}}}