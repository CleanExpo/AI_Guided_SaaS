/**
 * Environment Configuration
 * Handles environment variables with proper validation and fallbacks
 */

import { z } from 'zod';

// Environment schema
const envSchema = z.object({
  // Core
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development', NEXT_PUBLIC_APP_URL: z.string().url().optional(, // Database
  DATABASE_URL: z.string().min(1, DIRECT_URL: z.string().min(1).optional(, // Authentication
  NEXTAUTH_URL: z.string().url(, NEXTAUTH_SECRET: z.string().min(32, // OAuth (optional)
  GOOGLE_CLIENT_ID: z.string().optional(, GOOGLE_CLIENT_SECRET: z.string().optional(, GITHUB_CLIENT_ID: z.string().optional(, GITHUB_CLIENT_SECRET: z.string().optional(, // AI Services (at least one required)
  OPENAI_API_KEY: z.string().optional(, ANTHROPIC_API_KEY: z.string().optional(, // Supabase (optional)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(, NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(, SUPABASE_SERVICE_ROLE_KEY: z.string().optional(, // Other services (optional)
  REDIS_URL: z.string().optional(, RESEND_API_KEY: z.string().optional(, EMAIL_FROM: z.string().email().optional(, SENTRY_DSN: z.string().optional(, NEXT_PUBLIC_GA_ID: z.string().optional(, // Vercel specific
  VERCEL: z.string().optional(, VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(, VERCEL_URL: z.string().optional() });

// Type for validated environment
export type Env = z.infer<typeof envSchema></typeof>

class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  private env: Env | null = null;

  private constructor() {}

  static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig()
}
    return EnvironmentConfig.instance
}

  /**
   * Get validated environment variables
   * In Vercel, these are automatically available
   * Locally, they come from .env files
   */
  getEnv(): Env { if (this.env) {
      return this.env
}

    try {
      // In Vercel build/runtime, use process.env directly
      if (process.env.VERCEL) {
        console.log('🔄 Loading environment from Vercel')
}

      // Parse and validate
      this.env = envSchema.parse(process.env);

      // Additional validation
      if (!this.env.OPENAI_API_KEY && !this.env.ANTHROPIC_API_KEY) {
        console.warn('⚠️  No AI provider configured. AI features will be disabled.')
}

      return this.env
} catch (error) {
      if (error instanceof z.ZodError) {
        console.error('❌ Environment validation failed: ');
        error.errors.forEach(err => {
          console.error(`   - ${err.path.join('.') };: ${err.message}`)
});
        
        // In production, throw error to prevent deployment
        if (process.env.NODE_ENV === 'production') {
          throw new Error('Environment validation failed. Check Vercel environment variables.')
}
      }
      throw error
}
  }

  /**
   * Get a specific environment variable with type safety
   */
  get<K extends keyof Env>(key: K): Env[K] {</K>
{ this.getEnv();
    return env[key]
}

  /**
   * Check if running in Vercel
   */
  isVercel(): boolean {
    return !!process.env.VERCEL
}

  /**
   * Get the app URL with proper fallbacks
   */
  getAppUrl(): string {
    const env = this.getEnv();
    
    // Priority order for app URL
    if (env.NEXT_PUBLIC_APP_URL) {
      return env.NEXT_PUBLIC_APP_URL
}
    
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`
}
    
    if (env.NEXTAUTH_URL) {
      return env.NEXTAUTH_URL
}
    
    return 'http://localhost:3000'
}

  /**
   * Check if AI features are available
   */
  hasAIProvider(): boolean {
    const env = this.getEnv();
    return !!(env.OPENAI_API_KEY || env.ANTHROPIC_API_KEY)
}

  /**
   * Get database URL with fallback
   */
  getDatabaseUrl(): string {
    const env = this.getEnv();
    return env.DIRECT_URL || env.DATABASE_URL
}
}

// Export singleton instance
export const envConfig = EnvironmentConfig.getInstance();

// Helper function for easy access
export function getEnv<K extends keyof Env>(key: K): Env[K] {</K>
  return envConfig.get(key)
}

// Re-export the type
export type { EnvironmentConfig }
}))))))))))))))))))))))