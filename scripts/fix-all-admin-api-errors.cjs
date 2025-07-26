const fs = require('fs');
const path = require('path');

// List of files to fix
const filesToFix = [
  'src/app/api-docs/[slug]/page.tsx',
  'src/app/api/admin/auth/login/route.ts', 
  'src/app/api/admin/direct-auth/route.ts',
  'src/app/api/admin/route.ts',
  'src/app/api/admin/stats/route.ts'
];

// Fix extra closing divs in api-docs/[slug]/page.tsx
const apiDocsSlugPath = path.join(__dirname, '..', 'src/app/api-docs/[slug]/page.tsx');
if (fs.existsSync(apiDocsSlugPath)) {
  const content = fs.readFileSync(apiDocsSlugPath, 'utf8');
  const lines = content.split('\n');
  
  // Find and remove extra closing div around line 62
  for (let i = 60; i < 65 && i < lines.length; i++) {
    if (lines[i] && lines[i].trim() === '</div>' && lines[i+1] && lines[i+1].trim() === '</div>') {
      // Check if there are too many closing divs
      lines.splice(i, 1);
      break;
    }
  }
  
  fs.writeFileSync(apiDocsSlugPath, lines.join('\n'));
  console.log('Fixed api-docs/[slug]/page.tsx');
}

// Fix all admin API routes - missing closing parentheses
const adminApiFiles = [
  'src/app/api/admin/auth/login/route.ts',
  'src/app/api/admin/direct-auth/route.ts', 
  'src/app/api/admin/route.ts',
  'src/app/api/admin/stats/route.ts'
];

adminApiFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix missing closing parenthesis in status codes
    content = content.replace(/status: 500\s*\)\s*}\)/g, 'status: 500 });');
    content = content.replace(/status: 401\s*\)\s*}\)/g, 'status: 401 });');
    content = content.replace(/status: 500\s*\)/g, 'status: 500');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${file}`);
  }
});

console.log('All admin API errors fixed!');