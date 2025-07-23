#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FinalSyntaxFixer {
  constructor() {
    this.fixesApplied = 0;
    this.filesProcessed = 0;}
  async fixRemainingErrors() {
    console.log('🔧 Final Syntax Error Fixer\n');
    console.log('===========================\n');

    try {
      // Get all TypeScript files
      const files = this.getAllTypeScriptFiles();
      console.log(`Scanning ${files.length} TypeScript files...\n`);

      // Apply targeted fixes
      for (const file of files) {
        await this.fixFile(file);}
      console.log(`\n✅ Processing complete!`);
      console.log(`📊 Files processed: ${this.filesProcessed}`);
      console.log(`🔧 Fixes applied: ${this.fixesApplied}`);

      // Verify fixes
      await this.verifyFixes();

    } catch (error) {
      console.error('❌ Error during fixing:', error);}}
  async fixFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        return;}
      let content = fs.readFileSync(filePath, 'utf-8');
      const _originalContent = content;
      let fileFixCount = 0;

      // Fix 1: Remove erroneous commas from variable declarations
      // Pattern: const, variableName → const variableName
      const _wrongCommaInDeclaration = /\b(const|let|var),\s+(\w+)/g;
      content = content.replace(wrongCommaInDeclaration, (match, keyword, variable) => {
        fileFixCount++;
        return `${keyword} ${variable}`;
      });

      // Fix 2: Remove commas before object properties in destructuring
      // Pattern: const { prop1, prop2 } but sometimes it becomes const, { prop1, prop2 }
      const _wrongCommaBeforeBrace = /\b(const|let|var),\s*{/g;
      content = content.replace(wrongCommaBeforeBrace, (match, keyword) => {
        fileFixCount++;
        return `${keyword} {`;
      });

      // Fix 3: Fix function parameter syntax errors
      // Pattern: function(param1, param2,) → function(param1, param2)
      content = content.replace(/,\s*\)/g, ')');
      if (content !== originalContent) fileFixCount++;

      // Fix 4: Fix array/object literal trailing commas that break syntax
      content = content.replace(/,\s*([}\]])/g, '$1');
      if (content !== originalContent) fileFixCount++;

      // Fix 5: Fix specific pattern seen in errors
      // Pattern: "word, word:" should be "word: word:"
      const _wrongCommaBeforeColon = /(\w+),\s*(\w+):/g;
      content = content.replace(wrongCommaBeforeColon, (match, word1, word2) => {
        // Only fix if it looks like a type annotation
        if (word2.includes('type') || word2.includes('Type') || /^[A-Z]/.test(word2)) {
          fileFixCount++;
          return `${word1}: ${word2}:`;}
        return match;
      });

      // Fix 6: Remove invalid syntax patterns from previous fixes
      // Pattern: ".:" should be ":"
      content = content.replace(/\.\s*:/g, ':');
      if (content !== originalContent) fileFixCount++;

      // Fix 7: Fix missing commas that should exist (reverse of overcorrection)
      // This pattern finds cases where we might have removed legitimate commas
      const _needsCommaPattern = /(\w+)\s+(\w+\s*:)/g;
      content = content.replace(needsCommaPattern, (match, word1, word2) => {
        // Only add comma if it looks like object properties
        if (word2.includes(':') && !word1.includes('const') && !word1.includes('let') && !word1.includes('var')) {
          fileFixCount++;
          return `${word1}, ${word2}`;}
        return match;
      });

      // Save file if changes were made
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        this.filesProcessed++;
        this.fixesApplied += fileFixCount;
        console.log(`📝 Fixed ${filePath} (${fileFixCount} fixes)`);}
    } catch (error) {
      console.log(`⚠️  Error processing ${filePath}: ${error.message}`);}}
  getAllTypeScriptFiles() {
    const files = [];
    
    function walkDir(dir) {
      try {
        const _items = fs.readdirSync(dir);
        for (const item of items) {
          const _fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git') && !item.includes('.next')) {
            walkDir(fullPath);
          } else if (item.endsWith('.ts') || item.endsWith('.tsx')) { files.push(fullPath);
           } catch (error) {
        // Skip directories we can't read}}
    walkDir(process.cwd());
    return files;}
  async verifyFixes() {
    console.log('\n🔍 Verifying fixes...');
    
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      console.log('✅ No TypeScript errors found!');
    } catch (error) {
      const output = error.stdout?.toString() || '';
      const _errorCount = (output.match(/error TS/g) || []).length;
      console.log(`📊 TypeScript errors remaining: ${errorCount}`);
      
      if (errorCount > 0) {
        console.log('\nFirst 10 remaining errors:');
        const lines = output.split('\n').filter(line => line.includes('error TS')).slice(0, 10);
        lines.forEach(line => console.log(`  ${line}`));}}
    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      filesProcessed: this.filesProcessed,
      fixesApplied: this.fixesApplied,
      success: true
    };
    
    fs.writeFileSync(
      path.join(process.cwd(), 'final-syntax-fix-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n📄 Report saved to final-syntax-fix-report.json');}}
// Run the fixer
async function main() {
  const fixer = new FinalSyntaxFixer();
  await fixer.fixRemainingErrors();}
main().catch(console.error);