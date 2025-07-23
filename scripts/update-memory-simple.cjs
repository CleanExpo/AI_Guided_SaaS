#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧠 Updating CLAUDE.md with latest project status...\n');

const _claudeMdPath = path.join(process.cwd(), 'CLAUDE.md');

// Read current CLAUDE.md
const _currentContent = fs.readFileSync(claudeMdPath, 'utf8');

// Update with new information
const _timestamp = new Date().toISOString();
const _healthScore = Math.round((45 / 55) * 100); // 45 passed out of 55 total checks

const _updatedContent = currentContent
  .replace(/\*Last Updated: .*\*/, `*Last Updated: ${timestamp}*`)
  .replace(/\*\*Status\*\*: .*/, `**Status**: ⚠️ BUILD FAILING - 9221 TypeScript errors need fixing`)
  .replace(/\*\*Health Score\*\*: .*/, `**Health Score**: ${healthScore}/100`)
  .replace(/- \*\*TypeScript Errors\*\*: \d+ errors/, `- **TypeScript Errors**: 9221 errors preventing build`)
  .replace(/- \*\*Health Check Available\*\*:.*/, `- **Health Check Available**: Run 'npm run health:check' for detailed analysis
- **Server Status**: Development server running on port 3000
- **Environment**: Supabase placeholders configured, NextAuth configured for localhost`);

// Write updated content
fs.writeFileSync(claudeMdPath, updatedContent);

console.log('✅ CLAUDE.md updated successfully');
console.log(`📊 Current Health Score: ${healthScore}%`);
console.log('🚨 Critical Issues:');
console.log('   - 9221 TypeScript errors');
console.log('   - API endpoints returning 500 errors');
console.log('   - Supabase configuration needs real values');