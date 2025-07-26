import { supabase } from '../client';
import { logger } from '@/lib/logger';
import { ActivityMetadata, UsageMetadata, UsageSummary } from '../types';

export class ActivityService {
  private static checkDatabase(): boolean {
    if (!supabase) {
      return false;
    }
    return true;
  }

  static async logActivity(
    userId: string,
    action: string,
    resourceType: string,
    resourceId?: string,
    metadata?: ActivityMetadata
  ): Promise<void> {
    if (!this.checkDatabase()) {
      logger.info('Mock log activity:', { userId, action, resourceType, resourceId, metadata });
      return;
    }

    try {
      const { error } = await supabase!
        .from('activity_logs')
        .insert({
          user_id: userId,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          metadata,
          created_at: new Date().toISOString()
        });

      if (error) {
        logger.error('Error logging activity:', error);
      }
    } catch (error) {
      logger.error('Database error logging activity:', error);
    }
  }

  static async recordUsage(
    userId: string,
    resourceType: string,
    quantity: number,
    metadata?: UsageMetadata
  ): Promise<void> {
    if (!this.checkDatabase()) {
      logger.info('Mock record usage:', { userId, resourceType, quantity, metadata });
      return;
    }

    try {
      const { error } = await supabase!
        .from('usage_records')
        .insert({
          user_id: userId,
          resource_type: resourceType,
          quantity,
          metadata,
          created_at: new Date().toISOString()
        });

      if (error) {
        logger.error('Error recording usage:', error);
      }
    } catch (error) {
      logger.error('Database error recording usage:', error);
    }
  }

  static async getUserUsage(userId: string, month?: Date): Promise<UsageSummary> {
    if (!this.checkDatabase()) {
      return {
        projects: 2,
        aiGenerations: 15,
        storage: '125MB'
      };
    }

    try {
      const startOfMonth = month 
        ? new Date(month.getFullYear(), month.getMonth(), 1)
        : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      
      const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);

      const { data: usageData, error } = await supabase!
        .from('usage_records')
        .select('resource_type, quantity')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString());

      if (error) {
        logger.error('Error fetching usage data:', error);
        return {
          projects: 0,
          aiGenerations: 0,
          storage: '0MB'
        };
      }

      const usage = (usageData || []).reduce((acc: Record<string, number>, record: { resource_type: string; quantity: number }) => {
        acc[record.resource_type] = (acc[record.resource_type] || 0) + record.quantity;
        return acc;
      }, {} as Record<string, number>);

      // Get project count separately
      const { ProjectService } = await import('./project-service');
      const projectCount = await ProjectService.getUserProjects(userId);

      return {
        projects: projectCount.length,
        aiGenerations: usage['ai_generations'] || 0,
        storage: '0MB' // TODO: Calculate actual storage usage
      };
    } catch (error) {
      logger.error('Database error:', error);
      return {
        projects: 0,
        aiGenerations: 0,
        storage: '0MB'
      };
    }
  }
}