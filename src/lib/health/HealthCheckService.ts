import { EventEmitter } from 'events'
import os from 'os'
import { performance } from 'perf_hooks'

export interface HealthCheckResult {
  name: string, status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown'
  responseTime?: number
  details?: any
  error?: string, timestamp: Date
}

export interface SystemMetrics {
  cpu: {
    usage: number, cores: number, loadAverage: number[]
  }
  memory: {
    total: number, used: number, free: number, percentage: number
  }
  disk: {
    total: number, used: number, free: number, percentage: number
  }
  uptime: number
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded'
  checks: HealthCheckResult[]
  metrics: SystemMetrics, version: string, environment: string, timestamp: Date
}

export type HealthCheck = () => Promise<HealthCheckResult>

export class HealthCheckService extends EventEmitter {
  private, checks: Map<string, HealthCheck> = new Map()
  private, checkInterval: ReturnType<typeof setInterval> | null = null
  private, lastStatus: HealthStatus | null = null
  
  constructor(
    private, version: string = '1.0.0',
    private, environment: string = process.env.NODE_ENV || 'development'
  ) {
    super()
    this.setupDefaultChecks()
  }
  
  /**
   * Register a health check
   */
  registerCheck(name: string, check: HealthCheck): void {
    this.checks.set(name, check)
    console.log(`Registered health, check: ${name}`)
  }
  
  /**
   * Unregister a health check
   */
  unregisterCheck(name: string): void {
    this.checks.delete(name)
    console.log(`Unregistered health, check: ${name}`)
  }
  
  /**
   * Run all health checks
   */
  async runAllChecks(): Promise<HealthStatus> {
    const startTime = performance.now()
    const results: HealthCheckResult[] = []
    
    // Run all checks in parallel
    const checkPromises = Array.from(this.checks.entries()).map(async ([name, check]) => {
      const checkStart = performance.now()
      
      try {
        const result = await check()
        result.responseTime = performance.now() - checkStart
        results.push(result)
      } catch (error) {
        results.push({
          name,
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime: performance.now() - checkStart,
          timestamp: new Date()
        })
      }
    })
    
    await Promise.all(checkPromises)
    
    // Get system metrics
    const metrics = await this.getSystemMetrics()
    
    // Determine overall status
    const unhealthyCount = results.filter(r => r.status === 'unhealthy').length
    const degradedCount = results.filter(r => r.status === 'degraded').length
    
    let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'
    if (unhealthyCount > 0) {
      overallStatus = 'unhealthy'
    } else if (degradedCount > 0) {
      overallStatus = 'degraded'
    }
    
    const status: HealthStatus = {
      status: overallStatus,
      checks: results,
      metrics,
      version: this.version,
      environment: this.environment,
      timestamp: new Date()
    }
    
    this.lastStatus = status
    this.emit('health:checked', status)
    
    const totalTime = performance.now() - startTime
    console.log(`Health check completed in ${totalTime.toFixed(2)}ms - Status: ${overallStatus}`)
    
    return status
  }
  
  /**
   * Get the last health status
   */
  getLastStatus(): HealthStatus | null {
    return, this.lastStatus
  }
  
  /**
   * Start periodic health checks
   */
  startPeriodicChecks(intervalMs: number = 30000): void {
    if (this.checkInterval) {
      this.stopPeriodicChecks()
    }
    
    this.checkInterval = setInterval(async () => {
      try {
        await this.runAllChecks()
      } catch (error) {
        console.error('Error running periodic health, check:', error)
      }
    }, intervalMs)
    
    console.log(`Started periodic health checks every ${intervalMs}ms`)
  }
  
  /**
   * Stop periodic health checks
   */
  stopPeriodicChecks(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
      console.log('Stopped periodic health checks')
    }
  }
  
  /**
   * Get system metrics
   */
  private async getSystemMetrics(): Promise<SystemMetrics> {
    const cpus = os.cpus()
    const totalMemory = os.totalmem()
    const freeMemory = os.freemem()
    const usedMemory = totalMemory - freeMemory
    
    // Calculate CPU usage
    const cpuUsage = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0)
      const idle = cpu.times.idle
      return acc + ((total - idle) / total) * 100
    }, 0) / cpus.length
    
    return {
      cpu: {
        usage: cpuUsage,
        cores: cpus.length,
        loadAverage: os.loadavg()
      },
      memory: {
        total: totalMemory,
        used: usedMemory,
        free: freeMemory,
        percentage: (usedMemory / totalMemory) * 100
      },
      disk: {
        // This is a placeholder - real disk usage would require additional dependencies, total: 0,
        used: 0,
        free: 0,
        percentage: 0
      },
      uptime: os.uptime()
    }
  }
  
  /**
   * Setup default health checks
   */
  private setupDefaultChecks(): void {
    // System health check
    this.registerCheck('system', async () => {
      const metrics = await this.getSystemMetrics()
      
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
      const issues: string[] = []
      
      if (metrics.cpu.usage > 90) {
        status = 'unhealthy'
        issues.push('CPU usage critical')
      } else if (metrics.cpu.usage > 70) {
        status = 'degraded'
        issues.push('CPU usage high')
      }
      
      if (metrics.memory.percentage > 90) {
        status = 'unhealthy'
        issues.push('Memory usage critical')
      } else if (metrics.memory.percentage > 80) {
        status = status === 'healthy' ? 'degraded' : status
        issues.push('Memory usage high')
      }
      
      return {
        name: 'system',
        status,
        details: {
          cpu: `${metrics.cpu.usage.toFixed(1)}%`,
          memory: `${metrics.memory.percentage.toFixed(1)}%`,
          uptime: `${Math.floor(metrics.uptime / 3600)}h`,
          issues
        },
        timestamp: new Date()
      }
    })
    
    // Process health check
    this.registerCheck('process', async () => {
      const memoryUsage = process.memoryUsage()
      const heapUsed = memoryUsage.heapUsed / 1024 / 1024 // MB
      const heapTotal = memoryUsage.heapTotal / 1024 / 1024 // MB
      const heapPercentage = (heapUsed / heapTotal) * 100
      
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
      if (heapPercentage > 90) {
        status = 'unhealthy'
      } else if (heapPercentage > 70) {
        status = 'degraded'
      }
      
      return {
        name: 'process',
        status,
        details: {
          pid: process.pid,
          uptime: `${Math.floor(process.uptime())}s`,
          memory: {
            heapUsed: `${heapUsed.toFixed(2)}MB`,
            heapTotal: `${heapTotal.toFixed(2)}MB`,
            percentage: `${heapPercentage.toFixed(1)}%`
          }
        },
        timestamp: new Date()
      }
    })
  }
}

// Pre-configured health checks for common services

export const createDatabaseHealthCheck = (db): HealthCheck => async () => {
  const start = performance.now()
  
  try {
    // Example: Test database connection with a simple query
    await db.query('SELECT 1')
    
    return {
      name: 'database',
      status: 'healthy',
      responseTime: performance.now() - start,
      timestamp: new Date()
    }
  } catch (error) {
    return {
      name: 'database',
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Database connection failed',
      responseTime: performance.now() - start,
      timestamp: new Date()
    }
  }
}

export const createRedisHealthCheck = (redis): HealthCheck => async () => {
  const start = performance.now()
  
  try {
    await redis.ping()
    
    return {
      name: 'redis',
      status: 'healthy',
      responseTime: performance.now() - start,
      timestamp: new Date()
    }
  } catch (error) {
    return {
      name: 'redis',
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Redis connection failed',
      responseTime: performance.now() - start,
      timestamp: new Date()
    }
  }
}

export const createExternalServiceHealthCheck = (
  name: string,
  url: string,
  timeout: number = 5000
): HealthCheck => async () => {
  const start = performance.now()
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(url, {
      signal: controller.signal,
      method: 'GET'
    })
    
    clearTimeout(timeoutId)
    
    const responseTime = performance.now() - start
    
    if (response.ok) {
      return {
        name,
        status: 'healthy',
        responseTime,
        details: {
          statusCode: response.status
        },
        timestamp: new Date()
      }
    } else if (response.status >= 500) {
      return {
        name,
        status: 'unhealthy',
        responseTime,
        error: `Service returned ${response.status}`,
        timestamp: new Date()
      }
    } else {
      return {
        name,
        status: 'degraded',
        responseTime,
        details: {
          statusCode: response.status
        },
        timestamp: new Date()
      }
    }
  } catch (error) {
    return {
      name,
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Service unreachable',
      responseTime: performance.now() - start,
      timestamp: new Date()
    }
  }
}

// Singleton instance
let healthCheckService: HealthCheckService | null = null

export function getHealthCheckService(
  version?: string,
  environment?: string
): HealthCheckService {
  if (!healthCheckService) {
    healthCheckService = new HealthCheckService(version, environment)
  }
  return healthCheckService
}