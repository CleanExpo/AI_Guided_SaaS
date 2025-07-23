const fs = require('fs');
const path = require('path');

function fixSemicolonInObjects(content) {
  // Fix semicolons in object literals and function calls
  return content
    .replace(/(\w+)\s*:\s*([^,;}]+);(\s*\n?\s*\w+\s*:)/g, '$1: $2,$3')
    .replace(/(\w+)\s*:\s*([^,;}]+);(\s*\n?\s*})/g, '$1: $2$3')
    .replace(/('Invalid email format');/g, "'Invalid email format'),")
    .replace(/('Authentication API documentation content...');/g, "'Authentication API documentation content...',");
}

const files = [
  'src/app/analytics/page.tsx',
  'src/app/api-docs/[slug]/page.tsx',
  'src/app/api-docs/page.tsx',
  'src/app/api/admin/analytics/route.ts',
  'src/app/api/admin/auth/login/route.ts'
];

let fixCount = 0;
files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixSemicolonInObjects(content);
    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed);
      console.log('Fixed: ' + file);
      fixCount++;
    }
  }
});

console.log(`Fixed ${fixCount} files`);