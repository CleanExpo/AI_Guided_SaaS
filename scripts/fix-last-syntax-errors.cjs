#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Final batch of files to fix
const fixes = [
  {
    file: 'src/app/api/visual/analyze/route.ts',
    pattern: /{ error: 'Image URL is required' };/g,
    replacement: "{ error: 'Image URL is required' },"
  },
  {
    file: 'src/app/api/visual/generate/route.ts',
    pattern: /const {}\s*prompt,/g,
    replacement: 'const {\n      prompt,'
  },
  {
    file: 'src/app/api/visual/generate/route.ts',
    pattern: /{ error: 'Prompt is required' };/g,
    replacement: "{ error: 'Prompt is required' },"
  },
  {
    file: 'src/app/api/visual/upload/route.ts',
    pattern: /{ error: 'No file provided' };/g,
    replacement: "{ error: 'No file provided' },"
  },
  {
    file: 'src/app/api/webhooks/stripe/route.ts',
    pattern: /apiVersion: '2023-08-16'\);/g,
    replacement: "apiVersion: '2023-08-16'\n});"
  },
  {
    file: 'src/app/auth/signin/page.tsx',
    pattern: /props: anyexport default function/g,
    replacement: 'export default function'
  }
];

// Apply fixes
fixes.forEach(({ file, pattern, replacement }) => {
  const filePath = path.join(process.cwd(), file);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(pattern, replacement);
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed ${file}`);
    }
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
});

// Fix visual routes comprehensively
const visualRoutes = [
  'src/app/api/visual/analyze/route.ts',
  'src/app/api/visual/generate/route.ts',
  'src/app/api/visual/upload/route.ts'
];

visualRoutes.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix all error response semicolons
    content = content.replace(/({ error:[^}]+});(\s*{ status:)/g, '$1,$2');
    
    // Fix other object semicolons
    content = content.replace(/([,\s])([a-zA-Z_]+):\s*([^,;}]+);(\s*})/g, '$1$2: $3,$4');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Comprehensively fixed ${file}`);
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
});

console.log('\nAll syntax fixes applied.');