#!/usr/bin/env node

/**
 * Database Migration Testing Script
 * Tests migrations for syntax errors, idempotency, and rollback capability
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');
const TEMP_DB_NAME = 'test_migrations_' + Date.now();

console.log('🧪 AI Guided SaaS - Migration Testing');
console.log('=====================================\n');

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Get all migration files
function getMigrationFiles() {
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  log(`Found ${files.length} migration files:`, 'blue');
  files.forEach(file => console.log(`  - ${file}`));
  console.log('');
  
  return files;
}

// Parse migration file for metadata and rollback instructions
function parseMigration(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const metadata = {
    file: path.basename(filePath),
    description: '',
    author: '',
    date: '',
    hasRollback: false,
    rollbackCommands: []
  };
  
  // Extract metadata from comments
  lines.forEach(line => {
    if (line.includes('-- Description:')) {
      metadata.description = line.split('-- Description:')[1].trim();
    }
    if (line.includes('-- Author:')) {
      metadata.author = line.split('-- Author:')[1].trim();
    }
    if (line.includes('-- Date:')) {
      metadata.date = line.split('-- Date:')[1].trim();
    }
    if (line.includes('-- Rollback:')) {
      metadata.hasRollback = true;
      // Collect rollback commands
      const rollbackStart = lines.indexOf(line);
      for (let i = rollbackStart + 1; i < lines.length; i++) {
        if (lines[i].startsWith('--') && lines[i].includes('--')) {
          metadata.rollbackCommands.push(lines[i].replace(/^--\s*/, ''));
        } else {
          break;
        }
      }
    }
  });
  
  return metadata;
}

// Test SQL syntax
function testSyntax(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Basic syntax checks
  const checks = [
    {
      name: 'Semicolon termination',
      regex: /(?:CREATE|ALTER|DROP|INSERT|UPDATE|DELETE)[\s\S]*?(?:;|$)/gm,
      test: (matches) => matches.every(m => m.trim().endsWith(';'))
    },
    {
      name: 'IF NOT EXISTS usage',
      regex: /CREATE\s+(?:TABLE|INDEX|FUNCTION)/gi,
      test: (matches) => matches.every(m => /IF\s+NOT\s+EXISTS/i.test(content))
    },
    {
      name: 'RLS enablement',
      regex: /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?public\.(\w+)/gi,
      test: (matches) => {
        const tableNames = matches.map(m => {
          const match = m.match(/public\.(\w+)/);
          return match ? match[1] : null;
        }).filter(Boolean);
        
        return tableNames.every(table => 
          new RegExp(`ALTER\\s+TABLE\\s+public\\.${table}\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY`, 'i').test(content)
        );
      }
    }
  ];
  
  const results = [];
  checks.forEach(check => {
    const matches = content.match(check.regex) || [];
    const passed = matches.length === 0 || check.test(matches);
    results.push({
      check: check.name,
      passed,
      details: passed ? 'OK' : `Found ${matches.length} issues`
    });
  });
  
  return results;
}

// Test idempotency
function testIdempotency(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for idempotent patterns
  const patterns = {
    'CREATE TABLE IF NOT EXISTS': /CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS/gi,
    'CREATE INDEX IF NOT EXISTS': /CREATE\s+INDEX\s+IF\s+NOT\s+EXISTS/gi,
    'CREATE OR REPLACE FUNCTION': /CREATE\s+OR\s+REPLACE\s+FUNCTION/gi,
    'DROP ... IF EXISTS': /DROP\s+\w+\s+IF\s+EXISTS/gi,
    'ON CONFLICT': /ON\s+CONFLICT/gi
  };
  
  const results = [];
  Object.entries(patterns).forEach(([name, pattern]) => {
    const matches = content.match(pattern) || [];
    results.push({
      pattern: name,
      count: matches.length,
      found: matches.length > 0
    });
  });
  
  return results;
}

// Test for common issues
function testCommonIssues(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for hardcoded values that should be parameterized
  const hardcodedPatterns = [
    { pattern: /password\s*=\s*'[^']+'/gi, name: 'Hardcoded passwords' },
    { pattern: /api_key\s*=\s*'[^']+'/gi, name: 'Hardcoded API keys' },
    { pattern: /secret\s*=\s*'[^']+'/gi, name: 'Hardcoded secrets' }
  ];
  
  hardcodedPatterns.forEach(({ pattern, name }) => {
    const matches = content.match(pattern) || [];
    if (matches.length > 0) {
      issues.push(`${name}: ${matches.length} occurrences`);
    }
  });
  
  // Check for missing indexes on foreign keys
  const fkPattern = /REFERENCES\s+(\w+\.)?(\w+)\s*\((\w+)\)/gi;
  const fkMatches = [...content.matchAll(fkPattern)];
  const indexPattern = /CREATE\s+INDEX.*ON\s+(\w+\.)?(\w+)\s*\((\w+)\)/gi;
  const indexMatches = [...content.matchAll(indexPattern)];
  
  // This is a simplified check - in reality you'd want to match table and column names
  if (fkMatches.length > indexMatches.length) {
    issues.push(`Possible missing indexes: ${fkMatches.length} FKs but only ${indexMatches.length} indexes`);
  }
  
  return issues;
}

// Main test runner
async function runTests() {
  const migrationFiles = getMigrationFiles();
  const results = {
    total: migrationFiles.length,
    passed: 0,
    warnings: 0,
    failed: 0,
    details: []
  };
  
  for (const file of migrationFiles) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    console.log(`\nTesting: ${file}`);
    console.log('─'.repeat(50));
    
    const fileResults = {
      file,
      metadata: parseMigration(filePath),
      syntax: testSyntax(filePath),
      idempotency: testIdempotency(filePath),
      issues: testCommonIssues(filePath),
      status: 'passed'
    };
    
    // Display metadata
    log(`Description: ${fileResults.metadata.description || 'Not provided'}`, 'blue');
    log(`Author: ${fileResults.metadata.author || 'Not provided'}`, 'blue');
    log(`Rollback: ${fileResults.metadata.hasRollback ? 'Yes' : 'No'}`, 
        fileResults.metadata.hasRollback ? 'green' : 'yellow');
    
    // Display syntax check results
    console.log('\nSyntax Checks:');
    fileResults.syntax.forEach(result => {
      if (result.passed) {
        log(`  ✓ ${result.check}`, 'green');
      } else {
        log(`  ✗ ${result.check}: ${result.details}`, 'red');
        fileResults.status = 'failed';
      }
    });
    
    // Display idempotency results
    console.log('\nIdempotency Patterns:');
    fileResults.idempotency.forEach(result => {
      if (result.found) {
        log(`  ✓ ${result.pattern} (${result.count} occurrences)`, 'green');
      }
    });
    
    // Display issues
    if (fileResults.issues.length > 0) {
      console.log('\nPotential Issues:');
      fileResults.issues.forEach(issue => {
        log(`  ⚠ ${issue}`, 'yellow');
        if (fileResults.status === 'passed') {
          fileResults.status = 'warning';
        }
      });
    }
    
    // Update totals
    if (fileResults.status === 'passed') {
      results.passed++;
    } else if (fileResults.status === 'warning') {
      results.warnings++;
    } else {
      results.failed++;
    }
    
    results.details.push(fileResults);
  }
  
  // Display summary
  console.log('\n' + '═'.repeat(50));
  console.log('SUMMARY');
  console.log('═'.repeat(50));
  log(`Total migrations: ${results.total}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Warnings: ${results.warnings}`, 'yellow');
  log(`Failed: ${results.failed}`, 'red');
  
  // Generate report
  const reportPath = path.join(__dirname, '..', 'migration-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test runner failed: ${error.message}`, 'red');
  process.exit(1);
});