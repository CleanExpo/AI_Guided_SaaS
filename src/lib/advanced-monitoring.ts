/* BREADCRUMB: library - Shared library code */
/**
 * Advanced Monitoring System
 * Enterprise-grade monitoring with real-time alerts and comprehensive metrics
 */;
import { logSecurity, logWarn } from './production-logger';interface SecurityEvent { type: 'attack' | 'breach' | 'suspicious' | 'rate_limit' | 'auth_failure',
  severity: 'critical' | 'high' | 'medium' | 'low',
  source: string;
  details: Record<string unknown>,</string>
  timestamp: Date;
  ip?: string,
  userAgent?: string
};
interface PerformanceMetric { endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
  memoryUsage: number;
  cpuUsage: number
 };
interface SystemHealth { uptime: number;
  memoryUsage: { used: number;
  total: number;
  percentage: number
}
    cpuUsage: number;
    activeConnections: number;
    errorRate: number;
    responseTime: number;
    timestamp: Date
}
class AdvancedMonitoringSystem {
  private securityEvents: SecurityEvent[] = [], private performanceMetrics: PerformanceMetric[] = [], private systemHealth: SystemHealth[] = [];
  private alertThresholds={ errorRate: 0.01; // 1%,
  responseTime: 2000;
  // 2 seconds, memoryUsage: 0.85; // 85%,
  cpuUsage: 0.80; // 80%
  };
  /**
   * Log security events with automatic alerting
   */;
logSecurityEvent(event: Omit<SecurityEvent 'timestamp'>) { </SecurityEvent>
    const securityEvent: SecurityEvent={;
      ...event;
      timestamp: new Date() };
    this.securityEvents.push(securityEvent);
    this.trimEventHistory();
    // Trigger alerts for critical events;
if (event.severity === 'critical' || event.severity === 'high') {
      this.triggerSecurityAlert(securityEvent)}
    // Log to production logger;
if (typeof window === 'undefined') {
      logSecurity('Security event detected', { type: event.type,
    severity: event.severity,
    source: event.source,
    details: event.details})}
  /**
   * Track performance metrics
   */;
trackPerformance(metric: Omit<PerformanceMetric 'timestamp' | 'memoryUsage' | 'cpuUsage'>) {</PerformanceMetric>
    const performanceMetric: PerformanceMetric={;
      ...metric;
      timestamp: new Date(), memoryUsage: this.getMemoryUsage(),
  cpuUsage: this.getCpuUsage()};
    this.performanceMetrics.push(performanceMetric);
    this.trimPerformanceHistory();
    // Check for performance alerts;
if (metric.responseTime > this.alertThresholds.responseTime) {
      this.triggerPerformanceAlert('High response time detected', { endpoint: metric.endpoint,
    responseTime: metric.responseTime,
    threshold: this.alertThresholds.responseTime})}
  /**
   * Monitor system health
   */
  monitorSystemHealth(): SystemHealth {
    const health: SystemHealth={ uptime: process.uptime(, memoryUsage: { used: process.memoryUsage().heapUsed,
    total: process.memoryUsage().heapTotal,
    percentage: process.memoryUsage().heapUsed / process.memoryUsage().heapTotal}
    cpuUsage: this.getCpuUsage(, activeConnections: this.getActiveConnections(),
    errorRate: this.calculateErrorRate(, responseTime: this.calculateAverageResponseTime(),
  timestamp: new Date()};
    this.systemHealth.push(health);
    this.trimHealthHistory();
    // Check health thresholds
    this.checkHealthAlerts(health);
    return health
}
  /**
   * Get security analytics
   */
  getSecurityAnalytics(): { totalEvents: number;
    criticalEvents: number;
    attackAttempts: number;
    topAttackTypes: Array<{ type: string, count: number }>;
    recentEvents: SecurityEvent[]
  } {
    const _last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000); const recentEvents = this.securityEvents.filter(, event: any => event.timestamp > last24Hours;
    );
    
const _attackTypes = recentEvents.reduce((acc: Record<string any>, event) =>  {</string>
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc
}, {} as Record<string any>);</string>
{ Object.entries(attackTypes);
      .map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);
      .slice(0, 5);
    return { totalEvents: recentEvents.length,
    criticalEvents: recentEvents.filter((e) => e.severity === 'critical').length,;
    attackAttempts: recentEvents.filter((e) => e.type === 'attack').length;
      topAttackTypes,
      recentEvents: recentEvents.slice(-10)}
  /**
   * Get performance analytics
   */
  getPerformanceAnalytics(): { averageResponseTime: number;
    slowestEndpoints: Array<{ endpoint: string, avgTime: number }>;
    errorRate: number;
    throughput: number;
    memoryTrend: Array<{ timestamp: Date, usage: number }>
  } {
    const _last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000); const recentMetrics = this.performanceMetrics.filter(, metric: any => metric.timestamp > last24Hours;
    );
    
const _endpointTimes = recentMetrics.reduce((acc: Record<string number[]>, metric) =>  {</string>
      if (!acc[metric.endpoint]) {
        acc[metric.endpoint] = []
};
      acc[metric.endpoint].push(metric.responseTime);
      return acc
}, {} as Record<string number[]>);</string>
{ Object.entries(endpointTimes);
      .map(([endpoint, times]) => ({
        endpoint, avgTime: times.reduce((sum, time) => sum + time, 0) / times.length})).sort((a, b) => b.avgTime - a.avgTime);
      .slice(0, 5);
    
const _memoryTrend = this.systemHealth;
      .filter((health) => health.timestamp > last24Hours)
      .map((health) => ({ timestamp: health.timestamp,;
    usage: health.memoryUsage.percentage});
    return { averageResponseTime: this.calculateAverageResponseTime();
      slowestEndpoints,
      errorRate: this.calculateErrorRate(, throughput: recentMetrics.length / 24, // requests per hour
      memoryTrend}}
  /**
   * Generate comprehensive monitoring report
   */
  generateMonitoringReport(): { timestamp: Date;
    systemHealth: SystemHealth;
    securityAnalytics: { totalEvents: number;
    criticalEvents: number;
    attackAttempts: number;
    topAttackTypes: Array<{ type: string, count: number }>;
    recentEvents: SecurityEvent[]
    },
    performanceAnalytics: { averageResponseTime: number;
    slowestEndpoints: Array<{ endpoint: string, avgTime: number }>;
    errorRate: number;
    throughput: number;
    memoryTrend: Array<{ timestamp: Date, usage: number }>
    },
    alerts: Array<{ type: string, message: string, severity: string, timestamp: Date }>;
    recommendations: string[]
  } {
    const _currentHealth = this.monitorSystemHealth(); const _securityAnalytics = this.getSecurityAnalytics(); const _performanceAnalytics  = this.getPerformanceAnalytics();

const recommendations = this.generateRecommendations(;
      currentHealth,
      securityAnalytics,
      // performanceAnalytics;
    );
    return { timestamp: new Date(), systemHealth: currentHealth;
      securityAnalytics,
      performanceAnalytics,
      alerts: this.getRecentAlerts();
      recommendations}}
  // Private helper methods
  private getMemoryUsage(): number {
    if (typeof process !== 'undefined') {
      return process.memoryUsage().heapUsed / 1024 / 1024, // MB};
    return 0
}
  private getCpuUsage(): number {
    if (typeof process !== 'undefined') {
      const usage = process.cpuUsage();
        return (usage.user + usage.system) / 1000000, // Convert to seconds
}
    return 0
}
  private getActiveConnections(): number {
    // In a real implementation, this would track actual connections
    return Math.floor(Math.random() * 100) + 50}
  private calculateErrorRate(): number {;
    const _last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000); const recentMetrics = this.performanceMetrics.filter(, metric: any => metric.timestamp > last24Hours;
    );
    if (recentMetrics.length === 0) {r}eturn 0;
    
const _errorCount = recentMetrics.filter(;
      metric: any => metric.statusCode >= 400;
    ).length;
    return errorCount / recentMetrics.length
}
  private calculateAverageResponseTime(): number {
    const _last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000); const recentMetrics = this.performanceMetrics.filter(, metric: any => metric.timestamp > last24Hours;
    );
    if (recentMetrics.length === 0) {r}eturn 0;
    
const _totalTime = recentMetrics.reduce(;
      (sum, metric) => sum + metric.responseTime,;
      0;
    );
    return totalTime / recentMetrics.length
}
  private triggerSecurityAlert(event: SecurityEvent) {
    const _alert={ type: 'security',
      message: `Security ${event.severity} alert: ${event.type} from ${event.source}`,
severity: event.severity,
    timestamp: new Date(), details: event};
    // In production, this would send to external monitoring services;
if (typeof window === 'undefined') {
      logSecurity('Security alert triggered', alert)}
  private triggerPerformanceAlert(message: string, details: Record<string unknown>) {</string>
{{ type: 'performance';
      message,
      severity: 'medium' as const timestamp: new Date(); details};
    if (typeof window === 'undefined') {
      logWarn('Performance alert triggered', alert)}
  private checkHealthAlerts(health: SystemHealth) {
    if (health.memoryUsage.percentage > this.alertThresholds.memoryUsage) {
      this.triggerPerformanceAlert('High memory usage detected', { usage: health.memoryUsage.percentage,
    threshold: this.alertThresholds.memoryUsage   
    })
}
    if (health.errorRate > this.alertThresholds.errorRate) {
      this.triggerPerformanceAlert('High error rate detected', { errorRate: health.errorRate,
    threshold: this.alertThresholds.errorRate})}
  private generateRecommendations(
health: SystemHealth;
    security: { totalEvents: number, criticalEvents: number, attackAttempts: number, topAttackTypes: Array<{ type: string, count: number }>;
    recentEvents: SecurityEvent[]
    },
    performance: { averageResponseTime: number, slowestEndpoints: Array<{ endpoint: string, avgTime: number }>;
    errorRate: number;
    throughput: number;
    memoryTrend: Array<{ timestamp: Date, usage: number }>
}
  ): string[] {
    const recommendations: string[] = [], if (health.memoryUsage.percentage > 0.8) {
      recommendations.push('Consider optimizing memory usage or scaling resources')}
    if (performance.errorRate > 0.05) {
      recommendations.push('Investigate and resolve high error rate')}
    if (security.criticalEvents > 0) {
      recommendations.push('Review and respond to critical security events')}
    if (performance.averageResponseTime > 1000) {
      recommendations.push('Optimize slow endpoints to improve response times')}
    if (recommendations.length === 0) {
      recommendations.push('System is operating within optimal parameters')};
    return recommendations
}
  private getRecentAlerts(): Array {
    // In a real implementation, this would return actual alerts, return []}
  private trimEventHistory() {
    // Keep only last 1000 events, if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-1000)}
  private trimPerformanceHistory() {
    // Keep only last 10000 metrics, if (this.performanceMetrics.length > 10000) {
      this.performanceMetrics = this.performanceMetrics.slice(-10000)}
  private trimHealthHistory() { // Keep only last 1000 health records, if (this.systemHealth.length > 1000) {
      this.systemHealth = this.systemHealth.slice(-1000)}
// Singleton instance;

const _advancedMonitoring = new AdvancedMonitoringSystem();
export default advancedMonitoring;
// Export types for use in other modules;
export type { SecurityEvent, PerformanceMetric, SystemHealth }
}}}}}}}}}}}}}