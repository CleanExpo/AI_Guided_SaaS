/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User } from 'lucide-react';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';

interface DocPage { slug: string
  title: string
  description: string
  content: string
  category: string
  lastUpdated: string
}

const docPages: Record<string, DocPage> = {
  'quick-start': { slug: 'quick-start',
    title: 'Quick Start Guide',
    description: 'Get up and running with AI Guided SaaS in minutes',
    content: `
      <h2>Welcome to AI Guided SaaS</h2>
      <p>This guide will help you get started with our platform quickly and efficiently.</p>
      
      <h3>Step 1: Create Your Account</h3>
      <p>Sign up for a free account to access all basic features.</p>
      
      <h3>Step 2: Set Up Your First Project</h3>
      <p>Use our guided wizard to create your first AI-powered application.</p>
      
      <h3>Step 3: Explore Features</h3>
      <p>Discover the full potential of our AI-assisted development tools.</p>
    `,
    category: 'Getting Started',
    lastUpdated: '2025-01-15'
  },
  'api-reference': { slug: 'api-reference',
    title: 'API Reference',
    description: 'Complete API documentation for developers',
    content: `
      <h2>API Overview</h2>
      <p>Our REST API provides programmatic access to all AI Guided SaaS features.</p>
      
      <h3>Authentication</h3>
      <p>All API requests require authentication using API keys.</p>
      
      <h3>Rate Limits</h3>
      <p>API calls are limited to ensure fair usage across all users.</p>
      
      <h3>Endpoints</h3>
      <p>Browse our comprehensive list of available endpoints below.</p>
    `,
    category: 'API',
    lastUpdated: '2025-01-12'
  },
  'deployment': { slug: 'deployment',
    title: 'Deployment Guide',
    description: 'Learn how to deploy your applications to production',
    content: `
      <h2>Deployment Options</h2>
      <p>Deploy your AI-powered applications using various methods.</p>
      
      <h3>Vercel Deployment</h3>
      <p>One-click deployment to Vercel for optimal performance.</p>
      
      <h3>Docker Containers</h3>
      <p>Containerize your applications for flexible deployment options.</p>
      
      <h3>Cloud Platforms</h3>
      <p>Deploy to AWS, Google Cloud, or Azure with our guides.</p>
    `,
    category: 'Deployment',
    lastUpdated: '2025-01-10'
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const doc = docPages[params.slug];
  
  if (!doc) {
    return { 
      title: 'Documentation Not Found',
      description: 'The requested documentation page could not be found.'
    };
  }
  
  return { 
    title: `${doc.title} - AI Guided SaaS Documentation`,
    description: doc.description
  };
}

export default function DocPage({ params }: { params: { slug: string } }) {
  const doc = docPages[params.slug];
  
  if (!doc) {
    notFound();
  }
  
  return (
    <div className="min-h-screen glass py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/docs">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Documentation
            </Button>
          </Link>
          
          <div className="glass flex items-center gap-4 mb-4">
            <Badge variant="secondary">{doc.category}</Badge>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              Updated {doc.lastUpdated}
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{doc.title}</h1>
          <p className="text-xl text-gray-600">{doc.description}</p>
        </div>
        
        <Card className="glass">
          <CardContent className="glass prose prose-lg max-w-none p-8">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(doc.content ) }} />
          </CardContent>
        </Card>
        
        <div className="mt-8 pt-6 -t">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <User className="h-4 w-4 mr-1" />
              Last updated by AI Guided SaaS Team
            </div>
            <Button variant="outline">Edit this page</Button>
          </div>
        </div>
      </div>
    </div>
  );
}