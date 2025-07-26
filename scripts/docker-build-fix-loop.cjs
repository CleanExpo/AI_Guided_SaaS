#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Configuration
const MAX_ITERATIONS = 10;
const DOCKER_IMAGE = 'ai-saas-vercel-test';
const DOCKERFILE = 'Dockerfile.vercel';

// Error patterns to detect
const ERROR_PATTERNS = {
  typescript: /error TS(\d+):\s*(.*)/g,
  eslint: /(\d+):(\d+)\s+error\s+(.*?)\s+(.+)/g,
  nextjs: /Error:.*?at\s+(.*?):(\d+):(\d+)/g,
  syntax: /SyntaxError:.*?at\s+(.*?):(\d+):(\d+)/g,
  module: /Cannot find module\s+'(.+?)'/g,
  jsx: /Expected.*?got.*?at\s+(.*?):(\d+):(\d+)/g
};

class DockerBuildFixLoop {
  constructor() {
    this.iteration = 0;
    this.fixedErrors = [];
    this.allErrors = [];
  }

  async run() {
    console.log(chalk.blue('🚀 Starting Docker Build-Fix Loop\n'));
    
    while (this.iteration < MAX_ITERATIONS) {
      this.iteration++;
      console.log(chalk.yellow(`\n📦 Iteration ${this.iteration}/${MAX_ITERATIONS}`));
      
      // Build Docker image
      const buildResult = await this.buildDocker();
      
      if (buildResult.success) {
        console.log(chalk.green('\n✅ All checks passed! Build is clean.\n'));
        this.printSummary();
        return true;
      }
      
      // Parse errors from build output
      const errors = this.parseErrors(buildResult.output);
      
      if (errors.length === 0) {
        console.log(chalk.yellow('\n⚠️  Build failed but no specific errors detected.'));
        console.log('Output:', buildResult.output.slice(-500));
        break;
      }
      
      console.log(chalk.red(`\n❌ Found ${errors.length} errors to fix`));
      
      // Attempt to fix errors
      const fixResults = await this.fixErrors(errors);
      
      if (fixResults.fixed === 0) {
        console.log(chalk.red('\n❌ Could not fix any errors. Manual intervention required.'));
        break;
      }
      
      console.log(chalk.green(`\n✅ Fixed ${fixResults.fixed}/${errors.length} errors`));
    }
    
    console.log(chalk.red('\n❌ Max iterations reached or unable to fix remaining errors.'));
    this.printSummary();
    return false;
  }
  
  async buildDocker() {
    console.log(chalk.blue('🔨 Building Docker image...'));
    
    try {
      const output = execSync(
        `docker build -f ${DOCKERFILE} -t ${DOCKER_IMAGE} . 2>&1`,
        { 
          encoding: 'utf8',
          maxBuffer: 10 * 1024 * 1024 // 10MB buffer
        }
      );
      
      // Check if build was successful
      if (output.includes('Successfully built') || output.includes('writing image')) {
        // Extract logs from the build
        const logs = this.extractBuildLogs(output);
        
        // Check for errors in the logs
        const hasErrors = logs.some(log => 
          log.includes('error') || 
          log.includes('Error:') || 
          log.includes('failed')
        );
        
        if (!hasErrors) {
          return { success: true, output };
        }
      }
      
      return { success: false, output };
    } catch (error) {
      return { 
        success: false, 
        output: error.stdout || error.message 
      };
    }
  }
  
  extractBuildLogs(dockerOutput) {
    const logs = [];
    const lines = dockerOutput.split('\n');
    
    let inBuildOutput = false;
    for (const line of lines) {
      if (line.includes('Running TypeScript check') || 
          line.includes('Running ESLint') || 
          line.includes('Running Next.js build')) {
        inBuildOutput = true;
      }
      
      if (inBuildOutput && line.trim()) {
        logs.push(line);
      }
    }
    
    return logs;
  }
  
  parseErrors(output) {
    const errors = [];
    const lines = output.split('\n');
    
    // Parse TypeScript errors
    for (const line of lines) {
      const tsMatch = line.match(/(.+?)\((\d+),(\d+)\):\s*error\s+TS(\d+):\s*(.+)/);
      if (tsMatch) {
        errors.push({
          type: 'typescript',
          file: tsMatch[1].trim(),
          line: parseInt(tsMatch[2]),
          column: parseInt(tsMatch[3]),
          code: `TS${tsMatch[4]}`,
          message: tsMatch[5].trim()
        });
      }
      
      // Parse ESLint errors
      const eslintMatch = line.match(/^\s*(\/.+?):(\d+):(\d+)\s+error\s+(.+?)\s+(.+)$/);
      if (eslintMatch) {
        errors.push({
          type: 'eslint',
          file: eslintMatch[1],
          line: parseInt(eslintMatch[2]),
          column: parseInt(eslintMatch[3]),
          message: eslintMatch[4],
          rule: eslintMatch[5]
        });
      }
      
      // Parse build/syntax errors
      if (line.includes('SyntaxError:') || line.includes('Error:')) {
        const errorMatch = line.match(/at\s+(.+?):(\d+):(\d+)/);
        if (errorMatch) {
          errors.push({
            type: 'syntax',
            file: errorMatch[1],
            line: parseInt(errorMatch[2]),
            column: parseInt(errorMatch[3]),
            message: line.split('Error:')[1]?.trim() || line
          });
        }
      }
    }
    
    // Remove duplicates
    const uniqueErrors = [];
    const seen = new Set();
    
    for (const error of errors) {
      const key = `${error.file}:${error.line}:${error.column}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueErrors.push(error);
      }
    }
    
    return uniqueErrors;
  }
  
  async fixErrors(errors) {
    let fixed = 0;
    
    for (const error of errors) {
      console.log(chalk.yellow(`\n🔧 Fixing: ${error.file}:${error.line} - ${error.message}`));
      
      try {
        const filePath = path.resolve(error.file);
        
        if (!fs.existsSync(filePath)) {
          console.log(chalk.red(`   File not found: ${filePath}`));
          continue;
        }
        
        const fileContent = fs.readFileSync(filePath, 'utf8');
        let fixedContent = fileContent;
        
        // Apply specific fixes based on error type
        if (error.type === 'syntax') {
          fixedContent = this.fixSyntaxError(fixedContent, error);
        } else if (error.type === 'typescript') {
          fixedContent = this.fixTypeScriptError(fixedContent, error);
        } else if (error.type === 'eslint') {
          fixedContent = this.fixESLintError(fixedContent, error);
        }
        
        if (fixedContent !== fileContent) {
          fs.writeFileSync(filePath, fixedContent);
          console.log(chalk.green(`   ✅ Fixed!`));
          fixed++;
          
          this.fixedErrors.push({
            file: error.file,
            line: error.line,
            error: error.message
          });
        } else {
          console.log(chalk.yellow(`   ⚠️  No automatic fix available`));
        }
      } catch (err) {
        console.log(chalk.red(`   ❌ Error fixing: ${err.message}`));
      }
    }
    
    return { fixed, total: errors.length };
  }
  
  fixSyntaxError(content, error) {
    const lines = content.split('\n');
    const lineIndex = error.line - 1;
    
    if (lineIndex >= 0 && lineIndex < lines.length) {
      const line = lines[lineIndex];
      
      // Common syntax fixes
      if (error.message.includes('Expected \',\'')) {
        // Add missing comma
        lines[lineIndex] = line.replace(/([}\]"'])(\s*)$/, '$1,$2');
      } else if (error.message.includes('Expected \'}\'')) {
        // Add missing closing brace
        lines[lineIndex] = line + '}';
      } else if (error.message.includes('Expected \')\'')) {
        // Fix parenthesis issues
        const openCount = (line.match(/\(/g) || []).length;
        const closeCount = (line.match(/\)/g) || []).length;
        if (openCount > closeCount) {
          lines[lineIndex] = line + ')';
        }
      }
    }
    
    return lines.join('\n');
  }
  
  fixTypeScriptError(content, error) {
    const lines = content.split('\n');
    const lineIndex = error.line - 1;
    
    if (lineIndex >= 0 && lineIndex < lines.length) {
      const line = lines[lineIndex];
      
      // Common TypeScript fixes
      if (error.code === 'TS2339') {
        // Property does not exist
        // Add type annotation or optional chaining
        lines[lineIndex] = line.replace(/(\w+)\.(\w+)/g, '$1?.$2');
      } else if (error.code === 'TS7006') {
        // Parameter implicitly has 'any' type
        lines[lineIndex] = line.replace(/\((\w+)\)/g, '($1: any)');
      }
    }
    
    return lines.join('\n');
  }
  
  fixESLintError(content, error) {
    const lines = content.split('\n');
    const lineIndex = error.line - 1;
    
    if (lineIndex >= 0 && lineIndex < lines.length) {
      const line = lines[lineIndex];
      
      // Common ESLint fixes
      if (error.rule.includes('no-unused-vars')) {
        // Comment out unused variable
        lines[lineIndex] = '// ' + line;
      } else if (error.rule.includes('quotes')) {
        // Fix quote style
        lines[lineIndex] = line.replace(/'/g, '"');
      }
    }
    
    return lines.join('\n');
  }
  
  printSummary() {
    console.log(chalk.blue('\n📊 Build-Fix Loop Summary'));
    console.log(chalk.blue('========================'));
    console.log(`Iterations: ${this.iteration}`);
    console.log(`Errors fixed: ${this.fixedErrors.length}`);
    
    if (this.fixedErrors.length > 0) {
      console.log(chalk.green('\n✅ Fixed errors:'));
      this.fixedErrors.forEach(fix => {
        console.log(`   - ${fix.file}:${fix.line} - ${fix.error}`);
      });
    }
  }
}

// Run the build-fix loop
async function main() {
  const loop = new DockerBuildFixLoop();
  const success = await loop.run();
  
  if (success) {
    console.log(chalk.green('\n🎉 Build is clean and ready for deployment!'));
    process.exit(0);
  } else {
    console.log(chalk.red('\n❌ Build still has errors. Manual intervention required.'));
    
    // Output remaining errors for manual fixing
    console.log(chalk.yellow('\nTo see detailed errors, run:'));
    console.log(chalk.white('  docker build -f Dockerfile.vercel -t ai-saas-vercel-test .'));
    
    process.exit(1);
  }
}

// Handle errors
process.on('unhandledRejection', (err) => {
  console.error(chalk.red('\n❌ Unhandled error:'), err);
  process.exit(1);
});

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { DockerBuildFixLoop };