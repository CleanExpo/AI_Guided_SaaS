import { ErrorInfo } from 'react';

export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  componentStack?: string;
  url: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface ErrorLoggerConfig {
  maxRetries?: number;
  retryDelay?: number;
  batchSize?: number;
  flushInterval?: number;
  enableConsole?: boolean;
  enableRemote?: boolean;
  remoteEndpoint?: string;
}

class ErrorLogger {
  private queue: ErrorLogEntry[] = [];
  private config: Required<ErrorLoggerConfig>;
  private flushTimer: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor(config: ErrorLoggerConfig = {}) {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      batchSize: 10,
      flushInterval: 30000, // 30 seconds
      enableConsole: process.env.NODE_ENV === 'development',
      enableRemote: process.env.NODE_ENV === 'production',
      remoteEndpoint: '/api/errors',
      ...config
    };

    // Start periodic flush
    if (this.config.enableRemote) {
      this.startPeriodicFlush();
    }

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush(true);
      });
    }
  }

  log(error: Error, errorInfo?: ErrorInfo, severity: ErrorLogEntry['severity'] = 'medium', metadata?: Record<string, any>): void {
    const entry: ErrorLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      severity,
      sessionId: this.getSessionId(),
      metadata
    };

    // Console logging in development
    if (this.config.enableConsole) {
      console.error('Error logged:', entry);
    }

    // Add to queue for remote logging
    if (this.config.enableRemote) {
      this.queue.push(entry);
      
      // Flush if batch size reached
      if (this.queue.length >= this.config.batchSize) {
        this.flush();
      }
    }

    // Track with analytics if available
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.trackError(error, severity, {
        ...metadata,
        errorId: entry.id
      });
    }
  }

  logWarning(message: string, metadata?: Record<string, any>): void {
    const error = new Error(message);
    this.log(error, undefined, 'low', metadata);
  }

  logCritical(error: Error, errorInfo?: ErrorInfo, metadata?: Record<string, any>): void {
    this.log(error, errorInfo, 'critical', metadata);
    // Immediately flush critical errors
    if (this.config.enableRemote) {
      this.flush();
    }
  }

  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      if (this.queue.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);
  }

  private async flush(sync = false): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const errors = [...this.queue];
    this.queue = [];

    try {
      if (sync) {
        // Use sendBeacon for synchronous sending on page unload
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
          navigator.sendBeacon(
            this.config.remoteEndpoint,
            JSON.stringify({ errors })
          );
        }
      } else {
        // Regular async fetch
        await this.sendErrors(errors);
      }
    } catch (error) {
      // Re-add errors to queue if send failed
      this.queue.unshift(...errors);
      console.error('Failed to send error logs:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async sendErrors(errors: ErrorLogEntry[], attempt = 1): Promise<void> {
    try {
      const response = await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ errors }),
      });

      if (!response.ok && attempt < this.config.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt));
        return this.sendErrors(errors, attempt + 1);
      }
    } catch (error) {
      if (attempt < this.config.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt));
        return this.sendErrors(errors, attempt + 1);
      }
      throw error;
    }
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') {
      return 'server';
    }

    let sessionId = sessionStorage.getItem('error-logger-session');
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('error-logger-session', sessionId);
    }
    return sessionId;
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  clearQueue(): void {
    this.queue = [];
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush(true);
  }
}

// Create a singleton instance
let errorLoggerInstance: ErrorLogger | null = null;

export function getErrorLogger(config?: ErrorLoggerConfig): ErrorLogger {
  if (!errorLoggerInstance) {
    errorLoggerInstance = new ErrorLogger(config);
  }
  return errorLoggerInstance;
}

// Convenience functions
export function logError(error: Error, errorInfo?: ErrorInfo, severity?: ErrorLogEntry['severity'], metadata?: Record<string, any>): void {
  getErrorLogger().log(error, errorInfo, severity, metadata);
}

export function logWarning(message: string, metadata?: Record<string, any>): void {
  getErrorLogger().logWarning(message, metadata);
}

export function logCritical(error: Error, errorInfo?: ErrorInfo, metadata?: Record<string, any>): void {
  getErrorLogger().logCritical(error, errorInfo, metadata);
}

// Error boundary integration
export function createErrorBoundaryHandler() {
  return (error: Error, errorInfo: ErrorInfo) => {
    const logger = getErrorLogger();
    
    // Determine severity based on error type
    let severity: ErrorLogEntry['severity'] = 'medium';
    
    if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
      severity = 'low';
    } else if (error.message.includes('Cannot read') || error.message.includes('undefined')) {
      severity = 'high';
    } else if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      severity = 'critical';
    }

    logger.log(error, errorInfo, severity, {
      errorBoundary: true,
      component: extractComponentName(errorInfo.componentStack || '')
    });
  };
}

function extractComponentName(componentStack: string): string {
  const match = componentStack.match(/^\s*in\s+(\w+)/);
  return match ? match[1] : 'Unknown';
}

// Development helpers
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    (window as any).errorLogger = {
      getLogger: getErrorLogger,
      logError,
      logWarning,
      logCritical,
      getQueueSize: () => getErrorLogger().getQueueSize(),
      clearQueue: () => getErrorLogger().clearQueue()
    };
  }
}