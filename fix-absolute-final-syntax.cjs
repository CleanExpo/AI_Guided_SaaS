const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixAllSyntaxErrors(content, filePath) {
  let modified = false;
  
  // Fix missing commas in object properties
  content = content.replace(/slug:\s*'[^']+'\s+description:/g, (match) => {
    modified = true;
    return match.replace(/'\s+description:/, "', description:");
  });
  
  content = content.replace(/description:\s*'[^']+'\s+icon:/g, (match) => {
    modified = true;
    return match.replace(/'\s+icon:/, "', icon:");
  });
  
  // Fix semicolons in object literals
  content = content.replace(/label:\s*`[^`]+`;/g, (match) => {
    modified = true;
    return match.replace(/`;/, "`,");
  });
  
  content = content.replace(/placeholder:\s*`[^`]+``/g, (match) => {
    modified = true;
    return match.replace(/``/, "`");
  });
  
  // Fix JSX closing tag issues
  content = content.replace(/<\/[^>]+>\s*<\/Card>\s*\{\/\*/g, (match) => {
    modified = true;
    return match.replace(/<\/Card>/, '</CardContent>\n              </Card>');
  });
  
  // Fix malformed JSX structures
  content = content.replace(/\}\s*<\/section>\s*<section>/g, (match) => {
    modified = true;
    return '}\n              </ul>\n            </section>\n            <section>';
  });
  
  // Fix missing CardContent closing tags
  if (filePath.includes('design-system')) {
    content = content.replace(/<\/div>\s*<\/Card>\s*\{\/\* Typography/g, 
      '</div>\n              </CardContent>\n            </Card>\n            {/* Typography');
    modified = true;
  }
  
  // Fix placeholder syntax in template strings
  content = content.replace(/className="([^"]+)">([^<]+)<\/p>/g, (match, className, text) => {
    if (text.includes('$')) {
      modified = true;
      return `className="${className}">${text.replace(/\$\d+/g, '')}</p>`;
    }
    return match;
  });
  
  // Remove malformed syntax patterns
  content = content.replace(/<\/\w+>\s*\);/g, (match) => {
    if (!match.includes('</div>')) {
      modified = true;
      return match.replace(/\);/, '');
    }
    return match;
  });
  
  return { content, modified };
}

// Get all TypeScript/TSX files
const files = glob.sync('src/**/*.{ts,tsx}', { cwd: process.cwd() });

let totalFixed = 0;
let filesFixed = [];

// Focus on files that are known to have errors
const priorityFiles = [
  'src/app/demo/design-system/page.tsx',
  'src/app/docs/page.tsx',
  'src/app/features/page.tsx',
  'src/app/form-builder/page.tsx',
  'src/app/gdpr/page.tsx',
  'src/app/help/page.tsx',
  'src/app/press/page.tsx',
  'src/app/pricing/page.tsx',
  'src/app/privacy/page.tsx',
  'src/app/projects/[id]/editor/page.tsx',
  'src/app/security/page.tsx',
  'src/app/status/page.tsx',
  'src/app/terms/page.tsx'
];

// Fix priority files first
priorityFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    try {
      const originalContent = fs.readFileSync(fullPath, 'utf8');
      const { content, modified } = fixAllSyntaxErrors(originalContent, file);
      
      if (modified) {
        fs.writeFileSync(fullPath, content);
        totalFixed++;
        filesFixed.push(file);
        console.log(`Fixed: ${file}`);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
});

// Then fix any remaining files
files.forEach(file => {
  if (!priorityFiles.includes(file)) {
    const fullPath = path.join(process.cwd(), file);
    try {
      const originalContent = fs.readFileSync(fullPath, 'utf8');
      const { content, modified } = fixAllSyntaxErrors(originalContent, file);
      
      if (modified) {
        fs.writeFileSync(fullPath, content);
        totalFixed++;
        filesFixed.push(file);
      }
    } catch (error) {
      // Silent error for non-priority files
    }
  }
});

console.log(`\nTotal files fixed: ${totalFixed}`);
if (filesFixed.length > 0) {
  console.log('\nFiles fixed:');
  filesFixed.forEach(f => console.log(`  - ${f}`));
}