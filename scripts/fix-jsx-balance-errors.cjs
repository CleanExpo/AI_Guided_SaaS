#!/usr/bin/env node

const fs = require('fs');
const _path = require('path');
const _glob = require('glob');

console.log('🔨 Aggressive JSX Balance Fix Script\n');

// Critical files that need immediate fixing based on build errors
const criticalFiles = [
  'src/components/health/TaskQueueVisualizer.tsx',
  'src/components/admin/AdminAnalytics.tsx',
  'src/app/admin/dashboard/page.tsx',
  'src/app/about/page.tsx',
  'src/app/admin/causal/page.tsx',
  'src/app/admin/agent-monitor/page.tsx'
];

// Common component patterns that need balancing
const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];

function balanceJSXTags(content, filePath) {
  const lines = content.split('\n');
  let fixedContent = content;
  
  // Track if this is a React component file
  const _isComponent = filePath.endsWith('.tsx') && (
    content.includes('export default function') ||
    content.includes('export function') ||
    content.includes('const') && content.includes('= () =>') ||
    content.includes('function') && content.includes('return')
  );
  
  if (!isComponent) return content;
  
  // Find the main return statement
  let returnLineIndex = -1;
  let componentEndIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('return (') && returnLineIndex === -1) {
      returnLineIndex = i;}
    if (returnLineIndex > -1 && lines[i].match(/^}\s*$/)) {
      componentEndIndex = i;
      break;}}
  if (returnLineIndex === -1) return content;
  
  // Extract the JSX portion
  const jsxLines = lines.slice(returnLineIndex, componentEndIndex + 1);
  
  // Count tags in JSX
  const tagStack = [];
  let openCount = 0;
  let closeCount = 0;
  
  jsxLines.forEach(line => {
    // Find opening tags
    const openingTags = line.match(/<(\w+)(?:\s|>)/g) || [];
    openingTags.forEach(tag => {
      const tagName = tag.match(/<(\w+)/)[1];
      if (!selfClosingTags.includes(tagName.toLowerCase())) {
        tagStack.push(tagName);
        openCount++;}
    });
    
    // Find closing tags
    const closingTags = line.match(/<\/(\w+)>/g) || [];
    closingTags.forEach(tag => {
      const tagName = tag.match(/<\/(\w+)>/)[1];
      closeCount++;
      
      // Try to match with stack
      const _lastIndex = tagStack.lastIndexOf(tagName);
      if (lastIndex >= 0) {
        tagStack.splice(lastIndex, 1);}
    });
  });
  
  // If we have unmatched tags, try to fix
  if (openCount !== closeCount) {
    console.log(`  📍 ${filePath}: Found ${openCount} opening, ${closeCount} closing tags`);
    
    // Common fix: Add missing closing tags before the final return closing
    if (openCount > closeCount && componentEndIndex > 0) {
      const _missingCount = openCount - closeCount;
      const missingTags = tagStack.slice(-missingCount);
      
      // Find the line with );
      let insertIndex = componentEndIndex - 1;
      for (let i = componentEndIndex - 1; i >= returnLineIndex; i--) {
        if (lines[i].includes(');')) {
          insertIndex = i;
          break;}}
      // Insert missing closing tags
      const _indent = lines[insertIndex].match(/^\s*/)[0];
      const closingTags = missingTags.reverse().map(tag => `${indent}</${tag}>`).join('\n');
      
      lines[insertIndex] = closingTags + '\n' + lines[insertIndex];
      fixedContent = lines.join('\n');
      
      console.log(`  ✅ Added ${missingCount} missing closing tags`);}
    // Common fix: Remove extra closing tags
    if (closeCount > openCount) {
      const _extraCount = closeCount - openCount;
      console.log(`  ✅ Attempting to remove ${extraCount} extra closing tags`);
      
      // Remove extra closing tags from the end
      let removed = 0;
      for (let i = lines.length - 1; i >= 0 && removed < extraCount; i--) {
        const _match = lines[i].match(/<\/(\w+)>/);
        if (match) {
          lines[i] = lines[i].replace(/<\/\w+>/, '');
          removed++;}}
      fixedContent = lines.join('\n');}}
  return fixedContent;}
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const _original = content;
    
    // Balance JSX tags
    content = balanceJSXTags(content, filePath);
    
    // Additional fixes
    // Remove duplicate closing divs at component end
    content = content.replace(/(}\s*)((?:<\/div>\s*){4})(\s*}\s*$)/gm, '$1\n  );\n$3');
    
    // Fix return statement indentation
    content = content.replace(/return\s*\(\s*<(\w+)/gm, 'return (\n    <$1');
    
    // Ensure newline at end
    if (!content.endsWith('\n')) {
      content += '\n';}
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;}
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;}}
// Fix critical files first
console.log('🎯 Fixing critical files...\n');
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fixFile(file);}
});

// Then fix other problematic files
console.log('\n🔧 Fixing other TSX files with issues...\n');
const problemFiles = [
  'src/components/ShowcaseLandingPage.tsx',
  'src/components/ProductionShowcasePage.tsx',
  'src/components/LiveProjectPreview.tsx',
  'src/components/LandingPageProduction.tsx',
  'src/components/LandingPage.tsx',
  'src/components/Dashboard.tsx',
  'src/components/DataSourceManager.tsx',
  'src/components/ui/form-enhanced.tsx',
  'src/components/layout/Header.tsx',
  'src/components/layout/Footer.tsx'
];

problemFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fixFile(file);}
});

console.log('\n✅ JSX balance fixes completed!');