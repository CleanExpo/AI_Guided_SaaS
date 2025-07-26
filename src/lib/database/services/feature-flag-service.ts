import { supabase } from '../client';
import { logger } from '@/lib/logger';

export class FeatureFlagService {
  private static checkDatabase(): boolean {
    if (!supabase) {
      return false;
    }
    return true;
  }

  static async getFeatureFlag(name: string, userId?: string): Promise<boolean> {
    if (!this.checkDatabase()) {
      // Default feature flags for development
      const defaultFlags: Record<string, boolean> = {
        'ai_chat_enabled': true,
        'template_marketplace': true,
        'collaboration_features': true,
        'advanced_analytics': false,
        'beta_features': true
      };
      return defaultFlags[name] ?? false;
    }

    try {
      const { data, error } = await supabase!
        .from('feature_flags')
        .select('*')
        .eq('name', name)
        .single();

      if (error || !data) {
        return false;
      }

      if (!data.enabled) {
        return false;
      }

      // Check rollout percentage
      if (data.rollout_percentage < 100 && userId) {
        const userHash = this.hashUserId(userId);
        return userHash < data.rollout_percentage;
      }

      // Check target users
      if (data.target_users && userId) {
        return data.target_users.includes(userId);
      }

      return data.enabled;
    } catch (error) {
      logger.error('Error fetching feature flag:', error);
      return false;
    }
  }

  // Helper function to hash user ID for feature flag rollouts
  private static hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100;
  }
}