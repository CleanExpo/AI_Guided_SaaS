#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

console.log(chalk.blue('🔍 Vercel Build Check - Detecting all errors before deployment\n'));

let hasErrors = false;
const errors = {
  typescript: [],
  eslint: [],
  build: []
};

// Check TypeScript
console.log(chalk.yellow('1. Running TypeScript check...'));
try {
  execSync('npm run typecheck', { stdio: 'inherit' });
  console.log(chalk.green('✅ TypeScript: No errors\n'));
} catch (error) {
  console.log(chalk.red('❌ TypeScript: Errors found\n'));
  hasErrors = true;
}

// Check ESLint
console.log(chalk.yellow('2. Running ESLint...'));
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log(chalk.green('✅ ESLint: No errors\n'));
} catch (error) {
  console.log(chalk.red('❌ ESLint: Errors found\n'));
  hasErrors = true;
}

// Check Build
console.log(chalk.yellow('3. Running Next.js build...'));
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log(chalk.green('✅ Build: Successful\n'));
} catch (error) {
  console.log(chalk.red('❌ Build: Failed\n'));
  hasErrors = true;
}

// Summary
console.log(chalk.blue('\n📊 Build Check Summary'));
console.log(chalk.blue('======================'));

if (hasErrors) {
  console.log(chalk.red('❌ Build has errors - Fix these before deploying to Vercel'));
  console.log(chalk.yellow('\nSuggested next steps:'));
  console.log('1. Run "npm run build-doctor fix" to auto-fix syntax errors');
  console.log('2. Run "npm run fix:typescript" for TypeScript errors');
  console.log('3. Run "npm run lint:fix" for ESLint errors');
  console.log('4. Check the error output above for specific issues');
  process.exit(1);
} else {
  console.log(chalk.green('✅ All checks passed - Ready to deploy to Vercel!'));
  console.log(chalk.yellow('\nDeploy with: vercel --prod'));
  process.exit(0);
}