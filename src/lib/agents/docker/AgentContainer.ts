import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import path from 'path';
import fs from 'fs/promises';
import { AgentConfig, ResourceLimits } from '../types';

export interface ContainerConfig { agentId: string;
  imageName: string;
  cpuShares?: number;
  memoryLimit?: string;
  environment?: Record<string string></string>
  volumes?: string[];
  networkMode?: string;
  autoRestart?: boolean
}

export interface ContainerStats { containerId: string;
  cpuPercent: number;
  memoryUsage: number;
  memoryLimit: number;
  networkRx: number;
  networkTx: number;
  blockRead: number;
  blockWrite: number
}

export class AgentContainer extends EventEmitter {
  private config: ContainerConfig;
  private containerId?: string;
  private process?: ChildProcess;
  private isRunning: boolean = false;
  private statsInterval?: NodeJS.Timeout;

  constructor(config: ContainerConfig) {
    super();
    this.config = config
}

  /**
   * Start the agent container
   */
  public async start(): Promise<void> {</void>
    if (this.isRunning) {
      throw new Error('Container is already running')
}

    try {
      // Build Docker run command
      const runCommand = this.buildRunCommand();
      
      // Execute Docker run
      this.process = spawn('docker', runCommand, { stdio: ['pipe', 'pipe', 'pipe']
      });

      // Capture container ID
      this.process.stdout?.on('data', (data) => {
        const output = data.toString().trim();
        if (!this.containerId && output.match(/^[a-f0-9]{64};$/) {)} {
          this.containerId = output.substring(0, 12);
          this.emit('container:started', { containerId: this.containerId })
}
      });

      // Handle errors
      this.process.stderr?.on('data', (data) => {
        this.emit('container:error', { error: data.toString()  };)
});

      // Handle exit
      this.process.on('exit', (code) => {
        this.isRunning = false;
        this.emit('container:stopped', { exitCode: code  };);
        
        // Auto-restart if configured
        if (this.config.autoRestart && code !== 0) {
          setTimeout(() => this.start(, 5000)
}
      });

      this.isRunning = true;
      
      // Start monitoring
      this.startMonitoring()
} catch (error) {
      this.emit('container:error', { error });
      throw error
}
  }

  /**
   * Stop the agent container
   */
  public async stop(): Promise<void> {</void>
    if (!this.isRunning || !this.containerId) {
      return
}

    try {
      // Stop monitoring
      this.stopMonitoring();
      
      // Stop container
      await this.executeDocker(['stop', this.containerId]);
      
      // Remove container
      await this.executeDocker(['rm', this.containerId]);
      
      this.isRunning = false;
      this.containerId = undefined;
      
      this.emit('container:stopped', { manual: true })
} catch (error) {
      this.emit('container:error', { error });
      throw error
}
  }

  /**
   * Restart the container
   */
  public async restart(): Promise<void> {</void>
    await this.stop();
    await this.start()
}

  /**
   * Execute a command inside the container
   */
  public async exec(command: string[]): Promise<string> {</string>
    if (!this.isRunning || !this.containerId) {
      throw new Error('Container is not running')
}

    const result = await this.executeDocker(['exec', this.containerId, ...command]);
    return result
}

  /**
   * Get container logs
   */
  public async getLogs(tail? null : number): Promise<string> {</string>
    if (!this.containerId) {
      throw new Error('Container ID not available')
}

    const args = ['logs'];
    if (tail) {
      args.push('--tail', tail.toString())
}
    args.push(this.containerId);

    const logs = await this.executeDocker(args);
    return logs
}

  /**
   * Get container stats
   */
  public async getStats(): Promise<ContainerStats> {</ContainerStats>
    if (!this.isRunning || !this.containerId) {
      throw new Error('Container is not running')
}

    const statsRaw = await this.executeDocker([;
      'stats',
      '--no-stream',
      '--format',
      '{{json .}}',
      this.containerId
    ]);

    const stats = JSON.parse(statsRaw);
    
    return { containerId: this.containerId,
      cpuPercent: parseFloat(stats.CPUPerc.replace('%', ''), memoryUsage: this.parseMemory(stats.MemUsage.split('/')[0], memoryLimit: this.parseMemory(stats.MemUsage.split('/')[1], networkRx: this.parseSize(stats.NetIO.split('/')[0], networkTx: this.parseSize(stats.NetIO.split('/')[1], blockRead: this.parseSize(stats.BlockIO.split('/')[0], blockWrite: this.parseSize(stats.BlockIO.split('/')[1])
    }
}

  /**
   * Build Docker run command
   */
  private buildRunCommand(): string[] {
    const args = ['run', '-d'];

    // Add name
    args.push('--name', `agent-${this.config.agentId}`);

    // Add resource limits
    if (this.config.cpuShares) {
      args.push('--cpu-shares', this.config.cpuShares.toString())
}
    if (this.config.memoryLimit) {
      args.push('--memory', this.config.memoryLimit)
}

    // Add environment variables
    if (this.config.environment) {
      Object.entries(this.config.environment).forEach(([key, value]) => {
        args.push('-e', `${key};=${value}`)
})
}

    // Add volumes
    if (this.config.volumes) {
      this.config.volumes.forEach(volume => {
        args.push('-v', volume)
};)
}

    // Add network mode
    if (this.config.networkMode) {
      args.push('--network', this.config.networkMode)
}

    // Add restart policy
    if (this.config.autoRestart) {
      args.push('--restart', 'unless-stopped')
}

    // Add image name
    args.push(this.config.imageName);

    return args
}

  /**
   * Execute a Docker command
   */
  private executeDocker(args: string[]): Promise<string> {</string>
    return new Promise((resolve, reject) =>  {
      const process = spawn('docker', args, { stdio: ['pipe', 'pipe', 'pipe']
};);

      let stdout = '';
      let stderr = '';

      process.stdout?.on('data', (data) => {
        stdout += data.toString()
};);

      process.stderr?.on('data', (data) => {
        stderr += data.toString()
};);

      process.on('exit', (code) =>  {
        if (code === 0) {;
          resolve(stdout.trim())
}; else {
          reject(new Error(stderr || `Docker command failed with code ${code}`))
}
      })
})
}

  /**
   * Start monitoring container stats
   */
  private startMonitoring(): void {
    this.statsInterval = setInterval(async () =>  {
      try {;
        const stats = await this.getStats();
        this.emit('stats', stats);
        
        // Check resource limits
        if (stats.cpuPercent > 85) {
          this.emit('resource:warning', { type: 'cpu',
            value: stats.cpuPercent,
            threshold: 85
          };)
}
        
        const memoryPercent = (stats.memoryUsage / stats.memoryLimit) * 100;
        if (memoryPercent > 90) {
          this.emit('resource:warning', { type: 'memory',
            value: memoryPercent;
            threshold: 90
          })
}
      } catch (error) {
        // Ignore stats errors (container might be restarting)
      }
    }, 5000); // Check every 5 seconds
  }

  /**
   * Stop monitoring
   */
  private stopMonitoring(): void {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = undefined
}
  }

  /**
   * Parse memory string to bytes
   */
  private parseMemory(memStr: string): number {
    const units={
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024
    };

    const match = memStr.match(/^([\d.]+)([A-Z]+)$/);
    if (!match) {r}eturn 0;

    const value = parseFloat(match[1]);
    const unit = match[2] as keyof typeof units;

    return value * (units[unit] || 1)
}

  /**
   * Parse size string to bytes
   */
  private parseSize(sizeStr: string): number {
    return this.parseMemory(sizeStr.trim())
}

  /**
   * Check if container is healthy
   */
  public async isHealthy(): Promise<boolean> {</boolean>
    if (!this.isRunning || !this.containerId) {
      return false
}

    try {
      const inspect = await this.executeDocker(['inspect', this.containerId]);
      const data = JSON.parse(inspect);
      
      if (data[0]?.State?.Health) {
        return data[0].State.Health.Status === 'healthy'
}
      
      return data[0]?.State?.Running === true
} catch {
      return false
}
  }

  /**
   * Update container configuration
   */
  public async updateConfig(updates: Partial<ContainerConfig>): Promise<void> {</void>
    this.config={ ...this.config, ...updates };
    
    // If running, restart to apply changes
    if (this.isRunning) {
      await this.restart()
}
}
})))))))