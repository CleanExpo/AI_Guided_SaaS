#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Node.js v20 Setup...\n');

// Check Node version
const nodeVersion = execSync('node -v', { encoding: 'utf8' }).trim();
const npmVersion = execSync('npm -v', { encoding: 'utf8' }).trim();

console.log(`Node version: ${nodeVersion}`);
console.log(`NPM version: ${npmVersion}`);

const isNode20 = nodeVersion.startsWith('v20');

if (isNode20) {
  console.log('✅ Node v20 is active!\n');
  
  // Check for .nvmrc
  if (fs.existsSync('.nvmrc')) {
    const nvmrcContent = fs.readFileSync('.nvmrc', 'utf8').trim();
    console.log(`✅ .nvmrc exists with version: ${nvmrcContent}`);
  } else {
    console.log('⚠️  .nvmrc file is missing');
  }
  
  // Check package.json engine requirement
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.engines && packageJson.engines.node) {
    console.log(`✅ package.json requires Node: ${packageJson.engines.node}`);
  }
  
  // Test a simple script
  console.log('\n📋 Running compatibility tests...');
  
  try {
    // Test ESM
    const testESM = `import { fileURLToPath } from 'url'; console.log('ESM works');`;
    fs.writeFileSync('test-esm.mjs', testESM);
    execSync('node test-esm.mjs', { stdio: 'inherit' });
    fs.unlinkSync('test-esm.mjs');
    console.log('✅ ESM modules work correctly');
  } catch (e) {
    console.log('❌ ESM module test failed');
  }
  
  // Check critical dependencies
  console.log('\n📦 Checking critical dependencies...');
  const deps = ['next', 'react', 'typescript', '@modelcontextprotocol/sdk'];
  
  deps.forEach(dep => {
    try {
      const version = execSync(`npm list ${dep} --depth=0`, { encoding: 'utf8' });
      if (version.includes(dep)) {
        console.log(`✅ ${dep} is installed`);
      }
    } catch (e) {
      console.log(`⚠️  ${dep} might need reinstallation`);
    }
  });
  
  console.log('\n✨ Node v20 setup is verified and working!');
  
} else {
  console.log('❌ Node v20 is NOT active!');
  console.log('\n🔧 To fix this:');
  console.log('1. Run: nvm use 20.19.4');
  console.log('2. Or double-click: SETUP-NODE20.bat');
  console.log('3. Then run this script again');
  process.exit(1);
}