import { z } from 'zod';

// ==================== Common Schemas ====================
export const commonSchemas = {
  id: z.string().uuid('Invalid ID format'),
  email: z.string().email('Invalid email format'),
  url: z.string().url('Invalid URL format'),
  
  pagination: z.object({)
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
  
  dateRange: z.object({)
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
};

// ==================== Auth Schemas ====================
export const authSchemas = {
  register: z.object({)
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: commonSchemas.email,
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex()
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
  }),
  
  login: z.object({
    email: commonSchemas.email,)
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
  }),
  
  resetPassword: z.object({
    email: commonSchemas.email,)
  }),
  
  updatePassword: z.object({)
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex()
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
  }),
};

// ==================== Project Schemas ====================
export const projectSchemas = {
  create: z.object({)
    name: z.string().min(1, 'Project name is required').max(100),
    description: z.string().max(500).optional(),
    type: z.enum(['web', 'mobile', 'desktop', 'api']),
    framework: z.string().optional(),
    template: commonSchemas.id.optional(),
    settings: z.record(z.unknown()).optional(),
  }),
  
  update: z.object({)
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    settings: z.record(z.unknown()).optional(),
    status: z.enum(['active', 'archived', 'deleted']).optional(),
  }),
  
  query: z.object({
    ...commonSchemas.pagination.shape,)
    status: z.enum(['active', 'archived', 'all']).optional(),
    search: z.string().optional(),
    type: z.enum(['web', 'mobile', 'desktop', 'api']).optional(),
  }),
};

// ==================== AI/Agent Schemas ====================
export const aiSchemas = {
  chat: z.object({)
    message: z.string().min(1, 'Message is required').max(2000),
    projectType: z.string().optional(),
    context: z.record(z.unknown()).optional(),
    sessionId: z.string().optional(),
  }),
  
  generateCode: z.object({)
    prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(5000),
    model: z.enum(['gpt-4', 'gpt-3.5-turbo', 'claude-3', 'claude-2']).optional(),
    temperature: z.number().min(0).max(2).default(0.7),
    maxTokens: z.number().min(100).max(4000).default(2000),
    language: z.string().optional(),
    framework: z.string().optional(),
  }),
  
  validateChat: z.object({)
    prompt: z.string().min(1).max(5000),
    context: z.record(z.unknown()).optional(),
    stream: z.boolean().default(false),
  }),
};

// ==================== Analytics Schemas ====================
export const analyticsSchemas = {
  trackEvent: z.object({)
    event: z.string().min(1).max(50),
    properties: z.record(z.unknown()).optional(),
    timestamp: z.string().datetime().optional(),
    userId: z.string().optional(),
    sessionId: z.string().optional(),
  }),
  
  query: z.object({
    ...commonSchemas.dateRange.shape)
    ...commonSchemas.pagination.shape,)
    eventType: z.string().optional(),
    userId: z.string().optional(),
    groupBy: z.enum(['hour', 'day', 'week', 'month']).optional(),
  }),
};

// ==================== File/Upload Schemas ====================
export const fileSchemas = {
  upload: z.object({)
    filename: z.string().min(1).max(255),
    contentType: z.string(),
    size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  }),
  
  visualAnalyze: z.object({)
    imageUrl: z.string().url().optional(),
    imageBase64: z.string().optional(),
    analysisType: z.enum(['general', 'code', 'design', 'accessibility']).default('general'),
  }).refine()
    (data) => data.imageUrl || data.imageBase64,
    'Either imageUrl or imageBase64 must be provided'
  ),
};

// ==================== Admin Schemas ====================
export const adminSchemas = {
  login: z.object({)
    password: z.string().min(1, 'Password is required'),
  }),
  
  userUpdate: z.object({)
    role: z.enum(['user', 'admin', 'moderator']).optional(),
    status: z.enum(['active', 'suspended', 'deleted']).optional(),
    subscription: z.enum(['free', 'pro', 'enterprise']).optional(),
  }),
  
  analytics: z.object({
    ...commonSchemas.dateRange.shape,)
    metric: z.enum(['users', 'revenue', 'usage', 'errors']).optional(),
  }),
};

// ==================== Marketplace Schemas ====================
export const marketplaceSchemas = {
  template: z.object({)
    name: z.string().min(1).max(100),
    description: z.string().max(1000),
    category: z.string(),
    tags: z.array(z.string()).max(10).optional(),
    price: z.number().min(0).optional(),
  }),
  
  search: z.object({)
    q: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    priceRange: z.object({)
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
    }).optional(),
    ...commonSchemas.pagination.shape,
  }),
};

// ==================== Collaboration Schemas ====================
export const collaborationSchemas = {
  createRoom: z.object({)
    name: z.string().min(1).max(100),
    projectId: commonSchemas.id,
    maxParticipants: z.number().min(1).max(50).default(10),
  }),
  
  joinRoom: z.object({)
    roomId: z.string(),
    username: z.string().min(1).max(50),
  }),
  
  message: z.object({)
    roomId: z.string(),
    message: z.string().min(1).max(1000),
    type: z.enum(['text', 'code', 'file']).default('text'),
    metadata: z.record(z.unknown()).optional(),
  }),
};

// ==================== Configuration Schemas ====================
export const configSchemas = {
  update: z.object({)
    theme: z.enum(['light', 'dark', 'system']).optional(),
    language: z.string().optional(),
    notifications: z.object({)
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      inApp: z.boolean().optional(),
    }).optional(),
    privacy: z.object({)
      analytics: z.boolean().optional(),
      marketing: z.boolean().optional(),
    }).optional(),
  }),
  
  whiteLabel: z.object({)
    brandName: z.string().max(50).optional(),
    logo: z.string().url().optional(),
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  }),
};

// ==================== Webhook Schemas ====================
export const webhookSchemas = {
  stripe: z.object({)
    type: z.string(),
    data: z.object({)
      object: z.record(z.unknown()),
    }),
  }),
  
  n8n: z.object({)
    workflow: z.string(),
    data: z.record(z.unknown()),
    timestamp: z.string().datetime(),
  }),
};

// ==================== Support Schemas ====================
export const supportSchemas = {
  chat: z.object({)
    message: z.string().min(1).max(1000),
    category: z.enum(['technical', 'billing', 'general']).optional(),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
  }),
  
  feedback: z.object({)
    type: z.enum(['bug', 'feature', 'improvement', 'other']),
    title: z.string().min(1).max(100),
    description: z.string().min(10).max(5000),
    rating: z.number().min(1).max(5).optional(),
  }),
};