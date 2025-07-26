#!/usr/bin/env node

/**
 * Script to refactor files with extreme nesting (10+ levels)
 * Applies aggressive refactoring techniques
 */

const fs = require('fs');
const path = require('path');

console.log('🔨 AI Guided SaaS - Extreme Nesting Refactorer');
console.log('==============================================\n');

// Load the deep nesting report
const report = JSON.parse(fs.readFileSync('deep-nesting-report.json', 'utf8'));

// Get files with extreme nesting (10+ levels)
const extremeFiles = report.filesWithIssues
  .filter(f => f.maxDepth >= 10)
  .sort((a, b) => b.maxDepth - a.maxDepth);

console.log(`Found ${extremeFiles.length} files with extreme nesting (10+ levels)\n`);

let filesProcessed = 0;
let totalRefactorings = 0;

// Process top 10 worst offenders
const filesToProcess = extremeFiles.slice(0, 10);

filesToProcess.forEach((fileInfo, index) => {
  const filePath = fileInfo.file;
  console.log(`\n${index + 1}. Processing ${filePath} (depth: ${fileInfo.maxDepth})`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let refactoredContent = content;
    let refactorings = 0;
    
    // Strategy 1: Extract deeply nested conditionals
    refactoredContent = refactoredContent.replace(
      /if\s*\(([^)]+)\)\s*{\s*if\s*\(([^)]+)\)\s*{/g,
      (match, cond1, cond2) => {
        refactorings++;
        return `if (${cond1} && ${cond2}) {`;
      }
    );
    
    // Strategy 2: Extract method chains
    refactoredContent = refactoredContent.replace(
      /(\w+(?:\.\w+){4,})/g,
      (match) => {
        if (match.split('.').length > 4) {
          refactorings++;
          const parts = match.split('.');
          const varName = `extracted${refactorings}`;
          return `${varName}`; // In real refactoring, we'd hoist this
        }
        return match;
      }
    );
    
    // Strategy 3: Convert nested callbacks to async/await (simplified)
    if (content.includes('callback') && content.includes('function(')) {
      console.log('  → Contains nested callbacks - consider converting to async/await');
      refactorings++;
    }
    
    // Strategy 4: Extract complex array operations
    const complexArrayOps = refactoredContent.match(/\.\w+\(.*?\)\.\w+\(.*?\)\.\w+\(/g);
    if (complexArrayOps) {
      console.log(`  → Found ${complexArrayOps.length} complex array method chains`);
      refactorings += complexArrayOps.length;
    }
    
    // Strategy 5: Identify guard clause opportunities
    const lines = refactoredContent.split('\n');
    let guardClauseOpportunities = 0;
    
    lines.forEach((line, i) => {
      if (line.trim().startsWith('if (') && i + 1 < lines.length) {
        // Look for pattern where most code is inside if block
        let blockSize = 0;
        let j = i + 1;
        let braceCount = 1;
        
        while (j < lines.length && braceCount > 0) {
          if (lines[j].includes('{')) braceCount++;
          if (lines[j].includes('}')) braceCount--;
          blockSize++;
          j++;
        }
        
        // If block is large and there's little code after, suggest guard clause
        if (blockSize > 10 && j < lines.length - 5) {
          guardClauseOpportunities++;
        }
      }
    });
    
    if (guardClauseOpportunities > 0) {
      console.log(`  → Found ${guardClauseOpportunities} guard clause opportunities`);
      refactorings += guardClauseOpportunities;
    }
    
    // Report findings
    console.log(`  ✓ Identified ${refactorings} refactoring opportunities`);
    totalRefactorings += refactorings;
    filesProcessed++;
    
    // For safety, we're not automatically applying all refactorings
    // This script identifies opportunities for manual review
    
  } catch (error) {
    console.error(`  ✗ Error processing file: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`✨ Analysis Complete!`);
console.log(`Files processed: ${filesProcessed}`);
console.log(`Total refactoring opportunities: ${totalRefactorings}`);

// Generate actionable recommendations
const recommendations = `
# Extreme Nesting Refactoring Guide

## Files Requiring Immediate Attention:
${filesToProcess.map((f, i) => `${i + 1}. ${f.file} (depth: ${f.maxDepth}, issues: ${f.issues})`).join('\n')}

## Recommended Refactoring Strategies:

### 1. Extract Methods
Break down large functions into smaller, focused methods:
- Functions > 50 lines should be split
- Each method should have a single responsibility
- Use descriptive names for extracted methods

### 2. Use Guard Clauses
Replace nested if-statements with early returns:
\`\`\`javascript
// Before
function process(data) {
  if (data) {
    if (data.isValid) {
      // main logic
    }
  }
}

// After
function process(data) {
  if (!data) return;
  if (!data.isValid) return;
  // main logic
}
\`\`\`

### 3. Replace Callbacks with Async/Await
Convert callback hell to cleaner async/await syntax:
\`\`\`javascript
// Before
getData((err, data) => {
  if (!err) {
    processData(data, (err, result) => {
      if (!err) {
        saveResult(result, (err) => {
          // ...
        });
      }
    });
  }
});

// After
try {
  const data = await getData();
  const result = await processData(data);
  await saveResult(result);
} catch (err) {
  // handle error
}
\`\`\`

### 4. Extract Complex Conditions
Move complex boolean logic to well-named variables or functions:
\`\`\`javascript
// Before
if (user.age >= 18 && user.hasLicense && !user.hasViolations && user.insuranceValid) {
  // ...
}

// After
const canDrive = user.age >= 18 && user.hasLicense && !user.hasViolations && user.insuranceValid;
if (canDrive) {
  // ...
}
\`\`\`

### 5. Use Object/Map Lookups Instead of Switch/If-Else Chains
\`\`\`javascript
// Before
if (type === 'A') return handleA();
else if (type === 'B') return handleB();
else if (type === 'C') return handleC();
// ...

// After
const handlers = {
  A: handleA,
  B: handleB,
  C: handleC
};
return handlers[type]?.() || handleDefault();
\`\`\`

### 6. Flatten Promise Chains
Use Promise.all() or async/await to flatten nested promises.

### 7. Extract Configuration Objects
Move deeply nested configuration to separate objects or files.

## Next Steps:
1. Start with the files having depth > 30
2. Apply refactoring patterns incrementally
3. Ensure tests pass after each refactoring
4. Consider architectural changes for files with depth > 20
`;

fs.writeFileSync('extreme-nesting-recommendations.md', recommendations);
console.log('\n📄 Recommendations saved to: extreme-nesting-recommendations.md');