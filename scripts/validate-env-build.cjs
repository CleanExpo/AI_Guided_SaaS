#!/usr/bin/env node

/**
 * Build-time environment validation
 * Ensures correct URLs are configured before deployment
 */

const EXPECTED_URL = 'https://ai-guided-saa-s.vercel.app';

console.log('🔍 Validating environment configuration...\n');

// Check critical environment variables
const envVars = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  APP_URL: process.env.APP_URL,
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
};

console.log('Environment Variables:');
Object.entries(envVars).forEach(([key, value]) => {
  console.log(`${key}: ${value || 'NOT SET'}`);
});

let hasErrors = false;

// Validate URLs
['NEXTAUTH_URL', 'NEXT_PUBLIC_APP_URL', 'APP_URL'].forEach(key => {
  const value = envVars[key];
  if (!value) {
    console.error(`❌ ${key} is not set!`);
    hasErrors = true;
  } else if (value.includes('steel')) {
    console.error(`❌ ${key} contains old 'steel' URL: ${value}`);
    console.error(`   Should be: ${EXPECTED_URL}`);
    hasErrors = true;
  } else if (value !== EXPECTED_URL && key !== 'APP_URL') {
    console.warn(`⚠️  ${key} might be incorrect: ${value}`);
    console.warn(`   Expected: ${EXPECTED_URL}`);
  } else {
    console.log(`✅ ${key} is correct`);
  }
});

// Special handling for Vercel deployments
if (process.env.VERCEL) {
  console.log('\n📦 Running on Vercel');
  
  // If VERCEL_URL is set, ensure other URLs match
  if (process.env.VERCEL_URL) {
    const vercelUrl = `https://${process.env.VERCEL_URL}`;
    console.log(`Vercel URL: ${vercelUrl}`);
    
    // For production deployments, URLs should match EXPECTED_URL
    if (process.env.VERCEL_ENV === 'production' && !vercelUrl.includes('ai-guided-saa-s.vercel.app')) {
      console.warn('⚠️  Production deployment but URL doesn\'t match expected domain');
    }
  }
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.error('❌ Environment validation FAILED!');
  console.error('\nPlease update the following in Vercel Dashboard:');
  console.error('1. Go to Settings → Environment Variables');
  console.error('2. Set all URLs to: ' + EXPECTED_URL);
  console.error('3. Redeploy the application\n');
  process.exit(1);
} else {
  console.log('✅ Environment validation PASSED!');
  console.log('Admin routes should work correctly.\n');
}