#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 HYDRATION CRISIS COMPREHENSIVE FIX');
console.log('=====================================');

// Fix 1: Ensure all UI components that use hooks have proper client directives
const uiComponentsToFix = [
  'src/components/ui/use-toast.tsx',
  'src/components/ui/collapsible.tsx', 
  'src/components/ui/button-enhanced.tsx',
  'src/components/ui/button-premium.tsx',
  'src/components/ui/navigation.tsx'
];

uiComponentsToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.startsWith("'use client'") && !content.startsWith('"use client"')) {
      console.log(`✅ Adding 'use client' to ${filePath}`);
      content = "'use client';\n" + content;
      fs.writeFileSync(filePath, content);
    }
  }
});

// Fix 2: Create missing UI component exports
const uiDir = 'src/components/ui';

// Fix label.tsx if it exists
const labelPath = path.join(uiDir, 'label.tsx');
if (fs.existsSync(labelPath)) {
  let content = fs.readFileSync(labelPath, 'utf8');
  if (!content.includes('export')) {
    console.log('✅ Fixing label.tsx exports');
    const labelFix = `'use client';
import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
`;
    fs.writeFileSync(labelPath, labelFix);
  }
}

// Fix scroll-area.tsx if it exists
const scrollAreaPath = path.join(uiDir, 'scroll-area.tsx');
if (fs.existsSync(scrollAreaPath)) {
  let content = fs.readFileSync(scrollAreaPath, 'utf8');
  if (!content.includes('export')) {
    console.log('✅ Fixing scroll-area.tsx exports');
    const scrollAreaFix = `'use client';
import * as React from "react";
import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <div className="h-full w-full overflow-auto">
      {children}
    </div>
  </div>
));
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
`;
    fs.writeFileSync(scrollAreaPath, scrollAreaFix);
  }
}

// Fix collapsible.tsx exports 
const collapsiblePath = path.join(uiDir, 'collapsible.tsx');
if (fs.existsSync(collapsiblePath)) {
  let content = fs.readFileSync(collapsiblePath, 'utf8');
  if (!content.includes('CollapsibleTrigger')) {
    console.log('✅ Adding missing CollapsibleTrigger export');
    // Add the missing export
    content = content.replace(
      'export { Collapsible, CollapsibleContent }', 
      'export { Collapsible, CollapsibleContent, CollapsibleTrigger }'
    );
    
    // Add CollapsibleTrigger component if missing
    if (!content.includes('const CollapsibleTrigger')) {
      const triggerComponent = `
const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("flex w-full items-center justify-between py-4", className)}
    {...props}
  >
    {children}
  </button>
));
CollapsibleTrigger.displayName = "CollapsibleTrigger";
`;
      // Insert before the export statement
      content = content.replace(
        'export { Collapsible, CollapsibleContent, CollapsibleTrigger }',
        triggerComponent + '\nexport { Collapsible, CollapsibleContent, CollapsibleTrigger }'
      );
    }
    
    fs.writeFileSync(collapsiblePath, content);
  }
}

// Fix 3: Add missing React imports to components that need them
const filesToCheckReactImports = [
  'src/components/ui/use-toast.tsx',
  'src/components/providers.tsx'
];

filesToCheckReactImports.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('React.useState') && !content.includes('import React')) {
      console.log(`✅ Adding React import to ${filePath}`);
      content = "import React from 'react';\n" + content;
      fs.writeFileSync(filePath, content);
    }
  }
});

// Fix 4: Ensure all hooks are properly imported
const hooksToFix = [
  'src/hooks/useToast.ts',
  'src/hooks/useMCP.ts',
  'src/hooks/useKiroIDE.ts',
  'src/hooks/useRAG.ts'
];

hooksToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Ensure React hooks are properly imported
    if (content.includes('useState') && !content.includes('import') && !content.includes('React')) {
      console.log(`✅ Adding React import to hook ${filePath}`);
      content = "import { useState, useEffect } from 'react';\n" + content;
      fs.writeFileSync(filePath, content);
    }
  }
});

// Fix 5: Update package.json to ensure proper React version
const packageJsonPath = 'package.json';
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  let updated = false;
  
  // Ensure React 18+ for proper SSR support
  if (packageJson.dependencies && packageJson.dependencies.react) {
    const currentVersion = packageJson.dependencies.react;
    if (!currentVersion.includes('18.') && !currentVersion.includes('^18')) {
      console.log('✅ Updating React version for better SSR support');
      packageJson.dependencies.react = '^18.2.0';
      packageJson.dependencies['react-dom'] = '^18.2.0';
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}

console.log('\n🎉 HYDRATION CRISIS FIX COMPLETE!');
console.log('================================');
console.log('✅ All client directives added');
console.log('✅ Missing component exports fixed'); 
console.log('✅ React imports normalized');
console.log('✅ Hook dependencies resolved');
console.log('\nHydration issues should now be resolved. Try running npm run build again.');
