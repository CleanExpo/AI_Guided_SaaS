#!/usr/bin/env node

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🔍 Verifying Next.js Build Output...\n');

const buildDir = '.next';
const criticalFiles = [
  'routes-manifest.json',
  'BUILD_ID',
  'prerender-manifest.json',
  'export-marker.json'
];

let success = true;

// Check if .next directory exists
if (!existsSync(buildDir)) {
  console.log('❌ .next directory not found');
  process.exit(1);
}

console.log('✅ .next directory exists');

// Check critical files
criticalFiles.forEach(file => {
  const filePath = join(buildDir, file);
  if (existsSync(filePath)) {
    console.log(`✅ ${file} found`);
    
    // Special check for routes-manifest.json
    if (file === 'routes-manifest.json') {
      try {
        const content = readFileSync(filePath, 'utf8');
        const manifest = JSON.parse(content);
        console.log(`   📄 Routes: ${Object.keys(manifest.staticRoutes || {}).length} static, ${Object.keys(manifest.dynamicRoutes || {}).length} dynamic`);
      } catch (error) {
        console.log(`   ⚠️  Could not parse routes-manifest.json: ${error.message}`);
        success = false;
      }
    }
  } else {
    console.log(`❌ ${file} missing`);
    success = false;
  }
});

if (success) {
  console.log('\n🎉 Build output verification passed!');
  console.log('✅ All critical files present for Vercel deployment');
} else {
  console.log('\n❌ Build output verification failed!');
  console.log('⚠️  Missing critical files may cause Vercel deployment issues');
  process.exit(1);
}
