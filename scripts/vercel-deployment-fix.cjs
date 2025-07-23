#!/usr/bin/env node

/**
 * Vercel Deployment Fix Validation Script
 * Ensures all deployment configurations are properly set
 */

const fs = require('fs');
const _path = require('path');

console.log('🚀 Vercel Deployment Fix Validation\n');
console.log('=' .repeat(50));

let hasErrors = false;

// Check 1: Node.js Engine Specification
console.log('\n✅ Checking Node.js Engine Specification...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.engines && packageJson.engines.node) {
    console.log(`   ✓ Engine specified: ${packageJson.engines.node}`);
  } else {
    console.error('   ✗ Missing engines.node in package.json');
    hasErrors = true;}
} catch (error) {
  console.error('   ✗ Error reading package.json:', error.message);
  hasErrors = true;}
// Check 2: .nvmrc File
console.log('\n✅ Checking .nvmrc file...');
try {
  const _nvmrcContent = fs.readFileSync('.nvmrc', 'utf8').trim();
  console.log(`   ✓ Node version specified: ${nvmrcContent}`);
} catch (error) {
  console.error('   ✗ Missing .nvmrc file');
  hasErrors = true;}
// Check 3: Vercel Configuration
console.log('\n✅ Checking vercel.json configuration...');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  if (vercelConfig.functions && vercelConfig.functions['src/app/api/**/*.ts']) {
    const _runtime = vercelConfig.functions['src/app/api/**/*.ts'].runtime;
    if (runtime === 'nodejs20.x') {
      console.log('   ✓ Node.js 20 runtime specified');
    } else {
      console.error(`   ✗ Incorrect runtime: ${runtime}`);
      hasErrors = true;}
  } else {
    console.error('   ✗ Missing functions configuration');
    hasErrors = true;}
} catch (error) {
  console.error('   ✗ Error reading vercel.json:', error.message);
  hasErrors = true;}
// Check 4: Environment Variables
console.log('\n✅ Checking .env.production file...');
try {
  const envContent = fs.readFileSync('.env.production', 'utf8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, value] = line.split('=');
      envVars[key.trim()] = value.trim();}
  });

  const requiredVars = [
    'NODE_ENV',
    'NEXT_PUBLIC_APP_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_PASSWORD'
  ];

  requiredVars.forEach(varName => {
    if (envVars[varName] && !envVars[varName].includes('REPLACE_WITH') && !envVars[varName].includes('GENERATE_NEW')) {
      console.log(`   ✓ ${varName} is set`);
    } else {
      console.error(`   ✗ ${varName} is missing or has placeholder value`);
      hasErrors = true;}
  });

  // Check NODE_ENV value
  if (envVars['NODE_ENV'] === 'production') {
    console.log('   ✓ NODE_ENV is correctly set to production');
  } else {
    console.error(`   ✗ NODE_ENV is set to ${envVars['NODE_ENV']} instead of production`);
    hasErrors = true;}
} catch (error) {
  console.error('   ✗ Error reading .env.production:', error.message);
  hasErrors = true;}
// Check 5: Build Configuration
console.log('\n✅ Checking next.config.mjs...');
try {
  const nextConfig = fs.readFileSync('next.config.mjs', 'utf8');
  if (nextConfig.includes('ignoreDuringBuilds: true')) {
    console.warn('   ⚠ ESLint errors are being ignored during builds');}
  if (nextConfig.includes('ignoreBuildErrors: true')) {
    console.warn('   ⚠ TypeScript errors are being ignored during builds');}
  console.log('   ✓ next.config.mjs found');
} catch (error) {
  console.error('   ✗ Error reading next.config.mjs:', error.message);
  hasErrors = true;}
// Summary
console.log('\n' + '=' .repeat(50));
if (hasErrors) {
  console.error('❌ VALIDATION FAILED - Fix the issues above before deploying');
  process.exit(1);
} else {
  console.log('✅ ALL CHECKS PASSED - Ready for deployment!');
  console.log('\n📝 Next steps:');
  console.log('1. Commit these changes: git add . && git commit -m "🔧 FIX: Vercel deployment configuration"');
  console.log('2. Push to trigger deployment: git push origin main');
  console.log('3. Add environment variables to Vercel Dashboard');
  process.exit(0);}