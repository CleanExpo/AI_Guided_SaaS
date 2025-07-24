#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 AI Guided SaaS - Starter Pack Optimization\n');
console.log('This script will clean and optimize the codebase for The-Starter-Pack repository.\n');

const steps = [
  {
    name: 'Fix Syntax Errors',
    command: 'npm run fix:syntax',
    description: 'Fixing common syntax errors in TypeScript files'
  },
  {
    name: 'Remove Console Logs',
    command: null,
    custom: removeConsoleLogs,
    description: 'Removing console.log statements from production code'
  },
  {
    name: 'Clean Dependencies',
    command: 'npm run clean:deps',
    description: 'Removing unused dependencies'
  },
  {
    name: 'Fix Remaining TypeScript Errors',
    command: 'npm run fix:typescript',
    description: 'Attempting to fix remaining TypeScript errors'
  },
  {
    name: 'Format Code',
    command: 'npm run fix:prettier',
    description: 'Formatting code with Prettier'
  },
  {
    name: 'Build Test',
    command: 'npm run build',
    description: 'Testing production build'
  }
];

let currentStep = 0;

function removeConsoleLogs() {
  console.log('🔍 Finding and removing console.log statements...');
  
  const files = require('glob').sync('src/**/*.{ts,tsx}', {
    ignore: ['**/node_modules/**', '**/*.test.*', '**/*.spec.*']
  });
  
  let totalRemoved = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const newContent = content
      .replace(/console\.(log|warn|error|info|debug)\([^)]*\);?\s*/g, '')
      .replace(/console\.(log|warn|error|info|debug)\([^}]*\};?\s*\);?\s*/g, '');
    
    if (content !== newContent) {
      fs.writeFileSync(file, newContent);
      const removed = (content.match(/console\./g) || []).length;
      totalRemoved += removed;
      console.log(`  ✅ Removed ${removed} console statements from ${path.relative(process.cwd(), file)}`);
    }
  });
  
  console.log(`\n  Total console statements removed: ${totalRemoved}\n`);
}

async function runStep(step) {
  currentStep++;
  console.log(`\n📋 Step ${currentStep}/${steps.length}: ${step.name}`);
  console.log(`   ${step.description}\n`);
  
  try {
    if (step.command) {
      execSync(step.command, { stdio: 'inherit' });
    } else if (step.custom) {
      step.custom();
    }
    console.log(`\n✅ ${step.name} completed successfully!`);
    return true;
  } catch (error) {
    console.error(`\n❌ ${step.name} failed. Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('Starting optimization process...\n');
  
  const results = [];
  
  for (const step of steps) {
    const success = await runStep(step);
    results.push({ step: step.name, success });
    
    if (!success && step.name === 'Build Test') {
      console.log('\n⚠️  Build failed, but this is expected with existing TypeScript errors.');
      console.log('The codebase is now cleaner and ready for manual fixes.');
    }
  }
  
  console.log('\n\n📊 Optimization Summary:');
  console.log('=======================\n');
  
  results.forEach(({ step, success }) => {
    console.log(`${success ? '✅' : '❌'} ${step}`);
  });
  
  console.log('\n\n🎯 Next Steps:');
  console.log('1. Review and fix remaining TypeScript errors');
  console.log('2. Test the application locally');
  console.log('3. Update documentation');
  console.log('4. Push to The-Starter-Pack repository');
  
  console.log('\n✨ Optimization process complete!');
}

// Run the optimization
main().catch(console.error);