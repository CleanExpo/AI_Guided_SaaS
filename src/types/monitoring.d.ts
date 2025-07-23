export interface MonitoringDashboard {
  agents: Agent[],
  recent_activity: ActivityLog[],
  performance_metrics: PerformanceMetric
s,
    error_logs: ErrorLog[]
};
export interface Agent {
  id: string,
  name: string,
  status: 'active' | 'idle' | 'error',
  last_activity?: string
};
export interface ActivityLog {
  timestamp: string,
  agent_id: string,
  action: string,
  details?
};
export interface PerformanceMetrics {
  cpu_usage: number,
  memory_usage: number,
  response_time: number
};
export interface ErrorLog {
  timestamp: string,
  error: string,
  agent_id?: string
}