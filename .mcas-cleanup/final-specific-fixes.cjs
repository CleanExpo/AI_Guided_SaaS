#!/usr/bin/env node

/**
 * MCAS Final Specific Fixes
 * Fix the exact remaining syntax errors
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 MCAS Final Specific Fixes');
console.log('============================\n');

// Fix AgentPulseMonitor.tsx
const agentPulsePath = path.join(process.cwd(), 'src/components/AgentPulseMonitor.tsx');
if (fs.existsSync(agentPulsePath)) {
  let content = fs.readFileSync(agentPulsePath, 'utf8');
  
  // Fix the HTML entity issue
  content = content.replace(/const updateConfig = async \(updates: Record<string, any>\) => \{<\/string>/g, 
    'const updateConfig = async (updates: Record<string, any>) => {');
  
  // Fix any other stray HTML tags
  content = content.replace(/<\/string>/g, '');
  
  fs.writeFileSync(agentPulsePath, content, 'utf8');
  console.log('✓ Fixed src/components/AgentPulseMonitor.tsx');
}

// Fix TaskQueueVisualizer.tsx
const taskQueuePath = path.join(process.cwd(), 'src/components/health/TaskQueueVisualizer.tsx');
if (fs.existsSync(taskQueuePath)) {
  let content = fs.readFileSync(taskQueuePath, 'utf8');
  
  // Fix the array declaration
  content = content.replace(/const tasks = \[;/g, 'const tasks = [');
  
  fs.writeFileSync(taskQueuePath, content, 'utf8');
  console.log('✓ Fixed src/components/health/TaskQueueVisualizer.tsx');
}

// Fix badge.tsx
const badgePath = path.join(process.cwd(), 'src/components/ui/badge.tsx');
if (fs.existsSync(badgePath)) {
  let content = fs.readFileSync(badgePath, 'utf8');
  
  // Fix the cva syntax
  content = content.replace(/const badgeVariants = cva\(;/g, 'const badgeVariants = cva(');
  
  fs.writeFileSync(badgePath, content, 'utf8');
  console.log('✓ Fixed src/components/ui/badge.tsx');
}

// Fix button.tsx
const buttonPath = path.join(process.cwd(), 'src/components/ui/button.tsx');
if (fs.existsSync(buttonPath)) {
  let content = fs.readFileSync(buttonPath, 'utf8');
  
  // Fix the cva syntax
  content = content.replace(/const buttonVariants = cva\(;/g, 'const buttonVariants = cva(');
  
  // Ensure proper structure
  if (content.includes('const buttonVariants = cva(') && !content.includes('defaultVariants')) {
    // The file might be corrupted, rewrite it
    content = `import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };`;
  }
  
  fs.writeFileSync(buttonPath, content, 'utf8');
  console.log('✓ Fixed src/components/ui/button.tsx');
}

// Process remaining files to fix common syntax errors
function fixCommonSyntax(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Remove stray HTML tags
    content = content.replace(/<\/string>/g, '');
    content = content.replace(/<\/[^>]+>$/g, '');
    
    // Fix semicolon issues
    content = content.replace(/\[;/g, '[');
    content = content.replace(/\(;/g, '(');
    content = content.replace(/cva\(;/g, 'cva(');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Process all source files
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && 
          entry.name !== 'node_modules' && 
          entry.name !== '.next') {
        processDirectory(fullPath);
      }
    } else if (entry.isFile() && 
               (entry.name.endsWith('.ts') || 
                entry.name.endsWith('.tsx'))) {
      if (fixCommonSyntax(fullPath)) {
        console.log(`✓ Fixed ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
}

console.log('\nProcessing remaining files...');
processDirectory(path.join(process.cwd(), 'src'));

console.log('\n✅ Final specific fixes complete!');