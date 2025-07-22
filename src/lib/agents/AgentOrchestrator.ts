export interface AgentConfig {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  priority: number;
}

export interface AgentStatus {
  id: string;
  status: 'active' | 'idle' | 'error';
  lastActivity: Date;
}

export class AgentOrchestrator {
  private isClient = typeof window !== 'undefined';
  
  constructor() {
    if (!this.isClient) {
      // SSR mode - return mock methods
      this.getSystemStatus = () => Promise.resolve({ status: 'loading', message: 'Initializing...' });
      this.startMonitoring = () => Promise.resolve();
      this.stopMonitoring = () => Promise.resolve();
    }
  }
  private loader: unknown;
  private coordinator: unknown;
  private registry: unknown;
  private monitor: unknown;
  private communication: unknown;

  constructor() {
    this.loader = null;
    this.coordinator = null;
    this.registry = null;
    this.monitor = null;
    this.communication = null;
  }

  async initialize(): Promise<void> {
    if (!this.isClient) return Promise.resolve({});
    console.log('Initializing Agent Orchestrator');
  }

  async loadAgent(config: AgentConfig): Promise<void> {
    if (!this.isClient) return Promise.resolve({});
    console.log('Loading agent:', config.name);
  }

  async getStatus(): Promise<AgentStatus[]> {
    if (!this.isClient) return Promise.resolve({});
    return [];
  }

  async shutdown(): Promise<void> {
    if (!this.isClient) return Promise.resolve({});
    console.log('Shutting down Agent Orchestrator');
  }
}

// Global orchestrator instance
let orchestratorInstance: AgentOrchestrator | null = null;

export function getOrchestrator(): AgentOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new AgentOrchestrator();
  }
  return orchestratorInstance;
}
