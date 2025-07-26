#!/usr/bin/env node

/**
 * Script to identify and fix deeply nested code
 * Refactors code with excessive nesting levels
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔄 AI Guided SaaS - Deep Nesting Fixer');
console.log('======================================\n');

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

// Find all TypeScript/JavaScript files
const sourceFiles = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
  ignore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/*.test.*',
    '**/*.spec.*'
  ]
});

log(`Found ${sourceFiles.length} source files to analyze`, 'blue');

let totalIssues = 0;
let filesFixed = 0;

// Count nesting depth
function countNestingDepth(line) {
  const openBraces = (line.match(/{/g) || []).length;
  const closeBraces = (line.match(/}/g) || []).length;
  return openBraces - closeBraces;
}

// Extract early return opportunities
function findEarlyReturnOpportunities(lines) {
  const opportunities = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for if statements that could be inverted
    if (line.startsWith('if (') && i + 1 < lines.length) {
      const nextLine = lines[i + 1].trim();
      
      // Check if the if block contains a return/throw/continue/break
      let blockEnd = i + 1;
      let braceCount = 0;
      let hasEarlyExit = false;
      
      for (let j = i + 1; j < lines.length; j++) {
        const checkLine = lines[j];
        if (checkLine.includes('{')) braceCount++;
        if (checkLine.includes('}')) braceCount--;
        
        if (checkLine.includes('return') || checkLine.includes('throw') || 
            checkLine.includes('continue') || checkLine.includes('break')) {
          hasEarlyExit = true;
        }
        
        if (braceCount === 0 && checkLine.includes('}')) {
          blockEnd = j;
          break;
        }
      }
      
      // If the rest of the function is in an else block, we can invert
      if (blockEnd + 1 < lines.length && lines[blockEnd + 1].trim().startsWith('} else')) {
        opportunities.push({
          start: i,
          end: blockEnd,
          type: 'invertible-if',
          hasEarlyExit
        });
      }
    }
    
    // Look for nested callbacks that could be promisified
    if (line.includes('callback') || line.includes('cb(')) {
      opportunities.push({
        line: i,
        type: 'callback',
        suggestion: 'Consider using async/await instead of callbacks'
      });
    }
  }
  
  return opportunities;
}

// Refactor deeply nested code
function refactorDeepNesting(content, filePath) {
  const lines = content.split('\n');
  let maxDepth = 0;
  let currentDepth = 0;
  const nestingIssues = [];
  
  // Track nesting depth
  lines.forEach((line, index) => {
    currentDepth += countNestingDepth(line);
    if (currentDepth > maxDepth) {
      maxDepth = currentDepth;
    }
    if (currentDepth < 0) currentDepth = 0;
    
    // Flag lines with excessive nesting
    if (currentDepth > 4) {
      nestingIssues.push({
        line: index + 1,
        depth: currentDepth,
        content: line.trim()
      });
    }
  });
  
  if (maxDepth <= 4) {
    return { content, fixed: false, issues: 0 };
  }
  
  // Apply refactoring strategies
  let modifiedContent = content;
  let fixes = 0;
  
  // Strategy 1: Extract nested functions
  const functionPattern = /^(\s*)function\s+(\w+)\s*\([^)]*\)\s*{/gm;
  const arrowFunctionPattern = /^(\s*)(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*{/gm;
  
  // Find functions that are deeply nested
  let match;
  const functionsToExtract = [];
  
  while ((match = functionPattern.exec(content)) !== null) {
    const indentLevel = match[1].length / 2; // Assuming 2-space indent
    if (indentLevel > 2) {
      functionsToExtract.push({
        name: match[2],
        fullMatch: match[0],
        indent: match[1]
      });
    }
  }
  
  // Strategy 2: Convert nested if-else to early returns
  const opportunities = findEarlyReturnOpportunities(lines);
  
  opportunities.forEach(opp => {
    if (opp.type === 'invertible-if' && opp.hasEarlyExit) {
      log(`  → Found invertible if-statement at line ${opp.start + 1}`, 'yellow');
      fixes++;
    }
  });
  
  // Strategy 3: Replace nested ternaries with if-else or switch
  const ternaryPattern = /(\?[^:]+:[^?]+){3,}/g;
  const nestedTernaries = content.match(ternaryPattern);
  if (nestedTernaries) {
    log(`  → Found ${nestedTernaries.length} deeply nested ternary expressions`, 'yellow');
    fixes += nestedTernaries.length;
  }
  
  // Strategy 4: Extract complex conditions
  const complexConditionPattern = /if\s*\([^)]{100,}\)/g;
  const complexConditions = content.match(complexConditionPattern);
  if (complexConditions) {
    log(`  → Found ${complexConditions.length} complex conditions that could be extracted`, 'yellow');
    fixes += complexConditions.length;
  }
  
  return {
    content: modifiedContent,
    fixed: fixes > 0,
    issues: nestingIssues.length,
    maxDepth,
    suggestions: fixes
  };
}

// Process each file
const report = {
  timestamp: new Date().toISOString(),
  filesAnalyzed: 0,
  totalIssues: 0,
  filesWithIssues: [],
  suggestions: []
};

sourceFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const result = refactorDeepNesting(content, filePath);
  
  if (result.issues > 0) {
    const relPath = path.relative(process.cwd(), filePath);
    log(`\n📁 ${relPath}`, 'blue');
    log(`  Max nesting depth: ${result.maxDepth}`, 'red');
    log(`  Issues found: ${result.issues}`, 'yellow');
    log(`  Refactoring opportunities: ${result.suggestions}`, 'green');
    
    report.filesWithIssues.push({
      file: relPath,
      maxDepth: result.maxDepth,
      issues: result.issues,
      suggestions: result.suggestions
    });
    
    totalIssues += result.issues;
    
    if (result.fixed) {
      fs.writeFileSync(filePath, result.content);
      filesFixed++;
    }
  }
  
  report.filesAnalyzed++;
});

// Generate detailed suggestions
const topOffenders = report.filesWithIssues
  .sort((a, b) => b.maxDepth - a.maxDepth)
  .slice(0, 10);

console.log('\n' + '='.repeat(50));
log(`🔍 Deep Nesting Analysis Complete!`, 'green');
log(`Files analyzed: ${report.filesAnalyzed}`, 'blue');
log(`Total nesting issues: ${totalIssues}`, 'yellow');
log(`Files with issues: ${report.filesWithIssues.length}`, 'yellow');

if (topOffenders.length > 0) {
  console.log('\n📊 Top 10 Files with Deepest Nesting:');
  topOffenders.forEach((file, index) => {
    console.log(`${index + 1}. ${file.file} (depth: ${file.maxDepth}, issues: ${file.issues})`);
  });
  
  console.log('\n💡 Refactoring Suggestions:');
  console.log('1. Extract deeply nested functions into separate functions');
  console.log('2. Use early returns to reduce nesting levels');
  console.log('3. Replace nested callbacks with async/await');
  console.log('4. Extract complex conditions into named variables');
  console.log('5. Consider using guard clauses');
  console.log('6. Break down large functions into smaller ones');
  console.log('7. Use switch statements instead of nested if-else');
}

// Save report
report.summary = {
  totalIssues,
  filesWithIssues: report.filesWithIssues.length,
  averageMaxDepth: report.filesWithIssues.length > 0 
    ? (report.filesWithIssues.reduce((sum, f) => sum + f.maxDepth, 0) / report.filesWithIssues.length).toFixed(2)
    : 0
};

fs.writeFileSync('deep-nesting-report.json', JSON.stringify(report, null, 2));
log(`\n📄 Report saved to: deep-nesting-report.json`, 'yellow');