import { supabase } from '../client';
import { logger } from '@/lib/logger';
import { User } from '../types';

export class UserService {
  private static checkDatabase(): boolean {
    if (!supabase) {
      return false;
    }
    return true;
  }

  static async createUser(userData: Partial<User>): Promise<User | null> {
    if (!this.checkDatabase()) {
      // Return mock user for development
      return {
        id: `user-${Date.now()}`,
        email: userData.email || 'demo@example.com',
        full_name: userData.full_name || 'Demo User',
        avatar_url: userData.avatar_url,
        provider: userData.provider || 'credentials',
        provider_id: userData.provider_id,
        subscription_tier: 'free',
        subscription_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    try {
      const { data, error } = await supabase!
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) {
        logger.error('Error creating user:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Database error:', error);
      return null;
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    if (!this.checkDatabase()) {
      return {
        id,
        email: 'demo@example.com',
        full_name: 'Demo User',
        provider: 'credentials',
        subscription_tier: 'free',
        subscription_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    try {
      const { data, error } = await supabase!
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Error fetching user by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Database error:', error);
      return null;
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    if (!this.checkDatabase()) {
      // For demo purposes, return a user for demo@example.com
      if (email === 'demo@example.com') {
        return {
          id: 'demo-user-id',
          email: 'demo@example.com',
          full_name: 'Demo User',
          provider: 'credentials',
          subscription_tier: 'free',
          subscription_status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      return null;
    }

    try {
      const { data, error } = await supabase!
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        logger.error('Error fetching user by email:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Database error:', error);
      return null;
    }
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    if (!this.checkDatabase()) {
      logger.info('Mock update user:', { id, updates });
      return null;
    }

    try {
      const { data, error } = await supabase!
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error updating user:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Database error:', error);
      return null;
    }
  }

  static async getUserByStripeCustomerId(customerId: string): Promise<User | null> {
    if (!this.checkDatabase()) {
      return null;
    }

    try {
      const { data, error } = await supabase!
        .from('users')
        .select('*')
        .eq('stripe_customer_id', customerId)
        .single();

      if (error) {
        logger.error('Error fetching user by Stripe customer ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Database error:', error);
      return null;
    }
  }
}