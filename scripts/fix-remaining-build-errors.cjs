#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Remaining Build Errors - Final Phase...');

const PROJECT_ROOT = process.cwd();

// Target the specific files that are still failing
const problematicFiles = [
  'src/components/AgentPulseMonitor.tsx',
  'src/components/ContainerMonitor.tsx',
  'src/components/health/AlertsPanel.tsx',
  'src/components/health/SystemMetrics.tsx',
  'src/components/health/TaskQueueVisualizer.tsx'
];

function fixSpecificSyntaxIssues(content) {
  let fixed = content;
  
  // Fix object property syntax errors
  fixed = fixed.replace(/config: \{;,/g, 'config: {');
  fixed = fixed.replace(/\{;,/g, '{');
  fixed = fixed.replace(/;,/g, ',');
  
  // Fix malformed object literals
  fixed = fixed.replace(/\{\s*;/g, '{');
  fixed = fixed.replace(/;\s*\}/g, '}');
  
  // Fix interface syntax
  fixed = fixed.replace(/interface\s+([A-Za-z]+)\s*\{\s*;/g, 'interface $1 {');
  
  // Fix property definitions
  fixed = fixed.replace(/(\w+):\s*([^,}]+);,/g, '$1: $2,');
  fixed = fixed.replace(/(\w+):\s*([^,}]+),;/g, '$1: $2,');
  
  // Fix function call syntax
  fixed = fixed.replace(/\(\)\s*\{;/g, '() {');
  
  // Fix array/object closing
  fixed = fixed.replace(/\];,/g, '];');
  fixed = fixed.replace(/\};,/g, '};');
  
  // Fix import statement issues
  fixed = fixed.replace(/import React from 'react';\s*'use client';/g, "'use client';\nimport React from 'react';");
  
  // Fix double semicolons and trailing syntax
  fixed = fixed.replace(/;;+/g, ';');
  fixed = fixed.replace(/,;/g, ',');
  fixed = fixed.replace(/;,/g, ',');
  
  // Fix malformed JSX
  fixed = fixed.replace(/\s*\|\s*</g, ' || <');
  fixed = fixed.replace(/>\s*\|/g, '> ||');
  
  return fixed;
}

function fixFileSpecifically(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Apply general fixes
    content = fixSpecificSyntaxIssues(content);
    
    // File-specific fixes
    const fileName = path.basename(filePath);
    
    if (fileName === 'AgentPulseMonitor.tsx') {
      // Fix specific issues in AgentPulseMonitor
      content = content.replace(/config: \{;,\s*maxConcurrentAgents/g, 'config: {\n    maxConcurrentAgents');
      content = content.replace(/pulse: \{\s*config: \{;,/g, 'pulse: {\n    config: {');
    }
    
    if (fileName === 'ContainerMonitor.tsx') {
      // Fix ContainerMonitor specific issues
      content = content.replace(/import React from 'react';\s*'use client';/g, "'use client';\nimport React from 'react';");
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}: ${error.message}`);
    return false;
  }
}

async function fixRemainingErrors() {
  console.log('📋 Fixing remaining problematic files...');
  
  let fixedCount = 0;
  
  for (const file of problematicFiles) {
    const filePath = path.join(PROJECT_ROOT, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${file} (not found)`);
      continue;
    }
    
    console.log(`🔧 Fixing ${file}...`);
    
    if (fixFileSpecifically(filePath)) {
      fixedCount++;
      console.log(`✅ Fixed ${file}`);
    } else {
      console.log(`⏭️  No changes needed in ${file}`);
    }
  }
  
  console.log(`\n🎯 Fixed ${fixedCount} remaining files`);
  return fixedCount;
}

// Run the fixes
fixRemainingErrors().then((fixedCount) => {
  console.log('\n🎉 Remaining syntax errors fixed!');
  console.log('💡 Try building again with: npx next build');
}).catch(error => {
  console.error('❌ Final fix failed:', error.message);
  process.exit(1);
});