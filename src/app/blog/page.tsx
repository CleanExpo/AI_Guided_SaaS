/* BREADCRUMB: pages - Application pages and routes */
'use client';

// Force dynamic rendering to avoid SSG errors
export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';



const blogPosts = [
  { id: '1',
    title: 'Introducing AI Guided SaaS: The Future of Development',
    excerpt: 'Discover how our AI-powered platform is revolutionizing the way developers build and deploy applications.',
    author: 'AI Guided SaaS Team',
    publishedAt: '2025-01-15',
    category: 'Product Updates',
    readTime: '5 min read',
    image: '/images/blog/ai-guided-saas-intro.jpg'
  },
  { id: '2',
    title: 'Building Scalable Applications with AI Assistance',
    excerpt: 'Learn best practices for building scalable applications using our AI-powered development tools.',
    author: 'Technical Team',
    publishedAt: '2025-01-10',
    category: 'Technical',
    readTime: '8 min read',
    image: '/images/blog/scalable-apps.jpg'
  },
  { id: '3',
    title: 'The Rise of No-Code AI Development',
    excerpt: 'Explore how no-code AI development is democratizing software creation for everyone.',
    author: 'Product Team',
    publishedAt: '2025-01-05',
    category: 'Industry Insights',
    readTime: '6 min read',
    image: '/images/blog/no-code-ai.jpg'
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen glass py-12">
          <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news, insights, and developments from AI Guided SaaS Platform.
          </p>
        </div>
        
        <div className="glass grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md-lg transition-shadow-md glass">
              <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <CardHeader className="glass">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                <CardTitle className="line-clamp-2 hover:text-blue-600 transition-colors glass">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="glass">
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-3">{post.author}</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{post.publishedAt}</span>
                </div>
                <Link href={`/blog/${post.id}`}>
                  <Button variant="ghost" size="sm" className="p-0">
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Posts
          </Button>
        </div>
      </div>
    </div>
  );
}
