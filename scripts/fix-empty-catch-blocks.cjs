#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Patterns to identify empty or minimal catch blocks
const EMPTY_CATCH_PATTERNS = [
  // Empty catch block
  /catch\s*\([^)]*\)\s*\{\s*\}/g,
  // Catch with only comment
  /catch\s*\([^)]*\)\s*\{\s*\/\/[^\n]*\s*\}/g,
  // Catch with only console statement
  /catch\s*\([^)]*\)\s*\{\s*console\.(log|error|warn)\([^)]*\);\?\s*\}/g,
  // Catch without parameter that's empty
  /catch\s*\{\s*\}/g,
];

// File extensions to check
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Directories to skip
const SKIP_DIRS = ['node_modules', '.next', 'dist', 'build', '.git'];

let totalEmptyCatches = 0;
let filesWithEmptyCatches = [];

/**
 * Check if a file has empty catch blocks
 */
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let hasEmptyCatch = false;
  let matches = [];
  
  for (const pattern of EMPTY_CATCH_PATTERNS) {
    const fileMatches = content.match(pattern);
    if (fileMatches) {
      hasEmptyCatch = true;
      matches = matches.concat(fileMatches);
    }
  }
  
  if (hasEmptyCatch) {
    totalEmptyCatches += matches.length;
    filesWithEmptyCatches.push({
      path: filePath,
      count: matches.length,
      matches: matches
    });
    
    console.log(`Found ${matches.length} empty catch block(s) in: ${filePath}`);
    matches.forEach((match, index) => {
      console.log(`  ${index + 1}. ${match.replace(/\n/g, ' ').substring(0, 50)}...`);
    });
  }
}

/**
 * Recursively walk directory
 */
function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!SKIP_DIRS.includes(file)) {
        walkDirectory(filePath);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (EXTENSIONS.includes(ext)) {
        checkFile(filePath);
      }
    }
  }
}

/**
 * Generate fix suggestions
 */
function generateFixSuggestion(catchBlock) {
  if (catchBlock.includes('catch (')) {
    // Has error parameter
    return `catch (error) {
  logger.error('Operation failed', error);
  // TODO: Handle error appropriately
}`;
  } else {
    // No error parameter
    return `catch (error) {
  logger.error('Operation failed', error);
  // TODO: Handle error appropriately
}`;
  }
}

// Main execution
console.log('Searching for empty catch blocks...\n');

const srcPath = path.join(process.cwd(), 'src');
if (fs.existsSync(srcPath)) {
  walkDirectory(srcPath);
} else {
  console.error('src directory not found!');
  process.exit(1);
}

console.log('\n=== Summary ===');
console.log(`Total empty catch blocks found: ${totalEmptyCatches}`);
console.log(`Files with empty catch blocks: ${filesWithEmptyCatches.length}`);

if (filesWithEmptyCatches.length > 0) {
  console.log('\n=== Files to fix ===');
  filesWithEmptyCatches
    .sort((a, b) => b.count - a.count)
    .forEach(file => {
      console.log(`${file.path} - ${file.count} empty catch block(s)`);
    });
  
  console.log('\n=== Recommended fix ===');
  console.log('Import the error handling utilities:');
  console.log("import { handleError } from '@/lib/error-handling';");
  console.log('\nReplace empty catch blocks with:');
  console.log(generateFixSuggestion('catch (error) {}'));
}

// Write report to file
const report = {
  timestamp: new Date().toISOString(),
  totalEmptyCatches,
  filesCount: filesWithEmptyCatches.length,
  files: filesWithEmptyCatches.map(f => ({
    path: f.path,
    count: f.count
  }))
};

fs.writeFileSync(
  path.join(process.cwd(), 'empty-catch-blocks-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\nReport saved to: empty-catch-blocks-report.json');

process.exit(filesWithEmptyCatches.length > 0 ? 1 : 0);