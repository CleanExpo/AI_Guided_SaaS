#!/usr/bin/env node

/**
 * Agent-OS Deployment Validator
 * Comprehensive validation script for Next.js + Vercel deployments
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DeploymentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.checks = [];
    this.projectRoot = process.cwd();}
  // Main validation orchestrator
  async validate() {
    console.log('🔍 Agent-OS Deployment Validation');
    console.log('=====================================\n');

    try {
      await this.runAllChecks();
      this.generateReport();
      this.exitWithStatus();
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      process.exit(1);}}
  async runAllChecks() {
    const checks = [
      'validateProjectStructure',
      'validatePackageJson',
      'validateEnvironmentConfig',
      'validateHydrationBoundaries',
      'validateImportExports',
      'validateBuildConfiguration',
      'validateVercelCompatibility'
    ];

    for (const checkName of checks) {
      try {
        console.log(`🔄 Running ${checkName}...`);
        await this[checkName]();
        this.checks.push({ name: checkName, status: 'passed' });
      } catch (error) {
        this.errors.push({ check: checkName, error: error.message });
        this.checks.push({ name: checkName, status: 'failed', error: error.message });}}}
  // Validate basic project structure
  validateProjectStructure() {
    const requiredFiles = [
      'package.json',
      'next.config.js',
      'tsconfig.json',
      'src/app/layout.tsx',
      'src/app/page.tsx'
    ];

    const missingFiles = requiredFiles.filter(file => 
      !fs.existsSync(path.join(this.projectRoot, file))
    );

    if (missingFiles.length > 0) {
      throw new Error(`Missing required files: ${missingFiles.join(', ')}`);}
    console.log('✅ Project structure validation passed');}
  // Validate package.json configuration
  validatePackageJson() {
    const _packagePath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    // Check required scripts
    const requiredScripts = ['build', 'start', 'dev', 'lint'];
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
    
    if (missingScripts.length > 0) {
      throw new Error(`Missing required scripts: ${missingScripts.join(', ')}`);}
    // Check Next.js version
    const nextVersion = packageJson.dependencies?.next || packageJson.devDependencies?.next;
    if (!nextVersion || !nextVersion.includes('14')) {
      this.warnings.push('Consider upgrading to Next.js 14 for better performance');}
    // Check React version
    const reactVersion = packageJson.dependencies?.react;
    if (!reactVersion || !reactVersion.includes('18')) {
      this.warnings.push('React 18+ recommended for better SSR support');}
    console.log('✅ Package.json validation passed');}
  // Validate environment configuration
  validateEnvironmentConfig() {
    const envFiles = ['.env.example', '.env.local.example'];
    const existingEnvFiles = envFiles.filter(file => 
      fs.existsSync(path.join(this.projectRoot, file))
    );

    if (existingEnvFiles.length === 0) {
      this.warnings.push('No environment example files found');}
    // Check for common environment variables
    const _envExamplePath = path.join(this.projectRoot, '.env.example');
    if (fs.existsSync(envExamplePath)) {
      const envContent = fs.readFileSync(envExamplePath, 'utf8');
      const requiredEnvVars = ['NEXTAUTH_URL', 'NEXTAUTH_SECRET'];
      
      const missingVars = requiredEnvVars.filter(varName => 
        !envContent.includes(varName)
      );

      if (missingVars.length > 0) {
        this.warnings.push(`Missing environment variables in example: ${missingVars.join(', ')}`);}}
    console.log('✅ Environment configuration validation passed');}
  // Validate hydration boundaries
  validateHydrationBoundaries() {
    const _appDir = path.join(this.projectRoot, 'src/app');
    if (!fs.existsSync(appDir)) {
      throw new Error('src/app directory not found');}
    const issues = [];
    this.scanForHydrationIssues(appDir, issues);

    if (issues.length > 0) {
      throw new Error(`Hydration boundary issues found:\n${issues.join('\n')}`);}
    console.log('✅ Hydration boundary validation passed');}
  scanForHydrationIssues(dir, issues) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const _filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.scanForHydrationIssues(filePath, issues);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) { this.checkFileForHydrationIssues(filePath, issues);}
  checkFileForHydrationIssues(filePath, issues) {
    const content = fs.readFileSync(filePath, 'utf8');
    const _relativePath = path.relative(this.projectRoot, filePath);

    // Check for useState/useEffect without 'use client'
    const _hasHooks = /useState|useEffect|useRef|useContext/.test(content);
    const _hasUseClient = /^['"]use client['"];?\s*$/m.test(content);

    if (hasHooks && !hasUseClient) {
      issues.push(`${relativePath}: React hooks found without 'use client' directive`);}
    // Check for browser APIs in server components
    const _hasBrowserAPIs = /window\.|document\.|localStorage|sessionStorage/.test(content);
    if (hasBrowserAPIs && !hasUseClient) {
      issues.push(`${relativePath}: Browser APIs found in server component`);}}
  // Validate import/export consistency
  validateImportExports() {
    const _srcDir = path.join(this.projectRoot, 'src');
    const issues = [];

    this.scanForImportExportIssues(srcDir, issues);

    if (issues.length > 0) {
      this.warnings.push(`Import/Export issues found:\n${issues.join('\n')}`);}
    console.log('✅ Import/Export validation completed');}
  scanForImportExportIssues(dir, issues) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const _filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.scanForImportExportIssues(filePath, issues);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) { this.checkImportExportConsistency(filePath, issues);}
  checkImportExportConsistency(filePath, issues) {
    const content = fs.readFileSync(filePath, 'utf8');
    const _relativePath = path.relative(this.projectRoot, filePath);

    // Check for both default and named exports (potential confusion)
    const _hasDefaultExport = /export default/.test(content);
    const _hasNamedExports = /export \{|export const|export function|export class/.test(content);

    if (hasDefaultExport && hasNamedExports) {
      issues.push(`${relativePath}: Has both default and named exports - consider consistency`);}}
  // Validate build configuration
  validateBuildConfiguration() {
    // Check Next.js config
    const _nextConfigPath = path.join(this.projectRoot, 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      const configContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      // Check for common performance optimizations
      if (!configContent.includes('experimental')) {
        this.warnings.push('Consider adding experimental features in next.config.js');}}
    // Check TypeScript config
    const _tsconfigPath = path.join(this.projectRoot, 'tsconfig.json');
    if (fs.existsSync(tsconfigPath)) {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      
      if (!tsconfig.compilerOptions?.strict) {
        this.warnings.push('TypeScript strict mode not enabled');}}
    console.log('✅ Build configuration validation passed');}
  // Validate Vercel-specific compatibility
  validateVercelCompatibility() {
    // Check for vercel.json
    const _vercelConfigPath = path.join(this.projectRoot, 'vercel.json');
    if (fs.existsSync(vercelConfigPath)) {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
      
      // Validate configuration
      if (vercelConfig.functions && Object.keys(vercelConfig.functions).length > 0) {
        console.log('📦 Custom Vercel function configuration detected');}}
    // Check for potential serverless function size issues
    const _apiDir = path.join(this.projectRoot, 'src/app/api');
    if (fs.existsSync(apiDir)) {
      this.checkApiRouteComplexity(apiDir);}
    console.log('✅ Vercel compatibility validation passed');}
  checkApiRouteComplexity(apiDir) {
    const files = fs.readdirSync(apiDir, { recursive: true });
    const _routeFiles = files.filter(file => file.includes('route.'));

    for (const file of routeFiles) {
      const _filePath = path.join(apiDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Simple heuristic for complexity
      const _lineCount = content.split('\n').length;
      if (lineCount > 200) {
        this.warnings.push(`API route ${file} is quite large (${lineCount} lines) - consider optimization`);}}}
  // Generate comprehensive report
  generateReport() {
    console.log('\n📊 VALIDATION REPORT');
    console.log('===================');

    // Summary
    const _passed = this.checks.filter(c => c.status === 'passed').length;
    const _failed = this.checks.filter(c => c.status === 'failed').length;
    const _total = this.checks.length;

    console.log(`\n✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${failed}/${total}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);

    // Failed checks
    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(error => {
        console.log(`   ${error.check}: ${error.error}`);
      });}
    // Warnings
    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(warning => {
        console.log(`   ${warning}`);
      });}
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('   🎉 Your project looks great! Ready for deployment.');
    } else {
      console.log('   📝 Address the issues above before deploying to production.');
      console.log('   🔧 Run this validator again after making changes.');}
    console.log('\n🚀 Happy deploying with Agent-OS!');}
  exitWithStatus() {
    const _hasErrors = this.errors.length > 0;
    process.exit(hasErrors ? 1 : 0);}}
// Run validation if called directly
if (require.main === module) {
  const validator = new DeploymentValidator();
  validator.validate().catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });}
module.exports = DeploymentValidator;
