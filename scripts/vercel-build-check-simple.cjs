#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔍 Vercel Build Check - Detecting all errors before deployment\n');

let hasErrors = false;
const results = [];

// Check TypeScript
console.log('1. Running TypeScript check...');
try {
  const output = execSync('npm run typecheck 2>&1', { encoding: 'utf8' });
  console.log('✅ TypeScript: No errors\n');
  results.push({ check: 'TypeScript', status: 'PASS', errors: 0 });
} catch (error) {
  const output = error.stdout || error.message;
  const errorCount = (output.match(/error TS/g) || []).length;
  console.log(`❌ TypeScript: ${errorCount} errors found\n`);
  console.log('First few errors:');
  const lines = output.split('\n').slice(0, 10);
  lines.forEach(line => console.log('  ', line));
  console.log('...\n');
  results.push({ check: 'TypeScript', status: 'FAIL', errors: errorCount });
  hasErrors = true;
}

// Check Build
console.log('2. Running Next.js build...');
try {
  const output = execSync('npm run build 2>&1', { 
    encoding: 'utf8',
    env: { ...process.env, SKIP_ENV_VALIDATION: 'true' }
  });
  console.log('✅ Build: Successful\n');
  results.push({ check: 'Build', status: 'PASS', errors: 0 });
} catch (error) {
  const output = error.stdout || error.message;
  const errorMatches = output.match(/Error:|SyntaxError:|TypeError:/g) || [];
  console.log(`❌ Build: Failed with ${errorMatches.length} errors\n`);
  
  // Extract specific errors
  const lines = output.split('\n');
  let showingErrors = false;
  for (let i = 0; i < lines.length && i < 50; i++) {
    if (lines[i].includes('Error:') || lines[i].includes('SyntaxError:')) {
      showingErrors = true;
    }
    if (showingErrors && lines[i].trim()) {
      console.log('  ', lines[i]);
    }
  }
  console.log('...\n');
  
  results.push({ check: 'Build', status: 'FAIL', errors: errorMatches.length });
  hasErrors = true;
}

// Summary
console.log('\n📊 Build Check Summary');
console.log('======================');
results.forEach(result => {
  const status = result.status === 'PASS' ? '✅' : '❌';
  console.log(`${status} ${result.check}: ${result.status} ${result.errors > 0 ? `(${result.errors} errors)` : ''}`);
});

if (hasErrors) {
  console.log('\n❌ Build has errors - Fix these before deploying to Vercel');
  console.log('\nTo fix errors automatically, run:');
  console.log('  npm run build-doctor fix');
  process.exit(1);
} else {
  console.log('\n✅ All checks passed - Ready to deploy to Vercel!');
  console.log('\nDeploy with: vercel --prod');
  process.exit(0);
}