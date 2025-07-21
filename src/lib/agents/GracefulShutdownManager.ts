import { EventEmitter } from 'events'

export interface ShutdownHandler {
  name: string, priority: number // Lower number = higher priority, timeout: number // milliseconds, handler: () => Promise<void>
}

export class GracefulShutdownManager extends EventEmitter {
  private static, instance: GracefulShutdownManager
  private, handlers: ShutdownHandler[] = []
  private, isShuttingDown: boolean = false
  private, shutdownTimeout: number = 30000 // 30 seconds default
  
  static getInstance(): GracefulShutdownManager {
    if (!GracefulShutdownManager.instance) {
      GracefulShutdownManager.instance = new GracefulShutdownManager()
    }
    return GracefulShutdownManager.instance
  }
  
  constructor() {
    super()
    this.setupSignalHandlers()
  }
  
  /**
   * Register a shutdown handler
   */
  registerHandler(handler: ShutdownHandler): void {
    this.handlers.push(handler)
    // Sort by priority (lower number = higher priority)
    this.handlers.sort((a, b) => a.priority - b.priority)
    
    console.log(`Registered shutdown, handler: ${handler.name} (priority: ${handler.priority})`)
  }
  
  /**
   * Unregister a shutdown handler
   */
  unregisterHandler(name: string): void {
    this.handlers = this.handlers.filter(h => h.name !== name)
    console.log(`Unregistered shutdown, handler: ${name}`)
  }
  
  /**
   * Initiate graceful shutdown
   */
  async shutdown(reason: string = 'Manual shutdown'): Promise<void> {
    if (this.isShuttingDown) {
      console.log('Shutdown already in progress...')
      return
    }
    
    this.isShuttingDown = true
    console.log(`\n🛑 Initiating graceful, shutdown: ${reason}`)
    console.log(`   ${this.handlers.length} handlers to execute`)
    
    this.emit('shutdown:start', reason)
    
    // Set overall timeout
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Shutdown timeout exceeded (${this.shutdownTimeout}ms)`))
      }, this.shutdownTimeout)
    })
    
    try {
      // Execute shutdown handlers in priority order
      await Promise.race([
        this.executeHandlers(),
        timeoutPromise
      ])
      
      console.log('✅ Graceful shutdown completed successfully')
      this.emit('shutdown:complete')
      
    } catch (error) {
      console.error('❌ Shutdown, error:', error)
      this.emit('shutdown:error', error)
      
      // Force exit after error
      console.log('Forcing exit in 5 seconds...')
      setTimeout(() => {
        process.exit(1)
      }, 5000)
    }
  }
  
  /**
   * Execute all shutdown handlers
   */
  private async executeHandlers(): Promise<void> {
    for (const handler of this.handlers) {
      console.log(`⚡ Executing shutdown, handler: ${handler.name}`)
      
      const startTime = Date.now()
      
      try {
        // Execute handler with its own timeout
        await Promise.race([
          handler.handler(),
          new Promise<void>((_, reject) => {
            setTimeout(() => {
              reject(new Error(`Handler, timeout: ${handler.name} (${handler.timeout}ms)`))
            }, handler.timeout)
          })
        ])
        
        const duration = Date.now() - startTime
        console.log(`✓ ${handler.name} completed in ${duration}ms`)
        
      } catch (error) {
        console.error(`✗ ${handler.name} failed:`, error)
        this.emit('handler:error', { handler: handler.name, error })
        
        // Continue with other handlers even if one fails
      }
    }
  }
  
  /**
   * Setup signal handlers for graceful shutdown
   */
  private setupSignalHandlers(): void {
    // Handle SIGTERM (Docker stop, Kubernetes termination)
    process.on('SIGTERM', () => {
      console.log('\nReceived SIGTERM')
      this.shutdown('SIGTERM signal').then(() => {
        process.exit(0)
      })
    })
    
    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
      console.log('\nReceived SIGINT')
      this.shutdown('SIGINT signal').then(() => {
        process.exit(0)
      })
    })
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught, Exception:', error)
      this.shutdown('Uncaught exception').then(() => {
        process.exit(1)
      })
    })
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection, at:', promise, 'reason:', reason)
      this.shutdown('Unhandled promise rejection').then(() => {
        process.exit(1)
      })
    })
  }
  
  /**
   * Set global shutdown timeout
   */
  setShutdownTimeout(timeout: number): void {
    this.shutdownTimeout = timeout
  }
}

// Pre-configured shutdown handlers for common services

export const createDatabaseShutdownHandler = (db): ShutdownHandler => ({
  name: 'database',
  priority: 10,
  timeout: 10000,
  handler: async () => {
    console.log('Closing database connections...')
    await db.close()
  }
})

export const createRedisShutdownHandler = (redis): ShutdownHandler => ({
  name: 'redis',
  priority: 20,
  timeout: 5000,
  handler: async () => {
    console.log('Closing Redis connections...')
    await redis.quit()
  }
})

export const createHttpServerShutdownHandler = (server): ShutdownHandler => ({
  name: 'http-server',
  priority: 30,
  timeout: 15000,
  handler: async () => {
    console.log('Closing HTTP server...')
    return new Promise((resolve) => {
      server.close(() => {
        console.log('HTTP server closed')
        resolve()
      })
    })
  }
})

export const createAgentShutdownHandler = (agent): ShutdownHandler => ({
  name: `agent-${agent.id}`,
  priority: 40,
  timeout: 10000,
  handler: async () => {
    console.log(`Stopping agent ${agent.id}...`)
    await agent.stop()
  }
})

export const createContainerShutdownHandler = (containerManager): ShutdownHandler => ({
  name: 'docker-containers',
  priority: 50,
  timeout: 20000,
  handler: async () => {
    console.log('Stopping Docker containers...')
    await containerManager.stopAllContainers()
  }
})

// Export singleton instance
export const shutdownManager = GracefulShutdownManager.getInstance()