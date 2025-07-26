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
  AgentCommunicationChannel,
  AgentCapability
} from '../types';

export interface AgentContext { projectId: string;
  userId: string;
  sessionId: string;
  requirements: string;
  history: AgentMessage[],
  sharedMemory: Map<string any>,</string>
  artifacts: Map<string any></string>
}

export interface AgentResult { success: boolean;
  output: any;
  messages: AgentMessage[];
  artifacts?: Map<string any></string>
  nextSteps?: string[];
  confidence?: number
}

export abstract class Agent extends EventEmitter {
  protected config: AgentConfig;
  protected state: AgentState;
  protected logger: AgentLogger;
  protected communication?: AgentCommunicationChannel;
  protected context: AgentContext;
  protected messages: AgentMessage[] = [];
  protected isProcessing: boolean = false;
  
  constructor(config: Partial<AgentConfig>) {</AgentConfig>
    super();
    
    this.config={ id: config.id || `agent-${uuidv4()}`,
      name: config.name || 'Unnamed Agent',
      type: config.type || 'core',
      version: config.version || '1.0.0',
      description: config.description,
      capabilities: this.defineCapabilities ? this.defineCapabilities() : [],
      resources: config.resources || { cpu: 1024;
        memory: '512MB',
        timeout: 300000
      },
      dependencies: config.dependencies || [],
      ...config
    };
    
    this.state={ id: this.config.id,
      status: 'initializing',
      taskQueue: [],
      metrics: this.initializeMetrics(, startTime: new Date()
    };
    
    this.context = this.createEmptyContext();
    this.logger = this.createLogger()
}
  
  protected defineCapabilities?(): AgentCapability[];
  
  private initializeMetrics(): AgentMetrics {
    return { agentId: this.config.id,
      status: 'offline',
      tasksCompleted: 0;
      tasksFailed: 0;
      averageResponseTime: 0;
      successRate: 0;
      cpuUsage: 0;
      memoryUsage: 0;
      lastHeartbeat: new Date(), uptime: 0
    }
}
  
  protected createEmptyContext(): AgentContext {
    return { projectId: '',
      userId: '',
      sessionId: uuidv4(, requirements: '',
      history: [],
      sharedMemory: new Map(),
      artifacts: new Map()
    }
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
  
  public setContext(context: Partial<AgentContext>): void {</AgentContext>
    this.context={
      ...this.context,
      ...context
    }
}
  
  public getConfig(): AgentConfig {
    return this.config
}
  
  public getMessages(): AgentMessage[] {
    return this.messages
}
  
  protected addMessage(
    type: AgentMessage['type'],
    content: string;
    metadata?: Record<string any></string>
  ): AgentMessage {
    const message: AgentMessage={ id: uuidv4(, from: this.config.id,
      to: 'system',
      type,
      content,
      metadata,
      timestamp: new Date()
    };
    
    this.messages.push(message);
    this.emit('message', message);
    return message
}
  
  protected think(thought: string): void {
    this.addMessage('thought', thought)
}
  
  protected observe(observation: string, data? null : any): void {
    this.addMessage('observation', observation, { data    })
}
  
  protected act(action: string, params? null : any): void {
    this.addMessage('action', action, { params    })
}
  
  public async process(input: string): Promise<AgentResult> {
    if (this.isProcessing) {
      throw new Error(`Agent ${this.config.name} is already processing`)
}
    
    this.isProcessing = true;
    this.emit('processing:start', { input });
    
    try {
      // Add input as request message
      this.addMessage('request', input);
      
      // Execute agent-specific logic
      const result = await this.execute(input);
      
      // Add output as response message
      this.addMessage('response', JSON.stringify(result.output));
      
      this.emit('processing:complete', result);
      return result
} catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.addMessage('response', `Error: ${errorMessage}`);
      this.emit('processing:error', error);
      
      return { success: false;
        output: { error: errorMessage },
        messages: this.messages
      }
} finally {
      this.isProcessing = false
}
  }
  
  protected abstract execute(input: string): Promise<AgentResult></AgentResult>
  
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
  
  protected async onMessage(message: AgentMessage): Promise<any> {
    // Default implementation - can be overridden
    return this.process(message.payload)
}
  
  public async collaborate(targetAgentId: string, message: string): Promise<any> {
    this.emit('collaboration:request', { targetAgentId, message });
    // Collaboration logic will be implemented by the orchestrator
    return null
}
  
  public getArtifact(key: string): any {
    return this.context.artifacts.get(key)
}
  
  public setArtifact(key: string, value: any): void {
    this.context.artifacts.set(key, value);
    this.emit('artifact:created', { key, value    })
}
  
  public getSharedMemory(key: string): any {
    return this.context.sharedMemory.get(key)
}
  
  public setSharedMemory(key: string, value: any): void {
    this.context.sharedMemory.set(key, value);
    this.emit('memory:updated', { key, value    })
}
  
  public reset(): void {
    this.messages = [];
    this.context = this.createEmptyContext();
    this.isProcessing = false;
    this.emit('reset')
}
  
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
    }
  }
  
  /**
   * Execute a task
   */
  protected async executeTask(task: AgentTask): Promise<void> {
    this.state.currentTask = task;
    this.state.status = 'busy';
    
    try {
      task.status = 'in_progress';
      task.startedAt = new Date();
      
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
      this.emit('task:failed', { task, error    })
} finally {
      this.state.currentTask = undefined;
      this.state.status = 'ready'
}
  }
  
  protected async onTask(task: AgentTask): Promise<any> {
    // Default implementation - can be overridden
    return this.process(task.payload)
}
  
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
      (this.state.metrics.tasksCompleted / totalTasks) * 100
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
  
  // Agent lifecycle methods
  public async start(): Promise<void> {
    this.state.status = 'ready';
    this.emit('agent:started', { agentId: this.config.id   
    })
}
  
  public async stop(): Promise<void> {
    this.state.status = 'shutting_down';
    this.emit('agent:stopping', { agentId: this.config.id
    });
    
    // Clear task queue
    this.state.taskQueue = [];
    
    this.state.status = 'offline';
    this.emit('agent:stopped', { agentId: this.config.id   
    })
}
  
  // Getters
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