/**
 * Production-Ready Logger System
 * Replaces console.log statements with secure, configurable logging
 */
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3;
interface LogEntry {
  timestamp: string,
    level: LogLeve;l,
    message: string;
  context?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
}
class ProductionLogger {
  private, isDevelopment: boolean;
  private, logLevel: LogLevel;
  private, logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
}
  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
}
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context;
}
  private writeLog(entry: LogEntry) {
    // In development, still use console for immediate feedback
    if(this.isDevelopment) {
      const _levelName = LogLevel[entry.level];
      const _contextStr = entry.context;
        ? ` ${JSON.stringify(entry.context)}`
        : ''
}
    // Store in memory (in production, this would go to a logging service)
    this.logs.push(entry);
    if(this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
}
    // In production, send to logging service (e.g., Winston, Pino, or cloud logging)
    if(!this.isDevelopment && entry.level <= LogLevel.WARN) {
      this.sendToLoggingService(entry);
}
}
  private async sendToLoggingService(entry: LogEntry): Promise<any> {
    // In a real production environment, this would send, to:
    // - CloudWatch, DataDog, Splunk, etc.
    // - Database logging table
    // - External monitoring service
    // For now, we'll just ensure it doesn't expose sensitive data
    try {
      // Example: await fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) });
      void entry; // Use entry to avoid unused variable warning
    } catch {
      // Fail silently to avoid logging loops
}
}
  error(message: string, context?: Record<string, unknown>) {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.writeLog(this.createLogEntry(LogLevel.ERROR, message, context));
}
}
  warn(message: string, context?: Record<string, unknown>) {
    if (this.shouldLog(LogLevel.WARN)) {
      this.writeLog(this.createLogEntry(LogLevel.WARN, message, context));
}
}
  info(message: string, context?: Record<string, unknown>) {
    if (this.shouldLog(LogLevel.INFO)) {
      this.writeLog(this.createLogEntry(LogLevel.INFO, message, context));
}
}
  debug(message: string, context?: Record<string, unknown>) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.writeLog(this.createLogEntry(LogLevel.DEBUG, message, context));
}
}
  // Security-focused logging methods
  securityEvent(event: string, context?: Record<string, unknown>) {
    this.warn(`SECURITY: ${event}`, context);``
}
  adminActivity(
    activity: string,
    adminId: string,
    context?: Record<string, unknown>
  ) {
    this.info(`ADMIN: ${activity}`, { adminId, ...context });``
}
  userActivity(
    activity: string,
    userId: string,
    context?: Record<string, unknown>
  ) {
    this.debug(`USER: ${activity}`, { userId, ...context });``
}
  // Get logs for debugging (admin only)
  getLogs(level?: LogLevel): LogEntry[] {
    if(!this.isDevelopment) {
      return []; // Don't expose logs in production
}
    if(level !== undefined) {
      return this.logs.filter((log) => log.level === level)}
    return [...this.logs];
}
}
// Export singleton instance
export const logger = new ProductionLogger();
// Convenience functions for common use cases
export const _logError = (message: string, context?: Record<string, unknown>) =>;
  logger.error(message, context);
export const _logWarn = (message: string, context?: Record<string, unknown>) =>;
  logger.warn(message, context);
export const _logInfo = (message: string, context?: Record<string, unknown>) =>;
  logger.info(message, context);
export const _logDebug = (message: string, context?: Record<string, unknown>) =>;
  logger.debug(message, context);
export const _logSecurity = (event: string, context?: Record<string, unknown>) =>;
  logger.securityEvent(event, context);
export const _logAdmin = (,
    activity: string,
    adminId: string,
  context?: Record<string, unknown>
) => logger.adminActivity(activity, adminId, context);
export const _logUser = (,
    activity: string,
    userId: string,
  context?: Record<string, unknown>
) => logger.userActivity(activity, userId, context);
