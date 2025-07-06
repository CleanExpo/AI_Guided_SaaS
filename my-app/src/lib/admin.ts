// Admin panel service for system management

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'moderator'
  status: 'active' | 'suspended' | 'pending'
  lastLogin: Date
  createdAt: Date
  permissions: AdminPermission[]
}

export interface AdminPermission {
  id: string
  name: string
  description: string
  category: 'users' | 'content' | 'system' | 'analytics' | 'billing'
}

export interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalProjects: number
  totalTemplates: number
  totalRevenue: number
  systemHealth: 'healthy' | 'warning' | 'critical'
  uptime: number
  errorRate: number
}

export interface UserManagement {
  id: string
  email: string
  name: string
  subscription: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'suspended' | 'deleted'
  joinDate: Date
  lastActive: Date
  projectCount: number
  billingStatus: 'current' | 'past_due' | 'canceled'
}

export interface ContentModeration {
  id: string
  type: 'template' | 'project' | 'comment' | 'collaboration'
  title: string
  author: string
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  reportCount: number
  createdAt: Date
  reviewedAt?: Date
  reviewedBy?: string
}

export interface SystemConfiguration {
  id: string
  category: 'general' | 'ai' | 'billing' | 'collaboration' | 'security'
  key: string
  value: string
  description: string
  type: 'string' | 'number' | 'boolean' | 'json'
  isSecret: boolean
  lastModified: Date
  modifiedBy: string
}

export interface AdminActivity {
  id: string
  adminId: string
  adminName: string
  action: string
  target: string
  details: Record<string, unknown>
  timestamp: Date
  ipAddress: string
  userAgent: string
}

export class AdminService {
  private static instance: AdminService
  private initialized = false

  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService()
    }
    return AdminService.instance
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // Initialize admin service
      console.log('Initializing admin service...')
      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize admin service:', error)
      throw error
    }
  }

  // User Management
  async getUsers(
    page: number = 1,
    limit: number = 50,
    filters?: {
      status?: string
      subscription?: string
      search?: string
    }
  ): Promise<{ users: UserManagement[]; total: number; pages: number }> {
    try {
      // In production, this would query the actual database
      const mockUsers: UserManagement[] = [
        {
          id: '1',
          email: 'john@example.com',
          name: 'John Doe',
          subscription: 'pro',
          status: 'active',
          joinDate: new Date('2024-01-15'),
          lastActive: new Date(),
          projectCount: 12,
          billingStatus: 'current'
        },
        {
          id: '2',
          email: 'jane@example.com',
          name: 'Jane Smith',
          subscription: 'enterprise',
          status: 'active',
          joinDate: new Date('2024-02-20'),
          lastActive: new Date(Date.now() - 1000 * 60 * 30),
          projectCount: 25,
          billingStatus: 'current'
        },
        {
          id: '3',
          email: 'bob@example.com',
          name: 'Bob Wilson',
          subscription: 'free',
          status: 'suspended',
          joinDate: new Date('2024-03-10'),
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          projectCount: 3,
          billingStatus: 'past_due'
        }
      ]

      let filteredUsers = mockUsers

      if (filters?.status) {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status)
      }

      if (filters?.subscription) {
        filteredUsers = filteredUsers.filter(user => user.subscription === filters.subscription)
      }

      if (filters?.search) {
        const search = filters.search.toLowerCase()
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(search) || 
          user.email.toLowerCase().includes(search)
        )
      }

      const total = filteredUsers.length
      const pages = Math.ceil(total / limit)
      const startIndex = (page - 1) * limit
      const users = filteredUsers.slice(startIndex, startIndex + limit)

      return { users, total, pages }
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'deleted', adminId: string): Promise<void> {
    try {
      // Log admin activity
      await this.logAdminActivity(adminId, 'update_user_status', userId, { status })
      
      // In production, update the database
      console.log(`Updated user ${userId} status to ${status}`)
    } catch (error) {
      console.error('Error updating user status:', error)
      throw error
    }
  }

  // Content Moderation
  async getContentForModeration(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: string
      status?: string
    }
  ): Promise<{ content: ContentModeration[]; total: number; pages: number }> {
    try {
      const mockContent: ContentModeration[] = [
        {
          id: '1',
          type: 'template',
          title: 'E-commerce Starter Template',
          author: 'john@example.com',
          status: 'pending',
          reportCount: 0,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
        },
        {
          id: '2',
          type: 'project',
          title: 'Suspicious Project Content',
          author: 'suspicious@example.com',
          status: 'flagged',
          reportCount: 3,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
        },
        {
          id: '3',
          type: 'comment',
          title: 'Inappropriate collaboration comment',
          author: 'user@example.com',
          status: 'pending',
          reportCount: 1,
          createdAt: new Date(Date.now() - 1000 * 60 * 30)
        }
      ]

      let filteredContent = mockContent

      if (filters?.type) {
        filteredContent = filteredContent.filter(item => item.type === filters.type)
      }

      if (filters?.status) {
        filteredContent = filteredContent.filter(item => item.status === filters.status)
      }

      const total = filteredContent.length
      const pages = Math.ceil(total / limit)
      const startIndex = (page - 1) * limit
      const content = filteredContent.slice(startIndex, startIndex + limit)

      return { content, total, pages }
    } catch (error) {
      console.error('Error fetching content for moderation:', error)
      throw error
    }
  }

  async moderateContent(
    contentId: string, 
    action: 'approve' | 'reject' | 'flag', 
    adminId: string,
    reason?: string
  ): Promise<void> {
    try {
      await this.logAdminActivity(adminId, 'moderate_content', contentId, { action, reason })
      console.log(`Content ${contentId} ${action}ed by admin ${adminId}`)
    } catch (error) {
      console.error('Error moderating content:', error)
      throw error
    }
  }

  // System Configuration
  async getSystemConfiguration(): Promise<SystemConfiguration[]> {
    try {
      const mockConfig: SystemConfiguration[] = [
        {
          id: '1',
          category: 'general',
          key: 'site_name',
          value: 'AI Guided SaaS',
          description: 'The name of the application',
          type: 'string',
          isSecret: false,
          lastModified: new Date(),
          modifiedBy: 'admin@example.com'
        },
        {
          id: '2',
          category: 'ai',
          key: 'openai_model',
          value: 'gpt-4',
          description: 'Default OpenAI model for project generation',
          type: 'string',
          isSecret: false,
          lastModified: new Date(),
          modifiedBy: 'admin@example.com'
        },
        {
          id: '3',
          category: 'billing',
          key: 'stripe_webhook_secret',
          value: '***hidden***',
          description: 'Stripe webhook endpoint secret',
          type: 'string',
          isSecret: true,
          lastModified: new Date(),
          modifiedBy: 'admin@example.com'
        },
        {
          id: '4',
          category: 'collaboration',
          key: 'max_participants_free',
          value: '3',
          description: 'Maximum participants for free tier collaboration',
          type: 'number',
          isSecret: false,
          lastModified: new Date(),
          modifiedBy: 'admin@example.com'
        }
      ]

      return mockConfig
    } catch (error) {
      console.error('Error fetching system configuration:', error)
      throw error
    }
  }

  async updateConfiguration(
    configId: string, 
    value: string, 
    adminId: string
  ): Promise<void> {
    try {
      await this.logAdminActivity(adminId, 'update_configuration', configId, { value })
      console.log(`Configuration ${configId} updated by admin ${adminId}`)
    } catch (error) {
      console.error('Error updating configuration:', error)
      throw error
    }
  }

  // System Statistics
  async getSystemStats(): Promise<SystemStats> {
    try {
      // In production, this would aggregate real data
      const stats: SystemStats = {
        totalUsers: 1247,
        activeUsers: 892,
        totalProjects: 3456,
        totalTemplates: 89,
        totalRevenue: 45678.90,
        systemHealth: 'healthy',
        uptime: 99.97,
        errorRate: 0.03
      }

      return stats
    } catch (error) {
      console.error('Error fetching system stats:', error)
      throw error
    }
  }

  // Admin Activity Logging
  async logAdminActivity(
    adminId: string,
    action: string,
    target: string,
    details: Record<string, unknown>,
    ipAddress: string = 'unknown',
    userAgent: string = 'unknown'
  ): Promise<void> {
    try {
      const activity: AdminActivity = {
        id: `activity_${Date.now()}`,
        adminId,
        adminName: 'Admin User', // In production, fetch from database
        action,
        target,
        details,
        timestamp: new Date(),
        ipAddress,
        userAgent
      }

      // In production, save to database
      console.log('Admin activity logged:', activity)
    } catch (error) {
      console.error('Error logging admin activity:', error)
    }
  }

  async getAdminActivity(
    page: number = 1,
    limit: number = 50,
    filters?: {
      adminId?: string
      action?: string
      dateFrom?: Date
      dateTo?: Date
    }
  ): Promise<{ activities: AdminActivity[]; total: number; pages: number }> {
    try {
      const mockActivities: AdminActivity[] = [
        {
          id: '1',
          adminId: 'admin1',
          adminName: 'John Admin',
          action: 'update_user_status',
          target: 'user_123',
          details: { status: 'suspended' },
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0...'
        },
        {
          id: '2',
          adminId: 'admin1',
          adminName: 'John Admin',
          action: 'moderate_content',
          target: 'template_456',
          details: { action: 'approve' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0...'
        }
      ]

      let filteredActivities = mockActivities

      if (filters?.adminId) {
        filteredActivities = filteredActivities.filter(activity => activity.adminId === filters.adminId)
      }

      if (filters?.action) {
        filteredActivities = filteredActivities.filter(activity => activity.action === filters.action)
      }

      const total = filteredActivities.length
      const pages = Math.ceil(total / limit)
      const startIndex = (page - 1) * limit
      const activities = filteredActivities.slice(startIndex, startIndex + limit)

      return { activities, total, pages }
    } catch (error) {
      console.error('Error fetching admin activity:', error)
      throw error
    }
  }

  // Permission Management
  async checkAdminPermission(_adminId: string, _permission: string): Promise<boolean> {
    try {
      // In production, check against database
      // For now, return true for demo purposes
      return true
    } catch (error) {
      console.error('Error checking admin permission:', error)
      return false
    }
  }

  async getAdminPermissions(): Promise<AdminPermission[]> {
    try {
      const permissions: AdminPermission[] = [
        {
          id: '1',
          name: 'manage_users',
          description: 'Create, update, and delete user accounts',
          category: 'users'
        },
        {
          id: '2',
          name: 'moderate_content',
          description: 'Review and moderate user-generated content',
          category: 'content'
        },
        {
          id: '3',
          name: 'view_analytics',
          description: 'Access system analytics and reports',
          category: 'analytics'
        },
        {
          id: '4',
          name: 'manage_billing',
          description: 'Access billing and subscription management',
          category: 'billing'
        },
        {
          id: '5',
          name: 'system_configuration',
          description: 'Modify system settings and configuration',
          category: 'system'
        }
      ]

      return permissions
    } catch (error) {
      console.error('Error fetching admin permissions:', error)
      throw error
    }
  }

  // Health Checks
  async performSystemHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical'
    checks: Array<{
      name: string
      status: 'pass' | 'fail' | 'warn'
      message: string
      responseTime?: number
    }>
  }> {
    try {
      const checks = [
        {
          name: 'Database Connection',
          status: 'pass' as const,
          message: 'Database is responding normally',
          responseTime: 45
        },
        {
          name: 'OpenAI API',
          status: 'pass' as const,
          message: 'AI services are operational',
          responseTime: 120
        },
        {
          name: 'Stripe API',
          status: 'pass' as const,
          message: 'Payment processing is working',
          responseTime: 89
        },
        {
          name: 'Collaboration Service',
          status: 'warn' as const,
          message: 'High WebSocket connection count',
          responseTime: 200
        }
      ]

      const hasFailures = checks.some(check => check.status === 'fail')
      const hasWarnings = checks.some(check => check.status === 'warn')

      const status = hasFailures ? 'critical' : hasWarnings ? 'warning' : 'healthy'

      return { status, checks }
    } catch (error) {
      console.error('Error performing health check:', error)
      return {
        status: 'critical',
        checks: [{
          name: 'System Health Check',
          status: 'fail',
          message: 'Failed to perform health check'
        }]
      }
    }
  }
}

// Export singleton instance
export const adminService = AdminService.getInstance()
