/* BREADCRUMB: pages - Application pages and routes */
'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Book, 
  Search, 
  ExternalLink, 
  Play,
  Code,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [docSystem, setDocSystem] = useState(null);
  const [tutorialSystem, setTutorialSystem] = useState(null);

  useEffect(() => {
    // Simulate loading documentation systems
    setTimeout(() => {
      setDocSystem('loaded');
      setTutorialSystem('loaded');
    }, 1000);
  }, []);

  const docCategories = [
    { title: 'Getting Started',
      description: 'Learn the basics and get up and running quickly',
      icon: Play,
      docs: [
        { title: 'Quick Start Guide', slug: 'quick-start', description: 'Get started in 5 minutes' },
        { title: 'Installation', slug: 'installation', description: 'Set up your development environment' },
        { title: 'Your First Project', slug: 'first-project', description: 'Create your first AI-powered app' }
      ]
    },
    { title: 'API Reference',
      description: 'Complete API documentation for developers',
      icon: Code,
      docs: [
        { title: 'Authentication', slug: 'auth', description: 'API key management and security' },
        { title: 'Endpoints', slug: 'endpoints', description: 'All available API endpoints' },
        { title: 'Rate Limits', slug: 'rate-limits', description: 'Usage limits and best practices' }
      ]
    },
    { title: 'Features',
      description: 'Explore all platform capabilities',
      icon: Zap,
      docs: [
        { title: 'AI Assistant', slug: 'ai-assistant', description: 'Using the AI coding assistant' },
        { title: 'Project Templates', slug: 'templates', description: 'Pre-built project templates' },
        { title: 'Data Integration', slug: 'data', description: 'Connect to various data sources' }
      ]
    },
    { title: 'Deployment',
      description: 'Deploy your applications to production',
      icon: Globe,
      docs: [
        { title: 'Deployment Guide', slug: 'deployment', description: 'Deploy to various platforms' },
        { title: 'Environment Setup', slug: 'env-setup', description: 'Configure production environments' },
        { title: 'Monitoring', slug: 'monitoring', description: 'Monitor your deployed applications' }
      ]
    },
    { title: 'Security',
      description: 'Security best practices and guidelines',
      icon: Shield,
      docs: [
        { title: 'Security Overview', slug: 'security', description: 'Platform security features' },
        { title: 'Data Privacy', slug: 'privacy', description: 'How we protect your data' },
        { title: 'Compliance', slug: 'compliance', description: 'Industry compliance standards' }
      ]
    }
  ];

  const quickLinks = [
    { title: 'API Reference', href: '/docs/api-reference', icon: Code },
    { title: 'Quick Start', href: '/docs/quick-start', icon: Play },
    { title: 'Deployment', href: '/docs/deployment', icon: Globe },
    { title: 'Examples', href: '/examples', icon: ExternalLink }
  ];

  return (
    <div className="min-h-screen glass py-8">
          <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Everything you need to build amazing applications with AI Guided SaaS
          
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"  />
            <Input
              ="Search documentation...">value={searchQuery}>onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="glass grid gap-4 md:grid-cols-4 mb-12">
          {quickLinks.map((link) => (
            <Link key={link.title} href={link.href}>
              <Card className="hover:shadow-md-lg transition-shadow-md cursor-pointer glass
                <CardContent className="glass flex items-center p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl-lg flex items-center justify-center mr-4">
                    <link.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{link.title}</h3>
                  </div>
                
              
            
          ))}
        </div>

        {/* Documentation Categories */}
        <div className="space-y-8">
          {docCategories.map((category) => (
            <Card key={category.title} className="glass"
              <CardHeader className="glass">
            <CardTitle className="flex items-center glass
                  <category.icon className="h-6 w-6 mr-3 text-blue-600" />
                  {category.title}
                
                <p className="text-gray-600">{category.description}
              
              <CardContent className="glass">
            <div className="glass grid gap-4 md:grid-cols-3">
                  {category.docs.map((doc) => (
                    <Link key={doc.slug} href={`/docs/${doc.slug}`}>
                      <div className="p-4  rounded-xl-lg hover:glass transition-colors cursor-pointer">
                        <h4 className="font-semibold text-gray-900 mb-2">{doc.title}</h4>
                        <p className="text-sm text-gray-600">{doc.description}
                      </div>
                    
                  ))}
                </div>
              
            
          ))}
        </div>

        {/* Help Section */}
        <Card className="mt-12 glass
          <CardContent className="glass p-8 text-center">
            <Book className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Need more help?</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            
            <div className="flex justify-center space-x-4">
              <Button variant="outline">Contact Support</Button>
              <Button>Join Community</Button>
            </div>
          
        
      </div>
    </div>
  );
}
