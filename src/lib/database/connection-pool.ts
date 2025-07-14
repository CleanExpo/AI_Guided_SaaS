// Database Connection Pooling for AI Guided SaaS
// Optimizes database connections and implements retry logic

import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface ConnectionPoolConfig {
  maxConnections: number;
  idleTimeout: number;
  connectionTimeout: number;
  retryAttempts: number;
  retryDelay: number;
}

interface PooledConnection {
  client: SupabaseClient;
  isActive: boolean;
  lastUsed: number;
  connectionId: string;
}

class DatabaseConnectionPool {
  private pool: PooledConnection[] = [];
  private config: ConnectionPoolConfig;
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor(config: Partial<ConnectionPoolConfig> = {}) {
    this.config = {
      maxConnections: config.maxConnections || 10,
      idleTimeout: config.idleTimeout || 30000, // 30 seconds
      connectionTimeout: config.connectionTimeout || 5000, // 5 seconds
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000, // 1 second
    };

    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    this.supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Supabase URL and key must be provided');
    }

    // Initialize the pool
    this.initializePool();
    
    // Start cleanup interval
    this.startCleanupInterval();
  }

  private initializePool(): void {
    for (let i = 0; i < Math.min(3, this.config.maxConnections); i++) {
      this.createConnection();
    }
  }

  private createConnection(): PooledConnection {
    const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const client = createClient(this.supabaseUrl, this.supabaseKey, {
      auth: {
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-connection-id': connectionId,
        },
      },
    });

    const connection: PooledConnection = {
      client,
      isActive: false,
      lastUsed: Date.now(),
      connectionId,
    };

    this.pool.push(connection);
    return connection;
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanupIdleConnections();
    }, this.config.idleTimeout / 2);
  }

  private cleanupIdleConnections(): void {
    const now = Date.now();
    const minConnections = 2;

    this.pool = this.pool.filter((connection) => {
      const isIdle = now - connection.lastUsed > this.config.idleTimeout;
      const shouldRemove = isIdle && !connection.isActive && this.pool.length > minConnections;
      
      if (shouldRemove) {
        console.log(`Removing idle connection: ${connection.connectionId}`);
      }
      
      return !shouldRemove;
    });
  }

  async getConnection(): Promise<PooledConnection> {
    // Try to find an available connection
    let connection = this.pool.find(conn => !conn.isActive);

    // If no available connection and we haven't reached max, create a new one
    if (!connection && this.pool.length < this.config.maxConnections) {
      connection = this.createConnection();
    }

    // If still no connection, wait for one to become available
    if (!connection) {
      connection = await this.waitForAvailableConnection();
    }

    // Mark as active and update last used time
    connection.isActive = true;
    connection.lastUsed = Date.now();

    return connection;
  }

  private async waitForAvailableConnection(): Promise<PooledConnection> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout: No available connections'));
      }, this.config.connectionTimeout);

      const checkForConnection = () => {
        const connection = this.pool.find(conn => !conn.isActive);
        if (connection) {
          clearTimeout(timeout);
          resolve(connection);
        } else {
          setTimeout(checkForConnection, 100);
        }
      };

      checkForConnection();
    });
  }

  releaseConnection(connection: PooledConnection): void {
    connection.isActive = false;
    connection.lastUsed = Date.now();
  }

  async executeWithRetry<T>(
    operation: (client: SupabaseClient) => Promise<T>,
    retryCount = 0
  ): Promise<T> {
    const connection = await this.getConnection();

    try {
      const result = await operation(connection.client);
      this.releaseConnection(connection);
      return result;
    } catch (error) {
      this.releaseConnection(connection);

      if (retryCount < this.config.retryAttempts) {
        console.warn(`Operation failed, retrying (${retryCount + 1}/${this.config.retryAttempts}):`, error);
        
        // Exponential backoff
        const delay = this.config.retryDelay * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.executeWithRetry(operation, retryCount + 1);
      }

      throw error;
    }
  }

  getPoolStats() {
    return {
      totalConnections: this.pool.length,
      activeConnections: this.pool.filter(conn => conn.isActive).length,
      idleConnections: this.pool.filter(conn => !conn.isActive).length,
      maxConnections: this.config.maxConnections,
      poolUtilization: (this.pool.filter(conn => conn.isActive).length / this.config.maxConnections) * 100,
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const connection = await this.getConnection();
      const { error } = await connection.client
        .from('research_projects')
        .select('count')
        .limit(1);
      
      this.releaseConnection(connection);
      return !error;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  destroy(): void {
    this.pool.forEach(() => {
      // Supabase client doesn't have explicit close method
      // but we can clear the pool
    });
    this.pool = [];
  }
}

// Singleton instance
let poolInstance: DatabaseConnectionPool | null = null;

export function getConnectionPool(): DatabaseConnectionPool {
  if (!poolInstance) {
    poolInstance = new DatabaseConnectionPool();
  }
  return poolInstance;
}

export function createConnectionPool(config?: Partial<ConnectionPoolConfig>): DatabaseConnectionPool {
  return new DatabaseConnectionPool(config);
}

export type { ConnectionPoolConfig, PooledConnection };
export { DatabaseConnectionPool };
