#!/usr/bin/env node

/**
 * MCAS Precise Build Fixer
 * Fixes the exact syntax errors reported by Next.js build
 */

const fs = require('fs');
const path = require('path');

// Specific fixes for known problem files
const fixes = {
  'src/app/about/page.tsx': {
    find: /return\s*\(\s*<div[^>]*>\s*\)\s*;/g,
    replace: 'return (\n    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">\n      <div className="container mx-auto px-4 max-w-4xl">'
  },
  'src/app/admin-direct/page.tsx': {
    find: /const\s+\[password,\s*setPassword\]\s*=\s*useState\(''\),\s*const/g,
    replace: "const [password, setPassword] = useState('');\n  const"
  },
  'src/app/admin/agent-monitor/page.tsx': {
    find: /return\s*\(\s*<div[^>]*>\s*\)\s*;/g,
    replace: 'return (\n    <div className="container mx-auto p-6 space-y-6">\n      <div className="flex items-center justify-between">'
  },
  'src/app/admin/analytics/page.tsx': {
    find: /const\s+\[users,\s*setUsers\]\s*=\s*useState<AdminUser\[\]>\(\[\]\),\s*const/g,
    replace: "const [users, setUsers] = useState<AdminUser[]>([]);\n  const"
  }
};

/**
 * Apply manual fixes to specific files
 */
function applyManualFixes() {
  // Fix about page
  const aboutPath = path.join(process.cwd(), 'src/app/about/page.tsx');
  if (fs.existsSync(aboutPath)) {
    const content = `/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - AI Guided SaaS Platform',
  description: 'Learn about our mission to revolutionize software development with AI'
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About AI Guided SaaS</h1>
          
          <div className="space-y-6">
            <p className="text-lg text-gray-700">
              We're revolutionizing software development by making professional-grade applications accessible to everyone through AI-powered guidance.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Mission</h2>
              <p className="text-gray-700">
                To democratize software creation by combining the power of AI with intuitive design tools, enabling anyone to build professional applications.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">For Beginners</h3>
                <p className="text-gray-600">
                  Start with guided templates and let AI help you build your first application with no coding experience required.
                </p>
              </div>
              
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">For Professionals</h3>
                <p className="text-gray-600">
                  Access advanced tools, custom code editing, and AI-powered optimization for enterprise-grade applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;
    fs.writeFileSync(aboutPath, content, 'utf8');
    console.log('✓ Fixed src/app/about/page.tsx');
  }

  // Fix admin-direct page
  const adminDirectPath = path.join(process.cwd(), 'src/app/admin-direct/page.tsx');
  if (fs.existsSync(adminDirectPath)) {
    const content = `/* BREADCRUMB: pages - Application pages and routes */
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDirectPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const handleDirectAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/direct-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('admin-token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Direct Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDirectAuth} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Master Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter master password"
                required
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !password}
            >
              {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}`;
    fs.writeFileSync(adminDirectPath, content, 'utf8');
    console.log('✓ Fixed src/app/admin-direct/page.tsx');
  }

  // Fix agent-monitor page
  const agentMonitorPath = path.join(process.cwd(), 'src/app/admin/agent-monitor/page.tsx');
  if (fs.existsSync(agentMonitorPath)) {
    const content = `/* BREADCRUMB: pages - Application pages and routes */
'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentPulseMonitor } from '@/components/AgentPulseMonitor';
import { ContainerMonitor } from '@/components/ContainerMonitor';
import { SystemMetrics } from '@/components/health/SystemMetrics';
import { TaskQueueVisualizer } from '@/components/health/TaskQueueVisualizer';
import { AlertsPanel } from '@/components/health/AlertsPanel';

export default function AgentMonitorPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Agent Monitoring</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="containers">Containers</TabsTrigger>
          <TabsTrigger value="metrics">System Metrics</TabsTrigger>
          <TabsTrigger value="queue">Task Queue</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SystemMetrics />
            <AlertsPanel />
          </div>
          <TaskQueueVisualizer />
        </TabsContent>

        <TabsContent value="agents">
          <AgentPulseMonitor />
        </TabsContent>

        <TabsContent value="containers">
          <ContainerMonitor />
        </TabsContent>

        <TabsContent value="metrics">
          <SystemMetrics />
        </TabsContent>

        <TabsContent value="queue">
          <TaskQueueVisualizer />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}`;
    fs.writeFileSync(agentMonitorPath, content, 'utf8');
    console.log('✓ Fixed src/app/admin/agent-monitor/page.tsx');
  }

  // Fix analytics page
  const analyticsPath = path.join(process.cwd(), 'src/app/admin/analytics/page.tsx');
  if (fs.existsSync(analyticsPath)) {
    const content = `/* BREADCRUMB: pages - Application pages and routes */
'use client';
import React, { useState, useEffect } from 'react';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  lastActive: Date;
  role: string;
}

export default function AdminAnalyticsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setUsers([
        { 
          id: '1', 
          email: 'admin@example.com', 
          name: 'Admin User', 
          lastActive: new Date(), 
          role: 'admin' 
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid gap-6">
        <AdminAnalytics />
        
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading users...</p>
            ) : (
              <div className="space-y-2">
                {users.map(user => (
                  <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Last active: {user.lastActive.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}`;
    fs.writeFileSync(analyticsPath, content, 'utf8');
    console.log('✓ Fixed src/app/admin/analytics/page.tsx');
  }
}

console.log('🎯 MCAS Precise Build Fixer');
console.log('===========================\n');

// Apply manual fixes
applyManualFixes();

// Process all files to fix common patterns
function fixCommonPatterns(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix variable declarations with comma-separated const/let
    content = content.replace(/const\s+\[([^\]]+)\]\s*=\s*([^,;]+),\s*const/g, 'const [$1] = $2;\n  const');
    content = content.replace(/let\s+\[([^\]]+)\]\s*=\s*([^,;]+),\s*let/g, 'let [$1] = $2;\n  let');
    
    // Fix semicolons in wrong places
    content = content.replace(/,\s*;/g, ';');
    content = content.replace(/;\s*,/g, ',');
    
    // Ensure proper file ending
    if (!content.endsWith('\n')) {
      content += '\n';
    }
    
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
      if (fixCommonPatterns(fullPath)) {
        console.log(`✓ Fixed common patterns in ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
}

console.log('\nProcessing remaining files...');
processDirectory(path.join(process.cwd(), 'src'));

console.log('\n✅ Build fixes complete!');