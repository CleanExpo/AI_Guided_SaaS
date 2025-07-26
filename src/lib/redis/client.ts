import { createClient } from 'redis';
import type { RedisClientType } from 'redis';
import { env, isServiceConfigured } from '../env';
import { logger } from '../logger';

/**
 * Redis Connection Pool Management
 * Implements connection pooling for optimal performance
 */
class RedisConnectionPool {
  private static instance: RedisConnectionPool;
  private clients: RedisClientType[] = [];
  private availableClients: RedisClientType[] = [];
  private usedClients: Set<RedisClientType> = new Set();
  private maxConnections = 10;
  private minConnections = 2;
  private connectionTimeout = 5000;

  private constructor() {
    this.initializePool();
  }

  public static getInstance(): RedisConnectionPool {
    if (!RedisConnectionPool.instance) {
      RedisConnectionPool.instance = new RedisConnectionPool();
    }
    return RedisConnectionPool.instance;
  }

  private async initializePool(): Promise<void> {
    if (!isServiceConfigured('redis')) {
      logger.warn('Redis not configured, using in-memory fallback');
      return;
    }

    try {
      // Create minimum connections
      for (let i = 0; i < this.minConnections; i++) {
        const client = await this.createClient();
        if (client) {
          this.clients.push(client);
          this.availableClients.push(client);
        }
      }

      logger.info(
        `Redis pool initialized with ${this.availableClients.length} connections`
      );
    } catch (error) {
      logger.error('Failed to initialize Redis pool:', error);
    }
  }

  private async createClient(): Promise<RedisClientType | null> {
    try {
      const client = createClient({
        url: env.REDIS_URL,
        socket: {
          connectTimeout: this.connectionTimeout,
        },
      }) as RedisClientType;

      client.on('error', error => {
        logger.error('Redis client error:', error);
      });

      client.on('connect', () => {
        logger.debug('Redis client connected');
      });

      client.on('disconnect', () => {
        logger.debug('Redis client disconnected');
      });

      await client.connect();
      return client;
    } catch (error) {
      logger.error('Failed to create Redis client:', error);
      return null;
    }
  }

  public async getClient(): Promise<RedisClientType | null> {
    // Try to get available client
    if (this.availableClients.length > 0) {
      const client = this.availableClients.pop()!;
      this.usedClients.add(client);
      return client;
    }

    // Create new client if under max limit
    if (this.clients.length < this.maxConnections) {
      const client = await this.createClient();
      if (client) {
        this.clients.push(client);
        this.usedClients.add(client);
        return client;
      }
    }

    // Wait for available client
    return new Promise(resolve => {
      const checkForClient = () => {
        if (this.availableClients.length > 0) {
          const client = this.availableClients.pop()!;
          this.usedClients.add(client);
          resolve(client);
        } else {
          setTimeout(checkForClient, 50);
        }
      };
      checkForClient();
    });
  }

  public releaseClient(client: RedisClientType): void {
    if (this.usedClients.has(client)) {
      this.usedClients.delete(client);
      this.availableClients.push(client);
    }
  }

  public async closeAll(): Promise<void> {
    const closePromises = this.clients.map(client =>
      client
        .quit()
        .catch(error => logger.error('Error closing Redis client:', error))
    );

    await Promise.all(closePromises);
    this.clients = [];
    this.availableClients = [];
    this.usedClients.clear();

    logger.info('Redis connection pool closed');
  }

  public getPoolStats() {
    return {
      total: this.clients.length,
      available: this.availableClients.length,
      used: this.usedClients.size,
      maxConnections: this.maxConnections,
      minConnections: this.minConnections,
    };
  }
}

/**
 * Redis Utility Functions with Connection Pooling
 */
export class Redis {
  private static pool = RedisConnectionPool.getInstance();

  /**
   * Execute Redis command with automatic connection management
   */
  private static async withClient<T>(
    operation: (client: RedisClientType) => Promise<T>
  ): Promise<T | null> {
    if (!isServiceConfigured('redis')) {
      return null;
    }

    const client = await this.pool.getClient();
    if (!client) {
      logger.error('Unable to get Redis client');
      return null;
    }

    try {
      const result = await operation(client);
      return result;
    } catch (error) {
      logger.error('Redis operation failed:', error);
      return null;
    } finally {
      this.pool.releaseClient(client);
    }
  }

  // Cache operations
  static async set(key: string, value: string, ttl?: number): Promise<boolean> {
    const result = await this.withClient(async client => {
      if (ttl) {
        return await client.setEx(key, ttl, value);
      }
      return await client.set(key, value);
    });
    return result === 'OK';
  }

  static async get(key: string): Promise<string | null> {
    const result = await this.withClient(async client => {
      return await client.get(key);
    });
    return typeof result === 'string' ? result : null;
  }

  static async del(key: string): Promise<boolean> {
    const result = await this.withClient(async client => {
      return await client.del(key);
    });
    return Boolean(result && typeof result === 'number' && result > 0);
  }

  static async exists(key: string): Promise<boolean> {
    const result = await this.withClient(async client => {
      return await client.exists(key);
    });
    return Boolean(
      result && typeof result === 'number' && result > 0
    );
  }

  static async expire(key: string, seconds: number): Promise<boolean> {
    const result = await this.withClient(async client => {
      return await client.expire(key, seconds);
    });
    return Boolean(result && typeof result === 'number' && result > 0);
  }

  // Rate limiting operations
  static async incr(key: string): Promise<number | null> {
    const result = await this.withClient(async client => {
      return await client.incr(key);
    });
    return typeof result === 'number' ? result : null;
  }

  static async incrBy(key: string, amount: number): Promise<number | null> {
    const result = await this.withClient(async client => {
      return await client.incrBy(key, amount);
    });
    return typeof result === 'number' ? result : null;
  }

  // List operations for queues
  static async lpush(key: string, ...values: string[]): Promise<number | null> {
    const result = await this.withClient(async client => {
      return await client.lPush(key, values);
    });
    return typeof result === 'number' ? result : null;
  }

  static async rpop(key: string): Promise<string | null> {
    const result = await this.withClient(async client => {
      return await client.rPop(key);
    });
    return typeof result === 'string' ? result : null;
  }

  static async llen(key: string): Promise<number | null> {
    const result = await this.withClient(async client => {
      return await client.lLen(key);
    });
    return typeof result === 'number' ? result : null;
  }

  // Hash operations
  static async hset(
    key: string,
    field: string,
    value: string
  ): Promise<boolean> {
    const result = await this.withClient(async client => {
      return await client.hSet(key, field, value);
    });
    return Boolean(result && typeof result === 'number' && result >= 0);
  }

  static async hget(key: string, field: string): Promise<string | null> {
    const result = await this.withClient(async client => {
      return await client.hGet(key, field);
    });
    return typeof result === 'string' ? result : null;
  }

  static async hgetall(key: string): Promise<Record<string, string> | null> {
    const result = await this.withClient(async client => {
      return await client.hGetAll(key);
    });
    return result && typeof result === 'object'
      ? (result as Record<string, string>)
      : null;
  }

  // Utility methods
  static async flushall(): Promise<boolean> {
    const result = await this.withClient(async client => {
      return await client.flushAll();
    });
    return result === 'OK';
  }

  static async ping(): Promise<boolean> {
    const result = await this.withClient(async client => {
      return await client.ping();
    });
    return result === 'PONG';
  }

  static getPoolStats() {
    return this.pool.getPoolStats();
  }

  static async closePool(): Promise<void> {
    await this.pool.closeAll();
  }
}

// Export singleton instance for backward compatibility
export const redis = Redis;
