const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all page.tsx files
const pageFiles = glob.sync('src/app/**/page.tsx', { 
  cwd: path.join(__dirname, '..'),
  absolute: true 
});

console.log(`Found ${pageFiles.length} page files`);

let updated = 0;

pageFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Skip if already has 'use client'
  if (content.includes("'use client'") || content.includes('"use client"')) {
    console.log(`✓ ${path.relative(process.cwd(), file)} - already client component`);
    return;
  }
  
  // Skip if already has dynamic export
  if (content.includes("export const dynamic")) {
    console.log(`✓ ${path.relative(process.cwd(), file)} - already has dynamic export`);
    return;
  }
  
  // Check if imports any UI components that might use hooks
  const hasUIImports = content.includes('@/components/ui/') || 
                      content.includes('Button') ||
                      content.includes('Card') ||
                      content.includes('Badge') ||
                      content.includes('Input') ||
                      content.includes('Select');
  
  if (hasUIImports) {
    // Add 'use client' and dynamic export at the top
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find where to insert (after any comments)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line.startsWith('/*') && !line.startsWith('*') && !line.startsWith('//') && line !== '') {
        insertIndex = i;
        break;
      }
    }
    
    // Insert directives
    lines.splice(insertIndex, 0, "'use client';", '', "// Force dynamic rendering to avoid SSG errors", "export const dynamic = 'force-dynamic';", '');
    
    content = lines.join('\n');
    fs.writeFileSync(file, content);
    console.log(`✅ Updated ${path.relative(process.cwd(), file)}`);
    updated++;
  } else {
    console.log(`⏭ ${path.relative(process.cwd(), file)} - no UI imports, skipping`);
  }
});

console.log(`\n✨ Updated ${updated} files with dynamic rendering`);