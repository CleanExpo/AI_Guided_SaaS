import { EventEmitter } from 'events';
import { AgentContainer, ContainerConfig, ContainerStats } from './AgentContainer';
import { Agent } from '../base/Agent';
import { ResourceMonitor } from '../runtime/ResourceMonitor';
import {
  ContainerOrchestratorConfig,
  ContainerizedAgent,
  OrchestratorStatus,
  DockerImageBuilder,
  HealthCheckManager,
  NetworkManager,
  ContainerManager
} from './orchestrator';

export class ContainerOrchestrator extends EventEmitter {
  private config: ContainerOrchestratorConfig;
  private resourceMonitor: ResourceMonitor;
  private imageBuilder: DockerImageBuilder;
  private healthCheckManager: HealthCheckManager;
  private networkManager: NetworkManager;
  private containerManager: ContainerManager;

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
    this.imageBuilder = new DockerImageBuilder(this.config.baseImage);
    this.networkManager = new NetworkManager(this.config.networkName);
    this.containerManager = new ContainerManager(this.config);
    this.healthCheckManager = new HealthCheckManager()
      this.containerManager.getAllContainers(),
      this.config.healthCheckInterval
    );

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // Forward container manager events
    this.containerManager.on('container:started', (data) => {
      this.emit('container:started', data);
    });

    this.containerManager.on('container:stopped', (data) => {
      this.emit('container:stopped', data);
    });

    this.containerManager.on('container:error', (data) => {
      this.emit('container:error', data);
    });

    this.containerManager.on('container:stats', (data) => {
      this.emit('container:stats', data);
    });

    this.containerManager.on('resource:warning', (data) => {
      this.emit('resource:warning', data);
    });

    this.containerManager.on('agent:stopped', (data) => {
      this.emit('agent:stopped', data);
    });

    this.containerManager.on('agent:stop:error', (data) => {
      this.emit('agent:stop:error', data);
    });

    // Forward health check manager events
    this.healthCheckManager.on('container:unhealthy', (data) => {
      this.emit('container:unhealthy', data);
    });

    this.healthCheckManager.on('health:check:error', (data) => {
      this.emit('health:check:error', data);
    });
  }

  /**
   * Start the container orchestrator
   */
  public async start(): Promise<void> {
    // Start resource monitoring
    this.resourceMonitor.start();
    
    // Create Docker network
    await this.networkManager.createNetwork();
    
    // Start health checks
    if (this.config.enableHealthChecks) {
      this.healthCheckManager.start();
    }
    
    this.emit('orchestrator:started');
  }

  /**
   * Stop the container orchestrator
   */
  public async stop(): Promise<void> {
    // Stop health checks
    this.healthCheckManager.stop();
    
    // Stop all containers
    await this.containerManager.stopAllContainers();
    
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
    
    try {
      // Build Docker image for agent
      const imageName = await this.imageBuilder.buildAgentImage(agent);
      
      // Prepare container configuration
      const containerConfig: ContainerConfig = {
        agentId,
        imageName,
        cpuShares: this.containerManager.calculateCpuShares(agentConfig.resources?.cpu),
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
      
      // Store containerized agent
      const containerizedAgent: ContainerizedAgent = {
        agent,
        container,
        config: containerConfig,
        status: 'pending',
        healthStatus: 'unknown'
      };
      
      this.containerManager.addContainer(agentId, containerizedAgent);
      
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
    return this.containerManager.stopContainer(agentId);
  }

  /**
   * Scale an agent by deploying multiple instances
   */
  public async scaleAgent(agentId: string, instances: number): Promise<void> {
    const containerizedAgent = this.containerManager.getContainer(agentId);
    if (!containerizedAgent) {
      throw new Error(`Agent ${agentId} is not deployed`);
    }
    
    const baseAgent = containerizedAgent.agent;
    const baseConfig = containerizedAgent.config;
    
    // Deploy additional instances
    for (let i = 1; i < instances; i++) {
      const scaledAgent = this.containerManager.cloneAgent(baseAgent, `${agentId}-${i}`);
      const scaledConfig = {
        ...baseConfig,
        agentId: scaledAgent.getConfig().id
      };
      
      await this.deployAgent(scaledAgent, scaledConfig);
    }
    
    this.emit('agent:scaled', { agentId, instances });
  }

  /**
   * Get container statistics
   */
  public async getContainerStats(): Promise<Map<string, ContainerStats> {
    const stats = new Map<string, ContainerStats>();
    
    for (const [agentId, containerizedAgent] of this.containerManager.getAllContainers()) {
      if (containerizedAgent.status === 'running') {
        try {
          const containerStats = await containerizedAgent.container.getStats();
          stats.set(agentId, containerStats);
        } catch (error) {
          // Ignore errors for individual containers
        }
      }
    }
    
    return stats;
  }

  /**
   * Get orchestrator status
   */
  public getStatus(): OrchestratorStatus {
    const containerStatus = this.containerManager.getStatus();
    
    return {
      ...containerStatus,
      resourceUsage: this.resourceMonitor.getLatestSnapshot()
    };
  }

  /**
   * Get health status of all containers
   */
  public getHealthStatus(): Record<string, any> {
    return this.healthCheckManager.getHealthStatus();
  }

  /**
   * Get network information
   */
  public getNetworkName(): string {
    return this.networkManager.getNetworkName();
  }

  /**
   * List all Docker networks
   */
  public async listNetworks(): Promise<string[]> {
    return this.networkManager.listNetworks();
  }
}