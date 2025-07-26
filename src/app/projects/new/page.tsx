'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  ArrowRight,
  Bot,
  Code2,
  Database,
  Globe,
  Layers,
  Lock,
  Package,
  Rocket,
  Settings,
  Sparkles,
  Terminal,
  Users,
  Zap,
  CheckCircle,
  Cloud,
  GitBranch,
  Shield,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NewProjectPage() {
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    framework: 'nextjs',
    template: 'saas',
    features: [] as string[],
    database: 'postgresql',
    auth: 'nextauth',
    payment: 'stripe',
    deployment: 'vercel'
  });
  
  const router = useRouter();

  const frameworks = [
    { value: 'nextjs', label: 'Next.js', icon: Code2, description: 'Full-stack React framework' },
    { value: 'react', label: 'React', icon: Code2, description: 'Frontend library' },
    { value: 'vue', label: 'Vue.js', icon: Code2, description: 'Progressive framework' },
    { value: 'angular', label: 'Angular', icon: Code2, description: 'Enterprise framework' },
    { value: 'node', label: 'Node.js', icon: Terminal, description: 'Backend runtime' }
  ];

  const templates = [
    { 
      value: 'saas', 
      label: 'SaaS Starter', 
      description: 'Multi-tenant app with payments',
      features: ['Authentication', 'Payments', 'Admin Dashboard', 'API']
    },
    { 
      value: 'marketplace', 
      label: 'Marketplace', 
      description: 'Two-sided marketplace platform',
      features: ['User Profiles', 'Listings', 'Payments', 'Reviews']
    },
    { 
      value: 'ai-chat', 
      label: 'AI Chatbot', 
      description: 'AI-powered chat application',
      features: ['AI Integration', 'Chat UI', 'History', 'Embeddings']
    },
    { 
      value: 'dashboard', 
      label: 'Analytics Dashboard', 
      description: 'Data visualization platform',
      features: ['Charts', 'Real-time Data', 'Reports', 'Export']
    }
  ];

  const features = [
    { value: 'auth', label: 'Authentication', icon: Lock },
    { value: 'database', label: 'Database', icon: Database },
    { value: 'api', label: 'REST API', icon: Globe },
    { value: 'payments', label: 'Payments', icon: CreditCard },
    { value: 'ai', label: 'AI Integration', icon: Bot },
    { value: 'realtime', label: 'Real-time', icon: Zap },
    { value: 'cms', label: 'CMS', icon: Layers },
    { value: 'analytics', label: 'Analytics', icon: Users }
  ];

  const handleFeatureToggle = (feature: string) => {
    setProjectData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleCreateProject = async () => {
    setIsCreating(true);
    
    // Simulate project creation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real app, this would make an API call
    router.push('/projects/1/setup');
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          
          
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600 mt-2">Set up your project with AI assistance
          
          <Progress value={progress} className="mt-6" />
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Let's start with the basics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="My Awesome App"
                  value={projectData.name}
                  onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What does your project do?"
                  value={projectData.description}
                  onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-2"
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep(2)}
                  disabled={!projectData.name}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Framework & Template */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Framework & Template</CardTitle>
              <CardDescription>Select your tech stack</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Framework</Label>
                <RadioGroup 
                  value={projectData.framework}
                  onValueChange={(value) => setProjectData(prev => ({ ...prev, framework: value }))}
                  className="mt-3 space-y-3">
                  {frameworks.map((framework) => (
                    <div key={framework.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={framework.value} id={framework.value} />
                      <Label 
                        htmlFor={framework.value} 
                        className="flex items-center gap-3 cursor-pointer flex-1">
                        <framework.icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium">{framework.label}</div>
                          <div className="text-sm text-gray-600">{framework.description}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                
              </div>

              <div>
                <Label>Template</Label>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <Card 
                      key={template.value}
                      className={cn(
                        "cursor-pointer transition-all",
                        projectData.template === template.value && "border-blue-600"
                      )}
                      onClick={() => setProjectData(prev => ({ ...prev, template: template.value }))}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{template.label}</CardTitle>
                        <CardDescription className="text-sm">{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {template.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                
                <Button onClick={() => setStep(3)}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Features */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Features</CardTitle>
              <CardDescription>Choose the features you need</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {features.map((feature) => (
                  <Card 
                    key={feature.value}
                    className={cn(
                      "cursor-pointer transition-all",
                      projectData.features.includes(feature.value) && "border-blue-600 bg-blue-50"
                    )}
                    onClick={() => handleFeatureToggle(feature.value)}>
                    <CardContent className="p-4 text-center">
                      <feature.icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                      <div className="text-sm font-medium">{feature.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                
                <Button onClick={() => setStep(4)}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Configuration */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Final setup options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="database">Database</Label>
                  <Select 
                    value={projectData.database}
                    onValueChange={(value) => setProjectData(prev => ({ ...prev, database: value }))}>
                    <SelectTrigger id="database" className="mt-2">
                      <SelectValue />
                    
                    <SelectContent>
                      <SelectItem value="postgresql">PostgreSQL
                      <SelectItem value="mysql">MySQL
                      <SelectItem value="mongodb">MongoDB
                      <SelectItem value="sqlite">SQLite
                    </SelectContent>
                  
                </div>

                <div>
                  <Label htmlFor="auth">Authentication</Label>
                  <Select 
                    value={projectData.auth}
                    onValueChange={(value) => setProjectData(prev => ({ ...prev, auth: value }))}>
                    <SelectTrigger id="auth" className="mt-2">
                      <SelectValue />
                    
                    <SelectContent>
                      <SelectItem value="nextauth">NextAuth.js
                      <SelectItem value="clerk">Clerk
                      <SelectItem value="auth0">Auth0
                      <SelectItem value="supabase">Supabase Auth
                    </SelectContent>
                  
                </div>

                <div>
                  <Label htmlFor="payment">Payment Provider</Label>
                  <Select 
                    value={projectData.payment}
                    onValueChange={(value) => setProjectData(prev => ({ ...prev, payment: value }))}>
                    <SelectTrigger id="payment" className="mt-2">
                      <SelectValue />
                    
                    <SelectContent>
                      <SelectItem value="stripe">Stripe
                      <SelectItem value="paddle">Paddle
                      <SelectItem value="lemonsqueezy">LemonSqueezy
                      <SelectItem value="none">None
                    </SelectContent>
                  
                </div>

                <div>
                  <Label htmlFor="deployment">Deployment</Label>
                  <Select 
                    value={projectData.deployment}
                    onValueChange={(value) => setProjectData(prev => ({ ...prev, deployment: value }))}>
                    <SelectTrigger id="deployment" className="mt-2">
                      <SelectValue />
                    
                    <SelectContent>
                      <SelectItem value="vercel">Vercel
                      <SelectItem value="netlify">Netlify
                      <SelectItem value="aws">AWS
                      <SelectItem value="custom">Custom
                    </SelectContent>
                  
                </div>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">AI-Powered Setup</div>
                      <div className="text-sm text-blue-700 mt-1">
                        Our AI will configure optimal settings based on your selections and help you build faster.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(3)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                
                <Button 
                  onClick={handleCreateProject}
                  disabled={isCreating}
                  className="bg-blue-600 hover:bg-blue-700">
                  {isCreating ? (
                    <>Creating Project...</>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Create Project
                    </>
                  )}
                
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}