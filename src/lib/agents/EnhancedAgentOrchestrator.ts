import { EventEmitter } from 'events';
import { AgentConfig, AgentMessage, AgentTask, AgentWorkflow, WorkflowStep } from './types';
import { Agent } from './base/Agent';
import { AgentRegistry } from './AgentRegistry';
import { AgentCommunication } from './AgentCommunication';
import { CPURateLimiter } from './CPURateLimiter';

// Import specialized agents
import { QAAgent } from './specialized/QAAgent';
import { DevOpsAgent } from './specialized/DevOpsAgent';
import { TypeScriptAgent } from './specialized/TypeScriptAgent';
import { SelfHealingAgent } from './specialized/SelfHealingAgent';

// Import existing agents
import { ArchitectAgent } from './runners/architect-agent';
import { BackendAgent } from './runners/backend-agent';
import { FrontendAgent } from './runners/frontend-agent';

export interface OrchestrationConfig { maxConcurrentTasks: number;
  taskTimeout: number;
  enableMonitoring: boolean;
  enableSelfHealing: boolean;
  resourceLimits: { maxCpu: number;
    maxMemory: number
 }

export interface OrchestrationMetrics { totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  activeAgents: number;
  queueLength: number;
  averageTaskTime: number;
  systemHealth: 'healthy' | 'degraded' | 'critical'
}

export class EnhancedAgentOrchestrator extends EventEmitter {
  private agents: Map<string Agent> = new Map();
  private registry: AgentRegistry;
  private communication: AgentCommunication;
  private rateLimiter: CPURateLimiter;
  private taskQueue: AgentTask[] = [];
  private activeWorkflows: Map<string WorkflowExecution> = new Map();
  private metrics: OrchestrationMetrics;
  private config: OrchestrationConfig;
  private selfHealingAgent?: SelfHealingAgent;

  constructor(config: Partial<OrchestrationConfig> = {}) {</OrchestrationConfig>
    super();
    
    this.config={ maxConcurrentTasks: 5;
      taskTimeout: 300000, // 5 minutes
      enableMonitoring: true;
      enableSelfHealing: true;
      resourceLimits: { maxCpu: 80;
        maxMemory: 80
      }
      ...config
    };
    
    this.registry = new AgentRegistry();
    this.communication = new AgentCommunication();
    this.rateLimiter = new CPURateLimiter({ maxCpuUsage: this.config.resourceLimits.maxCpu,
                maxMemoryUsage: this.config.resourceLimits.maxMemory
   )
    });
    
    this.metrics={ totalTasks: 0;
      completedTasks: 0;
      failedTasks: 0;
      activeAgents: 0;
      queueLength: 0;
      averageTaskTime: 0;
      systemHealth: 'healthy'
     };
    
    this.initializeAgents();
    this.setupEventHandlers()
}

  private initializeAgents(): void {
    // Initialize core agents
    const coreAgents = [
      new ArchitectAgent(, new BackendAgent(),
      new FrontendAgent()
    ];
    
    // Initialize specialized agents
    const specializedAgents = [
      new QAAgent(, new DevOpsAgent(),
      new TypeScriptAgent()
    ];
    
    // Initialize self-healing if enabled
    if (this.config.enableSelfHealing) {
      this.selfHealingAgent = new SelfHealingAgent();
      specializedAgents.push(this.selfHealingAgent)
}
    
    // Register all agents
    [...coreAgents, ...specializedAgents].forEach(agent => {)
      this.registerAgent(agent)
};);
    
    this.emit('orchestrator:initialized', { agentCount: this.agents.size,
                config: this.config   )
    })
}

  private setupEventHandlers(): void { // Rate limiter events
    this.rateLimiter.on('throttle', (data) => {
      this.handleThrottle(data)
};);
    
    this.rateLimiter.on('release', () => {
      this.processTaskQueue()
};);
    
    // Communication events
    this.communication.on('message', (message: AgentMessage) => {
      this.routeMessage(message)
 };);
    
    // Agent events
    this.agents.forEach(agent => {)
      agent.on('task:complete', (result) => this.handleTaskComplete(result));
      agent.on('task:failed', (error) => this.handleTaskFailed(error));
      agent.on('status:changed', (status) => this.handleAgentStatusChange(status))    })
}

  public registerAgent(agent: Agent): void {
    const config = agent.getConfig();
    this.agents.set(config.id, agent);
    this.registry.register(config);
    
    // Set up agent communication
    agent.setCommunication(this.communication);
    
    // Subscribe to agent events
    agent.on('message:send', (message) => {
      this.communication.send(message)
};);
    
    this.emit('agent:registered', config)
}

  public async executeWorkflow(workflow: AgentWorkflow, context: any = {}): Promise<any> {
{ new WorkflowExecution(workflow, context);
    this.activeWorkflows.set(workflow.id, execution);
    
    try {
      this.emit('workflow:started', { workflow: workflow.id)
    });
      
      // Execute workflow steps
      const result = await this.executeWorkflowSteps(execution);
      
      this.emit('workflow:completed', { workflow: workflow.id)
        result )
      });
      
      return result
} catch (error) {
      this.emit('workflow:failed', { workflow: workflow.id)
        error )
      });
      
      if (this.selfHealingAgent) {
        await this.selfHealingAgent.processMessage({ from: 'orchestrator',
          to: 'self-healing-agent')
          type: 'workflow-failure',)
          payload: { workflow, error }    })
}
      
      throw error
} finally {
      this.activeWorkflows.delete(workflow.id)
}
  }

  private async executeWorkflowSteps(execution: WorkflowExecution): Promise<any> {
    const results: Map<string any> = new Map();
    
    for (const step of execution.workflow.steps) {
      // Check dependencies
      if (step.dependsOn) {
        const dependenciesMet = step.dependsOn.every(dep => results.has(dep)); if (!dependenciesMet) {
          throw new Error(`Dependencies not met for step ${step.id}`)
}
      }
      
      // Check condition
      if (step.condition) {
        const shouldExecute = typeof step.condition === 'function' ;
          ? step.condition(execution.context)
          : this.evaluateCondition(step.condition, execution.context);
        
        if (!shouldExecute) {
          continue
}
      }
      
      // Execute step
      try {
        const result = await this.executeStep(step, execution.context);
        results.set(step.id, result);
        
        // Update context with result
        execution.context[step.id] = result;
        
        // Handle success callback
        if (step.onSuccess && results.has(step.onSuccess) {)} {
          await this.executeStep()
            execution.workflow.steps.find(s => s.id === step.onSuccess)!,
            execution.context
          )
}
      } catch (error) {
        // Handle failure
        if (step.onFailure && results.has(step.onFailure) {)} {
          await this.executeStep()
            execution.workflow.steps.find(s => s.id === step.onFailure)!,
            execution.context
          )
} else if (step.retries && step.retries > 0) {
          // Retry logic
          for (let i = 0; i < step.retries; i++) {
            try {
              const result = await this.executeStep(step, execution.context);
              results.set(step.id, result);
              break
} catch (retryError) {
              if (i === step.retries - 1) {t}hrow retryError
}
} else {
          throw error
}
}
    
    return results
}

  private async executeStep(step: WorkflowStep, context: any): Promise<any> {
{ this.agents.get(step.agent);
    
    if (!agent) {
      throw new Error(`Agent ${step.agent} not found`)
}
    
    const task: AgentTask={ id: `${step.id}-${Date.now()}`,
      type: step.task,
      assignedTo: step.agent,
      status: 'pending',
      priority: 'medium',
      payload: { ...step.parameters, context },
      createdAt: new Date()
     };
    
    return this.executeTask(task)
}

  public async executeTask(task: AgentTask): Promise<any> {
    // Check resource limits
    if (this.rateLimiter.isCurrentlyThrottled() {)} {
      this.taskQueue.push(task);
      this.metrics.queueLength++;
      return new Promise((resolve, reject) => {
        task.resolve = resolve;
        task.reject = reject    })
}
    
    const agent = this.agents.get(task.assignedTo!);
    
    if (!agent) {
      throw new Error(`Agent ${task.assignedTo} not found`)
}
    
    task.status = 'in_progress';
    task.startedAt = new Date();
    this.metrics.totalTasks++;
    
    try {
      const result = await agent.processMessage({ from: 'orchestrator',
        to: task.assignedTo!,
        type: task.type,
                payload: task.payload
     )
    });
      
      task.status = 'completed';
      task.result = result;
      task.completedAt = new Date();
      this.metrics.completedTasks++;
      
      this.updateMetrics(task);
      
      return result
} catch (error) {
      task.status = 'failed';
      task.error = error.message;
      task.completedAt = new Date();
      this.metrics.failedTasks++;
      
      // Trigger self-healing if enabled
      if (this.selfHealingAgent) {
        await this.selfHealingAgent.processMessage({ from: 'orchestrator',
          to: 'self-healing-agent')
          type: 'task-failure',)
          payload: { task, error }    })
}
      
      throw error
}
  }

  private processTaskQueue(): void {
    while (this.taskQueue.length > 0 && !this.rateLimiter.isCurrentlyThrottled()) {
      const task = this.taskQueue.shift()!;
      this.metrics.queueLength--;
      
      this.executeTask(task)
        .then(result => task.resolve?.(result))
        .catch(error => task.reject?.(error))
}
  }

  private routeMessage(message: AgentMessage): void {
    if (Array.isArray(message.to) {)} {
      // Broadcast to multiple agents
      message.to.forEach(agentId => {)
        const agent = this.agents.get(agentId);
        agent?.processMessage(message)    })
} else if (message.to === 'orchestrator') {
      // Handle orchestrator messages
      this.handleOrchestratorMessage(message)
} else {
      // Route to specific agent
      const agent = this.agents.get(message.to);
      agent?.processMessage(message)
}
  }

  private handleOrchestratorMessage(message: AgentMessage): void {
    switch (message.type) {
      case 'health-report':
        this.updateSystemHealth(message.payload);
        break;
      case 'deployment-complete':
        this.emit('deployment:complete', message.payload);
        break;
      case 'quality-analysis':
        this.emit('quality:analysis', message.payload);
        break;
      case 'type-analysis':
        this.emit('typescript:analysis', message.payload);
        break;
      default:
        this.emit('message:received', message)
}
  }

  private handleThrottle(data: any): void {
    this.emit('resources:throttled', data);
    
    // Notify monitoring
    if (this.config.enableMonitoring) {
      this.metrics.systemHealth = 'degraded'
}
  }

  private handleTaskComplete(result: any): void {
    this.emit('task:complete', result)
}

  private handleTaskFailed(error: any): void {
    this.emit('task:failed', error)
}

  private handleAgentStatusChange(status: any): void {
    this.updateActiveAgents();
    this.emit('agent:status', status)
}

  private updateActiveAgents(): void {
    this.metrics.activeAgents = Array.from(this.agents.values())
      .filter(agent => agent.getStatus() === 'busy').length
}

  private updateMetrics(task: AgentTask): void {
    if (task.startedAt && task.completedAt) {
      const duration = task.completedAt.getTime() - task.startedAt.getTime();
      
      // Update average task time
      this.metrics.averageTaskTime = 
        (this.metrics.averageTaskTime * (this.metrics.completedTasks - 1) + duration) / 
        this.metrics.completedTasks
}
  }

  private updateSystemHealth(healthData: any): void {
    // Update system health based on various factors
    const failureRate = this.metrics.failedTasks / this.metrics.totalTasks;
    
    if (failureRate > 0.3 || healthData.status === 'down') {
      this.metrics.systemHealth = 'critical'
} else if (failureRate > 0.1 || healthData.status === 'degraded') {
      this.metrics.systemHealth = 'degraded'
} else {
      this.metrics.systemHealth = 'healthy'
}
  }

  private evaluateCondition(condition: string, context: any): boolean {
    // Simple condition evaluation - in production use a proper expression evaluator
    try {
      return new new Function('context', `return ${condition}`)(context)
} catch {
      return false
}
  }

  public getMetrics(): OrchestrationMetrics {
    return { ...this.metrics }
}

  public getAgents(): Map<string Agent> {
    return new Map(this.agents)
}

  public async shutdown(): Promise<void> {
    this.emit('orchestrator:shutting_down');
    
    // Stop all agents
    await Promise.all()
      Array.from(this.agents.values()).map(agent => agent.stop())
    );
    
    // Clean up
    this.rateLimiter.shutdown();
    this.removeAllListeners();
    
    this.emit('orchestrator:shutdown')
}
}

// Helper class for workflow execution
class WorkflowExecution {
  constructor(public workflow: AgentWorkflow;
    public context: any = {})
  ) {
    this.context._workflow = workflow.id;
    this.context._startTime = new Date()
}
}

// Extend AgentTask type to include promise handlers
declare module './types' {
  interface AgentTask { resolve?: (value: any) => void;
    reject?: (reason: any) => void
 }
}}}}}}