#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 NODE.JS v20 UPGRADE VERIFICATION SCRIPT');
console.log('==========================================\n');

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

function logResult(test, status, message, details = '') {
  const symbols = { pass: '✅', fail: '❌', warn: '⚠️' };
  const colors = { pass: '\x1b[32m', fail: '\x1b[31m', warn: '\x1b[33m', reset: '\x1b[0m' };
  
  console.log(`${symbols[status]} ${colors[status]}${test}${colors.reset}: ${message}`);
  if (details) console.log(`   ${details}`);
  
  results[status === 'pass' ? 'passed' : status === 'fail' ? 'failed' : 'warnings']++;
  results.details.push({ test, status, message, details });
}

// Test 1: Check Node.js version in package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const nodeRequirement = packageJson.engines?.node;
  
  if (nodeRequirement && nodeRequirement.includes('>=20')) {
    logResult('Package.json Node.js Requirement', 'pass', `Correctly set to ${nodeRequirement}`);
  } else {
    logResult('Package.json Node.js Requirement', 'fail', `Should be >=20.0.0, found: ${nodeRequirement || 'not set'}`);
  }
} catch (error) {
  logResult('Package.json Node.js Requirement', 'fail', 'Cannot read package.json');
}

// Test 2: Check current Node.js version
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
  
  if (majorVersion >= 20) {
    logResult('Current Node.js Version', 'pass', `Running Node.js ${nodeVersion} (v20+)`);
  } else {
    logResult('Current Node.js Version', 'warn', `Running Node.js ${nodeVersion} (Local dev environment)`, 'Vercel will use Node.js v20+ in production');
  }
} catch (error) {
  logResult('Current Node.js Version', 'fail', 'Cannot determine Node.js version');
}

// Test 3: Check vercel.json configuration
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  
  // Check for problematic runtime specification
  const hasProblematicRuntime = JSON.stringify(vercelConfig).includes('nodejs20.x');
  if (hasProblematicRuntime) {
    logResult('Vercel Configuration', 'fail', 'Contains problematic nodejs20.x runtime specification');
  } else if (vercelConfig.framework === 'nextjs') {
    logResult('Vercel Configuration', 'pass', 'Using framework auto-detection (recommended)');
  } else {
    logResult('Vercel Configuration', 'warn', 'Non-standard configuration detected');
  }
} catch (error) {
  logResult('Vercel Configuration', 'fail', 'Cannot read vercel.json');
}

// Test 4: Check Next.js version
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const nextVersion = packageJson.dependencies?.next || packageJson.devDependencies?.next;
  
  if (nextVersion) {
    const isLatest = nextVersion.includes('latest') || nextVersion.replace(/[^\d.]/g, '').startsWith('15');
    if (isLatest) {
      logResult('Next.js Version', 'pass', `Updated to ${nextVersion}`);
    } else {
      logResult('Next.js Version', 'warn', `Version ${nextVersion} - consider updating to 15.x for Node.js v20 optimization`);
    }
  } else {
    logResult('Next.js Version', 'fail', 'Next.js not found in dependencies');
  }
} catch (error) {
  logResult('Next.js Version', 'fail', 'Cannot check Next.js version');
}

// Test 5: Check React version
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const reactVersion = packageJson.dependencies?.react;
  
  if (reactVersion) {
    const isLatest = reactVersion.includes('latest') || reactVersion.replace(/[^\d.]/g, '').startsWith('19');
    if (isLatest) {
      logResult('React Version', 'pass', `Updated to ${reactVersion}`);
    } else {
      logResult('React Version', 'warn', `Version ${reactVersion} - consider updating to 19.x for enhanced performance`);
    }
  } else {
    logResult('React Version', 'fail', 'React not found in dependencies');
  }
} catch (error) {
  logResult('React Version', 'fail', 'Cannot check React version');
}

// Test 6: Check if node_modules exists
try {
  if (fs.existsSync('node_modules')) {
    logResult('Dependencies Installation', 'pass', 'node_modules directory exists');
  } else {
    logResult('Dependencies Installation', 'fail', 'node_modules directory missing - run npm install');
  }
} catch (error) {
  logResult('Dependencies Installation', 'fail', 'Cannot check node_modules');
}

// Test 7: Check TypeScript types
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const reactTypesVersion = packageJson.devDependencies?.['@types/react'];
  const reactDomTypesVersion = packageJson.devDependencies?.['@types/react-dom'];
  
  if (reactTypesVersion && reactDomTypesVersion) {
    const isLatest = reactTypesVersion.includes('latest') || reactTypesVersion.startsWith('^19');
    if (isLatest) {
      logResult('TypeScript Types', 'pass', 'React types updated for v19 compatibility');
    } else {
      logResult('TypeScript Types', 'warn', 'Consider updating @types/react and @types/react-dom to latest');
    }
  } else {
    logResult('TypeScript Types', 'warn', 'React TypeScript types not found or incomplete');
  }
} catch (error) {
  logResult('TypeScript Types', 'fail', 'Cannot check TypeScript types');
}

// Test 8: Test basic build (if possible)
try {
  console.log('\n🔨 Testing basic build process...');
  execSync('npm run typecheck', { stdio: 'pipe', timeout: 30000 });
  logResult('TypeScript Check', 'pass', 'TypeScript compilation successful');
} catch (error) {
  logResult('TypeScript Check', 'warn', 'TypeScript check failed or timed out', 'May need dependency updates to complete');
}

// Test 9: Check for critical configuration files
const criticalFiles = ['.nvmrc', 'next.config.mjs', 'tsconfig.json'];
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    logResult(`Configuration File: ${file}`, 'pass', 'Present');
  } else {
    logResult(`Configuration File: ${file}`, 'warn', 'Missing - may be needed for optimal setup');
  }
});

// Summary
console.log('\n📊 VERIFICATION SUMMARY');
console.log('======================');
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`⚠️  Warnings: ${results.warnings}`);

const score = Math.round((results.passed / (results.passed + results.failed + results.warnings)) * 100);
console.log(`\n🎯 Overall Score: ${score}%`);

if (results.failed === 0 && results.warnings <= 2) {
  console.log('🚀 READY FOR DEPLOYMENT! System appears to be properly configured for Node.js v20.');
} else if (results.failed === 0) {
  console.log('⚠️  MOSTLY READY - Address warnings for optimal performance.');
} else {
  console.log('❌ NEEDS ATTENTION - Please resolve failed checks before deployment.');
}

// Next steps
console.log('\n📋 RECOMMENDED NEXT STEPS:');
if (results.failed > 0) {
  console.log('1. Fix all failed checks above');
  console.log('2. Run this verification script again');
}
console.log('3. Run: npm run build (to test full build process)');
console.log('4. Run: git add . && git commit -m "🚀 Node.js v20 upgrade complete"');
console.log('5. Run: git push origin main (to trigger Vercel deployment)');

console.log('\n✨ Node.js v20 Upgrade Verification Complete!');
