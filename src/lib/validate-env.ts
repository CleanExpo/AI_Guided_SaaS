// @ts-nocheck
/**
 * Runtime Environment Validation
 * Validates environment variables are properly set in Vercel
 */

export function validateEnvironment() {
  const errors: string[] = [];

  // Check if running in Vercel
  if (process.env.VERCEL) {
    console.log('🔍 Validating Vercel environment variables...');

    // Required variables
    const required={ DATABASE_URL: process.env.DATABASE_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET }

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
      console.log('✅ All required environment variables are set in Vercel')
} else {
      console.error('❌ Environment validation failed:');
      errors.forEach(error => console.error(`   - ${error}`));
      
      // Don't throw in production to avoid breaking the build
      // Instead, features will gracefully degrade
      if (process.env.NODE_ENV !== 'production') {
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