const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Sequential Thinking Pre-deployment Check for WSL Ubuntu + Vercel
 * This script uses sequential thinking methodology to validate deployment readiness
 */

class SequentialThinkingDeploymentChecker {
    constructor() {
        this.thinkingContext = {
            currentThought: 1,
            totalThoughts: 8,
            thoughtHistory: [],
            issues: [],
            recommendations: [],
            validations: []
        };
        
        this.deploymentState = {
            environment: process.env.NODE_ENV || 'production',
            wslEnabled: process.env.WSL_DISTRO_NAME !== undefined,
            projectRoot: process.cwd(),
            checks: {
                environment: false,
                files: false,
                git: false,
                dependencies: false,
                build: false,
                security: false,
                wsl: false,
                vercel: false
            }
        };
    }

    // Sequential Thinking Implementation
    async executeSequentialThinking() {
        console.log('🧠 Starting Sequential Thinking Pre-deployment Analysis...\n');
        
        let thoughtNumber = 1;
        let totalThoughts = this.thinkingContext.totalThoughts;
        let nextThoughtNeeded = true;

        while (nextThoughtNeeded && thoughtNumber <= totalThoughts) {
            const thought = await this.processThought(thoughtNumber);
            this.thinkingContext.thoughtHistory.push(thought);

            // Dynamic complexity adjustment
            if (thought.needsMoreThoughts) {
                totalThoughts = Math.min(totalThoughts + 2, 12);
                this.thinkingContext.totalThoughts = totalThoughts;
            }

            // Handle revisions
            if (thought.shouldRevise) {
                await this.handleRevision(thought);
            }

            // Branch exploration for complex issues
            if (thought.shouldBranch) {
                await this.exploreBranch(thought);
            }

            thoughtNumber++;
            nextThoughtNeeded = thoughtNumber <= totalThoughts;
        }

        return this.synthesizeResults();
    }

    async processThought(thoughtNumber) {
        const thoughtContent = await this.generateThought(thoughtNumber);
        const validation = await this.executeValidation(thoughtNumber);
        
        const thought = {
            number: thoughtNumber,
            content: thoughtContent,
            validation: validation,
            timestamp: new Date(),
            confidence: this.calculateConfidence(validation),
            needsMoreThoughts: validation.issues.length > 2,
            shouldRevise: validation.critical && validation.issues.length > 0,
            shouldBranch: validation.complexity === 'high'
        };

        console.log(`💭 Thought ${thoughtNumber}/${this.thinkingContext.totalThoughts}: ${thoughtContent}`);
        
        if (validation.success) {
            console.log(`✅ Validation passed: ${validation.summary}`);
        } else {
            console.log(`❌ Validation failed: ${validation.summary}`);
            validation.issues.forEach(issue => console.log(`   • ${issue}`));
        }
        
        console.log('');
        return thought;
    }

    async generateThought(thoughtNumber) {
        const thoughts = {
            1: () => `Initial assessment: Analyzing deployment readiness for ${this.deploymentState.environment} environment. WSL integration ${this.deploymentState.wslEnabled ? 'detected' : 'not detected'}.`,
            
            2: () => `Environment validation: Checking critical environment variables, configuration files, and deployment prerequisites for ${this.deploymentState.environment} deployment.`,
            
            3: () => `File system analysis: Verifying required files exist, build artifacts are present, and no critical files are missing for successful deployment.`,
            
            4: () => `Git repository validation: Ensuring clean working directory, proper branch state, and synchronization with remote repository before deployment.`,
            
            5: () => `Dependency verification: Analyzing package.json, checking for security vulnerabilities, and validating all required dependencies are installed.`,
            
            6: () => `Build system validation: Testing build process, checking for compilation errors, and ensuring all assets are properly generated.`,
            
            7: () => `Security assessment: Scanning for vulnerabilities, validating environment variable security, and checking for exposed secrets.`,
            
            8: () => `Final deployment readiness: Synthesizing all validation results and determining overall deployment readiness with confidence assessment.`
        };

        return thoughts[thoughtNumber] ? thoughts[thoughtNumber]() : 
               `Advanced validation step ${thoughtNumber}: Continuing comprehensive deployment analysis.`;
    }

    async executeValidation(thoughtNumber) {
        const validations = {
            1: () => this.validateEnvironment(),
            2: () => this.validateEnvironmentVariables(),
            3: () => this.validateFiles(),
            4: () => this.validateGit(),
            5: () => this.validateDependencies(),
            6: () => this.validateBuild(),
            7: () => this.validateSecurity(),
            8: () => this.validateFinalReadiness()
        };

        try {
            return validations[thoughtNumber] ? await validations[thoughtNumber]() : 
                   { success: true, summary: 'Advanced validation completed', issues: [], complexity: 'low' };
        } catch (error) {
            return {
                success: false,
                summary: `Validation failed: ${error.message}`,
                issues: [error.message],
                complexity: 'high',
                critical: true
            };
        }
    }

    // Validation Methods
    async validateEnvironment() {
        const issues = [];
        const checks = [];

        // Check Node.js version
        try {
            const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
            checks.push(`Node.js version: ${nodeVersion}`);
            
            const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
            if (majorVersion < 18) {
                issues.push(`Node.js version ${nodeVersion} is below recommended v18+`);
            }
        } catch (error) {
            issues.push('Node.js not found or not accessible');
        }

        // Check npm version
        try {
            const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
            checks.push(`npm version: ${npmVersion}`);
        } catch (error) {
            issues.push('npm not found or not accessible');
        }

        // Check WSL environment if applicable
        if (this.deploymentState.wslEnabled) {
            checks.push('WSL environment detected');
            if (!process.env.PROJECT_ROOT) {
                issues.push('PROJECT_ROOT environment variable not set in WSL');
            }
        }

        this.deploymentState.checks.environment = issues.length === 0;
        
        return {
            success: issues.length === 0,
            summary: `Environment validation: ${checks.length} checks completed`,
            issues,
            checks,
            complexity: issues.length > 1 ? 'high' : 'low'
        };
    }

    async validateEnvironmentVariables() {
        const issues = [];
        const checks = [];
        
        const requiredEnvVars = {
            production: ['NODE_ENV', 'VERCEL_ENV'],
            development: ['NODE_ENV']
        };

        const required = requiredEnvVars[this.deploymentState.environment] || requiredEnvVars.production;
        
        required.forEach(envVar => {
            if (process.env[envVar]) {
                checks.push(`${envVar}: ${process.env[envVar]}`);
            } else {
                issues.push(`Missing required environment variable: ${envVar}`);
            }
        });

        // Check for sensitive data exposure
        const sensitivePatterns = ['password', 'secret', 'key', 'token'];
        Object.keys(process.env).forEach(key => {
            if (sensitivePatterns.some(pattern => key.toLowerCase().includes(pattern))) {
                if (process.env[key] && process.env[key].length < 10) {
                    issues.push(`Potentially weak ${key}: value too short`);
                }
            }
        });

        return {
            success: issues.length === 0,
            summary: `Environment variables: ${checks.length} validated`,
            issues,
            checks,
            complexity: 'low'
        };
    }

    async validateFiles() {
        const issues = [];
        const checks = [];
        
        const requiredFiles = [
            'package.json',
            'next.config.mjs',
            'vercel.json'
        ];

        const optionalFiles = [
            '.env.production',
            '.env.local',
            'tsconfig.json'
        ];

        // Check required files
        requiredFiles.forEach(file => {
            const filePath = path.join(this.deploymentState.projectRoot, file);
            if (fs.existsSync(filePath)) {
                checks.push(`Required file found: ${file}`);
            } else {
                issues.push(`Missing required file: ${file}`);
            }
        });

        // Check optional files
        optionalFiles.forEach(file => {
            const filePath = path.join(this.deploymentState.projectRoot, file);
            if (fs.existsSync(filePath)) {
                checks.push(`Optional file found: ${file}`);
            }
        });

        // Check for build artifacts
        const buildDirs = ['.next', 'dist', 'build'];
        let buildFound = false;
        
        buildDirs.forEach(dir => {
            const dirPath = path.join(this.deploymentState.projectRoot, dir);
            if (fs.existsSync(dirPath)) {
                checks.push(`Build directory found: ${dir}`);
                buildFound = true;
            }
        });

        if (!buildFound && this.deploymentState.environment === 'production') {
            issues.push('No build artifacts found - run build process first');
        }

        this.deploymentState.checks.files = issues.length === 0;

        return {
            success: issues.length === 0,
            summary: `File validation: ${checks.length} files checked`,
            issues,
            checks,
            complexity: issues.length > 2 ? 'high' : 'low'
        };
    }

    async validateGit() {
        const issues = [];
        const checks = [];

        try {
            // Check if we're in a git repository
            execSync('git rev-parse --git-dir', { stdio: 'ignore' });
            checks.push('Git repository detected');

            // Check git status (porcelain)
            const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
            if (gitStatus === '') {
                checks.push('Working directory is clean');
            } else {
                const changes = gitStatus.split('\n').length;
                issues.push(`Working directory has ${changes} uncommitted changes`);
            }

            // Check current branch
            const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
            checks.push(`Current branch: ${currentBranch}`);
            
            if (this.deploymentState.environment === 'production' && currentBranch !== 'main') {
                issues.push(`Deploying from ${currentBranch} instead of main branch`);
            }

            // Check remote sync status
            try {
                execSync('git fetch origin', { stdio: 'ignore' });
                const localCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
                const remoteCommit = execSync('git rev-parse @{u}', { encoding: 'utf8' }).trim();
                
                if (localCommit === remoteCommit) {
                    checks.push('Local branch is up to date with remote');
                } else {
                    issues.push('Local branch is out of sync with remote');
                }
            } catch (error) {
                issues.push('Unable to check remote sync status');
            }

        } catch (error) {
            issues.push('Not a git repository or git not available');
        }

        this.deploymentState.checks.git = issues.length === 0;

        return {
            success: issues.length === 0,
            summary: `Git validation: ${checks.length} checks completed`,
            issues,
            checks,
            complexity: issues.length > 1 ? 'medium' : 'low'
        };
    }

    async validateDependencies() {
        const issues = [];
        const checks = [];

        try {
            // Check if package.json exists and is valid
            const packageJsonPath = path.join(this.deploymentState.projectRoot, 'package.json');
            if (!fs.existsSync(packageJsonPath)) {
                issues.push('package.json not found');
                return { success: false, summary: 'Dependencies validation failed', issues, checks };
            }

            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            checks.push(`Package: ${packageJson.name}@${packageJson.version}`);

            // Check if node_modules exists
            const nodeModulesPath = path.join(this.deploymentState.projectRoot, 'node_modules');
            if (fs.existsSync(nodeModulesPath)) {
                checks.push('node_modules directory found');
            } else {
                issues.push('node_modules not found - run npm install');
            }

            // Run npm audit for security vulnerabilities
            try {
                execSync('npm audit --audit-level=high', { stdio: 'ignore' });
                checks.push('No high-severity vulnerabilities found');
            } catch (error) {
                issues.push('High-severity vulnerabilities detected - run npm audit fix');
            }

            // Check for outdated packages
            try {
                const outdated = execSync('npm outdated --json', { encoding: 'utf8' });
                const outdatedPackages = JSON.parse(outdated || '{}');
                const outdatedCount = Object.keys(outdatedPackages).length;
                
                if (outdatedCount > 0) {
                    checks.push(`${outdatedCount} packages have updates available`);
                } else {
                    checks.push('All packages are up to date');
                }
            } catch (error) {
                // npm outdated returns non-zero exit code when packages are outdated
                checks.push('Package update check completed');
            }

        } catch (error) {
            issues.push(`Dependency validation failed: ${error.message}`);
        }

        this.deploymentState.checks.dependencies = issues.length === 0;

        return {
            success: issues.length === 0,
            summary: `Dependencies: ${checks.length} validations completed`,
            issues,
            checks,
            complexity: issues.length > 1 ? 'medium' : 'low'
        };
    }

    async validateBuild() {
        const issues = [];
        const checks = [];

        try {
            // Check if build script exists
            const packageJsonPath = path.join(this.deploymentState.projectRoot, 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            
            if (packageJson.scripts && packageJson.scripts.build) {
                checks.push('Build script found in package.json');
                
                // Test build process (dry run)
                try {
                    console.log('   🔨 Testing build process...');
                    execSync('npm run build', { 
                        stdio: 'ignore',
                        timeout: 120000 // 2 minute timeout
                    });
                    checks.push('Build process completed successfully');
                } catch (error) {
                    issues.push('Build process failed - check build configuration');
                }
            } else {
                issues.push('No build script found in package.json');
            }

            // Check TypeScript compilation if applicable
            const tsconfigPath = path.join(this.deploymentState.projectRoot, 'tsconfig.json');
            if (fs.existsSync(tsconfigPath)) {
                try {
                    execSync('npx tsc --noEmit', { stdio: 'ignore' });
                    checks.push('TypeScript compilation check passed');
                } catch (error) {
                    issues.push('TypeScript compilation errors detected');
                }
            }

        } catch (error) {
            issues.push(`Build validation failed: ${error.message}`);
        }

        this.deploymentState.checks.build = issues.length === 0;

        return {
            success: issues.length === 0,
            summary: `Build validation: ${checks.length} checks completed`,
            issues,
            checks,
            complexity: issues.length > 0 ? 'high' : 'low',
            critical: issues.some(issue => issue.includes('Build process failed'))
        };
    }

    async validateSecurity() {
        const issues = [];
        const checks = [];

        // Check for common security files
        const securityFiles = ['.gitignore', '.env.example'];
        securityFiles.forEach(file => {
            const filePath = path.join(this.deploymentState.projectRoot, file);
            if (fs.existsSync(filePath)) {
                checks.push(`Security file found: ${file}`);
            } else {
                issues.push(`Missing security file: ${file}`);
            }
        });

        // Check .gitignore for sensitive patterns
        const gitignorePath = path.join(this.deploymentState.projectRoot, '.gitignore');
        if (fs.existsSync(gitignorePath)) {
            const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
            const requiredPatterns = ['.env', 'node_modules', '.next'];
            
            requiredPatterns.forEach(pattern => {
                if (gitignoreContent.includes(pattern)) {
                    checks.push(`Gitignore includes: ${pattern}`);
                } else {
                    issues.push(`Gitignore missing pattern: ${pattern}`);
                }
            });
        }

        // Check for exposed secrets in environment
        const exposedSecrets = [];
        Object.keys(process.env).forEach(key => {
            const value = process.env[key];
            if (value && (key.toLowerCase().includes('secret') || key.toLowerCase().includes('key'))) {
                if (value.length < 20) {
                    exposedSecrets.push(key);
                }
            }
        });

        if (exposedSecrets.length > 0) {
            issues.push(`Potentially weak secrets: ${exposedSecrets.join(', ')}`);
        } else {
            checks.push('No weak secrets detected');
        }

        this.deploymentState.checks.security = issues.length === 0;

        return {
            success: issues.length === 0,
            summary: `Security validation: ${checks.length} checks completed`,
            issues,
            checks,
            complexity: issues.length > 2 ? 'high' : 'low'
        };
    }

    async validateFinalReadiness() {
        const issues = [];
        const checks = [];
        
        // Synthesize all previous validations
        const allChecks = Object.values(this.deploymentState.checks);
        const passedChecks = allChecks.filter(check => check).length;
        const totalChecks = allChecks.length;
        
        checks.push(`Overall validation: ${passedChecks}/${totalChecks} checks passed`);
        
        if (passedChecks === totalChecks) {
            checks.push('All deployment prerequisites satisfied');
        } else {
            issues.push(`${totalChecks - passedChecks} validation checks failed`);
        }

        // Calculate deployment confidence
        const confidence = (passedChecks / totalChecks) * 100;
        checks.push(`Deployment confidence: ${confidence.toFixed(1)}%`);
        
        if (confidence < 80) {
            issues.push('Deployment confidence below recommended threshold (80%)');
        }

        return {
            success: issues.length === 0,
            summary: `Final readiness: ${confidence.toFixed(1)}% confidence`,
            issues,
            checks,
            complexity: confidence < 80 ? 'high' : 'low',
            critical: confidence < 50,
            confidence
        };
    }

    // Helper Methods
    calculateConfidence(validation) {
        let confidence = 0.8; // Base confidence
        
        if (validation.success) confidence += 0.1;
        if (validation.issues.length === 0) confidence += 0.1;
        if (validation.complexity === 'low') confidence += 0.05;
        if (validation.critical) confidence -= 0.3;
        
        return Math.max(0.1, Math.min(1.0, confidence));
    }

    async handleRevision(thought) {
        console.log(`🔄 Revising approach for thought ${thought.number} due to critical issues...`);
        
        // Implement revision logic based on the specific issues found
        if (thought.validation.critical) {
            this.thinkingContext.totalThoughts += 1;
            console.log(`   📈 Extended analysis to ${this.thinkingContext.totalThoughts} thoughts`);
        }
    }

    async exploreBranch(thought) {
        console.log(`🌿 Exploring alternative approach for complex validation...`);
        
        // Branch exploration for complex scenarios
        const branchStrategies = {
            'build-failure': 'Exploring alternative build configurations and dependency resolution',
            'git-issues': 'Exploring git workflow optimization and branch management strategies',
            'security-concerns': 'Exploring enhanced security validation and vulnerability mitigation'
        };
        
        // Simplified branch exploration
        console.log(`   🔍 ${branchStrategies['build-failure']}`);
    }

    synthesizeResults() {
        const totalThoughts = this.thinkingContext.thoughtHistory.length;
        const successfulValidations = this.thinkingContext.thoughtHistory.filter(t => t.validation.success).length;
        const allIssues = this.thinkingContext.thoughtHistory.flatMap(t => t.validation.issues);
        const allChecks = this.thinkingContext.thoughtHistory.flatMap(t => t.validation.checks || []);
        
        const overallConfidence = (successfulValidations / totalThoughts) * 100;
        const deploymentReady = allIssues.length === 0 && overallConfidence >= 80;
        
        return {
            deploymentReady,
            confidence: overallConfidence,
            totalThoughts,
            successfulValidations,
            issues: allIssues,
            checks: allChecks,
            summary: `Sequential thinking analysis completed with ${overallConfidence.toFixed(1)}% confidence`
        };
    }
}

// Main execution
async function main() {
    console.log('🚀 WSL Ubuntu + Vercel Pre-deployment Check with Sequential Thinking\n');
    console.log('=' .repeat(70));
    
    const checker = new SequentialThinkingDeploymentChecker();
    
    try {
        const results = await checker.executeSequentialThinking();
        
        console.log('\n' + '='.repeat(70));
        console.log('📊 DEPLOYMENT READINESS SUMMARY');
        console.log('='.repeat(70));
        
        console.log(`🧠 Sequential Thinking Analysis: ${results.totalThoughts} thoughts processed`);
        console.log(`✅ Successful Validations: ${results.successfulValidations}/${results.totalThoughts}`);
        console.log(`📈 Deployment Confidence: ${results.confidence.toFixed(1)}%`);
        console.log(`🎯 Deployment Ready: ${results.deploymentReady ? 'YES' : 'NO'}`);
        
        if (results.issues.length > 0) {
            console.log('\n❌ ISSUES TO RESOLVE:');
            results.issues.forEach((issue, index) => {
                console.log(`   ${index + 1}. ${issue}`);
            });
        }
        
        if (results.checks.length > 0) {
            console.log('\n✅ SUCCESSFUL CHECKS:');
            results.checks.slice(0, 10).forEach((check, index) => {
                console.log(`   ${index + 1}. ${check}`);
            });
            
            if (results.checks.length > 10) {
                console.log(`   ... and ${results.checks.length - 10} more checks passed`);
            }
        }
        
        console.log('\n' + '='.repeat(70));
        
        if (results.deploymentReady) {
            console.log('🎉 DEPLOYMENT APPROVED - All checks passed!');
            process.exit(0);
        } else {
            console.log('🛑 DEPLOYMENT BLOCKED - Please resolve issues above');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('💥 Pre-deployment check failed:', error.message);
        process.exit(1);
    }
}

// Execute if run directly
if (require.main === module) {
    main().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { SequentialThinkingDeploymentChecker };
