import * as os from 'os';
import { EventEmitter } from 'events';

interface ResourceMetrics {
  cpu: {
    usage: number; // Percentage (0-100)
    cores: number,
    model: string
  };
  memory: {
    total: number; // Bytes
    used: number; // Bytes
    free: number; // Bytes
    percentage: number; // Percentage (0-100)
  };
  disk: {
    total: number; // Bytes
    used: number; // Bytes
    free: number; // Bytes
    percentage: number; // Percentage (0-100)
  };
  network: {
    bandwidth: number; // Bytes/sec
    latency: number; // Milliseconds
  };
  battery?: {
    level: number; // Percentage (0-100)
    isCharging: boolean
  };
}

interface ResourceThresholds {
  cpu: {
    warning: number,
    critical: number
  };
  memory: {
    warning: number,
    critical: number
  };
  disk: {
    warning: number,
    critical: number
  };
  battery?: {
    low: number,
    critical: number
  };
}

interface PerformanceProfile {
  name: string,
  cpuLimit: number,
  memoryLimit: number,
  concurrentTasks: number,
  enableBackground: boolean,
  throttleNetwork: boolean
}

type ResourceLevel = 'optimal' | 'warning' | 'critical';
type AdaptiveAction = 'throttle' | 'pause' | 'reduce' | 'optimize' | 'normal';

interface AdaptiveStrategy {
  level: ResourceLevel,
  actions: AdaptiveAction[],
  profile: PerformanceProfile
}

class ResourceAwareSystem extends EventEmitter {
  private metrics: ResourceMetrics | null = null;
  private thresholds: ResourceThresholds;
  private currentProfile: PerformanceProfile;
  private monitorInterval: NodeJS.Timeout | null = null;
  private isMonitoring: boolean = false;
  private adaptiveMode: boolean = true;
  private history: ResourceMetrics[] = [];
  private maxHistorySize: number = 100;

  private profiles: Map<string, PerformanceProfile> = new Map([
    ['high-performance', {
      name: 'high-performance',
      cpuLimit: 90,
      memoryLimit: 85,
      concurrentTasks: 10,
      enableBackground: true,
      throttleNetwork: false
    }],
    ['balanced', {
      name: 'balanced',
      cpuLimit: 70,
      memoryLimit: 70,
      concurrentTasks: 5,
      enableBackground: true,
      throttleNetwork: false
    }],
    ['power-saver', {
      name: 'power-saver',
      cpuLimit: 50,
      memoryLimit: 60,
      concurrentTasks: 3,
      enableBackground: false,
      throttleNetwork: true
    }],
    ['minimal', {
      name: 'minimal',
      cpuLimit: 30,
      memoryLimit: 50,
      concurrentTasks: 1,
      enableBackground: false,
      throttleNetwork: true
    }]
  ]);

  constructor(thresholds?: Partial<ResourceThresholds>) {
    super();
    
    this.thresholds = {
      cpu: { warning: 70, critical: 90 },
      memory: { warning: 75, critical: 90 },
      disk: { warning: 85, critical: 95 },
      battery: { low: 20, critical: 10 },
      ...thresholds
    };

    this.currentProfile = this.profiles.get('balanced')!;
  }

  async startMonitoring(intervalMs: number = 5000): Promise<void> {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    
    // Initial reading
    await this.updateMetrics();

    // Set up interval monitoring
    this.monitorInterval = setInterval(async () => {
      await this.updateMetrics();
      this.analyzeAndAdapt();
    }, intervalMs);

    this.emit('monitoring: started')
  }

  stopMonitoring(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    this.isMonitoring = false;
    this.emit('monitoring: stopped')
  }

  private async updateMetrics(): Promise<void> {
    const cpuUsage = await this.getCPUUsage();
    const memoryInfo = this.getMemoryInfo();
    const diskInfo = await this.getDiskInfo();
    const networkInfo = await this.getNetworkInfo();
    const batteryInfo = await this.getBatteryInfo();

    this.metrics = {
      cpu: {
        usage: cpuUsage,
        cores: os.cpus().length,
        model: os.cpus()[0]?.model || 'Unknown'
      },
      memory: memoryInfo,
      disk: diskInfo,
      network: networkInfo,
      ...(batteryInfo && { battery: batteryInfo })
    };

    // Add to history
    this.history.push({ ...this.metrics });
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }

    this.emit('metrics:updated', this.metrics);
  }

  private async getCPUUsage(): Promise<number> {
    const cpus = os.cpus();
    const totalIdle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
    const totalTick = cpus.reduce((acc, cpu) => 
      acc + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq, 0
    );

    // Wait a bit and measure again for accurate usage
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const cpus2 = os.cpus();
    const totalIdle2 = cpus2.reduce((acc, cpu) => acc + cpu.times.idle, 0);
    const totalTick2 = cpus2.reduce((acc, cpu) => 
      acc + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq, 0
    );

    const idleDiff = totalIdle2 - totalIdle;
    const totalDiff = totalTick2 - totalTick;
    
    const usage = 100 - Math.floor(100 * idleDiff / totalDiff);
    return Math.max(0, Math.min(100, usage));
  }

  private getMemoryInfo() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const percentage = (used / total) * 100;

    return { total, used, free, percentage };
  }

  private async getDiskInfo() {
    // Simplified disk info - in production, use proper disk usage library
    const total = 500 * 1024 * 1024 * 1024; // 500GB dummy
    const free = 100 * 1024 * 1024 * 1024; // 100GB dummy
    const used = total - free;
    const percentage = (used / total) * 100;

    return { total, used, free, percentage };
  }

  private async getNetworkInfo() {
    // Simplified network info
    return {
      bandwidth: 10 * 1024 * 1024, // 10 MB/s dummy
      latency: 20 // 20ms dummy
    };
  }

  private async getBatteryInfo() {
    // Battery info would require platform-specific implementation
    // Return null for desktop systems
    if (os.platform() === 'darwin' || os.platform() === 'win32') {
      // Dummy battery info for laptops
      return {
        level: 65,
        isCharging: true
      };
    }
    return null;
  }

  private analyzeAndAdapt(): void {
    if (!this.adaptiveMode || !this.metrics) {
      return;
    }

    const strategy = this.determineStrategy();
    
    if (strategy.actions.length > 0) {
      this.applyStrategy(strategy);
      this.emit('adaptation:applied', strategy);
    }
  }

  private determineStrategy(): AdaptiveStrategy {
    if (!this.metrics) {
      return { level: 'optimal', actions: [], profile: this.currentProfile };
    }

    const cpuLevel = this.getResourceLevel(this.metrics.cpu.usage, this.thresholds.cpu);
    const memoryLevel = this.getResourceLevel(this.metrics.memory.percentage, this.thresholds.memory);
    const diskLevel = this.getResourceLevel(this.metrics.disk.percentage, this.thresholds.disk);
    
    // Determine overall system level
    const levels = [cpuLevel, memoryLevel, diskLevel];
    const criticalCount = levels.filter(l => l === 'critical').length;
    const warningCount = levels.filter(l => l === 'warning').length;

    let overallLevel: ResourceLevel = 'optimal';
    let actions: AdaptiveAction[] = [];
    let profile = this.currentProfile;

    if (criticalCount > 0) {
      overallLevel = 'critical';
      actions = ['throttle', 'pause', 'reduce'];
      profile = this.profiles.get('minimal')!;
    } else if (warningCount >= 2) {
      overallLevel = 'warning';
      actions = ['throttle', 'optimize'];
      profile = this.profiles.get('power-saver')!;
    } else if (warningCount === 1) {
      overallLevel = 'warning';
      actions = ['optimize'];
      profile = this.profiles.get('balanced')!;
    } else {
      overallLevel = 'optimal';
      actions = ['normal'];
      profile = this.profiles.get('high-performance')!;
    }

    // Check battery if available
    if (this.metrics.battery && !this.metrics.battery.isCharging) {
      if (this.metrics.battery.level <= this.thresholds.battery!.critical) {
        overallLevel = 'critical';
        actions = ['throttle', 'pause'];
        profile = this.profiles.get('minimal')!;
      } else if (this.metrics.battery.level <= this.thresholds.battery!.low) {
        if (overallLevel === 'optimal') {
          overallLevel = 'warning';
          actions = ['optimize'];
          profile = this.profiles.get('power-saver')!;
        }
      }
    }

    return { level: overallLevel, actions, profile };
  }

  private getResourceLevel(usage: number, threshold: { warning: number, critical: number }): ResourceLevel {
    if (usage >= threshold.critical) return 'critical';
    if (usage >= threshold.warning) return 'warning';
    return 'optimal';
  }

  private applyStrategy(strategy: AdaptiveStrategy): void {
    this.currentProfile = strategy.profile;
    
    // Apply specific actions based on strategy
    strategy.actions.forEach(action => {
      switch (action) {
        case 'throttle':
          this.emit('action:throttle', {
            cpuLimit: strategy.profile.cpuLimit,
            memoryLimit: strategy.profile.memoryLimit
          });
          break;
        
        case 'pause':
          this.emit('action:pause', {
            pauseBackground: !strategy.profile.enableBackground
          });
          break;
        
        case 'reduce':
          this.emit('action:reduce', {
            concurrentTasks: strategy.profile.concurrentTasks
          });
          break;
        
        case 'optimize':
          this.emit('action:optimize', {
            throttleNetwork: strategy.profile.throttleNetwork
          });
          break;
        
        case 'normal':
          this.emit('action:normal', strategy.profile);
          break;
      }
    });
  }

  // Public API
  getCurrentMetrics(): ResourceMetrics | null {
    return this.metrics;
  }

  getCurrentProfile(): PerformanceProfile {
    return this.currentProfile;
  }

  setProfile(profileName: string): boolean {
    const profile = this.profiles.get(profileName);
    if (profile) {
      this.currentProfile = profile;
      this.emit('profile:changed', profile);
      return true;
    }
    return false;
  }

  setAdaptiveMode(enabled: boolean): void {
    this.adaptiveMode = enabled;
    this.emit('adaptive:changed', enabled);
  }

  getResourceHistory(): ResourceMetrics[] {
    return [...this.history];
  }

  getAverageMetrics(periodMs: number = 60000): ResourceMetrics | null {
    if (this.history.length === 0) return null;

    const now = Date.now();
    const relevantMetrics = this.history.slice(-Math.ceil(periodMs / 5000));
    
    if (relevantMetrics.length === 0) return null;

    const avgCpu = relevantMetrics.reduce((sum, m) => sum + m.cpu.usage, 0) / relevantMetrics.length;
    const avgMemory = relevantMetrics.reduce((sum, m) => sum + m.memory.percentage, 0) / relevantMetrics.length;
    
    return {
      cpu: {
        usage: avgCpu,
        cores: this.metrics?.cpu.cores || 0,
        model: this.metrics?.cpu.model || 'Unknown'
      },
      memory: {
        total: this.metrics?.memory.total || 0,
        used: this.metrics?.memory.used || 0,
        free: this.metrics?.memory.free || 0,
        percentage: avgMemory
      },
      disk: this.metrics?.disk || { total: 0, used: 0, free: 0, percentage: 0 },
      network: this.metrics?.network || { bandwidth: 0, latency: 0 },
      ...(this.metrics?.battery && { battery: this.metrics.battery })
    };
  }

  getRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (!this.metrics) return recommendations;

    if (this.metrics.cpu.usage > 80) {
      recommendations.push('Consider closing unnecessary applications to reduce CPU usage');
    }
    
    if (this.metrics.memory.percentage > 85) {
      recommendations.push('Memory usage is high. Consider closing some browser tabs or applications');
    }
    
    if (this.metrics.disk.percentage > 90) {
      recommendations.push('Disk space is running low. Clean up unnecessary files');
    }
    
    if (this.metrics.battery && !this.metrics.battery.isCharging && this.metrics.battery.level < 20) {
      recommendations.push('Battery is low. Connect to power source or enable power-saving mode');
    }

    return recommendations;
  }
}

// Singleton instance
let resourceAwareInstance: ResourceAwareSystem | null = null;

export function initializeResourceAware(thresholds?: Partial<ResourceThresholds>): ResourceAwareSystem {
  if (!resourceAwareInstance) {
    resourceAwareInstance = new ResourceAwareSystem(thresholds);
  }
  return resourceAwareInstance;
}

export function getResourceAware(): ResourceAwareSystem {
  if (!resourceAwareInstance) {
    throw new Error('Resource-Aware System not initialized');
  }
  return resourceAwareInstance;
}

export { 
  ResourceAwareSystem, 
  type ResourceMetrics, 
  type ResourceThresholds, 
  type PerformanceProfile,
  type ResourceLevel,
  type AdaptiveAction,
  type AdaptiveStrategy 
};