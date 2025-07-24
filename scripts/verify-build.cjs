const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying build environment...\n');

// Check Node version
const nodeVersion = process.version;
console.log(`Node version: ${nodeVersion}`);
if (!nodeVersion.startsWith('v20')) {
  console.warn('⚠️  Warning: Project requires Node v20, but found', nodeVersion);
}

// Check if UI components exist
const uiComponents = ['button', 'card', 'input', 'tabs'];
const uiPath = path.join(__dirname, '..', 'src', 'components', 'ui');

console.log('\n📁 Checking UI components:');
for (const component of uiComponents) {
  const componentPath = path.join(uiPath, `${component}.tsx`);
  const exists = fs.existsSync(componentPath);
  console.log(`  ${exists ? '✅' : '❌'} ${component}.tsx`);
}

// Check if AgentPulseMonitor exists
const agentMonitorPath = path.join(__dirname, '..', 'src', 'components', 'AgentPulseMonitor.tsx');
const agentMonitorExists = fs.existsSync(agentMonitorPath);
console.log(`\n📁 AgentPulseMonitor.tsx: ${agentMonitorExists ? '✅ exists' : '❌ missing'}`);

// Check tsconfig paths
console.log('\n⚙️  TypeScript configuration:');
const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  console.log('  Paths configured:', JSON.stringify(tsconfig.compilerOptions.paths, null, 2));
}

// Try to run build
console.log('\n🏗️  Running build test...');
try {
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('\n✅ Build completed successfully!');
} catch (error) {
  console.error('\n❌ Build failed. See errors above.');
  process.exit(1);
}