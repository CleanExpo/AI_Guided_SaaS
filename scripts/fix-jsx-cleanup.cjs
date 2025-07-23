#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 JSX Cleanup Script\n');

// Files that need cleanup based on build errors
const filesToClean = [
  'src/components/admin/AdminAnalytics.tsx',
  'src/app/admin/agent-monitor/page.tsx',
  'src/components/builder/NoCodeBuilder.tsx',
  'src/components/backend/BackendSelector.tsx',
  'src/components/admin/SystemResourceMonitor.tsx'
];

function cleanupExtraClosingTags(content, filePath) {
  const lines = content.split('\n');
  
  // Find the main return statement end
  let returnEnd = -1;
  let depth = 0;
  let inReturn = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('return (')) {
      inReturn = true;
      depth = 1;
      continue;}
    if (inReturn) { // Count parentheses
      for (const char of line) {
        if (char === '(') depth++;
        if (char === ')') depth--;
        
        if (depth === 0) {
          returnEnd = i;
          inReturn = false;
          break;}}
  if (returnEnd === -1) return content;
  
  // Remove any JSX closing tags after the return statement ends
  let cleanedLines = [...lines];
  let removed = 0;
  
  for (let i = returnEnd + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and closing braces
    if (!line || line === '}' || line.startsWith('export')) continue;
    
    // If we find JSX closing tags after return, remove them
    if (line.match(/^<\/\w+>$/)) {
      cleanedLines[i] = '';
      removed++;}}
  if (removed > 0) {
    console.log(`  🗑️  Removed ${removed} extra closing tags after return statement`);
    return cleanedLines.join('\n').replace(/\n{3}/g, '\n\n');}
  return content;}
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const _original = content;
    
    console.log(`\n📍 Processing: ${filePath}`);
    
    // Clean up extra closing tags
    content = cleanupExtraClosingTags(content, filePath);
    
    // Fix specific patterns found in the files
    
    // AdminAnalytics.tsx specific fixes
    if (filePath.includes('AdminAnalytics.tsx')) {
      // Remove all the extra closing tags at the end
      content = content.replace(/\s*<\/Progress>\s*<\/Progress>\s*<\/Progress>\s*<\/Progress>\s*<\/Progress>\s*<\/Progress>\s*<\/SimpleLineChart>\s*<\/Progress>\s*<\/SimpleLineChart>\s*<\/SimpleLineChart>\s*<\/SimpleLineChart>\s*<\/Progress>\s*<\/Globe>\s*<\/Activity>\s*<\/Zap>\s*<\/Target>\s*<\/TrendingUp>\s*<\/DollarSign>/g, '');}
    // NoCodeBuilder.tsx specific fixes
    if (filePath.includes('NoCodeBuilder.tsx')) {
      // Fix the malformed closing tags at the end
      content = content.replace(/\s*<\/h4>\s*<\/div>\s*<\/TabsContent>\s*<\/div>\s*<\/h4>\s*<\/div>\s*<\/TabsContent>\s*<\/div>\s*<\/h4>\s*<\/div>\s*<\/TabsList>\s*<\/Tabs>\s*<\/div>\s*<\/Button>\s*<\/Button>\s*<\/Button>\s*<\/div>\s*<\/Button>\s*<\/Button>\s*<\/div>\s*<\/ScrollArea>\s*<\/h3>\s*<\/div>\s*}\s*\);\s*}/g, (match) => {
        return `
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}`;
      });}
    // BackendSelector.tsx specific fixes
    if (filePath.includes('BackendSelector.tsx')) {
      // Remove extra closing tags before the main closing
      content = content.replace(/(\s*)\);\s*}\s*<\/\w+>/g, '$1  );$1}');
      // Clean up malformed JSX
      content = content.replace(/<\/\w+>\s*}\s*<\/\w+>/g, '');}
    // SystemResourceMonitor.tsx specific fixes  
    if (filePath.includes('SystemResourceMonitor.tsx')) {
      // Fix the ending with multiple Card closing tags
      content = content.replace(/\s*<\/Card>\s*<\/div>\s*<\/Card>\s*<\/div>\s*<\/Card>\s*<\/Card>\s*<\/div>\s*<\/Card>\s*<\/Card>\s*<\/Card>\s*<\/div>\s*}\s*\);\s*}/g, `
      </Card>
    </div>
  );
}`);}
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ Fixed and cleaned up`);
      return true;
    } else {
      console.log(`  ℹ️  No changes needed`);}
    return false;
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
    return false;}}
// Process all files
console.log('🎯 Cleaning up JSX files with extra closing tags...\n');

let fixedCount = 0;
filesToClean.forEach(file => {
  const _fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    if (fixFile(fullPath)) {
      fixedCount++;}
  } else {
    console.log(`  ⚠️  File not found: ${file}`);}
});

console.log(`\n✅ Cleanup completed! Fixed ${fixedCount} files.`);