const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to fix common syntax patterns
function fixSyntaxErrors(content, filePath) {
  let modified = false;
  
  // Fix missing commas in object literals
  content = content.replace(/email:\s*'[^']+'\s+role:/g, (match) => {
    modified = true;
    return match.replace(/'\s+role:/, "', role:");
  });
  
  content = content.replace(/price:\s*[\d.]+\s+category:/g, (match) => {
    modified = true;
    return match.replace(/\s+category:/, ', category:');
  });
  
  content = content.replace(/productId:\s*\d+;\s*total:/g, (match) => {
    modified = true;
    return match.replace(/;/, ',');
  });
  
  content = content.replace(/conversions:\s*\d+\s+revenue:/g, (match) => {
    modified = true;
    return match.replace(/\s+revenue:/, ',\n    revenue:');
  });
  
  content = content.replace(/totalOrders:\s*[^,}]+\s+revenue:/g, (match) => {
    modified = true;
    return match.replace(/\s+revenue:/, ',\n    revenue:');
  });
  
  // Fix template literal issues
  content = content.replace(/content:\s*`([^`]+)`\s*\n([A-Z])/g, (match, p1, p2) => {
    modified = true;
    return `content: \`${p1}\n\`,\n    ${p2}`;
  });
  
  // Fix JSX structure issues
  content = content.replace(/<div className="[^"]+"><\/div>\s*<div className="/g, (match) => {
    const className = match.match(/className="([^"]+)"/)[1];
    modified = true;
    return `<div className="${className}">\n        <div className="`;
  });
  
  // Fix duplicate closing tags
  content = content.replace(/<\/CardTitle><\/CardTitle>/g, '</CardTitle>');
  content = content.replace(/<\/p><\/p>/g, '</p>');
  content = content.replace(/<\/Badge><\/Badge>/g, '</Badge>');
  content = content.replace(/<\/Card><\/Card>/g, '</Card>');
  content = content.replace(/<\/h1><\/h1>/g, '</h1>');
  content = content.replace(/<\/h2><\/h2>/g, '</h2>');
  content = content.replace(/<\/Button><\/Button>/g, '</Button>');
  content = content.replace(/<\/span><\/span>/g, '</span>');
  content = content.replace(/<\/div><\/div>/g, '</div>');
  
  // Fix malformed JSX
  content = content.replace(/>>\/div>/g, '>\n              </div>');
  content = content.replace(/>><\/div>/g, '>\n              </div>');
  
  // Fix missing return statements and structure
  if (filePath.includes('data-flexibility')) {
    // Find where return should be
    const returnIndex = content.indexOf('return (');
    if (returnIndex === -1) {
      // Add return statement after the data object closing brace
      content = content.replace(/}\s*<div className="min-h-screen/, '};\n\n  return (\n    <div className="min-h-screen');
      modified = true;
    }
  }
  
  return { content, modified };
}

// Process all TypeScript/TSX files
const files = glob.sync('src/**/*.{ts,tsx}', { cwd: process.cwd() });

let totalFixed = 0;
let filesFixed = [];

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  try {
    const originalContent = fs.readFileSync(fullPath, 'utf8');
    const { content, modified } = fixSyntaxErrors(originalContent, file);
    
    if (modified) {
      fs.writeFileSync(fullPath, content);
      totalFixed++;
      filesFixed.push(file);
      console.log(`Fixed: ${file}`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nTotal files fixed: ${totalFixed}`);
if (filesFixed.length > 0) {
  console.log('\nFiles fixed:');
  filesFixed.forEach(f => console.log(`  - ${f}`));
}