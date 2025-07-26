export interface ContainerOrchestratorConfig {
  maxContainers: number;
  baseImage?: string;
  networkName?: string;
  volumePrefix?: string;
  enableHealthChecks?: boolean;
  healthCheckInterval?: number;
}

export interface ContainerizedAgent {
  agent: any; // Agent type
  container: any; // AgentContainer type
  config: any; // ContainerConfig type
  status: 'pending' | 'running' | 'stopped' | 'error';
  lastHealthCheck?: Date;
  healthStatus?: 'healthy' | 'unhealthy' | 'unknown';
}

export interface OrchestratorStatus {
  totalContainers: number;
  runningContainers: number;
  healthyContainers: number;
  resourceUsage: any;
}