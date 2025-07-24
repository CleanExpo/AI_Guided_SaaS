import { EventEmitter } from 'events';
import os from 'os';
import { performance } from 'perf_hooks';

export interface ResourceThresholds { cpu: {
    warning: number;
    critical: number
},
  memory: { warning: number;
    critical: number
},
  diskSpace: { warning: number;
    critical: number
}
}

export interface ResourceSnapshot { timestamp: Date;
  cpu: { usage: number;
    loadAverage: number[],
    cores: number
},
  memory: { total: number;
    used: number;
    free: number;
    percentage: number
},
  process: { cpu: number;
    memory: number;
    uptime: number
},
  alerts: ResourceAlert[]
}

export interface ResourceAlert { type: 'cpu' | 'memory' | 'disk',
  level: 'warning' | 'critical',
  message: string;
  value: number;
  threshold: number;
  timestamp: Date
}

export class ResourceMonitor extends EventEmitter {
  private thresholds: ResourceThresholds;
  private monitoringInterval?: NodeJS.Timeout;
  private history: ResourceSnapshot[] = [];
  private maxHistorySize: number = 60; // Keep 1 minute of history at 1s intervals
  private lastCpuInfo?: any;
  private isMonitoring: boolean = false;

  constructor(thresholds: Partial<ResourceThresholds> = {}) {</ResourceThresholds>
    super();
    
    this.thresholds={ cpu: {
        warning: 70;
        critical: 85;
        ...thresholds.cpu
      }
      memory: { warning: 75;
        critical: 90;
        ...thresholds.memory
      },
      diskSpace: { warning: 80;
        critical: 95;
        ...thresholds.diskSpace
      }
    }
}

  /**
   * Start monitoring resources
   */
  public start(intervalMs: number = 1000): void {
    if (this.isMonitoring) {r}eturn;
    
    this.isMonitoring = true;
    this.lastCpuInfo = this.getCpuInfo();
    
    this.monitoringInterval = setInterval(() => {
      this.collectSnapshot()
}, intervalMs);
    
    // Collect initial snapshot
    this.collectSnapshot();
    
    this.emit('monitor:started')
}

  /**
   * Stop monitoring
   */
  public stop(): void {
    if (!this.isMonitoring) {r}eturn;
    
    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined
}
    
    this.emit('monitor:stopped')
}

  /**
   * Collect a resource snapshot
   */
  private collectSnapshot(): void {
    const snapshot = this.createSnapshot();
    
    // Add to history
    this.history.push(snapshot);
    if (this.history.length > this.maxHistorySize) {
      this.history.shift()
}
    
    // Check for alerts
    this.checkThresholds(snapshot);
    
    // Emit snapshot
    this.emit('snapshot', snapshot)
}

  /**
   * Create a resource snapshot
   */
  private createSnapshot(): ResourceSnapshot {
    const cpuInfo = this.getCpuInfo();
    const cpuUsage = this.calculateCpuUsage(this.lastCpuInfo, cpuInfo);
    this.lastCpuInfo = cpuInfo;
    
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryPercentage = (usedMemory / totalMemory) * 100;
    
    const processMemory = process.memoryUsage();
    const processCpu = process.cpuUsage();
    
    return { timestamp: new Date(), cpu: { usage: cpuUsage;
        loadAverage: os.loadavg(),
        cores: os.cpus().length
      },
      memory: { total: totalMemory;
        used: usedMemory;
        free: freeMemory;
        percentage: memoryPercentage
      },
      process: { cpu: this.calculateProcessCpu(processCpu, memory: processMemory.heapUsed + processMemory.external,
        uptime: process.uptime()
      },
      alerts: []
    }
}

  /**
   * Get CPU information
   */
  private getCpuInfo(): any {
    const cpus = os.cpus();
    let user = 0;
    let nice = 0;
    let sys = 0;
    let idle = 0;
    let irq = 0;
    
    for (const cpu of cpus) {
      user += cpu.times.user; nice += cpu.times.nice; sys += cpu.times.sys;
      idle += cpu.times.idle;
      irq += cpu.times.irq
}
    
    return { user, nice, sys, idle, irq, total: user + nice + sys + idle + irq }
}

  /**
   * Calculate CPU usage percentage
   */
  private calculateCpuUsage(startInfo: any, endInfo: any): number {
    if (!startInfo) {r}eturn 0;
    
    const startTotal = startInfo.total;
    const endTotal = endInfo.total;
    
    const startIdle = startInfo.idle;
    const endIdle = endInfo.idle;
    
    const totalDiff = endTotal - startTotal;
    const idleDiff = endIdle - startIdle;
    
    if (totalDiff === 0) {r}eturn 0;
    
    const usage = 100 - ~~(100 * idleDiff / totalDiff);
    return Math.max(0, Math.min(100, usage))
}

  /**
   * Calculate process CPU usage
   */
  private calculateProcessCpu(cpuUsage: NodeJS.CpuUsage): number {
    const totalUsage = cpuUsage.user + cpuUsage.system;
    const totalTime = process.uptime() * 1000000; // Convert to microseconds
    return (totalUsage / totalTime) * 100
}

  /**
   * Check resource thresholds and generate alerts
   */
  private checkThresholds(snapshot: ResourceSnapshot): void {
    const alerts: ResourceAlert[] = [];
    
    // Check CPU
    if (snapshot.cpu.usage >= this.thresholds.cpu.critical) {
      alerts.push({ type: 'cpu',
        level: 'critical',
        message: `CPU usage critical: ${snapshot.cpu.usage.toFixed(1)}%`,
        value: snapshot.cpu.usage,
        threshold: this.thresholds.cpu.critical,
        timestamp: new Date()
      })
} else if (snapshot.cpu.usage >= this.thresholds.cpu.warning) {
      alerts.push({ type: 'cpu',
        level: 'warning',
        message: `CPU usage high: ${snapshot.cpu.usage.toFixed(1)}%`,
        value: snapshot.cpu.usage,
        threshold: this.thresholds.cpu.warning,
        timestamp: new Date()
      })
}
    
    // Check Memory
    if (snapshot.memory.percentage >= this.thresholds.memory.critical) {
      alerts.push({ type: 'memory',
        level: 'critical',
        message: `Memory usage critical: ${snapshot.memory.percentage.toFixed(1)}%`,
        value: snapshot.memory.percentage,
        threshold: this.thresholds.memory.critical,
        timestamp: new Date()
      })
} else if (snapshot.memory.percentage >= this.thresholds.memory.warning) {
      alerts.push({ type: 'memory',
        level: 'warning',
        message: `Memory usage high: ${snapshot.memory.percentage.toFixed(1)}%`,
        value: snapshot.memory.percentage,
        threshold: this.thresholds.memory.warning,
        timestamp: new Date()
      })
}
    
    // Add alerts to snapshot
    snapshot.alerts = alerts;
    
    // Emit alerts
    alerts.forEach(alert => {
      this.emit('alert', alert)
};)
}

  /**
   * Get resource history
   */
  public getHistory(): ResourceSnapshot[] {
    return [...this.history]
}

  /**
   * Get latest snapshot
   */
  public getLatestSnapshot(): ResourceSnapshot | null {
    return this.history.length > 0 ? this.history[this.history.length - 1] : null
}

  /**
   * Get average resources over a time period
   */
  public getAverageResources(periodMs: number): { cpu: number;
    memory: number;
    loadAverage: number
} | null {
    if (this.history.length === 0) {r}eturn null;
    
    const now = Date.now();
    const relevantSnapshots = this.history.filter(;
      s => now - s.timestamp.getTime() <= periodMs;
    );
    
    if (relevantSnapshots.length === 0) {r}eturn null;
    
    const totals = relevantSnapshots.reduce((acc, snapshot) => ({ cpu: acc.cpu + snapshot.cpu.usage,
      memory: acc.memory + snapshot.memory.percentage,
      loadAverage: acc.loadAverage + snapshot.cpu.loadAverage[0]
}, { cpu: 0, memory: 0, loadAverage: 0 });
    
    return { cpu: totals.cpu / relevantSnapshots.length,
      memory: totals.memory / relevantSnapshots.length,
      loadAverage: totals.loadAverage / relevantSnapshots.length
    }
}

  /**
   * Check if resources are healthy
   */
  public isHealthy(): boolean {
    const latest = this.getLatestSnapshot();
    if (!latest) {r}eturn true;
    
    return latest.alerts.length === 0
}

  /**
   * Get resource recommendations
   */
  public getRecommendations(): string[] {
    const recommendations: string[] = [];
    const latest = this.getLatestSnapshot();
    
    if (!latest) {r}eturn recommendations;
    
    // CPU recommendations
    if (latest.cpu.usage > this.thresholds.cpu.warning) {
      recommendations.push('Consider scaling down concurrent agent tasks');
      recommendations.push('Increase pulse intervals for non-critical agents')
}
    
    // Memory recommendations
    if (latest.memory.percentage > this.thresholds.memory.warning) {
      recommendations.push('Reduce agent memory limits');
      recommendations.push('Clear agent task history more frequently');
      recommendations.push('Consider implementing agent hibernation')
}
    
    // Load average recommendations
    if (latest.cpu.loadAverage[0] > latest.cpu.cores) {
      recommendations.push('System is overloaded - reduce active agents');
      recommendations.push('Consider horizontal scaling')
}
    
    return recommendations
}

  /**
   * Export metrics for external monitoring
   */
  public exportMetrics(): object {
    const latest = this.getLatestSnapshot();
    const averages = this.getAverageResources(60000); // 1 minute average
    
    return {
      current?: latest { cpu_usage: latest.cpu.usage,
        memory_usage: latest.memory.percentage,
        load_average: latest.cpu.loadAverage[0],
        process_cpu: latest.process.cpu,
        process_memory: latest.process.memory,
        alerts: latest.alerts.length
      } : null,
      averages?: averages { cpu_usage_1m: averages.cpu,
        memory_usage_1m: averages.memory,
        load_average_1m: averages.loadAverage
      } : null,
      health: this.isHealthy() ? 'healthy' : 'unhealthy',
      recommendations: this.getRecommendations()
    }
}
})))