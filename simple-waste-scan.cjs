#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Simple Waste Scanner for AI Guided SaaS\n');

// Simple file scanner
function scanDirectory(dir, ignore = ['node_modules', '.next', 'dist', 'build']) {
  const results = {
    files: 0,
    lines: 0,
    issues: [],
    consoleCount: 0,
    todoCount: 0,
    longLines: 0,
    emptyFiles: 0,
    largeFiles: 0
  };

  function walkDir(currentPath) {
    try {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          if (!ignore.some(ig => itemPath.includes(ig))) {
            walkDir(itemPath);
          }
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
            analyzeFile(itemPath, results);
          }
        }
      }
    } catch (error) {
      // Skip inaccessible directories
    }
  }

  function analyzeFile(filePath, results) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      results.files++;
      results.lines += lines.length;

      // Check for empty files
      if (content.trim().length === 0) {
        results.emptyFiles++;
        results.issues.push({
          type: 'empty_file',
          file: path.relative(dir, filePath),
          message: 'File is empty'
        });
      }

      // Check for large files
      if (lines.length > 500) {
        results.largeFiles++;
        results.issues.push({
          type: 'large_file',
          file: path.relative(dir, filePath),
          lines: lines.length,
          message: `File has ${lines.length} lines - consider splitting`
        });
      }

      // Scan for issues
      lines.forEach((line, index) => {
        // Console statements
        if (line.match(/console\.(log|warn|error|info)/)) {
          results.consoleCount++;
          if (results.consoleCount <= 10) { // Limit to first 10
            results.issues.push({
              type: 'console_statement',
              file: path.relative(dir, filePath),
              line: index + 1,
              message: 'Console statement found'
            });
          }
        }

        // TODO comments
        if (line.match(/\/\/\s*(TODO|FIXME|HACK|XXX)/i)) {
          results.todoCount++;
          if (results.todoCount <= 10) { // Limit to first 10
            results.issues.push({
              type: 'todo_comment',
              file: path.relative(dir, filePath),
              line: index + 1,
              message: line.trim()
            });
          }
        }

        // Long lines
        if (line.length > 120) {
          results.longLines++;
        }
      });
    } catch (error) {
      // Skip files that can't be read
    }
  }

  walkDir(dir);
  return results;
}

// Generate simple report
function generateReport(results) {
  const score = Math.max(0, 100 - (results.issues.length * 2));
  
  console.log('📊 Scan Results');
  console.log('═'.repeat(50));
  console.log(`📁 Files scanned: ${results.files}`);
  console.log(`📝 Total lines: ${results.lines.toLocaleString()}`);
  console.log(`⚠️  Issues found: ${results.issues.length}`);
  console.log(`📏 Average file size: ${Math.round(results.lines / results.files)} lines`);
  console.log(`🏆 Code Quality Score: ${score}/100\n`);

  console.log('📋 Issue Summary');
  console.log('─'.repeat(50));
  console.log(`Console statements: ${results.consoleCount}`);
  console.log(`TODO/FIXME comments: ${results.todoCount}`);
  console.log(`Lines > 120 chars: ${results.longLines}`);
  console.log(`Empty files: ${results.emptyFiles}`);
  console.log(`Large files (>500 lines): ${results.largeFiles}\n`);

  if (results.issues.length > 0) {
    console.log('🔝 Sample Issues');
    console.log('─'.repeat(50));
    results.issues.slice(0, 10).forEach((issue, i) => {
      console.log(`${i + 1}. [${issue.type}] ${issue.file}${issue.line ? ':' + issue.line : ''}`);
      console.log(`   ${issue.message}\n`);
    });
  }

  // Save full report
  const reportContent = `# Waste Analysis Report

**Date**: ${new Date().toLocaleString()}
**Project**: AI Guided SaaS
**Score**: ${score}/100

## Statistics
- Files scanned: ${results.files}
- Total lines: ${results.lines.toLocaleString()}
- Issues found: ${results.issues.length}
- Console statements: ${results.consoleCount}
- TODO comments: ${results.todoCount}
- Long lines: ${results.longLines}
- Empty files: ${results.emptyFiles}
- Large files: ${results.largeFiles}

## All Issues

${results.issues.map((issue, i) => 
  `${i + 1}. **[${issue.type}]** \`${issue.file}${issue.line ? ':' + issue.line : ''}\`
   ${issue.message}`
).join('\n\n')}

## Recommendations

${results.consoleCount > 10 ? '- Remove console statements from production code\n' : ''}${results.todoCount > 5 ? '- Address TODO/FIXME comments\n' : ''}${results.longLines > 50 ? '- Use code formatter to limit line length\n' : ''}${results.largeFiles > 5 ? '- Split large files into smaller modules\n' : ''}${results.emptyFiles > 0 ? '- Remove or populate empty files\n' : ''}

---
*Generated by Simple Waste Scanner*`;

  fs.writeFileSync('waste-scan-report.md', reportContent);
  console.log('📄 Full report saved to: waste-scan-report.md');
}

// Run the scan
console.log('🚀 Scanning src directory...\n');
const srcPath = path.join(__dirname, 'src');
const results = scanDirectory(srcPath);
generateReport(results);