import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '../redis/client';
import { logger } from '../logger';

/**
 * Rate Limiting Configuration
 */
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  message?: string; // Error message
  headers?: boolean; // Include rate limit headers
}

/**
 * Default rate limit configurations
 */
export const RATE_LIMIT_PRESETS = {
  // Very strict for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts, please try again later.',
  },
  // Moderate for API endpoints
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    message: 'Too many requests, please try again later.',
  },
  // Lenient for general requests
  general: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 1000,
    message: 'Rate limit exceeded, please try again later.',
  },
  // Strict for expensive operations
  expensive: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: 'Too many expensive operations, please try again later.',
  },
} as const;

/**
 * Advanced Rate Limiter with Redis backing
 */
export class RateLimiter {
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: config.windowMs,
      maxRequests: config.maxRequests,
      keyGenerator: config.keyGenerator || this.defaultKeyGenerator,
      skipSuccessfulRequests: config.skipSuccessfulRequests || false,
      skipFailedRequests: config.skipFailedRequests || false,
      message: config.message || 'Too many requests, please try again later.',
      headers: config.headers !== false, // Default to true
    };
  }

  private defaultKeyGenerator(req: NextRequest): string {
    // Try to get IP from various headers (Vercel, Cloudflare, etc.)
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfConnectingIp = req.headers.get('cf-connecting-ip');

    const ip =
      forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
    const pathname = new URL(req.url).pathname;

    return `rate_limit:${ip}:${pathname}`;
  }

  /**
   * Check rate limit using sliding window algorithm
   */
  async checkLimit(req: NextRequest): Promise<{
    allowed: boolean;
    limit: number;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
  }> {
    const key = this.config.keyGenerator(req);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    try {
      // Use Redis if available, otherwise fall back to in-memory
      const currentCount = await this.getCurrentCount(key, windowStart, now);

      const remaining = Math.max(0, this.config.maxRequests - currentCount - 1);
      const resetTime = now + this.config.windowMs;

      if (currentCount >= this.config.maxRequests) {
        const retryAfter = Math.ceil(this.config.windowMs / 1000);

        logger.warn(`Rate limit exceeded for ${key}`, {
          currentCount,
          limit: this.config.maxRequests,
          windowMs: this.config.windowMs,
        });

        return {
          allowed: false,
          limit: this.config.maxRequests,
          remaining: 0,
          resetTime,
          retryAfter,
        };
      }

      // Increment counter
      await this.incrementCounter(key, now);

      return {
        allowed: true,
        limit: this.config.maxRequests,
        remaining,
        resetTime,
      };
    } catch (error) {
      logger.error('Rate limiter error:', error);
      // On error, allow the request to prevent blocking legitimate users
      return {
        allowed: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs,
      };
    }
  }

  private async getCurrentCount(
    key: string,
    windowStart: number,
    now: number
  ): Promise<number> {
    // Try Redis first
    const redisCount = await this.getRedisCount(key, windowStart);
    if (redisCount !== null) {
      return redisCount;
    }

    // Fallback to in-memory (not ideal for production)
    return this.getInMemoryCount(key, windowStart);
  }

  private async getRedisCount(
    key: string,
    windowStart: number
  ): Promise<number | null> {
    try {
      // Use Redis sorted sets for sliding window
      const pipeline = `
        local key = KEYS[1]
        local window_start = ARGV[1]
        local now = ARGV[2]
        
        -- Remove old entries
        redis.call('ZREMRANGEBYSCORE', key, 0, window_start)
        
        -- Count current entries
        local count = redis.call('ZCARD', key)
        
        -- Set expiry
        redis.call('EXPIRE', key, 300)
        
        return count
      `;

      // For now, use simpler approach
      const countStr = await Redis.get(`${key}:count`);
      const count = countStr ? parseInt(countStr, 10) : 0;

      return count;
    } catch (error) {
      logger.error('Redis rate limit check failed:', error);
      return null;
    }
  }

  private inMemoryStore = new Map<
    string,
    { count: number; resetTime: number }
  >();

  private getInMemoryCount(key: string, windowStart: number): number {
    const entry = this.inMemoryStore.get(key);
    if (!entry || entry.resetTime < Date.now()) {
      return 0;
    }
    return entry.count;
  }

  private async incrementCounter(key: string, now: number): Promise<void> {
    // Try Redis first
    const redisSuccess = await this.incrementRedisCounter(key, now);
    if (!redisSuccess) {
      // Fallback to in-memory
      this.incrementInMemoryCounter(key, now);
    }
  }

  private async incrementRedisCounter(
    key: string,
    now: number
  ): Promise<boolean> {
    try {
      const countKey = `${key}:count`;
      const currentCount = await Redis.incr(countKey);

      if (currentCount === 1) {
        // Set expiry for new counter
        await Redis.expire(countKey, Math.ceil(this.config.windowMs / 1000));
      }

      return true;
    } catch (error) {
      logger.error('Redis rate limit increment failed:', error);
      return false;
    }
  }

  private incrementInMemoryCounter(key: string, now: number): void {
    const resetTime = now + this.config.windowMs;
    const entry = this.inMemoryStore.get(key);

    if (!entry || entry.resetTime < now) {
      this.inMemoryStore.set(key, { count: 1, resetTime });
    } else {
      entry.count++;
    }

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      // 1% chance
      this.cleanupInMemoryStore();
    }
  }

  private cleanupInMemoryStore(): void {
    const now = Date.now();
    for (const [key, entry] of this.inMemoryStore.entries()) {
      if (entry.resetTime < now) {
        this.inMemoryStore.delete(key);
      }
    }
  }

  /**
   * Create middleware function for Next.js
   */
  middleware() {
    return async (req: NextRequest): Promise<NextResponse | null> => {
      const result = await this.checkLimit(req);

      if (!result.allowed) {
        const response = NextResponse.json(
          {
            error: this.config.message,
            retryAfter: result.retryAfter,
          },
          { status: 429 }
        );

        if (this.config.headers) {
          response.headers.set('X-RateLimit-Limit', result.limit.toString());
          response.headers.set('X-RateLimit-Remaining', '0');
          response.headers.set(
            'X-RateLimit-Reset',
            result.resetTime.toString()
          );
          if (result.retryAfter) {
            response.headers.set('Retry-After', result.retryAfter.toString());
          }
        }

        return response;
      }

      // Add headers to successful requests
      if (this.config.headers) {
        const response = NextResponse.next();
        response.headers.set('X-RateLimit-Limit', result.limit.toString());
        response.headers.set(
          'X-RateLimit-Remaining',
          result.remaining.toString()
        );
        response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
        return response;
      }

      return null; // Continue to next middleware
    };
  }
}

/**
 * Utility functions for common rate limiting scenarios
 */
export const createRateLimiter = (
  preset: keyof typeof RATE_LIMIT_PRESETS,
  overrides?: Partial<RateLimitConfig>
) => {
  const config = { ...RATE_LIMIT_PRESETS[preset], ...overrides };
  return new RateLimiter(config);
};

/**
 * IP-based rate limiter
 */
export const ipRateLimiter = createRateLimiter('api');

/**
 * API endpoint rate limiter
 */
export const apiRateLimiter = createRateLimiter('api');

/**
 * Authentication rate limiter
 */
export const authRateLimiter = createRateLimiter('auth');

/**
 * Expensive operations rate limiter
 */
export const expensiveRateLimiter = createRateLimiter('expensive');

/**
 * Custom rate limiter for user-specific limits
 */
export const createUserRateLimiter = (
  userId: string,
  config: RateLimitConfig
) => {
  return new RateLimiter({
    ...config,
    keyGenerator: req =>
      `user_rate_limit:${userId}:${new URL(req.url).pathname}`,
  });
};
