import { NextRequest } from 'next/server';
import { Redis } from '../redis/client';
import { logger } from '../logger';

/**
 * Server Instance Configuration
 */
export interface ServerInstance {
  id: string;
  url: string;
  weight: number;
  maxConnections: number;
  currentConnections: number;
  responseTime: number;
  lastHealthCheck: number;
  status: 'healthy' | 'unhealthy' | 'maintenance';
  region: string;
  resources: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

/**
 * Load Balancing Strategies
 */
export type LoadBalancingStrategy =
  | 'round-robin'
  | 'weighted-round-robin'
  | 'least-connections'
  | 'response-time'
  | 'geographic'
  | 'resource-based';

/**
 * Load Balancer Configuration
 */
export interface LoadBalancerConfig {
  strategy: LoadBalancingStrategy;
  healthCheckInterval: number;
  maxRetries: number;
  timeoutMs: number;
  failoverEnabled: boolean;
  stickySessions: boolean;
  sessionCookieName: string;
}

/**
 * Auto-Scaling Configuration
 */
export interface AutoScalingConfig {
  enabled: boolean;
  minInstances: number;
  maxInstances: number;
  targetCpuUtilization: number;
  targetMemoryUtilization: number;
  scaleUpCooldown: number;
  scaleDownCooldown: number;
  metricsWindow: number;
}

/**
 * Advanced Load Balancer with Auto-Scaling
 */
export class LoadBalancer {
  private instances: Map<string, ServerInstance> = new Map();
  private config: LoadBalancerConfig;
  private autoScalingConfig: AutoScalingConfig;
  private roundRobinIndex = 0;
  private healthCheckTimer?: NodeJS.Timeout;
  private autoScalingTimer?: NodeJS.Timeout;
  private lastScaleAction = 0;

  constructor(
    config: Partial<LoadBalancerConfig> = {},
    autoScalingConfig: Partial<AutoScalingConfig> = {}
  ) {
    this.config = {
      strategy: 'weighted-round-robin',
      healthCheckInterval: 30000, // 30 seconds
      maxRetries: 3,
      timeoutMs: 5000,
      failoverEnabled: true,
      stickySessions: false,
      sessionCookieName: 'lb-session',
      ...config,
    };

    this.autoScalingConfig = {
      enabled: true,
      minInstances: 2,
      maxInstances: 10,
      targetCpuUtilization: 70,
      targetMemoryUtilization: 80,
      scaleUpCooldown: 300000, // 5 minutes
      scaleDownCooldown: 900000, // 15 minutes
      metricsWindow: 300000, // 5 minutes
      ...autoScalingConfig,
    };

    this.startHealthChecks();
    this.startAutoScaling();
  }

  /**
   * Add server instance to load balancer
   */
  addInstance(
    instance: Omit<ServerInstance, 'currentConnections' | 'lastHealthCheck'>
  ): void {
    const fullInstance: ServerInstance = {
      ...instance,
      currentConnections: 0,
      lastHealthCheck: Date.now(),
    };

    this.instances.set(instance.id, fullInstance);
    logger.info(`Added server instance: ${instance.id}`, {
      instance: fullInstance,
    });
  }

  /**
   * Remove server instance
   */
  removeInstance(instanceId: string): void {
    const instance = this.instances.get(instanceId);
    if (instance) {
      this.instances.delete(instanceId);
      logger.info(`Removed server instance: ${instanceId}`);
    }
  }

  /**
   * Get optimal server instance for request
   */
  async getServerInstance(
    request: NextRequest
  ): Promise<ServerInstance | null> {
    const healthyInstances = Array.from(this.instances.values()).filter(
      instance => instance.status === 'healthy'
    );

    if (healthyInstances.length === 0) {
      logger.error('No healthy instances available');
      return null;
    }

    // Handle sticky sessions
    if (this.config.stickySessions) {
      const sessionId = this.getSessionId(request);
      if (sessionId) {
        const stickyInstance = await this.getStickyInstance(sessionId);
        if (stickyInstance && stickyInstance.status === 'healthy') {
          return stickyInstance;
        }
      }
    }

    // Select instance based on strategy
    let selectedInstance: ServerInstance;

    switch (this.config.strategy) {
      case 'round-robin':
        selectedInstance = this.roundRobinSelection(healthyInstances);
        break;
      case 'weighted-round-robin':
        selectedInstance = this.weightedRoundRobinSelection(healthyInstances);
        break;
      case 'least-connections':
        selectedInstance = this.leastConnectionsSelection(healthyInstances);
        break;
      case 'response-time':
        selectedInstance = this.responseTimeSelection(healthyInstances);
        break;
      case 'geographic':
        selectedInstance = await this.geographicSelection(
          healthyInstances,
          request
        );
        break;
      case 'resource-based':
        selectedInstance = this.resourceBasedSelection(healthyInstances);
        break;
      default:
        selectedInstance = this.roundRobinSelection(healthyInstances);
    }

    // Update connection count
    selectedInstance.currentConnections++;
    this.instances.set(selectedInstance.id, selectedInstance);

    // Store sticky session if enabled
    if (this.config.stickySessions) {
      await this.storeStickySession(request, selectedInstance);
    }

    return selectedInstance;
  }

  /**
   * Release connection from instance
   */
  releaseConnection(instanceId: string): void {
    const instance = this.instances.get(instanceId);
    if (instance && instance.currentConnections > 0) {
      instance.currentConnections--;
      this.instances.set(instanceId, instance);
    }
  }

  /**
   * Round Robin Selection
   */
  private roundRobinSelection(instances: ServerInstance[]): ServerInstance {
    const instance = instances[this.roundRobinIndex % instances.length];
    this.roundRobinIndex++;
    return instance;
  }

  /**
   * Weighted Round Robin Selection
   */
  private weightedRoundRobinSelection(
    instances: ServerInstance[]
  ): ServerInstance {
    const totalWeight = instances.reduce(
      (sum, instance) => sum + instance.weight,
      0
    );
    let randomWeight = Math.random() * totalWeight;

    for (const instance of instances) {
      randomWeight -= instance.weight;
      if (randomWeight <= 0) {
        return instance;
      }
    }

    return instances[0]; // Fallback
  }

  /**
   * Least Connections Selection
   */
  private leastConnectionsSelection(
    instances: ServerInstance[]
  ): ServerInstance {
    return instances.reduce((min, current) =>
      current.currentConnections < min.currentConnections ? current : min
    );
  }

  /**
   * Response Time Selection
   */
  private responseTimeSelection(instances: ServerInstance[]): ServerInstance {
    return instances.reduce((fastest, current) =>
      current.responseTime < fastest.responseTime ? current : fastest
    );
  }

  /**
   * Geographic Selection
   */
  private async geographicSelection(
    instances: ServerInstance[],
    request: NextRequest
  ): Promise<ServerInstance> {
    const clientRegion = await this.getClientRegion(request);

    // Find instances in the same region
    const sameRegionInstances = instances.filter(
      instance => instance.region === clientRegion
    );

    if (sameRegionInstances.length > 0) {
      return this.leastConnectionsSelection(sameRegionInstances);
    }

    // Fallback to least connections if no regional match
    return this.leastConnectionsSelection(instances);
  }

  /**
   * Resource-Based Selection
   */
  private resourceBasedSelection(instances: ServerInstance[]): ServerInstance {
    return instances.reduce((best, current) => {
      const currentScore = this.calculateResourceScore(current);
      const bestScore = this.calculateResourceScore(best);
      return currentScore > bestScore ? current : best;
    });
  }

  /**
   * Calculate resource utilization score
   */
  private calculateResourceScore(instance: ServerInstance): number {
    const cpuScore = (100 - instance.resources.cpu) / 100;
    const memoryScore = (100 - instance.resources.memory) / 100;
    const connectionScore = Math.max(
      0,
      1 - instance.currentConnections / instance.maxConnections
    );

    return cpuScore * 0.4 + memoryScore * 0.4 + connectionScore * 0.2;
  }

  /**
   * Get client region from request
   */
  private async getClientRegion(request: NextRequest): Promise<string> {
    // Try Cloudflare header first
    const cfRegion = request.headers.get('cf-ipcountry');
    if (cfRegion) return cfRegion.toLowerCase();

    // Try other geographic headers
    const region =
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('x-country-code') ||
      'us'; // Default to US

    return region.toLowerCase();
  }

  /**
   * Get session ID from request
   */
  private getSessionId(request: NextRequest): string | null {
    const sessionCookie = request.cookies.get(this.config.sessionCookieName);
    return sessionCookie?.value || null;
  }

  /**
   * Get sticky session instance
   */
  private async getStickyInstance(
    sessionId: string
  ): Promise<ServerInstance | null> {
    try {
      const instanceId = await Redis.get(`sticky_session:${sessionId}`);
      return instanceId ? this.instances.get(instanceId) || null : null;
    } catch (error) {
      logger.error('Failed to get sticky session:', error);
      return null;
    }
  }

  /**
   * Store sticky session
   */
  private async storeStickySession(
    request: NextRequest,
    instance: ServerInstance
  ): Promise<void> {
    try {
      const sessionId = this.getSessionId(request) || this.generateSessionId();
      await Redis.set(`sticky_session:${sessionId}`, instance.id, 3600); // 1 hour TTL
    } catch (error) {
      logger.error('Failed to store sticky session:', error);
    }
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * Start health checks
   */
  private startHealthChecks(): void {
    this.healthCheckTimer = setInterval(async () => {
      await this.performHealthChecks();
    }, this.config.healthCheckInterval);

    logger.info('Health check monitoring started', {
      interval: this.config.healthCheckInterval,
    });
  }

  /**
   * Perform health checks on all instances
   */
  private async performHealthChecks(): Promise<void> {
    const healthCheckPromises = Array.from(this.instances.values()).map(
      instance => this.checkInstanceHealth(instance)
    );

    await Promise.allSettled(healthCheckPromises);
  }

  /**
   * Check health of individual instance
   */
  private async checkInstanceHealth(instance: ServerInstance): Promise<void> {
    const start = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.timeoutMs
      );

      const response = await fetch(`${instance.url}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseTime = Date.now() - start;

      if (response.ok) {
        instance.status = 'healthy';
        instance.responseTime = responseTime;
        instance.lastHealthCheck = Date.now();

        // Update resource metrics if provided
        try {
          const healthData = await response.json();
          if (healthData.resources) {
            instance.resources = healthData.resources;
          }
        } catch (e) {
          // Ignore JSON parse errors
        }
      } else {
        instance.status = 'unhealthy';
        logger.warn(`Health check failed for instance ${instance.id}`, {
          status: response.status,
          responseTime,
        });
      }
    } catch (error) {
      instance.status = 'unhealthy';
      logger.warn(`Health check error for instance ${instance.id}:`, error);
    }

    this.instances.set(instance.id, instance);
  }

  /**
   * Start auto-scaling monitoring
   */
  private startAutoScaling(): void {
    if (!this.autoScalingConfig.enabled) return;

    this.autoScalingTimer = setInterval(async () => {
      await this.evaluateAutoScaling();
    }, this.autoScalingConfig.metricsWindow);

    logger.info('Auto-scaling monitoring started', {
      enabled: this.autoScalingConfig.enabled,
      minInstances: this.autoScalingConfig.minInstances,
      maxInstances: this.autoScalingConfig.maxInstances,
      targetCpuUtilization: this.autoScalingConfig.targetCpuUtilization,
      targetMemoryUtilization: this.autoScalingConfig.targetMemoryUtilization,
      scaleUpCooldown: this.autoScalingConfig.scaleUpCooldown,
      scaleDownCooldown: this.autoScalingConfig.scaleDownCooldown,
      metricsWindow: this.autoScalingConfig.metricsWindow,
    });
  }

  /**
   * Evaluate auto-scaling decisions
   */
  private async evaluateAutoScaling(): Promise<void> {
    const now = Date.now();
    const instances = Array.from(this.instances.values()).filter(
      instance => instance.status === 'healthy'
    );

    if (instances.length === 0) return;

    // Calculate average resource utilization
    const avgCpu =
      instances.reduce((sum, i) => sum + i.resources.cpu, 0) / instances.length;
    const avgMemory =
      instances.reduce((sum, i) => sum + i.resources.memory, 0) /
      instances.length;
    const avgConnections =
      instances.reduce(
        (sum, i) => sum + i.currentConnections / i.maxConnections,
        0
      ) / instances.length;

    // Check if scaling is needed
    const shouldScaleUp =
      (avgCpu > this.autoScalingConfig.targetCpuUtilization ||
        avgMemory > this.autoScalingConfig.targetMemoryUtilization ||
        avgConnections > 0.8) &&
      instances.length < this.autoScalingConfig.maxInstances;

    const shouldScaleDown =
      avgCpu < this.autoScalingConfig.targetCpuUtilization * 0.5 &&
      avgMemory < this.autoScalingConfig.targetMemoryUtilization * 0.5 &&
      avgConnections < 0.3 &&
      instances.length > this.autoScalingConfig.minInstances;

    // Apply cooldown periods
    if (
      shouldScaleUp &&
      now - this.lastScaleAction > this.autoScalingConfig.scaleUpCooldown
    ) {
      await this.scaleUp();
      this.lastScaleAction = now;
    } else if (
      shouldScaleDown &&
      now - this.lastScaleAction > this.autoScalingConfig.scaleDownCooldown
    ) {
      await this.scaleDown();
      this.lastScaleAction = now;
    }
  }

  /**
   * Scale up instances
   */
  private async scaleUp(): Promise<void> {
    logger.info('Auto-scaling: Scaling up');

    // In a real implementation, this would:
    // 1. Launch new server instances
    // 2. Wait for them to be ready
    // 3. Add them to the load balancer

    // For now, log the scaling decision
    const metrics = this.getMetrics();
    logger.info('Scale up triggered', metrics);

    // Store scaling event in Redis for monitoring
    await Redis.lpush(
      'scaling_events',
      JSON.stringify({
        type: 'scale_up',
        timestamp: Date.now(),
        metrics,
      })
    );
  }

  /**
   * Scale down instances
   */
  private async scaleDown(): Promise<void> {
    logger.info('Auto-scaling: Scaling down');

    // In a real implementation, this would:
    // 1. Select instance with lowest utilization
    // 2. Drain connections gracefully
    // 3. Remove from load balancer
    // 4. Terminate instance

    const metrics = this.getMetrics();
    logger.info('Scale down triggered', metrics);

    // Store scaling event in Redis for monitoring
    await Redis.lpush(
      'scaling_events',
      JSON.stringify({
        type: 'scale_down',
        timestamp: Date.now(),
        metrics,
      })
    );
  }

  /**
   * Get load balancer metrics
   */
  getMetrics(): {
    totalInstances: number;
    healthyInstances: number;
    totalConnections: number;
    averageResponseTime: number;
    averageCpuUtilization: number;
    averageMemoryUtilization: number;
  } {
    const instances = Array.from(this.instances.values());
    const healthyInstances = instances.filter(i => i.status === 'healthy');

    return {
      totalInstances: instances.length,
      healthyInstances: healthyInstances.length,
      totalConnections: instances.reduce(
        (sum, i) => sum + i.currentConnections,
        0
      ),
      averageResponseTime:
        healthyInstances.length > 0
          ? healthyInstances.reduce((sum, i) => sum + i.responseTime, 0) /
            healthyInstances.length
          : 0,
      averageCpuUtilization:
        healthyInstances.length > 0
          ? healthyInstances.reduce((sum, i) => sum + i.resources.cpu, 0) /
            healthyInstances.length
          : 0,
      averageMemoryUtilization:
        healthyInstances.length > 0
          ? healthyInstances.reduce((sum, i) => sum + i.resources.memory, 0) /
            healthyInstances.length
          : 0,
    };
  }

  /**
   * Shutdown load balancer
   */
  shutdown(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    if (this.autoScalingTimer) {
      clearInterval(this.autoScalingTimer);
    }

    logger.info('Load balancer shutdown complete');
  }
}

/**
 * Global load balancer instance
 */
export const loadBalancer = new LoadBalancer();

/**
 * Circuit Breaker for handling failures
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold = 5,
    private timeout = 60000, // 1 minute
    private monitorWindow = 300000 // 5 minutes
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'open';
      logger.warn('Circuit breaker opened', {
        failures: this.failures,
        threshold: this.threshold,
      });
    }
  }

  getState(): string {
    return this.state;
  }
}
