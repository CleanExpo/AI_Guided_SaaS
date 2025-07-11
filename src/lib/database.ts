import { createClient } from '@supabase/supabase-js'
import { env, isServiceConfigured } from './env'

// Database type definitions
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  provider: string
  provider_id?: string
  subscription_tier: 'free' | 'pro' | 'enterprise'
  subscription_status: 'active' | 'canceled' | 'past_due'
  password_hash?: string
  stripe_customer_id?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description?: string
  framework: string
  status: 'draft' | 'generating' | 'completed' | 'error'
  config: any
  files?: any
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  action: string
  resource_type: string
  resource_id?: string
  metadata?: any
  created_at: string
}

export interface UsageRecord {
  id: string
  user_id: string
  resource_type: string
  quantity: number
  metadata?: any
  created_at: string
}

export interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  rollout_percentage: number
  target_users?: string[]
  created_at: string
  updated_at: string
}

// Create Supabase client with error handling
let supabase: any = null

if (isServiceConfigured('supabase')) {
  supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export { supabase }

// Database helper functions
export class DatabaseService {
  // Check if database is available
  private static checkDatabase(): boolean {
    if (!supabase) {
      console.warn('Database not configured, using fallback behavior')
      return false
    }
    return true
  }

  // User operations
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
      }
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single()

      if (error) {
        console.error('Error creating user:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Database error:', error)
      return null
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
      }
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching user:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Database error:', error)
      return null
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
        }
      }
      return null
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        console.error('Error fetching user by email:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    if (!this.checkDatabase()) {
      console.log('User update (mock):', { id, updates })
      return null
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating user:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  }

  // Project operations
  static async createProject(projectData: Partial<Project>): Promise<Project | null> {
    if (!this.checkDatabase()) {
      return {
        id: `project-${Date.now()}`,
        user_id: projectData.user_id || 'demo-user',
        name: projectData.name || 'Demo Project',
        description: projectData.description,
        framework: projectData.framework || 'nextjs',
        status: 'completed',
        config: projectData.config || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single()

      if (error) {
        console.error('Error creating project:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  }

  static async getUserProjects(userId: string): Promise<Project[]> {
    if (!this.checkDatabase()) {
      return [
        {
          id: 'demo-project-1',
          user_id: userId,
          name: 'E-commerce Store',
          description: 'A modern e-commerce platform',
          framework: 'nextjs',
          status: 'completed',
          config: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'demo-project-2',
          user_id: userId,
          name: 'Portfolio Website',
          description: 'Personal portfolio with blog',
          framework: 'react',
          status: 'completed',
          config: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user projects:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Database error:', error)
      return []
    }
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    if (!this.checkDatabase()) {
      console.log('Project update (mock):', { id, updates })
      return null
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating project:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  }

  // Activity logging
  static async logActivity(
    userId: string,
    action: string,
    resourceType: string,
    resourceId?: string,
    metadata?: any
  ): Promise<void> {
    if (!this.checkDatabase()) {
      console.log('Activity logged (mock):', { userId, action, resourceType, resourceId, metadata })
      return
    }

    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: userId,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          metadata,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error logging activity:', error)
      }
    } catch (error) {
      console.error('Database error logging activity:', error)
    }
  }

  // Usage tracking
  static async recordUsage(userId: string, resourceType: string, quantity: number, metadata?: any): Promise<void> {
    if (!this.checkDatabase()) {
      console.log('Usage recorded (mock):', { userId, resourceType, quantity, metadata })
      return
    }

    try {
      const { error } = await supabase
        .from('usage_records')
        .insert({
          user_id: userId,
          resource_type: resourceType,
          quantity,
          metadata,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error recording usage:', error)
      }
    } catch (error) {
      console.error('Database error recording usage:', error)
    }
  }

  // Feature flags
  static async getFeatureFlag(name: string, userId?: string): Promise<boolean> {
    if (!this.checkDatabase()) {
      // Default feature flags for development
      const defaultFlags: Record<string, boolean> = {
        'ai_chat_enabled': true,
        'template_marketplace': true,
        'collaboration_features': true,
        'advanced_analytics': false,
        'beta_features': true
      }
      return defaultFlags[name] ?? false
    }

    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .eq('name', name)
        .single()

      if (error || !data) {
        return false
      }

      if (!data.enabled) {
        return false
      }

      // Check rollout percentage
      if (data.rollout_percentage < 100 && userId) {
        const userHash = this.hashUserId(userId)
        return userHash < data.rollout_percentage
      }

      // Check target users
      if (data.target_users && userId) {
        return data.target_users.includes(userId)
      }

      return data.enabled
    } catch (error) {
      console.error('Error fetching feature flag:', error)
      return false
    }
  }

  // Generic query method for complex operations
  static async query(sql: string, params?: any[]): Promise<any[]> {
    if (!this.checkDatabase()) {
      console.log('Query executed (mock):', { sql, params })
      return []
    }

    try {
      // This would use a proper SQL query method in production
      // For now, we'll use Supabase's query builder
      console.log('Raw SQL query not implemented, using Supabase query builder')
      return []
    } catch (error) {
      console.error('Database query error:', error)
      return []
    }
  }

  // Generic record creation
  static async createRecord(table: string, data: any): Promise<any> {
    if (!this.checkDatabase()) {
      return { id: `${table}-${Date.now()}`, ...data }
    }

    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single()

      if (error) {
        console.error(`Error creating ${table} record:`, error)
        return null
      }

      return result
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  }

  // Billing-specific methods
  static async getUserByStripeCustomerId(customerId: string): Promise<User | null> {
    if (!this.checkDatabase()) {
      return null
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('stripe_customer_id', customerId)
        .single()

      if (error) {
        console.error('Error fetching user by Stripe customer ID:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  }

  static async recordPayment(paymentData: {
    user_id: string
    stripe_payment_intent_id: string
    amount: number
    currency: string
    status: string
    description?: string
    metadata?: any
  }): Promise<void> {
    if (!this.checkDatabase()) {
      console.log('Payment recorded (mock):', paymentData)
      return
    }

    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          user_id: paymentData.user_id,
          stripe_payment_intent_id: paymentData.stripe_payment_intent_id,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: paymentData.status,
          description: paymentData.description,
          metadata: paymentData.metadata,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error recording payment:', error)
      }
    } catch (error) {
      console.error('Database error recording payment:', error)
    }
  }

  static async getUserSubscription(userId: string): Promise<any> {
    if (!this.checkDatabase()) {
      return {
        tier: 'free',
        status: 'active',
        current_period_end: null
      }
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      if (error) {
        console.error('Error fetching subscription:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  }

  static async updateSubscription(subscriptionData: {
    user_id?: string
    stripe_subscription_id?: string
    stripe_customer_id?: string
    status?: string
    tier?: string
    current_period_start?: string
    current_period_end?: string
    cancel_at_period_end?: boolean
  }): Promise<void> {
    if (!this.checkDatabase()) {
      console.log('Subscription updated (mock):', subscriptionData)
      return
    }

    try {
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          ...subscriptionData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'stripe_subscription_id'
        })

      if (error) {
        console.error('Error updating subscription:', error)
      }
    } catch (error) {
      console.error('Database error updating subscription:', error)
    }
  }

  static async getUserUsage(userId: string, month?: Date): Promise<{
    projects: number
    aiGenerations: number
    storage: string
  }> {
    if (!this.checkDatabase()) {
      return {
        projects: 2,
        aiGenerations: 15,
        storage: '125MB'
      }
    }

    try {
      const startOfMonth = month ? new Date(month.getFullYear(), month.getMonth(), 1) : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0)

      const { data: usageData, error } = await supabase
        .from('usage_records')
        .select('resource_type, quantity')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString())

      if (error) {
        console.error('Error fetching usage:', error)
        return { projects: 0, aiGenerations: 0, storage: '0MB' }
      }

      const usage = usageData.reduce((acc: Record<string, number>, record: any) => {
        acc[record.resource_type] = (acc[record.resource_type] || 0) + record.quantity
        return acc
      }, {} as Record<string, number>)

      // Get project count
      const projectCount = await this.getUserProjects(userId)

      return {
        projects: projectCount.length,
        aiGenerations: usage.ai_generations || 0,
        storage: '0MB' // TODO: Calculate actual storage usage
      }
    } catch (error) {
      console.error('Database error:', error)
      return { projects: 0, aiGenerations: 0, storage: '0MB' }
    }
  }

  // Helper function to hash user ID for feature flag rollouts
  private static hashUserId(userId: string): number {
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100
  }
}
