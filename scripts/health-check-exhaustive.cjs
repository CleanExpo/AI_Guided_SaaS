#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Exhaustive Health Check System V2\n');

const results = {
  timestamp: new Date().toISOString(),
  typescript: { errors: 0, warnings: 0, files: [] },
  eslint: { errors: 0, warnings: 0, files: [] },
  tests: { failed: 0, passed: 0, coverage: 0 },
  build: { success: false, errors: [] },
  dependencies: { missing: 0, outdated: 0, vulnerabilities: {} },
  fileSystem: { missing: [], invalid: [] },
  performance: { buildTime: 0, bundleSize: 0 }
};

// Helper function to run commands
function runCommand(command, silent = false) {
  const start = Date.now();
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit',
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    const duration = Date.now() - start;
    return { success: true, output, duration };
  } catch (error) {
    const duration = Date.now() - start;
    return { 
      success: false, 
      output: error.stdout || error.stderr || error.message,
      duration
    };
  }
}

// 1. Check TypeScript
console.log('📘 TypeScript Check...');
const tsResult = runCommand('npx tsc --noEmit 2>&1', true);
if (!tsResult.success) {
  const errors = tsResult.output.split('\n').filter(line => line.includes('error TS'));
  results.typescript.errors = errors.length;
  
  // Group errors by file
  const errorsByFile = {};
  errors.forEach(error => {
    const match = error.match(/(.+?)\((\d+),(\d+)\):/);
    if (match) {
      const file = match[1];
      if (!errorsByFile[file]) errorsByFile[file] = 0;
      errorsByFile[file]++;
    }
  });
  
  // Get top 10 files with most errors
  results.typescript.files = Object.entries(errorsByFile)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([file, count]) => ({ file, count }));
  
  console.log(`❌ TypeScript: ${results.typescript.errors} errors found`);
  console.log('   Top files with errors:');
  results.typescript.files.forEach(({ file, count }) => {
    console.log(`   - ${path.relative(process.cwd(), file)}: ${count} errors`);
  });
} else {
  console.log('✅ TypeScript: Clean');
}

// 2. Check ESLint
console.log('\n📙 ESLint Check...');
const eslintResult = runCommand('npx eslint . --ext .ts,.tsx,.js,.jsx --format json', true);
if (eslintResult.output) {
  try {
    const eslintData = JSON.parse(eslintResult.output);
    eslintData.forEach(file => {
      if (file.errorCount > 0 || file.warningCount > 0) {
        results.eslint.errors += file.errorCount;
        results.eslint.warnings += file.warningCount;
        results.eslint.files.push({
          file: path.relative(process.cwd(), file.filePath),
          errors: file.errorCount,
          warnings: file.warningCount
        });
      }
    });
    
    if (results.eslint.errors > 0) {
      console.log(`❌ ESLint: ${results.eslint.errors} errors, ${results.eslint.warnings} warnings`);
      console.log('   Top files with issues:');
      results.eslint.files
        .sort((a, b) => b.errors - a.errors)
        .slice(0, 5)
        .forEach(({ file, errors, warnings }) => {
          console.log(`   - ${file}: ${errors} errors, ${warnings} warnings`);
        });
    } else if (results.eslint.warnings > 0) {
      console.log(`⚠️  ESLint: ${results.eslint.warnings} warnings`);
    } else {
      console.log('✅ ESLint: Clean');
    }
  } catch (e) {
    console.log('❌ ESLint: Failed to parse results');
  }
}

// 3. Check Dependencies
console.log('\n📦 Dependency Check...');
const depsResult = runCommand('npm list --depth=0 2>&1', true);
if (depsResult.output.includes('missing')) {
  results.dependencies.missing = (depsResult.output.match(/missing/g) || []).length;
  console.log(`❌ Dependencies: ${results.dependencies.missing} missing`);
} else {
  console.log('✅ Dependencies: All installed');
}

// Check for outdated dependencies
const outdatedResult = runCommand('npm outdated --json', true);
if (outdatedResult.output) {
  try {
    const outdated = JSON.parse(outdatedResult.output);
    results.dependencies.outdated = Object.keys(outdated).length;
    if (results.dependencies.outdated > 0) {
      console.log(`⚠️  Dependencies: ${results.dependencies.outdated} outdated packages`);
    }
  } catch (e) {
    // No outdated packages returns empty string
  }
}

// 4. Check for security vulnerabilities
console.log('\n🔒 Security Check...');
const auditResult = runCommand('npm audit --json', true);
try {
  const auditData = JSON.parse(auditResult.output);
  const vulns = auditData.metadata.vulnerabilities;
  results.dependencies.vulnerabilities = vulns;
  
  if (vulns.total > 0) {
    console.log(`⚠️  Security: ${vulns.total} vulnerabilities`);
    console.log(`   Critical: ${vulns.critical}, High: ${vulns.high}, Moderate: ${vulns.moderate}, Low: ${vulns.low}`);
  } else {
    console.log('✅ Security: No vulnerabilities');
  }
} catch (e) {
  console.log('⚠️  Security: Check failed');
}

// 5. Check tests (if available)
console.log('\n🧪 Test Suite Check...');
if (fs.existsSync('jest.config.js') || fs.existsSync('vitest.config.ts')) {
  const testResult = runCommand('npm test -- --passWithNoTests --json', true);
  if (testResult.output) {
    try {
      const testData = JSON.parse(testResult.output);
      results.tests.passed = testData.numPassedTests || 0;
      results.tests.failed = testData.numFailedTests || 0;
      console.log(`Tests: ${results.tests.passed} passed, ${results.tests.failed} failed`);
    } catch (e) {
      console.log('⚠️  Tests: Could not parse results');
    }
  }
} else {
  console.log('⚠️  Tests: No test configuration found');
}

// 6. Build check
console.log('\n🏗️  Build Check...');
const buildStart = Date.now();
const buildResult = runCommand('npm run build 2>&1', true);
results.performance.buildTime = (Date.now() - buildStart) / 1000; // seconds

if (buildResult.success) {
  results.build.success = true;
  console.log(`✅ Build: Successful (${results.performance.buildTime.toFixed(1)}s)`);
  
  // Check build size
  if (fs.existsSync('.next')) {
    const sizeResult = runCommand('du -sh .next', true);
    if (sizeResult.success) {
      results.performance.bundleSize = sizeResult.output.split('\t')[0];
      console.log(`   Bundle size: ${results.performance.bundleSize}`);
    }
  }
} else {
  console.log(`❌ Build: Failed (${results.performance.buildTime.toFixed(1)}s)`);
  // Extract build errors
  const buildErrors = buildResult.output.split('\n')
    .filter(line => line.includes('error') || line.includes('Error'))
    .slice(0, 10);
  results.build.errors = buildErrors;
}

// 7. File system checks
console.log('\n📁 File System Check...');
const requiredDirs = ['src', 'public', 'scripts', 'src/components', 'src/lib', 'src/app'];
const requiredFiles = ['package.json', 'tsconfig.json', 'next.config.js', '.env.local'];

requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    results.fileSystem.missing.push(dir);
  }
});

requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    results.fileSystem.missing.push(file);
  }
});

if (results.fileSystem.missing.length > 0) {
  console.log(`❌ Missing: ${results.fileSystem.missing.join(', ')}`);
} else {
  console.log('✅ File structure: Complete');
}

// 8. Check for common issues
console.log('\n🔎 Common Issues Check...');
const commonIssues = [];

// Check for console.log statements
const consoleLogResult = runCommand('grep -r "console.log" src/ --include="*.ts" --include="*.tsx" | wc -l', true);
if (consoleLogResult.success) {
  const count = parseInt(consoleLogResult.output.trim());
  if (count > 0) {
    commonIssues.push(`${count} console.log statements found`);
  }
}

// Check for TODO comments
const todoResult = runCommand('grep -r "TODO\\|FIXME\\|HACK" src/ --include="*.ts" --include="*.tsx" | wc -l', true);
if (todoResult.success) {
  const count = parseInt(todoResult.output.trim());
  if (count > 0) {
    commonIssues.push(`${count} TODO/FIXME comments found`);
  }
}

if (commonIssues.length > 0) {
  console.log('⚠️  Common issues:');
  commonIssues.forEach(issue => console.log(`   - ${issue}`));
} else {
  console.log('✅ No common issues found');
}

// Summary and scoring
console.log('\n📊 HEALTH CHECK SUMMARY');
console.log('═══════════════════════════════');

const score = calculateHealthScore(results);
results.healthScore = score;

const totalErrors = results.typescript.errors + results.eslint.errors;
const totalWarnings = results.eslint.warnings;

console.log(`Health Score: ${score}/100`);
console.log(`Total Errors: ${totalErrors}`);
console.log(`Total Warnings: ${totalWarnings}`);
console.log(`Build Status: ${results.build.success ? '✅ Passing' : '❌ Failing'}`);

if (score >= 90) {
  console.log('\n✅ SYSTEM HEALTHY - Excellent condition');
} else if (score >= 70) {
  console.log('\n⚠️  SYSTEM NEEDS ATTENTION - Several issues to address');
} else {
  console.log('\n❌ SYSTEM UNHEALTHY - Critical issues require immediate attention');
}

// Export results
fs.writeFileSync('health-check-results.json', JSON.stringify(results, null, 2));
console.log('\nDetailed results saved to health-check-results.json');

// Generate recommendations
console.log('\n📋 RECOMMENDATIONS:');
const recommendations = generateRecommendations(results);
recommendations.forEach((rec, i) => {
  console.log(`${i + 1}. ${rec}`);
});

process.exit(totalErrors > 0 || !results.build.success ? 1 : 0);

// Helper functions
function calculateHealthScore(results) {
  let score = 100;
  
  // Deduct for errors (major impact)
  score -= Math.min(results.typescript.errors * 0.5, 30);
  score -= Math.min(results.eslint.errors * 0.3, 20);
  
  // Deduct for warnings (minor impact)
  score -= Math.min(results.eslint.warnings * 0.1, 10);
  
  // Deduct for failed build
  if (!results.build.success) score -= 20;
  
  // Deduct for missing dependencies
  score -= results.dependencies.missing * 2;
  
  // Deduct for security vulnerabilities
  const vulns = results.dependencies.vulnerabilities;
  if (vulns.critical > 0) score -= vulns.critical * 5;
  if (vulns.high > 0) score -= vulns.high * 3;
  if (vulns.moderate > 0) score -= vulns.moderate * 1;
  
  // Deduct for failed tests
  if (results.tests.failed > 0) score -= Math.min(results.tests.failed * 2, 10);
  
  return Math.max(0, Math.round(score));
}

function generateRecommendations(results) {
  const recs = [];
  
  if (results.typescript.errors > 0) {
    recs.push(`Fix ${results.typescript.errors} TypeScript errors - Run: npm run fix:typescript`);
  }
  
  if (results.eslint.errors > 0) {
    recs.push(`Fix ${results.eslint.errors} ESLint errors - Run: npm run fix:eslint`);
  }
  
  if (!results.build.success) {
    recs.push('Fix build errors - Check build output for details');
  }
  
  if (results.dependencies.missing > 0) {
    recs.push('Install missing dependencies - Run: npm install');
  }
  
  if (results.dependencies.vulnerabilities.total > 0) {
    recs.push(`Fix ${results.dependencies.vulnerabilities.total} security vulnerabilities - Run: npm audit fix`);
  }
  
  if (results.tests.failed > 0) {
    recs.push(`Fix ${results.tests.failed} failing tests - Run: npm test`);
  }
  
  if (recs.length === 0) {
    recs.push('Keep up the good work! Consider adding more tests for better coverage.');
  }
  
  return recs;
}