#!/usr/bin/env node

/**
 * 🔧 FINAL FUNCTION ERROR FIXES
 * 
 * Addresses the remaining "TypeError: j is not a function" errors
 * that are preventing successful page generation during build.
 */

const fs = require('fs');
const path = require('path');

class FinalFunctionErrorFixer {
  constructor() {
    this.fixes = [];
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      fix: '\x1b[32m'
    };
    const reset = '\x1b[0m';
    console.log(`${colors[type]}${message}${reset}`);
  }

  // Fix any remaining utility function issues
  fixUtilityFunctions() {
    this.log('🔧 Checking for additional utility function issues...', 'fix');
    
    // Check if there are any other files in lib that might have similar issues
    const libDir = 'src/lib';
    if (fs.existsSync(libDir)) {
      const files = fs.readdirSync(libDir, { recursive: true });
      
      files.forEach(file => {
        if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          const filePath = path.join(libDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Check for common function export issues
          if (content.includes('export function') || content.includes('export const')) {
            // Ensure proper function exports
            let needsFix = false;
            let fixedContent = content;
            
            // Fix any void return types that should be strings
            if (content.includes('): void') && (content.includes('return ') || content.includes('=>'))) {
              fixedContent = fixedContent.replace(/\): void\s*{/g, '): string {');
              fixedContent = fixedContent.replace(/\): void\s*=>/g, '): string =>');
              needsFix = true;
            }
            
            if (needsFix) {
              fs.writeFileSync(filePath, fixedContent);
              this.fixes.push(`✅ Fixed function types in ${filePath}`);
            }
          }
        }
      });
    }
  }

  // Fix component import/export issues
  fixComponentExports() {
    this.log('🔧 Checking component export issues...', 'fix');
    
    // Common problematic component patterns
    const componentsToCheck = [
      'src/components/ui/card.tsx',
      'src/components/ui/input.tsx',
      'src/hooks/use-toast.ts'
    ];
    
    componentsToCheck.forEach(componentPath => {
      if (fs.existsSync(componentPath)) {
        const content = fs.readFileSync(componentPath, 'utf8');
        let needsFix = false;
        let fixedContent = content;
        
        // Ensure proper React component patterns
        if (content.includes('React.forwardRef')) {
          // Make sure forwardRef components are properly typed
          if (!content.includes('React.ElementRef') && !content.includes('HTMLElement')) {
            // This might need manual inspection, but let's ensure basic structure
            this.log(`⚠️  Manual check needed for ${componentPath}`, 'warning');
          }
        }
        
        // Fix any obvious export issues
        if (content.includes('export {') && !content.includes('export default')) {
          // Ensure proper named exports structure
          const lines = content.split('\n');
          const hasProperExports = lines.some(line => 
            line.trim().startsWith('export {') && line.includes('}')
          );
          
          if (!hasProperExports) {
            this.log(`⚠️  Potential export issue in ${componentPath}`, 'warning');
          }
        }
      }
    });
  }

  // Fix specific hook issues
  fixHooksIssues() {
    this.log('🔧 Fixing React hooks issues...', 'fix');
    
    const useToastPath = 'src/hooks/use-toast.ts';
    if (fs.existsSync(useToastPath)) {
      const content = fs.readFileSync(useToastPath, 'utf8');
      
      // Ensure the hook has proper TypeScript types
      if (!content.includes('React.useState') && content.includes('useState')) {
        const fixedContent = content.replace(/import.*useState.*from 'react'/, 
          'import * as React from "react"');
        
        if (fixedContent !== content) {
          fs.writeFileSync(useToastPath, fixedContent);
          this.fixes.push('✅ Fixed React imports in use-toast hook');
        }
      }
    }
  }

  // Create a minimal working version of problematic components
  createFallbackComponents() {
    this.log('🔧 Creating fallback components for build safety...', 'fix');
    
    // Create a simple Card component if the current one has issues
    const cardPath = 'src/components/ui/card.tsx';
    if (!fs.existsSync(cardPath)) {
      const simpleCard = `import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };`;
      
      fs.writeFileSync(cardPath, simpleCard);
      this.fixes.push('✅ Created fallback Card component');
    }

    // Create a simple Input component if needed
    const inputPath = 'src/components/ui/input.tsx';
    if (!fs.existsSync(inputPath)) {
      const simpleInput = `import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };`;
      
      fs.writeFileSync(inputPath, simpleInput);
      this.fixes.push('✅ Created fallback Input component');
    }
  }

  // Add explicit error boundaries to prevent build failures
  addErrorBoundaries() {
    this.log('🔧 Adding error boundaries for safer builds...', 'fix');
    
    const errorBoundaryPath = 'src/components/ErrorBoundary.tsx';
    if (!fs.existsSync(errorBoundaryPath)) {
      const errorBoundary = `'use client';
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-[200px] p-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground">
              Please refresh the page or try again later.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}`;
      
      fs.writeFileSync(errorBoundaryPath, errorBoundary);
      this.fixes.push('✅ Created ErrorBoundary component');
    }
  }

  // Main execution
  async run() {
    this.log('🔧 FINAL FUNCTION ERROR FIXES - Starting...', 'info');
    
    try {
      this.fixUtilityFunctions();
      this.fixComponentExports();
      this.fixHooksIssues();
      this.createFallbackComponents();
      this.addErrorBoundaries();
      
      this.log('\n✅ FINAL FIXES COMPLETE', 'success');
      this.log(`🎯 Applied ${this.fixes.length} additional fixes:`, 'success');
      
      this.fixes.forEach((fix, index) => {
        this.log(`${index + 1}. ${fix}`, 'info');
      });
      
      this.log('\n🚀 Try running "npm run build" again', 'success');
      
    } catch (error) {
      this.log(`❌ ERROR: ${error.message}`, 'error');
      console.error(error);
      process.exit(1);
    }
  }
}

// Execute the fixer
const fixer = new FinalFunctionErrorFixer();
fixer.run();
