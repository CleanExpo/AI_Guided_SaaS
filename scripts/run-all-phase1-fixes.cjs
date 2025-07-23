#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎯 PHASE 1 COMPREHENSIVE: All Pattern Fixes');
console.log('Target: 70% error reduction from 18,397 errors');
console.log('Goal: Reduce to ~5,519 errors or less\n');

const PROJECT_ROOT = process.cwd();

// Track all fixes across phases
let totalFixesApplied = 0;
let totalFilesModified = 0;
let estimatedErrorsFixed = 0;

async function runPhase(phaseName, scriptPath, estimatedImpact) {
  console.log(`\n🚀 Running ${phaseName}...`);
  
  try {
    const output = execSync(`node "${scriptPath}"`, { 
      cwd: PROJECT_ROOT, 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    // Parse output for statistics
    const filesMatch = output.match(/Files fixed: (\d+)/);
    const changesMatch = output.match(/Total changes applied: (\d+)/);
    const errorReductionMatch = output.match(/Estimated error reduction: ~(\d+)/);
    
    if (filesMatch && changesMatch) {
      const filesFixed = parseInt(filesMatch[1]);
      const changesApplied = parseInt(changesMatch[1]);
      const errorReduction = errorReductionMatch ? parseInt(errorReductionMatch[1]) : changesApplied * estimatedImpact;
      
      totalFilesModified += filesFixed;
      totalFixesApplied += changesApplied;
      estimatedErrorsFixed += errorReduction;
      
      console.log(`✅ ${phaseName}: ${filesFixed} files, ${changesApplied} changes, ~${errorReduction} errors fixed`);
    } else {
      console.log(`⚠️  ${phaseName}: Could not parse statistics, assuming no changes`);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ ${phaseName} failed: ${error.message}`);
    return false;
  }
}

async function getTypeScriptErrorCount() {
  try {
    console.log('\n🔍 Checking current TypeScript error count...');
    const result = execSync('npx tsc --noEmit 2>&1 | grep "error TS" | wc -l', { 
      cwd: PROJECT_ROOT, 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    return parseInt(result.trim()) || 0;
  } catch (error) {
    console.log('⚠️  Could not get exact error count, using estimate');
    return 18397; // Fallback to last known count
  }
}

async function runAllPhase1Fixes() {
  console.log('🎬 Starting Phase 1 comprehensive pattern fixes...\n');
  
  const startingErrors = await getTypeScriptErrorCount();
  console.log(`📊 Starting TypeScript errors: ${startingErrors.toLocaleString()}`);
  
  // Run all Phase 1 scripts
  const phases = [
    {
      name: 'Phase 1a: Type Annotation Fixer',
      script: path.join(PROJECT_ROOT, 'scripts', 'fix-type-annotations-safe.cjs'),
      impact: 35
    },
    {
      name: 'Phase 1b: Interface Syntax Normalizer', 
      script: path.join(PROJECT_ROOT, 'scripts', 'fix-interface-syntax.cjs'),
      impact: 40
    },
    {
      name: 'Phase 1c: Import/Export Cleaner',
      script: path.join(PROJECT_ROOT, 'scripts', 'fix-import-export.cjs'),
      impact: 35
    },
    {
      name: 'Phase 1d: Generic Type Fixer',
      script: path.join(PROJECT_ROOT, 'scripts', 'fix-generic-types.cjs'),
      impact: 45
    }
  ];
  
  for (const phase of phases) {
    if (fs.existsSync(phase.script)) {
      await runPhase(phase.name, phase.script, phase.impact);
    } else {
      console.log(`⏭️  Skipping ${phase.name} (script not found)`);
    }
  }
  
  // Get final error count
  const endingErrors = await getTypeScriptErrorCount();
  const actualErrorsFixed = startingErrors - endingErrors;
  const reductionPercentage = ((actualErrorsFixed / startingErrors) * 100).toFixed(1);
  
  console.log('\n🎉 PHASE 1 COMPREHENSIVE COMPLETE!');
  console.log('=' * 50);
  console.log(`📊 Files modified: ${totalFilesModified}`);
  console.log(`📊 Total fixes applied: ${totalFixesApplied}`);
  console.log(`📊 Starting errors: ${startingErrors.toLocaleString()}`);
  console.log(`📊 Ending errors: ${endingErrors.toLocaleString()}`);
  console.log(`📊 Errors fixed: ${actualErrorsFixed.toLocaleString()}`);
  console.log(`📊 Reduction: ${reductionPercentage}%`);
  console.log(`📊 Estimated vs Actual: ${estimatedErrorsFixed.toLocaleString()} vs ${actualErrorsFixed.toLocaleString()}`);
  
  // Check if we hit our 70% target
  if (parseFloat(reductionPercentage) >= 70) {
    console.log('\n🎯 SUCCESS: 70% error reduction target achieved!');
    console.log('✅ Ready for Phase 2: Component-Specific Fixes');
  } else if (parseFloat(reductionPercentage) >= 50) {
    console.log('\n🔄 GOOD PROGRESS: 50%+ reduction achieved');
    console.log('🎯 Additional automated fixes needed to reach 70%');
  } else {
    console.log('\n🔄 PROGRESS MADE: Further automation needed');
    console.log('💡 Consider expanding pattern coverage or manual review');
  }
  
  return {
    startingErrors,
    endingErrors,
    actualErrorsFixed,
    reductionPercentage: parseFloat(reductionPercentage),
    totalFilesModified,
    totalFixesApplied
  };
}

// Execute Phase 1 comprehensive fixes
runAllPhase1Fixes().then((results) => {
  console.log('\n✨ Phase 1 analysis complete!');
  console.log(`🚀 Next: ${results.reductionPercentage >= 70 ? 'Phase 2 Component Fixes' : 'Expand Phase 1 coverage'}`);
}).catch(error => {
  console.error('❌ Phase 1 comprehensive failed:', error.message);
  process.exit(1);
});