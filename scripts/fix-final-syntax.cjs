const fs = require('fs');
const path = require('path');

function fixSemicolonInObjects(content) {
  // Fix semicolons in object literals and strings
  return content
    .replace(/(\w+)\s*:\s*([^,;}]+);(\s*\n\s*\w+\s*:)/g, '$1: $2,$3')
    .replace(/(\w+)\s*:\s*([^,;}]+);(\s*\n\s*})/g, '$1: $2$3')
    .replace(/("\.)\s*Let me help you with that!";/g, '". Let me help you with that!",')
    .replace(/'Pulse configuration updated';/g, "'Pulse configuration updated',");
}

const files = [
  'src/app/api/admin/users/route.ts',
  'src/app/api/agent-chat/route.ts',
  'src/app/api/agents/pulse-config/route.ts'
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