#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🚀 Fixing Vercel Build Errors\n');

// Fix files with specific syntax errors from Vercel build
const fileFixes = {
  'src/components/ContainerMonitor.tsx': (content) => {
    return content
      // Fix function parameter separator
      .replace(/const handleContainerAction = async \(containerId: string; action: string\) => {/, 
               'const handleContainerAction = async (containerId: string, action: string) => {')
      // Fix fetch template literal
      .replace(/const response = await fetch\(`\/api\/agents\/containers\/\${containerId}\/\${action}`, \{`/, 
               'const response = await fetch(`/api/agents/containers/${containerId}/${action}`, {')
      // Fix template literal error
      .replace(/if \(!response\.ok\) throw new Error\(`Failed to \${action} container`\)`/, 
               'if (!response.ok) throw new Error(`Failed to ${action} container`)')
      // Fix console.error
      .replace(/console\.error\(`Error performing \${action}:`, error\)`/, 
               'console.error(`Error performing ${action}:`, error)')
      // Fix object property separators (semicolons to commas)
      .replace(/healthy: 'default';/, "healthy: 'default',")
      .replace(/unhealthy: 'destructive';/, "unhealthy: 'destructive',")
      .replace(/unknown: 'secondary'/, "unknown: 'secondary'")
      // Fix template literal with extra backtick
      .replace(/return `\${hours}h \${minutes}m``/, 'return `${hours}h ${minutes}m`')
      // Fix template literal in className
      .replace(/className=\{`border rounded-lg p-4 space-y-3 cursor-pointer transition-colors \${`/, 
               'className={`border rounded-lg p-4 space-y-3 cursor-pointer transition-colors ${')
      .replace(/selectedContainer === container\.id \? 'border-primary bg-accent' : ''\}`\}`/, 
               "selectedContainer === container.id ? 'border-primary bg-accent' : ''}`)");
  },
  
  'src/components/health/AlertsPanel.tsx': (content) => {
    return content
      // Fix import statement with extra semicolon
      .replace(/import React from 'react';\s*;025-07-22T08:53:00\.809Z   2 \| interface Alert \{/, 
               "import React from 'react';\ninterface Alert {");
  },
  
  'src/components/health/SystemMetrics.tsx': (content) => {
    return content
      // Fix import statement with extra semicolon
      .replace(/import React from 'react';\s*;025-07-22T08:53:00\.811Z   2 \| interface SystemMetricsProps \{/, 
               "import React from 'react';\ninterface SystemMetricsProps {");
  },
  
  'src/components/health/TaskQueueVisualizer.tsx': (content) => {
    return content
      // Fix import statement with extra semicolon
      .replace(/import React from 'react';\s*;025-07-22T08:53:00\.812Z   2 \| interface TaskQueueVisualizerProps \{/, 
               "import React from 'react';\ninterface TaskQueueVisualizerProps {");
  }
};

let totalFixed = 0;
let filesFixed = 0;

Object.entries(fileFixes).forEach(([filePath, fixFunction]) => {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const fixedContent = fixFunction(content);
      
      if (content !== fixedContent) {
        fs.writeFileSync(filePath, fixedContent);
        console.log(`✅ Fixed: ${filePath}`);
        filesFixed++;
        
        // Count changes
        const changes = content.split('\n').filter((line, i) => 
          line !== fixedContent.split('\n')[i]
        ).length;
        totalFixed += changes;
      }
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Summary:`);
console.log(`   Files fixed: ${filesFixed}`);
console.log(`   Total changes: ${totalFixed}`);
console.log(`\nVercel build errors should now be resolved!`);
