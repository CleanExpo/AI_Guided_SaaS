#!/usr/bin/env node

/**
 * MCAS Fix API Routes Syntax
 * Fix syntax errors in API routes
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 MCAS Fix API Routes Syntax');
console.log('============================\n');

const specificFixes = [
  {
    file: 'src/app/api-docs/[slug]/page.tsx',
    fix: (content) => {
      // Fix the if statement on the same line
      return content.replace(/const doc = apiDocs\[params\.slug\], if \(!doc\) {/g, 
        'const doc = apiDocs[params.slug];\n  if (!doc) {');
    }
  },
  {
    file: 'src/app/api/admin/analytics/route.ts',
    fix: (content) => {
      // Fix the comment and const declaration
      return content.replace(/const range = url\.searchParams\.get\('range'\) \|\| '7d', \/\/ Simulate analytics data;\s*\n\s*const analyticsData = {/g,
        'const range = url.searchParams.get(\'range\') || \'7d\';\n        // Simulate analytics data\n        const analyticsData = {');
    }
  },
  {
    file: 'src/app/api/admin/auth/login/route.ts',
    fix: (content) => {
      // Fix the const declaration after comment
      return content.replace(/const body = await request\.json\(\), \/\/ Validate request body, const validatedData = loginSchema\.parse\(body\);/g,
        'const body = await request.json();\n        // Validate request body\n        const validatedData = loginSchema.parse(body);');
    }
  },
  {
    file: 'src/app/api/admin/debug/route.ts',
    fix: (content) => {
      // Fix the return statement with comma
      return content.replace(/console\.error\('Debug API error:', error\), return NextResponse\.json/g,
        'console.error(\'Debug API error:\', error);\n        return NextResponse.json');
    }
  }
];

// Apply specific fixes
for (const config of specificFixes) {
  const filePath = path.join(process.cwd(), config.file);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${config.file}`);
      continue;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const fixed = config.fix(content);
    
    if (fixed !== content) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`✓ Fixed ${config.file}`);
    }
  } catch (error) {
    console.log(`❌ Error processing ${config.file}: ${error.message}`);
  }
}

// General API route fixes
function fixApiRouteSyntax(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    let fixCount = 0;
    
    // Fix multiple statements on one line with commas
    content = content.replace(/([;}])\s*,\s*(const|let|var|return|if|for|while|try|throw)/g, (match, end, keyword) => {
      fixCount++;
      return `${end}\n    ${keyword}`;
    });
    
    // Fix variable declarations with commas before comments
    content = content.replace(/(const|let|var)\s+(\w+)\s*=\s*([^,]+),\s*\/\/([^\n]+)\n\s*(const|let|var)/g, 
      (match, decl1, name, value, comment, decl2) => {
        fixCount++;
        return `${decl1} ${name} = ${value};\n    //${comment}\n    ${decl2}`;
      });
    
    // Fix return statements with commas
    content = content.replace(/\)\s*,\s*return\s+/g, ');\n        return ');
    
    // Fix console.log with comma before return
    content = content.replace(/console\.(log|error|warn)\(([^)]+)\)\s*,\s*return\s+/g, 
      'console.$1($2);\n        return ');
    
    // Fix unterminated divs
    content = content.replace(/<\/div>\s*<\/div>\s*\)\s*;/g, '</div>\n      </div>\n    );');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      return fixCount;
    }
    return 0;
  } catch (error) {
    return 0;
  }
}

// Process all API routes
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && 
          entry.name !== 'node_modules' && 
          entry.name !== '.next') {
        processDirectory(fullPath);
      }
    } else if (entry.isFile() && 
               (entry.name === 'route.ts' || 
                entry.name === 'route.tsx' ||
                entry.name.endsWith('.tsx') ||
                entry.name.endsWith('.ts'))) {
      const fixes = fixApiRouteSyntax(fullPath);
      if (fixes > 0) {
        console.log(`✓ Fixed ${path.relative(process.cwd(), fullPath)} (${fixes} fixes)`);
      }
    }
  }
}

console.log('\n🔍 Processing API routes...');
processDirectory(path.join(process.cwd(), 'src/app/api'));
processDirectory(path.join(process.cwd(), 'src/app/api-docs'));

// Fix the api-docs page specifically
const apiDocsPage = path.join(process.cwd(), 'src/app/api-docs/page.tsx');
if (fs.existsSync(apiDocsPage)) {
  let content = fs.readFileSync(apiDocsPage, 'utf8');
  
  // Check for unterminated divs
  const openDivs = (content.match(/<div/g) || []).length;
  const closeDivs = (content.match(/<\/div>/g) || []).length;
  
  if (openDivs !== closeDivs) {
    // Try to fix by ensuring proper closing
    content = content.replace(/(<\/div>\s*){3,}\s*\)\s*;?\s*\}/g, (match) => {
      const divCount = (match.match(/<\/div>/g) || []).length;
      return '</div>\n'.repeat(divCount - 1) + '    </div>\n  );\n}';
    });
    
    fs.writeFileSync(apiDocsPage, content, 'utf8');
    console.log('✓ Fixed src/app/api-docs/page.tsx structure');
  }
}

console.log('\n✅ API routes syntax fixes complete!');