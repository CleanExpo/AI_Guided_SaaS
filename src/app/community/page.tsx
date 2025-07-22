import { Metadata } from 'next';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Users,
  Github,
  Twitter,
  Hash,
  ExternalLink} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Community - AI Guided SaaS Platform',
  description:
    'Join our vibrant community of developers building the future with AI'};

const communityStats = [
  { label: 'Active Members', value: '15,000+', icon: Users },
  { label: 'Monthly Posts', value: '2,500+', icon: MessageSquare },
  { label: 'Projects Shared', value: '800+', icon: Github },
  { label: 'Countries', value: '50+', icon: ExternalLink }];

const platforms = [
  {
    name: 'Discord Server',
    description: 'Real-time chat with developers and get instant help',
    icon: Hash,
    members: '8,500+',
    link: '#',
    color: 'bg-indigo-100 text-indigo-800'},
  {
    name: 'GitHub Discussions',
    description: 'Share code, report issues, and contribute to the platform',
    icon: Github,
    members: '3,200+',
    link: '#',
    color: 'bg-gray-100 text-gray-800'},
  {
    name: 'Twitter Community',
    description: 'Follow updates and connect with fellow developers',
    icon: Twitter,
    members: '12,000+',
    link: '#',
    color: 'bg-blue-100 text-blue-800'}];

const featuredPosts = [
  {
    title: 'Building a Full-Stack App in 30 Minutes',
    author: 'Sarah Chen',
    replies: 24,
    likes: 156,
    category: 'Showcase'},
  {
    title: 'Best Practices for AI Prompt Engineering',
    author: 'Mike Rodriguez',
    replies: 18,
    likes: 89,
    category: 'Tutorial'},
  {
    title: 'Feature, Request: Dark Mode for Code Editor',
    author: 'Alex Kim',
    replies: 42,
    likes: 203,
    category: 'Feature Request'}];

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Join Our Community</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with thousands of developers building amazing applications
            with AI</p>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {communityStats.map(stat => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-6">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}</div>
    );
          }
      )}
    </div>
        </div>
        </div>
        </Card>
        </CardContent>
    );

        {/* Community Platforms */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Where to Find Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platforms.map(platform => {
              const Icon = platform.icon;
              return (
                <Card
                  key={platform.name}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="text-center">
                    <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-xl">{platform.name}</CardTitle>
                    <CardDescription>{platform.description}</CardDescription>
                    <Badge className={platform.color}>
                      {platform.members} members</Badge>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href={platform.link}>
                        Join Now</Link>
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
    );
            }
      )}
    </div>
        </div>
        </CardHeader>
        </CardContent>
        </Button>
    );

        {/* Featured Discussions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Featured Discussions</h2>
          <div className="space-y-4">
            {featuredPosts.map((post, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          by {post.author}</span>
                      <h3 className="text-lg font-semibold mb-2">
                        {post.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{post.replies} replies</span>
                        <span>{post.likes} likes</span>
                      </div>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
            ))}
          </div>

        {/* Community Guidelines */}
        <div className="text-center bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Community Guidelines</h2>
          <p className="text-muted-foreground mb-6">
            Help us maintain a welcoming and productive environment for everyone</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Be Respectful</h3>
              <p className="text-muted-foreground">
                Treat all members with kindness and respect</p>
            <div>
              <h3 className="font-semibold mb-2">Stay On Topic</h3>
              <p className="text-muted-foreground">
                Keep discussions relevant to development and AI</p>
            <div>
              <h3 className="font-semibold mb-2">Help Others</h3>
              <p className="text-muted-foreground">
                Share knowledge and support fellow developers</p>
          <Button asChild className="mt-6">
            <Link href="/community/guidelines">Read Full Guidelines</Link>
          </div>
          </Card>
          </CardContent>
          </div>
          </div>
          </div>
          </div>
          </Button>
      );
}
