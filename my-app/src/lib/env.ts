import { z } from 'zod'

// Environment variable schema
const envSchema = z.object({
  // Next.js
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),
  NEXTAUTH_SECRET: z.string().min(32),

  // Database
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Authentication
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // AI Services
  OPENAI_API_KEY: z.string().optional(),

  // Payment
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
})

// Parse and validate environment variables
let env: z.infer<typeof envSchema>

try {
  env = envSchema.parse(process.env)
} catch (error) {
  console.warn('Environment validation failed, using defaults:', error)
  env = {
    NODE_ENV: 'development',
    NEXTAUTH_URL: 'http://localhost:3000',
    NEXTAUTH_SECRET: 'development-secret-that-is-at-least-32-characters-long-for-jwt-encryption',
  } as z.infer<typeof envSchema>
}

export { env }

// Service configuration helpers
export function isServiceConfigured(service: string): boolean {
  switch (service) {
    case 'supabase':
      return !!(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY)
    case 'google':
      return !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)
    case 'openai':
      return !!env.OPENAI_API_KEY
    case 'stripe':
      return !!(env.STRIPE_SECRET_KEY && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    case 'database':
      return !!(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY)
    default:
      return false
  }
}

// Get service status for debugging
export function getServiceStatus() {
  return {
    supabase: isServiceConfigured('supabase'),
    google: isServiceConfigured('google'),
    openai: isServiceConfigured('openai'),
    stripe: isServiceConfigured('stripe'),
    database: isServiceConfigured('database'),
  }
}

// Environment-specific configurations
export const config = {
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  
  // API URLs
  baseUrl: env.NEXTAUTH_URL,
  
  // Feature flags
  features: {
    enableAnalytics: env.NODE_ENV === 'production',
    enableDebugMode: env.NODE_ENV === 'development',
    enableTestMode: env.NODE_ENV !== 'production',
  },
  
  // Rate limiting
  rateLimits: {
    api: env.NODE_ENV === 'production' ? 100 : 1000, // requests per minute
    ai: env.NODE_ENV === 'production' ? 10 : 50, // AI requests per minute
  }
}
