const fs = require('fs');
const path = require('path');

// List of files with known errors
const filesToFix = [
  {
    path: 'src/app/api/admin/direct-auth/route.ts',
    fixes: [
      { from: /status: 400\s*\)\s*}\)/g, to: 'status: 400 });' },
      { from: /success: true, message: 'Authentication successful'\s*\)\s*}\)/g, to: "success: true, message: 'Authentication successful' });" }
    ]
  },
  {
    path: 'src/app/api/agent-chat/route.ts',
    fixes: [
      { from: /projectType\)\s*hasContext: !!context\s*\)/g, to: 'projectType,\n        hasContext: !!context' }
    ]
  },
  {
    path: 'src/app/api/agents/pulse-status/route.ts',
    fixes: [
      { from: /return NextResponse\.json\({ status: 'error'\)\s*message: 'Unable to retrieve system status',\)\s*timestamp: new Date\(\)\.toISOString\(\)\s*}, { status: 500/g, to: "return NextResponse.json({ status: 'error', message: 'Unable to retrieve system status', timestamp: new Date().toISOString() }, { status: 500" }
    ]
  },
  {
    path: 'src/app/api/analytics/route.ts',
    fixes: [
      { from: /status: 400\s*\)\s*}\)/g, to: 'status: 400 });' }
    ]
  },
  {
    path: 'src/app/api/auth/session/route.ts', 
    fixes: [
      { from: /return NextResponse\.json\({ authenticated: false\)\s*user: null\s*\)\s*}\)/g, to: 'return NextResponse.json({ authenticated: false, user: null });' }
    ]
  }
];

// Apply fixes
filesToFix.forEach(fileConfig => {
  const fullPath = path.join(__dirname, '..', fileConfig.path);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    fileConfig.fixes.forEach(fix => {
      content = content.replace(fix.from, fix.to);
    });
    
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed ${fileConfig.path}`);
  }
});

// Now run a comprehensive fix on all API routes
const apiDir = path.join(__dirname, '..', 'src/app/api');

function comprehensiveFix(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      comprehensiveFix(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // Fix all status code patterns with extra spaces and parentheses
      content = content.replace(/status:\s*(\d{3})\s*\)\s*}\)/g, 'status: $1 });');
      
      // Fix malformed JSON returns
      content = content.replace(/NextResponse\.json\(([^)]+)\)\s*}\)/g, (match, jsonContent) => {
        // Clean up the JSON content
        let cleanJson = jsonContent;
        
        // Fix object syntax: key: value) -> key: value,
        cleanJson = cleanJson.replace(/([a-zA-Z_]+):\s*([^,}]+)\)\s*([a-zA-Z_]+):/g, '$1: $2, $3:');
        
        // Fix last property before closing: value) -> value
        cleanJson = cleanJson.replace(/([a-zA-Z_]+):\s*([^,}]+)\)\s*}/g, '$1: $2 }');
        
        return `NextResponse.json(${cleanJson});`;
      });
      
      // Fix logger.info and similar calls with malformed object syntax
      content = content.replace(/logger\.(info|error|warn|debug)\(([^,]+),\s*{\s*([^}]+)\)\s*([^}]+)\s*}\)/g, 
        (match, level, message, props1, props2) => {
          // Clean up the properties
          let cleanProps = props1.replace(/\)\s*/, ', ') + props2;
          return `logger.${level}(${message}, { ${cleanProps} })`;
        }
      );
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Comprehensively fixed ${path.relative(apiDir, fullPath)}`);
      }
    }
  });
}

comprehensiveFix(apiDir);

console.log('All remaining errors fixed!');