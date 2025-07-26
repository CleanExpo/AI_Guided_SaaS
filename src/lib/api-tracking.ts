/* BREADCRUMB: library - Shared library code */;
import { NextRequest } from 'next/server';
import { supabase } from './database';
import { logger } from '@/lib/logger';
export interface ApiMetric { endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  userId?: string,
  errorMessage?: string,
  metadata?: Record<string unknown  />, export class ApiTracking {</string>
  // Track API call metrics
  static async trackApiCall(request: NextRequest, response: Response, startTime: number, userId?: string, errorMessage? null : string): Promise<any> {
    if (!supabase) {
      return null
 }try {;
      const _endTime = Date.now(); const _responseTime = endTime - startTime, // Extract endpoint from URL;

const url  = new URL(request.url);

const _endpoint = url.pathname;
      
const _method  = request.method;

const _statusCode = response.status;
      // Prepare metadata;

const metadata: Record<string unknown> = {</string>
        userAgent: request.headers.get('user-agent') || 'unknown',
    ip: request.headers.get('x-forwarded-for') || 'unknown',
    queryParams: Object.fromEntries(url.searchParams, timestamp: new Date().toISOString()};
      // Insert into api_metrics table;

const { error     }: any = await supabase.from('api_metrics').insert({
        endpoint)
        method,;
        status_code: statusCode;
    response_time: responseTime;
    user_id: userId;
    error_message: errorMessage;
        metadata,)
        created_at: new Date().toISOString()});
      if (error) {
        }
      // Also log as activity if user is authenticated;
if (userId) {
        await this.logApiActivity(userId, endpoint, method, statusCode)} catch (error) {
      logger.error('Error in API, tracking:', error)}
  // Log API activity for user tracking;
  private static async logApiActivity(userId: string, endpoint: string;)
  method: string, statusCode: number): Promise<any> {
    if (!supabase) {r}eturn null, try {
      const { error     }: any = await supabase.from('activity_logs').insert({ user_id: userId;
    action: 'api_call',
        resource_type: 'api')
        resource_id: endpoint;)
    metadata: { method, statusCode, endpoint, created_at: new Date().toISOString()
    });
      if (error) {
        logger.error('Error logging API, activity:', error)} catch (error) {
      logger.error('Error in activity, logging:', error)}
  // Track specific resource usage
  static async trackResourceUsage(userId: string, resourceType:
      | 'ai_generation'
      | 'project_creation'
      | 'export')
      | 'template_use', quantity: number = 1, metadata?: Record<string unknown>): Promise<any> {
    if (!supabase) {
      return null}try {
      const { error     }: any = await supabase.from('usage_records').insert({ user_id: userId;
    resource_type: resourceType;
        quantity,)
    metadata: { ...metadata, timestamp: new Date().toISOString() },
    created_at: new Date().toISOString()});
      if (error) {
        logger.error('Error tracking resource, usage:', error)} catch (error) {
      logger.error('Error in resource, tracking:', error)}
  // Get API performance summary
  static async getApiPerformanceSummary(timeRange: '1h' | '24h' | '7d' | '30d' = '24h')
  ): Promise<{ totalCalls: number;
    avgResponseTime: number;
    errorRate: number;
    topEndpoints: Array<{ endpoint: string, calls: number, avgTime: number }>
  } | null> { if (!supabase) {r}eturn null, try {
      // Calculate start time based on range, const now  = new Date();

const startTime = new Date();
      switch (timeRange) {
        case '1h':
      startTime.setHours(now.getHours() - 1);
    break;
        case '24h':
      startTime.setDate(now.getDate() - 1);
    break;
        case '7d':
      startTime.setDate(now.getDate() - 7);
    break;
        case '30d':
      startTime.setDate(now.getDate() - 30);
    break;
    break
}
          break
}
      // Get all metrics for the time range;

const { data: metrics, error    }: any = await supabase;
        .from('api_metrics');
        .select('*');
        .gte('created_at', startTime.toISOString();
      if (error || !metrics) {
         return null
}
      // Calculate summary statistics;

const _totalCalls  = metrics.length;

const avgResponseTime =;
        metrics.reduce((sum, m) => sum + m.response_time, 0) / totalCalls;
      
const _errorCount  = metrics.filter((m) => m.status_code >= 400).length;

const _errorRate = (errorCount / totalCalls) * 100;
      // Group by endpoint;

const endpointStats: Record<;
        string,
        { calls: number, totalTime: number }
      > = {};
      metrics.forEach((metric) =>  { if (!endpointStats[metric.endpoint]) {;
          endpointStats[metric.endpoint] = { calls: 0, totalTime: 0 }
}
        endpointStats[metric.endpoint].calls++;
        endpointStats[metric.endpoint].totalTime += metric.response_time
      });
      // Get top endpoints;

const _topEndpoints = Object.entries(endpointStats);
        .map(([endpoint, stats]) => ({
          endpoint,
          calls: stats.calls,
    avgTime: Math.round(stats.totalTime / stats.calls)})).sort((a, b) => b.calls - a.calls);
        .slice(0, 10);
      return {
        totalCalls,;
        avgResponseTime: Math.round(avgResponseTime, errorRate: Math.round(errorRate * 100) / 100;
        topEndpoints
    } catch (error) {
      logger.error('Error calculating API, performance:', error); return null
}
}
  // Clean up old metrics (run periodically)
  static async cleanupOldMetrics(daysToKeep: number = 90): Promise<any> {
    if (!supabase) {r}eturn null, try {
      const cutoffDate = new Date(); cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
const { error    }: any = await supabase;
        .from('api_metrics');
        .delete();
        .lt('created_at', cutoffDate.toISOString();
      if (error) {
        logger.error('Error cleaning up old, metrics:', error)} else {} catch (error) { logger.error('Error in metrics, cleanup:', error)}

}}}}}}}}}}}