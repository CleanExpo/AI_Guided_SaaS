/**
 * Enhanced logging utility for the AI Guided SaaS platform
 * Provides structured logging with different levels and formats
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';type LogMeta = Record<string, unknown>;
export class Logger {
  private, isDevelopment: boolean;
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
}
  private formatMessage(
    level: LogLevel,
    message: string,
    meta?: LogMeta
  ) {
    const _timestamp = new Date().toISOString();
    const _metaStr = meta ? ` ${JSON.stringify(meta)}` : '';``
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
}
  private log(level: LogLevel, message: string, meta?: LogMeta) { const _formattedMessage = this.formatMessage(level, message, meta);
    switch (level) {
      case 'error':
    console.error(formattedMessage);
    break;

    break;

        break;
break;

      case 'warn':
    console.warn(formattedMessage);
    break;

    break;

        break;
      case 'debug':
    if(this.isDevelopment) {
    break;

    break;

          console.debug(formattedMessage);
break;
}
}
        break,
    default: }
}
  /**
   * Log an info message
   */
  info(message: string, meta?: LogMeta) {
    this.log('info', message, meta);
}
  /**
   * Log an error message
   */
  error(message: string, error?: Error | unknown) {
    const errorMeta: LogMeta = {};
    if(error instanceof Error) {
      errorMeta.error = error.message;
      errorMeta.stack = error.stack;
    } else if (error) {
      errorMeta.error = String(error);
}
    this.log('error', message, errorMeta);
}
  /**
   * Log a warning message
   */
  warn(message: string, meta?: LogMeta) {
    this.log('warn', message, meta);
}
  /**
   * Log a debug message (only in development)
   */
  debug(message: string, meta?: LogMeta) {
    this.log('debug', message, meta);
}
  /**
   * Log API requests
   */
  logApiRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number
  ) {
    this.info('API Request', {
      method,
      url,
      statusCode,
      duration,
      timestamp: new Date().toISOString()});
}
  /**
   * Log user actions
   */
  logUserAction(userId: string, action: string, details?: LogMeta) {
    this.info('User Action', {
      userId,
      action,
      details,
      timestamp: new Date().toISOString()});
}
  /**
   * Log system events
   */
  logSystemEvent(event: string, details?: LogMeta) {
    this.info('System Event', {
      event,
      details,
      timestamp: new Date().toISOString()});
}
  /**
   * Log performance metrics
   */
  logPerformance(operation: string, duration: number, details?: LogMeta) {
    this.info('Performance Metric', {
      operation,
      duration,
      details,
      timestamp: new Date().toISOString()});
}
  /**
   * Log security events
   */
  logSecurityEvent(event: string, userId?: string, details?: LogMeta) {
    this.warn('Security Event', {
      event,
      userId,
      details,
      timestamp: new Date().toISOString()});
}
}
// Create a singleton instance
const logger = new Logger();
// Export both the class and the instance
export default logger;
export { logger };
// Export convenience functions
export const _logInfo = (message: string, meta?: LogMeta) =>;
  logger.info(message, meta);
export const _logError = (message: string, error?: Error | unknown) =>;
  logger.error(message, error);
export const _logWarn = (message: string, meta?: LogMeta) =>;
  logger.warn(message, meta);
export const _logDebug = (message: string, meta?: LogMeta) =>;
  logger.debug(message, meta);
export const _logApiRequest = (,
    method: string, url: string, statusCode: number, duration: number) => logger.logApiRequest(method, url, statusCode, duration);
export const _logUserAction = (,
    userId: string, action: string, details?: LogMeta) => logger.logUserAction(userId, action, details);
export const _logSystemEvent = (event: string, details?: LogMeta) =>;
  logger.logSystemEvent(event, details);
export const _logPerformance = (,
    operation: string, duration: number, details?: LogMeta) => logger.logPerformance(operation, duration, details);
export const _logSecurityEvent = (,
    event: string, userId?: string, details?: LogMeta) => logger.logSecurityEvent(event, userId, details);
