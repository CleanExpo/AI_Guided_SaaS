const fs = require('fs');
const path = require('path');

function fixSemicolonInObjects(content) {
  // Fix semicolons in object literals
  return content
    .replace(/(\w+)\s*:\s*([^,;}]+);(\s*\n\s*\w+\s*:)/g, '$1: $2,$3')
    .replace(/(\w+)\s*:\s*([^,;}]+);(\s*\n\s*})/g, '$1: $2$3')
    .replace(/('POST')\s+(\w+\s*:)/g, '$1,$2'); // Fix missing comma after 'POST'
}

const files = [
  'src/app/admin/analytics/page.tsx',
  'src/app/admin/dashboard/page.tsx',
  'src/app/admin/debug/page.tsx',
  'src/app/admin/login/page.tsx',
  'src/app/admin/mcp/page.tsx'
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixSemicolonInObjects(content);
    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed);
      console.log('Fixed: ' + file);
    }
  }
});

console.log('Admin syntax fix complete');