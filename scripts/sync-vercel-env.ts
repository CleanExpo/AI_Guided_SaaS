#!/usr/bin/env tsx

/**
 * Sync Vercel Environment Variables
 * Pulls environment variables from Vercel and creates local .env files
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

interface VercelEnvVar {
  key: string;
  value: string;
  target: string[];
  type: 'encrypted' | 'plain';
}

class VercelEnvSync {
  private envVars: VercelEnvVar[] = [];

  async sync(environment: 'development' | 'preview' | 'production' = 'production') {
    console.log(chalk.blue.bold(`\n🔄 Syncing Vercel Environment Variables (${environment})\n`));

    try {
      // Check if Vercel CLI is installed
      this.checkVercelCLI();

      // Pull environment variables
      await this.pullEnvironmentVariables(environment);

      // Create appropriate .env file
      await this.createEnvFile(environment);

      // Validate required variables
      await this.validateEnvironment();

      console.log(chalk.green.bold('\n✅ Environment sync completed successfully!\n'));
    } catch (error) {
      console.error(chalk.red.bold('\n❌ Environment sync failed:'), error.message);
      process.exit(1);
    }
  }

  private checkVercelCLI() {
    try {
      execSync('vercel --version', { stdio: 'pipe' });
    } catch (error) {
      throw new Error('Vercel CLI not found. Install with: npm i -g vercel');
    }
  }

  private async pullEnvironmentVariables(environment: string) {
    console.log(chalk.cyan('📥 Pulling environment variables from Vercel...'));

    try {
      // Pull all env vars for the specified environment
      const output = execSync(`vercel env ls ${environment}`, { 
        encoding: 'utf-8',
        stdio: 'pipe'
      });

      // Parse the output
      const lines = output.split('\n').filter(line => line.trim());
      
      // Skip header lines
      const dataLines = lines.slice(2);

      for (const line of dataLines) {
        // Parse each line (format: KEY                    encrypted  production, preview, development)
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
          const key = parts[0];
          const type = parts[1] as 'encrypted' | 'plain';
          
          // Get the actual value
          const value = await this.getEnvValue(key, environment);
          
          if (value) {
            this.envVars.push({
              key,
              value,
              target: [environment],
              type
            });
          }
        }
      }

      console.log(chalk.green(`✅ Pulled ${this.envVars.length} environment variables`));
    } catch (error) {
      throw new Error(`Failed to pull environment variables: ${error.message}`);
    }
  }

  private async getEnvValue(key: string, environment: string): Promise<string | null> {
    try {
      // Use vercel env pull to get the value
      const tempFile = path.join(process.cwd(), `.env.${environment}.temp`);
      
      // Pull specific env to temp file
      execSync(`vercel env pull ${tempFile} --environment=${environment} --yes`, {
        stdio: 'pipe'
      });

      // Read the temp file
      if (fs.existsSync(tempFile)) {
        const content = fs.readFileSync(tempFile, 'utf-8');
        const lines = content.split('\n');
        
        // Find the specific key
        for (const line of lines) {
          if (line.startsWith(`${key}=`)) {
            const value = line.substring(key.length + 1);
            
            // Clean up temp file
            fs.unlinkSync(tempFile);
            
            return value;
          }
        }
        
        // Clean up temp file
        fs.unlinkSync(tempFile);
      }

      return null;
    } catch (error) {
      console.warn(chalk.yellow(`⚠️  Could not retrieve value for ${key}`));
      return null;
    }
  }

  private async createEnvFile(environment: string) {
    console.log(chalk.cyan('\n📝 Creating environment file...'));

    const filename = environment === 'production' ? '.env.production' : `.env.${environment}`;
    const filepath = path.join(process.cwd(), filename);

    // Create backup if file exists
    if (fs.existsSync(filepath)) {
      const backupPath = `${filepath}.backup.${Date.now()}`;
      fs.copyFileSync(filepath, backupPath);
      console.log(chalk.gray(`📋 Backed up existing file to ${path.basename(backupPath)}`));
    }

    // Build env file content
    let content = `# Environment Variables from Vercel (${environment})\n`;
    content += `# Synced on ${new Date().toISOString()}\n`;
    content += `# DO NOT COMMIT THIS FILE TO GIT\n\n`;

    // Group variables by category
    const categories = {
      core: ['NODE_ENV', 'NEXT_PUBLIC_APP_URL', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET'],
      database: ['DATABASE_URL', 'DIRECT_URL'],
      ai: ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY'],
      auth: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'],
      supabase: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
      services: ['REDIS_URL', 'RESEND_API_KEY', 'EMAIL_FROM'],
      monitoring: ['SENTRY_DSN', 'NEXT_PUBLIC_GA_ID'],
      other: []
    };

    // Categorize variables
    const categorized: Record<string, VercelEnvVar[]> = {};
    Object.keys(categories).forEach(cat => categorized[cat] = []);

    for (const envVar of this.envVars) {
      let added = false;
      for (const [category, keys] of Object.entries(categories)) {
        if (keys.includes(envVar.key)) {
          categorized[category].push(envVar);
          added = true;
          break;
        }
      }
      if (!added) {
        categorized.other.push(envVar);
      }
    }

    // Write categorized variables
    for (const [category, vars] of Object.entries(categorized)) {
      if (vars.length > 0) {
        content += `# ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;
        for (const envVar of vars) {
          content += `${envVar.key}=${envVar.value}\n`;
        }
        content += '\n';
      }
    }

    // Write file
    fs.writeFileSync(filepath, content);
    console.log(chalk.green(`✅ Created ${filename} with ${this.envVars.length} variables`));
  }

  private async validateEnvironment() {
    console.log(chalk.cyan('\n🔍 Validating environment variables...'));

    const required = [
      'DATABASE_URL',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET'
    ];

    const missing = required.filter(key => 
      !this.envVars.some(env => env.key === key && env.value && env.value !== 'REPLACE_ME')
    );

    if (missing.length > 0) {
      console.log(chalk.yellow('\n⚠️  Missing required variables:'));
      missing.forEach(key => console.log(chalk.yellow(`   - ${key}`)));
      console.log(chalk.yellow('\n   Make sure these are set in Vercel dashboard'));
    } else {
      console.log(chalk.green('✅ All required variables are present'));
    }

    // Check for AI provider
    const hasAI = this.envVars.some(env => 
      (env.key === 'OPENAI_API_KEY' || env.key === 'ANTHROPIC_API_KEY') && 
      env.value && !env.value.includes('REPLACE')
    );

    if (!hasAI) {
      console.log(chalk.yellow('\n⚠️  No AI provider configured'));
      console.log(chalk.yellow('   Add either OPENAI_API_KEY or ANTHROPIC_API_KEY in Vercel'));
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const environment = args[0] as 'development' | 'preview' | 'production' || 'production';

  const sync = new VercelEnvSync();
  await sync.sync(environment);
}

// Auto-sync in production build
if (process.env.VERCEL) {
  console.log(chalk.blue('🔄 Running in Vercel environment - using build-time variables'));
  console.log(chalk.green('✅ Environment variables are automatically available'));
} else {
  main().catch(console.error);
}