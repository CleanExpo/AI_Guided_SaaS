const fs = require('fs');
const path = require('path');

// Fix admin/users/[id]/route.ts
const adminUsersPath = path.join(__dirname, '..', 'src/app/api/admin/users/[id]/route.ts');
if (fs.existsSync(adminUsersPath)) {
  let content = fs.readFileSync(adminUsersPath, 'utf8');
  content = content.replace(/status: 404\s*\)\s*}\)/g, 'status: 404 });');
  fs.writeFileSync(adminUsersPath, content);
  console.log('Fixed admin/users/[id]/route.ts');
}

// Fix agent-chat/route.ts - malformed z.object
const agentChatPath = path.join(__dirname, '..', 'src/app/api/agent-chat/route.ts');
if (fs.existsSync(agentChatPath)) {
  let content = fs.readFileSync(agentChatPath, 'utf8');
  content = content.replace(/z\.object\({\)/g, 'z.object({');
  fs.writeFileSync(agentChatPath, content);
  console.log('Fixed agent-chat/route.ts');
}

// Fix agents/pulse-config/route.ts
const pulseConfigPath = path.join(__dirname, '..', 'src/app/api/agents/pulse-config/route.ts');
if (fs.existsSync(pulseConfigPath)) {
  let content = fs.readFileSync(pulseConfigPath, 'utf8');
  content = content.replace(
    /return NextResponse\.json\({ success: true, message: 'Pulse configuration updated'\)\s*config: updates\s*\)\s*}\)/g,
    "return NextResponse.json({ success: true, message: 'Pulse configuration updated', config: updates });"
  );
  fs.writeFileSync(pulseConfigPath, content);
  console.log('Fixed agents/pulse-config/route.ts');
}

// Fix agents/pulse-status/route.ts
const pulseStatusPath = path.join(__dirname, '..', 'src/app/api/agents/pulse-status/route.ts');
if (fs.existsSync(pulseStatusPath)) {
  let content = fs.readFileSync(pulseStatusPath, 'utf8');
  content = content.replace(
    /return NextResponse\.json\({ status: 'building'\)\s*message: 'System initializing\.\.\.',\)\s*timestamp: new Date\(\)\.toISOString\(\)\s*}\)/g,
    "return NextResponse.json({ status: 'building', message: 'System initializing...', timestamp: new Date().toISOString() });"
  );
  fs.writeFileSync(pulseStatusPath, content);
  console.log('Fixed agents/pulse-status/route.ts');
}

// Fix all similar patterns in API routes
const apiDir = path.join(__dirname, '..', 'src/app/api');

function fixApiRoutePatterns(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixApiRoutePatterns(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      // Fix patterns like: status: 500   )
      if (content.includes('status: 500   )')) {
        content = content.replace(/status: 500\s*\)/g, 'status: 500');
        modified = true;
      }
      if (content.includes('status: 404   )')) {
        content = content.replace(/status: 404\s*\)/g, 'status: 404');
        modified = true;
      }
      if (content.includes('status: 401   )')) {
        content = content.replace(/status: 401\s*\)/g, 'status: 401');
        modified = true;
      }
      
      // Fix malformed JSON responses
      if (content.includes('})') && content.includes('})')) {
        content = content.replace(/}\)\s*}\)/g, '});');
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Fixed patterns in ${path.relative(apiDir, fullPath)}`);
      }
    }
  });
}

// Run the fix
fixApiRoutePatterns(apiDir);

console.log('All API syntax errors fixed!');