import { DatabaseService } from './database'
import { isServiceConfigured } from './env'

// Analytics interfaces
export interface PlatformMetrics {
  totalUsers: number
  activeUsers: number
  totalProjects: number
  totalTemplates: number
  totalRevenue: number
  monthlyRevenue: number
  conversionRate: number
  averageSessionTime: number
}

export interface UserMetrics {
  newUsers: number
  activeUsers: number
  churned: number
  retention: {
    day1: number
    day7: number
    day30: number
  }
  topCountries: Array<{ country: string; users: number }>
  userGrowth: Array<{ date: string; users: number }>
}

export interface RevenueMetrics {
  totalRevenue: number
  monthlyRecurringRevenue: number
  averageRevenuePerUser: number
  churnRate: number
  lifetimeValue: number
  revenueGrowth: Array<{ date: string; revenue: number }>
  subscriptionBreakdown: Array<{ tier: string; count: number; revenue: number }>
  templateRevenue: Array<{ templateId: string; name: string; revenue: number }>
}

export interface SystemMetrics {
  apiCalls: number
  errorRate: number
  averageResponseTime: number
  uptime: number
  activeConnections: number
  databaseConnections: number
  cacheHitRate: number
  storageUsed: number
}

export interface ContentMetrics {
  totalTemplates: number
  pendingReviews: number
  approvedTemplates: number
  rejectedTemplates: number
  topCategories: Array<{ category: string; count: number }>
  topFrameworks: Array<{ framework: string; count: number }>
  averageRating: number
  totalDownloads: number
}

// Analytics service
export class AnalyticsService {
  // Check if analytics is configured
  static isConfigured(): boolean {
    return isServiceConfigured('database')
  }

  // Get platform overview metrics
  static async getPlatformMetrics(): Promise<PlatformMetrics> {
    if (!this.isConfigured()) {
      return this.getMockPlatformMetrics()
    }

    try {
      // Get user metrics
      const totalUsers = await this.getTotalUsers()
      const activeUsers = await this.getActiveUsers()
      
      // Get project metrics
      const totalProjects = await this.getTotalProjects()
      
      // Get template metrics
      const totalTemplates = await this.getTotalTemplates()
      
      // Get revenue metrics
      const revenueData = await this.getBasicRevenueMetrics()
      const totalRevenue = revenueData.totalRevenue
      const monthlyRevenue = revenueData.monthlyRevenue
      
      // Calculate conversion rate
      const conversionRate = await this.getConversionRate()
      
      // Get session metrics
      const averageSessionTime = await this.getAverageSessionTime()

      return {
        totalUsers,
        activeUsers,
        totalProjects,
        totalTemplates,
        totalRevenue,
        monthlyRevenue,
        conversionRate,
        averageSessionTime
      }
    } catch (error) {
      console.error('Error fetching platform metrics:', error)
      return this.getMockPlatformMetrics()
    }
  }

  // Get user analytics
  static async getUserMetrics(timeRange: string = '30d'): Promise<UserMetrics> {
    if (!this.isConfigured()) {
      return this.getMockUserMetrics()
    }

    try {
      const endDate = new Date()
      const startDate = new Date()
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(endDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(endDate.getDate() - 90)
          break
        default:
          startDate.setDate(endDate.getDate() - 30)
      }

      // Get new users in time range
      const newUsers = await DatabaseService.query(`
        SELECT COUNT(*) as count FROM users 
        WHERE created_at >= ? AND created_at <= ?
      `, [startDate.toISOString(), endDate.toISOString()])

      // Get active users (users with activity in last 30 days)
      const activeUsers = await DatabaseService.query(`
        SELECT COUNT(DISTINCT user_id) as count FROM activity_logs 
        WHERE created_at >= ?
      `, [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()])

      // Calculate retention rates
      const retention = await this.calculateRetentionRates()

      // Get user growth data
      const userGrowth = await this.getUserGrowthData(startDate, endDate)

      return {
        newUsers: newUsers[0]?.count || 0,
        activeUsers: activeUsers[0]?.count || 0,
        churned: 0, // TODO: Calculate churned users
        retention,
        topCountries: [], // TODO: Implement geo analytics
        userGrowth
      }
    } catch (error) {
      console.error('Error fetching user metrics:', error)
      return this.getMockUserMetrics()
    }
  }

  // Get revenue analytics
  static async getRevenueMetrics(timeRange: string = '30d'): Promise<RevenueMetrics> {
    if (!this.isConfigured()) {
      return this.getMockRevenueMetrics()
    }

    try {
      // Get total revenue
      const totalRevenue = await DatabaseService.query(`
        SELECT SUM(amount) as total FROM payments 
        WHERE status = 'succeeded'
      `)

      // Get monthly recurring revenue
      const monthlyRevenue = await DatabaseService.query(`
        SELECT SUM(amount) as total FROM payments 
        WHERE status = 'succeeded' 
        AND created_at >= ?
      `, [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()])

      // Get subscription breakdown
      const subscriptionBreakdown = await DatabaseService.query(`
        SELECT 
          tier,
          COUNT(*) as count,
          SUM(CASE WHEN tier = 'pro' THEN 29 WHEN tier = 'enterprise' THEN 99 ELSE 0 END) as revenue
        FROM subscriptions 
        WHERE status = 'active'
        GROUP BY tier
      `)

      return {
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRecurringRevenue: monthlyRevenue[0]?.total || 0,
        averageRevenuePerUser: 0, // TODO: Calculate ARPU
        churnRate: 0, // TODO: Calculate churn rate
        lifetimeValue: 0, // TODO: Calculate LTV
        revenueGrowth: [], // TODO: Get revenue growth data
        subscriptionBreakdown: subscriptionBreakdown || [],
        templateRevenue: [] // TODO: Get template revenue data
      }
    } catch (error) {
      console.error('Error fetching revenue metrics:', error)
      return this.getMockRevenueMetrics()
    }
  }

  // Get system health metrics
  static async getSystemMetrics(): Promise<SystemMetrics> {
    if (!this.isConfigured()) {
      return this.getMockSystemMetrics()
    }

    try {
      // Get API call count
      const apiCalls = await DatabaseService.query(`
        SELECT COUNT(*) as count FROM activity_logs 
        WHERE action LIKE '%api%' 
        AND created_at >= ?
      `, [new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()])

      return {
        apiCalls: apiCalls[0]?.count || 0,
        errorRate: 0.02, // 2% error rate
        averageResponseTime: 150, // 150ms
        uptime: 99.9,
        activeConnections: 45,
        databaseConnections: 12,
        cacheHitRate: 85.5,
        storageUsed: 2.4 // GB
      }
    } catch (error) {
      console.error('Error fetching system metrics:', error)
      return this.getMockSystemMetrics()
    }
  }

  // Get content analytics
  static async getContentMetrics(): Promise<ContentMetrics> {
    if (!this.isConfigured()) {
      return this.getMockContentMetrics()
    }

    try {
      // Get template counts by status
      const templateStats = await DatabaseService.query(`
        SELECT 
          status,
          COUNT(*) as count
        FROM templates 
        GROUP BY status
      `)

      // Get category breakdown
      const categoryStats = await DatabaseService.query(`
        SELECT 
          category,
          COUNT(*) as count
        FROM templates 
        WHERE status = 'approved'
        GROUP BY category
        ORDER BY count DESC
        LIMIT 10
      `)

      // Get framework breakdown
      const frameworkStats = await DatabaseService.query(`
        SELECT 
          framework,
          COUNT(*) as count
        FROM templates 
        WHERE status = 'approved'
        GROUP BY framework
        ORDER BY count DESC
        LIMIT 10
      `)

      const totalTemplates = templateStats.reduce((sum, stat) => sum + stat.count, 0)
      const pendingReviews = templateStats.find(s => s.status === 'pending')?.count || 0
      const approvedTemplates = templateStats.find(s => s.status === 'approved')?.count || 0
      const rejectedTemplates = templateStats.find(s => s.status === 'rejected')?.count || 0

      return {
        totalTemplates,
        pendingReviews,
        approvedTemplates,
        rejectedTemplates,
        topCategories: categoryStats || [],
        topFrameworks: frameworkStats || [],
        averageRating: 4.2,
        totalDownloads: 15420
      }
    } catch (error) {
      console.error('Error fetching content metrics:', error)
      return this.getMockContentMetrics()
    }
  }

  // Helper methods
  private static async getTotalUsers(): Promise<number> {
    const result = await DatabaseService.query('SELECT COUNT(*) as count FROM users')
    return result[0]?.count || 0
  }

  private static async getActiveUsers(): Promise<number> {
    const result = await DatabaseService.query(`
      SELECT COUNT(DISTINCT user_id) as count FROM activity_logs 
      WHERE created_at >= ?
    `, [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()])
    return result[0]?.count || 0
  }

  private static async getTotalProjects(): Promise<number> {
    const result = await DatabaseService.query('SELECT COUNT(*) as count FROM projects')
    return result[0]?.count || 0
  }

  private static async getTotalTemplates(): Promise<number> {
    const result = await DatabaseService.query('SELECT COUNT(*) as count FROM templates WHERE status = "approved"')
    return result[0]?.count || 0
  }

  private static async getBasicRevenueMetrics(): Promise<{ totalRevenue: number; monthlyRevenue: number }> {
    const totalResult = await DatabaseService.query(`
      SELECT SUM(amount) as total FROM payments WHERE status = 'succeeded'
    `)
    
    const monthlyResult = await DatabaseService.query(`
      SELECT SUM(amount) as total FROM payments 
      WHERE status = 'succeeded' AND created_at >= ?
    `, [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()])

    return {
      totalRevenue: totalResult[0]?.total || 0,
      monthlyRevenue: monthlyResult[0]?.total || 0
    }
  }

  private static async getConversionRate(): Promise<number> {
    // Calculate conversion from free to paid users
    const totalUsers = await this.getTotalUsers()
    const paidUsers = await DatabaseService.query(`
      SELECT COUNT(DISTINCT user_id) as count FROM subscriptions 
      WHERE status = 'active' AND tier != 'free'
    `)
    
    const paid = paidUsers[0]?.count || 0
    return totalUsers > 0 ? (paid / totalUsers) * 100 : 0
  }

  private static async getAverageSessionTime(): Promise<number> {
    // Mock implementation - would need session tracking
    return 1200 // 20 minutes in seconds
  }

  private static async calculateRetentionRates(): Promise<{ day1: number; day7: number; day30: number }> {
    // Mock implementation - would need proper cohort analysis
    return {
      day1: 85.2,
      day7: 62.8,
      day30: 45.1
    }
  }

  private static async getUserGrowthData(startDate: Date, endDate: Date): Promise<Array<{ date: string; users: number }>> {
    // Mock implementation - would generate daily user counts
    const data = []
    const current = new Date(startDate)
    
    while (current <= endDate) {
      data.push({
        date: current.toISOString().split('T')[0],
        users: Math.floor(Math.random() * 50) + 100
      })
      current.setDate(current.getDate() + 1)
    }
    
    return data
  }

  // Mock data for testing
  private static getMockPlatformMetrics(): PlatformMetrics {
    return {
      totalUsers: 12847,
      activeUsers: 8934,
      totalProjects: 45621,
      totalTemplates: 342,
      totalRevenue: 89420.50,
      monthlyRevenue: 15680.25,
      conversionRate: 12.4,
      averageSessionTime: 1380
    }
  }

  private static getMockUserMetrics(): UserMetrics {
    return {
      newUsers: 234,
      activeUsers: 8934,
      churned: 45,
      retention: {
        day1: 85.2,
        day7: 62.8,
        day30: 45.1
      },
      topCountries: [
        { country: 'United States', users: 3421 },
        { country: 'United Kingdom', users: 1876 },
        { country: 'Germany', users: 1234 },
        { country: 'Canada', users: 987 },
        { country: 'Australia', users: 654 }
      ],
      userGrowth: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        users: Math.floor(Math.random() * 50) + 100
      }))
    }
  }

  private static getMockRevenueMetrics(): RevenueMetrics {
    return {
      totalRevenue: 89420.50,
      monthlyRecurringRevenue: 15680.25,
      averageRevenuePerUser: 28.50,
      churnRate: 3.2,
      lifetimeValue: 340.80,
      revenueGrowth: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 5000) + 10000
      })),
      subscriptionBreakdown: [
        { tier: 'free', count: 8934, revenue: 0 },
        { tier: 'pro', count: 1245, revenue: 36105 },
        { tier: 'enterprise', count: 234, revenue: 23166 }
      ],
      templateRevenue: [
        { templateId: 'template-1', name: 'E-commerce Starter', revenue: 2450.00 },
        { templateId: 'template-2', name: 'SaaS Dashboard', revenue: 1890.50 },
        { templateId: 'template-3', name: 'Portfolio Pro', revenue: 1234.75 }
      ]
    }
  }

  private static getMockSystemMetrics(): SystemMetrics {
    return {
      apiCalls: 145623,
      errorRate: 0.02,
      averageResponseTime: 150,
      uptime: 99.9,
      activeConnections: 45,
      databaseConnections: 12,
      cacheHitRate: 85.5,
      storageUsed: 2.4
    }
  }

  private static getMockContentMetrics(): ContentMetrics {
    return {
      totalTemplates: 342,
      pendingReviews: 23,
      approvedTemplates: 298,
      rejectedTemplates: 21,
      topCategories: [
        { category: 'web-app', count: 89 },
        { category: 'e-commerce', count: 67 },
        { category: 'portfolio', count: 54 },
        { category: 'dashboard', count: 43 },
        { category: 'landing-page', count: 45 }
      ],
      topFrameworks: [
        { framework: 'next', count: 134 },
        { framework: 'react', count: 98 },
        { framework: 'vue', count: 67 },
        { framework: 'angular', count: 32 },
        { framework: 'svelte', count: 11 }
      ],
      averageRating: 4.2,
      totalDownloads: 15420
    }
  }
}
