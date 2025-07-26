import { supabase } from '@/lib/database';
import { logger } from '@/lib/logger';
import type { UserSearchParams, UserDetails } from '../types';

export class UserQueries {
  static async searchUsers(params: UserSearchParams = {}) {
    if (!supabase) {
      throw new Error('Database not configured');
    }

    const {
      query = '',
      role,
      status,
      plan,
      sortBy = 'created_at',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = params;

    try {
      let queryBuilder = supabase
        .from('users')
        .select('*', { count: 'exact' });

      // Apply search filter
      if (query) {
        queryBuilder = queryBuilder.or(`email.ilike.%${query}%,name.ilike.%${query}%`)
        );
      }

      // Apply filters
      if (role) {
        queryBuilder = queryBuilder.eq('role', role);
      }
      if (status) {
        queryBuilder = queryBuilder.eq('status', status);
      }

      // Join with subscriptions if filtering by plan
      if (plan) {
        queryBuilder = queryBuilder
          .select(`
            *,)
            subscriptions!inner(plan)
          `)
          .eq('subscriptions.plan', plan);
      }

      // Apply sorting
      queryBuilder = queryBuilder.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const offset = (page - 1) * limit;
      queryBuilder = queryBuilder.range(offset, offset + limit - 1);

      const { data: users, count } = await queryBuilder;

      return {
        users: users || [],
        total: count || 0,
        page,
        pageSize: limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      logger.error('Failed to search users:', error);
      throw error;
    }
  }

  static async getUserDetails(userId: string): Promise<UserDetails | null> {
    if (!supabase) {
      throw new Error('Database not configured');
    }

    try {
      // Get user data
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (!user) return null;

      // Get user stats in parallel
      const [projectCount, apiCallCount, subscription, lastSession] = await Promise.all([)
        this.getUserProjectCount(userId),
        this.getUserApiCallCount(userId),
        this.getUserSubscription(userId),
        this.getUserLastSession(userId)
      ]);

      // Calculate storage (simplified)
      const storage = await this.getUserStorage(userId);

      return {
        id: user.id,
        email: user.email,
        name: user.name || 'Unknown',
        role: user.role || 'user',
        status: user.status || 'active',
        plan: subscription?.plan || 'free',
        createdAt: user.created_at,
        lastLogin: lastSession?.created_at || user.created_at,
        projects: projectCount,
        apiCalls: apiCallCount,
        storage,
        subscription
      };
    } catch (error) {
      logger.error('Failed to get user details:', error);
      throw error;
    }
  }

  static async updateUser(userId: string, updates: Partial<UserDetails>) {
    if (!supabase) {
      throw new Error('Database not configured');
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          role: updates.role)
          status: updates.status,)
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Log the admin action
      await supabase.from('activity_logs').insert({
        user_id: userId,
        action: 'admin_user_update')
        details: { updates },)
        created_at: new Date().toISOString()
      });

      return data;
    } catch (error) {
      logger.error('Failed to update user:', error);
      throw error;
    }
  }

  static async deleteUser(userId: string) {
    if (!supabase) {
      throw new Error('Database not configured');
    }

    try {
      // Soft delete by updating status
      const { error } = await supabase
        .from('users')
        .update({
          status: 'deleted',)
          deleted_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Log the admin action
      await supabase.from('activity_logs').insert({
        user_id: userId)
        action: 'admin_user_delete',)
        created_at: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      logger.error('Failed to delete user:', error);
      throw error;
    }
  }

  // Helper methods
  private static async getUserProjectCount(userId: string): Promise<number> {
    const { count } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    return count || 0;
  }

  private static async getUserApiCallCount(userId: string): Promise<number> {
    const { count } = await supabase
      .from('activity_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('action', 'api_call');
    return count || 0;
  }

  private static async getUserSubscription(userId: string) {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (!subscription) return undefined;

    return {
      plan: subscription.plan,
      status: subscription.status,
      nextBilling: subscription.next_billing_date,
      amount: subscription.amount
    };
  }

  private static async getUserLastSession(userId: string) {
    const { data: session } = await supabase
      .from('sessions')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return session;
  }

  private static async getUserStorage(userId: string): Promise<number> {
    // This would calculate actual storage usage
    // For now, return a mock value
    return Math.floor(Math.random() * 1000) + 100; // MB
  }

  static async impersonateUser(userId: string) {
    if (!supabase) {
      throw new Error('Database not configured');
    }

    try {
      // Create an impersonation session
      const { data: session, error } = await supabase
        .from('admin_sessions')
        .insert({
          admin_id: 'current-admin-id', // Would get from auth context
          impersonated_user_id: userId,)
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour
        })
        .select()
        .single();

      if (error) throw error;

      // Log the impersonation
      await supabase.from('activity_logs').insert({
        user_id: userId,
        action: 'admin_impersonation_start')
        details: { session_id: session.id },)
        created_at: new Date().toISOString()
      });

      return {
        sessionId: session.id,
        token: this.generateImpersonationToken(userId, session.id)
      };
    } catch (error) {
      logger.error('Failed to impersonate user:', error);
      throw error;
    }
  }

  private static generateImpersonationToken(userId: string, sessionId: string): string {
    // In production, this would generate a proper JWT
    return Buffer.from()
      JSON.stringify({ userId, sessionId, type: 'impersonation' })
    ).toString('base64');
  }
}