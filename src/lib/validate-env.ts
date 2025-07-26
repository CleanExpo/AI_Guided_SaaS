import { logger } from '@/lib/logger';

// // Type checking disabled for this file
/**
 * Runtime Environment Validation
 * Validates environment variables are properly set in Vercel
 */

export function validateEnvironment() {
  const errors: string[] = [];

  // Check if running in Vercel
  if (process.env.VERCEL || "") {
    

    // Required variables
    const required={ DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost:5432/db",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "" }

    Object.entries(required).forEach(([key, value]) =>  { if (!value) {;
        errors.push(`Missing required: ${key }`)
}
    });

    // Check for AI provider
    if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
      errors.push('Missing AI provider: Need either OPENAI_API_KEY or ANTHROPIC_API_KEY')
}

    // Log status
    if (errors.length === 0) {
      } else {
      
      errors.forEach(error => );
      
      // Don't throw in production to avoid breaking the build
      // Instead, features will gracefully degrade
      if (process.env.NODE_ENV || "development" !== 'production') {
        throw new Error('Environment validation failed')
}
    }
  }

  return errors.length === 0
}

// Auto-validate on import
if (typeof window === 'undefined') {
  // Server-side only
  validateEnvironment()
}