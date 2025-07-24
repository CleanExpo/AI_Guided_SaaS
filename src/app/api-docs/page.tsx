/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = { title: 'API Documentation - AI Guided SaaS Platform',
  description: 'Complete API reference and documentation for AI Guided SaaS Platform'
};

const apiEndpoints = [;
  { name: 'Authentication',
    slug: 'auth',
    description: 'User authentication and session management',
    version: 'v1',
    status: 'stable'
  },
  { name: 'Users',
    slug: 'users',
    description: 'User management and profiles',
    version: 'v1',
    status: 'stable'
  },
  { name: 'Projects',
    slug: 'projects',
    description: 'Project creation and management',
    version: 'v1',
    status: 'beta'
  }
];

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
          <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Code className="w-8 h-8 text-blue-600 mr-3"  />
          <h1 className="text-4xl font-bold text-gray-900">API Documentation</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete reference for integrating with the AI Guided SaaS Platform API
          </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apiEndpoints.map((endpoint) => (
            <Card key={endpoint.slug} className="hover:shadow-lg transition-shadow">
          <CardHeader></CardHeader>
                <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{endpoint.name}</CardTitle>
                  <Badge variant={endpoint.status === 'stable' ? 'default' : 'secondary'}></Badge>
                    {endpoint.status}
                  </Badge>
                </div>
              <CardContent>
          <p className="text-gray-600 mb-4">{endpoint.description}</p>
                <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Version {endpoint.version}</span>
                  <Link href={`/api-docs/${endpoint.slug}`}>
          <Button size="sm"></Button>
                      <ExternalLink className="w-4 h-4 mr-2"   />
                      View Docs
                    </Button>
                  </Link>
                </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <div className="space-y-4">
          <p className="text-gray-600">
              To get started with our API, you'll need to authenticate using your API key.
            </p>
            <div className="bg-gray-100 rounded-lg p-4">
          <code className="text-sm">
                curl -H "Authorization: Bearer YOUR_API_KEY" https://api.aiguidedsaas.com/v1/
              </code>
            </div>
  )
}