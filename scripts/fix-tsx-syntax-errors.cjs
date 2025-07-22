const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Color codes for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Track all fixes
const fixSummary = {
  interfaceSyntax: 0,
  returnSyntax: 0,
  jsxClosingTags: 0,
  extraSpaces: 0,
  operatorSyntax: 0,
  totalFiles: 0
};

// Common error patterns and their fixes
const fixes = {
  // Fix interface syntax errors (comma instead of semicolon)
  fixInterfaceSyntax: (content) => {
    const before = content;
    // Fix interface properties with commas
    content = content.replace(/interface\s+\w+\s*{([^}]+)}/g, (match, body) => {
      const fixedBody = body.replace(/,\s*(\w+\s*:)/g, ';\n  $1');
      return match.replace(body, fixedBody);
    });
    
    // Fix inline interface definitions with extra commas
    content = content.replace(/{\s*id:\s*string,\s*email:\s*string/g, '{ id: string; email: string');
    content = content.replace(/name:\s*string,\s*role:\s*string/g, 'name: string; role: string');
    content = content.replace(/\s*,\s*permissions:/g, '; permissions:');
    
    if (content !== before) fixSummary.interfaceSyntax++;
    return content;
  },
  
  // Fix incorrect return syntax
  fixReturnSyntax: (content) => {
    const before = content;
    // Fix patterns like: if (null ) { return $2; }
    content = content.replace(/if\s*\(\s*null\s*\)\s*{\s*return\s*\$2;\s*}/g, 'if (!adminUser) { return null; }');
    
    // Fix patterns like: if (!adminUser) { return: null }
    content = content.replace(/if\s*\(([^)]+)\)\s*{\s*return:\s*([^}]+)\s*}/g, 'if ($1) { return $2; }');
    
    if (content !== before) fixSummary.returnSyntax++;
    return content;
  },
  
  // Fix operator syntax errors
  fixOperatorSyntax: (content) => {
    const before = content;
    // Fix onChange={(e) = /> setEmail(e.target.value)}
    content = content.replace(/onChange=\{?\(e\)\s*=\s*\/>\s*set/g, 'onChange={(e) => set');
    
    if (content !== before) fixSummary.operatorSyntax++;
    return content;
  },
  
  // Fix extra spaces in className attributes
  fixExtraSpaces: (content) => {
    const before = content;
    content = content.replace(/className="([^"]*\s{2,}[^"]*)"/g, (match, classes) => {
      const fixed = classes.replace(/\s+/g, ' ').trim();
      return `className="${fixed}"`;
    });
    
    if (content !== before) fixSummary.extraSpaces++;
    return content;
  },
  
  // Fix JSX closing tags
  fixJsxClosingTags: (content) => {
    const before = content;
    
    // Remove extra closing tags after function components
    content = content.replace(/^(\s*}\s*\n)(\s*<\/\w+>\s*\n)+$/gm, '$1');
    
    // Fix specific patterns where we have missing closing divs
    // Pattern: return ( ... ); } </div>
    content = content.replace(/(\s*\);\s*}\s*\n)(\s*<\/div>\s*\n)+/g, '$1');
    
    if (content !== before) fixSummary.jsxClosingTags++;
    return content;
  },
  
  // Add missing closing tags in specific patterns
  addMissingClosingTags: (content, filepath) => {
    // Count opening and closing div tags in JSX return statements
    const returnMatches = content.match(/return\s*\([^)]+\)/gs) || [];
    
    returnMatches.forEach(returnBlock => {
      const openDivs = (returnBlock.match(/<div[^>]*>/g) || []).length;
      const closeDivs = (returnBlock.match(/<\/div>/g) || []).length;
      
      if (openDivs > closeDivs) {
        console.log(`${colors.yellow}${filepath}: Missing ${openDivs - closeDivs} closing </div> tags in return statement${colors.reset}`);
      }
    });
    
    return content;
  }
};

// Process files
function processFiles(pattern) {
  const files = glob.sync(pattern, { 
    cwd: '/mnt/d/AI Guided SaaS',
    absolute: true,
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/scripts/**']
  });
  
  console.log(`${colors.blue}Found ${files.length} files to process${colors.reset}\n`);
  
  files.forEach(filepath => {
    try {
      let content = fs.readFileSync(filepath, 'utf8');
      const originalContent = content;
      
      // Apply fixes
      content = fixes.fixInterfaceSyntax(content);
      content = fixes.fixReturnSyntax(content);
      content = fixes.fixOperatorSyntax(content);
      content = fixes.fixExtraSpaces(content);
      content = fixes.fixJsxClosingTags(content);
      
      // Analyze but don't auto-fix missing closing tags
      fixes.addMissingClosingTags(content, filepath);
      
      if (content !== originalContent) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`${colors.green}✓ Fixed: ${filepath}${colors.reset}`);
        fixSummary.totalFiles++;
      }
    } catch (error) {
      console.error(`${colors.red}✗ Error processing ${filepath}: ${error.message}${colors.reset}`);
    }
  });
}

// Run the script
console.log(`${colors.blue}Starting TypeScript/JSX syntax fixes...${colors.reset}\n`);

// Process all TypeScript and JSX files
processFiles('src/**/*.{tsx,jsx,ts}');

// Print summary
console.log(`\n${colors.blue}=== Fix Summary ===${colors.reset}`);
console.log(`${colors.green}Interface syntax fixes: ${fixSummary.interfaceSyntax}${colors.reset}`);
console.log(`${colors.green}Return syntax fixes: ${fixSummary.returnSyntax}${colors.reset}`);
console.log(`${colors.green}Operator syntax fixes: ${fixSummary.operatorSyntax}${colors.reset}`);
console.log(`${colors.green}Extra spaces fixes: ${fixSummary.extraSpaces}${colors.reset}`);
console.log(`${colors.green}JSX closing tag fixes: ${fixSummary.jsxClosingTags}${colors.reset}`);
console.log(`${colors.green}Total files fixed: ${fixSummary.totalFiles}${colors.reset}`);

// Check remaining errors
console.log(`\n${colors.blue}Checking remaining TypeScript errors...${colors.reset}`);
const { execSync } = require('child_process');
try {
  execSync('cd /mnt/d/AI\\ Guided\\ SaaS && npx tsc --noEmit 2>&1 | grep -c "error TS"', { stdio: 'pipe' });
} catch (error) {
  const errorCount = error.stdout ? error.stdout.toString().trim() : 'unknown';
  console.log(`${colors.yellow}Remaining TypeScript errors: ${errorCount}${colors.reset}`);
}