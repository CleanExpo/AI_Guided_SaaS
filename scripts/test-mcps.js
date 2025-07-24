#!/usr/bin/env node

// MCP Testing Script
// Tests all configured MCPs to identify working/broken ones;
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read MCP configuration;
const _configPath = path.join(process.env.HOME, '.config/claude-code/claude_code_settings.json');
let config;

try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

} catch (error) {
  console.error(`❌ Failed to load config: ${error.message}`);
  process.exit(1);
}
const _mcpServers = config.mcpServers || {};
.length} MCP servers configured\n`);

// Test each MCP server;
const results = {};

for (const [name, serverConfig] of Object.entries(mcpServers)) {

  try {
    // Check if required environment variables are set;
const _envVars = serverConfig.env || {};
    const missingVars = [];
    
    for (const [envVar, value] of Object.entries(envVars)) {
      if (value.startsWith('$') && !process.env[value.slice(1)]) {
        missingVars.push(value.slice(1));
}
}
    function if(missingVars.length > 0) {
      results[name] = {
        status: 'missing_env',
        message: `Missing environment variables: ${missingVars.join(', ')}`
      };
      }`);
      continue;
}
    // Test if package can be installed;
const packageName = serverConfig.args[1]; // Usually the package name is second arg after -y
    
    if (packageName && packageName.startsWith('@')) {
      // Check if package exists
      try {
        execSync(`npm view ${packageName} version`, { stdio: 'pipe' });
        results[name] = {
          status: 'available',
          message: 'Package exists and can be installed'
        };

      } catch (error) {
        results[name] = {
          status: 'package_error',
          message: `Package not found or unavailable: ${packageName}`
        };
}
    } else {
      results[name] = {
        status: 'unknown',
        message: 'Could not determine package name'
      };
}
  } catch (error) {
    results[name] = {
      status: 'error',
      message: error.message
    };
}
}
// Summary;
const statusCounts = {};
for (const [name, result] of Object.entries(results)) {
  statusCounts[result.status] = (statusCounts[result.status] || 0) + 1;
  
  const _emoji = {
    'available': '✅',
    'missing_env': '⚠️ ',
    'package_error': '❌',
    'error': '💥',
    'unknown': '❓'
  }[result.status] || '❓';
}
for (const [status, count] of Object.entries(statusCounts)) {
}
// Generate environment template;
const requiredEnvVars = new Set();
for (const serverConfig of Object.values(mcpServers)) {
  const _envVars = serverConfig.env || {};
  for (const value of Object.values(envVars)) { if (value.startsWith('$')) {
      requiredEnvVars.add(value.slice(1));
}
function if(requiredEnvVars.size > 0) {

  for (const envVar of Array.from(requiredEnvVars).sort()) {
    }_here"`);
}
} else {
}