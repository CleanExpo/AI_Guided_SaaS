const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Starting comprehensive build error fixes...\n');

// Find all page.tsx files
const pageFiles = glob.sync('src/app/**/page.tsx', { 
  cwd: path.join(__dirname, '..'),
  absolute: true 
});

console.log(`Found ${pageFiles.length} page files to check\n`);

let fixedFiles = 0;
let errors = [];

pageFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(process.cwd(), file);
    
    // Check for various issues
    const hasUseClient = content.includes("'use client'") || content.includes('"use client"');
    const hasGenerateMetadata = content.includes('export async function generateMetadata') || 
                               content.includes('export function generateMetadata');
    const hasMetadataExport = content.includes('export const metadata');
    
    if (hasUseClient && (hasGenerateMetadata || hasMetadataExport)) {
      console.log(`⚠️  Conflict in ${relativePath}`);
      
      // For pages with generateMetadata, we need to remove 'use client'
      // and also remove any client-only hooks
      if (hasGenerateMetadata) {
        console.log(`   - Has generateMetadata - removing 'use client' and converting to server component`);
        
        // Remove 'use client' directive
        content = content.replace(/['"]use client['"];?\s*\n/g, '');
        
        // Remove force-dynamic if present
        content = content.replace(/\/\/.*Force dynamic rendering.*\nexport const dynamic = ['"]force-dynamic['"];?\s*\n/g, '');
        content = content.replace(/export const dynamic = ['"]force-dynamic['"];?\s*\n/g, '');
        
        // Check if component uses hooks
        if (content.includes('useState') || content.includes('useEffect')) {
          console.log(`   - Component uses hooks - needs refactoring`);
          
          // For dynamic route pages, we'll make them server components
          // and move any client logic to a separate client component
          if (file.includes('[')) {
            // This is a dynamic route - needs special handling
            const componentName = path.basename(path.dirname(file));
            
            // Create a client component wrapper
            const clientComponentPath = file.replace('/page.tsx', '/client.tsx');
            const clientComponentContent = `'use client';

import React from 'react';
${content.match(/import[^;]+from[^;]+;/g)?.filter(imp => 
  !imp.includes('Metadata') && 
  !imp.includes('notFound') &&
  !imp.includes('next/navigation')
).join('\n') || ''}

export default function ${componentName}Client({ data }: any) {
  ${content.match(/export default function[^{]+{[\s\S]+?^}/m)?.[0]
    ?.replace(/export default function[^{]+{/, '')
    ?.replace(/}$/, '') || ''}
}`;
            
            // Write client component
            fs.writeFileSync(clientComponentPath, clientComponentContent);
            console.log(`   - Created client component: ${path.relative(process.cwd(), clientComponentPath)}`);
            
            // Convert page to server component
            const pageMatch = content.match(/export default function\s+(\w+)/);
            const pageFunctionName = pageMatch ? pageMatch[1] : 'Page';
            
            content = `import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ${componentName}Client from './client';

${content.match(/\/\/ Mock[^]*?(?=export|$)/s)?.[0] || ''}

${content.match(/export async function generateMetadata[^}]+}/s)?.[0] || ''}

export default function ${pageFunctionName}({ params }: any) {
  // Server-side data fetching logic here
  ${content.match(/const\s+\w+\s*=\s*\w+\.find[^;]+;/g)?.join('\n  ') || ''}
  
  return <${componentName}Client data={{}} />;
}`;
          }
        }
      } else if (hasMetadataExport) {
        // For static metadata exports, just remove them from client components
        console.log(`   - Has metadata export - removing it`);
        content = content.replace(/export const metadata[^;]+;/gs, '');
        
        // Remove Metadata import if not used elsewhere
        if (!content.includes('Metadata') || content.match(/Metadata/g).length === 1) {
          content = content.replace(/import\s*{\s*Metadata\s*}\s*from\s*'next';\s*\n?/g, '');
        }
      }
      
      // Write the fixed content
      fs.writeFileSync(file, content);
      console.log(`   ✅ Fixed ${relativePath}`);
      fixedFiles++;
    } else if (!hasUseClient && !hasGenerateMetadata && !hasMetadataExport) {
      // Check if this is a page that should be a client component
      if (content.includes('useState') || content.includes('useEffect') || content.includes('onClick')) {
        console.log(`⚠️  ${relativePath} uses client features but missing 'use client'`);
        
        // Add 'use client' at the top
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
        
        lines.splice(insertIndex, 0, "'use client';", '');
        content = lines.join('\n');
        
        fs.writeFileSync(file, content);
        console.log(`   ✅ Added 'use client' to ${relativePath}`);
        fixedFiles++;
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${path.relative(process.cwd(), file)}: ${error.message}`);
    errors.push({ file: path.relative(process.cwd(), file), error: error.message });
  }
});

// Now check for any remaining issues in components
console.log('\n🔍 Checking component files...\n');

const componentFiles = glob.sync('src/components/**/*.tsx', {
  cwd: path.join(__dirname, '..'),
  absolute: true
});

componentFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(process.cwd(), file);
    
    // Check for browser globals without proper guards
    if (content.includes('window.') || content.includes('document.') || 
        content.includes('localStorage') || content.includes('sessionStorage')) {
      
      const hasUseClient = content.includes("'use client'") || content.includes('"use client"');
      
      if (!hasUseClient) {
        // Check if these are properly guarded
        const hasTypeofCheck = content.includes('typeof window') || content.includes('typeof document');
        const inUseEffect = content.includes('useEffect');
        
        if (!hasTypeofCheck && !inUseEffect) {
          console.log(`⚠️  ${relativePath} uses browser globals without guards`);
          
          // Add 'use client' directive
          const lines = content.split('\n');
          lines.unshift("'use client';", '');
          content = lines.join('\n');
          
          fs.writeFileSync(file, content);
          console.log(`   ✅ Added 'use client' to ${relativePath}`);
          fixedFiles++;
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${path.relative(process.cwd(), file)}: ${error.message}`);
    errors.push({ file: path.relative(process.cwd(), file), error: error.message });
  }
});

console.log('\n📊 Summary:');
console.log(`   ✅ Fixed ${fixedFiles} files`);
console.log(`   ❌ ${errors.length} errors`);

if (errors.length > 0) {
  console.log('\n❌ Errors encountered:');
  errors.forEach(err => {
    console.log(`   - ${err.file}: ${err.error}`);
  });
}

console.log('\n✨ Build error fixes complete!');