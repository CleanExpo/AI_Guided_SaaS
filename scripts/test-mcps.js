#!/usr/bin/env node

// MCP Testing Script
// Tests all configured MCPs to identify working/broken ones

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔧 MCP Testing Script');
console.log('====================\n');

// Read MCP configuration
const configPath = path.join(process.env.HOME, '.config/claude-code/claude_code_settings.json');
let config;

try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  console.log(`✅ Loaded config from: ${configPath}`);
} catch (error) {
  console.error(`❌ Failed to load config: ${error.message}`);
  process.exit(1);
}

const mcpServers = config.mcpServers || {};
console.log(`📋 Found ${Object.keys(mcpServers).length} MCP servers configured\n`);

// Test each MCP server
const results = {};

for (const [name, serverConfig] of Object.entries(mcpServers)) {
  console.log(`🧪 Testing: ${name}`);
  
  try {
    // Check if required environment variables are set
    const envVars = serverConfig.env || {};
    const missingVars = [];
    
    for (const [envVar, value] of Object.entries(envVars)) {
      if (value.startsWith('$') && !process.env[value.slice(1)]) {
        missingVars.push(value.slice(1));
      }
    }
    
    if (missingVars.length > 0) {
      results[name] = {
        status: 'missing_env',
        message: `Missing environment variables: ${missingVars.join(', ')}`
      };
      console.log(`  ⚠️  Missing env vars: ${missingVars.join(', ')}`);
      continue;
    }
    
    // Test if package can be installed
    const packageName = serverConfig.args[1]; // Usually the package name is second arg after -y
    
    if (packageName && packageName.startsWith('@')) {
      // Check if package exists
      try {
        execSync(`npm view ${packageName} version`, { stdio: 'pipe' });
        results[name] = {
          status: 'available',
          message: 'Package exists and can be installed'
        };
        console.log(`  ✅ Package available: ${packageName}`);
      } catch (error) {
        results[name] = {
          status: 'package_error',
          message: `Package not found or unavailable: ${packageName}`
        };
        console.log(`  ❌ Package issue: ${packageName}`);
      }
    } else {
      results[name] = {
        status: 'unknown',
        message: 'Could not determine package name'
      };
      console.log(`  ❓ Unknown package structure`);
    }
    
  } catch (error) {
    results[name] = {
      status: 'error',
      message: error.message
    };
    console.log(`  ❌ Error: ${error.message}`);
  }
}

// Summary
console.log('\n📊 SUMMARY');
console.log('==========');

const statusCounts = {};
for (const [name, result] of Object.entries(results)) {
  statusCounts[result.status] = (statusCounts[result.status] || 0) + 1;
  
  const emoji = {
    'available': '✅',
    'missing_env': '⚠️ ',
    'package_error': '❌',
    'error': '💥',
    'unknown': '❓'
  }[result.status] || '❓';
  
  console.log(`${emoji} ${name}: ${result.message}`);
}

console.log('\nStatus breakdown:');
for (const [status, count] of Object.entries(statusCounts)) {
  console.log(`  ${status}: ${count}`);
}

// Generate environment template
console.log('\n🔧 REQUIRED ENVIRONMENT VARIABLES');
console.log('=================================');

const requiredEnvVars = new Set();
for (const serverConfig of Object.values(mcpServers)) {
  const envVars = serverConfig.env || {};
  for (const value of Object.values(envVars)) {
    if (value.startsWith('$')) {
      requiredEnvVars.add(value.slice(1));
    }
  }
}

if (requiredEnvVars.size > 0) {
  console.log('Add these to your ~/.bashrc or ~/.zshrc:');
  console.log();
  for (const envVar of Array.from(requiredEnvVars).sort()) {
    console.log(`export ${envVar}="your_${envVar.toLowerCase()}_here"`);
  }
} else {
  console.log('No environment variables required.');
}

console.log('\n✨ Testing complete!');