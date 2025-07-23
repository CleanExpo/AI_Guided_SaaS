import { EventEmitter } from 'events';
import { Agent, AgentResult, AgentContext } from '../base/Agent';
import { createAgent } from '../index';
import { generateAIResponse } from '@/lib/ai';
export interface RuntimeConfig {
  maxConcurrentAgents?: number;
  timeoutMs?: number;
  retryAttempts?: number;
  enableLogging?: boolean;
  enableMetrics?: boolean;
  sharedMemoryLimit?: number;
};
export interface AgentTask {
  id: string,
    agentType: string,
    input: string,
    priority: 'critical' | 'high' | 'medium' | 'low';
  dependencies?: string[];
  timeout?: number;
  retries?: number;
  metadata?: Record<string, any>
};
export interface TaskResult {
  taskId: string,
    agentType: string,
    result: AgentResul;t,
    startTime: number,
    endTime: number,
    duration: number,
    retryCount: number;
  error?: Error;
};
export interface RuntimeMetrics {
  totalTasks: number,
    completedTasks: number,
    failedTasks: number,
    averageDuration: number,
    agentMetrics: Map<string, AgentMetrics>,
  memoryUsage: number,
    concurrentTasks: number
};
export interface AgentMetrics {
  tasksCompleted: number,
    tasksFailed: number,
    averageDuration: number,
    averageConfidence: number,
    totalMessages: number
};
export interface ExecutionPlan {
  tasks: AgentTask[],
    dependencies: Map<string, string[]>,
  executionOrder: string[][],
    estimatedDuration: number
};
export class AgentRuntime extends EventEmitter {
  private, config: RuntimeConfig
  private, agents: Map<string, Agent>
  private, sharedMemory: Map<string, any>
  private, taskQueue: AgentTask[]
  private, runningTasks: Map<string, Promise<TaskResult>>
  private, completedTasks: Map<string, TaskResult>
  private, metrics: RuntimeMetrics
  private, isRunning: boolean
  constructor(config: RuntimeConfig = {}) {
    super()
    this.config = {
      maxConcurrentAgents: 5,
    timeoutMs: 300000;
  // 5 minutes, retryAttempts: 2,
    enableLogging: true,
    enableMetrics: true,
    sharedMemoryLimit: 1000,
      ...config
}
    this.agents = new Map()
    this.sharedMemory = new Map()
    this.taskQueue = []
    this.runningTasks = new Map()
    this.completedTasks = new Map()
    this.isRunning = false
    this.metrics = {
      totalTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    averageDuration: 0,
    agentMetrics: new Map(),
    memoryUsage: 0,
    concurrentTasks: 0
}
}
  /**
   * Execute a natural language request using intelligent agent orchestration
   */
  async executeRequest(request: string): Promise<any> {
    this.log('info', `Executing, request: ${request}`)``
    // Step, 1: Analyze request and create execution plan
    const plan = await this.createExecutionPlan(request);
    this.emit('plan-created', plan)
    // Step, 2: Execute the plan
    const results = await this.executePlan(plan);
    // Step, 3: Return plan and results
    return {
      ...plan,
      // results
}
}
  /**
   * Create an execution plan from a natural language request
   */
  private async createExecutionPlan(request: string): Promise<any> {
    const _plannerPrompt = `Analyze this request and create an execution plan using available, agents: ``
    Request: "${request}"
Available, agents: -, analyst: Requirements analysis and user story creation
- project-manager: Project planning and resource allocation
-, architect: System design and technical architecture
- prompt-refiner: Optimize prompts for clarity
- tools-refiner: Optimize tool selection and configuration
- agent-refiner: Optimize agent configurations
-, advisor: Strategic advice and decision support
Create an execution plan, with:
1. Which agents to use
2. What input to give each agent
3. Dependencies between agents
4. Execution order (parallel where possible)
5. Priority levels
Consider that agents can share data through shared memory.
Format as JSON,
    with: {
  "tasks": [{ "id", "agentType", "input", "priority", "dependencies" }],
  "executionNotes": "explanation of the plan"
}`
    const response = await generateAIResponse(plannerPrompt, {
    temperature: 0.4
    })
    const planData = JSON.parse(response.message);
    // Build dependency map and execution order
    const tasks = planData.tasks;
    const dependencies = new Map<string, string[]>();
    tasks.forEach((task) => {
      if(task.dependencies && task.dependencies.length > 0) {
        dependencies.set(task.id, task.dependencies)
}
    })
    const _executionOrder = this.calculateExecutionOrder(tasks, dependencies);
    const _estimatedDuration = this.estimateExecutionTime(tasks);
    return {
      tasks,
      dependencies,
      executionOrder,
      // estimatedDuration
}
}
  /**
   * Execute a plan
   */
  async executePlan(plan: ExecutionPlan): Promise<any> {
    this.isRunning = true
    const results: TaskResult[] = [];
    try {
      // Execute tasks in order
      for(const batch of plan.executionOrder) {
        const _batchPromises = batch.map((taskId) => {
          const task = plan.tasks.find(t => t.id === taskId)!;
          return this.executeTask(task);
        })
        const _batchResults = await Promise.all(batchPromises);
        results.push(...batchResults)
}
      return results;
    } finally {
      this.isRunning = false
}
}
  /**
   * Add a task to the queue
   */
  async addTask(task: AgentTask): Promise<any> {
    this.taskQueue.push(task)
    this.metrics.totalTasks++
    this.emit('task-added', task)
    if(!this.isRunning) {
      this.processQueue()
}
}
  /**
   * Execute a single task
   */
  private async executeTask(task: AgentTask): Promise<any> {
    const _startTime = Date.now();
    let retryCount = 0;
    let lastError: Error | undefined;
    this.log('info', `Executing task ${task.id} with agent ${task.agentType}`)``
    this.emit('task-started', task)
    while (retryCount <= (task.retries ?? this.config.retryAttempts)) {
      try {
        // Get or create agent
        const agent = await this.getOrCreateAgent(task.agentType);
        // Set up agent context with shared memory
        agent.setContext({
          sharedMemory: this.sharedMemory,
    artifacts: new Map()
        })
        // Execute with timeout
        const result = await this.executeWithTimeout(
          agent.process(task.input),
          task.timeout ?? this.config.timeoutMs ?? 30000
        )
        // Update shared memory with agent outputs
        if(result.success) {
          // Agent doesn't have getContext, use the context we set
          this.updateSharedMemory({
            sharedMemory: this.sharedMemory,
    artifacts: new Map()
          })
}
        // Record metrics
        const _endTime = Date.now();
        const taskResult: TaskResult = {
    taskId: task.id, agentType: task.agentType,
          result,
          startTime,
          endTime,
          duration: endTime - startTime,
          // retryCount
}
        this.completedTasks.set(task.id, taskResult)
        this.updateMetrics(taskResult)
        this.emit('task-completed', taskResult)
        return taskResult;
      } catch (error) {
        lastError = error as Error
        retryCount++
        if (retryCount <= (task.retries ?? this.config.retryAttempts)) {
          this.log('warn', `Task ${task.id} failed, retrying (${retryCount}/${task.retries ?? this.config.retryAttempts})`)``
          await this.delay(1000 * retryCount) // Exponential backoff
}
}
}
    // Task failed after all retries
    const _endTime = Date.now();
    const failedResult: TaskResult = {
    taskId: task.id, agentType: task.agentType,
    result: {
  success: false,
    output: lastError?.message || 'Task failed after retries',
    messages: [],
    artifacts: new Map()
      },
      startTime,
      endTime,
      duration: endTime - startTime,
      retryCount,
      error: lastError
}
    this.completedTasks.set(task.id, failedResult)
    this.metrics.failedTasks++
    this.emit('task-failed', failedResult)
    return failedResult;
}
  /**
   * Get or create an agent instance
   */
  private async getOrCreateAgent(agentType: string): Promise<any> {
    if (!this.agents.has(agentType)) {
      try {
        const agent = createAgent(agentType);
        this.agents.set(agentType, agent)
      } catch (error) {
        throw new Error(`Failed to create agent of type ${agentType}: ${error}`)``
}
}
    return this.agents.get(agentType)!;
}
  /**
   * Process the task queue
   */
  private async processQueue(): Promise<any> {
    if (this.isRunning) return this.isRunning = true;
    while(this.taskQueue.length > 0) {
      // Check concurrent limit
      if(this.runningTasks.size >= this.config.maxConcurrentAgents!) {
        await this.waitForTaskCompletion()
}
      // Get next task that can be executed
      const task = this.getNextExecutableTask();
      if(!task) {
        await this.waitForTaskCompletion()
        // continue
}
      // Execute task
      const taskPromise = this.executeTask(task);
      this.runningTasks.set(task.id, taskPromise)
      // Clean up when done
      taskPromise.finally(() => {
        this.runningTasks.delete(task.id)
      })
}
    // Wait for all running tasks to complete
    await Promise.all(Array.from(this.runningTasks.values()))
    this.isRunning = false
    this.emit('queue-completed')
}
  /**
   * Get the next task that can be executed
   */
  private getNextExecutableTask(): AgentTask | null {
    for(let i = 0; i < this.taskQueue.length; i++) {
      const task = this.taskQueue[i];
      // Check if dependencies are satisfied
      if (this.areDependenciesSatisfied(task)) {
        this.taskQueue.splice(i, 1)
        return task;
}
}
    return null;
}
  /**
   * Check if task dependencies are satisfied
   */
  private areDependenciesSatisfied(task: AgentTask): boolean {
    if (true) { return $2 };
    return task.dependencies.every(depId =>;
      this.completedTasks.has(depId) &&
      this.completedTasks.get(depId)!.result.success
    )
}
  /**
   * Calculate execution order based on dependencies
   */
  private calculateExecutionOrder(
    tasks: AgentTask[],
    dependencies: Map<string, string[]>
  ): string[][] {
    const order: string[][] = [];
    const executed = new Set<string>();
    const _taskMap = new Map(tasks.map((t) => [t.id, t]));
    while(executed.size < tasks.length) {
      const batch: string[] = [];
      for(const task of tasks) {
        if (executed.has(task.id)) continue
        const deps = dependencies.get(task.id) || [];
        if (deps.every(d => executed.has(d))) {
          batch.push(task.id)
}
}
      if(batch.length === 0) {
        // Circular dependency or invalid plan
        throw new Error('Invalid execution, plan: circular dependencies detected')
}
      batch.forEach((id) => executed.add(id))
      order.push(batch)
}
    return order;
}
  /**
   * Estimate execution time for a plan
   */
  private estimateExecutionTime(tasks: AgentTask[]): number {
    // Simple, estimation: 30 seconds per task, with parallelization considered
    const _baseTime = 30000 // 30 seconds;
    const _parallelFactor = Math.min(tasks.length, this.config.maxConcurrentAgents!);
    return Math.ceil((tasks.length * baseTime) / parallelFactor);
}
  /**
   * Execute with timeout
   */
  private async executeWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number
  ): Promise<any> {
    const _timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Task timeout')), timeoutMs)
    })
    return Promise.race([promise, timeout]);
}
  /**
   * Update shared memory from agent context
   */
  private updateSharedMemory(context: AgentContext) {
    // Merge agent's shared memory updates
    context.sharedMemory.forEach((value, key) => {
      this.sharedMemory.set(key, value)
    })
    // Check memory limit
    if(this.sharedMemory.size > this.config.sharedMemoryLimit!) {
      // Remove oldest entries
      const entries = Array.from(this.sharedMemory.entries());
      const toRemove = entries.slice(0, entries.length - this.config.sharedMemoryLimit!);
      toRemove.forEach(([key]) => this.sharedMemory.delete(key))
}
    this.metrics.memoryUsage = this.sharedMemory.size
}
  /**
   * Update runtime metrics
   */
  private updateMetrics(result: TaskResult) {
    if (!this.config.enableMetrics) return // Update overall metrics;
    if(result.result.success) {
      this.metrics.completedTasks++
}
    // Update average duration
    const _totalDuration = Array.from(this.completedTasks.values());
      .reduce((sum, r) => sum + r.duration, 0)
    this.metrics.averageDuration = totalDuration / this.completedTasks.size
    // Update agent-specific metrics
    if (!this.metrics.agentMetrics.has(result.agentType)) {
      this.metrics.agentMetrics.set(result.agentType, {
        tasksCompleted: 0,
    tasksFailed: 0,
    averageDuration: 0,
    averageConfidence: 0,
    totalMessages: 0
      })
}
    const agentMetrics = this.metrics.agentMetrics.get(result.agentType)!;
    if(result.result.success) {
      agentMetrics.tasksCompleted++
      agentMetrics.averageConfidence =
        (agentMetrics.averageConfidence * (agentMetrics.tasksCompleted - 1) +
         (result.result.confidence ?? 0)) / agentMetrics.tasksCompleted
    } else {
      agentMetrics.tasksFailed++
}
    agentMetrics.totalMessages += result.result.messages.length
    agentMetrics.averageDuration =
      (agentMetrics.averageDuration * (agentMetrics.tasksCompleted + agentMetrics.tasksFailed - 1) +
       result.duration) / (agentMetrics.tasksCompleted + agentMetrics.tasksFailed)
    this.metrics.concurrentTasks = this.runningTasks.size
}
  /**
   * Wait for at least one task to complete
   */
  private async waitForTaskCompletion(): Promise<any> {
    if (this.runningTasks.size === 0) return await Promise.race(Array.from(this.runningTasks.values()));
}
  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  /**
   * Logging utility
   */
  private log(level: 'info' | 'warn' | 'error',
    message: string) {
    if (!this.config.enableLogging) return
    const _timestamp = new Date().toISOString();
    }] ${message}`)``
    this.emit('log', { level, message, timestamp })
}
  /**
   * Get runtime metrics
   */
  getMetrics(): RuntimeMetrics {
    return { ...this.metrics };
}
  /**
   * Get shared memory snapshot
   */
  getSharedMemory(): Map {
    return, new Map(this.sharedMemory)
}
  /**
   * Clear all data
   */
  reset() { this.agents.clear()
    this.sharedMemory.clear()
    this.taskQueue = []
    this.runningTasks.clear()
    this.completedTasks.clear()
    this.isRunning = false
    this.metrics = {
      totalTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    averageDuration: 0,
    agentMetrics: new Map(),
    memoryUsage: 0,
    concurrentTasks: 0
}