#!/usr/bin/env node

/**
 * VERCEL BUILD VALIDATOR
 * Validates that all SSR issues are resolved before deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDATING VERCEL BUILD COMPATIBILITY...\n');

const checks = [
  {
    name: 'SSR Guard Utility',
    path: 'src/lib/ssr-guard.tsx',
    required: true
  },
  {
    name: 'Client-Only Auth Wrapper',
    path: 'src/components/ClientOnlyAuth.tsx',
    required: true
  },
  {
    name: 'Next.js Config SSR Protection',
    path: 'next.config.js',
    required: true,
    validate: (content) => content.includes('swcMinify: false')
  },
  {
    name: 'Main Page Dynamic Import',
    path: 'src/app/page.tsx',
    required: true,
    validate: (content) => content.includes('dynamic(') && content.includes('ssr: false')
  }
];

let allPassed = true;

checks.forEach(check => {
  const exists = fs.existsSync(check.path);
  
  if (!exists && check.required) {
    console.log(`❌ MISSING: ${check.name} at ${check.path}`);
    allPassed = false;
    return;
  }
  
  if (exists && check.validate) {
    const content = fs.readFileSync(check.path, 'utf8');
    if (!check.validate(content)) {
      console.log(`❌ INVALID: ${check.name} at ${check.path}`);
      allPassed = false;
      return;
    }
  }
  
  console.log(`✅ VALID: ${check.name}`);
});

if (allPassed) {
  console.log('\n🎉 ALL VERCEL SSR CHECKS PASSED!');
  console.log('\n📦 Ready for Vercel deployment');
  process.exit(0);
} else {
  console.log('\n💥 VERCEL SSR VALIDATION FAILED!');
  console.log('Run the fix script again to resolve issues.');
  process.exit(1);
}
