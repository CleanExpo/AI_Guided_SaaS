import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, ExternalLink } from 'lucide-react';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'API Documentation - AI Guided SaaS Platform',
  description: 'Complete API reference and documentation for AI Guided SaaS Platform'
};
const apiEndpoints = [
  {
  name: 'Authentication',
    slug: 'auth',
    description: 'User authentication and session management',
    version: 'v1',
    status: 'stable'
  },
  {
    name: 'Users',
    slug: 'users',
    description: 'User management and profiles',
    version: 'v1',
    status: 'stable'
  },
  {
    name: 'Analytics',
    slug: 'analytics',
    description: 'Application analytics and metrics',
    version: 'v1',
    status: 'beta'
}
];

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
          <p className="text-xl text-gray-600">
            Complete API reference for AI Guided SaaS Platform
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apiEndpoints.map((endpoint) => (
            <Card key={endpoint.slug} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    {endpoint.name}
                  </CardTitle>
                  <Badge variant={endpoint.status === 'stable' ? 'default' : 'secondary'}>
                    {endpoint.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{endpoint.description}</p><div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Version {endpoint.version}</span>
                  <Link href={`/api-docs/${endpoint.slug}`}>
                    <Button size="sm" variant="outline">
                      View Docs
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Base URL</h3>
              <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                https://ai-guided-saa-s.vercel.app/api
              </code>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Authentication</h3>
              <p className="text-gray-600">
                All API requests require authentication using JWT tokens.
                Include your token in the Authorization header.
              </p>
                  </div>
);

      }
