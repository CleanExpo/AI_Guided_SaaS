/* BREADCRUMB: pages - Application pages and routes */
'use client';

// Force dynamic rendering to avoid SSG errors
export const dynamic = 'force-dynamic';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Github, Twitter, Hash, ExternalLink } from 'lucide-react';
import Link from 'next/link';

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
  return (<div className="min-h-screen glass py-8">

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Guided Community
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share knowledge, get help, and collaborate on amazing projects.
          </p>
        </div>
        
        {/* Community Stats */}
        <div className="glass grid gap-6 md:grid-cols-3 mb-12">)
          {communityStats.map((stat) => (
            <Card key={stat.label} className="glass">

              <CardContent className="glass flex items-center p-6">
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

        {/* Community Channels */}
        <div className="mb-12">

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Channels</h2>
          <div className="glass grid gap-6 md:grid-cols-2">
            {communityChannels.map((channel) => (
              <Card key={channel.name} className="glass">

                <CardHeader className="glass">
                  <div className="flex items-center justify-between">

                    <CardTitle className="glass">{channel.name}</CardTitle>
                    {channel.isActive && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="glass">

                  <p className="text-gray-600 mb-4">{channel.description}</p>
                  <div className="flex items-center justify-between">

                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {channel.members.toLocaleString()} members
                    </div>
                    <Button size="sm" variant="outline">
                      Join Channel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass grid gap-6 md:grid-cols-2 mb-12">

          <Card className="glass">
            <CardHeader className="glass">

              <CardTitle className="glass">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="glass">

              <p className="text-gray-600 mb-4">
                Learn about our community standards and how to be a great member.
              </p>
              <Button asChild>

                <Link href="/community/guidelines">
                  Read Guidelines
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass">

            <CardHeader className="glass">
              <CardTitle className="glass">Report an Issue</CardTitle>
            </CardHeader>
            <CardContent className="glass">

              <p className="text-gray-600 mb-4">
                Found a bug or have concerns? Let us know and we'll help resolve it.
              </p>
              <Button variant="outline">
                Report Issue
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* External Links */}
        <div className="text-center glass">

          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Connect with us on social media
          </h3>
          <div className="flex justify-center gap-4">

            <Button variant="outline" size="sm">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button variant="outline" size="sm">

              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button variant="outline" size="sm">

              <MessageSquare className="h-4 w-4 mr-2" />
              Discord
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}