import { EventEmitter } from 'events';
import { ContainerizedAgent, ContainerOrchestratorConfig } from './types';

export class ContainerManager extends EventEmitter {
  private containers: Map<string, ContainerizedAgent> = new Map();
  private config: ContainerOrchestratorConfig;

  constructor(config: ContainerOrchestratorConfig) {
    super();
    this.config = config;
  }

  addContainer(agentId: string, containerizedAgent: ContainerizedAgent): void {
    if (this.containers.has(agentId)) {
      throw new Error(`Agent ${agentId} is already deployed`);
    }
    
    if (this.containers.size >= this.config.maxContainers) {
      throw new Error('Maximum container limit reached');
    }
    
    this.containers.set(agentId, containerizedAgent);
    this.setupContainerEventHandlers(containerizedAgent.container, agentId);
  }

  removeContainer(agentId: string): void {
    this.containers.delete(agentId);
  }

  getContainer(agentId: string): ContainerizedAgent | undefined {
    return this.containers.get(agentId);
  }

  getAllContainers(): Map<string, ContainerizedAgent> {
    return new Map(this.containers);
  }

  async stopContainer(agentId: string): Promise<void> {
    const containerizedAgent = this.containers.get(agentId);
    if (!containerizedAgent) {
      throw new Error(`Agent ${agentId} is not deployed`);
    }
    
    try {
      await containerizedAgent.container.stop();
      containerizedAgent.status = 'stopped';
      this.containers.delete(agentId);
      
      this.emit('agent:stopped', { agentId });
    } catch (error) {
      this.emit('agent:stop:error', { agentId, error });
      throw error;
    }
  }

  async stopAllContainers(): Promise<void> {
    await Promise.all(
      Array.from(this.containers.keys()).map(agentId => 
        this.stopContainer(agentId)
      )
    );
  }

  private setupContainerEventHandlers(container: any, agentId: string): void {
    container.on('container:started', (data: any) => {
      this.emit('container:started', { agentId, ...data });
    });
    
    container.on('container:stopped', (data: any) => {
      this.emit('container:stopped', { agentId, ...data });
      
      const containerizedAgent = this.containers.get(agentId);
      if (containerizedAgent) {
        containerizedAgent.status = 'stopped';
      }
    });
    
    container.on('container:error', (data: any) => {
      this.emit('container:error', { agentId, ...data });
      
      const containerizedAgent = this.containers.get(agentId);
      if (containerizedAgent) {
        containerizedAgent.status = 'error';
      }
    });
    
    container.on('stats', (stats: any) => {
      this.emit('container:stats', { agentId, stats });
    });
    
    container.on('resource:warning', (data: any) => {
      this.emit('resource:warning', { agentId, ...data });
    });
  }

  getStatus(): {
    totalContainers: number;
    runningContainers: number;
    healthyContainers: number;
  } {
    let runningContainers = 0;
    let healthyContainers = 0;
    
    for (const containerizedAgent of this.containers.values()) {
      if (containerizedAgent.status === 'running') {
        runningContainers++;
        if (containerizedAgent.healthStatus === 'healthy') {
          healthyContainers++;
        }
      }
    }
    
    return {
      totalContainers: this.containers.size,
      runningContainers,
      healthyContainers
    };
  }

  calculateCpuShares(cpuLimit?: number): number {
    // Docker CPU shares: 1024 = 1 CPU
    return cpuLimit ? cpuLimit * 1024 : 512; // Default to 0.5 CPU
  }

  cloneAgent(agent: any, newId: string): any {
    const config = agent.getConfig();
    const AgentClass = agent.constructor as new (config: any) => any;
    
    return new AgentClass({
      ...config,
      id: newId
    });
  }
}