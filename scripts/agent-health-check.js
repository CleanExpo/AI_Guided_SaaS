const http = require('http')
const os = require('os')

// Health check configuration
const HEALTH_CHECK_PORT = process.env.HEALTH_CHECK_PORT || 3001
const AGENT_TYPE = process.env.AGENT_TYPE || 'unknown'
const AGENT_ID = process.env.AGENT_ID || 'unknown'

// Thresholds
const MAX_MEMORY_USAGE = 0.85 // 85%
const MAX_CPU_LOAD = 0.80 // 80%
const MAX_EVENT_LOOP_DELAY = 100 // 100ms

class AgentHealthChecker {
  constructor() {
    this.isHealthy = true
    this.lastCheck = Date.now()
    this.checks = {
      memory: { status: 'unknown', value: 0 },
      cpu: { status: 'unknown', value: 0 },
      eventLoop: { status: 'unknown', value: 0 },
      agent: { status: 'unknown', value: 'initializing' }
    }
  }

  checkMemory() {
    const totalMemory = os.totalmem()
    const freeMemory = os.freemem()
    const usedMemory = totalMemory - freeMemory
    const memoryUsage = usedMemory / totalMemory

    this.checks.memory = {
      status: memoryUsage < MAX_MEMORY_USAGE ? 'healthy' : 'unhealthy',
      value: memoryUsage,
      threshold: MAX_MEMORY_USAGE,
      used: Math.round(usedMemory / 1024 / 1024),
      total: Math.round(totalMemory / 1024 / 1024)
    }

    return this.checks.memory.status === 'healthy'
  }

  checkCPU() {
    const cpus = os.cpus()
    let totalIdle = 0
    let totalTick = 0

    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type]
      }
      totalIdle += cpu.times.idle
    })

    const idle = totalIdle / cpus.length
    const total = totalTick / cpus.length
    const usage = 1 - (idle / total)

    this.checks.cpu = {
      status: usage < MAX_CPU_LOAD ? 'healthy' : 'unhealthy',
      value: usage,
      threshold: MAX_CPU_LOAD,
      cores: cpus.length
    }

    return this.checks.cpu.status === 'healthy'
  }

  checkEventLoop() {
    const start = process.hrtime.bigint()
    
    setImmediate(() => {
      const delay = Number(process.hrtime.bigint() - start) / 1000000 // Convert to ms
      
      this.checks.eventLoop = {
        status: delay < MAX_EVENT_LOOP_DELAY ? 'healthy' : 'unhealthy',
        value: delay,
        threshold: MAX_EVENT_LOOP_DELAY
      }
    })

    return this.checks.eventLoop.status === 'healthy'
  }

  checkAgentStatus() {
    // In a real implementation, this would check if the agent is properly initialized
    // and able to handle tasks
    try {
      // Check if agent process is responsive
      const agentResponsive = process.uptime() > 5 // Been running for at least 5 seconds
      
      this.checks.agent = {
        status: agentResponsive ? 'healthy' : 'unhealthy',
        value: agentResponsive ? 'ready' : 'not_ready',
        uptime: Math.round(process.uptime()),
        type: AGENT_TYPE,
        id: AGENT_ID
      }

      return this.checks.agent.status === 'healthy'
    } catch (error) {
      this.checks.agent = {
        status: 'unhealthy',
        value: 'error',
        error: error.message
      }
      return false
    }
  }

  performHealthCheck() {
    const memoryHealthy = this.checkMemory()
    const cpuHealthy = this.checkCPU()
    this.checkEventLoop() // Async check
    const agentHealthy = this.checkAgentStatus()

    this.isHealthy = memoryHealthy && cpuHealthy && agentHealthy
    this.lastCheck = Date.now()

    return {
      healthy: this.isHealthy,
      timestamp: new Date().toISOString(),
      agent: {
        type: AGENT_TYPE,
        id: AGENT_ID
      },
      checks: this.checks,
      metrics: {
        uptime: process.uptime(),
        pid: process.pid,
        nodeVersion: process.version
      }
    }
  }
}

// Create health checker instance
const healthChecker = new AgentHealthChecker()

// Create HTTP server for health endpoint
const server = http.createServer((req, res) => {
  if (req.url === '/health' && req.method === 'GET') {
    const healthStatus = healthChecker.performHealthCheck()
    
    res.writeHead(healthStatus.healthy ? 200 : 503, {
      'Content-Type': 'application/json'
    })
    
    res.end(JSON.stringify(healthStatus, null, 2))
  } else if (req.url === '/metrics' && req.method === 'GET') {
    // Prometheus-style metrics
    const metrics = healthChecker.performHealthCheck()
    
    const prometheusMetrics = `
# HELP agent_up Agent availability (1 = up, 0 = down)
# TYPE agent_up gauge
agent_up{agent_type="${AGENT_TYPE}",agent_id="${AGENT_ID}"} ${metrics.healthy ? 1 : 0}

# HELP agent_memory_usage_ratio Memory usage ratio
# TYPE agent_memory_usage_ratio gauge
agent_memory_usage_ratio{agent_type="${AGENT_TYPE}",agent_id="${AGENT_ID}"} ${metrics.checks.memory.value}

# HELP agent_cpu_usage_ratio CPU usage ratio
# TYPE agent_cpu_usage_ratio gauge
agent_cpu_usage_ratio{agent_type="${AGENT_TYPE}",agent_id="${AGENT_ID}"} ${metrics.checks.cpu.value}

# HELP agent_uptime_seconds Agent uptime in seconds
# TYPE agent_uptime_seconds counter
agent_uptime_seconds{agent_type="${AGENT_TYPE}",agent_id="${AGENT_ID}"} ${metrics.metrics.uptime}
`.trim()
    
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    })
    
    res.end(prometheusMetrics)
  } else {
    res.writeHead(404)
    res.end('Not Found')
  }
})

// Start health check server
server.listen(HEALTH_CHECK_PORT, () => {
  console.log(`Health check server running on port ${HEALTH_CHECK_PORT}`)
  console.log(`Agent: ${AGENT_TYPE} (${AGENT_ID})`)
})

// Perform health check periodically
setInterval(() => {
  const status = healthChecker.performHealthCheck()
  
  if (!status.healthy) {
    console.error('Health check failed:', JSON.stringify(status.checks, null, 2))
    
    // In production, you might want to exit the process
    // to let the container orchestrator restart it
    if (process.env.EXIT_ON_UNHEALTHY === 'true') {
      console.error('Exiting due to unhealthy status...')
      process.exit(1)
    }
  }
}, 30000) // Check every 30 seconds

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...')
  server.close(() => {
    console.log('Health check server closed')
    process.exit(0)
  })
})

// Export for use in tests
if (module.parent) {
  module.exports = { AgentHealthChecker }
}