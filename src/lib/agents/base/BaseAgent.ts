import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { 
import { logger } from '@/lib/logger';
  AgentConfig, 
  AgentMessage, 
  AgentTask, 
  AgentState, 
  AgentStatus, 
  AgentMetrics,
  AgentLogger,
  AgentCommunicationChannel
} from '../types';

export abstract class BaseAgent extends EventEmitter {
  protected config: AgentConfig;
  protected state: AgentState;
  protected logger: AgentLogger;
  protected communication?: AgentCommunicationChannel;
  
  constructor(config: Partial<AgentConfig>) {</AgentConfig>
    super();
    
    this.config={ id: config.id || `agent-${uuidv4()}`,
      name: config.name || 'Unnamed Agent',
      type: config.type || 'core',
      version: config.version || '1.0.0',
      description: config.description,
      capabilities: config.capabilities || [],
      resources: config.resources || { cpu: 1024;
        memory: '512MB',
        timeout: 300000
      },
      dependencies: config.dependencies || []
    };
    
    this.state={ id: this.config.id,
      status: 'initializing',
      taskQueue: [],
      metrics: this.initializeMetrics(, startTime: new Date()
    };
    
    this.logger = this.createLogger()
}
  
  private initializeMetrics(): AgentMetrics {
    return { agentId: this.config.id,
      status: 'offline',
      tasksCompleted: 0;
      tasksFailed: 0;
      averageResponseTime: 0;
      successRate: 0;
      cpuUsage: 0;
      memoryUsage: 0;
      lastHeartbeat: new Date(), uptime: 0 }
  }
  
  private createLogger(): AgentLogger {
    const prefix = `[${this.config.name}]`;
    
    return { info: (message: string, data? null : any) => {
        
        this.emit('log:info', { message, data    })
},
      warn: (message: string, data? null : any) => {
        
        this.emit('log:warn', { message, data    })
},
      error: (message: string, error? null : any) => {
        
        this.emit('log:error', { message, error    })
},
      debug: (message: string, data? null : any) =>  {
        if (process.env.DEBUG || "") {;
          }
        this.emit('log:debug', { message, data    })
}
    }
}
  
  public async initialize(): Promise<void> {
    this.logger.info('Initializing agent');
    
    try {
      await this.onInitialize();
      this.state.status = 'ready';
      this.emit('agent:ready', { agentId: this.config.id   )
    })
} catch (error) {
      this.state.status = 'error';
      this.state.lastError = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Failed to initialize agent', error);
      throw error
}
  }
  
  protected abstract onInitialize(): Promise<void></void>
  
  public async processMessage(message: AgentMessage): Promise<any> {
    this.logger.debug('Processing message', message);
    
    try {
      const result = await this.onMessage(message);
      this.emit('message:processed', { message, result });
      return result
} catch (error) {
      this.logger.error('Failed to process message', error);
      throw error
}
  }
  
  protected abstract onMessage(message: AgentMessage): Promise<any></any>
  
  public async executeTask(task: AgentTask): Promise<void> {
    if (this.state.status !== 'ready') {
      throw new Error(`Agent is not ready (status: ${this.state.status})`)
}
    
    this.state.currentTask = task;
    this.state.status = 'busy';
    task.status = 'in_progress';
    task.startedAt = new Date();
    
    this.logger.info(`Executing task ${task.id} (type: ${task.type})`);
    
    try {
      const result = await this.onTask(task);
      
      task.status = 'completed';
      task.result = result;
      task.completedAt = new Date();
      
      this.updateTaskMetrics(task, true);
      
      this.emit('task:complete', { task, result    })
} catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      task.completedAt = new Date();
      
      this.updateTaskMetrics(task, false);
      
      this.logger.error(`Task ${task.id} failed`, error);
      this.emit('task:failed', { task, error });
      
      throw error
} finally {
      this.state.currentTask = undefined;
      this.state.status = 'ready'
}
  }
  
  protected abstract onTask(task: AgentTask): Promise<any></any>
  
  private updateTaskMetrics(task: AgentTask, success: boolean): void {
    const duration = task.completedAt!.getTime() - task.startedAt!.getTime();
    
    if (success) {
      this.state.metrics.tasksCompleted++
} else {
      this.state.metrics.tasksFailed++
}
    
    // Update average response time
    const totalTasks = this.state.metrics.tasksCompleted + this.state.metrics.tasksFailed;
    this.state.metrics.averageResponseTime = 
      (this.state.metrics.averageResponseTime * (totalTasks - 1) + duration) / totalTasks;
    
    // Update success rate
    this.state.metrics.successRate = 
      (this.state.metrics.tasksCompleted / totalTasks) * 100;
    
    // Update status
    this.state.metrics.status = this.state.status as any;
    this.state.metrics.currentTask = task.type
}
  
  public async stop(): Promise<void> {
    this.state.status = 'shutting_down';
    this.emit('agent:stopping', { agentId: this.config.id)
    });
    
    // Clear task queue
    this.state.taskQueue = [];
    
    // Wait for current task to complete
    if (this.state.currentTask) {
      this.logger.info('Waiting for current task to complete');
      // Implementation depends on specific agent
    }
    
    await this.onStop();
    
    this.state.status = 'offline';
    this.emit('agent:stopped', { agentId: this.config.id   )
    })
}
  
  protected abstract onStop(): Promise<void></void>
  
  /**
   * Execute a pulse - used by PulsedExecutor
   */
  public async pulse(): Promise<void> {
    if (this.state.status !== 'ready' && this.state.status !== 'busy') {
      return
}
    
    // Process one task from the queue
    if (this.state.taskQueue.length > 0 && this.state.status === 'ready') {
      const task = this.state.taskQueue.shift()!;
      await this.executeTask(task)
}
    
    // Update heartbeat
    this.updateMetrics({ lastHeartbeat: new Date()   
    })
}
  
  /**
   * Interrupt current execution - used by PulsedExecutor
   */
  public async interrupt(): Promise<void> {
    if (this.state.currentTask) {
      this.logger.warn(`Interrupting task ${this.state.currentTask.id}`);
      // Implementation depends on specific agent type
      await this.onInterrupt()
}
  }
  
  protected async onInterrupt(): Promise<void> {
    // Override in specific agents
  }
  
  /**
   * Add task to queue
   */
  public queueTask(task: AgentTask): void {
    this.state.taskQueue.push(task);
    this.emit('task:queued', { task    })
}
  
  /**
   * Check if agent has pending tasks
   */
  public hasPendingTasks(): boolean {
    return this.state.taskQueue.length > 0 || this.state.currentTask !== undefined
}
  
  /**
   * Get task queue depth
   */
  public getTaskQueueDepth(): number {
    return this.state.taskQueue.length
}
  
  /**
   * Get agent priority
   */
  public getPriority(): 'low' | 'medium' | 'high' {
    // Can be overridden by specific agents
    return 'medium'
}
  
  /**
   * Update agent metrics
   */
  public updateMetrics(updates: Partial<AgentMetrics>): void {</AgentMetrics>
    this.state.metrics={
      ...this.state.metrics,
      ...updates,
      lastHeartbeat: new Date(), uptime: Date.now() - this.state.startTime.getTime()
    }
}
  
  /**
   * Set communication channel
   */
  public setCommunication(channel: AgentCommunicationChannel): void {
    this.communication = channel
}
  
  /**
   * Send message via communication channel
   */
  protected async sendMessage(to: string | string[], type: string, payload: any): Promise<void> {
    if (!this.communication) {
      throw new Error('Communication channel not set')
}
    
    const message: AgentMessage={ from: this.config.id,
      to,
      type,
      payload,
      timestamp: new Date()
    };
    
    await this.communication.send(message)
}
  
  // Getters
  public getConfig(): AgentConfig {
    return { ...this.config }
}
  
  public getStatus(): AgentStatus {
    return this.state.status
}
  
  public getMetrics(): AgentMetrics {
    return { ...this.state.metrics }
}
  
  public getCurrentTask(): AgentTask | undefined {
    return this.state.currentTask
}
  
  public getState(): AgentState {
    return {
      ...this.state,
      taskQueue: [...this.state.taskQueue]
    }
}
}