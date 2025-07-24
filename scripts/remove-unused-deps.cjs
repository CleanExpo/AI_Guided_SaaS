#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🧹 Removing unused dependencies...\n');

// List of unused dependencies identified in the analysis
const unusedDeps = [
  // AI/ML packages not actively used
  '@anthropic-ai/sdk',
  'openai',
  
  // Payment/Commerce not implemented
  'stripe',
  '@types/stripe',
  
  // Database/Cache not used
  'redis',
  '@types/redis',
  
  // Data generation not needed in production
  '@faker-js/faker',
  
  // State management replaced
  'zustand',
  
  // Unused UI components (many Radix UI components)
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-navigation-menu',
  '@radix-ui/react-progress',
  '@radix-ui/react-radio-group',
  '@radix-ui/react-scroll-area',
  '@radix-ui/react-separator',
  '@radix-ui/react-switch',
  '@radix-ui/react-toast',
  
  // Testing libraries not configured
  'jest',
  '@types/jest',
  'jest-environment-jsdom',
  '@testing-library/jest-dom',
  '@testing-library/react',
  '@testing-library/user-event',
  'ts-jest',
  
  // Build tools not used
  'esbuild',
  
  // Analytics not implemented
  '@vercel/analytics',
  
  // Auth adapters not used
  '@next-auth/supabase-adapter',
  
  // File handling not used
  'jszip',
  'file-saver',
  '@types/file-saver',
  
  // Animation library not used
  'lottie-react',
  
  // Markdown processing not used
  'gray-matter',
  'marked',
  'react-markdown',
  
  // Syntax highlighting not used
  'react-syntax-highlighter',
  '@types/react-syntax-highlighter',
  
  // Other unused
  'bcryptjs',
  '@types/bcryptjs',
  'jsonwebtoken',
  '@types/jsonwebtoken',
  'uuid',
  '@types/uuid',
  'commander',
  'web-vitals',
  'winston',
  '@types/winston',
  '@lhci/cli',
  '@commitlint/cli',
  '@commitlint/config-conventional',
  'playwright',
  '@playwright/test',
  'axios',
  'chalk',
  'glob',
  'ora',
  'ajv',
  '@types/inquirer'
];

let removedCount = 0;
let failedCount = 0;

console.log(`Found ${unusedDeps.length} unused dependencies to remove.\n`);

// Remove each dependency
unusedDeps.forEach((dep, index) => {
  try {
    process.stdout.write(`[${index + 1}/${unusedDeps.length}] Removing ${dep}...`);
    execSync(`npm uninstall ${dep}`, { stdio: 'pipe' });
    console.log(' ✅');
    removedCount++;
  } catch (error) {
    console.log(' ❌ (not installed or error)');
    failedCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`✅ Successfully removed: ${removedCount} packages`);
console.log(`⚠️  Skipped/Failed: ${failedCount} packages`);

// Clean up
console.log('\n🧹 Running npm dedupe...');
try {
  execSync('npm dedupe', { stdio: 'inherit' });
  console.log('✅ Deduplication complete');
} catch (e) {
  console.log('⚠️  Deduplication had warnings');
}

console.log('\n✨ Dependency cleanup complete!');
console.log('Run "npm list" to see the cleaned dependency tree.');