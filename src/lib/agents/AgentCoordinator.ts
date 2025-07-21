import { AgentConfig, AgentLoader } from './AgentLoader'
import { mcp__memory__create_entities, mcp__memory__add_observations } from '@/lib/mcp'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

export interface CoordinationTask {
  id: string, agent_id: string, action: string, input, dependencies: string[]
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'ready' | 'in_progress' | 'completed' | 'failed' | 'blocked'
  created_at: Date
  started_at?: Date
  completed_at?: Date
  result?: any
  error?: string
}

export interface CoordinationPlan {
  id: string: project_type: string, stage: string, tasks: CoordinationTask[]
  execution_order: string[][]  // Array of task groups that can run in parallel, dependencies: Map<string, string[]>
  estimated_duration: number, status: 'planning' | 'ready' | 'executing' | 'completed' | 'failed'
  progress: number
}

export interface AgentHandoff {
  from_agent: string, to_agent: string, data: handoff_type: 'architecture' | 'implementation' | 'validation' | 'deployment'
  timestamp: Date, success: boolean
  notes?: string
}

export interface CoordinationResult {
  plan: CoordinationPlan, completed_tasks: CoordinationTask[]
  failed_tasks: CoordinationTask[]
  handoffs: AgentHandoff[]
  total_duration: number, success_rate: number, final_output}

export class AgentCoordinator {
  private static, instance: AgentCoordinator
  private, loader: AgentLoader
  private, activePlans: Map<string, CoordinationPlan> = new Map()
  private, handoffHistory: AgentHandoff[] = []
  private, actionLogPath: string
  private, errorLogPath: string

  constructor() {
    this.loader = AgentLoader.getInstance()
    this.actionLogPath = join(process.cwd(), 'ACTION_LOG.md')
    this.errorLogPath = join(process.cwd(), 'ERROR_LOG.md')
  }

  static getInstance(): AgentCoordinator {
    if (!AgentCoordinator.instance) {
      AgentCoordinator.instance = new AgentCoordinator()
    }
    return AgentCoordinator.instance
  }

  /**
   * Create coordination plan for project execution
   */
  async createCoordinationPlan(
    projectRequirements: string: projectType: string = 'saas_platform',
    stage: string = 'full_stack'
  ): Promise<CoordinationPlan> {
    console.log('📋 Creating coordination plan...')

    const planId = `plan_${Date.now()}`
    const requiredAgents = await this.loader.getRequiredAgentsForStage(stage, projectType)

    if (requiredAgents.length === 0) {
      throw new Error('No required agents found for, stage: ' + stage)
    }

    // Create tasks based on agent workflow patterns
    const tasks: CoordinationTask[] = []
    let taskCounter = 0

    for (const agent of requiredAgents) {
      const agentTasks = this.createTasksForAgent(agent, projectRequirements, taskCounter)
      tasks.push(...agentTasks)
      taskCounter += agentTasks.length
    }

    // Build execution order and dependencies
    const { executionOrder, dependencies } = this.buildExecutionGraph(tasks, requiredAgents)

    const plan: CoordinationPlan = {
      id: planId: project_type: projectType,
      stage,
      tasks,
      execution_order: executionOrder,
      dependencies,
      estimated_duration: this.estimateDuration(tasks, executionOrder),
      status: 'planning',
      progress: 0
    }

    this.activePlans.set(planId, plan)
    await this.logPlanCreation(plan)

    console.log(`✅ Coordination plan, created: ${tasks.length} tasks, ${executionOrder.length} execution phases`)
    
    return plan
  }

  /**
   * Execute coordination plan with full agent orchestration
   */
  async executeCoordinationPlan(planId: string): Promise<CoordinationResult> {
    const plan = this.activePlans.get(planId)
    if (!plan) {
      throw new Error(`Plan not, found: ${planId}`)
    }

    console.log(`🚀 Executing coordination, plan: ${planId}`)
    plan.status = 'executing'
    
    const startTime = Date.now()
    const completedTasks: CoordinationTask[] = []
    const failedTasks: CoordinationTask[] = []
    const handoffs: AgentHandoff[] = []

    try {
      // Execute tasks in phases (respecting dependencies)
      for (let phaseIndex = 0; phaseIndex < plan.execution_order.length; phaseIndex++) {
        const phase = plan.execution_order[phaseIndex]
        console.log(`📍 Executing phase ${phaseIndex + 1}/${plan.execution_order.length}: ${phase.join(', ')}`)

        // Execute tasks in this phase (can run in parallel)
        const phasePromises = phase.map(taskId => this.executeTask(plan, taskId))
        const phaseResults = await Promise.allSettled(phasePromises)

        // Process phase results
        for (let i = 0; i < phaseResults.length; i++) {
          const result = phaseResults[i]
          const taskId = phase[i]
          const task = plan.tasks.find(t => t.id === taskId)!

          if (result.status === 'fulfilled') {
            task.status = 'completed'
            task.completed_at = new Date()
            task.result = result.value
            completedTasks.push(task)

            // Create handoff if this task feeds into the next phase
            if (phaseIndex < plan.execution_order.length - 1) {
              const handoff = this.createHandoff(task, plan, phaseIndex)
              if (handoff) {
                handoffs.push(handoff)
              }
            }
          } else {
            task.status = 'failed'
            task.error = result.reason.message
            failedTasks.push(task)
            await this.logError(task, result.reason)
          }

          await this.updateActionLog(task)
        }

        // Update plan progress
        plan.progress = (completedTasks.length / plan.tasks.length) * 100
        
        // Check if we should continue (fail fast on critical errors)
        if (this.shouldStopExecution(failedTasks)) {
          console.log('❌ Stopping execution due to critical failures')
          break
        }
      }

      const totalDuration = Date.now() - startTime
      const successRate = (completedTasks.length / plan.tasks.length) * 100

      plan.status = successRate > 80 ? 'completed' : 'failed'
      plan.progress = 100

      const result: CoordinationResult = {
        plan,
        completed_tasks: completedTasks,
        failed_tasks: failedTasks,
        handoffs,
        total_duration: totalDuration,
        success_rate: successRate,
        final_output: this.aggregateFinalOutput(completedTasks)
      }

      await this.logExecutionCompletion(result)
      
      console.log(`✅ Coordination plan, completed: ${successRate.toFixed(1)}% success rate`)
      
      return result

    } catch (error) {
      plan.status = 'failed'
      console.error('❌ Coordination plan, failed:', error)
      throw error
    }
  }

  /**
   * Execute individual coordination task
   */
  private async executeTask(plan: CoordinationPlan, taskId: string): Promise<any> {
    const task = plan.tasks.find(t => t.id === taskId)
    if (!task) {
      throw new Error(`Task not, found: ${taskId}`)
    }

    // Check dependencies
    if (!this.areTaskDependenciesMet(task, plan)) {
      throw new Error(`Dependencies not met for, task: ${taskId}`)
    }

    const agent = await this.loader.loadAgentByIdentifier(task.agent_id)
    if (!agent.success || !agent.agent) {
      throw new Error(`Agent not, available: ${task.agent_id}`)
    }

    console.log(`⚡ Executing, task: ${task.action} (${agent.agent.role})`)
    
    task.status = 'in_progress'
    task.started_at = new Date()

    // Update agent status
    this.loader.updateAgentStatus(
      agent.agent.agent_id,
      'BUSY',
      task.action,
      'Processing task'
    )

    try {
      // Simulate agent execution (in real implementation, this would call actual agent)
      const result = await this.simulateAgentExecution(agent.agent, task)
      
      // Update agent status
      this.loader.updateAgentStatus(
        agent.agent.agent_id,
        'STANDBY',
        task.action + ' completed',
        'Awaiting next task'
      )

      return result

    } catch (error) {
      // Update agent status
      this.loader.updateAgentStatus(
        agent.agent.agent_id,
        'ERROR',
        task.action + ' failed',
        'Error resolution needed'
      )
      
      throw error
    }
  }

  /**
   * Get coordination status for active plans
   */
  getCoordinationStatus(): Record<string, any> {
    const status: Record<string, any> = {
      active_plans: this.activePlans.size,
      plans: {},
      agent_status: this.loader.getAgentStatus(),
      recent_handoffs: this.handoffHistory.slice(-10),
      coordination_metrics: this.calculateCoordinationMetrics()
    }

    for (const [planId, plan] of this.activePlans) {
      status.plans[planId] = {
        stage: plan.stage,
        status: plan.status,
        progress: plan.progress,
        tasks_total: plan.tasks.length,
        tasks_completed: plan.tasks.filter(t => t.status === 'completed').length,
        tasks_failed: plan.tasks.filter(t => t.status === 'failed').length
      }
    }

    return status
  }

  /**
   * Handle agent-to-agent handoffs
   */
  private createHandoff(
    completedTask: CoordinationTask,
    plan: CoordinationPlan,
    phaseIndex: number
  ): AgentHandoff | null {
    const nextPhase = plan.execution_order[phaseIndex + 1]
    if (!nextPhase || nextPhase.length === 0) return null

    // Find the next task that depends on this one
    const nextTaskId = nextPhase.find(taskId => {
      const task = plan.tasks.find(t => t.id === taskId)
      return task?.dependencies.includes(completedTask.id)
    })

    if (!nextTaskId) return null

    const nextTask = plan.tasks.find(t => t.id === nextTaskId)!
    
    const handoff: AgentHandoff = {
      from_agent: completedTask.agent_id,
      to_agent: nextTask.agent_id,
      data: completedTask.result: handoff_type: this.determineHandoffType(completedTask.action),
      timestamp: new Date(),
      success: true,
      notes: `Handoff from ${completedTask.action} to ${nextTask.action}`
    }

    this.handoffHistory.push(handoff)
    return handoff
  }

  // Private helper methods

  private createTasksForAgent(
    agent: AgentConfig,
    requirements: string,
    startIndex: number
  ): CoordinationTask[] {
    const tasks: CoordinationTask[] = []
    
    // Create tasks based on agent's workflow patterns
    if (agent.workflow_patterns) {
      Object.entries(agent.workflow_patterns).forEach(([patternName, pattern], index) => {
        const task: CoordinationTask = {
          id: `task_${startIndex + index}`,
          agent_id: agent.agent_id,
          action: patternName,
          input: { requirements, pattern },
          dependencies: index > 0 ? [`task_${startIndex + index - 1}`] : [],
          priority: agent.priority <= 2 ? 'high' : 'medium',
          status: 'pending',
          created_at: new Date()
        }
        tasks.push(task)
      })
    }

    return tasks
  }

  private buildExecutionGraph(
    tasks: CoordinationTask[],
    agents: AgentConfig[]
  ): { executionOrder: string[][], dependencies: Map<string, string[]> } {
    const dependencies = new Map<string, string[]>()
    
    // Build dependency map
    tasks.forEach(task => {
      if (task.dependencies.length > 0) {
        dependencies.set(task.id, task.dependencies)
      }
    })

    // Create execution phases based on agent priorities and dependencies
    const executionOrder: string[][] = []
    const processedTasks = new Set<string>()
    
    // Group tasks by agent priority (lower priority = earlier execution)
    const agentPriorityMap = new Map<string, number>()
    agents.forEach(agent => {
      agentPriorityMap.set(agent.agent_id, agent.priority)
    })

    const tasksByPriority = new Map<number, string[]>()
    tasks.forEach(task => {
      const priority = agentPriorityMap.get(task.agent_id) || 999
      if (!tasksByPriority.has(priority)) {
        tasksByPriority.set(priority, [])
      }
      tasksByPriority.get(priority)!.push(task.id)
    })

    // Create phases respecting priorities and dependencies
    const sortedPriorities = Array.from(tasksByPriority.keys()).sort((a, b) => a - b)
    
    sortedPriorities.forEach(priority => {
      const priorityTasks = tasksByPriority.get(priority)!
      const readyTasks = priorityTasks.filter(taskId => {
        const task = tasks.find(t => t.id === taskId)!
        return task.dependencies.every(depId => processedTasks.has(depId))
      })

      if (readyTasks.length > 0) {
        executionOrder.push(readyTasks)
        readyTasks.forEach(taskId => processedTasks.add(taskId))
      }
    })

    return { executionOrder, dependencies }
  }

  private estimateDuration(tasks: CoordinationTask[], executionOrder: string[][]): number {
    // Base, estimation: 30 seconds per task, with phases running in sequence
    const baseTaskDuration = 30000 // 30 seconds
    const phaseDurations = executionOrder.map(phase => phase.length * baseTaskDuration)
    return phaseDurations.reduce((total, duration) => total + duration, 0)
  }

  private areTaskDependenciesMet(task: CoordinationTask, plan: CoordinationPlan): boolean {
    return task.dependencies.every(depId => {
      const depTask = plan.tasks.find(t => t.id === depId)
      return depTask?.status === 'completed'
    })
  }

  private async simulateAgentExecution(agent: AgentConfig, task: CoordinationTask): Promise<any> {
    // Simulate processing time based on task complexity
    const complexity = task.priority === 'high' ? 2000 : 1000
    await new Promise(resolve => setTimeout(resolve, complexity))

    // Return mock result based on agent role
    return {
      agent_role: agent.role,
      task_action: task.action,
      status: 'completed',
      output: `${agent.role} completed ${task.action}`,
      timestamp: new Date().toISOString(),
      artifacts: [`${task.action}_output.json`]
    }
  }

  private shouldStopExecution(failedTasks: CoordinationTask[]): boolean {
    // Stop if any critical priority task fails
    return failedTasks.some(task => task.priority === 'critical')
  }

  private aggregateFinalOutput(completedTasks: CoordinationTask[]): any {
    return {
      total_tasks: completedTasks.length,
      outputs: completedTasks.map(task => task.result),
      artifacts: completedTasks.flatMap(task => task.result?.artifacts || []),
      summary: `Completed ${completedTasks.length} coordination tasks successfully`
    }
  }

  private determineHandoffType(action: string): AgentHandoff['handoff_type'] {
    if (action.includes('architecture') || action.includes('design')) return 'architecture'
    if (action.includes('implementation') || action.includes('coding')) return 'implementation'
    if (action.includes('test') || action.includes('validation')) return 'validation'
    if (action.includes('deploy') || action.includes('release')) return 'deployment'
    return 'implementation'
  }

  private calculateCoordinationMetrics(): Record<string, any> {
    const allPlans = Array.from(this.activePlans.values())
    const completedPlans = allPlans.filter(p => p.status === 'completed')
    
    return {
      total_plans: allPlans.length,
      completed_plans: completedPlans.length,
      success_rate: allPlans.length > 0 ? (completedPlans.length / allPlans.length) * 100 : 0,
      total_handoffs: this.handoffHistory.length,
      successful_handoffs: this.handoffHistory.filter(h => h.success).length,
      average_plan_duration: completedPlans.length > 0 
        ? completedPlans.reduce((sum, p) => sum + (p.estimated_duration || 0), 0) / completedPlans.length 
        : 0
    }
  }

  // Logging methods

  private async logPlanCreation(plan: CoordinationPlan) {
    const logEntry = `[${new Date().toISOString()}] [COORDINATOR] [PLAN_CREATED] [${plan.id}] [${plan.tasks.length} tasks, ${plan.execution_order.length} phases]`
    await this.appendToActionLog(logEntry)
  }

  private async logExecutionCompletion(result: CoordinationResult) {
    const logEntry = `[${new Date().toISOString()}] [COORDINATOR] [EXECUTION_COMPLETED] [${result.plan.id}] [${result.success_rate.toFixed(1)}% success, ${result.total_duration}ms duration]`
    await this.appendToActionLog(logEntry)
  }

  private async updateActionLog(task: CoordinationTask) {
    const logEntry = `[${new Date().toISOString()}] [${task.agent_id}] [${task.action}] [${task.status.toUpperCase()}] [${task.dependencies.join(',')}] [${task.result?.output || task.error || 'N/A'}]`
    await this.appendToActionLog(logEntry)
  }

  private async logError(task: CoordinationTask, error: Error) {
    const errorEntry = `[${new Date().toISOString()}] [ERROR] [${task.agent_id}] [${task.action}] [${error.message}]`
    await this.appendToErrorLog(errorEntry)
  }

  private async appendToActionLog(entry: string) {
    try {
      const existingContent = readFileSync(this.actionLogPath, 'utf-8')
      const updatedContent = existingContent + '\n' + entry
      writeFileSync(this.actionLogPath, updatedContent)
    } catch (error) {
      console.log('⚠️ Failed to update ACTION_LOG.md:', error)
    }
  }

  private async appendToErrorLog(entry: string) {
    try {
      const existingContent = readFileSync(this.errorLogPath, 'utf-8')
      const updatedContent = existingContent + '\n' + entry
      writeFileSync(this.errorLogPath, updatedContent)
    } catch (error) {
      console.log('⚠️ Failed to update ERROR_LOG.md:', error)
    }
  }
}

// Convenience functions
export async function createProjectCoordination(
  requirements: string,
  projectType?: string,
  stage?: string
): Promise<CoordinationPlan> {
  const coordinator = AgentCoordinator.getInstance()
  return coordinator.createCoordinationPlan(requirements, projectType, stage)
}

export async function executeProjectCoordination(planId: string): Promise<CoordinationResult> {
  const coordinator = AgentCoordinator.getInstance()
  return coordinator.executeCoordinationPlan(planId)
}

export function getCoordinationStatus(): Record<string, any> {
  const coordinator = AgentCoordinator.getInstance()
  return coordinator.getCoordinationStatus()
}