/* BREADCRUMB: library - Shared library code */
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
      default:
        console.log(formattedMessage);
    }
  }

  debug(message: string, meta?: LogMeta): void {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: LogMeta): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: LogMeta): void {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: LogMeta): void {
    this.log('error', message, meta);
  }
}

// Export singleton instance
export const logger = new Logger();