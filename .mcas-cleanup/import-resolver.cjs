#!/usr/bin/env node

/**
 * MCAS Import Resolver
 * Automatically resolves missing imports based on TypeScript errors
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Common imports mapping
const COMMON_IMPORTS = {
  // React and Next.js
  'useState': "import { useState } from 'react'",
  'useEffect': "import { useEffect } from 'react'",
  'useCallback': "import { useCallback } from 'react'",
  'useMemo': "import { useMemo } from 'react'",
  'useRef': "import { useRef } from 'react'",
  'useContext': "import { useContext } from 'react'",
  'createContext': "import { createContext } from 'react'",
  'Fragment': "import { Fragment } from 'react'",
  'NextPage': "import type { NextPage } from 'next'",
  'GetServerSideProps': "import type { GetServerSideProps } from 'next'",
  'GetStaticProps': "import type { GetStaticProps } from 'next'",
  'useRouter': "import { useRouter } from 'next/navigation'",
  'Image': "import Image from 'next/image'",
  'Link': "import Link from 'next/link'",
  'Head': "import Head from 'next/head'",
  
  // UI Components
  'Button': "import { Button } from '@/components/ui/button'",
  'Card': "import { Card } from '@/components/ui/card'",
  'CardContent': "import { CardContent } from '@/components/ui/card'",
  'CardHeader': "import { CardHeader } from '@/components/ui/card'",
  'CardTitle': "import { CardTitle } from '@/components/ui/card'",
  'CardDescription': "import { CardDescription } from '@/components/ui/card'",
  'Input': "import { Input } from '@/components/ui/input'",
  'Label': "import { Label } from '@/components/ui/label'",
  'Badge': "import { Badge } from '@/components/ui/badge'",
  'Alert': "import { Alert } from '@/components/ui/alert'",
  'AlertDescription': "import { AlertDescription } from '@/components/ui/alert'",
  'Select': "import { Select } from '@/components/ui/select'",
  'SelectContent': "import { SelectContent } from '@/components/ui/select'",
  'SelectItem': "import { SelectItem } from '@/components/ui/select'",
  'SelectTrigger': "import { SelectTrigger } from '@/components/ui/select'",
  'SelectValue': "import { SelectValue } from '@/components/ui/select'",
  'Tabs': "import { Tabs } from '@/components/ui/tabs'",
  'TabsContent': "import { TabsContent } from '@/components/ui/tabs'",
  'TabsList': "import { TabsList } from '@/components/ui/tabs'",
  'TabsTrigger': "import { TabsTrigger } from '@/components/ui/tabs'",
  'Dialog': "import { Dialog } from '@/components/ui/dialog'",
  'DialogContent': "import { DialogContent } from '@/components/ui/dialog'",
  'DialogHeader': "import { DialogHeader } from '@/components/ui/dialog'",
  'DialogTitle': "import { DialogTitle } from '@/components/ui/dialog'",
  'DialogDescription': "import { DialogDescription } from '@/components/ui/dialog'",
  
  // Icons
  'ChevronDown': "import { ChevronDown } from 'lucide-react'",
  'ChevronRight': "import { ChevronRight } from 'lucide-react'",
  'Plus': "import { Plus } from 'lucide-react'",
  'Minus': "import { Minus } from 'lucide-react'",
  'X': "import { X } from 'lucide-react'",
  'Check': "import { Check } from 'lucide-react'",
  'Search': "import { Search } from 'lucide-react'",
  'Menu': "import { Menu } from 'lucide-react'",
  'User': "import { User } from 'lucide-react'",
  'Users': "import { Users } from 'lucide-react'",
  'Settings': "import { Settings } from 'lucide-react'",
  'Home': "import { Home } from 'lucide-react'",
  'LogOut': "import { LogOut } from 'lucide-react'",
  'ArrowRight': "import { ArrowRight } from 'lucide-react'",
  'Loader2': "import { Loader2 } from 'lucide-react'",
  
  // Utilities
  'cn': "import { cn } from '@/lib/utils'",
  'toast': "import { toast } from '@/components/ui/use-toast'",
  'useToast': "import { useToast } from '@/components/ui/use-toast'",
  
  // Auth
  'useSession': "import { useSession } from 'next-auth/react'",
  'signIn': "import { signIn } from 'next-auth/react'",
  'signOut': "import { signOut } from 'next-auth/react'",
  
  // Forms
  'useForm': "import { useForm } from 'react-hook-form'",
  'zodResolver': "import { zodResolver } from '@hookform/resolvers/zod'",
  'z': "import { z } from 'zod'",
  
  // State Management
  'useStore': "import { useStore } from '@/lib/store'",
  'create': "import { create } from 'zustand'",
  
  // API
  'axios': "import axios from 'axios'",
  'useSWR': "import useSWR from 'swr'",
  
  // Types
  'ReactNode': "import { ReactNode } from 'react'",
  'FC': "import { FC } from 'react'",
  'MouseEvent': "import { MouseEvent } from 'react'",
  'ChangeEvent': "import { ChangeEvent } from 'react'",
  'FormEvent': "import { FormEvent } from 'react'",
  
  // Supabase
  'createClient': "import { createClient } from '@supabase/supabase-js'",
  'supabase': "import { supabase } from '@/lib/supabase'",
  
  // Prisma
  'PrismaClient': "import { PrismaClient } from '@prisma/client'",
  'prisma': "import { prisma } from '@/lib/prisma'"
};

class ImportResolver {
  constructor() {
    this.totalFiles = 0;
    this.fixedFiles = 0;
    this.totalImportsAdded = 0;
    this.errorMap = new Map();
  }

  async run() {
    console.log('🔍 MCAS Import Resolver');
    console.log('======================');
    console.log('Analyzing TypeScript errors for missing imports...\n');

    // Get TypeScript errors
    await this.collectErrors();
    
    // Process each file with missing imports
    await this.resolveImports();
    
    // Report results
    this.report();
  }

  async collectErrors() {
    try {
      const output = execSync('npx tsc --noEmit 2>&1', { 
        encoding: 'utf8',
        cwd: process.cwd(),
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });
      
      const lines = output.split('\n');
      
      for (const line of lines) {
        // Match "Cannot find name" errors
        const match = line.match(/(.+\.tsx?)\((\d+),(\d+)\): error TS2304: Cannot find name '([^']+)'/);
        if (match) {
          const [_, file, lineNum, colNum, symbol] = match;
          if (!this.errorMap.has(file)) {
            this.errorMap.set(file, new Set());
          }
          this.errorMap.get(file).add(symbol);
        }
        
        // Match "Module not found" errors
        const moduleMatch = line.match(/(.+\.tsx?)\((\d+),(\d+)\): error TS2307: Cannot find module '([^']+)'/);
        if (moduleMatch) {
          const [_, file, lineNum, colNum, module] = moduleMatch;
          if (!this.errorMap.has(file)) {
            this.errorMap.set(file, new Set());
          }
          // Add a special marker for module imports
          this.errorMap.get(file).add(`MODULE:${module}`);
        }
      }
    } catch (error) {
      // TypeScript will exit with error code, but we still get the output
      if (error.stdout) {
        const lines = error.stdout.split('\n');
        
        for (const line of lines) {
          const match = line.match(/(.+\.tsx?)\((\d+),(\d+)\): error TS2304: Cannot find name '([^']+)'/);
          if (match) {
            const [_, file, lineNum, colNum, symbol] = match;
            if (!this.errorMap.has(file)) {
              this.errorMap.set(file, new Set());
            }
            this.errorMap.get(file).add(symbol);
          }
          
          const moduleMatch = line.match(/(.+\.tsx?)\((\d+),(\d+)\): error TS2307: Cannot find module '([^']+)'/);
          if (moduleMatch) {
            const [_, file, lineNum, colNum, module] = moduleMatch;
            if (!this.errorMap.has(file)) {
              this.errorMap.set(file, new Set());
            }
            this.errorMap.get(file).add(`MODULE:${module}`);
          }
        }
      }
    }
    
    console.log(`Found ${this.errorMap.size} files with missing imports\n`);
  }

  async resolveImports() {
    for (const [filePath, symbols] of this.errorMap) {
      this.totalFiles++;
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const imports = new Set();
        
        // Collect needed imports
        for (const symbol of symbols) {
          if (symbol.startsWith('MODULE:')) {
            // Handle module imports
            const moduleName = symbol.substring(7);
            imports.add(`import '${moduleName}'`);
          } else if (COMMON_IMPORTS[symbol]) {
            imports.add(COMMON_IMPORTS[symbol]);
          } else {
            // Try to guess the import
            const guessedImport = this.guessImport(symbol, filePath);
            if (guessedImport) {
              imports.add(guessedImport);
            }
          }
        }
        
        if (imports.size > 0) {
          const newContent = this.addImports(content, Array.from(imports));
          fs.writeFileSync(filePath, newContent, 'utf8');
          this.fixedFiles++;
          this.totalImportsAdded += imports.size;
          console.log(`✓ Added ${imports.size} imports to: ${path.relative(process.cwd(), filePath)}`);
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
      }
    }
  }

  guessImport(symbol, filePath) {
    // Check if it's a type/interface (starts with uppercase)
    if (/^[A-Z]/.test(symbol)) {
      // Check common patterns
      if (symbol.endsWith('Props')) {
        return `import type { ${symbol} } from '@/types'`;
      }
      if (symbol.endsWith('Type') || symbol.endsWith('Interface')) {
        return `import type { ${symbol} } from '@/types'`;
      }
      // Check if it might be a component
      if (filePath.includes('components')) {
        return `import { ${symbol} } from '@/components/${symbol}'`;
      }
      // Default to types
      return `import type { ${symbol} } from '@/types'`;
    }
    
    // Check if it's a hook (starts with 'use')
    if (symbol.startsWith('use')) {
      return `import { ${symbol} } from '@/hooks/${symbol}'`;
    }
    
    // Check if it's a utility function
    if (/^[a-z]/.test(symbol)) {
      return `import { ${symbol} } from '@/lib/utils'`;
    }
    
    return null;
  }

  addImports(content, imports) {
    const lines = content.split('\n');
    let lastImportIndex = -1;
    let hasUseClient = false;
    let hasUseServer = false;
    
    // Find the last import statement
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === "'use client'" || line === '"use client"') {
        hasUseClient = true;
      }
      if (line === "'use server'" || line === '"use server"') {
        hasUseServer = true;
      }
      if (line.startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    
    // Determine where to insert imports
    let insertIndex = 0;
    if (hasUseClient || hasUseServer) {
      insertIndex = 1;
    }
    if (lastImportIndex > -1) {
      insertIndex = lastImportIndex + 1;
    }
    
    // Sort imports
    const sortedImports = imports.sort((a, b) => {
      // External packages first
      const aExternal = !a.includes('@/') && !a.includes('./');
      const bExternal = !b.includes('@/') && !b.includes('./');
      if (aExternal && !bExternal) return -1;
      if (!aExternal && bExternal) return 1;
      return a.localeCompare(b);
    });
    
    // Insert imports
    lines.splice(insertIndex, 0, ...sortedImports);
    
    return lines.join('\n');
  }

  report() {
    console.log('\n📊 Import Resolution Summary:');
    console.log(`- Files analyzed: ${this.totalFiles}`);
    console.log(`- Files fixed: ${this.fixedFiles}`);
    console.log(`- Imports added: ${this.totalImportsAdded}`);
    
    const report = {
      timestamp: new Date().toISOString(),
      filesAnalyzed: this.totalFiles,
      filesFixed: this.fixedFiles,
      importsAdded: this.totalImportsAdded,
      filesWithMissingImports: Array.from(this.errorMap.keys()).map(file => ({
        file: path.relative(process.cwd(), file),
        missingSymbols: Array.from(this.errorMap.get(file))
      }))
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'import-resolution-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n✅ Import resolution complete!');
    console.log('📄 Report saved to: .mcas-cleanup/import-resolution-report.json');
  }
}

// Run the import resolver
const resolver = new ImportResolver();
resolver.run().catch(console.error);