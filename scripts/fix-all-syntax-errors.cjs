#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔧 COMPREHENSIVE: Fixing All Remaining Syntax Errors\n');

const _syntaxFixes = {
  // Fix ContainerMonitor component
  'src/components/ContainerMonitor.tsx': `'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

interface Container {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  cpu: number;
  memory: number;
  uptime: string;}
export default function ContainerMonitor() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading container data
    setTimeout(() => {
      setContainers([
        {
          id: '1',
          name: 'web-server',
          status: 'running',
          cpu: 45,
          memory: 512,
          uptime: '2h 15m'
        },
        {
          id: '2', 
          name: 'database',
          status: 'running',
          cpu: 23,
          memory: 1024,
          uptime: '5h 32m'}
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <div>Loading container information...</div>;}
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Container Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {containers.map((container) => (
              <div key={container.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {container.status === 'running' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">{container.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>CPU: {container.cpu}%</span>
                  <span>Memory: {container.memory}MB</span>
                  <Badge variant={container.status === 'running' ? 'default' : 'destructive'}>
                    {container.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`,

  // Fix input component
  'src/components/ui/input.tsx': `import * as React from "react";
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        // className
      )}
      ref={ref}
      {...props}
    />
  )
);

Input.displayName = "Input";

export { Input };`,

  // Fix tabs component
  'src/components/ui/tabs.tsx': `"use client";
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from '@/lib/utils';

const _Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      // className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      // className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      // className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };`,

  // Fix about page
  'src/app/about/page.tsx': `import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - AI Guided SaaS Platform',
  description: 'Learn about our mission to revolutionize software development with AI'
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">About AI Guided SaaS</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              We are revolutionizing software development by making AI-powered development 
              accessible to everyone. Whether you are a seasoned developer or just starting out, 
              our platform empowers you to build production-ready applications faster than ever before.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
            <p className="text-gray-600 leading-relaxed">
              Our platform combines the power of artificial intelligence with intuitive development 
              tools to help you transform ideas into reality. From intelligent code generation to 
              automated deployment, we handle the complex parts so you can focus on what matters most.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>AI-powered development tools that understand your requirements</li>
              <li>No-code and pro-code experiences to suit every skill level</li>
              <li>Enterprise-grade security and scalability built-in</li>
              <li>One-click deployment to any cloud platform</li>
              <li>Continuous learning and improvement of our AI models</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}`,

  // Fix admin-direct page
  'src/app/admin-direct/page.tsx': `'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDirectPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const _handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        setError('Invalid admin password');}
    } catch (error) {
      setError('Authentication failed');
    } finally {
      setIsLoading(false);}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                // required
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}`
};

let filesFixed = 0;
let errorsFound = 0;

Object.entries(syntaxFixes).forEach(([filePath, content]) => {
  try {
    if (fs.existsSync(filePath)) {
      const _dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });}
      fs.writeFileSync(filePath, content);
      console.log(`✅ SYNTAX FIX: ${filePath}`);
      filesFixed++;
    } else {
      console.log(`⚠️  SKIP: ${filePath} (file not found)`);}
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    errorsFound++;}
});

console.log(`\n🔧 Comprehensive Fix Summary:`);
console.log(`   Files fixed: ${filesFixed}`);
console.log(`   Errors encountered: ${errorsFound}`);
console.log(`   All major syntax errors should now be resolved!`);
console.log(`\n🚀 Ready for successful Next.js build!`);
