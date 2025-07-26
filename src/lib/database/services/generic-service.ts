import { supabase } from '../client';
import { logger } from '@/lib/logger';
import { DatabaseRecord } from '../types';

export class GenericService {
  private static checkDatabase(): boolean {
    if (!supabase) {
      return false;
    }
    return true;
  }

  // Generic query method for complex operations
  static async query(sql: string, params?: unknown[]): Promise<any[]> {
    if (!this.checkDatabase()) {
      logger.info('Mock query:', { sql, params });
      return [];
    }

    try {
      // This would use a proper SQL query method in production
      // For now, we'll use Supabase's query builder
      return [];
    } catch (error) {
      logger.error('Database query error:', error);
      return [];
    }
  }

  // Generic record creation
  static async createRecord(table: string, data: DatabaseRecord): Promise<DatabaseRecord | null> {
    if (!this.checkDatabase()) {
      return { ...data, id: `${table}-${Date.now()}` };
    }

    try {
      const { data: result, error } = await supabase!
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) {
        logger.error(`Error creating record in ${table}:`, error);
        return null;
      }

      return result;
    } catch (error) {
      logger.error('Database error:', error);
      return null;
    }
  }
}