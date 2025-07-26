export interface HealthIssue {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  category: 'security' | 'dependency' | 'module' | 'performance' | 'ux';
  title: string;
  description: string;
  file?: string;
  line?: number;
  autoFixable: boolean;
  estimatedTime: number; // seconds
}

export interface BatchConfig {
  maxIssuesPerBatch: number;
  maxTimePerBatch: number; // seconds
  pauseBetweenBatches: number; // seconds
  requireConfirmation: boolean;
}

export interface CheckpointState {
  completedIssues: string[];
  currentBatch: number;
  totalBatches: number;
  startTime: number;
  lastCheckpoint: number;
}

export interface SafeModeHealthCheckState {
  issues: HealthIssue[];
  isScanning: boolean;
  isProcessing: boolean;
  currentBatch: HealthIssue[];
  checkpoint: CheckpointState | null;
  processingLog: string[];
  batchConfig: BatchConfig;
}