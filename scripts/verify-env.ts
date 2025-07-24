#!/usr/bin/env tsx

/**
 * Environment Variable Verification Script
 * Ensures all required environment variables are set for production
 */

import { z } from 'zod';
import chalk from 'chalk';

// Define environment schema
const envSchema = z.object({
  // Core Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  
  // Database
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),
  
  // Authentication
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  
  // AI Services (at least one required)
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  
  // Supabase (required for production)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  
  // Optional Services
  REDIS_URL: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
}).refine((data) => {
  // Ensure at least one AI provider is configured
  return data.OPENAI_API_KEY || data.ANTHROPIC_API_KEY;
}, {
  message: "At least one AI provider (OpenAI or Anthropic) must be configured",
});

interface EnvCheckResult {
  valid: boolean;
  missing: string[];
  invalid: string[];
  warnings: string[];
}

function checkEnvironment(): EnvCheckResult {
  const result: EnvCheckResult = {
    valid: true,
    missing: [],
    invalid: [],
    warnings: [],
  };

  console.log(chalk.blue('🔍 Verifying environment variables...\n'));

  try {
    // Parse environment
    const env = envSchema.parse(process.env);
    
    // Additional checks
    if (env.NODE_ENV === 'production') {
      // Production-specific requirements
      if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        result.warnings.push('Supabase configuration missing (recommended for production)');
      }
      
      if (!env.SENTRY_DSN) {
        result.warnings.push('Sentry DSN not configured (recommended for error tracking)');
      }
      
      if (!env.REDIS_URL) {
        result.warnings.push('Redis not configured (recommended for caching)');
      }
    }
    
    console.log(chalk.green('✅ Core environment variables are valid\n'));
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      result.valid = false;
      
      for (const issue of error.issues) {
        if (issue.code === 'invalid_type' && issue.received === 'undefined') {
          result.missing.push(issue.path.join('.'));
        } else {
          result.invalid.push(`${issue.path.join('.')}: ${issue.message}`);
        }
      }
    }
  }

  // Display results
  if (result.missing.length > 0) {
    console.log(chalk.red('❌ Missing required environment variables:'));
    result.missing.forEach(key => {
      console.log(chalk.red(`   - ${key}`));
    });
    console.log();
  }

  if (result.invalid.length > 0) {
    console.log(chalk.red('❌ Invalid environment variables:'));
    result.invalid.forEach(msg => {
      console.log(chalk.red(`   - ${msg}`));
    });
    console.log();
  }

  if (result.warnings.length > 0) {
    console.log(chalk.yellow('⚠️  Warnings:'));
    result.warnings.forEach(warning => {
      console.log(chalk.yellow(`   - ${warning}`));
    });
    console.log();
  }

  // Summary
  if (result.valid) {
    console.log(chalk.green('✅ Environment configuration is valid for deployment!'));
  } else {
    console.log(chalk.red('❌ Environment configuration is not ready for deployment.'));
    console.log(chalk.red('   Please fix the issues above and run this script again.'));
  }

  // Additional information
  console.log(chalk.gray('\n📋 Environment Summary:'));
  console.log(chalk.gray(`   - Environment: ${process.env.NODE_ENV}`));
  console.log(chalk.gray(`   - App URL: ${process.env.NEXT_PUBLIC_APP_URL}`));
  console.log(chalk.gray(`   - AI Providers: ${[
    process.env.OPENAI_API_KEY ? 'OpenAI' : null,
    process.env.ANTHROPIC_API_KEY ? 'Anthropic' : null,
  ].filter(Boolean).join(', ') || 'None'}`));
  console.log(chalk.gray(`   - Database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`));
  console.log(chalk.gray(`   - Auth: ${process.env.NEXTAUTH_SECRET ? 'Configured' : 'Not configured'}`));

  return result;
}

// Create .env.production template if missing variables
function createEnvTemplate(result: EnvCheckResult): void {
  if (!result.valid && result.missing.length > 0) {
    console.log(chalk.blue('\n📝 Creating .env.production.template with missing variables...'));
    
    const template = `# Production Environment Variables Template
# Generated on ${new Date().toISOString()}
# Copy this to .env.production and fill in the values

${result.missing.map(key => `${key}=`).join('\n')}
`;

    require('fs').writeFileSync('.env.production.template', template);
    console.log(chalk.green('✅ Template created at .env.production.template'));
  }
}

// Run verification
const result = checkEnvironment();
createEnvTemplate(result);

// Exit with error code if invalid
process.exit(result.valid ? 0 : 1);