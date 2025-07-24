const fs = require('fs');
const path = require('path');

// Last batch of broken files
const lastBatchFiles = {
  'src/app/enterprise/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'Enterprise - AI Guided SaaS Platform',
  description: 'Enterprise-grade AI development platform with advanced security, compliance, and support'
};

export default function EnterprisePage() {
  const enterpriseFeatures = [
    {
      icon: Shield,
      title: 'Advanced Security',
      description: 'Enterprise-grade security with SOC 2 compliance, encryption, and audit trails.'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Advanced user management, role-based access control, and team collaboration tools.'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Dedicated support for mission-critical applications.'
    },
    {
      icon: Phone,
      title: 'Priority Support',
      description: 'Direct phone support and dedicated customer success manager.'
    }
  ];

  const pricingTiers = [
    {
      name: 'Professional',
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
    {
      name: 'Enterprise',
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {enterpriseFeatures.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
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
          
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card key={tier.name} className={tier.recommended ? 'ring-2 ring-blue-600' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{tier.name}</CardTitle>
                    {tier.recommended && <Badge>Recommended</Badge>}
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    <span className="text-gray-500 ml-2">{tier.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={tier.recommended ? 'default' : 'outline'}
                  >
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-blue-600 text-white">
          <CardContent className="p-12 text-center">
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
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
`,

  'src/app/features/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Features - AI Guided SaaS',
  description: 'Explore the powerful features of AI Guided SaaS platform for building production-ready applications.'
};

export default function FeaturesPage() {
  const features = [
    {
      title: 'AI-Powered Code Generation',
      description: 'Generate production-ready code from natural language descriptions.',
      icon: '🤖'
    },
    {
      title: 'Visual Development',
      description: 'Build applications with our intuitive visual development tools.',
      icon: '🎨'
    },
    {
      title: 'Smart Templates',
      description: 'Start with pre-built templates optimized for different use cases.',
      icon: '📋'
    },
    {
      title: 'Real-time Collaboration',
      description: 'Work together with your team in real-time.',
      icon: '👥'
    },
    {
      title: 'Automated Testing',
      description: 'AI-generated tests ensure your code quality.',
      icon: '🧪'
    },
    {
      title: 'One-Click Deployment',
      description: 'Deploy to production with a single click.',
      icon: '🚀'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4">{feature.icon}</span>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
`,

  'src/app/form-builder/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function FormBuilderPage() {
  const [formElements, setFormElements] = useState([]);

  const elementTypes = [
    { type: 'text', label: 'Text Input', icon: '📝' },
    { type: 'email', label: 'Email Input', icon: '📧' },
    { type: 'select', label: 'Dropdown', icon: '📋' },
    { type: 'textarea', label: 'Text Area', icon: '📄' },
    { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
    { type: 'radio', label: 'Radio Button', icon: '🔘' }
  ];

  const addElement = (type) => {
    const newElement = {
      id: Date.now(),
      type,
      label: \`\${type.charAt(0).toUpperCase() + type.slice(1)} Field\`,
      required: false
    };
    setFormElements([...formElements, newElement]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Form Builder
          </h1>
          <p className="text-gray-600">
            Create dynamic forms with AI assistance and real-time preview.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form Elements Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {elementTypes.map((element) => (
                    <Button
                      key={element.type}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addElement(element.type)}
                    >
                      <span className="mr-2">{element.icon}</span>
                      {element.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Builder */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Form Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formElements.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Add elements from the panel to start building your form
                    </div>
                  ) : (
                    formElements.map((element) => (
                      <div key={element.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-medium">{element.label}</label>
                          <Badge variant="outline">{element.type}</Badge>
                        </div>
                        {element.type === 'textarea' ? (
                          <textarea 
                            className="w-full p-2 border rounded" 
                            placeholder={\`Enter \${element.label.toLowerCase()}\`}
                            rows={3}
                          />
                        ) : (
                          <Input 
                            type={element.type} 
                            placeholder={\`Enter \${element.label.toLowerCase()}\`}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Form Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Form Title</label>
                    <Input placeholder="Contact Form" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                      className="w-full p-2 border rounded" 
                      placeholder="Form description"
                      rows={3}
                    />
                  </div>
                  <Button className="w-full">Generate Form Code</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  'src/app/gdpr/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'GDPR Compliance - AI Guided SaaS Platform',
  description: 'Learn about our GDPR compliance and data protection measures'
};

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GDPR Compliance</h1>
          <p className="text-lg text-gray-600">
            Your privacy matters to us. Learn how we protect your data and comply with GDPR.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-2 text-blue-600" />
                Data Protection Principles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                We adhere to the six key principles of GDPR:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-gray-600">
                <li>Lawfulness, fairness and transparency in processing</li>
                <li>Purpose limitation - data collected for specific purposes</li>
                <li>Data minimisation - only necessary data is collected</li>
                <li>Accuracy of personal data</li>
                <li>Storage limitation - data is kept only as long as necessary</li>
                <li>Integrity and confidentiality through appropriate security measures</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-600" />
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Under GDPR, you have the following rights:</p>
              <ul className="list-disc ml-6 space-y-2 text-gray-600">
                <li>Right to be informed about data processing</li>
                <li>Right of access to your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure (right to be forgotten)</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Rights related to automated decision making</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-6 w-6 mr-2 text-blue-600" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational measures to ensure data security:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-gray-600">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and audits</li>
                <li>Access controls and authentication</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-6 w-6 mr-2 text-blue-600" />
                Data Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                We process personal data only when we have a lawful basis:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-gray-600">
                <li>Consent - when you give clear consent</li>
                <li>Contract - when processing is necessary for a contract</li>
                <li>Legal obligation - when required by law</li>
                <li>Vital interests - to protect life</li>
                <li>Public task - for public interest tasks</li>
                <li>Legitimate interests - for our legitimate business interests</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Our Data Protection Officer</h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about our GDPR compliance or wish to exercise your rights, 
                please contact our Data Protection Officer:
              </p>
              <p className="text-gray-600">
                Email: <a href="mailto:dpo@aiguidedsaas.com" className="text-blue-600 hover:underline">
                  dpo@aiguidedsaas.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
`,

  'src/app/help/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Book, Mail, Phone, Search, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help & Support - AI Guided SaaS Platform',
  description: 'Get help and support for AI Guided SaaS Platform - FAQs, guides, and contact options'
};

export default function HelpPage() {
  const faqs = [
    {
      question: 'How do I get started with AI Guided SaaS?',
      answer: 'Create an account, choose a template or start from scratch, and follow our guided setup wizard.'
    },
    {
      question: 'What programming languages are supported?',
      answer: 'We support JavaScript, TypeScript, Python, React, Next.js, and many other popular languages and frameworks.'
    },
    {
      question: 'Can I integrate with external APIs?',
      answer: 'Yes, our platform supports integrations with REST APIs, databases, and third-party services.'
    },
    {
      question: 'Is there a free tier available?',
      answer: 'Yes, we offer a free tier with basic features. Upgrade to unlock advanced AI capabilities and more resources.'
    }
  ];

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      action: 'Start Chat'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      action: 'Send Email'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us during business hours',
      action: 'Call Now'
    },
    {
      icon: Book,
      title: 'Documentation',
      description: 'Browse our comprehensive guides',
      action: 'View Docs'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to your questions and get the help you need to succeed with AI Guided SaaS
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for help..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Support Options */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {supportOptions.map((option) => (
            <Card key={option.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <option.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  {option.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="h-6 w-6 mr-2" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
`
};

function fixLastBatchFiles() {
  console.log('🔧 Fixing last batch of broken files...');
  let fixedCount = 0;

  Object.entries(lastBatchFiles).forEach(([filePath, content]) => {
    const fullPath = path.join(process.cwd(), filePath);
    
    try {
      // Ensure directory exists
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      fixedCount++;
    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  });

  console.log(`\\n🎉 Fixed ${fixedCount} files in last batch`);
  return fixedCount;
}

// Run the fix
if (require.main === module) {
  fixLastBatchFiles();
}

module.exports = { fixLastBatchFiles };