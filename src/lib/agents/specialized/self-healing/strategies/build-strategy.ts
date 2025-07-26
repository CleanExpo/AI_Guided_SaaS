import { HealingStrategy, HealthIssue } from '../types';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export class BuildHealingStrategy {
  static getStrategy(): HealingStrategy {
    return {
      issueType: 'build-failure',
      actions: [
        {
          name: 'clean-build',
          description: 'Clean build artifacts and rebuild',
          estimatedDuration: 30000, // 30 seconds
          execute: async (issue) => this.cleanBuild(issue),
          rollback: async () => this.restoreBuildFiles()
        },
        {
          name: 'fix-dependencies',
          description: 'Reinstall and fix dependency issues',
          estimatedDuration: 60000, // 1 minute
          execute: async (issue) => this.fixDependencies(issue)
        },
        {
          name: 'fix-syntax-errors',
          description: 'Automatically fix common syntax errors',
          estimatedDuration: 45000, // 45 seconds
          execute: async (issue) => this.fixSyntaxErrors(issue)
        },
        {
          name: 'update-config',
          description: 'Update build configuration files',
          estimatedDuration: 15000, // 15 seconds
          execute: async (issue) => this.updateBuildConfig(issue)
        }
      ],
      maxAttempts: 5,
      cooldownPeriod: 30000, // 30 seconds between attempts
      priority: 2
    };
  }

  private static async cleanBuild(issue: HealthIssue): Promise<boolean> {
    try {
      // Remove build artifacts
      const buildDirs = ['dist', 'build', '.next', 'node_modules/.cache'];
      
      for (const dir of buildDirs) {
        if (fs.existsSync(dir)) {
          execSync(`rm -rf ${dir}`, { stdio: 'pipe' });
        }
      }

      // Reinstall dependencies
      execSync('npm ci', { stdio: 'pipe' });
      
      // Attempt build
      execSync('npm run build', { stdio: 'pipe' });
      
      return true;
    } catch (error) {
      console.error('Clean build failed:', error);
      return false;
    }
  }

  private static async fixDependencies(issue: HealthIssue): Promise<boolean> {
    try {
      // Clear npm cache
      execSync('npm cache clean --force', { stdio: 'pipe' });
      
      // Remove node_modules and package-lock.json
      if (fs.existsSync('node_modules')) {
        execSync('rm -rf node_modules', { stdio: 'pipe' });
      }
      if (fs.existsSync('package-lock.json')) {
        fs.unlinkSync('package-lock.json');
      }
      
      // Fresh install with legacy peer deps
      execSync('npm install --legacy-peer-deps', { stdio: 'pipe' });
      
      // Test build
      execSync('npm run build', { stdio: 'pipe' });
      
      return true;
    } catch (error) {
      console.error('Dependency fix failed:', error);
      return false;
    }
  }

  private static async fixSyntaxErrors(issue: HealthIssue): Promise<boolean> {
    try {
      // Run ESLint with auto-fix
      try {
        execSync('npx eslint . --ext .ts,.tsx --fix', { stdio: 'pipe' });
      } catch (eslintError) {
        // ESLint may exit with non-zero even after fixes
      }
      
      // Fix common TypeScript issues
      await this.fixCommonTSErrors();
      
      // Test build
      execSync('npm run build', { stdio: 'pipe' });
      
      return true;
    } catch (error) {
      console.error('Syntax error fix failed:', error);
      return false;
    }
  }

  private static async fixCommonTSErrors(): Promise<void> {
    const srcDir = 'src';
    if (!fs.existsSync(srcDir)) return;

    const files = this.getAllTSFiles(srcDir);
    
    for (const file of files) {
      try {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        // Fix missing semicolons
        if (content.includes('}\n') && !content.includes('};\n')) {
          content = content.replace(/}\s*\n/g, '};\n');
          modified = true;
        }

        // Fix missing commas in objects
        content = content.replace(/(\w+:\s*[^,}\n]+)\n(\s*\w+:)/g, '$1,\n$2');
        
        // Fix missing quotes in JSX attributes
        content = content.replace(/(\w+)=\{([^}]+)\}/g, (match, attr, value) => {
          if (value.includes('strokeLinecap') || value.includes('strokeLinejoin')) {
            return `${attr}="${value.replace(/"/g, '')}"`;
          }
          return match;
        });

        if (modified) {
          fs.writeFileSync(file, content, 'utf8');
        }
      } catch (error) {
        console.error(`Error fixing file ${file}:`, error);
      }
    }
  }

  private static getAllTSFiles(dir: string): string[] {
    const files: string[] = [];
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files.push(...this.getAllTSFiles(fullPath));
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  private static async updateBuildConfig(issue: HealthIssue): Promise<boolean> {
    try {
      // Update next.config.js if it exists
      const nextConfigPath = 'next.config.js';
      if (fs.existsSync(nextConfigPath)) {
        let config = fs.readFileSync(nextConfigPath, 'utf8');
        
        // Add webpack fallback for node modules if not present
        if (!config.includes('webpack: (config)')) {
          const webpackConfig = `
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    return config;
  },`;
          
          config = config.replace('module.exports = {', `module.exports = {${webpackConfig}`);
          fs.writeFileSync(nextConfigPath, config);
        }
      }

      // Update tsconfig.json if needed
      const tsconfigPath = 'tsconfig.json';
      if (fs.existsSync(tsconfigPath)) {
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        
        // Ensure build-friendly settings
        if (!tsconfig.compilerOptions.skipLibCheck) {
          tsconfig.compilerOptions.skipLibCheck = true;
          fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
        }
      }

      // Test build
      execSync('npm run build', { stdio: 'pipe' });
      
      return true;
    } catch (error) {
      console.error('Config update failed:', error);
      return false;
    }
  }

  private static async restoreBuildFiles(): Promise<void> {
    try {
      // Restore from git if possible
      if (fs.existsSync('.git')) {
        execSync('git checkout -- package-lock.json', { stdio: 'pipe' });
        execSync('git checkout -- next.config.js', { stdio: 'pipe' });
        execSync('git checkout -- tsconfig.json', { stdio: 'pipe' });
      }
    } catch (error) {
      console.error('Rollback failed:', error);
    }
  }
}