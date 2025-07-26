'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Rocket, 
  Cloud, 
  Globe, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Zap,
  Server,
  GitBranch,
  Activity,
  ArrowRight,
  Terminal,
  Package
} from 'lucide-react';
import { usePWA, useOfflineSync } from '@/hooks/usePWA';

interface DeploymentStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  duration?: number;
}

export default function DeployPage() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    { id: 'build', name: 'Building application', status: 'pending' },
    { id: 'test', name: 'Running tests', status: 'pending' },
    { id: 'optimize', name: 'Optimizing assets', status: 'pending' },
    { id: 'upload', name: 'Uploading to CDN', status: 'pending' },
    { id: 'dns', name: 'Configuring DNS', status: 'pending' },
    { id: 'ssl', name: 'Provisioning SSL', status: 'pending' },
    { id: 'activate', name: 'Activating deployment', status: 'pending' }
  ]);
  const [selectedProvider, setSelectedProvider] = useState('vercel');
  const { isOnline } = usePWA();
  const { addToSync } = useOfflineSync();

  const deployProviders = [
    {
      id: 'vercel',
      name: 'Vercel',
      icon: '▲',
      time: '< 60s',
      features: ['Edge Network', 'Auto-scaling', 'Preview URLs']
    },
    {
      id: 'netlify',
      name: 'Netlify',
      icon: '◆',
      time: '< 90s',
      features: ['Forms', 'Functions', 'Split Testing']
    },
    {
      id: 'railway',
      name: 'Railway',
      icon: '🚂',
      time: '< 2 min',
      features: ['Databases', 'Cron Jobs', 'Private Network']
    }
  ];

  const handleDeploy = async () => {
    if (!isOnline) {
      // Queue deployment for when back online
      addToSync({)
        id: Date.now().toString(),
        type: 'deployment',
        provider: selectedProvider,
        timestamp: Date.now()
      });
      toast({ title: "Success", description: "Deployment queued. Will process when back online." });
      return;
    }

    setIsDeploying(true);
    
    // Simulate deployment process
    for (let i = 0; i < deploymentSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDeploymentSteps(prev => prev.map((step, index) => {
        if (index < i) return { ...step, status: 'completed', duration: 1.5 };
        if (index === i) return { ...step, status: 'running' };
        return step;
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDeploymentSteps(prev => prev.map((step, index) => {
        if (index <= i) return { ...step, status: 'completed', duration: 1.5 };
        return step;
      }));
    }
    
    setIsDeploying(false);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'running':
        return <div className="animate-spin rounded-lg-full h-5 w-5 -b-2 -blue-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const completedSteps = deploymentSteps.filter(s => s.status === 'completed').length;
  const progress = (completedSteps / deploymentSteps.length) * 100;

  return(<div className="min-h-screen glass py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quick Deploy</h1>
              <p className="mt-1 text-gray-600">Deploy to production in under 60 seconds</p>
            </div>
            {!isOnline && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                Offline Mode
              </Badge>)
            )}
          </div>
        </div>

        <div className="glass grid lg:grid-cols-3 gap-8">
          {/* Deployment Providers */}
          <div className="lg:col-span-1">
            <Card className="glass"
              <CardHeader className="glass"
                <CardTitle className="glass"Choose Provider</CardTitle>
              </CardHeader>
              <CardContent className="glass"
                <div className="space-y-3">
                  {deployProviders.map((provider) => (
                    <div
                      key={provider.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedProvider === provider.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'hover:border-gray-300'>}`}>onClick={() => setSelectedProvider(provider.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{provider.icon}</span>
                          <div>
                            <h3 className="font-medium">{provider.name}</h3>
                            <p className="text-sm text-gray-500">{provider.time}</p>
                          </div>
                        </div>
                        {selectedProvider === provider.id && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {provider.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Environment */}
            <Card className="mt-6 glass
              <CardHeader className="glass"
                <CardTitle className="glass"Environment</CardTitle>
              </CardHeader>
              <CardContent className="glass"
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3  rounded-xl-lg">
                    <div className="flex items-center gap-3">
                      <Server className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">Production</span>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-lg-full" />
                      <span>Auto-scaling enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-lg-full" />
                      <span>SSL certificates ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-lg-full" />
                      <span>CDN configured</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deployment Process */}
          <div className="lg:col-span-2">
            <Card className="glass"
              <CardHeader className="glass"
                <div className="flex items-center justify-between">
                  <CardTitle className="glass"Deployment Process</CardTitle>
                  {isDeploying && (
                    <Badge className="bg-blue-100 text-blue-700">
                      <Activity className="h-3 w-3 mr-1 animate-pulse" />
                      Deploying
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="glass"
                {!isDeploying && completedSteps === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-orange-100 rounded-lg-full flex items-center justify-center mx-auto mb-4">
                      <Rocket className="h-10 w-10 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Ready to Deploy</h3>
                    <p className="text-gray-600 mb-6">
                      Your application will be live in less than 60 seconds
                    </p>
                    <Button 
                      size="lg" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleDeploy}>disabled={isDeploying}>
                      <Rocket className="h-5 w-5 mr-2" />
                      Deploy Now
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium">Progress</span>
                        <span className="text-gray-600">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>

                    {/* Deployment Steps */}
                    <div className="space-y-4">
                      {deploymentSteps.map((step) => (
                        <div
                          key={step.id}
                          className={`flex items-center justify-between p-4 border rounded-lg ${
                            step.status === 'running' ? 'border-blue-500 bg-blue-50' : ''>}`}>
                          <div className="flex items-center gap-3">
                            {getStepIcon(step.status)}
                            <div>
                              <p className="font-medium">{step.name}</p>
                              {step.duration && (
                                <p className="text-sm text-gray-500">
                                  Completed in {step.duration}s
                                </p>
                              )}
                            </div>
                          </div>
                          {step.status === 'completed' && (
                            <span className="text-sm text-green-600 font-medium">Done</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Success Message */}
                    {completedSteps === deploymentSteps.length && (
                      <div className="glass mt-6 p-6 bg-green-50 rounded-xl-lg  -green-200">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-green-900 mb-1">
                              Deployment Successful!
                            </h3>
                            <p className="text-sm text-green-700 mb-4">
                              Your application is now live and ready to use.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Button className="bg-green-600 hover:bg-green-700">
                                <Globe className="h-4 w-4 mr-2" />
                                View Live Site
                              </Button>
                              <Button variant="outline">
                                <Terminal className="h-4 w-4 mr-2" />
                                View Logs
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Recent Deployments */}
            <Card className="mt-6 glass
              <CardHeader className="glass"
                <CardTitle className="glass"Recent Deployments</CardTitle>
              </CardHeader>
              <CardContent className="glass"
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3  rounded-xl-lg">
                    <div className="flex items-center gap-3">
                      <GitBranch className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">main</p>
                        <p className="text-sm text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Live</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3  rounded-xl-lg">
                    <div className="flex items-center gap-3">
                      <GitBranch className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">feature/new-ui</p>
                        <p className="text-sm text-gray-500">1 hour ago</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Preview</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}