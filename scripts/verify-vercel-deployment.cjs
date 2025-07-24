const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Vercel Deployment Readiness...\n');

const issues = [];
const warnings = [];

// 1. Check Node version
console.log('1️⃣ Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion < 20) {
  warnings.push(`Node.js ${nodeVersion} detected. Vercel recommends v20+`);
} else {
  console.log('✅ Node.js version OK');
}

// 2. Check package.json
console.log('\n2️⃣ Checking package.json...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Check for conflicting dependencies
if (packageJson.devDependencies['eslint'] && packageJson.devDependencies['eslint-config-next']) {
  const eslintVersion = packageJson.devDependencies['eslint'];
  const eslintConfigNextVersion = packageJson.devDependencies['eslint-config-next'];
  console.log(`   ESLint: ${eslintVersion}`);
  console.log(`   ESLint Config Next: ${eslintConfigNextVersion}`);
  
  // Check if versions are compatible
  if (eslintVersion.includes('9.') && eslintConfigNextVersion.includes('14.')) {
    issues.push('ESLint v9 is incompatible with eslint-config-next v14');
  } else {
    console.log('✅ ESLint versions compatible');
  }
}

// 3. Check for .npmrc
console.log('\n3️⃣ Checking .npmrc...');
if (fs.existsSync('.npmrc')) {
  const npmrcContent = fs.readFileSync('.npmrc', 'utf8');
  console.log('✅ .npmrc found with content:');
  console.log('   ' + npmrcContent.split('\n').join('\n   '));
} else {
  warnings.push('.npmrc not found - may have peer dependency issues');
}

// 4. Test npm install
console.log('\n4️⃣ Testing npm install...');
try {
  execSync('npm install --dry-run', { stdio: 'pipe' });
  console.log('✅ npm install test passed');
} catch (error) {
  if (error.message.includes('ERESOLVE')) {
    issues.push('npm install has dependency resolution errors');
  }
}

// 5. Check for required environment files
console.log('\n5️⃣ Checking environment setup...');
const envExample = '.env.example';
const envLocal = '.env.local';

if (fs.existsSync(envExample)) {
  console.log('✅ .env.example found');
} else {
  warnings.push('.env.example not found - Vercel needs environment variable references');
}

// 6. Check build command
console.log('\n6️⃣ Checking build configuration...');
if (packageJson.scripts && packageJson.scripts.build) {
  console.log(`✅ Build command: ${packageJson.scripts.build}`);
} else {
  issues.push('No build script found in package.json');
}

// 7. Check for Vercel configuration
console.log('\n7️⃣ Checking Vercel configuration...');
if (fs.existsSync('vercel.json')) {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  console.log('✅ vercel.json found');
  if (vercelConfig.installCommand) {
    console.log(`   Custom install command: ${vercelConfig.installCommand}`);
  }
} else {
  console.log('ℹ️  No vercel.json found (using defaults)');
}

// Summary
console.log('\n📋 DEPLOYMENT READINESS SUMMARY:');
console.log('================================');

if (issues.length === 0) {
  console.log('✅ No critical issues found!');
} else {
  console.log(`❌ Found ${issues.length} critical issue(s):`);
  issues.forEach((issue, i) => {
    console.log(`   ${i + 1}. ${issue}`);
  });
}

if (warnings.length > 0) {
  console.log(`\n⚠️  Found ${warnings.length} warning(s):`);
  warnings.forEach((warning, i) => {
    console.log(`   ${i + 1}. ${warning}`);
  });
}

// Recommendations
console.log('\n💡 RECOMMENDATIONS:');
console.log('==================');
console.log('1. Ensure all environment variables are set in Vercel dashboard');
console.log('2. Use Node.js 20.x in Vercel (Settings > General > Node.js Version)');
console.log('3. If deployment fails, add to vercel.json:');
console.log('   {');
console.log('     "installCommand": "npm install --legacy-peer-deps"');
console.log('   }');

process.exit(issues.length > 0 ? 1 : 0);