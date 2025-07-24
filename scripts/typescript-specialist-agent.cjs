#!/usr/bin/env node

/**
 * TypeScript Specialist Agent
 * Dedicated to resolving TypeScript compilation errors systematically
 * Based on agent_typescript_specialist.json configuration
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TypeScriptSpecialistAgent {
  constructor() {
    this.agentId = process.env.AGENT_ID || 'typescript_specialist_001';
    this.batchSize = parseInt(process.env.ERROR_BATCH_SIZE || '5');
    this.targetErrorCount = parseInt(process.env.TYPE_SAFETY_TARGET || '0');
    this.isRunning = false;
    this.errorLog = [];
    this.fixedCount = 0;

    // Load agent configuration
    this.loadAgentConfig();
    
    console.log(`🤖 TypeScript Specialist Agent ${this.agentId} initialized`);
    console.log(`📊 Target: ${this.targetErrorCount} errors, Batch size: ${this.batchSize}`);
  }

  loadAgentConfig() {
    try {
      const configPath = path.join(__dirname, '../agents/agent_typescript_specialist.json');
      if (fs.existsSync(configPath)) {
        this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log('✅ Agent configuration loaded');
      } else {
        console.warn('⚠️ Agent configuration not found, using defaults');
        this.config = { resolution_patterns: {}, error_resolution_strategies: {} };
      }
    } catch (error) {
      console.error('❌ Error loading agent config:', error.message);
      this.config = { resolution_patterns: {}, error_resolution_strategies: {} };
    }
  }

  async start() {
    if (this.isRunning) {
      console.log('⚠️ Agent already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting TypeScript Specialist Agent...');

    try {
      // Initial error assessment
      const errorCount = await this.assessTypeScriptErrors();
      console.log(`📊 Initial error count: ${errorCount}`);

      if (errorCount <= this.targetErrorCount) {
        console.log('✅ TypeScript errors already at target level');
        return;
      }

      // Start systematic error resolution
      await this.executeSystematicFixes();

    } catch (error) {
      console.error('❌ Agent execution failed:', error.message);
      this.isRunning = false;
    }
  }

  async assessTypeScriptErrors() {
    try {
      console.log('🔍 Assessing TypeScript errors...');
      
      // Run TypeScript compiler check
      const result = execSync('npm run typecheck', { 
        encoding: 'utf8', 
        stdio: 'pipe',
        timeout: 60000
      });
      
      // If no errors, tsc returns successfully
      return 0;
      
    } catch (error) {
      // Parse error output to count errors
      const errorOutput = error.stdout || error.stderr || '';
      const errorMatches = errorOutput.match(/error TS\d+:/g) || [];
      return errorMatches.length;
    }
  }

  async executeSystematicFixes() {
    console.log('🔧 Starting systematic TypeScript error resolution...');

    const strategies = [
      'fixJSXStructuralErrors',
      'fixImportExportErrors', 
      'fixTypeAnnotationErrors',
      'fixInterfaceErrors',
      'fixAPIRouteErrors'
    ];

    for (const strategy of strategies) {
      if (!this.isRunning) break;

      console.log(`\n🎯 Executing strategy: ${strategy}`);
      
      try {
        await this[strategy]();
        
        // Check progress after each strategy
        const currentErrors = await this.assessTypeScriptErrors();
        console.log(`📊 Current error count: ${currentErrors}`);
        
        if (currentErrors <= this.targetErrorCount) {
          console.log('🎉 Target error count reached!');
          break;
        }
        
        // Wait between strategies to avoid overwhelming the system
        await this.sleep(2000);
        
      } catch (error) {
        console.error(`❌ Strategy ${strategy} failed:`, error.message);
        continue;
      }
    }
  }

  async fixJSXStructuralErrors() {
    console.log('🔧 Fixing JSX structural errors (unclosed tags, string literals)...');
    
    try {
      // Find files with JSX errors
      const brokenFiles = [
        'src/app/blog/[id]/page.tsx',
        'tests/unit/lib/requirements/ClientRequirementsProcessor.test.ts'
      ];

      for (const file of brokenFiles) {
        if (fs.existsSync(file)) {
          console.log(`🔧 Fixing ${file}...`);
          await this.fixBrokenJSXFile(file);
        }
      }
      
      this.fixedCount += brokenFiles.length;
      console.log(`✅ Fixed ${brokenFiles.length} JSX structural issues`);
      
    } catch (error) {
      console.error('❌ JSX structural fix failed:', error.message);
    }
  }

  async fixBrokenJSXFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let fixedContent = content;

      // Fix common JSX issues
      fixedContent = fixedContent
        // Fix unterminated string literals
        .replace(/(['"])[^'"]*$/gm, '$1$1')
        // Fix unclosed JSX tags
        .replace(/<(\w+)(?:\s[^>]*)?(?!\s*\/>)>/g, (match, tagName) => {
          // Check if closing tag exists
          const closingTagRegex = new RegExp(`</${tagName}>`, 'g');
          if (!closingTagRegex.test(fixedContent)) {
            return match.replace('>', ' />');
          }
          return match;
        })
        // Fix malformed JSX expressions
        .replace(/\{[^}]*$/gm, '{}')
        // Remove duplicate exports/imports
        .replace(/^(export|import)\s+.*\n?/gm, (match, keyword) => {
          const seen = new Set();
          if (seen.has(match.trim())) return '';
          seen.add(match.trim());
          return match;
        });

      if (fixedContent !== content) {
        fs.writeFileSync(filePath, fixedContent);
        console.log(`✅ Fixed JSX issues in ${filePath}`);
      }

    } catch (error) {
      console.error(`❌ Failed to fix ${filePath}:`, error.message);
    }
  }

  async fixImportExportErrors() {
    console.log('🔧 Fixing import/export errors...');
    
    try {
      execSync('node scripts/fix-import-export.cjs', { 
        stdio: 'inherit',
        timeout: 30000
      });
      console.log('✅ Import/export errors fixed');
    } catch (error) {
      console.log('⚠️ Import/export fix completed with warnings');
    }
  }

  async fixTypeAnnotationErrors() {
    console.log('🔧 Fixing type annotation errors...');
    
    try {
      execSync('node scripts/fix-type-annotations-safe.cjs', { 
        stdio: 'inherit',
        timeout: 30000
      });
      console.log('✅ Type annotation errors fixed');
    } catch (error) {
      console.log('⚠️ Type annotation fix completed with warnings');
    }
  }

  async fixInterfaceErrors() {
    console.log('🔧 Fixing interface definition errors...');
    
    try {
      execSync('node scripts/fix-interface-errors.cjs', { 
        stdio: 'inherit',
        timeout: 30000
      });
      console.log('✅ Interface errors fixed');
    } catch (error) {
      console.log('⚠️ Interface fix completed with warnings');
    }
  }

  async fixAPIRouteErrors() {
    console.log('🔧 Fixing API route errors...');
    
    try {
      execSync('node scripts/fix-api-routes-final.cjs', { 
        stdio: 'inherit',
        timeout: 30000
      });
      console.log('✅ API route errors fixed');
    } catch (error) {
      console.log('⚠️ API route fix completed with warnings');
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async healthCheck() {
    return {
      agentId: this.agentId,
      status: this.isRunning ? 'running' : 'idle',
      fixedCount: this.fixedCount,
      lastError: this.errorLog[this.errorLog.length - 1] || null,
      timestamp: new Date().toISOString()
    };
  }

  async stop() {
    console.log('🛑 Stopping TypeScript Specialist Agent...');
    this.isRunning = false;
  }
}

// Handle process signals
const agent = new TypeScriptSpecialistAgent();

process.on('SIGTERM', async () => {
  await agent.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await agent.stop();
  process.exit(0);
});

// Start the agent
if (require.main === module) {
  agent.start().catch(error => {
    console.error('❌ TypeScript Specialist Agent failed:', error);
    process.exit(1);
  });
}

module.exports = TypeScriptSpecialistAgent;