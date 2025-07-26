#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔥 ULTIMATE WASTE SCANNER - Deep Analysis Mode\n');
console.log('This comprehensive scan will analyze every aspect of code quality.\n');

class UltimateWasteScanner {
  constructor() {
    this.results = {
      files: 0,
      lines: 0,
      functions: 0,
      classes: 0,
      issues: [],
      duplicates: new Map(),
      imports: new Map(),
      exports: new Map(),
      dependencies: new Set(),
      complexityScores: [],
      performanceIssues: [],
      securityIssues: [],
      accessibilityIssues: [],
      testCoverage: {
        hasTests: 0,
        missingTests: 0
      }
    };
    
    this.codeBlocks = new Map(); // For duplicate detection
    this.todoList = []; // Final todo list
  }

  // Main scan function
  async scanProject(rootDir) {
    console.log('📁 Phase 1: File Discovery...');
    const files = this.discoverFiles(rootDir);
    console.log(`   Found ${files.length} files to analyze\n`);

    console.log('🔍 Phase 2: Deep Code Analysis...');
    let processed = 0;
    for (const file of files) {
      await this.analyzeFile(file);
      processed++;
      if (processed % 50 === 0) {
        console.log(`   Processed ${processed}/${files.length} files...`);
      }
    }

    console.log('\n🔗 Phase 3: Cross-File Analysis...');
    this.analyzeDuplicates();
    this.analyzeImportExport();
    this.analyzeUnusedCode();

    console.log('\n📊 Phase 4: Generating Report & Todo List...\n');
    return this.generateComprehensiveReport();
  }

  discoverFiles(dir, ignore = ['node_modules', '.next', 'dist', 'build', '.git', 'coverage']) {
    const files = [];
    
    function walk(currentPath) {
      try {
        const items = fs.readdirSync(currentPath);
        
        for (const item of items) {
          const itemPath = path.join(currentPath, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            if (!ignore.some(ig => itemPath.includes(ig))) {
              walk(itemPath);
            }
          } else if (stat.isFile()) {
            const ext = path.extname(item);
            if (['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss'].includes(ext)) {
              files.push(itemPath);
            }
          }
        }
      } catch (error) {
        // Skip inaccessible directories
      }
    }
    
    walk(dir);
    return files;
  }

  async analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      const relativePath = path.relative(process.cwd(), filePath);
      const ext = path.extname(filePath);
      
      this.results.files++;
      this.results.lines += lines.length;

      // Skip if file is too large
      if (lines.length > 2000) {
        this.addIssue('gigantic_file', relativePath, 1, 'critical', 
          `File has ${lines.length} lines - must be split immediately`);
      }

      // Analyze based on file type
      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        this.analyzeJavaScriptFile(content, lines, relativePath);
      } else if (ext === '.json') {
        this.analyzeJsonFile(content, relativePath);
      } else if (['.css', '.scss'].includes(ext)) {
        this.analyzeStyleFile(content, lines, relativePath);
      }

      // Store code blocks for duplicate detection
      this.extractCodeBlocks(content, relativePath);

    } catch (error) {
      // Skip files that can't be read
    }
  }

  analyzeJavaScriptFile(content, lines, filePath) {
    // Count functions and classes
    const functionMatches = content.match(/function\s+\w+|(?:const|let|var)\s+\w+\s*=\s*(?:async\s*)?\(|(?:async\s+)?(?:\w+)\s*:\s*(?:async\s*)?\(/g) || [];
    const classMatches = content.match(/class\s+\w+/g) || [];
    this.results.functions += functionMatches.length;
    this.results.classes += classMatches.length;

    // Extract imports and exports
    const imports = content.match(/import\s+.*?from\s+['"](.+?)['"]/g) || [];
    const exports = content.match(/export\s+(?:default\s+)?(?:const|let|var|function|class|interface|type|enum)\s+(\w+)/g) || [];
    
    imports.forEach(imp => {
      const module = imp.match(/from\s+['"](.+?)['"]/)?.[1];
      if (module) {
        if (!this.results.imports.has(filePath)) {
          this.results.imports.set(filePath, []);
        }
        this.results.imports.get(filePath).push(module);
        
        // Track external dependencies
        if (!module.startsWith('.') && !module.startsWith('@/')) {
          this.results.dependencies.add(module.split('/')[0]);
        }
      }
    });

    exports.forEach(exp => {
      const name = exp.match(/(?:export\s+(?:default\s+)?(?:const|let|var|function|class|interface|type|enum)\s+)(\w+)/)?.[1];
      if (name) {
        if (!this.results.exports.has(filePath)) {
          this.results.exports.set(filePath, []);
        }
        this.results.exports.get(filePath).push(name);
      }
    });

    // Line-by-line analysis
    let inComment = false;
    let complexity = 1;
    let currentFunction = null;
    let functionStartLine = 0;
    let braceDepth = 0;

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Multi-line comment tracking
      if (line.includes('/*')) inComment = true;
      if (line.includes('*/')) inComment = false;
      if (inComment) return;

      // Empty lines in functions
      if (trimmed === '' && braceDepth > 0) {
        this.results.issues.push({
          type: 'excessive_empty_lines',
          file: filePath,
          line: lineNum,
          severity: 'low',
          message: 'Multiple empty lines in function'
        });
      }

      // Console statements
      if (line.match(/console\.(log|warn|error|info|debug|trace)/)) {
        this.addIssue('console_statement', filePath, lineNum, 'medium', 
          'Console statement in production code - use proper logging');
      }

      // Debugger statements
      if (line.match(/\bdebugger\b/)) {
        this.addIssue('debugger_statement', filePath, lineNum, 'critical', 
          'Debugger statement found - MUST be removed');
      }

      // Alert/confirm/prompt
      if (line.match(/\b(alert|confirm|prompt)\s*\(/)) {
        this.addIssue('browser_dialog', filePath, lineNum, 'high', 
          'Browser dialog found - use proper UI components');
      }

      // TODO/FIXME/HACK comments
      const todoMatch = line.match(/\/\/\s*(TODO|FIXME|HACK|XXX|BUG|OPTIMIZE|REFACTOR):\s*(.+)/i);
      if (todoMatch) {
        this.addIssue('todo_comment', filePath, lineNum, 'medium', 
          `${todoMatch[1]}: ${todoMatch[2]}`);
      }

      // Long lines
      if (line.length > 120) {
        this.addIssue('long_line', filePath, lineNum, 'low', 
          `Line is ${line.length} characters (max: 120)`);
      }

      // Deeply nested code
      const indentLevel = line.match(/^(\s*)/)?.[1].length || 0;
      if (indentLevel > 20) {
        this.addIssue('deep_nesting', filePath, lineNum, 'high', 
          'Code is too deeply nested - refactor required');
      }

      // Complexity indicators
      if (line.match(/\b(if|else if|while|for|switch|catch)\b/)) {
        complexity++;
      }

      // Function detection
      if (line.match(/function\s+\w+|(?:const|let|var)\s+\w+\s*=\s*(?:async\s*)?\(/)) {
        if (currentFunction && complexity > 10) {
          this.addIssue('complex_function', filePath, functionStartLine, 'high', 
            `Function has cyclomatic complexity of ${complexity}`);
        }
        currentFunction = line;
        functionStartLine = lineNum;
        complexity = 1;
      }

      // Track brace depth
      braceDepth += (line.match(/{/g) || []).length;
      braceDepth -= (line.match(/}/g) || []).length;

      // Hardcoded values
      if (line.match(/['"][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}['"]/)) {
        this.addIssue('hardcoded_email', filePath, lineNum, 'medium', 
          'Hardcoded email address - use environment variable');
      }

      if (line.match(/['"](https?:\/\/|ftp:\/\/|ws:\/\/)[^'"]+['"]/)) {
        if (!line.includes('localhost') && !line.includes('example.com')) {
          this.addIssue('hardcoded_url', filePath, lineNum, 'medium', 
            'Hardcoded URL - use configuration');
        }
      }

      // API keys or secrets
      if (line.match(/['"](sk_|pk_|api_|key_|secret_|token_)[a-zA-Z0-9]{20,}['"]/)) {
        this.addIssue('exposed_secret', filePath, lineNum, 'critical', 
          'Possible API key or secret exposed!');
      }

      // Unused variables (simple check)
      const varMatch = line.match(/(?:const|let|var)\s+(\w+)\s*=/);
      if (varMatch) {
        const varName = varMatch[1];
        // Check if variable is used in the next 20 lines
        let used = false;
        for (let i = index + 1; i < Math.min(index + 20, lines.length); i++) {
          if (lines[i].includes(varName)) {
            used = true;
            break;
          }
        }
        if (!used && !varName.startsWith('_')) {
          this.addIssue('possibly_unused_variable', filePath, lineNum, 'low', 
            `Variable '${varName}' may be unused`);
        }
      }

      // Performance issues
      if (line.includes('.forEach') && lines[index + 1]?.includes('.forEach')) {
        this.addIssue('nested_foreach', filePath, lineNum, 'medium', 
          'Nested forEach loops - consider optimization');
      }

      if (line.match(/document\.querySelector|document\.getElementById/)) {
        if (braceDepth > 1) { // Inside a function
          this.addIssue('dom_query_in_loop', filePath, lineNum, 'medium', 
            'DOM query possibly in loop - cache the result');
        }
      }

      // React specific
      if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
        // Missing key prop
        if (line.includes('.map(') && !lines.slice(index, index + 5).some(l => l.includes('key='))) {
          this.addIssue('missing_key_prop', filePath, lineNum, 'high', 
            'Map without key prop - causes React performance issues');
        }

        // Direct state mutation
        if (line.match(/this\.state\.\w+\s*=/)) {
          this.addIssue('direct_state_mutation', filePath, lineNum, 'critical', 
            'Direct state mutation - use setState');
        }

        // Inline functions in render
        if (line.match(/onClick=\{(?:\(\)\s*=>|\s*function)/) && line.includes('=>')) {
          this.addIssue('inline_function_handler', filePath, lineNum, 'medium', 
            'Inline function in render - causes unnecessary re-renders');
        }
      }

      // TypeScript specific
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        // Any type
        if (line.match(/:\s*any\b/)) {
          this.addIssue('any_type', filePath, lineNum, 'medium', 
            'Using "any" type - add proper typing');
        }

        // @ts-ignore
        if (line.includes('@ts-ignore')) {
          this.addIssue('ts_ignore', filePath, lineNum, 'high', 
            '@ts-ignore used - fix the type error properly');
        }
      }

      // Security issues
      if (line.match(/innerHTML\s*=/)) {
        this.addIssue('inner_html', filePath, lineNum, 'high', 
          'innerHTML usage - potential XSS vulnerability');
      }

      if (line.match(/eval\s*\(/)) {
        this.addIssue('eval_usage', filePath, lineNum, 'critical', 
          'eval() usage - major security risk');
      }

      // Code smells
      if (line.length > 0 && line === line.toUpperCase() && line.match(/[A-Z]{5,}/)) {
        this.addIssue('all_caps_text', filePath, lineNum, 'low', 
          'All caps text - use proper casing');
      }

      // Magic numbers
      if (line.match(/[^0-9]([2-9]|[1-9][0-9]+)\b/) && !line.includes('const') && !line.includes('let')) {
        const num = line.match(/[^0-9]([2-9]|[1-9][0-9]+)\b/)?.[1];
        if (num && parseInt(num) > 1 && parseInt(num) !== 100 && parseInt(num) !== 404) {
          this.addIssue('magic_number', filePath, lineNum, 'low', 
            `Magic number ${num} - extract to named constant`);
        }
      }
    });

    // File-level checks
    if (this.results.functions > 20) {
      this.addIssue('too_many_functions', filePath, 1, 'medium', 
        `File has ${this.results.functions} functions - consider splitting`);
    }

    if (!content.includes('test') && !filePath.includes('test') && !filePath.includes('spec')) {
      if (this.results.functions > 0) {
        this.results.testCoverage.missingTests++;
        this.addIssue('no_tests', filePath, 1, 'high', 
          'No tests found for this file');
      }
    } else {
      this.results.testCoverage.hasTests++;
    }

    // Check for proper error handling
    if (content.includes('async') && !content.includes('try') && !content.includes('.catch')) {
      this.addIssue('missing_error_handling', filePath, 1, 'high', 
        'Async code without error handling');
    }
  }

  analyzeJsonFile(content, filePath) {
    try {
      JSON.parse(content);
    } catch (error) {
      this.addIssue('invalid_json', filePath, 1, 'critical', 
        'Invalid JSON file - ' + error.message);
    }

    // Check for sensitive data in JSON
    if (content.match(/"(password|secret|key|token)":\s*"[^"]+"/)) {
      this.addIssue('sensitive_data_json', filePath, 1, 'critical', 
        'Sensitive data found in JSON file');
    }
  }

  analyzeStyleFile(content, lines, filePath) {
    // Check for !important
    const importantCount = (content.match(/!important/g) || []).length;
    if (importantCount > 5) {
      this.addIssue('excessive_important', filePath, 1, 'medium', 
        `${importantCount} !important declarations - refactor CSS specificity`);
    }

    // Check for z-index issues
    const zIndexMatches = content.match(/z-index:\s*(\d+)/g) || [];
    zIndexMatches.forEach(match => {
      const value = parseInt(match.match(/\d+/)?.[0] || '0');
      if (value > 100) {
        this.addIssue('high_z_index', filePath, 1, 'low', 
          `z-index value ${value} is too high`);
      }
    });

    // Duplicate selectors
    const selectors = content.match(/[.#][\w-]+\s*{/g) || [];
    const selectorCounts = {};
    selectors.forEach(sel => {
      selectorCounts[sel] = (selectorCounts[sel] || 0) + 1;
    });
    Object.entries(selectorCounts).forEach(([sel, count]) => {
      if (count > 2) {
        this.addIssue('duplicate_css_selector', filePath, 1, 'medium', 
          `Selector ${sel} appears ${count} times`);
      }
    });
  }

  extractCodeBlocks(content, filePath) {
    const lines = content.split('\n');
    
    // Extract 10-line blocks for duplicate detection
    for (let i = 0; i < lines.length - 10; i++) {
      const block = lines.slice(i, i + 10).join('\n').trim();
      
      // Skip small blocks
      if (block.length < 100) continue;
      
      // Create hash of the block
      const hash = crypto.createHash('md5').update(block).digest('hex');
      
      if (!this.codeBlocks.has(hash)) {
        this.codeBlocks.set(hash, []);
      }
      
      this.codeBlocks.get(hash).push({
        file: filePath,
        line: i + 1,
        content: block.substring(0, 100) + '...'
      });
    }
  }

  analyzeDuplicates() {
    let duplicateCount = 0;
    
    this.codeBlocks.forEach((locations, hash) => {
      if (locations.length > 1) {
        duplicateCount++;
        
        // Only report first 20 duplicates
        if (duplicateCount <= 20) {
          const files = locations.map(loc => `${loc.file}:${loc.line}`).join(', ');
          this.addIssue('duplicate_code', locations[0].file, locations[0].line, 'high',
            `Duplicate code found in ${locations.length} locations: ${files}`);
        }
      }
    });

    if (duplicateCount > 20) {
      this.addIssue('excessive_duplication', 'project', 1, 'critical',
        `Found ${duplicateCount} duplicate code blocks - major refactoring needed`);
    }
  }

  analyzeImportExport() {
    // Find unused exports
    const allExports = new Map();
    this.results.exports.forEach((exports, file) => {
      exports.forEach(exp => {
        allExports.set(exp, file);
      });
    });

    // Check which exports are imported
    const importedNames = new Set();
    this.results.imports.forEach((imports) => {
      imports.forEach(imp => {
        // Extract imported names (simplified)
        const match = imp.match(/{\s*([^}]+)\s*}/);
        if (match) {
          match[1].split(',').forEach(name => {
            importedNames.add(name.trim());
          });
        }
      });
    });

    // Report unused exports
    let unusedCount = 0;
    allExports.forEach((file, exportName) => {
      if (!importedNames.has(exportName) && exportName !== 'default') {
        unusedCount++;
        if (unusedCount <= 10) {
          this.addIssue('unused_export', file, 1, 'medium',
            `Export '${exportName}' is never imported`);
        }
      }
    });
  }

  analyzeUnusedCode() {
    // Analyze import cycles
    const importGraph = new Map();
    this.results.imports.forEach((imports, file) => {
      importGraph.set(file, imports.filter(imp => imp.startsWith('.')));
    });

    // Simple cycle detection (depth 2)
    importGraph.forEach((imports, file) => {
      imports.forEach(imp => {
        const resolvedPath = this.resolveImport(file, imp);
        if (importGraph.has(resolvedPath)) {
          const targetImports = importGraph.get(resolvedPath) || [];
          if (targetImports.some(targetImp => this.resolveImport(resolvedPath, targetImp) === file)) {
            this.addIssue('circular_dependency', file, 1, 'high',
              `Circular dependency with ${resolvedPath}`);
          }
        }
      });
    });

    // Check for files with no imports or exports (dead files)
    this.results.files.forEach(file => {
      if (!this.results.imports.has(file) && !this.results.exports.has(file)) {
        this.addIssue('isolated_file', file, 1, 'medium',
          'File has no imports or exports - may be dead code');
      }
    });
  }

  resolveImport(fromFile, importPath) {
    // Simplified import resolution
    const dir = path.dirname(fromFile);
    return path.join(dir, importPath).replace(/\\/g, '/');
  }

  addIssue(type, file, line, severity, message) {
    this.results.issues.push({
      type,
      file,
      line,
      severity,
      message
    });
  }

  generateComprehensiveReport() {
    // Group issues by type and severity
    const issuesByType = {};
    const issuesBySeverity = {
      critical: [],
      high: [],
      medium: [],
      low: []
    };

    this.results.issues.forEach(issue => {
      // By type
      if (!issuesByType[issue.type]) {
        issuesByType[issue.type] = {
          count: 0,
          severity: issue.severity,
          examples: []
        };
      }
      issuesByType[issue.type].count++;
      if (issuesByType[issue.type].examples.length < 3) {
        issuesByType[issue.type].examples.push(issue);
      }

      // By severity
      issuesBySeverity[issue.severity].push(issue);
    });

    // Calculate metrics
    const avgLinesPerFile = Math.round(this.results.lines / this.results.files);
    const avgFunctionsPerFile = Math.round(this.results.functions / this.results.files);
    const testCoveragePercent = Math.round(
      (this.results.testCoverage.hasTests / 
       (this.results.testCoverage.hasTests + this.results.testCoverage.missingTests)) * 100
    ) || 0;

    // Generate todo list
    this.generateTodoList(issuesByType, issuesBySeverity);

    // Create report
    let report = `# 🔥 ULTIMATE WASTE ANALYSIS REPORT

**Generated**: ${new Date().toLocaleString()}
**Project**: AI Guided SaaS
**Scope**: Complete project scan

## 📊 Executive Summary

### Project Metrics
- **Total Files**: ${this.results.files}
- **Total Lines**: ${this.results.lines.toLocaleString()}
- **Total Functions**: ${this.results.functions.toLocaleString()}
- **Total Classes**: ${this.results.classes.toLocaleString()}
- **Average Lines/File**: ${avgLinesPerFile}
- **Average Functions/File**: ${avgFunctionsPerFile}
- **Test Coverage**: ${testCoveragePercent}%
- **External Dependencies**: ${this.results.dependencies.size}

### Issue Summary
- **Total Issues Found**: ${this.results.issues.length}
- **Critical Issues**: ${issuesBySeverity.critical.length} 🔴
- **High Priority**: ${issuesBySeverity.high.length} 🟠
- **Medium Priority**: ${issuesBySeverity.medium.length} 🟡
- **Low Priority**: ${issuesBySeverity.low.length} 🟢

### Code Quality Score: ${this.calculateQualityScore(issuesBySeverity)}/100

## 🚨 Critical Issues (Must Fix Immediately)

${issuesBySeverity.critical.slice(0, 10).map(issue => 
  `- **${issue.type}** in \`${issue.file}:${issue.line}\`
  ${issue.message}`
).join('\n\n')}

## ⚠️ Issue Breakdown by Type

| Issue Type | Count | Severity | Priority |
|------------|-------|----------|----------|
${Object.entries(issuesByType)
  .sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a[1].severity] - severityOrder[b[1].severity] || b[1].count - a[1].count;
  })
  .map(([type, data]) => 
    `| ${type.replace(/_/g, ' ')} | ${data.count} | ${data.severity} | ${this.getPriority(data.severity)} |`
  ).join('\n')}

## 📋 Master Todo List

${this.todoList.map((todo, i) => `${i + 1}. ${todo}`).join('\n')}

## 🎯 Recommended Action Plan

### Phase 1: Critical Fixes (This Week)
1. Remove all debugger statements and eval() usage
2. Fix exposed secrets and API keys
3. Address security vulnerabilities (XSS, innerHTML)
4. Fix circular dependencies

### Phase 2: High Priority (Next 2 Weeks)
1. Split files over 500 lines
2. Add error handling to async functions
3. Remove console statements
4. Fix React performance issues

### Phase 3: Code Quality (Next Month)
1. Eliminate code duplication
2. Add proper TypeScript types (remove 'any')
3. Write tests for untested files
4. Refactor complex functions

### Phase 4: Optimization (Ongoing)
1. Optimize bundle size
2. Improve import/export structure
3. Standardize code formatting
4. Implement proper logging

## 📈 Metrics for Success

Track these metrics weekly:
- Critical issues: 0
- High priority issues: < 10
- Test coverage: > 80%
- Average file size: < 300 lines
- TypeScript 'any' usage: 0

## 🛠️ Tooling Recommendations

1. **Immediate Setup**:
   - ESLint with strict rules
   - Prettier for formatting
   - Husky for pre-commit hooks
   - Jest for testing

2. **CI/CD Integration**:
   - Block PRs with critical issues
   - Automated code quality checks
   - Test coverage requirements

3. **Monitoring**:
   - Weekly waste reports
   - Trend analysis
   - Team dashboards

---

**Full details saved to**: \`ultimate-waste-report-detailed.json\`
**Todo list saved to**: \`waste-elimination-todo.md\`

*Generated by Ultimate Waste Scanner*
`;

    // Save reports
    fs.writeFileSync('ultimate-waste-report.md', report);
    fs.writeFileSync('ultimate-waste-report-detailed.json', 
      JSON.stringify(this.results, null, 2));
    fs.writeFileSync('waste-elimination-todo.md', 
      this.generateDetailedTodoList());

    return report;
  }

  calculateQualityScore(issuesBySeverity) {
    let score = 100;
    score -= issuesBySeverity.critical.length * 10;
    score -= issuesBySeverity.high.length * 5;
    score -= issuesBySeverity.medium.length * 2;
    score -= issuesBySeverity.low.length * 0.5;
    return Math.max(0, Math.round(score));
  }

  getPriority(severity) {
    const priorities = {
      critical: 'P0 - Immediate',
      high: 'P1 - This Week',
      medium: 'P2 - This Month',
      low: 'P3 - When Possible'
    };
    return priorities[severity] || 'P3';
  }

  generateTodoList(issuesByType, issuesBySeverity) {
    this.todoList = [];

    // Critical items first
    if (issuesBySeverity.critical.length > 0) {
      this.todoList.push('🔴 **CRITICAL - Fix Today**');
      const criticalTypes = new Set(issuesBySeverity.critical.map(i => i.type));
      criticalTypes.forEach(type => {
        const count = issuesBySeverity.critical.filter(i => i.type === type).length;
        this.todoList.push(`   □ Fix all ${type.replace(/_/g, ' ')} issues (${count} instances)`);
      });
    }

    // High priority
    if (issuesBySeverity.high.length > 0) {
      this.todoList.push('\n🟠 **HIGH PRIORITY - Fix This Week**');
      const highTypes = new Set(issuesBySeverity.high.map(i => i.type));
      highTypes.forEach(type => {
        const count = issuesBySeverity.high.filter(i => i.type === type).length;
        this.todoList.push(`   □ Address ${type.replace(/_/g, ' ')} (${count} files affected)`);
      });
    }

    // Medium priority
    if (issuesBySeverity.medium.length > 0) {
      this.todoList.push('\n🟡 **MEDIUM PRIORITY - Fix This Month**');
      Object.entries(issuesByType)
        .filter(([_, data]) => data.severity === 'medium')
        .slice(0, 10)
        .forEach(([type, data]) => {
          this.todoList.push(`   □ Clean up ${type.replace(/_/g, ' ')} (${data.count} instances)`);
        });
    }

    // Process improvements
    this.todoList.push('\n🔧 **PROCESS IMPROVEMENTS**');
    this.todoList.push('   □ Set up ESLint with strict configuration');
    this.todoList.push('   □ Add pre-commit hooks to prevent new issues');
    this.todoList.push('   □ Implement code review checklist');
    this.todoList.push('   □ Set up automated testing pipeline');
    this.todoList.push('   □ Create coding standards documentation');

    // Long-term goals
    this.todoList.push('\n🎯 **LONG-TERM GOALS**');
    this.todoList.push('   □ Achieve 80% test coverage');
    this.todoList.push('   □ Reduce average file size to under 300 lines');
    this.todoList.push('   □ Eliminate all TypeScript "any" usage');
    this.todoList.push('   □ Implement proper error boundaries');
    this.todoList.push('   □ Set up performance monitoring');
  }

  generateDetailedTodoList() {
    let detailedList = `# 📋 Waste Elimination Todo List

Generated: ${new Date().toLocaleString()}

## Overview
This is your master todo list for eliminating all technical debt and waste from the AI Guided SaaS project.

${this.todoList.join('\n')}

## Detailed Action Items by File

### Critical Files to Fix First
`;

    // Group issues by file
    const issuesByFile = {};
    this.results.issues.forEach(issue => {
      if (!issuesByFile[issue.file]) {
        issuesByFile[issue.file] = [];
      }
      issuesByFile[issue.file].push(issue);
    });

    // Sort files by severity
    const sortedFiles = Object.entries(issuesByFile)
      .sort((a, b) => {
        const severityScore = (issues) => {
          return issues.reduce((score, issue) => {
            const weights = { critical: 1000, high: 100, medium: 10, low: 1 };
            return score + (weights[issue.severity] || 0);
          }, 0);
        };
        return severityScore(b[1]) - severityScore(a[1]);
      })
      .slice(0, 20); // Top 20 files

    sortedFiles.forEach(([file, issues]) => {
      detailedList += `\n#### ${file}\n`;
      issues
        .sort((a, b) => {
          const order = { critical: 0, high: 1, medium: 2, low: 3 };
          return order[a.severity] - order[b.severity];
        })
        .forEach(issue => {
          detailedList += `- [ ] [${issue.severity}] Line ${issue.line}: ${issue.message}\n`;
        });
    });

    return detailedList;
  }
}

// Run the ultimate scan
async function main() {
  const scanner = new UltimateWasteScanner();
  const srcPath = path.join(__dirname, 'src');
  
  const report = await scanner.scanProject(srcPath);
  
  console.log(report);
  console.log('\n✅ Scan complete! Check the following files:');
  console.log('   - ultimate-waste-report.md (Summary)');
  console.log('   - waste-elimination-todo.md (Action items)');
  console.log('   - ultimate-waste-report-detailed.json (Full data)');
}

main().catch(console.error);