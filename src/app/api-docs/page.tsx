/* BREADCRUMB: pages - Application pages and routes */
'use client';

// Force dynamic rendering to avoid SSG errors
export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, ExternalLink } from 'lucide-react';
import Link from 'next/link';



const apiEndpoints = [
  { name: 'Authentication',
    slug: 'auth',
    description: 'User authentication and session management',
    version: 'v1',
    status: 'stable',
  },
  { name: 'Users',
    slug: 'users',
    description: 'User management and profiles',
    version: 'v1',
    status: 'stable',
  },
  { name: 'Projects',
    slug: 'projects',
    description: 'Project creation and management',
    version: 'v1',
    status: 'beta',
  }
];

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
          <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Code className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">API Documentation</h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete reference for integrating with the AI Guided SaaS Platform API
          
        </div>

        <div className="glass grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apiEndpoints.map((endpoint) => (
            <Card key={endpoint.slug} className="hover:shadow-md-lg transition-shadow-md glass">
              <CardHeader className="glass">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg glass">{endpoint.name}</CardTitle>
                  <Badge variant={endpoint.status === 'stable' ? 'default' : 'secondary'}>
                    {endpoint.status}
                  
                </div>
              </CardHeader>
              <CardContent className="glass">
                <p className="text-gray-600 mb-4">{endpoint.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Version {endpoint.version}</span>
                  <Link href={`/api-docs/${endpoint.slug}`}>
                    <Button size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Docs
                    
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        

        <div className="mt-12 glass rounded-xl-lg shadow-md-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <div className="space-y-4">
          <p className="text-gray-600">
            To get started with our API, you'll need to authenticate using your API key.</p>
            
            <div className="glass rounded-xl-lg p-4">
              <code className="text-sm">
                curl -H "Authorization: Bearer YOUR_API_KEY" https://api.aiguidedsaas.com/v1/</code>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}