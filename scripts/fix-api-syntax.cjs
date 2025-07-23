const fs = require('fs');
const path = require('path');

function fixSemicolonInObjects(content) {
  // Fix semicolons in object literals
  return content
    .replace(/(\w+)\s*:\s*([^,;}]+);(\s*\n\s*\w+\s*:)/g, '$1: $2,$3')
    .replace(/(\w+)\s*:\s*([^,;}]+);(\s*\n\s*})/g, '$1: $2$3');
}

const files = [
  'src/app/api/admin/debug/route.ts',
  'src/app/api/admin/direct-auth/route.ts'
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