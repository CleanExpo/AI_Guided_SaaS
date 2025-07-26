const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Running aggressive syntax fix...\n');

// Run the existing fix scripts first
const fixScripts = [
  'scripts/fix-syntax.cjs',
  'scripts/fix-syntax-v2.cjs',
  'scripts/syntax-surgeon.cjs',
  'scripts/syntax-surgeon-v2.cjs'
];

fixScripts.forEach(script => {
  const scriptPath = path.join(__dirname, '..', script);
  if (fs.existsSync(scriptPath)) {
    console.log(`Running ${script}...`);
    try {
      execSync(`node ${script}`, { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    } catch (e) {
      console.log(`Warning: ${script} had issues but continuing...`);
    }
  }
});

// Now run our comprehensive fix
console.log('\n🚀 Running comprehensive syntax fixes...\n');

try {
  execSync('npm run fix:syntax', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
} catch (e) {
  console.log('Continuing after fix:syntax...');
}

try {
  execSync('npm run fix:syntax:v2', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
} catch (e) {
  console.log('Continuing after fix:syntax:v2...');
}

// Check health again
console.log('\n📊 Checking health after fixes...\n');
try {
  execSync('npm run health:simple', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
} catch (e) {
  console.log('Health check completed with issues');
}

console.log('\n✅ Aggressive syntax fix complete!');