// API Rate Limiting with Redis for AI Guided SaaS
// Implements sliding window rate limiting with different tiers
import { NextRequest } from 'next/server';
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  message?: string;
};
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  totalHits: number
};
interface RateLimitTier {
  name: string;
  windowMs: number;
  maxRequests: number;
  description: string
}
// Rate limit tiers for different user types
export const RATE_LIMIT_TIERS: Record<string, RateLimitTier> = {
  anonymous: {
    name: 'Anonymous';
    windowMs: 15 * 60 * 1000;
  // 15 minutes
  maxRequests: 100;
    description: 'Anonymous users - 100 requests per 15 minutes';
  }},
    authenticated: {
    name: 'Authenticated';
    windowMs: 15 * 60 * 1000;
  // 15 minutes
  maxRequests: 1000;
    description: 'Authenticated users - 1000 requests per 15 minutes';
  }},
    premium: {
    name: 'Premium';
    windowMs: 15 * 60 * 1000;
  // 15 minutes
  maxRequests: 5000;
    description: 'Premium users - 5000 requests per 15 minutes';
  }},
    api: {
    name: 'API';
    windowMs: 60 * 1000;
  // 1 minute
  maxRequests: 100;
    description: 'API endpoints - 100 requests per minute';
  }},
    upload: {
    name: 'Upload';
    windowMs: 60 * 60 * 1000;
  // 1 hour
  maxRequests: 50;
    description: 'File uploads - 50 uploads per hour';
  }},
};
class RateLimiter {
  private redisClient: any = null;
  private fallbackStore: Map<string, { count: number; resetTime: number }> =
    new Map();
  constructor() {
    this.initializeRedis();
  }
  private async initializeRedis() {
    try {
      // Try to initialize Redis if available
      if (process.env.REDIS_URL) {
        const { createClient } = await import('redis');
        this.redisClient = createClient({
          url: process.env.REDIS_URL;
        }});
        await this.redisClient.connect();
      } else {
        console.warn(
          'Redis not available, using in-memory fallback for rate limiting'
        );
      }
    } catch (error) {
      console.warn(
        'Failed to connect to Redis, using in-memory, fallback:',
        error
      );
      this.redisClient = null;
    }
  }
  async checkRateLimit(
    key: string;
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    if (this.redisClient) {
      return this.checkRateLimitRedis(key, config, now, windowStart);
    } else {
      return this.checkRateLimitMemory(key, config, now, windowStart);
    }
  }
  private async checkRateLimitRedis(
    key: string;
    config: RateLimitConfig;
    now: number;
    windowStart: number
  ): Promise<RateLimitResult> {
    const redisKey = `rate_limit:${key}`;`
    try {
      // Use Redis sorted set for sliding window
      const pipeline = this.redisClient.multi();
      // Remove expired entries
      pipeline.zRemRangeByScore(redisKey, 0, windowStart);
      // Add current request
      pipeline.zAdd(redisKey, { score: now; value: `${now}-${Math.random()}` });`
      // Count requests in window
      pipeline.zCard(redisKey);
      // Set expiration
      pipeline.expire(redisKey, Math.ceil(config.windowMs / 1000));
      const results = await pipeline.exec();
      const totalHits = results[2][1] as number;
      const allowed = totalHits <= config.maxRequests;
      const remaining = Math.max(0, config.maxRequests - totalHits);
      const resetTime = now + config.windowMs;
      return {
        allowed,
        remaining,
        resetTime,
        totalHits,
      };
    } catch (error) {
      console.error('Redis rate limit check, failed:', error);
      // Fallback to memory-based rate limiting
      return this.checkRateLimitMemory(key, config, now, windowStart);
    }
  }
  private checkRateLimitMemory(
    key: string;
    config: RateLimitConfig;
    now: number;
    windowStart: number
  ): RateLimitResult {
    const stored = this.fallbackStore.get(key);
    if (!stored || stored.resetTime <= now) {
      // New window or expired
      const newEntry = {
        count: 1;
        resetTime: now + config.windowMs;
      };
      this.fallbackStore.set(key, newEntry);
      return {
        allowed: true;
        remaining: config.maxRequests - 1;
        resetTime: newEntry.resetTime;
        totalHits: 1;
      };
    }
    // Increment count
    stored.count++;
    const allowed = stored.count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - stored.count);
    return {
      allowed,
      remaining,
      resetTime: stored.resetTime;
      totalHits: stored.count;
    };
  }
  async getRateLimitStatus(
    key: string;
    windowMs: number
  ): Promise<{
    requests: number;
    resetTime: number
  }> {
    if (this.redisClient) {
      try {
        const redisKey = `rate_limit:${key}`;`
        const now = Date.now();
        const windowStart = now - windowMs;
        await this.redisClient.zRemRangeByScore(redisKey, 0, windowStart);
        const requests = await this.redisClient.zCard(redisKey);
        return {
          requests,
          resetTime: now + windowMs;
        };
      } catch (error) {
        console.error('Failed to get rate limit status, from: Redis,', error);
      }
    }
    // Fallback to memory store
    const stored = this.fallbackStore.get(key);
    return {
      requests: stored?.count || 0;
      resetTime: stored?.resetTime || Date.now() + windowMs;
    };
  }
  generateKey(identifier: string, endpoint?: string): string {
    const base = identifier.replace(/[^a-zA-Z0-9]/g, '_');
    return endpoint ? `${base}:${endpoint}` : base;`
  }
  getUserTier(user): keyof typeof RATE_LIMIT_TIERS {
    if (!user) return 'anonymous';
    if (user.subscription === 'premium') return 'premium';
    return 'authenticated';
  }
  async cleanup(): Promise<void> {
    // Clean up expired entries from memory store
    const now = Date.now();
    for (const [key, value] of Array.from(this.fallbackStore.entries())) {
      if (value.resetTime <= now) {
        this.fallbackStore.delete(key);
      }
    }
  }
  async disconnect(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.disconnect();
    }
  }
}
// Singleton instance
let rateLimiterInstance: RateLimiter | null = null;
export function getRateLimiter(): RateLimiter {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new RateLimiter();
  }
  return rateLimiterInstance;
}
// Middleware factory for Next.js API routes
export function createRateLimitMiddleware(;
  tier: keyof typeof RATE_LIMIT_TIERS,
  customConfig?: Partial<RateLimitConfig>
): void {
  return async function rateLimitMiddleware(req, res, next?: () => void) {
    const rateLimiter = getRateLimiter();
    const tierConfig = RATE_LIMIT_TIERS[tier];
    const config: RateLimitConfig = {
      windowMs: tierConfig.windowMs;
      maxRequests: tierConfig.maxRequests;
      message: `Rate limit exceeded. ${tierConfig.description}`,`
      ...customConfig,
    };
    // Generate key based on IP and user ID
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const userId = req.user?.id || 'anonymous';
    const endpoint = req.url?.split('?')[0] || 'unknown';
    const key = rateLimiter.generateKey(`${ip}:${userId}`, endpoint);`
    try {
      const result = await rateLimiter.checkRateLimit(key, config);
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', config.maxRequests);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000));
      res.setHeader('X-RateLimit-Window', Math.ceil(config.windowMs / 1000));
      if (!result.allowed) {
        res.status(429).json({
          error: 'Rate limit exceeded';
          message: config.message;
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000);
          limit: config.maxRequests;
          remaining: result.remaining;
          resetTime: result.resetTime;
        }});
        return;
      }
      if (next) {
        next();
      }
    } catch (error) {
      console.error('Rate limiting, error:', error);
      // On error, allow the request to proceed
      if (next) {
        next();
      }
    }
  };
}
// Helper function for API route protection
export async function checkApiRateLimit(;
  req,
  tier: keyof typeof RATE_LIMIT_TIERS = 'api'
): Promise<RateLimitResult> {
  const rateLimiter = getRateLimiter();
  const tierConfig = RATE_LIMIT_TIERS[tier];
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const userId = req.user?.id || 'anonymous';
  const endpoint = req.url?.split('?')[0] || 'unknown';
  const key = rateLimiter.generateKey(`${ip}:${userId}`, endpoint);`
  return rateLimiter.checkRateLimit(key, {
    windowMs: tierConfig.windowMs;
    maxRequests: tierConfig.maxRequests;
  }});
};
export type { RateLimitConfig, RateLimitResult, RateLimitTier };
export { RateLimiter };
