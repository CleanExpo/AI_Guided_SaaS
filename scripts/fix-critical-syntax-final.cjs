const fs = require('fs');
const path = require('path');

// Files to fix completely due to severe corruption
const criticalFiles = [
  'src/components/ui/separator.tsx',
  'src/app/blog/[id]/page.tsx',
  'src/app/blog/page.tsx',
  'src/app/community/guidelines/page.tsx',
  'src/app/community/page.tsx'
];

const fixedContent = {
  'src/components/ui/separator.tsx': `import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/utils/cn';

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
`,

  'src/app/blog/[id]/page.tsx': `/* BREADCRUMB: app - Application page or route */
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';

// Mock blog posts data
const blogPosts = [
  {
    id: '1',
    title: 'Introducing AI Guided SaaS: The Future of Development',
    content: \`
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
    \`,
    excerpt: 'Discover how our AI-powered platform is revolutionizing the way developers build and deploy applications.',
    author: 'AI Guided SaaS Team',
    publishedAt: '2025-01-15',
    category: 'Product Updates',
    readTime: '5 min read',
    image: '/images/blog/ai-guided-saas-intro.jpg'
  },
  {
    id: '2',
    title: 'Building Scalable Applications with AI Assistance',
    content: \`
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
    \`,
    excerpt: 'Learn best practices for building scalable applications using our AI-powered development tools.',
    author: 'Technical Team',
    publishedAt: '2025-01-10',
    category: 'Technical',
    readTime: '8 min read',
    image: '/images/blog/scalable-apps.jpg'
  },
  {
    id: '3',
    title: 'The Rise of No-Code AI Development',
    content: \`
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
    \`,
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
    title: \`\${post.title} - AI Guided SaaS Blog\`,
    description: post.excerpt
  };
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find(p => p.id === params.id);
  if (!post) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
        
        <article>
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
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
            
            <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-8"></div>
          </div>
          
          <Card>
            <CardContent className="prose prose-lg max-w-none p-8">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </CardContent>
          </Card>
          
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-2xl font-bold mb-4">Share this article</h3>
            <div className="flex gap-4">
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
`,

  'src/app/blog/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - AI Guided SaaS Platform',
  description: 'Latest news, updates, and insights from AI Guided SaaS Platform'
};

const blogPosts = [
  {
    id: '1',
    title: 'Introducing AI Guided SaaS: The Future of Development',
    excerpt: 'Discover how our AI-powered platform is revolutionizing the way developers build and deploy applications.',
    author: 'AI Guided SaaS Team',
    publishedAt: '2025-01-15',
    category: 'Product Updates',
    readTime: '5 min read',
    image: '/images/blog/ai-guided-saas-intro.jpg'
  },
  {
    id: '2',
    title: 'Building Scalable Applications with AI Assistance',
    excerpt: 'Learn best practices for building scalable applications using our AI-powered development tools.',
    author: 'Technical Team',
    publishedAt: '2025-01-10',
    category: 'Technical',
    readTime: '8 min read',
    image: '/images/blog/scalable-apps.jpg'
  },
  {
    id: '3',
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news, insights, and developments from AI Guided SaaS Platform.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                <CardTitle className="line-clamp-2 hover:text-blue-600 transition-colors">
                  <Link href={\`/blog/\${post.id}\`}>{post.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-3">{post.author}</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{post.publishedAt}</span>
                </div>
                <Link href={\`/blog/\${post.id}\`}>
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
`,

  'src/app/community/guidelines/page.tsx': `/* BREADCRUMB: app - Application page or route */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Users, Heart, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/community">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Community
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Community Guidelines
          </h1>
          <p className="text-gray-600">
            Help us maintain a welcoming and productive community for everyone.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Our Community Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                AI Guided SaaS is built on the principles of collaboration, innovation, and mutual respect.
                Our community guidelines ensure everyone can participate in a safe and productive environment.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Be respectful and kind to all community members</li>
                <li>• Share knowledge and help others learn</li>
                <li>• Provide constructive feedback and criticism</li>
                <li>• Celebrate diversity and different perspectives</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Code of Conduct
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">✅ Encouraged Behavior</h3>
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>• Sharing helpful resources and tutorials</li>
                    <li>• Asking questions and seeking help</li>
                    <li>• Providing detailed bug reports and feedback</li>
                    <li>• Contributing to discussions constructively</li>
                    <li>• Welcoming newcomers to the community</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-red-700 mb-2">❌ Prohibited Behavior</h3>
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>• Harassment, discrimination, or hate speech</li>
                    <li>• Spam, self-promotion, or off-topic content</li>
                    <li>• Sharing malicious code or security vulnerabilities</li>
                    <li>• Personal attacks or inflammatory language</li>
                    <li>• Sharing copyrighted content without permission</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                How to Participate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Asking Questions</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Search existing topics before posting</li>
                    <li>• Provide clear, detailed descriptions</li>
                    <li>• Include relevant code snippets or screenshots</li>
                    <li>• Use descriptive titles for your posts</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Providing Answers</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Be patient and understanding</li>
                    <li>• Explain your reasoning and approach</li>
                    <li>• Provide working examples when possible</li>
                    <li>• Point to relevant documentation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Reporting Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you encounter behavior that violates our community guidelines, please report it to our moderation team.
              </p>
              <div className="flex gap-4">
                <Button variant="outline">
                  Report Content
                </Button>
                <Button variant="outline">
                  Contact Moderators
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600 text-sm">
                These guidelines are subject to change as our community grows.
                Last updated: January 2025
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
`,

  'src/app/community/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Github, Twitter, Hash, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Community - AI Guided SaaS Platform',
  description: 'Join our vibrant community of developers building the future with AI'
};

const communityStats = [
  { label: 'Active Members', value: '12,453', icon: Users },
  { label: 'Monthly Posts', value: '3,892', icon: MessageSquare },
  { label: 'Projects Shared', value: '1,267', icon: Hash }
];

const communityChannels = [
  {
    name: 'General Discussion',
    description: 'Chat about AI development, share ideas, and connect with fellow developers',
    members: 8934,
    isActive: true
  },
  {
    name: 'Help & Support',
    description: 'Get help with your projects and troubleshoot issues',
    members: 5621,
    isActive: true
  },
  {
    name: 'Show Your Work',
    description: 'Share your AI-powered applications and get feedback from the community',
    members: 3287,
    isActive: true
  },
  {
    name: 'Feature Requests',
    description: 'Suggest new features and improvements for the platform',
    members: 2156,
    isActive: true
  }
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join Our Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with thousands of developers building the future with AI-powered tools.
            Share knowledge, get help, and collaborate on amazing projects.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {communityStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Channels</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {communityChannels.map((channel) => (
              <Card key={channel.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{channel.name}</CardTitle>
                    {channel.isActive && (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{channel.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{channel.members.toLocaleString()} members</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Join Channel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect With Us</h2>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Github className="h-4 w-4" />
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Twitter className="h-4 w-4" />
              <span>Twitter</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Button className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Join Discord</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
`
};

function fixCriticalSyntaxErrors() {
  console.log('🔧 Starting critical syntax error fixes...');
  let fixedCount = 0;

  criticalFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    
    if (fs.existsSync(filePath) && fixedContent[file]) {
      try {
        fs.writeFileSync(filePath, fixedContent[file], 'utf8');
        console.log(`✅ Fixed: ${file}`);
        fixedCount++;
      } catch (error) {
        console.error(`❌ Error fixing ${file}:`, error.message);
      }
    } else {
      console.log(`⚠️  Skipped: ${file} (not found or no fix available)`);
    }
  });

  console.log(`\\n🎉 Fixed ${fixedCount} critical files with syntax errors`);
  return fixedCount;
}

// Run the fix
if (require.main === module) {
  fixCriticalSyntaxErrors();
}

module.exports = { fixCriticalSyntaxErrors };