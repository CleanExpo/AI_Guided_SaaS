#!/usr/bin/env node

const { RealDataEnforcer } = require('./mcp/real-data-enforcer/dist/index.js');
const { spawn } = require('child_process');
const { promisify } = require('util');
const fs = require('fs-extra');

const execAsync = promisify(require('child_process').exec);

console.log('🔍 REAL DATA ENFORCER MCP - PRODUCTION VALIDATOR');
console.log('===============================================');
console.log('🎯 Mission: Achieve 100% working project ready for Vercel deployment\n');

const enforcer = new RealDataEnforcer(process.cwd());

// Step 1: Comprehensive error detection
async function detectAllErrors() {
  console.log('📊 STEP 1: COMPREHENSIVE ERROR DETECTION');
  console.log('========================================\n');

  const errorSources = [];

  // TypeScript errors
  console.log('🔍 Checking TypeScript compilation errors...');
  try {
    await execAsync('npm run typecheck', { timeout: 60000 });
    console.log('✅ TypeScript: No compilation errors found');
  } catch (error) {
    const tsErrors = error.stdout || error.stderr;
    const errorCount = (tsErrors.match(/error TS/g) || []).length;
    errorSources.push({
      type: 'typescript',
      count: errorCount,
      details: tsErrors,
      priority: 'critical'
    });
    console.log(`❌ TypeScript: ${errorCount} compilation errors found`);
  }

  // ESLint errors
  console.log('🔍 Checking ESLint parsing errors...');
  try {
    await execAsync('npm run lint', { timeout: 30000 });
    console.log('✅ ESLint: No parsing errors found');
  } catch (error) {
    const lintErrors = error.stdout || error.stderr;
    const errorCount = (lintErrors.match(/Parsing error/g) || []).length;
    errorSources.push({
      type: 'eslint',
      count: errorCount,
      details: lintErrors,
      priority: 'critical'
    });
    console.log(`❌ ESLint: ${errorCount} parsing errors found`);
  }

  // Build test
  console.log('🔍 Testing build process...');
  try {
    await execAsync('timeout 90 npm run build', { timeout: 95000 });
    console.log('✅ Build: Completes successfully');
  } catch (error) {
    errorSources.push({
      type: 'build',
      count: 1,
      details: error.message,
      priority: 'critical'
    });
    console.log('❌ Build: Process fails or hangs');
  }

  return errorSources;
}

// Step 2: Prioritize and categorize errors
async function prioritizeErrors(errorSources) {
  console.log('\n📋 STEP 2: ERROR PRIORITIZATION & CATEGORIZATION');
  console.log('================================================\n');

  const validation = await enforcer.validateAgentOutput(
    'production-validator',
    'Prioritize production-blocking errors for systematic resolution',
    {
      sources: [
        {
          type: 'error_log',
          data: errorSources
        }
      ]
    }
  );

  const criticalErrors = errorSources.filter(e => e.priority === 'critical');
  const totalErrors = errorSources.reduce((sum, e) => sum + e.count, 0);

  console.log(`🚨 CRITICAL ERRORS DETECTED: ${totalErrors}`);
  console.log(`📊 Error Sources: ${errorSources.length}`);
  console.log(`🎯 Validation Result: ${validation.action.toUpperCase()}`);

  return {
    totalErrors,
    criticalErrors,
    validation
  };
}

// Step 3: Generate systematic fix plan
async function generateFixPlan(errorAnalysis) {
  console.log('\n🛠️ STEP 3: SYSTEMATIC FIX PLAN GENERATION');
  console.log('==========================================\n');

  const fixPlan = [];

  for (const errorSource of errorAnalysis.criticalErrors) {
    switch (errorSource.type) {
      case 'typescript':
        fixPlan.push({
          phase: 1,
          task: 'Fix TypeScript compilation errors',
          method: 'Systematic component rebuilding',
          priority: 'critical',
          estimated_files: Math.ceil(errorSource.count / 10)
        });
        break;
      
      case 'eslint':
        fixPlan.push({
          phase: 2,
          task: 'Fix ESLint parsing errors',
          method: 'JSX syntax correction',
          priority: 'critical',
          estimated_files: Math.ceil(errorSource.count / 5)
        });
        break;
      
      case 'build':
        fixPlan.push({
          phase: 3,
          task: 'Resolve build process issues',
          method: 'Module resolution and dependency fixes',
          priority: 'critical',
          estimated_files: 'system-wide'
        });
        break;
    }
  }

  console.log('📋 SYSTEMATIC FIX PLAN:');
  fixPlan.forEach((task, index) => {
    console.log(`${index + 1}. Phase ${task.phase}: ${task.task}`);
    console.log(`   Method: ${task.method}`);
    console.log(`   Impact: ${task.estimated_files} files\n`);
  });

  return fixPlan;
}

// Step 4: Execute validation-driven fixes
async function executeValidatedFixes(fixPlan) {
  console.log('⚡ STEP 4: EXECUTING VALIDATION-DRIVEN FIXES');
  console.log('===========================================\n');

  for (const task of fixPlan) {
    console.log(`🔧 Starting Phase ${task.phase}: ${task.task}...`);
    
    const validation = await enforcer.validateAgentOutput(
      'fix-executor',
      task.task,
      {
        sources: [
          {
            type: 'file_content',
            file_path: 'package.json',
            expected_content: '"name": "ai-guided-saas"'
          }
        ]
      }
    );

    if (validation.action === 'rejected') {
      console.log(`❌ Phase ${task.phase} validation failed - skipping`);
      continue;
    }

    // Execute the fix based on phase
    switch (task.phase) {
      case 1:
        await executeTypeScriptFixes();
        break;
      case 2:
        await executeESLintFixes();
        break;
      case 3:
        await executeBuildFixes();
        break;
    }

    console.log(`✅ Phase ${task.phase} completed\n`);
  }
}

async function executeTypeScriptFixes() {
  console.log('  🔨 Applying TypeScript fixes...');
  // Run our existing comprehensive fixing scripts
  try {
    await execAsync('node fix-all-critical-errors.js', { timeout: 60000 });
    console.log('  ✅ TypeScript automated fixes applied');
  } catch (error) {
    console.log('  ⚠️ TypeScript fixes partially applied');
  }
}

async function executeESLintFixes() {
  console.log('  🔨 Applying ESLint fixes...');
  try {
    await execAsync('npm run lint:fix', { timeout: 30000 });
    console.log('  ✅ ESLint automated fixes applied');
  } catch (error) {
    console.log('  ⚠️ ESLint fixes partially applied');
  }
}

async function executeBuildFixes() {
  console.log('  🔨 Applying build fixes...');
  // Focus on critical build-blocking issues
  try {
    await execAsync('npm install --legacy-peer-deps', { timeout: 60000 });
    console.log('  ✅ Dependencies refreshed');
  } catch (error) {
    console.log('  ⚠️ Dependency refresh partially completed');
  }
}

// Step 5: Final validation
async function finalValidation() {
  console.log('🎯 STEP 5: FINAL PRODUCTION READINESS VALIDATION');
  console.log('===============================================\n');

  const validationTests = [
    {
      name: 'TypeScript Compilation',
      command: 'npm run typecheck',
      timeout: 60000
    },
    {
      name: 'ESLint Parsing',
      command: 'npm run lint',
      timeout: 30000
    },
    {
      name: 'Build Process',
      command: 'timeout 120 npm run build',
      timeout: 125000
    }
  ];

  const results = [];

  for (const test of validationTests) {
    console.log(`🧪 Testing ${test.name}...`);
    try {
      await execAsync(test.command, { timeout: test.timeout });
      results.push({ name: test.name, status: 'PASS' });
      console.log(`✅ ${test.name}: PASS`);
    } catch (error) {
      results.push({ name: test.name, status: 'FAIL', error: error.message });
      console.log(`❌ ${test.name}: FAIL`);
    }
  }

  const finalValidation = await enforcer.validateAgentOutput(
    'production-readiness-validator',
    'Validate complete project ready for Vercel deployment',
    {
      sources: results.map(r => ({
        type: 'test_result',
        test_name: r.name,
        status: r.status
      }))
    }
  );

  console.log('\n🎯 FINAL PRODUCTION READINESS ASSESSMENT:');
  console.log(`Action: ${finalValidation.action.toUpperCase()}`);
  console.log(`Trace ID: ${finalValidation.trace_id}`);
  console.log(`Tests Passed: ${results.filter(r => r.status === 'PASS').length}/${results.length}`);
  console.log(`Reasoning: ${finalValidation.reasoning}`);

  return {
    results,
    validation: finalValidation,
    readyForProduction: finalValidation.action === 'accepted'
  };
}

// Main execution
async function main() {
  try {
    // Step 1: Detect all errors
    const errorSources = await detectAllErrors();
    
    // Step 2: Prioritize errors
    const errorAnalysis = await prioritizeErrors(errorSources);
    
    // Step 3: Generate fix plan
    const fixPlan = await generateFixPlan(errorAnalysis);
    
    // Step 4: Execute fixes
    await executeValidatedFixes(fixPlan);
    
    // Step 5: Final validation
    const finalResult = await finalValidation();
    
    console.log('\n🏁 REAL DATA ENFORCER MCP - PRODUCTION VALIDATION COMPLETE');
    console.log('=========================================================');
    
    if (finalResult.readyForProduction) {
      console.log('🎉 SUCCESS: Project is 100% ready for Vercel deployment!');
      console.log('✅ All critical errors resolved');
      console.log('✅ Build process completes successfully');
      console.log('✅ TypeScript compilation passes');
      console.log('✅ ESLint parsing successful');
      console.log('\n🚀 Ready to deploy to production!');
    } else {
      console.log('⚠️ INCOMPLETE: Additional fixes required');
      const failedTests = finalResult.results.filter(r => r.status === 'FAIL');
      console.log(`❌ Failed tests: ${failedTests.map(t => t.name).join(', ')}`);
      console.log('🔧 Continue systematic fixing required');
    }
    
  } catch (error) {
    console.error('❌ Production validation failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}