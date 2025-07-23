#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files with specific syntax errors
const filesToFix = [
  {
    path: 'src/app/api/semantic/search/route.ts',
    fixes: [
      { find: /filters: z\.record\(z\.any\(\)\)\.optional\(\);/g, replace: 'filters: z.record(z.any()).optional(),' },
      { find: /size: z\.number\(\)\.min\(1\)\.max\(100\)\.optional\(\)\.default\(7\);/g, replace: 'size: z.number().min(1).max(100).optional().default(7),' }
    ]
  },
  {
    path: 'src/app/api/support/chat/route.ts',
    fixes: [
      { find: /message: z\.string\(\)\.min\(1, 'Message is required'\);/g, replace: "message: z.string().min(1, 'Message is required')," },
      { find: /context: z\.record\(z\.any\(\)\)\.optional\(\);/g, replace: 'context: z.record(z.any()).optional(),' }
    ]
  },
  {
    path: 'src/app/api/templates/route.ts',
    fixes: [
      { find: /difficulty: 'medium'\s*};/g, replace: "difficulty: 'medium'\n        }," }
    ]
  },
  {
    path: 'src/app/api/tutorials/progress/route.ts',
    fixes: [
      { find: /id: 'progress_' \+ Math\.random\(\)\.toString\(36\)\.substr\(2, 9\);/g, replace: "id: 'progress_' + Math.random().toString(36).substr(2, 9)," },
      { find: /timestamp: new Date\(\)\.toISOString\(\);/g, replace: 'timestamp: new Date().toISOString(),' }
    ]
  },
  {
    path: 'src/app/api/validated-chat/route.ts',
    fixes: [
      { find: /return, schema\.parse\(data\);/g, replace: 'return schema.parse(data);' },
      { find: /message: z\.string\(\)\.min\(1, 'Message is required'\);/g, replace: "message: z.string().min(1, 'Message is required')," }
    ]
  }
];

// Process each file
let totalFixes = 0;

filesToFix.forEach(({ path: filePath, fixes }) => {
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let fixCount = 0;
    
    fixes.forEach(({ find, replace }) => {
      const before = content;
      content = content.replace(find, replace);
      if (before !== content) {
        fixCount++;
      }
    });
    
    if (fixCount > 0) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Fixed ${fixCount} issues in ${filePath}`);
      totalFixes += fixCount;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log(`\nTotal fixes applied: ${totalFixes}`);