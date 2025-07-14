#!/usr/bin/env node

/**
 * Environment Manager CLI
 * Comprehensive environment variable and workflow management
 */

const EnvironmentManager = require('../tools/environment-manager.js');
const PlatformSync = require('../tools/platform-sync.js');
const fs = require('fs');
const path = require('path');

// Load MCP configuration
const configPath = path.join(__dirname, '..', 'config', 'mcp-config.json');
const mcpConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

class EnvironmentManagerCLI {
    constructor() {
        this.envManager = new EnvironmentManager(mcpConfig);
        this.platformSync = new PlatformSync(mcpConfig);
    }

    async validateEnvironment(envFile = '.env.local') {
        console.log(`🔍 Validating environment: ${envFile}`);
        console.log('=' .repeat(50));

        try {
            const validation = await this.envManager.validateEnvironment(envFile);
            
            if (validation.valid) {
                console.log('✅ Environment validation passed!');
            } else {
                console.log('❌ Environment validation failed!');
                
                if (validation.missing.length > 0) {
                    console.log('\n📋 Missing required variables:');
                    validation.missing.forEach(key => console.log(`  - ${key}`));
                }
                
                if (validation.invalid.length > 0) {
                    console.log('\n⚠️  Invalid variables:');
                    validation.invalid.forEach(item => {
                        console.log(`  - ${item.key}: ${item.errors.join(', ')}`);
                    });
                }
            }
            
            if (validation.warnings.length > 0) {
                console.log('\n⚠️  Warnings:');
                validation.warnings.forEach(warning => console.log(`  - ${warning}`));
            }
            
            if (validation.suggestions.length > 0) {
                console.log('\n💡 Suggestions:');
                validation.suggestions.forEach(suggestion => console.log(`  - ${suggestion}`));
            }
            
            return validation;
        } catch (error) {
            console.error('❌ Validation failed:', error.message);
            throw error;
        }
    }

    async generateTemplate(environment = 'development') {
        console.log(`📝 Generating environment template for: ${environment}`);
        console.log('=' .repeat(50));

        try {
            const template = await this.envManager.generateEnvironmentTemplate(environment);
            const outputFile = `.env.${environment}.template`;
            
            fs.writeFileSync(outputFile, template);
            console.log(`✅ Template generated: ${outputFile}`);
            console.log('\n📋 Template preview:');
            console.log(template.split('\n').slice(0, 20).join('\n'));
            if (template.split('\n').length > 20) {
                console.log('... (truncated)');
            }
            
            return outputFile;
        } catch (error) {
            console.error('❌ Template generation failed:', error.message);
            throw error;
        }
    }

    async syncPlatforms() {
        console.log('🔄 Synchronizing platforms...');
        console.log('=' .repeat(50));

        try {
            const results = await this.platformSync.syncAllPlatforms();
            
            console.log(`📊 Sync completed at ${results.timestamp}`);
            console.log(`✅ Success: ${results.summary.success}`);
            console.log(`❌ Failed: ${results.summary.failed}`);
            console.log(`⏭️  Skipped: ${results.summary.skipped}`);
            
            console.log('\n📋 Platform Results:');
            for (const [platform, result] of Object.entries(results.platforms)) {
                const status = result.status === 'success' ? '✅' : 
                              result.status === 'error' ? '❌' : '⏭️';
                console.log(`  ${status} ${platform}: ${result.message || result.reason || result.error}`);
                
                if (result.details) {
                    console.log(`    Details: ${JSON.stringify(result.details, null, 2)}`);
                }
            }
            
            return results;
        } catch (error) {
            console.error('❌ Platform sync failed:', error.message);
            throw error;
        }
    }

    async generateReport() {
        console.log('📊 Generating comprehensive environment report...');
        console.log('=' .repeat(50));

        try {
            const report = await this.platformSync.generateSyncReport();
            
            console.log(`📋 Report generated at ${report.timestamp}`);
            console.log(`🎯 Project: ${report.project.name}`);
            console.log(`📁 Path: ${report.project.path}`);
            
            console.log('\n🔧 Environment Summary:');
            console.log(`  Total Variables: ${report.environment.totalVariables}`);
            console.log(`  Public Variables: ${report.environment.publicVariables}`);
            console.log(`  Secret Variables: ${report.environment.secretVariables}`);
            console.log(`  Placeholder Values: ${report.environment.placeholders}`);
            
            console.log('\n🌐 Platform Status:');
            for (const [platform, config] of Object.entries(report.platforms)) {
                const status = config.valid ? '✅' : '❌';
                const enabled = config.enabled ? 'Enabled' : 'Disabled';
                console.log(`  ${status} ${platform}: ${enabled}`);
                
                if (config.errors.length > 0) {
                    console.log(`    Errors: ${config.errors.join(', ')}`);
                }
                if (config.warnings.length > 0) {
                    console.log(`    Warnings: ${config.warnings.join(', ')}`);
                }
            }
            
            if (report.recommendations.length > 0) {
                console.log('\n💡 Recommendations:');
                report.recommendations.forEach(rec => {
                    const priority = rec.priority === 'high' ? '🔴' : 
                                   rec.priority === 'medium' ? '🟡' : '🟢';
                    console.log(`  ${priority} ${rec.message}`);
                    console.log(`    Action: ${rec.action}`);
                });
            }
            
            if (report.nextSteps.length > 0) {
                console.log('\n📋 Next Steps:');
                report.nextSteps.forEach(step => console.log(`  - ${step}`));
            }
            
            // Save detailed report
            const reportFile = `environment-report-${new Date().toISOString().split('T')[0]}.json`;
            fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
            console.log(`\n💾 Detailed report saved: ${reportFile}`);
            
            return report;
        } catch (error) {
            console.error('❌ Report generation failed:', error.message);
            throw error;
        }
    }

    async rotateCredentials(types = ['secrets']) {
        console.log(`🔄 Rotating credentials: ${types.join(', ')}`);
        console.log('=' .repeat(50));

        try {
            const results = await this.envManager.rotateCredentials(types);
            
            console.log(`✅ Rotated: ${results.rotated.length} credentials`);
            console.log(`❌ Failed: ${results.failed.length} credentials`);
            console.log(`⏭️  Skipped: ${results.skipped.length} credentials`);
            
            if (results.rotated.length > 0) {
                console.log('\n🔄 Rotated Credentials:');
                results.rotated.forEach(item => {
                    console.log(`  ✅ ${item.key}: ${item.oldValue} → ${item.newValue}`);
                    console.log(`    Timestamp: ${item.timestamp}`);
                });
            }
            
            if (results.failed.length > 0) {
                console.log('\n❌ Failed Rotations:');
                results.failed.forEach(item => {
                    console.log(`  ❌ ${item.key}: ${item.error}`);
                });
            }
            
            console.log('\n⚠️  Important: Update these credentials in your platform dashboards!');
            
            return results;
        } catch (error) {
            console.error('❌ Credential rotation failed:', error.message);
            throw error;
        }
    }

    async setupWorkflow() {
        console.log('🚀 Running complete environment setup workflow...');
        console.log('=' .repeat(60));

        try {
            // Step 1: Validate current environment
            console.log('\n📋 Step 1: Validating environment...');
            const validation = await this.validateEnvironment();
            
            // Step 2: Generate templates if needed
            if (!validation.valid) {
                console.log('\n📝 Step 2: Generating environment templates...');
                await this.generateTemplate('development');
                await this.generateTemplate('production');
            }
            
            // Step 3: Platform sync
            console.log('\n🔄 Step 3: Synchronizing platforms...');
            await this.syncPlatforms();
            
            // Step 4: Generate comprehensive report
            console.log('\n📊 Step 4: Generating report...');
            const report = await this.generateReport();
            
            console.log('\n🎉 Environment setup workflow completed!');
            console.log('=' .repeat(60));
            
            return {
                validation,
                report,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ Workflow failed:', error.message);
            throw error;
        }
    }

    printHelp() {
        console.log(`
🎯 AI Guided SaaS Environment Manager CLI

Usage: node mcp/cli/env-manager.js <command> [options]

Commands:
  validate [env-file]             Validate environment variables (.env.local)
  template <environment>          Generate environment template (dev/prod)
  sync                           Synchronize all platforms
  report                         Generate comprehensive report
  rotate [types]                 Rotate credentials (secrets,api-keys)
  workflow                       Run complete setup workflow
  help                           Show this help message

Examples:
  node mcp/cli/env-manager.js validate
  node mcp/cli/env-manager.js template production
  node mcp/cli/env-manager.js sync
  node mcp/cli/env-manager.js rotate secrets
  node mcp/cli/env-manager.js workflow

Environment Files:
  .env.local                     Development environment
  .env.production               Production environment
  .env.development.template     Development template
  .env.production.template      Production template

For more information, visit: https://github.com/CleanExpo/AI_Guided_SaaS
        `);
    }
}

// CLI Command Handler
async function handleCommand(args) {
    const cli = new EnvironmentManagerCLI();
    const command = args[0];

    try {
        switch (command) {
            case 'validate':
                const envFile = args[1] || '.env.local';
                await cli.validateEnvironment(envFile);
                break;

            case 'template':
                const environment = args[1] || 'development';
                await cli.generateTemplate(environment);
                break;

            case 'sync':
                await cli.syncPlatforms();
                break;

            case 'report':
                await cli.generateReport();
                break;

            case 'rotate':
                const types = args[1] ? args[1].split(',') : ['secrets'];
                await cli.rotateCredentials(types);
                break;

            case 'workflow':
                await cli.setupWorkflow();
                break;

            case 'help':
            case '--help':
            case '-h':
                cli.printHelp();
                break;

            default:
                console.error(`❌ Unknown command: ${command}`);
                cli.printHelp();
                process.exit(1);
        }

    } catch (error) {
        console.error(`❌ Command failed: ${error.message}`);
        process.exit(1);
    }
}

// Main execution
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('🎯 AI Guided SaaS Environment Manager');
        console.log('Use "help" command for usage information');
        process.exit(0);
    }

    handleCommand(args);
}

module.exports = EnvironmentManagerCLI;
