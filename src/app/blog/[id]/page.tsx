/* BREADCRUMB: app - Application page or route */
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';

// Mock blog posts data
const blogPosts = [
  { id: '1',
    title: 'Introducing AI Guided SaaS: The Future of Development',
    content: `
      <p>We're excited to announce the launch of AI Guided SaaS, a revolutionary platform that combines the power of artificial intelligence with intuitive development tools to help you build applications faster than ever before.</p>
      
      <h2>What is AI Guided SaaS?</h2>
      <p>AI Guided SaaS is a comprehensive development platform that leverages cutting-edge AI technology to assist developers at every stage of the application development lifecycle. From initial planning to deployment, our platform provides intelligent suggestions, automated code generation, and real-time optimization.</p>
      
      <h2>Key Features</h2>
      <ul>
          <li>AI-powered code generation and completion</li>
        <li>Intelligent project scaffolding</li>
        <li>Automated testing and debugging</li>
        <li>Real-time performance optimization</li>
        <li>Seamless deployment to cloud platforms</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>Getting started with AI Guided SaaS is simple. Sign up for a free account, create your first project, and let our AI assistant guide you through the development process. Whether you're building a simple website or a complex enterprise application, our platform adapts to your needs.</p>
    `,
    excerpt: 'Discover how our AI-powered platform is revolutionizing the way developers build and deploy applications.',
    author: 'AI Guided SaaS Team',
    publishedAt: '2025-01-15',
    category: 'Product Updates',
    readTime: '5 min read',
    image: '/images/blog/ai-guided-saas-intro.jpg'
  },
  { id: '2',
    title: 'Building Scalable Applications with AI Assistance',
    content: `
      <p>Scalability is a critical consideration for modern applications. With AI Guided SaaS, building scalable applications has never been easier.</p>
      
      <h2>Understanding Scalability</h2>
      <p>Scalability refers to an application's ability to handle increased load without compromising performance. This includes both vertical scaling (adding more power to existing machines) and horizontal scaling (adding more machines to your resource pool).</p>
      
      <h2>AI-Driven Scalability Solutions</h2>
      <p>Our AI analyzes your application architecture and provides recommendations for improving scalability, including: </p>
      <ul>
          <li>Optimal database indexing strategies</li>
        <li>Caching layer implementation</li>
        <li>Load balancing configurations</li>
        <li>Microservices architecture suggestions</li>
      </ul>
    `,
    excerpt: 'Learn best practices for building scalable applications using our AI-powered development tools.',
    author: 'Technical Team',
    publishedAt: '2025-01-10',
    category: 'Technical',
    readTime: '8 min read',
    image: '/images/blog/scalable-apps.jpg'
  },
  { id: '3',
    title: 'The Rise of No-Code AI Development',
    content: `
      <p>The no-code movement is transforming how we think about software development, and AI is accelerating this transformation.</p>
      
      <h2>Democratizing Development</h2>
      <p>No-code platforms enable non-technical users to create sophisticated applications without writing traditional code. When combined with AI, these platforms become even more powerful, offering intelligent suggestions and automated workflows.</p>
      
      <h2>Benefits of No-Code AI Development</h2>
      <ul>
          <li>Faster time to market</li>
        <li>Reduced development costs</li>
        <li>Increased accessibility for non-developers</li>
        <li>Rapid prototyping and iteration</li>
      </ul>
    `,
    excerpt: 'Explore how no-code AI development is democratizing software creation for everyone.',
    author: 'Product Team',
    publishedAt: '2025-01-05',
    category: 'Industry Insights',
    readTime: '6 min read',
    image: '/images/blog/no-code-ai.jpg'
  }
];

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = blogPosts.find(p => p.id === params.id);
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }
  
  return {
    title: `${post.title} - AI Guided SaaS Blog`,
    description: post.excerpt
  };
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find(p => p.id === params.id);
  if (!post) {
    notFound();
  }
  
  return (
    <div className="min-h-screen glass py-12">
          <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
        
        <article>
          <div className="mb-8">
            <div className="glass flex items-center gap-4 mb-4">
          <Badge variant="secondary">{post.category}</Badge>
              <span className="text-sm text-gray-500">{post.readTime}</span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex items-center justify-between mb-8">
          <div className="flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
          <span className="mr-3">{post.author}</span>
                <Calendar className="h-4 w-4 mr-1" />
          <span>{post.publishedAt}</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl-lg mb-8"></div>
          </div>
          
          <Card className="glass"
            <CardContent className="glass prose prose-lg max-w-none p-8">
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content ) }} />
            </CardContent>
          </Card>
          
          <div className="mt-12 pt-8 -t">
            <h3 className="text-2xl font-bold mb-4">Share this article</h3>
            <div className="glass flex gap-4">
              <Button variant="outline">Share on Twitter</Button>
              <Button variant="outline">Share on LinkedIn</Button>
              <Button variant="outline">Copy Link</Button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}