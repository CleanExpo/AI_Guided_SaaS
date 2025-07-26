#!/usr/bin/env node

const https = require('https');

console.log('🚀 Checking Vercel deployment status...\n');

// List of possible deployment URLs to check
const urls = [
  'https://ai-guided-saas.vercel.app',
  'https://ai-guided-saas-cleanexpos-projects.vercel.app',
  'https://ai-guided-saas-git-main-cleanexpos-projects.vercel.app'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`${url}`);
      console.log(`  Status: ${res.statusCode}`);
      console.log(`  Headers: ${JSON.stringify(res.headers['x-vercel-deployment-url'] || res.headers['x-vercel-id'] || 'No Vercel headers')}`);
      resolve({ url, status: res.statusCode });
    }).on('error', (err) => {
      console.log(`${url}`);
      console.log(`  Error: ${err.message}`);
      resolve({ url, status: 'error', error: err.message });
    });
  });
}

async function main() {
  console.log('Checking deployment URLs...\n');
  
  for (const url of urls) {
    await checkUrl(url);
    console.log('');
  }
  
  console.log('\n✅ Deployment check complete!');
  console.log('\nNext steps:');
  console.log('1. If all URLs return 404, the deployment may still be building');
  console.log('2. Check https://vercel.com/cleanexpos-projects/ai-guided-saas for build logs');
  console.log('3. Ensure GitHub integration is connected in Vercel dashboard');
}

main().catch(console.error);