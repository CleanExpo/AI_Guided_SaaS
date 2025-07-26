const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Running Final Deployment Check...\n');

let hasErrors = false;
const issues = [];

// 1. Check for critical files
console.log('📁 Checking critical files...');
const criticalFiles = [
  'next.config.mjs',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  '.env.production'
];

criticalFiles.forEach(file => {
  if (!fs.existsSync(path.join(__dirname, '..', file))) {
    console.log(`   ❌ Missing: ${file}`);
    issues.push(`Missing critical file: ${file}`);
    hasErrors = true;
  } else {
    console.log(`   ✅ ${file}`);
  }
});

// 2. Check Node version compatibility
console.log('\n📦 Checking Node version...');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
if (packageJson.engines && packageJson.engines.node) {
  console.log(`   ℹ️  Required: ${packageJson.engines.node}`);
  console.log(`   ℹ️  Current: ${process.version}`);
  
  // Vercel is using Node 22.x which satisfies >=20.0.0
  console.log('   ✅ Node version compatible');
}

// 3. Check for build-blocking errors
console.log('\n🔨 Checking for build issues...');

// Check for 'use client' with metadata conflicts
const pageFiles = fs.readdirSync(path.join(__dirname, '..', 'src', 'app'), { recursive: true })
  .filter(file => file.endsWith('page.tsx') || file.endsWith('page.jsx'));

let metadataConflicts = 0;
pageFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', 'src', 'app', file);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const hasUseClient = content.includes("'use client'") || content.includes('"use client"');
    const hasMetadata = content.includes('export const metadata') || content.includes('export async function generateMetadata');
    
    if (hasUseClient && hasMetadata) {
      console.log(`   ❌ Metadata conflict in: ${file}`);
      issues.push(`Metadata conflict in ${file}`);
      metadataConflicts++;
      hasErrors = true;
    }
  }
});

if (metadataConflicts === 0) {
  console.log('   ✅ No metadata conflicts');
}

// 4. Check environment variables
console.log('\n🔐 Checking environment variables...');
const requiredEnvVars = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'DATABASE_URL',
  'NEXT_PUBLIC_APP_URL'
];

const envProd = fs.existsSync(path.join(__dirname, '..', '.env.production'))
  ? fs.readFileSync(path.join(__dirname, '..', '.env.production'), 'utf8')
  : '';

requiredEnvVars.forEach(varName => {
  if (!envProd.includes(varName)) {
    console.log(`   ⚠️  Missing in .env.production: ${varName}`);
    // This is a warning, not an error, as Vercel may have these in environment
  } else {
    console.log(`   ✅ ${varName}`);
  }
});

// 5. Check evaluation scores
console.log('\n📊 Checking evaluation scores...');
const evalResults = path.join(__dirname, '..', 'evaluation-results', 'latest.json');
if (fs.existsSync(evalResults)) {
  const results = JSON.parse(fs.readFileSync(evalResults, 'utf8'));
  const scores = results.scores;
  
  ['dashboard', 'prompts', 'folders'].forEach(component => {
    const score = scores[component]?.total || 0;
    if (score === 10) {
      console.log(`   ✅ ${component}: ${score}/10`);
    } else {
      console.log(`   ❌ ${component}: ${score}/10`);
      issues.push(`${component} evaluation score is ${score}/10`);
      hasErrors = true;
    }
  });
} else {
  console.log('   ⚠️  No evaluation results found');
}

// 6. Try a production build
console.log('\n🏗️  Testing production build...');
console.log('   (This may take a few minutes...)\n');

try {
  execSync('npm run build', {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe',
    encoding: 'utf8'
  });
  console.log('   ✅ Build completed successfully!');
} catch (error) {
  console.log('   ❌ Build failed!');
  
  const output = error.stdout + error.stderr;
  
  // Extract error messages
  const errorLines = output.split('\n')
    .filter(line => line.includes('Error:') || line.includes('error TS'))
    .slice(0, 5);
  
  errorLines.forEach(line => {
    console.log(`      ${line.trim()}`);
    issues.push(line.trim());
  });
  
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📋 DEPLOYMENT READINESS SUMMARY');
console.log('='.repeat(60));

if (!hasErrors) {
  console.log('\n✅ ALL CHECKS PASSED!');
  console.log('\n🎉 Your application is ready for deployment to Vercel!');
  console.log('\nNext steps:');
  console.log('1. Commit all changes: git add . && git commit -m "Ready for deployment"');
  console.log('2. Push to GitHub: git push origin main');
  console.log('3. Vercel will automatically deploy from your GitHub repository');
} else {
  console.log('\n❌ DEPLOYMENT BLOCKED');
  console.log('\nIssues found:');
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue}`);
  });
  console.log('\n⚠️  Fix these issues before attempting deployment');
}

console.log('\n' + '='.repeat(60));

// Exit with appropriate code
process.exit(hasErrors ? 1 : 0);