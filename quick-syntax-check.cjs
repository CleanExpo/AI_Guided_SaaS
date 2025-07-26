#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Quick Syntax Check for Critical Files');
console.log('========================================\n');

const criticalFiles = [
  'src/components/AgentPulseMonitor.tsx',
  'src/components/ContainerMonitor.tsx',
  'src/components/Dashboard.tsx',
  'src/components/LandingPageProduction.tsx',
  'src/components/MCPDesignerIntegration.tsx'
];

let syntaxErrors = 0;
let parseErrors = 0;

// Test 1: Check if files can be parsed
console.log('1️⃣ Checking file parsing...');
for (const file of criticalFiles) {
  const filePath = path.join(process.cwd(), file);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic syntax checks
    const openBrackets = (content.match(/\{/g) || []).length;
    const closeBrackets = (content.match(/\}/g) || []).length;
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    const openTags = (content.match(/<[A-Z][^>]*>/g) || []).length;
    const closeTags = (content.match(/<\/[A-Z][^>]*>/g) || []).length;
    
    if (openBrackets !== closeBrackets) {
      console.log(`  ❌ ${file} - Mismatched brackets: ${openBrackets} open, ${closeBrackets} close`);
      parseErrors++;
    } else if (openParens !== closeParens) {
      console.log(`  ❌ ${file} - Mismatched parentheses: ${openParens} open, ${closeParens} close`);
      parseErrors++;
    } else {
      console.log(`  ✅ ${file} - Structure looks balanced`);
    }
    
  } catch (error) {
    console.log(`  ❌ ${file} - Failed to read file`);
    parseErrors++;
  }
}

// Test 2: Try to compile with SWC (Next.js compiler)
console.log('\n2️⃣ Testing SWC compilation...');
for (const file of criticalFiles) {
  try {
    execSync(`npx swc ${file} -o /dev/null 2>&1`, {
      cwd: process.cwd(),
      timeout: 5000
    });
    console.log(`  ✅ ${file} - SWC compilation passed`);
  } catch (error) {
    console.log(`  ❌ ${file} - SWC compilation failed`);
    syntaxErrors++;
  }
}

// Test 3: Check for common JSX syntax errors
console.log('\n3️⃣ Checking for common JSX issues...');
for (const file of criticalFiles) {
  const filePath = path.join(process.cwd(), file);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for common syntax patterns that cause issues
    const issues = [];
    
    if (content.match(/>\s*>/)) issues.push('Double closing brackets >>');
    if (content.match(/\}\s*>/)) issues.push('Missing closing tag before >');
    if (content.match(/className\s*=\s*{[^}]*\s+className\s*=/)) issues.push('Duplicate className');
    if (content.match(/>\s*[a-zA-Z]+\s*=\s*{/)) issues.push('Props after closing >');
    if (content.match(/\)\s*>\s*[a-zA-Z]+\s*=/)) issues.push('Malformed JSX attributes');
    
    if (issues.length > 0) {
      console.log(`  ❌ ${file} - Found issues: ${issues.join(', ')}`);
      syntaxErrors += issues.length;
    } else {
      console.log(`  ✅ ${file} - No common JSX issues found`);
    }
    
  } catch (error) {
    console.log(`  ❌ ${file} - Failed to check`);
  }
}

console.log('\n📊 RESULTS:');
console.log(`   Parse errors: ${parseErrors}`);
console.log(`   Syntax errors: ${syntaxErrors}`);
console.log(`   Total issues: ${parseErrors + syntaxErrors}`);

if (parseErrors + syntaxErrors === 0) {
  console.log('\n✅ All critical files pass basic syntax checks!');
  console.log('   Ready for production build test.');
  process.exit(0);
} else {
  console.log('\n❌ Syntax issues remain - fix before claiming production readiness');
  process.exit(1);
}