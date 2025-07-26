import { EventEmitter } from 'events';
import { ContainerizedAgent } from './types';

export class HealthCheckManager extends EventEmitter {
  private healthCheckInterval?: NodeJS.Timeout;
  private containers: Map<string, ContainerizedAgent>;
  private checkInterval: number;

  constructor(containers: Map<string, ContainerizedAgent>, checkInterval: number = 30000) {
    super();
    this.containers = containers;
    this.checkInterval = checkInterval;
  }

  start(): void {
    this.healthCheckInterval = setInterval(async () => {
      for (const [agentId, containerizedAgent] of this.containers) {
        if (containerizedAgent.status === 'running') {
          try {
            const isHealthy = await containerizedAgent.container.isHealthy();
            containerizedAgent.lastHealthCheck = new Date();
            containerizedAgent.healthStatus = isHealthy ? 'healthy' : 'unhealthy';
            
            if (!isHealthy) {
              this.emit('container:unhealthy', { agentId });
              
              // Attempt to restart unhealthy containers
              await containerizedAgent.container.restart();
            }
          } catch (error) {
            containerizedAgent.healthStatus = 'unknown';
            this.emit('health:check:error', { agentId, error });
          }
        }
      }
    }, this.checkInterval);
  }

  stop(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
  }

  getHealthStatus(): Record<string, { 
    status: string; 
    lastCheck?: Date; 
    healthStatus?: string; 
  }> {
    const status: Record<string, any> = {};
    
    for (const [agentId, containerizedAgent] of this.containers) {
      status[agentId] = {
        status: containerizedAgent.status,
        lastCheck: containerizedAgent.lastHealthCheck,
        healthStatus: containerizedAgent.healthStatus
      };
    }
    
    return status;
  }
}