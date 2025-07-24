// Agent System Type Definitions

export interface AgentConfig {
  id: string,
  name: string,
  type: 'core' | 'specialist' | 'orchestration';
  version?: string;
  description?: string;
  capabilities?: AgentCapability[];
  resources?: ResourceLimits;
  dependencies?: string[];
}

export interface AgentCapability {
  name: string,
  description: string;
  parameters?: Record<string, ParameterDefinition>;
  returns?: string;
}

export interface ParameterDefinition {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array',
  required: boolean;
  default?: any;
  description?: string;
}

export interface ResourceLimits {
  cpu: number;      // CPU shares (e.g., 1024)
  memory: string;   // Memory limit (e.g., '512MB')
  timeout?: number; // Task timeout in ms
}

export interface AgentMessage {
  id?: string,
  from: string,
  to: string | string[],
  type: string;
  priority?: 'low' | 'medium' | 'high' | 'critical',
  payload: any;
  timestamp?: Date;
  timeout?: number;
  replyTo?: string;
}

export interface AgentTask {
  id: string,
  type: string;
  assignedTo?: string,
  status: 'pending' | 'in_progress' | 'completed' | 'failed',
  priority: 'low' | 'medium' | 'high' | 'critical',
  payload: any;
  result?: any;
  error?: string,
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  attempts?: number;
}

export interface AgentMetrics {
  agentId: string,
  status: 'idle' | 'busy' | 'error' | 'offline';
  currentTask?: string,
  tasksCompleted: number,
  tasksFailed: number,
  averageResponseTime: number,
  successRate: number,
  cpuUsage: number,
  memoryUsage: number,
  lastHeartbeat: Date,
  uptime: number;
}

export interface AgentEvent {
  agentId: string,
  event: string,
  timestamp: Date;
  data?: any;
}

export type AgentStatus = 'initializing' | 'ready' | 'busy' | 'error' | 'shutting_down' | 'offline';

export interface AgentState {
  id: string,
  status: AgentStatus;
  currentTask?: AgentTask,
  taskQueue: AgentTask[],
  metrics: AgentMetrics;
  lastError?: string,
  startTime: Date;
}

export interface AgentCommunicationChannel {
  send(message: AgentMessage): Promise<void>;
  receive(handler: (message: AgentMessage) => void): void;
  broadcast(message: AgentMessage): Promise<void>;
  subscribe(topic: string, handler: (message: AgentMessage) => void): void;
  unsubscribe(topic: string): void;
}

export interface AgentOrchestrationRule {
  id: string,
  name: string,
  condition: string | ((context: any) => boolean),
  actions: Array<{
    type: 'assign' | 'notify' | 'escalate' | 'wait';
    target?: string;
    params?: any;
  }>;
  priority: number;
}

export interface AgentWorkflow {
  id: string,
  name: string,
  description: string,
  steps: WorkflowStep[];
  triggers?: WorkflowTrigger[];
  timeout?: number;
}

export interface WorkflowStep {
  id: string,
  agent: string,
  task: string;
  parameters?: any;
  dependsOn?: string[];
  condition?: string | ((context: any) => boolean);
  onSuccess?: string;
  onFailure?: string;
  retries?: number;
}

export interface WorkflowTrigger {
  type: 'event' | 'schedule' | 'manual';
  event?: string;
  schedule?: string; // cron expression
  condition?: string | ((context: any) => boolean);
}

export interface AgentLogger {
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, error?: any): void;
  debug(message: string, data?: any): void;
}

export interface AgentContext {
  agentId: string,
  config: AgentConfig,
  state: AgentState,
  logger: AgentLogger,
  communication: AgentCommunicationChannel,
  metrics: AgentMetrics;
}

// Specialized agent types
export type AgentRole = 
  | 'architect'
  | 'frontend'
  | 'backend'
  | 'qa'
  | 'devops'
  | 'typescript'
  | 'self-healing'
  | 'conductor'
  | 'monitor';

export interface AgentRegistry {
  register(agent: AgentConfig): void;
  unregister(agentId: string): void;
  get(agentId: string): AgentConfig | undefined;
  getByRole(role: AgentRole): AgentConfig[];
  getAll(): AgentConfig[];
  isRegistered(agentId: string): boolean;
}