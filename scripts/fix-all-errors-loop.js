#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Automated Fix-All-Errors Loop\n');
console.log('This script will continuously fix errors until none remain\n');

let iteration = 0;
let previousErrorCount = Infinity;
const maxIterations = 10;
const errorHistory = [];

// Helper function to run commands
function runCommand(command, silent = true) {
  try {
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit',
      maxBuffer: 1024 * 1024 * 10
    });
    return { success: true, output };
  } catch (error) {
    return { 
      success: false, 
      output: error.stdout || error.stderr || error.message 
    };
  }
}

// Get detailed error count
function getErrorCount() {
  const errors = {
    typescript: 0,
    eslint: 0,
    build: 0,
    total: 0
  };
  
  // Count TypeScript errors
  const tsResult = runCommand('npx tsc --noEmit 2>&1');
  if (tsResult.output) {
    errors.typescript = (tsResult.output.match(/error TS/g) || []).length;
  }
  
  // Count ESLint errors
  const eslintResult = runCommand('npx eslint . --format json 2>&1');
  if (eslintResult.output) {
    try {
      const eslintData = JSON.parse(eslintResult.output);
      eslintData.forEach(file => {
        errors.eslint += file.errorCount;
      });
    } catch (e) {
      // Fallback count
      const eslintCompact = runCommand('npx eslint . --format compact 2>&1');
      errors.eslint = (eslintCompact.output.match(/Error/g) || []).length;
    }
  }
  
  errors.total = errors.typescript + errors.eslint;
  return errors;
}

// Run various fix strategies
function runFixes(errorCounts) {
  console.log(`\n🔧 Iteration ${iteration + 1}/${maxIterations}`);
  console.log(`   TypeScript errors: ${errorCounts.typescript}`);
  console.log(`   ESLint errors: ${errorCounts.eslint}`);
  
  const fixes = [];
  
  // Prioritize fixes based on error types
  if (errorCounts.eslint > 0) {
    fixes.push(
      { cmd: 'npx eslint . --fix', name: 'ESLint auto-fix' },
      { cmd: 'npx prettier --write "src/**/*.{ts,tsx,js,jsx}" --ignore-path .gitignore', name: 'Prettier format' }
    );
  }
  
  if (errorCounts.typescript > 0) {
    fixes.push(
      { cmd: 'node scripts/fix-typescript-comprehensive.cjs', name: 'TypeScript comprehensive fix' },
      { cmd: 'node scripts/fix-critical-errors.cjs', name: 'Critical error fix' }
    );
    
    // Check if we have import issues
    const tsOutput = runCommand('npx tsc --noEmit 2>&1').output;
    if (tsOutput.includes('Cannot find module')) {
      fixes.push({ 
        cmd: 'npx organize-imports-cli "src/**/*.{ts,tsx}" --exit-on-errors false', 
        name: 'Organize imports' 
      });
    }
  }
  
  // Always run these
  fixes.push(
    { cmd: 'npm run fix:mcp', name: 'MCP module fix' },
    { cmd: 'node scripts/verify-mcp-integrity.cjs', name: 'MCP integrity check' }
  );
  
  // Execute fixes
  let successfulFixes = 0;
  fixes.forEach(fix => {
    try {
      process.stdout.write(`   Running ${fix.name}... `);
      const result = runCommand(fix.cmd);
      if (result.success) {
        console.log('✅');
        successfulFixes++;
      } else {
        console.log('⚠️');
      }
    } catch (error) {
      console.log('❌');
    }
  });
  
  return successfulFixes;
}

// Analyze specific error patterns
function analyzeErrors() {
  const analysis = {
    jsxErrors: 0,
    importErrors: 0,
    syntaxErrors: 0,
    typeErrors: 0
  };
  
  const tsResult = runCommand('npx tsc --noEmit 2>&1');
  if (tsResult.output) {
    analysis.jsxErrors = (tsResult.output.match(/TS17\d{3}/g) || []).length;
    analysis.importErrors = (tsResult.output.match(/Cannot find module/g) || []).length;
    analysis.syntaxErrors = (tsResult.output.match(/TS1\d{3}/g) || []).length;
    analysis.typeErrors = (tsResult.output.match(/TS2\d{3}/g) || []).length;
  }
  
  return analysis;
}

// Create targeted fix for specific error types
function runTargetedFixes(analysis) {
  console.log('\n🎯 Running targeted fixes based on error analysis...');
  
  if (analysis.jsxErrors > 100) {
    console.log('   Fixing JSX errors...');
    // Create a targeted JSX fix
    const jsxFix = `
      const fs = require('fs');
      const glob = require('glob');
      
      glob.sync('src/**/*.tsx').forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        
        // Fix common JSX patterns
        content = content.replace(/\\)\\s*<\\/(\\w+)>/g, ')');
        content = content.replace(/<\\/(\\w+)>\\s*<\\/(\\1)>/g, '</$1>');
        
        fs.writeFileSync(file, content);
      });
    `;
    fs.writeFileSync('temp-jsx-fix.js', jsxFix);
    runCommand('node temp-jsx-fix.js');
    fs.unlinkSync('temp-jsx-fix.js');
  }
  
  if (analysis.importErrors > 50) {
    console.log('   Fixing import errors...');
    runCommand('npx tsc --noEmit --listFiles | grep -v node_modules | xargs -I {} npx organize-imports-cli "{}"');
  }
}

// Main loop
console.log('🔍 Initial error count...');
let currentErrors = getErrorCount();
errorHistory.push({ iteration: 0, ...currentErrors });

while (iteration < maxIterations && currentErrors.total > 0) {
  console.log(`\n📊 Current total errors: ${currentErrors.total}`);
  
  // Check if we're making progress
  if (currentErrors.total >= previousErrorCount) {
    console.log('\n⚠️  No progress made in last iteration.');
    
    // Try more aggressive fixes
    const analysis = analyzeErrors();
    console.log('\n📈 Error analysis:');
    console.log(`   JSX errors: ${analysis.jsxErrors}`);
    console.log(`   Import errors: ${analysis.importErrors}`);
    console.log(`   Syntax errors: ${analysis.syntaxErrors}`);
    console.log(`   Type errors: ${analysis.typeErrors}`);
    
    runTargetedFixes(analysis);
    
    // If still no progress after 3 iterations, stop
    if (iteration > 3 && currentErrors.total >= errorHistory[iteration - 3].total) {
      console.log('\n❌ Unable to make further progress. Manual intervention required.');
      break;
    }
  }
  
  // Run fixes
  const fixesApplied = runFixes(currentErrors);
  
  // Update counts
  previousErrorCount = currentErrors.total;
  currentErrors = getErrorCount();
  errorHistory.push({ 
    iteration: iteration + 1, 
    ...currentErrors, 
    fixesApplied 
  });
  
  iteration++;
  
  // Success check
  if (currentErrors.total === 0) {
    console.log('\n✅ SUCCESS! All errors have been fixed.');
    break;
  }
}

// Final report
console.log('\n📊 FINAL REPORT');
console.log('════════════════');

console.log('\nError reduction history:');
errorHistory.forEach(({ iteration, total, typescript, eslint }) => {
  console.log(`   Iteration ${iteration}: ${total} total (TS: ${typescript}, ESLint: ${eslint})`);
});

const finalErrors = getErrorCount();
console.log(`\nFinal error count: ${finalErrors.total}`);
console.log(`   TypeScript: ${finalErrors.typescript}`);
console.log(`   ESLint: ${finalErrors.eslint}`);

if (finalErrors.total > 0) {
  console.log('\n❌ Some errors remain. Next steps:');
  console.log('1. Run: npx tsc --noEmit to see TypeScript errors');
  console.log('2. Run: npx eslint . to see ESLint errors');
  console.log('3. Check specific files with most errors');
  console.log('4. Consider manual fixes for complex issues');
  
  // List files with most errors
  console.log('\n📁 Files with most TypeScript errors:');
  const filesWithErrors = runCommand(
    'npx tsc --noEmit 2>&1 | grep "error TS" | cut -d"(" -f1 | sort | uniq -c | sort -nr | head -5'
  );
  if (filesWithErrors.output) {
    console.log(filesWithErrors.output);
  }
} else {
  console.log('\n✅ All errors have been successfully fixed!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run build - to verify build passes');
  console.log('2. Run: npm test - to ensure tests pass');
  console.log('3. Commit your changes');
}

// Save detailed report
const report = {
  timestamp: new Date().toISOString(),
  iterations: iteration,
  errorHistory,
  finalErrors,
  success: finalErrors.total === 0
};

fs.writeFileSync('fix-all-errors-report.json', JSON.stringify(report, null, 2));
console.log('\nDetailed report saved to fix-all-errors-report.json');

process.exit(finalErrors.total > 0 ? 1 : 0);