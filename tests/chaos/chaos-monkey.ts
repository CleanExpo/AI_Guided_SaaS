import { EventEmitter } from 'events'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface ChaosScenario {
  id: string
  name: string
  description: string
  probability: number // 0-1, chance of occurring
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'network' | 'resource' | 'service' | 'database' | 'agent'
  action: () => Promise<void>
  recovery: () => Promise<void>
}

export interface ChaosResult {
  scenario: ChaosScenario
  timestamp: Date
  triggered: boolean
  recovered: boolean
  error?: string
  recoveryTime?: number
  systemResponse: {
    selfHealed: boolean, alertsTriggered: string[]
    servicesAffected: string[]
  }
}

export class ChaosMonkey extends EventEmitter {
  private scenarios: ChaosScenario[] = []
  private isRunning: boolean = false
  private results: ChaosResult[] = []
  private interval?: NodeJS.Timer
  
  constructor() {
    super()
    this.initializeScenarios()
  }
  
  private initializeScenarios() {
    this.scenarios = [
      // Network Chaos
      {
        id: 'network_latency',
        name: 'Network Latency Spike',
        description: 'Introduce 500ms latency to all network calls',
        probability: 0.3,
        severity: 'medium',
        category: 'network',
        action: async () => {
          // Simulate network latency (would use tc command in real Linux)
          console.log('🌐 Introducing network latency...')
          process.env.CHAOS_NETWORK_LATENCY = '500'
        },
        recovery: async () => {
          delete process.env.CHAOS_NETWORK_LATENCY
          console.log('✅ Network latency removed')
        }
      },
      {
        id: 'network_partition',
        name: 'Network Partition',
        description: 'Simulate network partition between services',
        probability: 0.1,
        severity: 'high',
        category: 'network',
        action: async () => {
          console.log('🔌 Creating network partition...')
          // In Docker, this would block communication between containers
          await execAsync('docker network disconnect agent-network ai-saas-agent-backend || true')
        },
        recovery: async () => {
          await execAsync('docker network connect agent-network ai-saas-agent-backend || true')
          console.log('✅ Network partition healed')
        }
      },
      
      // Resource Chaos
      {
        id: 'cpu_spike',
        name: 'CPU Spike',
        description: 'Consume 90% CPU for 30 seconds',
        probability: 0.2,
        severity: 'high',
        category: 'resource',
        action: async () => {
          console.log('🔥 Spiking CPU usage...')
          // CPU stress test
          const workers: any[] = []
          const cores = require('os').cpus().length
          
          for (let i = 0; i < cores; i++) {
            const worker = setInterval(() => {
              // CPU intensive operation
              let result = 0
              for (let j = 0; j < 1000000; j++) {
                result += Math.sqrt(j)
              }
            }, 0)
            workers.push(worker)
          }
          
          // Store workers for cleanup
          (global as any).chaosWorkers = workers
          
          // Auto-cleanup after 30 seconds
          setTimeout(() => {
            workers.forEach(w => clearInterval(w))
            delete (global as any).chaosWorkers
          }, 30000)
        },
        recovery: async () => {
          if ((global as any).chaosWorkers) {
            (global as any).chaosWorkers.forEach((w) => clearInterval(w))
            delete (global as any).chaosWorkers
          }
          console.log('✅ CPU usage normalized')
        }
      },
      {
        id: 'memory_leak',
        name: 'Memory Leak Simulation',
        description: 'Gradually consume memory',
        probability: 0.15,
        severity: 'high',
        category: 'resource',
        action: async () => {
          console.log('💧 Simulating memory leak...')
          const leaks: any[] = []
          const leakInterval = setInterval(() => {
            // Allocate 50MB
            const leak = Buffer.alloc(50 * 1024 * 1024)
            leaks.push(leak)
            
            // Stop at 500MB to avoid crashing
            if (leaks.length >= 10) {
              clearInterval(leakInterval)
            }
          }, 1000)
          
          (global as any).memoryLeaks = { leaks, interval: leakInterval }
        },
        recovery: async () => {
          if ((global as any).memoryLeaks) {
            clearInterval((global as any).memoryLeaks.interval)
            delete (global as any).memoryLeaks
          }
          // Force garbage collection if available
          if (global.gc) {
            global.gc()
          }
          console.log('✅ Memory leak cleaned')
        }
      },
      
      // Service Chaos
      {
        id: 'container_kill',
        name: 'Random Container Kill',
        description: 'Kill a random agent container',
        probability: 0.1,
        severity: 'critical',
        category: 'service',
        action: async () => {
          const agents = ['frontend', 'backend', 'qa']
          const target = agents[Math.floor(Math.random() * agents.length)]
          console.log(`☠️ Killing agent-${target} container...`)
          
          try {
            await execAsync(`docker stop ai-saas-agent-${target} || true`)
          } catch (error) {
            console.error('Failed to stop container:', error)
          }
        },
        recovery: async () => {
          try {
            await execAsync('docker-compose -f docker-compose.agents.yml up -d')
            console.log('✅ Container restarted')
          } catch (error) {
            console.error('Failed to restart container:', error)
          }
        }
      },
      {
        id: 'service_timeout',
        name: 'Service Timeout',
        description: 'Make a service unresponsive',
        probability: 0.2,
        severity: 'medium',
        category: 'service',
        action: async () => {
          console.log('⏱️ Making service unresponsive...')
          process.env.CHAOS_SERVICE_TIMEOUT = 'true'
        },
        recovery: async () => {
          delete process.env.CHAOS_SERVICE_TIMEOUT
          console.log('✅ Service responsiveness restored')
        }
      },
      
      // Database Chaos
      {
        id: 'db_connection_drop',
        name: 'Database Connection Drop',
        description: 'Drop database connections',
        probability: 0.15,
        severity: 'high',
        category: 'database',
        action: async () => {
          console.log('🗄️ Dropping database connections...')
          try {
            // Terminate all connections except our own
            await execAsync(`docker exec ai-saas-postgres psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND datname = 'ai_guided_saas';" || true`)
          } catch (error) {
            console.error('Failed to drop connections:', error)
          }
        },
        recovery: async () => {
          // Connections should auto-reconnect
          console.log('✅ Database connections will auto-recover')
        }
      },
      {
        id: 'db_slow_queries',
        name: 'Database Slow Queries',
        description: 'Introduce artificial query delays',
        probability: 0.25,
        severity: 'low',
        category: 'database',
        action: async () => {
          console.log('🐌 Slowing down database queries...')
          process.env.CHAOS_DB_SLOW_QUERIES = '2000' // 2 second delay
        },
        recovery: async () => {
          delete process.env.CHAOS_DB_SLOW_QUERIES
          console.log('✅ Database query speed restored')
        }
      },
      
      // Agent Chaos
      {
        id: 'agent_task_failure',
        name: 'Agent Task Failure',
        description: 'Force agent tasks to fail randomly',
        probability: 0.3,
        severity: 'medium',
        category: 'agent',
        action: async () => {
          console.log('🤖 Injecting agent task failures...')
          process.env.CHAOS_AGENT_FAILURE_RATE = '0.5' // 50% failure rate
        },
        recovery: async () => {
          delete process.env.CHAOS_AGENT_FAILURE_RATE
          console.log('✅ Agent task success rate restored')
        }
      },
      {
        id: 'agent_communication_failure',
        name: 'Agent Communication Failure',
        description: 'Break inter-agent communication',
        probability: 0.1,
        severity: 'high',
        category: 'agent',
        action: async () => {
          console.log('📡 Breaking agent communication...')
          process.env.CHAOS_AGENT_COMM_FAILURE = 'true'
        },
        recovery: async () => {
          delete process.env.CHAOS_AGENT_COMM_FAILURE
          console.log('✅ Agent communication restored')
        }
      }
    ]
  }
  
  start(intervalMs: number = 60000) {
    if (this.isRunning) {
      console.log('⚠️ Chaos Monkey is already running')
      return
    }
    
    console.log('🐵 Chaos Monkey started!')
    this.isRunning = true
    
    this.interval = setInterval(() => {
      this.maybeExecuteScenario()
    }, intervalMs)
    
    // Initial chaos
    this.maybeExecuteScenario()
  }
  
  stop() {
    if (!this.isRunning) return
    
    console.log('🛑 Stopping Chaos Monkey...')
    this.isRunning = false
    
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }
    
    // Clean up any active chaos
    this.cleanupAllScenarios()
  }
  
  private async maybeExecuteScenario() {
    if (!this.isRunning) return
    
    // Select a random scenario based on probability
    const scenario = this.selectScenario()
    if (!scenario) return
    
    const result: ChaosResult = {
      scenario,
      timestamp: new Date(),
      triggered: false,
      recovered: false,
      systemResponse: {
        selfHealed: false,
        alertsTriggered: [],
        servicesAffected: []
      }
    }
    
    try {
      console.log(`\n🎲 Chaos Monkey: Executing "${scenario.name}"`)
      this.emit('chaos:start', scenario)
      
      // Execute chaos
      await scenario.action()
      result.triggered = true
      
      // Monitor system response
      const monitorStart = Date.now()
      result.systemResponse = await this.monitorSystemResponse(scenario)
      
      // Wait a bit before recovery
      const chaosDuration = this.getChaossDuration(scenario.severity)
      await new Promise(resolve => setTimeout(resolve, chaosDuration))
      
      // Attempt recovery
      console.log('🔧 Attempting recovery...')
      await scenario.recovery()
      result.recovered = true
      result.recoveryTime = Date.now() - monitorStart
      
      this.emit('chaos:end', result)
      
    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ Chaos scenario failed:', error)
      
      // Always try to recover
      try {
        await scenario.recovery()
        result.recovered = true
      } catch (recoveryError) {
        console.error('❌ Recovery also failed:', recoveryError)
      }
    }
    
    this.results.push(result)
  }
  
  private selectScenario(): ChaosScenario | null {
    // Filter scenarios by probability
    const candidates = this.scenarios.filter(s => Math.random() < s.probability)
    
    if (candidates.length === 0) return null
    
    // Select random from candidates
    return candidates[Math.floor(Math.random() * candidates.length)]
  }
  
  private getChaossDuration(severity: string): number {
    const durations = {
      low: 5000,      // 5 seconds
      medium: 15000,  // 15 seconds
      high: 30000,    // 30 seconds
      critical: 60000 // 1 minute
    }
    return durations[severity as keyof typeof durations] || 10000
  }
  
  private async monitorSystemResponse(scenario: ChaosScenario): Promise<{
    selfHealed: boolean
    alertsTriggered: string[]
    servicesAffected: string[]
  }> {
    const response = {
      selfHealed: false,
      alertsTriggered: [] as string[],
      servicesAffected: [] as string[]
    }
    
    // Check if system self-healed
    try {
      // Check health endpoints
      const healthCheck = await fetch('http://localhost:3000/api/health')
      if (healthCheck.ok) {
        response.selfHealed = true
      }
      
      // Check for triggered alerts (would query Prometheus/Alertmanager in reality)
      if (scenario.severity === 'critical' || scenario.severity === 'high') {
        response.alertsTriggered.push(`${scenario.category}_alert`)
      }
      
      // Check affected services
      const { stdout } = await execAsync('docker ps --format "{{.Names}}\\t{{.Status}}"')
      const unhealthyServices = stdout
        .split('\n')
        .filter(line => line.includes('unhealthy') || line.includes('Restarting'))
        .map(line => line.split('\t')[0])
      
      response.servicesAffected = unhealthyServices
      
    } catch (error) {
      console.error('Failed to monitor system response:', error)
    }
    
    return response
  }
  
  private async cleanupAllScenarios() {
    console.log('🧹 Cleaning up all chaos scenarios...')
    
    for (const scenario of this.scenarios) {
      try {
        await scenario.recovery()
      } catch (error) {
        console.error(`Failed to cleanup ${scenario.name}:`, error)
      }
    }
  }
  
  getResults(): ChaosResult[] {
    return this.results
  }
  
  generateReport(): string {
    const totalRuns = this.results.length
    const successful = this.results.filter(r => r.triggered && r.recovered).length
    const selfHealed = this.results.filter(r => r.systemResponse.selfHealed).length
    
    const avgRecoveryTime = this.results
      .filter(r => r.recoveryTime)
      .reduce((sum, r) => sum + (r.recoveryTime || 0), 0) / successful || 0
    
    return `
Chaos Testing Report
===================
Total Chaos Events: ${totalRuns}
Successfully Executed: ${successful}
Self-Healed: ${selfHealed}
Average Recovery Time: ${(avgRecoveryTime / 1000).toFixed(1)}s

Scenario Breakdown:
${this.scenarios.map(s => {
  const runs = this.results.filter(r => r.scenario.id === s.id)
  const success = runs.filter(r => r.triggered && r.recovered).length
  return `- ${s.name}: ${success}/${runs.length} successful`
}).join('\n')}

System Resilience Score: ${((selfHealed / totalRuns) * 100).toFixed(1)}%
`
  }
}