const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');

// Function to fix common syntax issues in TypeScript files
function fixSyntaxIssues(content) {
  let fixed = content;
  
  // Fix function signatures missing return types
  fixed = fixed.replace(/export async function (\w+)\(([^)]*)\): Promise \{/g, 
    'export async function $1($2): Promise<NextResponse> {');
  
  // Fix semicolons in object literals
  fixed = fixed.replace(/success: true;/g, 'success: true,');
  fixed = fixed.replace(/message: ([^;]+);/g, 'message: $1,');
  
  // Fix weird comma-space-status pattern
  fixed = fixed.replace(/,\s*status:\s*(\d+)\s*\}\)/g, '}, { status: $1 })');
  
  // Fix console.error with comma before 'error:'
  fixed = fixed.replace(/console\.error\('([^']+), error:'/g, "console.error('$1 error:'");
  
  // Fix variable names starting with underscore
  fixed = fixed.replace(/const _(\w+) = /g, 'const $1 = ');
  fixed = fixed.replace(/export const _dynamic = /g, 'export const dynamic = ');
  
  // Fix object property syntax (semicolons to commas)
  fixed = fixed.replace(/id: ([^;]+);/g, 'id: $1,');
  
  // Fix indentation in object literals
  fixed = fixed.replace(/\[\s*{\s*id:/g, '[\n      {\n        id:');
  
  // Fix missing commas in object properties
  fixed = fixed.replace(/(\w+):\s*([^,\n}]+)\n\s*(\w+):/g, '$1: $2,\n    $3:');
  
  return fixed;
}

// Function to process a single file
function processFile(filePath) {
  if (!filePath.endsWith('.ts') || filePath.includes('node_modules')) {
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixSyntaxIssues(content);
    
    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`Fixed: ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Function to recursively process directory
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile()) {
      processFile(fullPath);
    }
  }
}

// Main execution
console.log('Fixing API route syntax issues...');
processDirectory(apiDir);
console.log('Done!');