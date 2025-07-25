const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all page.tsx files with metadata conflicts
const pageFiles = glob.sync('src/app/**/page.tsx', { 
  cwd: path.join(__dirname, '..'),
  absolute: true 
});

console.log(`Checking ${pageFiles.length} page files for metadata conflicts...`);

let fixed = 0;

pageFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Check if has both 'use client' and metadata export
  const hasUseClient = content.includes("'use client'") || content.includes('"use client"');
  const hasMetadata = content.includes('export const metadata');
  
  if (hasUseClient && hasMetadata) {
    console.log(`⚠️  Conflict found in ${path.relative(process.cwd(), file)}`);
    
    // Remove the metadata export from client components
    content = content.replace(/export const metadata[^;]+;/gs, '');
    
    // Also remove the Metadata import if it exists and is not used elsewhere
    if (!content.includes('Metadata') || content.match(/Metadata/g).length === 1) {
      content = content.replace(/import\s*{\s*Metadata\s*}\s*from\s*'next';\s*\n?/g, '');
    }
    
    fs.writeFileSync(file, content);
    console.log(`✅ Fixed ${path.relative(process.cwd(), file)}`);
    fixed++;
  }
});

console.log(`\n✨ Fixed ${fixed} metadata conflicts`);