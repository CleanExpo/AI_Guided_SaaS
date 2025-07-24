#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class SimpleHealthCheck {
  constructor() {
    this.results = [];
    this.errorPatterns = new Map();}
  run() {
    console.log('🏥 Running Health Check...\n');
    
    this.checkTypeScript();
    this.checkDependencies();
    this.checkBuild();
    this.checkFileStructure();
    this.generateReport();}
  checkTypeScript() {
    console.log('📘 Checking TypeScript...');
    
    try {
      execSync('npm run typecheck', { stdio: 'pipe' });
      console.log('✅ TypeScript: No errors');
      this.results.push({
        category: 'TypeScript',
        status: 'pass',
        errors: 0
      });
    } catch (error) {
      const output = error.stdout?.toString() || '';
      const errors = (output.match(/error TS/g) || []).length;
      console.log(`❌ TypeScript: ${errors} errors`);
      
      // Count error types
      const errorTypes = {};
      const matches = output.matchAll(/error (TS\d+):/g);
      for (const match of matches) {
        const code = match[1];
        errorTypes[code] = (errorTypes[code] || 0) + 1;}
      this.results.push({
        category: 'TypeScript',
        status: 'fail',
        errors: errors,
        errorTypes: errorTypes
      });}}
  checkDependencies() {
    console.log('\n📦 Checking Dependencies...');
    
    try {
      const output = execSync('npm ls --depth=0 2>&1', { encoding: 'utf-8' });
      const _hasIssues = output.includes('missing') || output.includes('UNMET');
      
      if (!hasIssues) {
        console.log('✅ Dependencies: All installed');
        this.results.push({
          category: 'Dependencies',
          status: 'pass',
          errors: 0
        });
      } else {
        console.log('❌ Dependencies: Missing packages');
        this.results.push({
          category: 'Dependencies',
          status: 'fail',
          errors: 1
        });}
    } catch (error) {
      console.log('❌ Dependencies: Check failed');
      this.results.push({
        category: 'Dependencies',
        status: 'fail',
        errors: 1
      });}}
  checkBuild() {
    console.log('\n🏗️  Checking Build...');
    
    // Don't actually run build, just check if it would succeed based on TS errors
    const tsResult = this.results.find(r => r.category === 'TypeScript');
    
    if (tsResult && tsResult.errors === 0) {
      console.log('✅ Build: Should succeed (no TS errors)');
      this.results.push({
        category: 'Build',
        status: 'pass',
        errors: 0
      });
    } else {
      console.log('❌ Build: Will fail (TypeScript errors)');
      this.results.push({
        category: 'Build',
        status: 'fail',
        errors: 1
      });}}
  checkFileStructure() {
    console.log('\n📁 Checking Critical Files...');
    
    const criticalFiles = [
      'package.json',
      'tsconfig.json',
      'next.config.mjs',
      '.env.example',
      'CLAUDE.md',
      'src/app/layout.tsx',
      'src/app/page.tsx'
    ];
    
    let missing = 0;
    for (const file of criticalFiles) {
      if (!fs.existsSync(path.join(process.cwd(), file))) {
        console.log(`❌ Missing: ${file}`);
        missing++;}}
    if (missing === 0) {
      console.log('✅ All critical files present');}
    this.results.push({
      category: 'File Structure',
      status: missing === 0 ? 'pass' : 'fail',
      errors: missing
    });}
  generateReport() {
    console.log('\n📊 Summary\n==========');
    
    let totalErrors = 0;
    let failedChecks = 0;
    
    for (const result of this.results) {
      totalErrors += result.errors || 0;
      if (result.status === 'fail') failedChecks++;
      
      const icon = result.status === 'pass' ? '✅' : '❌';
      console.log(`${icon} ${result.category}: ${result.status === 'pass' ? 'PASSED' : 'FAILED'}`);}
    console.log(`\nTotal Errors: ${totalErrors}`);
    console.log(`Failed Checks: ${failedChecks}/${this.results.length}`);
    
    // Show TypeScript error breakdown
    const tsResult = this.results.find(r => r.category === 'TypeScript');
    if (tsResult && tsResult.errorTypes) {
      console.log('\nTypeScript Error Breakdown:');
      const sorted = Object.entries(tsResult.errorTypes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      
      for (const [code, count] of sorted) {
        console.log(`  ${code}: ${count} occurrences`);}}
    // Generate report file
    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      summary: {
        totalErrors,
        failedChecks,
        totalChecks: this.results.length}
    };
    
    fs.writeFileSync('health-check-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Report saved to health-check-report.json');}}
// Run it
new SimpleHealthCheck().run();