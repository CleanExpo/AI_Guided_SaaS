import { isServiceConfigured } from './env'
import { DatabaseService } from './database'

// Template type definitions
export interface Template {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  framework: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  author: {
    id: string
    name: string
    avatar?: string
    verified: boolean
  }
  pricing: {
    type: 'free' | 'premium' | 'pro'
    price?: number
    currency?: string
  }
  stats: {
    downloads: number
    rating: number
    reviews: number
    lastUpdated: string
  }
  files: TemplateFile[]
  preview: {
    images: string[]
    demoUrl?: string
    features: string[]
  }
  metadata: {
    version: string
    license: string
    dependencies: Record<string, string>
    requirements: string[]
  }
  revenue?: {
    totalEarnings: number
    monthlyEarnings: number
    sharePercentage: number
  }
}

export interface TemplateFile {
  path: string
  content: string
  type: 'component' | 'page' | 'config' | 'style' | 'api' | 'util'
  description?: string
}

export interface TemplateCategory {
  id: string
  name: string
  description: string
  icon: string
  templateCount: number
}

export interface TemplateSubmission {
  id: string
  templateData: Partial<Template>
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision'
  submittedBy: string
  submittedAt: string
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
}

// Template marketplace service
export class TemplateMarketplace {
  // Check if template system is configured
  static isConfigured(): boolean {
    return isServiceConfigured('database')
  }

  // Get featured templates
  static async getFeaturedTemplates(): Promise<Template[]> {
    if (!this.isConfigured()) {
      return this.getMockFeaturedTemplates()
    }

    try {
      // In production, this would fetch from database
      const templates = await DatabaseService.query(`
        SELECT t.*, u.full_name as author_name, u.avatar_url as author_avatar
        FROM templates t
        JOIN users u ON t.author_id = u.id
        WHERE t.featured = true AND t.status = 'approved'
        ORDER BY t.downloads DESC
        LIMIT 12
      `)

      return templates.map(this.formatTemplate)
    } catch (error) {
      console.error('Error fetching featured templates:', error)
      return this.getMockFeaturedTemplates()
    }
  }

  // Get templates by category
  static async getTemplatesByCategory(category: string, limit = 20): Promise<Template[]> {
    if (!this.isConfigured()) {
      return this.getMockTemplatesByCategory(category)
    }

    try {
      const templates = await DatabaseService.query(`
        SELECT t.*, u.full_name as author_name, u.avatar_url as author_avatar
        FROM templates t
        JOIN users u ON t.author_id = u.id
        WHERE t.category = ? AND t.status = 'approved'
        ORDER BY t.downloads DESC
        LIMIT ?
      `, [category, limit])

      return templates.map(this.formatTemplate)
    } catch (error) {
      console.error('Error fetching templates by category:', error)
      return this.getMockTemplatesByCategory(category)
    }
  }

  // Search templates
  static async searchTemplates(query: string, filters?: {
    category?: string
    framework?: string
    pricing?: string
    difficulty?: string
  }): Promise<Template[]> {
    if (!this.isConfigured()) {
      return this.getMockSearchResults(query)
    }

    try {
      let sql = `
        SELECT t.*, u.full_name as author_name, u.avatar_url as author_avatar
        FROM templates t
        JOIN users u ON t.author_id = u.id
        WHERE t.status = 'approved'
        AND (t.name ILIKE ? OR t.description ILIKE ? OR t.tags::text ILIKE ?)
      `
      const params = [`%${query}%`, `%${query}%`, `%${query}%`]

      if (filters?.category) {
        sql += ' AND t.category = ?'
        params.push(filters.category)
      }

      if (filters?.framework) {
        sql += ' AND t.framework = ?'
        params.push(filters.framework)
      }

      if (filters?.pricing) {
        sql += ' AND t.pricing_type = ?'
        params.push(filters.pricing)
      }

      if (filters?.difficulty) {
        sql += ' AND t.difficulty = ?'
        params.push(filters.difficulty)
      }

      sql += ' ORDER BY t.downloads DESC LIMIT 50'

      const templates = await DatabaseService.query(sql, params)
      return templates.map(this.formatTemplate)
    } catch (error) {
      console.error('Error searching templates:', error)
      return this.getMockSearchResults(query)
    }
  }

  // Get template by ID
  static async getTemplate(id: string): Promise<Template | null> {
    if (!this.isConfigured()) {
      return this.getMockTemplate(id)
    }

    try {
      const template = await DatabaseService.query(`
        SELECT t.*, u.full_name as author_name, u.avatar_url as author_avatar
        FROM templates t
        JOIN users u ON t.author_id = u.id
        WHERE t.id = ? AND t.status = 'approved'
      `, [id])

      if (!template[0]) return null

      return this.formatTemplate(template[0])
    } catch (error) {
      console.error('Error fetching template:', error)
      return this.getMockTemplate(id)
    }
  }

  // Submit template for review
  static async submitTemplate(userId: string, templateData: Partial<Template>): Promise<{
    success: boolean
    submissionId?: string
    error?: string
  }> {
    if (!this.isConfigured()) {
      return {
        success: true,
        submissionId: `submission-${Date.now()}`,
      }
    }

    try {
      const submission = await DatabaseService.createRecord('template_submissions', {
        id: `submission-${Date.now()}`,
        template_data: templateData,
        submitted_by: userId,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      })

      // Log the submission
      if (submission) {
        await DatabaseService.logActivity(
          userId,
          'template_submission',
          'marketplace',
          submission.id,
          { templateName: templateData.name }
        )

        return {
          success: true,
          submissionId: submission.id
        }
      } else {
        return {
          success: false,
          error: 'Failed to create submission record'
        }
      }
    } catch (error) {
      console.error('Error submitting template:', error)
      return {
        success: false,
        error: 'Failed to submit template'
      }
    }
  }

  // Purchase template
  static async purchaseTemplate(userId: string, templateId: string): Promise<{
    success: boolean
    downloadUrl?: string
    error?: string
  }> {
    if (!this.isConfigured()) {
      return {
        success: true,
        downloadUrl: `/api/templates/${templateId}/download?demo=true`
      }
    }

    try {
      const template = await this.getTemplate(templateId)
      if (!template) {
        return { success: false, error: 'Template not found' }
      }

      // Check if user already owns this template
      const existingPurchase = await DatabaseService.query(`
        SELECT id FROM template_purchases 
        WHERE user_id = ? AND template_id = ?
      `, [userId, templateId])

      if (existingPurchase.length > 0) {
        return {
          success: true,
          downloadUrl: `/api/templates/${templateId}/download`
        }
      }

      // For free templates, just record the download
      if (template.pricing.type === 'free') {
        await DatabaseService.createRecord('template_purchases', {
          id: `purchase-${Date.now()}`,
          user_id: userId,
          template_id: templateId,
          price_paid: 0,
          currency: 'USD',
          purchased_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        })

        // Update download count
        await DatabaseService.query(`
          UPDATE templates SET downloads = downloads + 1 WHERE id = ?
        `, [templateId])

        return {
          success: true,
          downloadUrl: `/api/templates/${templateId}/download`
        }
      }

      // For paid templates, this would integrate with Stripe
      // For now, return success for demo purposes
      return {
        success: true,
        downloadUrl: `/api/templates/${templateId}/download`
      }
    } catch (error) {
      console.error('Error purchasing template:', error)
      return {
        success: false,
        error: 'Failed to purchase template'
      }
    }
  }

  // Get user's purchased templates
  static async getUserTemplates(userId: string): Promise<Template[]> {
    if (!this.isConfigured()) {
      return this.getMockUserTemplates()
    }

    try {
      const templates = await DatabaseService.query(`
        SELECT t.*, u.full_name as author_name, u.avatar_url as author_avatar
        FROM templates t
        JOIN template_purchases tp ON t.id = tp.template_id
        JOIN users u ON t.author_id = u.id
        WHERE tp.user_id = ?
        ORDER BY tp.purchased_at DESC
      `, [userId])

      return templates.map(this.formatTemplate)
    } catch (error) {
      console.error('Error fetching user templates:', error)
      return this.getMockUserTemplates()
    }
  }

  // Get template categories
  static async getCategories(): Promise<TemplateCategory[]> {
    if (!this.isConfigured()) {
      return this.getMockCategories()
    }

    try {
      const categories = await DatabaseService.query(`
        SELECT 
          c.*,
          COUNT(t.id) as template_count
        FROM template_categories c
        LEFT JOIN templates t ON c.id = t.category AND t.status = 'approved'
        GROUP BY c.id
        ORDER BY c.name
      `)

      return categories.map((cat: any) => ({
        id: cat.id as string,
        name: cat.name as string,
        description: cat.description as string,
        icon: cat.icon as string,
        templateCount: (cat.template_count as number) || 0
      }))
    } catch (error) {
      console.error('Error fetching categories:', error)
      return this.getMockCategories()
    }
  }

  // Format template data
  private static formatTemplate(data: any): Template {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : JSON.parse(data.tags || '[]'),
      framework: data.framework,
      difficulty: data.difficulty,
      author: {
        id: data.author_id,
        name: data.author_name,
        avatar: data.author_avatar,
        verified: data.author_verified || false
      },
      pricing: {
        type: data.pricing_type,
        price: data.price,
        currency: data.currency
      },
      stats: {
        downloads: data.downloads || 0,
        rating: data.rating || 0,
        reviews: data.review_count || 0,
        lastUpdated: data.updated_at
      },
      files: JSON.parse(data.files || '[]'),
      preview: {
        images: JSON.parse(data.preview_images || '[]'),
        demoUrl: data.demo_url,
        features: JSON.parse(data.features || '[]')
      },
      metadata: {
        version: data.version || '1.0.0',
        license: data.license || 'MIT',
        dependencies: JSON.parse(data.dependencies || '{}'),
        requirements: JSON.parse(data.requirements || '[]')
      }
    }
  }

  // Mock data for testing
  private static getMockFeaturedTemplates(): Template[] {
    return [
      {
        id: 'template-1',
        name: 'E-commerce Starter',
        description: 'Complete e-commerce solution with cart, checkout, and admin panel',
        category: 'ecommerce',
        tags: ['nextjs', 'stripe', 'tailwind', 'supabase'],
        framework: 'nextjs',
        difficulty: 'intermediate',
        author: {
          id: 'author-1',
          name: 'Sarah Chen',
          avatar: '/avatars/sarah.jpg',
          verified: true
        },
        pricing: {
          type: 'premium',
          price: 49,
          currency: 'USD'
        },
        stats: {
          downloads: 1247,
          rating: 4.8,
          reviews: 89,
          lastUpdated: '2024-01-15'
        },
        files: [],
        preview: {
          images: ['/templates/ecommerce-1.jpg', '/templates/ecommerce-2.jpg'],
          demoUrl: 'https://demo.ecommerce-starter.com',
          features: ['Shopping Cart', 'Payment Processing', 'Admin Dashboard', 'Inventory Management']
        },
        metadata: {
          version: '2.1.0',
          license: 'MIT',
          dependencies: {
            'next': '^14.0.0',
            'stripe': '^14.0.0',
            'tailwindcss': '^3.0.0'
          },
          requirements: ['Node.js 18+', 'Stripe Account', 'Database']
        }
      }
      // Add more mock templates as needed
    ]
  }

  private static getMockTemplatesByCategory(category: string): Template[] {
    return this.getMockFeaturedTemplates().filter(t => t.category === category)
  }

  private static getMockSearchResults(query: string): Template[] {
    return this.getMockFeaturedTemplates().filter(t => 
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  private static getMockTemplate(id: string): Template | null {
    return this.getMockFeaturedTemplates().find(t => t.id === id) || null
  }

  private static getMockUserTemplates(): Template[] {
    return this.getMockFeaturedTemplates().slice(0, 3)
  }

  private static getMockCategories(): TemplateCategory[] {
    return [
      {
        id: 'ecommerce',
        name: 'E-commerce',
        description: 'Online stores and marketplace templates',
        icon: 'ShoppingCart',
        templateCount: 24
      },
      {
        id: 'saas',
        name: 'SaaS',
        description: 'Software as a Service applications',
        icon: 'Cloud',
        templateCount: 18
      },
      {
        id: 'portfolio',
        name: 'Portfolio',
        description: 'Personal and professional portfolios',
        icon: 'User',
        templateCount: 31
      },
      {
        id: 'blog',
        name: 'Blog',
        description: 'Content management and blogging platforms',
        icon: 'FileText',
        templateCount: 15
      }
    ]
  }
}
