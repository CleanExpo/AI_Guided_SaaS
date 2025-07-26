#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔥 ULTIMATE WASTE SCANNER - Comprehensive Analysis\n');

class UltimateScanner {
  constructor() {
    this.stats = {
      files: 0,
      lines: 0,
      issues: [],
      issueTypes: {},
      fileList: []
    };
  }

  scan(rootDir) {
    console.log('📁 Scanning directory:', rootDir);
    
    // Discover files
    const files = this.findFiles(rootDir);
    console.log(`Found ${files.length} files to analyze\n`);
    
    // Analyze each file
    console.log('🔍 Analyzing files...');
    files.forEach((file, index) => {
      if (index % 50 === 0 && index > 0) {
        console.log(`   Progress: ${index}/${files.length} files...`);
      }
      this.analyzeFile(file);
    });
    
    console.log('\n✅ Analysis complete!\n');
    return this.generateReport();
  }

  findFiles(dir, fileList = []) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(item)) {
          this.findFiles(fullPath, fileList);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
          fileList.push(fullPath);
          this.stats.fileList.push(fullPath);
        }
      }
    });
    
    return fileList;
  }

  analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      const relativePath = path.relative(process.cwd(), filePath);
      
      this.stats.files++;
      this.stats.lines += lines.length;
      
      // Comprehensive checks
      this.checkFileSize(relativePath, lines);
      this.checkCodeQuality(relativePath, lines);
      this.checkSecurity(relativePath, lines);
      this.checkPerformance(relativePath, lines);
      this.checkBestPractices(relativePath, lines);
      
    } catch (error) {
      // Skip unreadable files
    }
  }

  checkFileSize(file, lines) {
    if (lines.length > 500) {
      this.addIssue('large_file', file, 1, 'high', 
        `File has ${lines.length} lines - should be split into smaller modules`);
    }
    
    if (lines.length > 1000) {
      this.addIssue('huge_file', file, 1, 'critical', 
        `File has ${lines.length} lines - MUST be refactored immediately`);
    }
  }

  checkCodeQuality(file, lines) {
    let functionCount = 0;
    let complexityScore = 0;
    let maxIndentation = 0;
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      // Console statements
      if (line.match(/console\.(log|warn|error|info|debug)/)) {
        this.addIssue('console_statement', file, lineNum, 'medium', 
          'Remove console statement from production code');
      }
      
      // Debugger
      if (line.includes('debugger')) {
        this.addIssue('debugger_statement', file, lineNum, 'critical', 
          'Debugger statement must be removed');
      }
      
      // TODO comments
      const todoMatch = line.match(/\/\/\s*(TODO|FIXME|HACK|XXX):\s*(.+)/i);
      if (todoMatch) {
        this.addIssue('todo_comment', file, lineNum, 'medium', 
          `${todoMatch[1]}: ${todoMatch[2]}`);
      }
      
      // Long lines
      if (line.length > 120) {
        this.addIssue('long_line', file, lineNum, 'low', 
          `Line is ${line.length} characters long`);
      }
      
      // Deep nesting
      const indent = line.match(/^(\s*)/)[1].length;
      maxIndentation = Math.max(maxIndentation, indent);
      if (indent > 20) {
        this.addIssue('deep_nesting', file, lineNum, 'high', 
          'Code is too deeply nested - refactor required');
      }
      
      // Complexity indicators
      if (line.match(/\b(if|else if|switch|for|while|catch)\b/)) {
        complexityScore++;
      }
      
      // Function counting
      if (line.match(/function\s+\w+|(?:const|let|var)\s+\w+\s*=.*(?:=>|\bfunction\b)/)) {
        functionCount++;
      }
      
      // TypeScript any
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        if (line.match(/:\s*any\b/)) {
          this.addIssue('any_type', file, lineNum, 'medium', 
            'Using "any" type defeats TypeScript purpose');
        }
        
        if (line.includes('@ts-ignore')) {
          this.addIssue('ts_ignore', file, lineNum, 'high', 
            '@ts-ignore hides type errors - fix properly');
        }
      }
      
      // Magic numbers
      const magicMatch = line.match(/[^a-zA-Z0-9_](\d{2,})[^a-zA-Z0-9_]/);
      if (magicMatch && !line.includes('const') && !line.includes('let')) {
        const num = magicMatch[1];
        if (num !== '100' && num !== '200' && num !== '404' && num !== '500') {
          this.addIssue('magic_number', file, lineNum, 'low', 
            `Magic number ${num} should be a named constant`);
        }
      }
    });
    
    // File-level issues
    if (functionCount > 20) {
      this.addIssue('too_many_functions', file, 1, 'medium', 
        `File has ${functionCount} functions - consider splitting`);
    }
    
    if (complexityScore > 50) {
      this.addIssue('high_complexity', file, 1, 'high', 
        `File has complexity score of ${complexityScore} - needs refactoring`);
    }
    
    if (maxIndentation > 16) {
      this.addIssue('excessive_nesting', file, 1, 'high', 
        `Maximum indentation of ${maxIndentation} spaces indicates complex nesting`);
    }
  }

  checkSecurity(file, lines) {
    const content = lines.join('\n');
    
    // Hardcoded secrets
    if (content.match(/(?:api[_-]?key|secret|token|password)\s*[:=]\s*["'][^"']{10,}/i)) {
      this.addIssue('hardcoded_secret', file, 1, 'critical', 
        'Possible hardcoded secret detected - use environment variables');
    }
    
    // eval usage
    if (content.includes('eval(')) {
      this.addIssue('eval_usage', file, 1, 'critical', 
        'eval() is a security risk - never use it');
    }
    
    // innerHTML
    if (content.includes('innerHTML')) {
      this.addIssue('inner_html', file, 1, 'high', 
        'innerHTML can cause XSS vulnerabilities - use textContent or React');
    }
    
    // SQL injection risk
    if (content.match(/query.*\+.*\$|query.*\$\{/)) {
      this.addIssue('sql_injection_risk', file, 1, 'critical', 
        'Possible SQL injection vulnerability - use parameterized queries');
    }
  }

  checkPerformance(file, lines) {
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      // Nested loops
      if (line.includes('for') && lines[index + 1] && lines[index + 1].includes('for')) {
        this.addIssue('nested_loops', file, lineNum, 'medium', 
          'Nested loops can cause performance issues');
      }
      
      // DOM queries in loops
      if (line.match(/querySelector|getElementById/) && this.isInLoop(lines, index)) {
        this.addIssue('dom_in_loop', file, lineNum, 'high', 
          'DOM query in loop - cache the result outside');
      }
      
      // Large arrays
      if (line.match(/new Array\(\d{4,}\)/)) {
        this.addIssue('large_array', file, lineNum, 'medium', 
          'Very large array initialization - consider lazy loading');
      }
    });
  }

  checkBestPractices(file, lines) {
    const content = lines.join('\n');
    
    // Missing error handling
    if (content.includes('async') && !content.includes('try') && !content.includes('.catch')) {
      this.addIssue('no_error_handling', file, 1, 'high', 
        'Async code without error handling');
    }
    
    // React specific
    if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
      // Key prop in maps
      if (content.includes('.map(') && !content.includes('key=')) {
        this.addIssue('missing_key_prop', file, 1, 'high', 
          'map() without key prop causes React performance issues');
      }
      
      // Direct state mutation
      if (content.match(/state\.\w+\s*=/)) {
        this.addIssue('state_mutation', file, 1, 'critical', 
          'Direct state mutation detected - use setState');
      }
    }
    
    // No tests
    if (!file.includes('test') && !file.includes('spec')) {
      const baseName = path.basename(file, path.extname(file));
      const testExists = this.stats.fileList.some(f => 
        f.includes(baseName) && (f.includes('test') || f.includes('spec'))
      );
      
      if (!testExists) {
        this.addIssue('no_tests', file, 1, 'high', 
          'No test file found for this module');
      }
    }
  }

  isInLoop(lines, index) {
    // Simple check if line is inside a loop
    for (let i = Math.max(0, index - 5); i < index; i++) {
      if (lines[i].match(/\b(for|while|forEach|map)\b/)) {
        return true;
      }
    }
    return false;
  }

  addIssue(type, file, line, severity, message) {
    this.stats.issues.push({ type, file, line, severity, message });
    this.stats.issueTypes[type] = (this.stats.issueTypes[type] || 0) + 1;
  }

  generateReport() {
    const severityCounts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
    
    this.stats.issues.forEach(issue => {
      severityCounts[issue.severity]++;
    });
    
    // Generate todo list
    const todoList = this.generateTodoList(severityCounts);
    
    // Create report
    const report = `# 🔥 ULTIMATE WASTE ANALYSIS REPORT

**Generated**: ${new Date().toLocaleString()}
**Project**: AI Guided SaaS

## 📊 Summary

- **Files Analyzed**: ${this.stats.files}
- **Total Lines**: ${this.stats.lines.toLocaleString()}
- **Total Issues**: ${this.stats.issues.length}
- **Critical Issues**: ${severityCounts.critical} 🔴
- **High Priority**: ${severityCounts.high} 🟠
- **Medium Priority**: ${severityCounts.medium} 🟡
- **Low Priority**: ${severityCounts.low} 🟢

## 📈 Issue Breakdown

| Issue Type | Count |
|------------|-------|
${Object.entries(this.stats.issueTypes)
  .sort((a, b) => b[1] - a[1])
  .map(([type, count]) => `| ${type.replace(/_/g, ' ')} | ${count} |`)
  .join('\n')}

## 🚨 Critical Issues (Fix Immediately)

${this.stats.issues
  .filter(i => i.severity === 'critical')
  .slice(0, 10)
  .map(i => `- **${i.type}** in \`${i.file}:${i.line}\`: ${i.message}`)
  .join('\n')}

## 📋 MASTER TODO LIST

${todoList}

---
*Full details saved to: ultimate-scan-results.json*`;

    // Save files
    fs.writeFileSync('ultimate-waste-report.md', report);
    fs.writeFileSync('ultimate-scan-results.json', JSON.stringify(this.stats, null, 2));
    fs.writeFileSync('waste-todo-list.md', this.createDetailedTodoList());
    
    return report;
  }

  generateTodoList(severityCounts) {
    let todo = `### 🔴 CRITICAL - Fix Today (${severityCounts.critical} issues)
${this.stats.issues.filter(i => i.severity === 'critical').length > 0 ? `- [ ] Remove all debugger statements
- [ ] Fix hardcoded secrets and API keys
- [ ] Eliminate eval() usage
- [ ] Fix SQL injection vulnerabilities
- [ ] Fix state mutations in React components` : '✅ No critical issues!'}

### 🟠 HIGH PRIORITY - Fix This Week (${severityCounts.high} issues)
- [ ] Split files over 500 lines
- [ ] Add error handling to all async functions
- [ ] Add missing test files
- [ ] Fix missing React key props
- [ ] Remove @ts-ignore comments
- [ ] Fix deeply nested code

### 🟡 MEDIUM PRIORITY - Fix This Month (${severityCounts.medium} issues)
- [ ] Remove all console statements
- [ ] Replace 'any' types with proper TypeScript types
- [ ] Address TODO/FIXME comments
- [ ] Optimize nested loops
- [ ] Split files with too many functions

### 🟢 LOW PRIORITY - Ongoing Improvements (${severityCounts.low} issues)
- [ ] Fix long lines (use Prettier)
- [ ] Extract magic numbers to constants
- [ ] Improve code formatting
- [ ] Add JSDoc comments

### 🛠️ SETUP & PROCESS
- [ ] Configure ESLint with strict rules
- [ ] Set up Prettier for consistent formatting
- [ ] Add pre-commit hooks (Husky)
- [ ] Set up continuous integration checks
- [ ] Create code review checklist
- [ ] Document coding standards`;

    return todo;
  }

  createDetailedTodoList() {
    // Group by file
    const byFile = {};
    this.stats.issues.forEach(issue => {
      if (!byFile[issue.file]) byFile[issue.file] = [];
      byFile[issue.file].push(issue);
    });
    
    // Sort files by issue severity
    const sortedFiles = Object.entries(byFile)
      .sort((a, b) => {
        const scoreA = a[1].reduce((s, i) => s + (i.severity === 'critical' ? 1000 : i.severity === 'high' ? 100 : 10), 0);
        const scoreB = b[1].reduce((s, i) => s + (i.severity === 'critical' ? 1000 : i.severity === 'high' ? 100 : 10), 0);
        return scoreB - scoreA;
      });
    
    let detailed = `# Detailed Waste Elimination Todo List

## Files to Fix (Sorted by Priority)

`;
    
    sortedFiles.slice(0, 30).forEach(([file, issues]) => {
      detailed += `### ${file}
`;
      issues
        .sort((a, b) => {
          const order = { critical: 0, high: 1, medium: 2, low: 3 };
          return order[a.severity] - order[b.severity];
        })
        .forEach(issue => {
          detailed += `- [ ] [${issue.severity}] Line ${issue.line}: ${issue.message}
`;
        });
      detailed += '\n';
    });
    
    return detailed;
  }
}

// Run the scan
const scanner = new UltimateScanner();
const report = scanner.scan(path.join(__dirname, 'src'));
console.log(report);
console.log('\n✅ Reports generated:');
console.log('   - ultimate-waste-report.md');
console.log('   - waste-todo-list.md');
console.log('   - ultimate-scan-results.json');