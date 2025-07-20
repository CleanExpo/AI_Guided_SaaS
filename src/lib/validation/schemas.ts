import { z } from 'zod'

// Base schemas for common types
export const IdSchema = z.string().uuid()
export const EmailSchema = z.string().email()
export const UrlSchema = z.string().url()
export const DateSchema = z.string().datetime()
export const TimestampSchema = z.number().int().positive()

// User schemas
export const UserSchema = z.object({
  id: IdSchema,
  email: EmailSchema,
  name: z.string().min(1).max(100),
  role: z.enum(['user', 'admin', 'developer']),
  createdAt: DateSchema,
  updatedAt: DateSchema,
  metadata: z.record(z.unknown()).optional()
})

export const CreateUserSchema = UserSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})

export const UpdateUserSchema = CreateUserSchema.partial()

// Project schemas
export const ProjectTypeSchema = z.enum([
  'web-app',
  'mobile-app',
  'api',
  'ml-model',
  'data-pipeline',
  'automation',
  'other'
])

export const ProjectStatusSchema = z.enum([
  'planning',
  'in-progress',
  'testing',
  'deployed',
  'archived'
])

export const ProjectSchema = z.object({
  id: IdSchema,
  userId: IdSchema,
  name: z.string().min(1).max(200),
  description: z.string().max(1000),
  type: ProjectTypeSchema,
  status: ProjectStatusSchema,
  config: z.object({
    framework: z.string().optional(),
    language: z.string().optional(),
    database: z.string().optional(),
    hosting: z.string().optional(),
    features: z.array(z.string()).optional()
  }),
  createdAt: DateSchema,
  updatedAt: DateSchema,
  metadata: z.record(z.unknown()).optional()
})

export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true
})

export const UpdateProjectSchema = CreateProjectSchema.partial()

// Chat/Message schemas
export const MessageRoleSchema = z.enum(['user', 'assistant', 'system'])

export const MessageSchema = z.object({
  id: IdSchema.optional(),
  role: MessageRoleSchema,
  content: z.string().min(1),
  timestamp: DateSchema.optional(),
  metadata: z.object({
    model: z.string().optional(),
    tokens: z.number().optional(),
    agentType: z.string().optional()
  }).optional()
})

export const ChatRequestSchema = z.object({
  messages: z.array(MessageSchema),
  projectId: IdSchema.optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
  stream: z.boolean().optional()
})

export const ChatResponseSchema = z.object({
  message: MessageSchema,
  usage: z.object({
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number()
  }).optional(),
  projectUpdates: z.array(z.any()).optional()
})

// API Request/Response schemas
export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
  details: z.any().optional()
})

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  total: z.number().int().nonnegative().optional(),
  hasMore: z.boolean().optional()
})

export const SortSchema = z.object({
  field: z.string(),
  order: z.enum(['asc', 'desc']).default('asc')
})

export const FilterSchema = z.object({
  field: z.string(),
  operator: z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'like']),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.any())])
})

export const ListRequestSchema = z.object({
  pagination: PaginationSchema.optional(),
  sort: z.array(SortSchema).optional(),
  filters: z.array(FilterSchema).optional()
})

// Agent-specific schemas
export const AgentTypeSchema = z.enum([
  'analyst',
  'project-manager',
  'architect',
  'prompt-refiner',
  'tools-refiner',
  'agent-refiner',
  'advisor'
])

export const AgentTaskPrioritySchema = z.enum(['critical', 'high', 'medium', 'low'])

export const AgentTaskSchema = z.object({
  id: z.string(),
  agentType: AgentTypeSchema,
  input: z.string(),
  priority: AgentTaskPrioritySchema,
  dependencies: z.array(z.string()).optional(),
  timeout: z.number().positive().optional(),
  retries: z.number().int().nonnegative().optional(),
  metadata: z.record(z.unknown()).optional()
})

export const AgentResultSchema = z.object({
  success: z.boolean(),
  output: z.any(),
  messages: z.array(z.object({
    type: z.enum(['thought', 'observation', 'action']),
    content: z.string(),
    timestamp: z.number(),
    data: z.any().optional()
  })),
  artifacts: z.record(z.any()).optional(),
  error: z.string().optional(),
  nextSteps: z.array(z.string()).optional(),
  confidence: z.number().min(0).max(1).optional()
})

// Environment variable schemas
export const EnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  
  // OAuth Providers
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  
  // AI Services
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_AI_API_KEY: z.string().optional(),
  
  // Services
  REDIS_URL: z.string().url().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  // Admin
  ADMIN_USERNAME: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  
  // Feature Flags
  ENABLE_ANALYTICS: z.boolean().optional(),
  ENABLE_ERROR_REPORTING: z.boolean().optional(),
  
  // Node Environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development')
})

// Validation utilities
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error }
    }
    throw error
  }
}

export function validateAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; error: z.ZodError }> {
  return new Promise((resolve) => {
    try {
      const validated = schema.parse(data)
      resolve({ success: true, data: validated })
    } catch (error) {
      if (error instanceof z.ZodError) {
        resolve({ success: false, error })
      } else {
        throw error
      }
    }
  })
}

// Type inference helpers
export type User = z.infer<typeof UserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>
export type Project = z.infer<typeof ProjectSchema>
export type CreateProject = z.infer<typeof CreateProjectSchema>
export type UpdateProject = z.infer<typeof UpdateProjectSchema>
export type Message = z.infer<typeof MessageSchema>
export type ChatRequest = z.infer<typeof ChatRequestSchema>
export type ChatResponse = z.infer<typeof ChatResponseSchema>
export type AgentTask = z.infer<typeof AgentTaskSchema>
export type AgentResult = z.infer<typeof AgentResultSchema>
export type ApiError = z.infer<typeof ApiErrorSchema>
export type Pagination = z.infer<typeof PaginationSchema>
export type ListRequest = z.infer<typeof ListRequestSchema>