export interface HealthIssue {
  id: string;
  type: 'error' | 'performance' | 'security' | 'configuration';
  severity: 'low' | 'medium' | 'high' | 'critical';
  component: string;
  description: string;
  detectedAt: Date;
  attempts: number;
  metadata?: Record<string, any>;
}

export interface HealingAction {
  issueId: string;
  action: string;
  command?: string;
  fileChanges?: Array<{ file: string; changes: string }>;
  success: boolean;
  timestamp: Date;
  result?: any;
  duration?: number;
}

export interface HealingStrategy {
  issueType: string;
  actions: Array<{
    name: string;
    execute: (issue: HealthIssue) => Promise<boolean>;
    rollback?: () => Promise<void>;
    description?: string;
    estimatedDuration?: number;
  }>;
  maxAttempts: number;
  cooldownPeriod?: number;
  priority?: number;
}

export interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  components: Record<string, {
    status: 'operational' | 'degraded' | 'down';
    lastCheck: Date;
    issues: string[];
  }>;
  metrics: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

export interface HealingReport {
  issueId: string;
  status: 'in-progress' | 'resolved' | 'failed' | 'escalated';
  actionsPerformed: HealingAction[];
  totalDuration: number;
  success: boolean;
  recommendation?: string;
  escalationReason?: string;
}

export type IssueType = 
  | 'memory-leak'
  | 'build-failure'
  | 'test-failure'
  | 'performance'
  | 'security'
  | 'database'
  | 'network'
  | 'disk-space'
  | 'configuration';

export type ComponentType =
  | 'api'
  | 'database'
  | 'cache'
  | 'frontend'
  | 'build-system'
  | 'test-runner'
  | 'monitoring'
  | 'security-scanner';