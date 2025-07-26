import { logger } from '@/lib/logger';

export interface ErrorContext {
  operation: string;
  module?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Standard error handler for catch blocks
 * Ensures all errors are properly logged with context
 */
export function handleError(
  error: unknown,
  context: ErrorContext,
  options?: {
    rethrow?: boolean;
    fallbackValue?: unknown;
    userMessage?: string;
  }
): unknown {
  const { rethrow = false, fallbackValue, userMessage } = options || {};

  // Convert unknown error to Error object
  const err = error instanceof Error ? error : new Error(String(error));
  
  // Log error with full context
  logger.error(`Error in ${context.operation}`, {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name,
    },
    context,
  });

  // Track error metrics (integrate with analytics)
  if (typeof window === 'undefined') {
    // Server-side error tracking
    // TODO: Send to error tracking service (Sentry, etc.)
  }

  // Rethrow if requested
  if (rethrow) {
    throw new AppError(
      userMessage || err.message,
      'HANDLED_ERROR',
      500,
      context
    );
  }

  // Return fallback value if provided
  return fallbackValue;
}

/**
 * Async wrapper with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: ErrorContext,
  options?: {
    fallbackValue?: T;
    userMessage?: string;
    retries?: number;
    retryDelay?: number;
  }
): Promise<T> {
  const { fallbackValue, userMessage, retries = 0, retryDelay = 1000 } = options || {};
  
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Log retry attempt
      if (attempt < retries) {
        logger.warn(`Retrying ${context.operation} (attempt ${attempt + 1}/${retries})`, {
          error: error instanceof Error ? error.message : String(error),
          context,
        });
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }
  
  // All retries failed
  handleError(lastError, context, { userMessage });
  
  if (fallbackValue !== undefined) {
    return fallbackValue;
  }
  
  throw new AppError(
    userMessage || 'Operation failed after retries',
    'OPERATION_FAILED',
    500,
    context
  );
}

/**
 * Wraps a function to automatically handle errors
 */
export function withErrorBoundary<T extends (...args: unknown[]) => unknown>(
  fn: T,
  context: Omit<ErrorContext, 'operation'>
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args);
      
      // Handle async functions
      if (result instanceof Promise) {
        return result.catch(error => {
          handleError(error, {
            ...context,
            operation: fn.name || 'anonymous function',
          });
          throw error;
        });
      }
      
      return result;
    } catch (error) {
      handleError(error, {
        ...context,
        operation: fn.name || 'anonymous function',
      });
      throw error;
    }
  }) as T;
}

/**
 * Common error messages for consistency
 */
export const ErrorMessages = {
  // Authentication
  UNAUTHORIZED: 'You must be logged in to perform this action',
  FORBIDDEN: 'You do not have permission to perform this action',
  INVALID_CREDENTIALS: 'Invalid email or password',
  
  // Validation
  INVALID_INPUT: 'The provided input is invalid',
  MISSING_REQUIRED_FIELD: 'Required field is missing',
  
  // Resources
  NOT_FOUND: 'The requested resource was not found',
  ALREADY_EXISTS: 'A resource with this identifier already exists',
  
  // Operations
  OPERATION_FAILED: 'The operation could not be completed',
  TIMEOUT: 'The operation timed out',
  RATE_LIMITED: 'Too many requests. Please try again later',
  
  // System
  INTERNAL_ERROR: 'An internal error occurred. Please try again later',
  SERVICE_UNAVAILABLE: 'The service is temporarily unavailable',
  CONFIGURATION_ERROR: 'System configuration error',
} as const;

/**
 * Error code constants
 */
export const ErrorCodes = {
  // Client errors (4xx)
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  
  // Server errors (5xx)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
  
  // Business logic errors
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  FEATURE_DISABLED: 'FEATURE_DISABLED',
} as const;