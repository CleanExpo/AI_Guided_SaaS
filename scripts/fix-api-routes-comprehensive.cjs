const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');

// Function to fix common syntax issues in TypeScript files
function fixSyntaxIssues(content) {
  let fixed = content;
  
  // Fix lines ending with }, or ], that should end with };
  fixed = fixed.replace(/(\}\s*),\s*$/gm, '$1;');
  fixed = fixed.replace(/(\]\s*),\s*$/gm, '$1;');
  
  // Fix return statements ending with ), instead of );
  fixed = fixed.replace(/\)\s*,\s*$/gm, ');');
  
  // Fix object properties with both comma and semicolon
  fixed = fixed.replace(/,\s*;/g, ';');
  
  // Fix metadata objects with commas at the beginning
  fixed = fixed.replace(/metadata:\s*\{,/g, 'metadata: {');
  fixed = fixed.replace(/credentials:\s*\{,/g, 'credentials: {');
  fixed = fixed.replace(/pages:\s*\{,/g, 'pages: {');
  fixed = fixed.replace(/environment:\s*\{,/g, 'environment: {');
  fixed = fixed.replace(/security:\s*\{,/g, 'security: {');
  fixed = fixed.replace(/response:\s*\{,/g, 'response: {');
  
  // Fix object property definitions
  fixed = fixed.replace(/(\w+):\s*([^,]+),\s*$/gm, (match, prop, value) => {
    // Check if this is the last property in an object
    const trimmed = value.trim();
    if (trimmed.endsWith('}') || trimmed.endsWith(']')) {
      return `${prop}: ${value}`;
    }
    return match;
  });
  
  // Fix interface properties with wrong separators
  fixed = fixed.replace(/interface\s+(\w+)\s*\{([^}]+)\}/g, (match, name, body) => {
    const fixedBody = body
      .split(/[,;]\s*/)
      .filter(line => line.trim())
      .map(line => line.trim())
      .join(';\n  ');
    return `interface ${name} {\n  ${fixedBody};\n}`;
  });
  
  // Fix variable declarations with wrong syntax
  fixed = fixed.replace(/const\s+(\w+)\s*=\s*([^;]+),$/gm, 'const $1 = $2;');
  
  // Fix missing semicolons at end of file
  if (!fixed.trim().endsWith(';') && !fixed.trim().endsWith('}')) {
    fixed = fixed.trimEnd() + '\n';
  }
  
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
console.log('Fixing API route syntax issues comprehensively...');
processDirectory(apiDir);
console.log('Done!');