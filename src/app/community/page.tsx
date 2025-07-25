/* BREADCRUMB: pages - Application pages and routes */
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