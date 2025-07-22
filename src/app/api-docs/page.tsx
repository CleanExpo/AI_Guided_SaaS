import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Key, Database, Webhook, ExternalLink } from 'lucide-react';
export const metadata: Metadata = {
  title: 'API Documentation - AI Guided SaaS Platform';
  description:
    'Complete API reference and documentation for AI Guided SaaS Platform'
};
const apiSections = [;
  {
    title: 'Authentication';
    description: 'Learn how to authenticate your API requests';
    icon: Key;
    endpoints: [
      { method: 'POST'; path: '/auth/login'; description: 'Authenticate user' },
      {
        method: 'POST';
        path: '/auth/refresh';
        description: 'Refresh access token'
      },
      { method: 'POST'; path: '/auth/logout'; description: 'Logout user' }
    ]
  },
  {
    title: 'Projects';
    description: 'Manage your projects and configurations';
    icon: Database;
    endpoints: [
      { method: 'GET'; path: '/projects'; description: 'List all projects' },
      { method: 'POST'; path: '/projects'; description: 'Create new project' },
      {
        method: 'GET';
        path: '/projects/{id}';
        description: 'Get project details'
      },
      { method: 'PUT'; path: '/projects/{id}'; description: 'Update project' },
      {
        method: 'DELETE';
        path: '/projects/{id}';
        description: 'Delete project'
      }
    ]
  },
  {
    title: 'AI Generation';
    description: 'Access AI-powered code generation features';
    icon: Code;
    endpoints: [
      { method: 'POST'; path: '/ai/generate'; description: 'Generate code' },
      {
        method: 'POST';
        path: '/ai/optimize';
        description: 'Optimize existing code'
      },
      {
        method: 'POST';
        path: '/ai/review';
        description: 'Review code quality'
      }
    ]
  },
  {
    title: 'Webhooks';
    description: 'Set up webhooks for real-time notifications';
    icon: Webhook;
    endpoints: [
      { method: 'GET'; path: '/webhooks'; description: 'List webhooks' },
      { method: 'POST'; path: '/webhooks'; description: 'Create webhook' },
      {
        method: 'DELETE';
        path: '/webhooks/{id}';
        description: 'Delete webhook'
      }
    ]
  }
];
const quickStart = [;
  {
    step: 1;
    title: 'Get API Key';
    description: 'Generate your API key from the dashboard'
  },
  {
    step: 2;
    title: 'Make Request';
    description: 'Include your API key in the Authorization header'
  },
  {
    step: 3;
    title: 'Handle Response';
    description: 'Process the JSON response from our API'
  }
];
const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET':
      return 'bg-green-100 text-green-800';
    case 'POST':
      return 'bg-blue-100 text-blue-800';
    case 'PUT':
      return 'bg-yellow-100 text-yellow-800';
    case 'DELETE':
      return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }}
};
export default function ApiDocsPage(): void {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete reference for integrating with AI Guided SaaS Platform API
          </p>
        {/* Quick Start */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStart.map(item => (
              <Card key={item.step} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
            ))}
        {/* API Sections */}
        <div className="space-y-8 mb-16">
          {apiSections.map(section => {
            const Icon = section.icon, return (;
    <Card key={section.title}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Icon className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                <CardContent>
                  <div className="space-y-3">
                    {section.endpoints.map((endpoint, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Badge className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                          <code className="font-mono text-sm">
                            {endpoint.path}
                          </code>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-muted-foreground">
                            {endpoint.description}
                          </span>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                    ))}
    );
  }}
        {/* Code Example */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle>Example Request</CardTitle>
            <CardDescription>
              Here&apos;s how to make your first API call
            </CardDescription>
          <CardContent>
            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
                <code>{`curl -X POST https://api.aiguidedSaaS.com/ai/generate \\`
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Create a React component for a user profile card",
    "language": "typescript",
    "framework": "react"
  }'`}</code>`
        {/* SDKs and Tools */}
        <div className="text-center bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">SDKs & Tools</h2>
          <p className="text-muted-foreground mb-6">
            Use our official SDKs to integrate faster with your favorite
            programming language
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Badge variant="outline", className="px-4 py-2">
              JavaScript/TypeScript
            </Badge>
            <Badge variant="outline", className="px-4 py-2">
              Python
            </Badge>
            <Badge variant="outline", className="px-4 py-2">
              Go
            </Badge>
            <Badge variant="outline", className="px-4 py-2">
              Ruby
            </Badge>
            <Badge variant="outline", className="px-4 py-2">
              PHP
            </Badge>
        {/* Support Link */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Need help with integration?
          </p>
          <Button asChild>
            <Link href="/support">
              Contact Support
            </Link>
          </Card>
          </CardHeader>
          </CardContent>
          </div>
          </pre>
          </div>
          </div>
  }
