import { SupabaseClient } from '@supabase/supabase-js';// import { Pool } from 'pg' // Commented out - not currently used
import { HealthCheckResult } from './HealthCheckService';
/**
 * Supabase database health check
 */
export async function checkSupabaseHealth(,
    supabase: SupabaseClient;
): Promise<any> {
  const _start = Date.now();
  try {
    // Try to execute a simple query
    let data = null,
      error = null;
    try {
      const result = await supabase.from('_health_check').select('1').single();
      data = result.data;
      error = result.error
    } catch (e) {
      // If health check table doesn't exist, that's OK
      error = null
}
    // Alternative: Check if we can at least reach the database
    if(!data && !error) {
      let pingError = null;
      try {
        const result = await supabase.rpc('version');
        pingError = result.error
      } catch (e) {
        pingError = { message: 'RPC not available' }}
      if(!pingError) {
        return {
          name: 'supabase',
          status: 'healthy',
          responseTime: Date.now() - start,
    details: {
  message: 'Database reachable'
},
          timestamp: new Date()}}
    if (error) {
      return {
        name: 'supabase',
        status: 'unhealthy',
        responseTime: Date.now() - start,
    error: error.message,
    timestamp: new Date()}}
    return {
      name: 'supabase',
      status: 'healthy',
      responseTime: Date.now() - start,
    timestamp: new Date()}} catch (error) { return {
      name: 'supabase',
      status: 'unhealthy',
      responseTime: Date.now() - start,
    error: error instanceof Error ? error.message: 'Unknown error',
      timestamp: new Date() }
// PostgreSQL direct connection health check
// Commented out - requires 'pg' package to be installed
/*
export async function checkPostgresHealth(,
    connectionString: string;
): Promise<any> {
  const _start = Date.now();
  let pool: Pool | null = null;
  try {
    pool = new Pool({ connectionString })
    // Execute a simple query
    const result = await pool.query('SELECT NOW() as current_time, version() as version');
    await pool.end()
    return {
      name: 'postgres',
      status: 'healthy',
      responseTime: Date.now() - start,
    details: {
  currentTime: result.rows[0].current_time,
    version: result.rows[0].version
      },
      timestamp: new Date()
}} catch (error) {
    if (pool) {
      await pool.end().catch (() => {})
}
    return {name: 'postgres',
      status: 'unhealthy',
      responseTime: Date.now() - start,
    error: error instanceof Error ? error.message: 'Connection failed',
      timestamp: new Date()
}
*/
// Check database connection pool health
// Commented out - requires 'pg' package to be installed
/*
export async function checkConnectionPoolHealth(,
    pool: Pool;
): Promise<any> {
  const _start = Date.now();
  try {
    const poolStats = {
      totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
}
    // Check if pool is healthy
    const _isHealthy = poolStats.idleCount > 0 || poolStats.totalCount < 10;
    return {
      name: 'connection_pool',
      status: isHealthy ? 'healthy' : 'degraded',
      responseTime: Date.now() - start,
    details: poolStats,
    timestamp: new Date()
}} catch (error) { return {
      name: 'connection_pool',
      status: 'unhealthy',
      responseTime: Date.now() - start,
    error: error instanceof Error ? error.message: 'Pool check failed',
      timestamp: new Date()
}
*/
/**
 * Check database migrations status
 */
export async function checkMigrationHealth(,
    supabase: SupabaseClient;
): Promise<any> {
  const _start = Date.now();
  try {
    // Check if migrations table exists and get latest migration
    const { data, error   }: any = await supabase;
      .from('schema_migrations')
      .select('version, executed_at')
      .order('version', { ascending: false })
      .limit(1)
      .single();
    if (error) {
      // Migrations table might not exist
      return {
        name: 'migrations',
        status: 'degraded',
        responseTime: Date.now() - start,
    details: {
  message: 'Migrations table not found or inaccessible'
},
        timestamp: new Date()}}
    return {
      name: 'migrations',
      status: 'healthy',
      responseTime: Date.now() - start,
    details: {
  latestVersion: data?.version,
    executedAt: data?.executed_at
      },
      timestamp: new Date()}} catch (error) { return {
      name: 'migrations',
      status: 'unhealthy',
      responseTime: Date.now() - start,
    error: error instanceof Error ? error.message: 'Migration check failed',
      timestamp: new Date() }
/**
 * Check database performance metrics
 */
export async function checkDatabasePerformance(,
    supabase: SupabaseClient;
): Promise<any> {
  const _start = Date.now();
  try {
    // Run a performance test query
    const _testStart = Date.now();
    // Simple count query on a system table
    const { count, error   }: any = await supabase;
      .from('_health_check')
      .select('*', { count: 'exact', head: true });
    const _queryTime = Date.now() - testStart;
    if(error && error.code !== 'PGRST116') {
      // Table not found is ok
      return {
        name: 'db_performance',
        status: 'unhealthy',
        responseTime: Date.now() - start,
    error: error.message,
    timestamp: new Date()}}
    // Determine health based on query time
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if(queryTime > 1000) {
      status = 'unhealthy'
    } else if (queryTime > 500) {
      status = 'degraded'
}
    return {
      name: 'db_performance',
      status,
      responseTime: Date.now() - start,
    details: {
  queryTime: `${queryTime}ms`
    threshold: {
          healthy: '<500ms',
          degraded: '500-1000ms',
          unhealthy: '>1000ms'
},
      timestamp: new Date()}} catch (error) { return {
      name: 'db_performance',
      status: 'unhealthy',
      responseTime: Date.now() - start,
    error: error instanceof Error ? error.message: 'Performance check failed',
      timestamp: new Date() }
/**
 * Create a comprehensive database health check
 */
export function createComprehensiveDatabaseHealthCheck(,
    supabase: SupabaseClient): SupabaseClient) {
  return async (): Promise<HealthCheckResult> => {
    const checks = await Promise.all([
  checkSupabaseHealth(supabase),
      checkMigrationHealth(supabase),
      checkDatabasePerformance(supabase)]);
    // Aggregate results
    const unhealthyChecks = checks.filter((c) => c.status === 'unhealthy');
    const degradedChecks = checks.filter((c) => c.status === 'degraded');
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if(unhealthyChecks.length > 0) {
      overallStatus = 'unhealthy'
    } else if (degradedChecks.length > 0) {
      overallStatus = 'degraded'
}
    const _totalResponseTime = checks.reduce(;
      (sum, check) => sum + (check.responseTime || 0),
      0
    );
    return {
      name: 'database_comprehensive',
      status: overallStatus,
    responseTime: totalResponseTime,
    details: {
  checks: checks.map((c) => ({
  name: c.name,
    status: c.status,
    responseTime: c.responseTime
        }})},
      timestamp: new Date()}}