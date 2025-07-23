#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fix badge.tsx
function fixBadge() {
  const filePath = path.join(process.cwd(), 'src/components/ui/badge.tsx');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix missing comma in defaultVariants
  content = content.replace(/defaultVariants: {\s*variant: "default"\s*}\s*}\s*\);/g, 
    'defaultVariants: {\n      variant: "default"\n    }\n  }\n);');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed badge.tsx');
}

// Fix button.tsx
function fixButton() {
  const filePath = path.join(process.cwd(), 'src/components/ui/button.tsx');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix missing comma in defaultVariants
  content = content.replace(/defaultVariants: {\s*variant: "default",\s*size: "default"\s*}\s*}\s*\);/g,
    'defaultVariants: {\n      variant: "default",\n      size: "default"\n    }\n  }\n);');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed button.tsx');
}

// Fix progress.tsx
function fixProgress() {
  const filePath = path.join(process.cwd(), 'src/components/ui/progress.tsx');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix duplicate React imports
  content = content.replace(/import React from 'react';\s*import \* as React from "react";/g,
    'import * as React from "react";');
  
  // Fix malformed forwardRef
  content = content.replace(/const Progress = React\.forwardRef<;/g,
    'const Progress = React.forwardRef<');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed progress.tsx');
}

// Fix tabs.tsx
function fixTabs() {
  const filePath = path.join(process.cwd(), 'src/components/ui/tabs.tsx');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix malformed className
  content = content.replace(/className\s*,->[\s\S]*?className=\{`cn\(`/g, 
    'className\n        )}\n        {...props}\n      />\n  ));\n  TabsList.displayName = TabsPrimitive.List.displayName;\n  const TabsTrigger = React.forwardRef<\n    React.ElementRef<typeof TabsPrimitive.Trigger>,\n    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>\n  >(({ className, ...props }, ref) => (\n    <TabsPrimitive.Trigger\n      ref={ref}\n      className={cn(');
  
  // Fix closing syntax
  content = content.replace(/className\s*\)`}`/g, 'className\n      )}');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed tabs.tsx');
}

// Fix admin/analytics/page.tsx
function fixAdminAnalytics() {
  const filePath = path.join(process.cwd(), 'src/app/admin/analytics/page.tsx');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix missing closing div
  content = content.replace(/Last, login: \{user\.lastLogin\}\s*<\/div>\s*\)\)\}/g,
    'Last login: {user.lastLogin}\n                  </div>\n                </div>\n              ))}');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed admin/analytics/page.tsx');
}

// Run all fixes
try {
  fixBadge();
  fixButton();
  fixProgress();
  fixTabs();
  fixAdminAnalytics();
  console.log('\nAll syntax errors fixed!');
} catch (error) {
  console.error('Error fixing files:', error);
}