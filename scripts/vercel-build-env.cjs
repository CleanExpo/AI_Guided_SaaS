/**
 * Vercel Build Environment Setup
 * Ensures environment variables are properly loaded during Vercel builds
 */

const fs = require('fs');
const path = require('path');

function setupVercelEnvironment() {
  console.log('🔧 Setting up Vercel build environment...');

  // Check if running in Vercel
  if (process.env.VERCEL) {
    console.log('✅ Running in Vercel environment');
    
    // Log available environment variables (without values for security)
    const envVars = Object.keys(process.env).filter(key => 
      key.startsWith('NEXT_') || 
      key.includes('DATABASE') || 
      key.includes('AUTH') ||
      key.includes('API_KEY') ||
      key.includes('SUPABASE') ||
      key.includes('REDIS') ||
      key.includes('SENTRY')
    );

    console.log('\n📋 Available environment variables:');
    envVars.forEach(key => {
      const value = process.env[key];
      const display = value && value.length > 0 ? '✓ Set' : '✗ Not set';
      console.log(`   ${key}: ${display}`);
    });

    // Validate required variables
    const required = [
      'DATABASE_URL',
      'NEXTAUTH_URL', 
      'NEXTAUTH_SECRET'
    ];

    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.error('\n❌ Missing required environment variables:');
      missing.forEach(key => console.error(`   - ${key}`));
      console.error('\n⚠️  Build may fail or app may not function properly');
    } else {
      console.log('\n✅ All required environment variables are set');
    }

    // Check for AI provider
    if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
      console.warn('\n⚠️  No AI provider API key found');
      console.warn('   AI features will not work without OPENAI_API_KEY or ANTHROPIC_API_KEY');
    }

    // Create a runtime config file for client-side env vars
    const publicEnvVars = {};
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('NEXT_PUBLIC_')) {
        publicEnvVars[key] = process.env[key];
      }
    });

    const runtimeConfig = `
// Auto-generated runtime configuration
// Generated at build time by vercel-build-env.js
export const runtimeConfig = ${JSON.stringify(publicEnvVars, null, 2)};
`;

    try {
      const configPath = path.join(process.cwd(), 'src/lib/runtime-config.ts');
      fs.writeFileSync(configPath, runtimeConfig);
      console.log('\n✅ Created runtime configuration for public environment variables');
    } catch (error) {
      console.warn('\n⚠️  Could not create runtime config:', error.message);
    }

  } else {
    console.log('📍 Not running in Vercel environment');
    console.log('   Use "npm run sync:env" to pull variables from Vercel');
  }
}

// Run setup
setupVercelEnvironment();