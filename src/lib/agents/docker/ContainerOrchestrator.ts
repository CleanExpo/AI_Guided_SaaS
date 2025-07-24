import { EventEmitter } from 'events';
import { AgentContainer, ContainerConfig, ContainerStats } from './AgentContainer';
import { Agent } from '../base/Agent';
import { ResourceMonitor } from '../runtime/ResourceMonitor';
import path from 'path';
import fs from 'fs/promises';

export interface ContainerOrchestratorConfig {
  maxContainers: number;
  baseImage?: string;
  networkName?: string;
  volumePrefix?: string;
  enableHealthChecks?: boolean;
  healthCheckInterval?: number;
}

export interface ContainerizedAgent {
  agent: Agent,
  container: AgentContainer,
  config: ContainerConfig,
  status: 'pending' | 'running' | 'stopped' | 'error';
  lastHealthCheck?: Date;
  healthStatus?: 'healthy' | 'unhealthy' | 'unknown';
}

export class ContainerOrchestrator extends EventEmitter {
  private config: ContainerOrchestratorConfig;
  private containers: Map<string, ContainerizedAgent> = new Map();
  private resourceMonitor: ResourceMonitor;
  private healthCheckInterval?: NodeJS.Timeout;
  private dockerfileTemplates: Map<string, string> = new Map();

  constructor(config: Partial<ContainerOrchestratorConfig> = {}) {
    super();
    
    this.config = {
      maxContainers: 10,
      baseImage: 'node:20-alpine',
      networkName: 'agent-network',
      volumePrefix: 'agent-data',
      enableHealthChecks: true,
      healthCheckInterval: 30000, // 30 seconds
      ...config
    };
    
    this.resourceMonitor = new ResourceMonitor();
    this.initializeDockerfileTemplates();
  }

  /**
   * Initialize Dockerfile templates for different agent types
   */
  private initializeDockerfileTemplates(): void {
    // Base template
    const baseTemplate = `
FROM ${this.config.baseImage}

# Install dependencies
RUN apk add --no-cache python3 make g++ git

# Create app directory
WORKDIR /agent

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy agent code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S agent && \\
    adduser -S -u 1001 -G agent agent

# Switch to non-root user
USER agent

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \\
  CMD node healthcheck.js || exit 1
`;

    // TypeScript agent template
    const typescriptTemplate = baseTemplate + `
# Install TypeScript globally
USER root
RUN npm install -g typescript @types/node
USER agent

# Entry point
CMD ["node", "dist/agents/specialized/TypeScriptAgent.js"]
`;

    // QA agent template
    const qaTemplate = baseTemplate + `
# Install testing tools
USER root
RUN npm install -g jest playwright
USER agent

# Entry point
CMD ["node", "dist/agents/specialized/QAAgent.js"]
`;

    // DevOps agent template
    const devopsTemplate = baseTemplate + `
# Install deployment tools
USER root
RUN apk add --no-cache docker-cli curl
USER agent

# Entry point
CMD ["node", "dist/agents/specialized/DevOpsAgent.js"]
`;

    this.dockerfileTemplates.set('typescript', typescriptTemplate);
    this.dockerfileTemplates.set('qa', qaTemplate);
    this.dockerfileTemplates.set('devops', devopsTemplate);
    this.dockerfileTemplates.set('default', baseTemplate);
  }

  /**
   * Start the container orchestrator
   */
  public async start(): Promise<void> {
    // Start resource monitoring
    this.resourceMonitor.start();
    
    // Create Docker network
    await this.createNetwork();
    
    // Start health checks
    if (this.config.enableHealthChecks) {
      this.startHealthChecks();
    }
    
    this.emit('orchestrator:started');
  }

  /**
   * Stop the container orchestrator
   */
  public async stop(): Promise<void> {
    // Stop health checks
    this.stopHealthChecks();
    
    // Stop all containers
    await Promise.all(
      Array.from(this.containers.values()).map(ca => 
        this.stopContainer(ca.agent.getConfig().id)
      )
    );
    
    // Stop resource monitoring
    this.resourceMonitor.stop();
    
    this.emit('orchestrator:stopped');
  }

  /**
   * Deploy an agent in a container
   */
  public async deployAgent(agent: Agent, customConfig?: Partial<ContainerConfig>): Promise<void> {
    const agentConfig = agent.getConfig();
    const agentId = agentConfig.id;
    
    if (this.containers.has(agentId)) {
      throw new Error(`Agent ${agentId} is already deployed`);
    }
    
    if (this.containers.size >= this.config.maxContainers) {
      throw new Error('Maximum container limit reached');
    }
    
    try {
      // Build Docker image for agent
      const imageName = await this.buildAgentImage(agent);
      
      // Prepare container configuration
      const containerConfig: ContainerConfig = {
        agentId,
        imageName,
        cpuShares: this.calculateCpuShares(agentConfig.resources?.cpu),
        memoryLimit: agentConfig.resources?.memory || '512MB',
        environment: {
          NODE_ENV: 'production',
          AGENT_ID: agentId,
          AGENT_TYPE: agentConfig.type,
          ...customConfig?.environment
        },
        volumes: [
          `${this.config.volumePrefix}-${agentId}:/agent/data`,
          ...customConfig?.volumes || []
        ],
        networkMode: this.config.networkName,
        autoRestart: true,
        ...customConfig
      };
      
      // Create container
      const container = new AgentContainer(containerConfig);
      
      // Set up event handlers
      this.setupContainerEventHandlers(container, agentId);
      
      // Store containerized agent
      const containerizedAgent: ContainerizedAgent = {
        agent,
        container,
        config: containerConfig,
        status: 'pending',
        healthStatus: 'unknown'
      };
      
      this.containers.set(agentId, containerizedAgent);
      
      // Start container
      await container.start();
      containerizedAgent.status = 'running';
      
      this.emit('agent:deployed', { agentId });
      
    } catch (error) {
      this.emit('agent:deploy:error', { agentId, error });
      throw error;
    }
  }

  /**
   * Stop a containerized agent
   */
  public async stopContainer(agentId: string): Promise<void> {
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

  /**
   * Scale an agent by deploying multiple instances
   */
  public async scaleAgent(agentId: string, instances: number): Promise<void> {
    const containerizedAgent = this.containers.get(agentId);
    if (!containerizedAgent) {
      throw new Error(`Agent ${agentId} is not deployed`);
    }
    
    const baseAgent = containerizedAgent.agent;
    const baseConfig = containerizedAgent.config;
    
    // Deploy additional instances
    for (let i = 1; i < instances; i++) {
      const scaledAgent = this.cloneAgent(baseAgent, `${agentId}-${i}`);

    const scaledConfig = {
        ...baseConfig,
        agentId: scaledAgent.getConfig().id
      };
      
      await this.deployAgent(scaledAgent, scaledConfig);
    }
    
    this.emit('agent:scaled', { agentId, instances });
  }

  /**
   * Build Docker image for an agent
   */
  private async buildAgentImage(agent: Agent): Promise<string> {
    const agentType = agent.getConfig().type;
    const imageName = `agent-${agent.getConfig().id}:latest`;
    
    // Get appropriate Dockerfile template
    const dockerfile = this.dockerfileTemplates.get(agentType) || 
                      this.dockerfileTemplates.get('default')!;
    
    // Create temporary build directory
    const buildDir = path.join(process.cwd(), '.docker-build', agent.getConfig().id);
    await fs.mkdir(buildDir, { recursive: true });
    
    try {
      // Write Dockerfile
      await fs.writeFile(path.join(buildDir, 'Dockerfile'), dockerfile);
      
      // Copy necessary files
      await this.copyAgentFiles(buildDir);
      
      // Build image
      await this.buildDockerImage(buildDir, imageName);
      
      return imageName;
    } finally {
      // Clean up build directory
      await fs.rm(buildDir, { recursive: true, force: true });
    }
  }

  /**
   * Copy agent files to build directory
   */
  private async copyAgentFiles(buildDir: string): Promise<void> {
    // Copy package files
    await fs.copyFile('package.json', path.join(buildDir, 'package.json'));
    await fs.copyFile('package-lock.json', path.join(buildDir, 'package-lock.json'));
    
    // Copy agent source files
    const srcDir = path.join(buildDir, 'src', 'lib', 'agents');
    await fs.mkdir(srcDir, { recursive: true });
    await this.copyDirectory(path.join('src', 'lib', 'agents'), srcDir);
    
    // Create health check script
    const healthCheckScript = `
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('healthy');
});

server.listen(3000);
`;
    
    await fs.writeFile(path.join(buildDir, 'healthcheck.js'), healthCheckScript);
  }

  /**
   * Copy directory recursively
   */
  private async copyDirectory(src: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
        }
}

  /**
   * Build Docker image
   */
  private async buildDockerImage(buildDir: string, imageName: string): Promise<void> {
    const { spawn } = await import('child_process');
    
    return new Promise((resolve, reject) => {
      const process = spawn('docker', ['build', '-t', imageName, '.'], {
        cwd: buildDir,
        stdio: 'inherit'
      });
      
      process.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Docker build failed with code ${code}`));
        }
      });
    });
  }

  /**
   * Create Docker network
   */
  private async createNetwork(): Promise<void> {
    const { spawn } = await import('child_process');
    
    return new Promise((resolve) => {
      const process = spawn('docker', [
        'network', 'create', '--driver', 'bridge', this.config.networkName!
      ]);
      
      process.on('exit', () => {
        // Ignore errors (network might already exist)
        resolve();
      });
    });
  }

  /**
   * Set up container event handlers
   */
  private setupContainerEventHandlers(container: AgentContainer, agentId: string): void {
    container.on('container:started', (data) => {
      this.emit('container:started', { agentId, ...data });
    });
    
    container.on('container:stopped', (data) => {
      this.emit('container:stopped', { agentId, ...data });
      
      const containerizedAgent = this.containers.get(agentId);
      if (containerizedAgent) {
        containerizedAgent.status = 'stopped';
      }
    });
    
    container.on('container:error', (data) => {
      this.emit('container:error', { agentId, ...data });
      
      const containerizedAgent = this.containers.get(agentId);
      if (containerizedAgent) {
        containerizedAgent.status = 'error';
      }
    });
    
    container.on('stats', (stats) => {
      this.emit('container:stats', { agentId, stats });
    });
    
    container.on('resource:warning', (data) => {
      this.emit('resource:warning', { agentId, ...data });
    });
  }

  /**
   * Start health checks
   */
  private startHealthChecks(): void {
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
    }, this.config.healthCheckInterval!);
  }

  /**
   * Stop health checks
   */
  private stopHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
  }

  /**
   * Calculate CPU shares based on CPU limit
   */
  private calculateCpuShares(cpuLimit?: number): number {
    // Docker CPU shares: 1024 = 1 CPU
    return cpuLimit ? cpuLimit * 10.24 : 512; // Default to 0.5 CPU
  }

  /**
   * Clone an agent with a new ID
   */
  private cloneAgent(agent: Agent, newId: string): Agent {
    const config = agent.getConfig();
    const AgentClass = agent.constructor as new (config: any) => Agent;
    
    return new AgentClass({
      ...config,
      id: newId
    });
  }

  /**
   * Get container statistics
   */
  public async getContainerStats(): Promise<Map<string, ContainerStats>> {
    const stats = new Map<string, ContainerStats>();
    
    for (const [agentId, containerizedAgent] of this.containers) {
      if (containerizedAgent.status === 'running') {
        try {
          const containerStats = await containerizedAgent.container.getStats();
          stats.set(agentId, containerStats);
        } catch (error) {
          // Ignore errors for individual containers
          }
}
    
    return stats;
  }

  /**
   * Get orchestrator status
   */
  public getStatus(): {
    totalContainers: number,
    runningContainers: number,
    healthyContainers: number,
    resourceUsage: any;
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
    
    return {
      totalContainers: this.containers.size,
      runningContainers,
      healthyContainers,
      resourceUsage: this.resourceMonitor.getLatestSnapshot()
    };
  }
}