/* BREADCRUMB: library - Shared library code */;
import { AgentRegistry, AgentRegistration } from './AgentRegistry';
import { AgentCoordinator } from './AgentCoordinator';
import { mcp__memory__add_observations } from '@/lib/mcp';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { logger } from '@/lib/logger';
export interface HealthCheck { agent_id: string;
  timestamp: Date;
  status: 'healthy' | 'warning' | 'critical' | 'offline',
  response_time: number;
  memory_usage?: number,
  cpu_usage?: number,
    error_rate: number;
  last_activity: Date;
  checks_passed: number;
  checks_failed: number;
  details: Record<string any  />, export</string>
}

interface MonitoringAlert { id: string;
  agent_id: string;
  severity: 'info' | 'warning' | 'critical' | 'emergency',
  type: 'health' | 'performance' | 'error' | 'availability',
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
  metadata: Record<string any  />, export interface MonitoringMetrics {</string>
    agent_id: string;
  timestamp: Date;
  metrics: { uptime: number;
  response_time: number;
  throughput: number;
  error_rate: number;
  memory_usage: number;
  success_rate: number;
  queue_length: number;
  active_tasks: number
}

export interface MonitoringDashboard { overview: {
  total_agents: number;
  healthy_agents: number;
  warning_agents: number;
  critical_agents: number;
  offline_agents: number;
  system_health_score: number
}
  recent_alerts: MonitoringAlert[], performance_trends: MonitoringMetrics[],
  agent_status: Record<string HealthCheck>,</string>
  coordination_metrics: Record<string any>,</string>
  last_updated: Date
};
export class AgentMonitor {
  private static instance: AgentMonitor
  private registry: AgentRegistry
  private coordinator: AgentCoordinator
  private healthChecks: Map<string HealthCheck> = new Map(, private alerts: Map<string MonitoringAlert> = new Map(), private metricsHistory: MonitoringMetrics[] = []</string>
  private monitoringInterval: NodeJS.Timeout | null = null
  private alertsFilePath: string
  private metricsFilePath: string;
constructor() {
    this.registry = AgentRegistry.getInstance();
    this.coordinator = AgentCoordinator.getInstance();
    this.alertsFilePath = join(process.cwd(, 'logs', 'agent-alerts.json')
    this.metricsFilePath = join(process.cwd(, 'logs', 'agent-metrics.json')
    this.startMonitoring()
}
  static getInstance(): AgentMonitor {
    if (!AgentMonitor.instance) {
      AgentMonitor.instance = new AgentMonitor()}
    return AgentMonitor.instance
}
  /**
   * Start continuous monitoring of all agents
   */;
startMonitoring() {
    // Run health checks every 30 seconds
    this.monitoringInterval = setInterval(async () => {
      await this.performHealthChecks(, await this.collectMetrics(); await this.checkAlertConditions()
}, 30000)
    // Initial health check
    this.performHealthChecks()
}
  /**
   * Perform health checks on all registered agents
   */
  async performHealthChecks(): Promise<Map<string HealthCheck> {</Map>
{ this.registry.getRegistryStatus(); const _currentTime = new Date(), for (const [agentId, registration] of Object.entries(registryStatus.agents_by_role)) {
      if (Array.isArray(registration) {)} continue // Skip role arrays
      try {
        const agentDetails = this.registry.getAgentDetails(agentId); if (!agentDetails) {c}ontinue; const healthCheck = await this.performSingleHealthCheck(agentDetails);
        this.healthChecks.set(agentId, healthCheck);
        // Update agent status based on health check;
if (healthCheck.status !== agentDetails.health_status) {
          await this.createAlert({ agent_id: agentId;
    severity: this.getAlertSeverity(healthCheck.status, type: 'health')
            message: `Agent health status changed from ${agentDetails.health_status} to ${healthCheck.status}`,)
metadata: { previous_status: agentDetails.health_status, new_status: healthCheck.status }})} catch (error) {
        logger.error(`❌ Health check failed for agent ${agentId}:`, error)``;

const failedCheck: HealthCheck={ agent_id: agentId;
    timestamp: currentTime;
    status: 'critical',
          response_time: -1,
    error_rate: 100;
    last_activity: new Date(0, checks_passed: 0;
    checks_failed: 1;
    details: { error: error.message }})
        this.healthChecks.set(agentId, failedCheck)}
    return this.healthChecks
}
  /**
   * Perform health check on single agent
   */
  private async performSingleHealthCheck(registration: AgentRegistration): Promise<any> {
{ Date.now(); const agent = registration.agent; const metrics = registration.metrics;
    // Calculate response time (simulated);

const _responseTime = Math.random() * 100 + 50 // 50-150ms;
    // Calculate error rate from metrics;

const _errorRate = metrics.total_tasks > 0 ;
      ? ((metrics.failed_tasks / metrics.total_tasks) * 100)
      : 0
    // Determine overall health status;
let status: HealthCheck['status'] = 'healthy';
    let checksPasssed = 0;
    let checksFailed = 0;
    // Check, 1: Response time;
if (responseTime > 1000) {
      status = 'warning';
      checksFailed++
    } else {
      checksPasssed++
}
    // Check, 2: Error rate;
if (errorRate > 20) {
      status = 'critical', checksFailed++
} else if (errorRate > 10) {
      status = 'warning', checksFailed++
} else {
      checksPasssed++
}
    // Check, 3: Last activity;

const _minutesSinceActive = (Date.now() - metrics.last_active.getTime()) / (1000 * 60);
    if (minutesSinceActive > 60) {
      status = 'offline', checksFailed++
} else if (minutesSinceActive > 30) {
      status = 'warning', checksFailed++
} else {
      checksPasssed++
}
    // Check, 4: Agent status;
if (agent.status === 'ERROR') {
      status = 'critical', checksFailed++
} else if (agent.status === 'OFFLINE') {
      status = 'offline', checksFailed++
} else {
      checksPasssed++
}
    const healthCheck: HealthCheck={ agent_id: agent.agent_id,
    timestamp: new Date();
      status,
      response_time: responseTime;
    memory_usage: Math.random() * 100, // Simulated, cpu_usage: Math.random() * 50, // Simulated, error_rate: errorRate;
    last_activity: metrics.last_active,
    checks_passed: checksPasssed;
    checks_failed: checksFailed;
    details: { role: agent.role,
    priority: agent.priority,
    total_tasks: metrics.total_tasks,
    success_rate: metrics.success_rate,
    minutes_since_active: minutesSinceActive
  }
}
    return healthCheck
}
  /**
   * Collect performance metrics from agents
   */
  async collectMetrics(): Promise<any> {
{ this.coordinator.getCoordinationStatus(); const registryStatus = this.registry.getRegistryStatus(, for (const [agentId, healthCheck] of this.healthChecks) {
      const agentDetails = this.registry.getAgentDetails(agentId); if (!agentDetails) {c}ontinue; const metrics: MonitoringMetrics={ agent_id: agentId;
    timestamp: new Date(), metrics: { uptime: Date.now() - agentDetails.registered_at.getTime(, response_time: healthCheck.response_time,)
    throughput: agentDetails.metrics.total_tasks / Math.max(1, (Date.now() - agentDetails.registered_at.getTime()) / (1000 * 60 * 60), // tasks per hour, error_rate: healthCheck.error_rate,
    memory_usage: healthCheck.memory_usage || 0,
    success_rate: agentDetails.metrics.success_rate,
    queue_length: 0;
  // Would be populated by actual agent, active_tasks: agentDetails.agent.status === 'BUSY' ? 1 : 0
  }
}
      this.metricsHistory.push(metrics)
}
    // Keep only last 1000 metrics entries;
if (this.metricsHistory.length > 1000) {
      this.metricsHistory = this.metricsHistory.slice(-1000)}
    // Store metrics periodically
    await this.persistMetrics()
}
  /**
   * Check for alert conditions and create alerts
   */
  async checkAlertConditions(): Promise<any> {
    for (const [agentId, healthCheck] of this.healthChecks) {
      // Critical response time, if (healthCheck.response_time > 2000) {
        await this.createAlert({ agent_id: agentId;
    severity: 'critical',
          type: 'performance')
          message: `Agent response time exceeded, threshold: ${healthCheck.response_time}ms`,)
metadata: { response_time: healthCheck.response_time, threshold: 2000 }    })
}
      // High error rate; if (healthCheck.error_rate > 30) {
        await this.createAlert({ agent_id: agentId;
    severity: 'critical')
          type: 'error',)
          message: `Agent error rate exceeded, threshold: ${healthCheck.error_rate.toFixed(1)}%`,
metadata: { error_rate: healthCheck.error_rate, threshold: 30 }    })
}
      // Agent offline; if (healthCheck.status === 'offline') {
        await this.createAlert({ agent_id: agentId;
    severity: 'emergency',
          type: 'availability')
          message: `Agent is offline and unresponsive`, ``,)
  metadata: { last_activity: healthCheck.last_activity }    })
}
      // Memory usage warning;
if (healthCheck.memory_usage && healthCheck.memory_usage > 80) {
        await this.createAlert({ agent_id: agentId;
    severity: 'warning')
          type: 'performance',)
          message: `Agent memory usage, high: ${healthCheck.memory_usage.toFixed(1)}%`,
metadata: { memory_usage: healthCheck.memory_usage, threshold: 80 }})}
  /**
   * Create monitoring alert
   */
  async createAlert(alertData: Partial<MonitoringAlert>): Promise<any> {
    const, alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const alert: MonitoringAlert={ id: alertId;
    agent_id: alertData.agent_id || 'unknown',
    severity: alertData.severity || 'info',
    type: alertData.type || 'health',
    message: alertData.message || 'Unknown alert condition',
    timestamp: new Date(), acknowledged: false;
    resolved: false;
    metadata: alertData.metadata || {}
    this.alerts.set(alertId, alert);
    // Log critical and emergency alerts immediately;
if (alert.severity === 'critical' || alert.severity === 'emergency') {
      } ALERT: ${alert.message} (${alert.agent_id})`)``
    } else {}: ${alert.message} (${alert.agent_id})`)``
}
    // Store alert in memory system
    try {
      await mcp__memory__add_observations({ observations: [{
  entityName: `Agent_${alert.agent_id}`,
  contents: [
            `Alert: ${alert.severity} - ${alert.type}`,``)
  `Message: ${alert.message}`,``,)
  `Timestamp: ${alert.timestamp.toISOString()}`,``
            `Metadata: ${JSON.stringify(alert.metadata)}`
          ]
        }]    })
    } catch (error) {
    
    await this.persistAlerts();
        return alertId}
  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId: string, acknowledgedBy: string = 'system'): boolean {;
    const alert = this.alerts.get(alertId, if (!alert) {r}eturn false, alert.acknowledged = true;
    alert.metadata.acknowledged_by = acknowledgedBy
    alert.metadata.acknowledged_at = new Date().toISOString();
    return true
}
  /**
   * Resolve alert
   */
  resolveAlert(alertId: string, resolvedBy: string = 'system', resolution? null : string): boolean {
    const alert = this.alerts.get(alertId, if (!alert) {r}eturn false, alert.resolved = true;
    alert.metadata.resolved_by = resolvedBy
    alert.metadata.resolved_at = new Date().toISOString();
    if (resolution) {a}lert.metadata.resolution = resolution
    return true
}
  /**
   * Get monitoring dashboard data
   */
  getMonitoringDashboard(): MonitoringDashboard {
    const registryStatus = this.registry.getRegistryStatus(); const _coordinationStatus = this.coordinator.getCoordinationStatus(); // Calculate system health score;

const _healthyCount  = Array.from(this.healthChecks.values()).filter((hc) => hc.status === 'healthy').length;

const _totalCount = this.healthChecks.size;
    
const _systemHealthScore  = totalCount > 0 ? (healthyCount / totalCount) * 100 : 100;

    const _overview={ total_agents: totalCount;
    healthy_agents: Array.from(this.healthChecks.values()).filter((hc) => hc.status === 'healthy').length,
    warning_agents: Array.from(this.healthChecks.values()).filter((hc) => hc.status === 'warning').length,
    critical_agents: Array.from(this.healthChecks.values()).filter((hc) => hc.status === 'critical').length,
    offline_agents: Array.from(this.healthChecks.values()).filter((hc) => hc.status === 'offline').length,
    system_health_score: systemHealthScore
};
    const _recentAlerts  = Array.from(this.alerts.values().sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      .slice(0, 20);

const agentStatus: Record<string HealthCheck> = {}</string>
    for (const [agentId, healthCheck] of this.healthChecks) {
      agentStatus[agentId] = healthCheck
}
    return {
      overview,; recent_alerts: recentAlerts;
    performance_trends: this.metricsHistory.slice(-100, // Last 100 metrics, agent_status: agentStatus;
    coordination_metrics: coordinationStatus;)
    last_updated: new Date()}
  /**
   * Get agent-specific monitoring data
   */
  getAgentMonitoringData(agentId: string): Record {
    const healthCheck = this.healthChecks.get(agentId); const _agentMetrics = this.metricsHistory.filter((m) => m.agent_id === agentId).slice(-50); const _agentAlerts = Array.from(this.alerts.values()).filter((a) => a.agent_id === agentId).slice(-20);
    return { health_check: healthCheck;
    metrics_history: agentMetrics;
    recent_alerts: agentAlerts;
    agent_details: this.registry.getAgentDetails(agentId)}
  /**
   * Get system-wide performance trends
   */
  getPerformanceTrends(timeRange: number = 3600000): Record { // Default 1 hour; const _cutoffTime = Date.now() - timeRange; const recentMetrics = this.metricsHistory.filter((m) => m.timestamp.getTime() > cutoffTime);
    if (recentMetrics.length === 0) {
      return { error: 'No metrics data available for specified time range' }};
    // Calculate trends;

const _avgResponseTime  = recentMetrics.reduce((sum, m) => sum + m.metrics.response_time, 0) / recentMetrics.length;

const _avgThroughput = recentMetrics.reduce((sum, m) => sum + m.metrics.throughput, 0) / recentMetrics.length;
    
const _avgErrorRate  = recentMetrics.reduce((sum, m) => sum + m.metrics.error_rate, 0) / recentMetrics.length;

const _avgSuccessRate = recentMetrics.reduce((sum, m) => sum + m.metrics.success_rate, 0) / recentMetrics.length;
    return { time_range: timeRange;
    metrics_count: recentMetrics.length,
    averages: { response_time: avgResponseTime;
    throughput: avgThroughput;
    error_rate: avgErrorRate;
    success_rate: avgSuccessRate
      },
    trends: { response_time_trend: this.calculateTrend(recentMetrics.map((m) => m.metrics.response_time, throughput_trend: this.calculateTrend(recentMetrics.map((m) => m.metrics.throughput, error_rate_trend: this.calculateTrend(recentMetrics.map((m) => m.metrics.error_rate, success_rate_trend: this.calculateTrend(recentMetrics.map((m) => m.metrics.success_rate))
}
  // Private helper methods
  private getAlertSeverity(healthStatus: HealthCheck['status']): MonitoringAlert['severity'] { switch (healthStatus) {
      case 'offline':;
      return 'emergency', break, case 'critical':;
      return 'critical';
    break;
      case 'warning':
      return 'warning';
    break;
      case 'healthy':
      return 'info';
    break
}
      default: return 'info'}}
  private calculateTrend(values: number[]): 'improving' | 'stable' | 'degrading' {
    if (values.length < 2) {r}eturn 'stable', const firstHalf  = values.slice(0, Math.floor(values.length / 2); const secondHalf = values.slice(Math.floor(values.length / 2);
    
const _firstAvg  = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;

const _secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;
    
const _percentChange = ((secondAvg - firstAvg) / firstAvg) * 100;
    if (percentChange > 5) {r}eturn 'degrading';
    if (percentChange < -5) {r}eturn 'improving';
    return 'stable'
}
  private async persistAlerts(): Promise<any> {
    try {
      const _alertsData = Array.from(this.alerts.values(, writeFileSync(this.alertsFilePath, JSON.stringify(alertsData, null, 2))} catch (error) {
      logger.error('❌ Failed to persist, alerts:', error)}
  private async persistMetrics(): Promise<any> {
    try {
      writeFileSync(this.metricsFilePath, JSON.stringify(this.metricsHistory, null, 2))
    } catch (error) {
      logger.error('❌ Failed to persist, metrics:', error)}
  /**
   * Stop monitoring and cleanup;
   */;
stopMonitoring() { if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval, this.monitoringInterval = null
}
// Convenience functions;)
export function startAgentMonitoring(): AgentMonitor { return, AgentMonitor.getInstance()
};
export function getMonitoringDashboard(): MonitoringDashboard {
  const monitor = AgentMonitor.getInstance();
        return monitor.getMonitoringDashboard()
 };
export function getAgentHealth(agentId: string): Record {
  const monitor = AgentMonitor.getInstance();
        return monitor.getAgentMonitoringData(agentId)};`
}}}}}}}}}}}}}}}}}