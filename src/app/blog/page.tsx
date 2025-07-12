import { Metadata } from 'next';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog - AI Guided SaaS Platform',
  description:
    'Latest news, updates, and insights from AI Guided SaaS Platform',
};

const blogPosts = [
  {
    id: 1,
    title: 'Introducing AI-Powered Code Generation',
    excerpt:
      'Discover how our latest AI features can help you generate high-quality code faster than ever before.',
    author: 'Sarah Chen',
    date: '2024-01-15',
    category: 'Product Updates',
    readTime: '5 min read',
    featured: true,
  },
  {
    id: 2,
    title: 'Best Practices for SaaS Development in 2024',
    excerpt:
      'Learn the essential patterns and practices for building scalable SaaS applications.',
    author: 'Mike Johnson',
    date: '2024-01-10',
    category: 'Development',
    readTime: '8 min read',
    featured: false,
  },
  {
    id: 3,
    title: 'Security First: Protecting Your Applications',
    excerpt:
      'A comprehensive guide to implementing security best practices in your development workflow.',
    author: 'Alex Rodriguez',
    date: '2024-01-05',
    category: 'Security',
    readTime: '6 min read',
    featured: false,
  },
  {
    id: 4,
    title: 'Community Spotlight: Developer Success Stories',
    excerpt:
      'Hear from developers who have transformed their workflow with our platform.',
    author: 'Emma Wilson',
    date: '2024-01-01',
    category: 'Community',
    readTime: '4 min read',
    featured: false,
  },
];

const categories = [
  'All',
  'Product Updates',
  'Development',
  'Security',
  'Community',
  'Tutorials',
];

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest news, insights, and tutorials from our
            team
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map(category => (
            <Badge
              key={category}
              variant={category === 'All' ? 'default' : 'secondary'}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Card className="mb-12 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex items-center justify-center">
                <div className="text-center">
                  <Badge className="mb-4">Featured</Badge>
                  <h2 className="text-2xl font-bold mb-2">Latest Post</h2>
                  <p className="text-muted-foreground">
                    Don&apos;t miss our newest insights
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <Badge variant="secondary" className="mb-4">
                  {featuredPost.category}
                </Badge>
                <h3 className="text-2xl font-bold mb-4">
                  {featuredPost.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(featuredPost.date).toLocaleDateString()}
                      </span>
                    </div>
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <Button asChild>
                    <Link href={`/blog/${featuredPost.id}`}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Regular Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map(post => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {post.readTime}
                  </span>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/blog/${post.id}`}>
                      Read
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 text-center bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter to get the latest posts delivered to
            your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
