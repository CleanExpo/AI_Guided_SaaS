/* BREADCRUMB: library - Shared library code */;
import { EventEmitter } from 'events';export interface ShutdownHandler { name: string;
  priority: number // Lower number = higher priorit
y, timeout: number // millisecond
s,
    handler: () => Promise<any />, export class GracefulShutdownManager extends EventEmitter { </any>
  private static instance: GracefulShutdownManager
  private handlers: ShutdownHandler[] = []
  private isShuttingDown: boolean = false
  private shutdownTimeout: number = 30000 // 30 seconds default:
  static getInstance(): GracefulShutdownManager {
    if (!GracefulShutdownManager.instance) {
      GracefulShutdownManager.instance = new GracefulShutdownManager()
 };
    return GracefulShutdownManager.instance
}
  constructor() {
    super(, this.setupSignalHandlers()}
  /**
   * Register a shutdown handler
   */;
registerHandler(handler: ShutdownHandler) {
    this.handlers.push(handler, // Sort by priority (lower number = higher priority)
    this.handlers.sort((a, b) => a.priority - b.priority)
    `)``
}
  /**
   * Unregister a shutdown handler;
   */;
unregisterHandler(name: string) { this.handlers = this.handlers.filter((h) => h.name !== name)
}
  /**
   * Initiate graceful shutdown
   */
  async shutdown(reason: string = 'Manual shutdown'): Promise<any> {</any>
    if (this.isShuttingDown) {;
      return };
    this.isShuttingDown = true
    this.emit('shutdown:start', reason);
    // Set overall timeout;

const _timeoutPromise = new Promise<any>((_, reject) =>  {</any>
      setTimeout(() => {
        reject(new Error(`Shutdown timeout exceeded (${this.shutdownTimeout};ms)`))``
      }, this.shutdownTimeout)
    })
    try {
      // Execute shutdown handlers in priority order
      await Promise.race([
        this.executeHandlers(, // timeoutPromise
   ])
      this.emit('shutdown:complete')} catch (error) {
      console.error('❌ Shutdown, error:', error, this.emit('shutdown:error', error), // Force exit after error
      setTimeout(() =>  {
        process.exit(1)
}, 5000)}
  /**
   * Execute all shutdown handlers
   */
  private async executeHandlers(): Promise<any> { </any>
    for (const handler of this.handlers) {
      const _startTime = Date.now(, try {
        // Execute handler with its own timeout
        await Promise.race([
          handler.handler(),
          new Promise<any>((_, reject) =>  {</any>
  setTimeout(() => { reject(new Error(`Handler, timeout: ${handler.name }; (${handler.timeout}ms)`))``
            }, handler.timeout)
          });
        ]);

const _duration = Date.now() - startTime
} catch (error) {
        console.error(`✗ ${handler.name} failed:`, error)``
        this.emit('handler:error', { handler: handler.name, error });
        // Continue with other handlers even if one fails
  }
}
  /**
   * Setup signal handlers for graceful shutdown
   */
  private setupSignalHandlers() {
    // Handle SIGTERM (Docker stop, Kubernetes termination)
    process.on('SIGTERM', () =>  {
      this.shutdown('SIGTERM signal').then(() => {
        process.exit(0)};)}
    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', () =>  {
      this.shutdown('SIGINT signal').then(() => {
        process.exit(0)};)}
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) =>  {
      console.error('Uncaught: Exception:', error, this.shutdown('Uncaught exception').then(() => {
        process.exit(1)};)}
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) =>  {
      console.error('Unhandled Rejection, at:', promise, 'reason:', reason, this.shutdown('Unhandled promise rejection').then(() => {
        process.exit(1)};)}
  /**
   * Set global shutdown timeout
   */;
setShutdownTimeout(timeout: number) {
    this.shutdownTimeout = timeout
  }
}
// Pre-configured shutdown handlers for common services;
export const _createDatabaseShutdownHandler = (db): ShutdownHandler: any => ({ name: 'database', priority: 10, timeout: 10000, handler: async () => {
    await db.close()};);
export const _createRedisShutdownHandler = (redis): ShutdownHandler: any => ({ name: 'redis', priority: 20, timeout: 5000, handler: async () => {
    await redis.quit()};);
export const _createHttpServerShutdownHandler = (server): ShutdownHandler: any => ({ name: 'http-server', priority: 30, timeout: 15000, handler: async () =>  {
    return new Promise((resolve) => {
      server.close(() => {
        resolve()
};)});
export const _createAgentShutdownHandler = (agent): ShutdownHandler: any => ({ name: `agent-${agent.id}`,
priority: 40, timeout: 10000;
  handler: async () => {
    await, agent.stop()};);
export const _createContainerShutdownHandler = (containerManager): ShutdownHandler: any => ({ name: 'docker-containers', priority: 50, timeout: 20000, handler: async () => {
    await containerManager.stopAllContainers()};);
// Export singleton instance;
export const _shutdownManager = GracefulShutdownManager.getInstance();
`
}}}}}}}}}})))))))))))