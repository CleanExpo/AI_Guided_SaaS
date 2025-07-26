'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Rocket, 
  Terminal, 
  Copy, 
  CheckCircle, 
  Clock,
  Code2,
  Zap,
  Package,
  GitBranch,
  Play,
  FileCode,
  Settings,
  Bot,
  CreditCard,
  Users,
  Globe
} from 'lucide-react';

export default function QuickStartPage() {
  const [copiedSteps, setCopiedSteps] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('instant');

  const copyToClipboard = async (text: string, stepId: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedSteps([...copiedSteps, stepId]);
    setTimeout(() => {
      setCopiedSteps(prev => prev.filter(id => id !== stepId));
    }, 2000);
  };

  const instantSetupSteps = [
    {
      id: 1,
      title: 'Clone and Install',
      time: '30 seconds',
      code: `git clone https://github.com/yourusername/ai-guided-saas my-saas
cd my-saas
npm install`,
      description: 'Get the boilerplate and install dependencies'
    },
    {
      id: 2,
      title: 'Environment Setup',
      time: '1 minute',
      code: `cp .env.example .env.local
# Add your API keys:
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=$(openssl rand -base64 32)`,
      description: 'Configure your environment variables'
    },
    {
      id: 3,
      title: 'Database Setup',
      time: '30 seconds',
      code: `npx prisma db push
npx prisma generate`,
      description: 'Initialize your database schema'
    },
    {
      id: 4,
      title: 'Start Development',
      time: '10 seconds',
      code: `npm run dev
# Open http://localhost:3000`,
      description: 'Launch your development server'
    },
    {
      id: 5,
      title: 'Deploy to Production',
      time: '2 minutes',
      code: `vercel
# or
npm run deploy`,
      description: 'Ship to production with one command'
    }
  ];

  const featureSetupGuides = [
    {
      icon: Bot,
      title: 'AI Chat Integration',
      description: 'Add GPT-4 chat in 2 minutes',
      steps: [
        'Add OpenAI API key to .env',
        'Import useAIChat hook',
        'Drop in <ChatInterface /> component',
        'Customize system prompt'
      ]
    },
    {
      icon: CreditCard,
      title: 'Stripe Payments',
      description: 'Accept payments in 5 minutes',
      steps: [
        'Add Stripe keys to .env',
        'Configure products in Stripe Dashboard',
        'Use pre-built checkout flow',
        'Handle webhooks automatically'
      ]
    },
    {
      icon: Users,
      title: 'Authentication',
      description: 'Secure auth in 3 minutes',
      steps: [
        'NextAuth.js pre-configured',
        'Magic links ready',
        'OAuth providers supported',
        'Session management included'
      ]
    },
    {
      icon: Globe,
      title: 'Multi-tenant',
      description: 'SaaS architecture ready',
      steps: [
        'Tenant isolation built-in',
        'Team management UI',
        'Role-based permissions',
        'Billing per organization'
      ]
    }
  ];

  const codeExamples = {
    ai: `// AI Chat in 5 lines
import { useAIChat } from '@/hooks/useAIChat';

export default function Chat() {
  const { messages, sendMessage } = useAIChat();
  return <ChatUI messages={messages} onSend={sendMessage} />;
}`,
    
    auth: `// Protected API Route
import { withAuth } from '@/lib/auth';

export default withAuth(async (req, res, session) => {
  // User is authenticated
  return res.json({ user: session.user });
});`,
    
    payments: `// Stripe Checkout
import { createCheckoutSession } from '@/lib/stripe';

const session = await createCheckoutSession({
  priceId: 'price_xxx')
  userId: user.id)
});

redirect(session.url);`,
    
    database: `// Prisma ORM Ready
import { prisma } from '@/lib/prisma';

const user = await prisma.user.create({
  data: { email, name })
});`
  };

  return(<div className="min-h-screen glass py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-green-100 text-green-700 mb-4">
            <Clock className="h-3 w-3 mr-1" />
            MVP in under 5 minutes
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Quickstart Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From zero to production-ready SaaS. No boilerplate fatigue. Just ship.
          </p>
        </div>

        {/* Setup Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="instant">
              <Rocket className="h-4 w-4 mr-2" />
              Instant Setup
            </TabsTrigger>
            <TabsTrigger value="manual">
              <Settings className="h-4 w-4 mr-2" />
              Manual Setup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="instant" className="mt-8">
            <Card className="glass"
              <CardHeader className="glass"
                <CardTitle className="flex items-center justify-between glass
                  <span>5-Minute Setup</span>
                  <Badge variant="outline">
                    <Zap className="h-3 w-3 mr-1" />
                    Fastest Path
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="glass"
                <div className="space-y-6">)
                  {instantSetupSteps.map((step, index) => (
                    <div key={step.id} className="glass flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{step.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {step.time}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                        <div className="glass-navbar rounded-xl-lg p-4 relative group">
                          <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                            <code>{step.code}</code>
                          </pre>
                          <Button
                            size="sm"
                            variant="ghost">className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">onClick={() => copyToClipboard(step.code, step.id)}
                          >
                            {copiedSteps.includes(step.id) ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <Copy className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass mt-8 p-6 bg-green-50 rounded-xl-lg  -green-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900">That\'s it! You\'re ready to ship.</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your SaaS is now running with auth, payments, AI, and production-ready infrastructure.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="mt-8">
            <Card className="glass"
              <CardHeader className="glass"
                <CardTitle className="glass"Manual Configuration</CardTitle>
              </CardHeader>
              <CardContent className="glass"
                <p className="text-gray-600 mb-6">
                  For advanced customization, follow these detailed setup guides:
                </p>
                <div className="glass grid md:grid-cols-2 gap-6">
                  {featureSetupGuides.map((guide, index) => (
                    <div key={index} className="glass  rounded-xl-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl-lg flex items-center justify-center">
                          <guide.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{guide.title}</h3>
                          <p className="text-sm text-gray-600">{guide.description}</p>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {guide.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Code Examples */}
        <div className="glass grid md:grid-cols-2 gap-6 mb-12">
          <Card className="glass"
            <CardHeader className="glass"
              <CardTitle className="flex items-center gap-2 glass
                <Bot className="h-5 w-5" />
                AI Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="glass"
              <div className="glass-navbar rounded-xl-lg p-4">
                <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                  <code>{codeExamples.ai}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card className="glass"
            <CardHeader className="glass"
              <CardTitle className="flex items-center gap-2 glass
                <Users className="h-5 w-5" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="glass"
              <div className="glass-navbar rounded-xl-lg p-4">
                <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                  <code>{codeExamples.auth}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card className="glass"
            <CardHeader className="glass"
              <CardTitle className="flex items-center gap-2 glass
                <CreditCard className="h-5 w-5" />
                Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="glass"
              <div className="glass-navbar rounded-xl-lg p-4">
                <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                  <code>{codeExamples.payments}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card className="glass"
            <CardHeader className="glass"
              <CardTitle className="flex items-center gap-2 glass
                <Package className="h-5 w-5" />
                Database
              </CardTitle>
            </CardHeader>
            <CardContent className="glass"
              <div className="glass-navbar rounded-xl-lg p-4">
                <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                  <code>{codeExamples.database}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="bg-blue-50 -blue-200 glass
          <CardContent className="glass p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to build?</h2>
              <p className="text-gray-700 mb-6">
                You now have everything you need to ship your SaaS. No more excuses.
              </p>
              <div className="glass flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="glass-button primary ">
                  <Code2 className="h-5 w-5 mr-2" />
                  View Documentation
                </Button>
                <Button size="lg" variant="outline">
                  <GitBranch className="h-5 w-5 mr-2" />
                  Join Discord
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}