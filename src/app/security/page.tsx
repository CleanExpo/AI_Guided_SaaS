'use client';

// Force dynamic rendering to avoid SSG errors
export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Server } from 'lucide-react';

export default function SecurityPage() {
  const securityFeatures = [
    { icon: Shield,
      title: 'End-to-End Encryption',
      description: 'All data is encrypted in transit and at rest using industry-standard encryption.',
      status: 'Active'
    },
    { icon: Lock,
      title: 'Multi-Factor Authentication',
      description: 'Additional security layer with MFA support for all user accounts.',
      status: 'Active'
    },
    { icon: Eye,
      title: 'Privacy Controls',
      description: 'Comprehensive privacy settings to control data sharing and visibility.',
      status: 'Active'
    },
    { icon: Server,
      title: 'Secure Infrastructure',
      description: 'SOC 2 compliant infrastructure with regular security audits.',
      status: 'Active'
    }
  ];

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
          <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Security & Privacy</h1>
        <p className="text-xl text-gray-600">Your data security is our top priority</p>
      </div>

      <div className="glass grid md:grid-cols-2 gap-8">
        {securityFeatures.map((feature, index) => (
          <Card key={index} className="glass p-6">
            <CardHeader className="glass"
              <div className="flex items-center gap-3">
                <feature.icon className="w-8 h-8 text-green-600" />
                <CardTitle className="text-xl" className="glass{feature.title}</CardTitle>
                <Badge className="bg-green-100 text-green-800">{feature.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="glass"
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}