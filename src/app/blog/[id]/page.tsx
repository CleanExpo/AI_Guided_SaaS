import React from 'react';

interface BlogPost {
id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  readTime: string;
  image: string;

}

const blogPosts: Record<string, BlogPost> = {
  '1': {
    id: '1',
    title: 'Introducing AI Guided SaaS: The Future of Development',
    excerpt: 'Discover how our AI-powered platform is revolutionizing the way developers build and deploy applications.',
    content: `# Welcome to AI Guided SaaS

AI Guided SaaS represents a paradigm shift in how we approach software development. Our platform combines the power of artificial intelligence with intuitive development tools to help you build production-ready applications faster than ever before.

## Key Features

- **AI-Powered Code Generation**: Our intelligent system understands your requirements and generates high-quality code automatically.
- **No-Code and Pro-Code Flexibility**: Whether you're a seasoned developer or just starting out, our platform adapts to your skill level.
- **Enterprise-Grade Security**: Built-in security measures ensure your applications are protected from day one.
- **One-Click Deployment**: Deploy to any cloud provider with a single click.

## Getting Started

Getting started with AI Guided SaaS is simple. Just describe what you want to build, and our AI will guide you through the entire process.`,
    author: 'AI Guided SaaS Team',
    publishedAt: '2025-01-15',
    category: 'Product Updates',
    tags: ['AI', 'SaaS', 'Development'],
    readTime: '5 min read',
    image: '/images/blog/ai-guided-saas-intro.jpg'
  },
  '2': {
    id: '2',
    title: 'Building Scalable Applications with AI Assistance',
    excerpt: 'Learn best practices for building scalable applications using our AI-powered development tools.',
    content: `# Building Scalable Applications

Scalability is crucial for modern applications. In this post, we'll explore how AI Guided SaaS helps you build applications that can handle growth from day one.

## Architecture Patterns

Our AI understands common architecture patterns and can recommend the best approach for your specific use case.`,
    author: 'Technical Team',
    publishedAt: '2025-01-10',
    category: 'Technical',
    tags: ['Scalability', 'Architecture', 'Best Practices'],
    readTime: '8 min read',
    image: '/images/blog/scalable-apps.jpg'
  }
};

export function generateStaticParams() {
  return Object.keys(blogPosts).map((id) => ({
    id: id
  }));
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts[params.id];
  
  if (!post) {
    return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Post Not Found</h1>
          <p className="text-gray-600 mt-2">The requested blog post does not exist.</p>
              </div>
);

        }
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <div className="p-8">
            <div className="mb-6">
              <span className="text-sm text-blue-600 font-medium">{post.category}</span>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{post.title}</h1>
              <div className="flex items-center mt-4 text-sm text-gray-600">
                <span>{post.author}</span>
                <span className="mx-2">•</span>
                <span>{post.publishedAt}</span>
                <span className="mx-2">•</span>
                <span>{post.readTime}</span>
                    </div>
<div className="prose max-w-none">
              <div className="whitespace-pre-wrap">{post.content}      </div>
<div className="flex flex-wrap gap-2 mt-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
                  </div>
</article>
            </div>
);

      }
