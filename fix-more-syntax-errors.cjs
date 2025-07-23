const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Dashboard page specific fix
    if (filePath.includes('dashboard/page.tsx')) {
      content = content.replace(
        /const Dashboard = lazy\(\(\) => import\('@\/components\/Dashboard'\)\),\s*propsexport/g,
        "const Dashboard = lazy(() => import('@/components/Dashboard'));\n\nexport"
      );
      modified = true;
    }
    
    // Data flexibility page - missing comma
    if (filePath.includes('data-flexibility/page.tsx')) {
      content = content.replace(
        /email:\s*'[^']+'\s*role:/g,
        (match) => match.replace(/'\s*role:/, "', role:")
      );
      modified = true;
    }
    
    // Design system page - fix JSX structure
    if (filePath.includes('design-system/page.tsx')) {
      content = content.replace(
        /<div className="[^"]+"><\/div>\s*<div className="/g,
        (match) => {
          const className = match.match(/className="([^"]+)"/)[1];
          return `<div className="${className}">\n        <div className="`;
        }
      );
      modified = true;
    }
    
    // Docs slug page - fix template literal
    if (filePath.includes('docs/[slug]/page.tsx')) {
      content = content.replace(
        /content:\s*`([^`]+)`\s*\n([^,}])/g,
        (match, p1, p2) => `content: \`${p1}\n${p2}`
      );
      modified = true;
    }
    
    // Docs page - fix JSX structure
    if (filePath.includes('docs/page.tsx') && !filePath.includes('[slug]')) {
      content = content.replace(
        /<div className="[^"]+"><\/div>\s*<div className="/g,
        (match) => {
          const className = match.match(/className="([^"]+)"/)[1];
          return `<div className="${className}">\n        <div className="`;
        }
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Files to fix based on the error output
const filesToFix = [
  'src/app/dashboard/page.tsx',
  'src/app/demo/data-flexibility/page.tsx',
  'src/app/demo/design-system/page.tsx',
  'src/app/docs/[slug]/page.tsx',
  'src/app/docs/page.tsx'
];

let totalFixed = 0;
filesToFix.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    if (fixFile(fullPath)) {
      totalFixed++;
    }
  } else {
    console.log(`File not found: ${fullPath}`);
  }
});

console.log(`\nTotal files fixed: ${totalFixed}`);