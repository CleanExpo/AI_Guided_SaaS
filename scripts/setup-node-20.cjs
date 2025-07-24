#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Node.js v20 for the project...\n');

try {
  // Check current Node version
  const currentVersion = execSync('node -v', { encoding: 'utf8' }).trim();
  console.log(`Current Node version: ${currentVersion}`);
  
  if (!currentVersion.startsWith('v20')) {
    console.log('⚠️  Node v20 not active. Switching...');
    
    // Try to use Node v20
    try {
      execSync('nvm use 20.19.4', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Failed to switch to Node v20');
      console.log('💡 Please run: nvm install 20.19.4');
      process.exit(1);
    }
  }
  
  // Create/update .nvmrc
  fs.writeFileSync(path.join(process.cwd(), '.nvmrc'), '20.19.4\n');
  console.log('✅ Created .nvmrc file');
  
  // Update npm
  console.log('\n📦 Updating npm to latest version...');
  execSync('npm install -g npm@latest', { stdio: 'inherit' });
  
  // Clean install dependencies
  console.log('\n🧹 Cleaning node_modules...');
  if (fs.existsSync('node_modules')) {
    fs.rmSync('node_modules', { recursive: true, force: true });
  }
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
  }
  
  console.log('\n📥 Installing dependencies with Node v20...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n✅ Setup complete! Node v20 is now configured for this project.');
  console.log('\n💡 To use Node v20 in new terminals:');
  console.log('   - Run: nvm use');
  console.log('   - Or: nvm use 20.19.4');
  console.log('   - Or: use the use-node-20.bat file');
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}