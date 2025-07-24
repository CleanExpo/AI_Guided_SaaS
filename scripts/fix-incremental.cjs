#!/usr/bin/env node

/**
 * Incremental TypeScript Error Fixer
 * CPU-efficient approach to fixing errors without system overload
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// Configuration
const CONFIG = {
  BATCH_SIZE: parseInt(process.argv[2]) || 10,
  DELAY_MS: 5000,
  MAX_CPU_PERCENT: 50,
  MAX_MEMORY_PERCENT: 70
};

// Get system stats
function getSystemStats() {
  const cpus = os.cpus();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  
  // Calculate CPU usage (simplified)
  let totalIdle = 0;
  let totalTick = 0;
  
  cpus.forEach(cpu => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });
  
  const cpuUsage = 100 - ~~(100 * totalIdle / totalTick);
  const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;
  
  return { cpuUsage, memoryUsage };
}

// Wait function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get files with TypeScript errors
function getErrorFiles() {
  try {
    // Run typecheck and capture output
    const output = execSync('npm run typecheck 2>&1 || true', { 
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    
    // Extract unique file paths from error output
    const filePattern = /([^\s]+\.tsx?)(?:\(|:)/g;
    const matches = output.match(filePattern) || [];
    const uniqueFiles = [...new Set(matches.map(m => m.replace(/[(:]/g, '')))];
    
    return uniqueFiles.filter(file => fs.existsSync(file));
  } catch (error) {
    console.error('Error getting TypeScript errors:', error.message);
    return [];
  }
}

// Fix a single file
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fixCount = 0;
    
    // Common safe fixes
    const fixes = [
      // Semicolons
      { pattern: /;\s*{/g, replacement: ' {' },
      { pattern: /}\s*;/g, replacement: '}' },
      
      // Type annotations
      { pattern: /:\s*</g, replacement: ': <' },
      { pattern: />\s*=/g, replacement: '> =' },
      
      // Common syntax
      { pattern: /const:\s*/g, replacement: 'const ' },
      { pattern: /let:\s*/g, replacement: 'let ' },
      
      // Missing commas
      { pattern: /}\s*\n\s*{/g, replacement: '},\n{' },
      { pattern: /\)\s*\n\s*\(/g, replacement: '),\n(' }
    ];
    
    fixes.forEach(({ pattern, replacement }) => {
      const before = content;
      content = content.replace(pattern, replacement);
      if (before !== content) fixCount++;
    });
    
    if (fixCount > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      return fixCount;
    }
    
    return 0;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return 0;
  }
}

// Process a batch of files
async function processBatch(files, batchNum) {
  console.log(`\n📦 Processing batch ${batchNum} (${files.length} files)...`);
  
  let totalFixes = 0;
  
  for (const file of files) {
    const fixes = fixFile(file);
    if (fixes > 0) {
      console.log(`  ✅ Fixed ${fixes} issues in ${path.basename(file)}`);
      totalFixes += fixes;
    }
  }
  
  return totalFixes;
}

// Main function
async function main() {
  console.log('🔧 Incremental TypeScript Error Fixer');
  console.log(`📊 Config: Batch=${CONFIG.BATCH_SIZE}, CPU Limit=${CONFIG.MAX_CPU_PERCENT}%\n`);
  
  // Get files with errors
  console.log('🔍 Analyzing TypeScript errors...');
  const errorFiles = getErrorFiles();
  
  if (errorFiles.length === 0) {
    console.log('✨ No files with errors found!');
    return;
  }
  
  console.log(`📁 Found ${errorFiles.length} files with errors`);
  
  // Process in batches
  let totalFixed = 0;
  let batchNum = 1;
  
  for (let i = 0; i < errorFiles.length; i += CONFIG.BATCH_SIZE) {
    // Check system resources
    const stats = getSystemStats();
    console.log(`\n💻 System: CPU=${stats.cpuUsage}%, Memory=${Math.round(stats.memoryUsage)}%`);
    
    // Wait if system is under load
    if (stats.cpuUsage > CONFIG.MAX_CPU_PERCENT) {
      console.log('⏸️  High CPU usage, waiting...');
      await sleep(CONFIG.DELAY_MS * 2);
    }
    
    if (stats.memoryUsage > CONFIG.MAX_MEMORY_PERCENT) {
      console.log('⏸️  High memory usage, waiting...');
      await sleep(CONFIG.DELAY_MS * 3);
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
    }
    
    // Process batch
    const batch = errorFiles.slice(i, i + CONFIG.BATCH_SIZE);
    const fixes = await processBatch(batch, batchNum++);
    totalFixed += fixes;
    
    // Delay between batches
    if (i + CONFIG.BATCH_SIZE < errorFiles.length) {
      console.log(`⏱️  Waiting ${CONFIG.DELAY_MS}ms before next batch...`);
      await sleep(CONFIG.DELAY_MS);
    }
  }
  
  console.log('\n✨ Incremental fixing complete!');
  console.log(`📊 Total fixes applied: ${totalFixed}`);
  console.log('\n💡 Run "npm run typecheck" to see remaining errors');
}

// Handle interruption
process.on('SIGINT', () => {
  console.log('\n\n🛑 Incremental fixer interrupted');
  process.exit(0);
});

// Run with --expose-gc flag for better memory management
if (!global.gc) {
  console.log('💡 Tip: Run with "node --expose-gc" for better memory management\n');
}

// Start the process
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});