/**
 * Enhanced logging utility for the AI Guided SaaS platform
 * Provides structured logging with different levels and formats
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogMeta = Record<string, unknown>;

export class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    meta?: LogMeta
  ): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
  }

  private log(level: LogLevel, message: string, meta?: LogMeta): void {
    const formattedMessage = this.formatMessage(level, message, meta);

    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedMessage);
        }
        break;
      default: }
  }

  /**
   * Log an info message
   */
  info(message: string, meta?: LogMeta): void {
    this.log('info', message, meta);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error | unknown): void {
    const errorMeta: LogMeta = {};
    if (error instanceof Error) {
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
  warn(message: string, meta?: LogMeta): void {
    this.log('warn', message, meta);
  }

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, meta?: LogMeta): void {
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
  ): void {
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
  logUserAction(userId: string, action: string, details?: LogMeta): void {
    this.info('User Action', {
      userId,
      action,
      details,
      timestamp: new Date().toISOString()});
  }

  /**
   * Log system events
   */
  logSystemEvent(event: string, details?: LogMeta): void {
    this.info('System Event', {
      event,
      details,
      timestamp: new Date().toISOString()});
  }

  /**
   * Log performance metrics
   */
  logPerformance(operation: string, duration: number, details?: LogMeta): void {
    this.info('Performance Metric', {
      operation,
      duration,
      details,
      timestamp: new Date().toISOString()});
  }

  /**
   * Log security events
   */
  logSecurityEvent(event: string, userId?: string, details?: LogMeta): void {
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
export const logInfo = (message: string, meta?: LogMeta) =>
  logger.info(message, meta);
export const logError = (message: string, error?: Error | unknown) =>
  logger.error(message, error);
export const logWarn = (message: string, meta?: LogMeta) =>
  logger.warn(message, meta);
export const logDebug = (message: string, meta?: LogMeta) =>
  logger.debug(message, meta);
export const logApiRequest = (
  method: string,
  url: string,
  statusCode: number,
  duration: number
) => logger.logApiRequest(method, url, statusCode, duration);
export const logUserAction = (
  userId: string,
  action: string,
  details?: LogMeta
) => logger.logUserAction(userId, action, details);
export const logSystemEvent = (event: string, details?: LogMeta) =>
  logger.logSystemEvent(event, details);
export const logPerformance = (
  operation: string,
  duration: number,
  details?: LogMeta
) => logger.logPerformance(operation, duration, details);
export const logSecurityEvent = (
  event: string,
  userId?: string,
  details?: LogMeta
) => logger.logSecurityEvent(event, userId, details);
