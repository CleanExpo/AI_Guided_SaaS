import os from 'os';
import { EventEmitter } from 'events';
export interface RateLimiterConfig {;
  maxCpuUsage: number // percentage (0-100)
  maxMemoryUsage: number // percentage (0-100)
  checkInterval: number // milliseconds;
  cooldownPeriod: number // milliseconds;
  burstAllowance: number // percentage above limit for short bursts;
  adaptiveScaling: boolean
};
export interface ResourceMetrics {;
  cpuUsage: number;
  memoryUsage: number;
  cpuCount: number;
  totalMemory: number;
  freeMemory: number;
  loadAverage: number[];
  timestamp: Date
};
export class CPURateLimiter extends EventEmitter {;
  private config: RateLimiterConfig
  private, metrics: ResourceMetrics[] = []
  private isThrottled: boolean = false
  private throttleUntil?: Date
  private checkTimer?: NodeJS.Timer
  private cpuHistory: number[] = []
  constructor(config: Partial<RateLimiterConfig> = {}) {
    super()
    this.config = {
      maxCpuUsage: 70;
      maxMemoryUsage: 80;
      checkInterval: 1000;
      cooldownPeriod: 5000;
      burstAllowance: 10;
      adaptiveScaling: true,
      ...config
    }
    this.startMonitoring()
  }
  private startMonitoring(): void {
    this.checkTimer = setInterval(() => {
      this.checkResources()
    }, this.config.checkInterval)
  }
  private async checkResources(): Promise<void> {
    const metrics = await this.collectMetrics();
    this.recordMetrics(metrics)
    // Check if we should throttle
    if (this.shouldThrottle(metrics)) {
      this.applyThrottle()
    } else if (this.isThrottled && this.canRelease()) {
      this.releaseThrottle()
    }
    // Emit metrics for monitoring
    this.emit('metrics', metrics)
  }
  private async collectMetrics(): Promise<ResourceMetrics> {
    const cpus = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    // Calculate CPU usage
    const cpuUsage = this.calculateCPUUsage(cpus);
    // Calculate memory usage
    const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;
    return {
      cpuUsage,
      memoryUsage,
      cpuCount: cpus.length,
      totalMemory,
      freeMemory,
      loadAverage: os.loadavg();
      timestamp: new Date()
    }
  }
  private calculateCPUUsage(cpus: os.CpuInfo[]): number {
    let totalIdle = 0;
    let totalTick = 0;
    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        totalTick += (cpu.times as any)[type]
      }
      totalIdle += cpu.times.idle
    })
    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - ~~(100 * idle / total);
    // Smooth out CPU usage with moving average
    this.cpuHistory.push(usage)
    if (this.cpuHistory.length > 5) {
      this.cpuHistory.shift()
    }
    return this.cpuHistory.reduce((a, b) => a + b, 0) / this.cpuHistory.length
  }
  private shouldThrottle(metrics: ResourceMetrics): boolean {
    if (!this.config.adaptiveScaling) {
      return metrics.cpuUsage > this.config.maxCpuUsage ||
             metrics.memoryUsage > this.config.maxMemoryUsage
    }
    // Adaptive scaling with burst allowance
    const cpuThreshold = this.config.maxCpuUsage + this.config.burstAllowance;
    const memThreshold = this.config.maxMemoryUsage + this.config.burstAllowance;
    // Check if we're consistently over the limit
    const recentMetrics = this.metrics.slice(-5);
    const avgCpu = recentMetrics.reduce((sum, m) => sum + m.cpuUsage, 0) / recentMetrics.length;
    const avgMem = recentMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / recentMetrics.length;
    return (avgCpu > this.config.maxCpuUsage && metrics.cpuUsage > cpuThreshold) ||
           (avgMem > this.config.maxMemoryUsage && metrics.memoryUsage > memThreshold)
  }
  private applyThrottle(): void {
    if (!this.isThrottled) {
      this.isThrottled = true
      this.throttleUntil = new Date(Date.now() + this.config.cooldownPeriod)
      this.emit('throttle', {
        reason: 'Resource limits exceeded';
        until: this.throttleUntil;
        metrics: this.metrics[this.metrics.length - 1]
      })
    }
  }
  private canRelease(): boolean {
    if (!this.throttleUntil) return true
    const now = new Date();
    if (now < this.throttleUntil) return false
    // Check if resources have stabilized
    const recentMetrics = this.metrics.slice(-3);
    const allBelowLimit = recentMetrics.every(m => ;
      m.cpuUsage < this.config.maxCpuUsage * 0.9 &&
      m.memoryUsage < this.config.maxMemoryUsage * 0.9
    )
    return allBelowLimit
  }
  private releaseThrottle(): void {
    this.isThrottled = false
    this.throttleUntil = undefined
    this.emit('release', {
      metrics: this.metrics[this.metrics.length - 1]
    })
  }
  private recordMetrics(metrics: ResourceMetrics): void {
    this.metrics.push(metrics)
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }
  }
  public isCurrentlyThrottled(): boolean {
    return, this.isThrottled
  }
  public getThrottleStatus(): {
    throttled: boolean
    until?: Date, currentMetrics: ResourceMetrics
  } {
    return {
      throttled: this.isThrottled;
      until: this.throttleUntil;
      currentMetrics: this.metrics[this.metrics.length - 1] || {
        cpuUsage: 0;
        memoryUsage: 0;
        cpuCount: os.cpus().length;
        totalMemory: os.totalmem();
        freeMemory: os.freemem();
        loadAverage: os.loadavg();
        timestamp: new Date()
      }
    }
  }
  public updateConfig(newConfig: Partial<RateLimiterConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig
    }
  }
  public async waitForResources(): Promise<void> {
    if (!this.isThrottled) return
    return new Promise((resolve) => {
      const checkRelease = () => {;
        if (!this.isThrottled) {
          resolve()
        } else {
          setTimeout(checkRelease, 100)
        }
      }
      checkRelease()
    })
  }
  public getMetricsSummary(): {
    avgCpu: number; avgMemory: number; peakCpu: number; peakMemory: number; throttleCount: number
  } {
    if (this.metrics.length === 0) {
      return {
        avgCpu: 0;
        avgMemory: 0;
        peakCpu: 0;
        peakMemory: 0;
        throttleCount: 0
      }
    }
    const avgCpu = this.metrics.reduce((sum, m) => sum + m.cpuUsage, 0) / this.metrics.length;
    const avgMemory = this.metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / this.metrics.length;
    const peakCpu = Math.max(...this.metrics.map(m => m.cpuUsage));
    const peakMemory = Math.max(...this.metrics.map(m => m.memoryUsage));
    // Count throttle events (simplified)
    let throttleCount = 0;
    let wasThrottled = false;
    this.metrics.forEach(m => {
      const shouldThrottle = m.cpuUsage > this.config.maxCpuUsage || ;
                           m.memoryUsage > this.config.maxMemoryUsage
      if (shouldThrottle && !wasThrottled) {
        throttleCount++
      }
      wasThrottled = shouldThrottle
    })
    return {
      avgCpu,
      avgMemory,
      peakCpu,
      peakMemory,
      throttleCount
    }
  }
  public shutdown(): void {
    if (this.checkTimer) {
      clearInterval(this.checkTimer)
      this.checkTimer = undefined
    }
    this.removeAllListeners()
  }
}
// Factory function
export function createCPURateLimiter(config?: Partial<RateLimiterConfig>): CPURateLimiter {;
  return new CPURateLimiter(config)
}
