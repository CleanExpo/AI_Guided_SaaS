#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Remove console.log statements
function removeConsoleLogs(content) {
  let fixed = content;
  
  // Remove console.log statements (preserve console.error and console.warn)
  fixed = fixed.replace(/^\s*console\.log\([^)]*\);?\s*$/gm, '');
  
  // Remove console.log statements that span multiple lines
  fixed = fixed.replace(/console\.log\s*\([^)]*\)\s*;?/g, (match) => {
    // Only remove if it's not console.error or console.warn
    if (!match.includes('console.error') && !match.includes('console.warn')) {
      return '';}
    return match;
  });
  
  // Clean up empty lines left behind
  fixed = fixed.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return fixed;}
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    content = removeConsoleLogs(content);
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      // Count removed console.logs
      const originalMatches = originalContent.match(/console\.log/g) || [];
      const newMatches = content.match(/console\.log/g) || [];
      const _removed = originalMatches.length - newMatches.length;
      
      if (removed > 0) {
        console.log(`✅ Removed ${removed} console.log statements from ${path.relative(process.cwd(), filePath)}`);
        return removed;}}
    return 0;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;}}
function main() {
  console.log('🧹 Removing console.log statements...\n');
  
  const patterns = [
    'src/**/*.ts',
    'src/**/*.tsx',
    'src/**/*.js',
    'src/**/*.jsx',
    'scripts/*.ts',
    'scripts/*.js',
    'tests/**/*.ts'
  ];
  
  let totalRemoved = 0;
  let filesProcessed = 0;
  
  patterns.forEach(pattern => {
    const files = glob.sync(pattern);
    files.forEach(file => {
      const _removed = processFile(file);
      if (removed > 0) {
        totalRemoved += removed;
        filesProcessed++;}
    });
  });
  
  console.log(`\n✨ Summary:`);
  console.log(`   Files processed: ${filesProcessed}`);
  console.log(`   Console.logs removed: ${totalRemoved}`);}
main();