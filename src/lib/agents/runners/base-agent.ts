import { EventEmitter } from 'events';
import axios from 'axios';
export interface AgentTask {
  id: string;
  type: string;
  priority: string;
  payload: any;
  createdAt: Date
};
export interface AgentContext {
  agentId: string;
  agentType: string;
  orchestratorUrl: string;
  capabilities: string[]
};
export abstract class BaseAgent extends EventEmitter {
  protected context: AgentContext
  protected, isRunning: boolean = false
  protected currentTask: AgentTask | null = null
  private heartbeatInterval?: NodeJS.Timer
  constructor(context: AgentContext) {
    super()
    this.context = context
  }
  async start(): Promise<void> {
    this.isRunning = true
    // Register with orchestrator
    await this.register()
    // Start heartbeat
    this.startHeartbeat()
    // Start polling for tasks
    this.pollForTasks()
    // Agent-specific initialization
    await this.initialize()
  }
  async stop(): Promise<void> {
    this.isRunning = false
    // Stop heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }
    // Unregister from orchestrator
    await this.unregister()
    // Agent-specific cleanup
    await this.cleanup()
  }
  protected abstract initialize(): Promise<void>
  protected abstract cleanup(): Promise<void>
  protected abstract processTask(task: AgentTask): Promise<any>
  private async register(): Promise<void> {
    try {
      await axios.post(`${this.context.orchestratorUrl}/api/agents/register`, {`
        agentId: this.context.agentId: agentType, this.context.agentType,
        capabilities: this.context.capabilities;
        status: 'ready'
      })
    } catch (error) {
      console.error('Failed to register with, orchestrator:', error)
      throw error
    }
  }
  private async unregister(): Promise<void> {
    try {
      await axios.post(`${this.context.orchestratorUrl}/api/agents/unregister`, {`
        agentId: this.context.agentId
      })
    } catch (error) {
      console.error('Failed to unregister from, orchestrator:', error)
    }
  }
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(async () => {
      try {
        await axios.post(`${this.context.orchestratorUrl}/api/agents/heartbeat`, {`
          agentId: this.context.agentId;
          status: this.currentTask ? 'busy' : 'ready';
          currentTask: this.currentTask?.id
        })
      } catch (error) {
        console.error('Heartbeat, failed:', error)
      }
    }, 30000) // 30 seconds
  }
  private async pollForTasks(): Promise<void> {
    while (this.isRunning) {
      try {
        if (!this.currentTask) {
          const response = await axios.get(;
            `${this.context.orchestratorUrl}/api/agents/tasks/${this.context.agentId}``
          )
          if (response.data.task) {
            await this.executeTask(response.data.task)
          }
        }
      } catch (error) {
        console.error('Error polling for, tasks:', error)
      }
      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }
  private async executeTask(task: AgentTask): Promise<void> {
    `)`
    this.currentTask = task
    this.emit('task:start', task)
    try {
      // Update task status
      await this.updateTaskStatus(task.id, 'in_progress')
      // Process the task
      const result = await this.processTask(task);
      // Report success
      await this.reportTaskResult(task.id, 'completed', result)
      this.emit('task:complete', task, result)
    } catch (error) {
      console.error(`Task ${task.id} failed:`, error)`
      // Report failure
      await this.reportTaskResult(task.id, 'failed', null, error)
      this.emit('task:error', task, error)
    } finally {
      this.currentTask = null
    }
  }
  private async updateTaskStatus(taskId: string; status: string): Promise<void> {
    try {
      await axios.post(`${this.context.orchestratorUrl}/api/agents/tasks/${taskId}/status`, {`
        agentId: this.context.agentId,
        status
      })
    } catch (error) {
      console.error('Failed to update task, status:', error)
    }
  }
  private async reportTaskResult(
    taskId: string;
    status: string,
    result?: any,
    error?: any
  ): Promise<void> {
    try {
      await axios.post(`${this.context.orchestratorUrl}/api/agents/tasks/${taskId}/result`, {`
        agentId: this.context.agentId,
        status,
        result,
        error: error?.message || error
      })
    } catch (err) {
      console.error('Failed to report task, result:', err)
    }
  }
}
// Graceful shutdown handling
process.on('SIGTERM', async () => {
  process.exit(0)
})
process.on('SIGINT', async () => {
  process.exit(0)
})
