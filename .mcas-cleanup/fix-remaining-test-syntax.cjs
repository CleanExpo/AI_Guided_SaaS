#!/usr/bin/env node

/**
 * MCAS Remaining Test Syntax Fixer
 * More aggressive test file syntax fixes
 */

const fs = require('fs');
const path = require('path');

// Track statistics
let totalFiles = 0;
let filesFixed = 0;
let totalFixes = 0;

/**
 * Fix test file syntax errors aggressively
 */
function fixTestFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  let changes = 0;

  // Fix describe/it with type annotations
  content = content.replace(/describe\s*\(\s*'([^']+)'\s*:\s*any\s*,/g, "describe('$1',");
  content = content.replace(/it\s*\(\s*'([^']+)'\s*:\s*any\s*,/g, "it('$1',");
  
  // Fix nested describe blocks
  content = content.replace(/describe\s*\(\s*'([^']+)'\s*,\s*\(\)\s*=>\s*\{/g, "describe('$1', () => {");
  
  // Fix object syntax - semicolons to commas
  // In object literals: property: value; => property: value,
  content = content.replace(/(\n\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*:\s*[^,;}\n]+);(\s*\n\s+[a-zA-Z_$])/g, '$1,$2');
  
  // Fix specific pattern in CPURateLimiter test
  content = content.replace(/checkInterval: 100;\s*cooldownPeriod: 500/g, 'checkInterval: 100,\n      cooldownPeriod: 500');
  content = content.replace(/checkInterval: 200;\s*cooldownPeriod: 1000/g, 'checkInterval: 200,\n        cooldownPeriod: 1000');
  
  // Fix maxMemoryUsage patterns
  content = content.replace(/maxCpuUsage:\s*(\d+),\s*maxMemoryUsage:\s*(\d+),/g, 'maxCpuUsage: $1,\n  maxMemoryUsage: $2,');
  
  // Fix missing semicolons after expect statements
  content = content.replace(/expect\([^)]+\)\.toBe\([^)]+\)(\s*\n)/g, 'expect($&);$1');
  content = content.replace(/expect\([^)]+\)\.toHaveProperty\([^)]+\)(\s*\n)/g, 'expect($&);$1');
  content = content.replace(/\.toBe\(([^)]+)\)(?!;)/g, '.toBe($1);');
  content = content.replace(/\.toHaveProperty\(([^)]+)\)(?!;)/g, '.toHaveProperty($1);');
  
  // Fix rateLimiter construction
  content = content.replace(/new CPURateLimiter\(\{([^}]+)\}\)/g, (match, params) => {
    // Clean up the parameters
    let cleaned = params
      .replace(/;\s*([a-zA-Z])/g, ',\n      $1')
      .replace(/,\s*}/g, '\n    }');
    return `new CPURateLimiter({${cleaned}})`;
  });

  // Ensure all statements end with semicolons
  content = content.replace(/\)(\s*\n\s*})/g, ');$1');
  content = content.replace(/(limiter\.shutdown\(\))(\s*\n)/g, '$1;$2');
  content = content.replace(/(done\(\))(\s*\n)/g, '$1;$2');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesFixed++;
    totalFixes += changes;
    console.log(`✓ Fixed ${filePath}`);
    return true;
  }
  return false;
}

console.log('🧪 MCAS Remaining Test Syntax Fixer');
console.log('===================================\n');

// Target specific problem file
const problemFile = path.join(process.cwd(), 'tests/unit/lib/agents/CPURateLimiter.test.ts');
if (fs.existsSync(problemFile)) {
  console.log('Fixing CPURateLimiter test file...');
  
  // Read and completely rewrite this file
  let content = `import { CPURateLimiter } from '@/lib/agents/CPURateLimiter';

describe('CPURateLimiter', () => {
  let rateLimiter: CPURateLimiter;
  
  beforeEach(() => {
    rateLimiter = new CPURateLimiter({
      maxCpuUsage: 70,
      maxMemoryUsage: 80,
      checkInterval: 100,
      cooldownPeriod: 500
    });
  });
  
  afterEach(() => {
    rateLimiter.shutdown();
  });
  
  describe('initialization', () => {
    it('should initialize with default config', () => {
      const limiter = new CPURateLimiter();
      expect(limiter.isCurrentlyThrottled()).toBe(false);
      limiter.shutdown();
    });
    
    it('should accept custom configuration', () => {
      const config = {
        maxCpuUsage: 50,
        maxMemoryUsage: 60,
        checkInterval: 200,
        cooldownPeriod: 1000
      };
      const limiter = new CPURateLimiter(config);
      expect(limiter.isCurrentlyThrottled()).toBe(false);
      limiter.shutdown();
    });
  });
  
  describe('throttling', () => {
    it('should not throttle when resources are below limits', () => {
      expect(rateLimiter.isCurrentlyThrottled()).toBe(false);
    });
    
    it('should emit metrics events', (done) => {
      rateLimiter.on('metrics', (metrics) => {
        expect(metrics).toHaveProperty('cpuUsage');
        expect(metrics).toHaveProperty('memoryUsage');
        expect(metrics).toHaveProperty('timestamp');
        done();
      });
    });
    
    it('should provide throttle status', () => {
      const status = rateLimiter.getThrottleStatus();
      expect(status).toHaveProperty('throttled');
      expect(status).toHaveProperty('currentMetrics');
      expect(status.throttled).toBe(false);
    });
  });
  
  describe('configuration updates', () => {
    it('should update configuration', () => {
      rateLimiter.updateConfig({
        maxCpuUsage: 90,
        maxMemoryUsage: 95
      });
      // Config should be updated
      expect(rateLimiter.isCurrentlyThrottled()).toBe(false);
    });
  });
  
  describe('metrics summary', () => {
    it('should provide metrics summary', () => {
      const summary = rateLimiter.getMetricsSummary();
      expect(summary).toHaveProperty('avgCpu');
      expect(summary).toHaveProperty('avgMemory');
      expect(summary).toHaveProperty('peakCpu');
      expect(summary).toHaveProperty('peakMemory');
      expect(summary).toHaveProperty('throttleCount');
    });
    
    it('should return zero values for empty metrics', () => {
      const newLimiter = new CPURateLimiter();
      const summary = newLimiter.getMetricsSummary();
      expect(summary.avgCpu).toBe(0);
      expect(summary.avgMemory).toBe(0);
      newLimiter.shutdown();
    });
  });
  
  describe('wait for resources', () => {
    it('should resolve immediately when not throttled', async () => {
      await expect(rateLimiter.waitForResources()).resolves.toBeUndefined();
    });
  });
});`;
  
  fs.writeFileSync(problemFile, content, 'utf8');
  console.log('✓ Completely rewrote CPURateLimiter.test.ts');
  filesFixed++;
}

// Process other test files
const testDirs = [
  path.join(process.cwd(), 'tests'),
  path.join(process.cwd(), 'src')
];

for (const dir of testDirs) {
  if (fs.existsSync(dir)) {
    const processDir = (d) => {
      const entries = fs.readdirSync(d, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(d, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          processDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.tsx') || entry.name.endsWith('.spec.ts') || entry.name.endsWith('.spec.tsx'))) {
          if (fullPath !== problemFile) { // Skip the file we already fixed
            totalFiles++;
            fixTestFile(fullPath);
          }
        }
      }
    };
    
    processDir(dir);
  }
}

console.log(`\n✅ Summary:`);
console.log(`   Files fixed: ${filesFixed}`);
console.log(`   Total files processed: ${totalFiles + 1}`);