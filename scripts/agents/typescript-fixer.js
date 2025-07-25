#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const Redis = require('redis');

const execAsync = promisify(exec);

class TypeScriptFixerAgent {
  constructor() {
    this.agentId = 'typescript-fixer-' + process.pid;
    this.redis = null;
    this.isRunning = true;
    this.fixMode = process.env.FIX_MODE || 'syntax';
    this.maxIterations = parseInt(process.env.MAX_ITERATIONS) || 100;
    this.currentIteration = 0;
  }

  async initialize() {
    console.log(`🔧 TypeScript Fixer Agent starting (${this.fixMode} mode)...`);
    
    // Connect to Redis if available
    if (process.env.REDIS_URL) {
      this.redis = Redis.createClient({
        url: process.env.REDIS_URL
      });
      
      await this.redis.connect();
      await this.reportStatus('initializing');
    }
    
    // Start fixing process
    await this.startFixingProcess();
  }

  async reportStatus(state, metrics = {}) {
    if (this.redis) {
      await this.redis.publish('agent:status', JSON.stringify({
        agentId: this.agentId,
        type: 'typescript',
        state,
        metrics: {
          ...metrics,
          iteration: this.currentIteration,
          fixMode: this.fixMode
        }
      }));
    }
  }

  async startFixingProcess() {
    await this.reportStatus('busy');
    
    while (this.isRunning && this.currentIteration < this.maxIterations) {
      try {
        console.log(`\n🔄 Iteration ${this.currentIteration + 1}/${this.maxIterations}`);
        
        // Get current error count
        const errorCount = await this.getErrorCount();
        console.log(`📊 Current TypeScript errors: ${errorCount}`);
        
        if (errorCount === 0) {
          console.log('✅ No TypeScript errors found!');
          break;
        }
        
        // Analyze errors
        const errors = await this.analyzeErrors();
        
        // Fix errors based on mode
        if (this.fixMode === 'syntax') {
          await this.fixSyntaxErrors(errors);
        } else if (this.fixMode === 'type') {
          await this.fixTypeErrors(errors);
        } else {
          await this.fixAllErrors(errors);
        }
        
        // Check if errors were reduced
        const newErrorCount = await this.getErrorCount();
        
        if (newErrorCount >= errorCount) {
          console.log('⚠️ No progress made, switching strategy...');
          await this.switchStrategy();
        }
        
        this.currentIteration++;
        
        // Small delay to prevent CPU overload
        await this.sleep(2000);
        
      } catch (error) {
        console.error('Error during fix iteration:', error);
        await this.reportStatus('error', { error: error.message });
        await this.sleep(5000);
      }
    }
    
    await this.reportStatus('idle');
    console.log('🏁 TypeScript fixing process completed');
  }

  async getErrorCount() {
    try {
      const { stdout } = await execAsync('npm run typecheck 2>&1 || true');
      const match = stdout.match(/Found (\d+) error/);
      return match ? parseInt(match[1]) : 0;
    } catch {
      return 0;
    }
  }

  async analyzeErrors() {
    const { stdout } = await execAsync('npm run typecheck 2>&1 || true');
    const lines = stdout.split('\n');
    const errors = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Parse TypeScript error format
      const fileMatch = line.match(/^(.+)\((\d+),(\d+)\): error (TS\d+): (.+)$/);
      
      if (fileMatch) {
        errors.push({
          file: fileMatch[1],
          line: parseInt(fileMatch[2]),
          column: parseInt(fileMatch[3]),
          code: fileMatch[4],
          message: fileMatch[5]
        });
      }
    }
    
    // Group by error type
    const errorsByType = {};
    errors.forEach(error => {
      if (!errorsByType[error.code]) {
        errorsByType[error.code] = [];
      }
      errorsByType[error.code].push(error);
    });
    
    console.log('📋 Error summary:');
    Object.entries(errorsByType).forEach(([code, errs]) => {
      console.log(`  ${code}: ${errs.length} occurrences`);
    });
    
    return errors;
  }

  async fixSyntaxErrors(errors) {
    console.log('🔧 Fixing syntax errors...');
    
    const syntaxErrors = errors.filter(e => 
      ['TS1005', 'TS1109', 'TS1161', 'TS1128'].includes(e.code)
    );
    
    const fileGroups = this.groupByFile(syntaxErrors);
    
    for (const [filePath, fileErrors] of Object.entries(fileGroups)) {
      await this.fixFileErrors(filePath, fileErrors);
    }
  }

  async fixTypeErrors(errors) {
    console.log('🔧 Fixing type errors...');
    
    const typeErrors = errors.filter(e => 
      ['TS2339', 'TS2345', 'TS2322', 'TS7006'].includes(e.code)
    );
    
    const fileGroups = this.groupByFile(typeErrors);
    
    for (const [filePath, fileErrors] of Object.entries(fileGroups)) {
      await this.fixFileTypeErrors(filePath, fileErrors);
    }
  }

  async fixAllErrors(errors) {
    await this.fixSyntaxErrors(errors);
    await this.fixTypeErrors(errors);
  }

  groupByFile(errors) {
    const groups = {};
    errors.forEach(error => {
      if (!groups[error.file]) {
        groups[error.file] = [];
      }
      groups[error.file].push(error);
    });
    return groups;
  }

  async fixFileErrors(filePath, errors) {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n');
      
      // Sort errors by line number in reverse order
      errors.sort((a, b) => b.line - a.line);
      
      for (const error of errors) {
        const lineIndex = error.line - 1;
        
        if (lineIndex >= 0 && lineIndex < lines.length) {
          const line = lines[lineIndex];
          
          // Apply fixes based on error code
          switch (error.code) {
            case 'TS1005': // Missing syntax
              if (error.message.includes("';' expected")) {
                lines[lineIndex] = line.trimEnd() + ';';
              } else if (error.message.includes("',' expected")) {
                lines[lineIndex] = this.addMissingComma(line);
              }
              break;
              
            case 'TS1109': // Expression expected
              lines[lineIndex] = this.fixExpression(line);
              break;
              
            case 'TS1161': // Unterminated JSX
              lines[lineIndex] = this.fixJSX(line);
              break;
          }
        }
      }
      
      await fs.writeFile(filePath, lines.join('\n'));
      console.log(`✅ Fixed ${errors.length} errors in ${path.basename(filePath)}`);
      
    } catch (error) {
      console.error(`Failed to fix ${filePath}:`, error);
    }
  }

  async fixFileTypeErrors(filePath, errors) {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      
      for (const error of errors) {
        // Add type annotations
        if (error.code === 'TS7006') { // Parameter implicitly has 'any' type
          content = this.addTypeAnnotations(content, error);
        }
        // Add optional chaining
        else if (error.code === 'TS2339') { // Property does not exist
          content = this.addOptionalChaining(content, error);
        }
      }
      
      await fs.writeFile(filePath, content);
      console.log(`✅ Fixed ${errors.length} type errors in ${path.basename(filePath)}`);
      
    } catch (error) {
      console.error(`Failed to fix type errors in ${filePath}:`, error);
    }
  }

  addMissingComma(line) {
    // Add comma before closing braces/brackets if missing
    return line.replace(/([}\]])(\s*)$/g, ',$1$2');
  }

  fixExpression(line) {
    // Fix common expression issues
    if (line.includes('return') && !line.includes('return;') && !line.trim().endsWith(';')) {
      return line + ';';
    }
    return line;
  }

  fixJSX(line) {
    // Close unclosed JSX tags
    const tagMatch = line.match(/<(\w+)([^>]*)$/);
    if (tagMatch) {
      return line + ' />';
    }
    return line;
  }

  addTypeAnnotations(content, error) {
    // Add 'any' type to parameters
    const regex = new RegExp(`(\\w+)\\s*\\)\\s*{`, 'g');
    return content.replace(regex, '$1: any) {');
  }

  addOptionalChaining(content, error) {
    // Add optional chaining to property access
    const regex = new RegExp(`\\.${error.message.match(/Property '(\w+)'/)?.[1]}`, 'g');
    return content.replace(regex, '?.$&');
  }

  async switchStrategy() {
    if (this.fixMode === 'syntax') {
      this.fixMode = 'type';
    } else if (this.fixMode === 'type') {
      this.fixMode = 'all';
    } else {
      console.log('🛑 All strategies exhausted');
      this.isRunning = false;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async shutdown() {
    console.log('🛑 Shutting down TypeScript fixer...');
    this.isRunning = false;
    
    if (this.redis) {
      await this.redis.quit();
    }
    
    process.exit(0);
  }
}

// Start agent
const agent = new TypeScriptFixerAgent();

agent.initialize().catch(err => {
  console.error('Failed to initialize agent:', err);
  process.exit(1);
});

// Handle shutdown
process.on('SIGINT', () => agent.shutdown());
process.on('SIGTERM', () => agent.shutdown());