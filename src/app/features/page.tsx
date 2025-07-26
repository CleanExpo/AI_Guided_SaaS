/* BREADCRUMB: pages - Application pages and routes */
'use client';

// Force dynamic rendering to avoid SSG errors
export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';



export default function FeaturesPage() {
  const features = [
    { title: 'AI-Powered Code Generation',
      description: 'Generate production-ready code from natural language descriptions.',
      icon: '🤖'
    },
    { title: 'Visual Development',
      description: 'Build applications with our intuitive visual development tools.',
      icon: '🎨'
    },
    { title: 'Smart Templates',
      description: 'Start with pre-built templates optimized for different use cases.',
      icon: '📋'
    },
    { title: 'Real-time Collaboration',
      description: 'Work together with your team in real-time.',
      icon: '👥'
    },
    { title: 'Automated Testing',
      description: 'AI-generated tests ensure your code quality.',
      icon: '🧪'
    },
    { title: 'One-Click Deployment',
      description: 'Deploy to production with a single click.',
      icon: '🚀'
    }
  ];

  return (
    <div className="min-h-screen glass py-12">
          <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="mb-4">Platform Features</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Build Amazing Apps
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and features you need 
            to build, test, and deploy production-ready applications.
          </p>
        </div>

        <div className="glass grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-md-lg transition-shadow-md glass
              <CardHeader className="glass"
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4">{feature.icon}</span>
                  <CardTitle className="text-lg glass{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="glass"
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
