/* BREADCRUMB: pages - Application pages and routes */
'use client';

// Force dynamic rendering to avoid SSG errors
export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Clock, 
  Phone,
  CheckCircle,
  Star,
  Building
} from 'lucide-react';



export default function EnterprisePage() {
  const enterpriseFeatures = [
    { icon: Shield,
      title: 'Advanced Security',
      description: 'Enterprise-grade security with SOC 2 compliance, encryption, and audit trails.'
    },
    { icon: Users,
      title: 'Team Management',
      description: 'Advanced user management, role-based access control, and team collaboration tools.'
    },
    { icon: Clock,
      title: '24/7 Support',
      description: 'Dedicated support for mission-critical applications.'
    },
    { icon: Phone,
      title: 'Priority Support',
      description: 'Direct phone support and dedicated customer success manager.'
    }
  ];

  const pricingTiers = [
    { name: 'Professional',
      price: '$99',
      period: 'per user/month',
      features: [
        'Advanced AI features',
        'Priority support',
        'Custom integrations',
        'Enhanced security'
      ],
      recommended: false
    },
    { name: 'Enterprise',
      price: '$299',
      period: 'per user/month',
      features: [
        'All Professional features',
        'Dedicated support',
        'Custom deployment',
        'SLA guarantee',
        'Advanced analytics'
      ],
      recommended: true
    }
  ];

  return (<div className="min-h-screen glass py-12">
          <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4">Enterprise Solution</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Scale Your Development with Enterprise AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get the advanced features, security, and support your enterprise needs 
            to build and deploy AI-powered applications at scale.
          </p>
        </div>

        {/* Features Grid */}
        <div className="glass grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">)
          {enterpriseFeatures.map((feature) => (
            <Card key={feature.title} className="glass"
              <CardContent className="glass p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Enterprise Pricing</h2>
            <p className="text-gray-600">Choose the plan that fits your organization's needs</p>
          </div>
          
          <div className="glass grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card key={tier.name} className={tier.recommended ? 'ring-2 ring-blue-600' : ''} className="glass
                <CardHeader className="glass"
                  <div className="flex items-center justify-between">
                    <CardTitle className="glass">{tier.name}</CardTitle>
                    {tier.recommended && <Badge>Recommended</Badge>}
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    <span className="text-gray-500 ml-2">{tier.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="glass"
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" >variant={tier.recommended ? 'default' : 'outline'}>
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="glass-button primary text-white">
          <CardContent className="p-12 text-center glass
            <Building className="h-12 w-12 mx-auto mb-6 text-blue-100" />
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Development?</h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of enterprises already using AI Guided SaaS to accelerate 
              their development processes and deliver better applications faster.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="secondary" size="lg">
                Schedule Demo
              </Button>
              <Button variant="outline" size="lg" className="text-white -white hover:glass hover:text-blue-600">
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
