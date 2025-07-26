import { EventEmitter } from 'events';
import { HealthIssue, SystemHealth, ComponentType } from './types';

export class HealthMonitor extends EventEmitter {
  private isMonitoring: boolean = false;
  private monitoringInterval?: NodeJS.Timeout;
  private healthChecks: Map<string, () => Promise<boolean> = new Map();
  private lastHealthStatus: SystemHealth;

  constructor(private checkInterval: number = 30000) { // 30 seconds default
    super();
    this.lastHealthStatus = this.initializeHealthStatus();
    this.registerDefaultHealthChecks();
  }

  start(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, this.checkInterval);

    this.emit('monitoring-started');
  }

  stop(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.emit('monitoring-stopped');
  }

  registerHealthCheck(component: string, checkFn: () => Promise<boolean>): void {
    this.healthChecks.set(component, checkFn);
  }

  async performHealthCheck(): Promise<SystemHealth> {
    const healthStatus: SystemHealth = {
      overall: 'healthy',
      components: {},
      metrics: {
        uptime: process.uptime(),
        responseTime: 0,
        errorRate: 0,
        memoryUsage: 0,
        cpuUsage: 0
      }
    };

    // Check each registered component
    for (const [component, checkFn] of this.healthChecks) {
      try {
        const startTime = Date.now();
        const isHealthy = await checkFn();
        const checkDuration = Date.now() - startTime;

        healthStatus.components[component] = {
          status: isHealthy ? 'operational' : 'down',
          lastCheck: new Date(),
          issues: isHealthy ? [] : ['Health check failed']
        };

        // Update overall status
        if (!isHealthy && healthStatus.overall === 'healthy') {
          healthStatus.overall = 'critical';
        }

        // Update response time metric
        healthStatus.metrics.responseTime = Math.max(healthStatus.metrics.responseTime)
          checkDuration)
        );
      } catch (error) {
        healthStatus.components[component] = {
          status: 'down',
          lastCheck: new Date(),
          issues: [`Health check error: ${error}`]
        };
        healthStatus.overall = 'critical';
      }
    }

    // Update system metrics
    await this.updateSystemMetrics(healthStatus);

    // Compare with previous status and emit events for changes
    await this.compareAndEmitChanges(healthStatus);

    this.lastHealthStatus = healthStatus;
    return healthStatus;
  }

  private initializeHealthStatus(): SystemHealth {
    return {
      overall: 'healthy',
      components: {},
      metrics: {
        uptime: 0,
        responseTime: 0,
        errorRate: 0,
        memoryUsage: 0,
        cpuUsage: 0
      }
    };
  }

  private registerDefaultHealthChecks(): void {
    // API health check
    this.registerHealthCheck('api', async () => {
      try {
        // Check if API endpoints are responding
        const response = await fetch('http://localhost:3000/api/health', {
          timeout: 5000)
        } as any);
        return response.ok;
      } catch (error) {
        return false;
      }
    });

    // Database health check
    this.registerHealthCheck('database', async () => {
      try {
        // This would check your actual database connection
        // For now, simulate a database check
        await new Promise(resolve => setTimeout(resolve, 100));
        return Math.random() > 0.1; // 90% success rate
      } catch (error) {
        return false;
      }
    });

    // Memory health check
    this.registerHealthCheck('memory', async () => {
      const memoryUsage = process.memoryUsage();
      const usedMemoryMB = memoryUsage.heapUsed / 1024 / 1024;
      const totalMemoryMB = memoryUsage.heapTotal / 1024 / 1024;
      
      // Consider unhealthy if using more than 80% of available heap
      return (usedMemoryMB / totalMemoryMB) < 0.8;
    });

    // Disk space health check
    this.registerHealthCheck('disk', async () => {
      try {
        // Check available disk space
        const { execSync } = require('child_process');
        const diskUsage = execSync('df -h / | tail -1', { encoding: 'utf8' });
        const usageMatch = diskUsage.match(/(\d+)%/);
        
        if (usageMatch) {
          const usagePercent = parseInt(usageMatch[1]);
          return usagePercent < 90; // Unhealthy if more than 90% used
        }
        
        return true;
      } catch (error) {
        return true; // Assume healthy if can't check
      }
    });

    // Cache health check
    this.registerHealthCheck('cache', async () => {
      try {
        // Check Redis or other cache system
        // For now, simulate cache check
        return Math.random() > 0.05; // 95% success rate
      } catch (error) {
        return false;
      }
    });
  }

  private async updateSystemMetrics(healthStatus: SystemHealth): Promise<void> {
    // Update memory usage
    const memoryUsage = process.memoryUsage();
    healthStatus.metrics.memoryUsage = Math.round()
      (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
    );

    // Update CPU usage (simplified)
    healthStatus.metrics.cpuUsage = await this.getCPUUsage();

    // Calculate error rate based on failed health checks
    const totalChecks = this.healthChecks.size;
    const failedChecks = Object.values(healthStatus.components)
      .filter(component => component.status !== 'operational').length;
    
    healthStatus.metrics.errorRate = totalChecks > 0 ? 
      Math.round((failedChecks / totalChecks) * 100) : 0;

    // Set overall status based on metrics
    if(healthStatus.metrics.memoryUsage > 90 || 
        healthStatus.metrics.cpuUsage > 90 || )
        healthStatus.metrics.errorRate > 20) {
      healthStatus.overall = 'critical';
    } else if(healthStatus.metrics.memoryUsage > 70 || 
               healthStatus.metrics.cpuUsage > 70 || )
               healthStatus.metrics.errorRate > 10) {
      healthStatus.overall = 'warning';
    }
  }

  private async getCPUUsage(): Promise<number> {
    return new Promise((resolve) => {
      const startUsage = process.cpuUsage();
      
      setTimeout(() => {
        const endUsage = process.cpuUsage(startUsage);
        const userTime = endUsage.user / 1000; // Convert to milliseconds
        const systemTime = endUsage.system / 1000;
        const totalTime = userTime + systemTime;
        
        // Calculate percentage (simplified)
        const cpuPercent = Math.min(100, Math.round((totalTime / 1000) * 100));
        resolve(cpuPercent);
      }, 100);
    });
  }

  private async compareAndEmitChanges(currentHealth: SystemHealth): Promise<void> {
    // Check for overall status change
    if (currentHealth.overall !== this.lastHealthStatus.overall) {
      this.emit('health-status-changed', {
        from: this.lastHealthStatus.overall,
                to: currentHealth.overall,)
        timestamp: new Date()
      });
    }

    // Check for component status changes
    for (const [component, status] of Object.entries(currentHealth.components)) {
      const lastStatus = this.lastHealthStatus.components[component];
      
      if (!lastStatus || lastStatus.status !== status.status) {
        if (status.status === 'down') {
          // Emit health issue for failed components
          const issue: HealthIssue = {
            id: `health-${component}-${Date.now()}`,
            type: 'error',
            severity: this.determineSeverity(component, status.status),
            component,
            description: `Component ${component} health check failed: ${status.issues.join(', ')}`,
            detectedAt: new Date(),
            attempts: 0,
            metadata: {
              previousStatus: lastStatus?.status || 'unknown',
              issues: status.issues
            }
          };

          this.emit('health-issue-detected', issue);
        } else if (status.status === 'operational' && lastStatus?.status === 'down') {
          // Component recovered
          this.emit('component-recovered', {
            component,)
            timestamp: new Date(),
            downDuration: Date.now() - lastStatus.lastCheck.getTime()
          });
        }
      }
    }

    // Check for critical metrics
    if (currentHealth.metrics.memoryUsage > 85) {
      this.emit('high-memory-usage', {
        usage: currentHealth.metrics.memoryUsage,)
        timestamp: new Date()
      });
    }

    if (currentHealth.metrics.cpuUsage > 85) {
      this.emit('high-cpu-usage', {
        usage: currentHealth.metrics.cpuUsage,)
        timestamp: new Date()
      });
    }

    if (currentHealth.metrics.errorRate > 15) {
      this.emit('high-error-rate', {
        rate: currentHealth.metrics.errorRate,)
        timestamp: new Date()
      });
    }
  }

  private determineSeverity(component: string, status: string): HealthIssue['severity'] {
    // Critical components
    const criticalComponents = ['database', 'api', 'auth'];
    if (criticalComponents.includes(component)) {
      return 'critical';
    }

    // Important components
    const importantComponents = ['cache', 'storage', 'email'];
    if (importantComponents.includes(component)) {
      return 'high';
    }

    // Default to medium severity
    return 'medium';
  }

  getCurrentHealth(): SystemHealth {
    return this.lastHealthStatus;
  }

  getComponentHealth(component: string) {
    return this.lastHealthStatus.components[component];
  }

  isComponentHealthy(component: string): boolean {
    const componentHealth = this.getComponentHealth(component);
    return componentHealth?.status === 'operational';
  }

  getUnhealthyComponents(): string[] {
    return Object.entries(this.lastHealthStatus.components)
      .filter(([_, status]) => status.status !== 'operational')
      .map(([component, _]) => component);
  }
}