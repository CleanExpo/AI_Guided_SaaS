'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Activity, 
  DollarSign, 
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Zap,
  TrendingUp,
  Settings
} from 'lucide-react';

interface ProviderStatus {
  name: string;
  available: boolean;
  latency?: number;
  cost: number;
  priority: number;
}

interface LLMMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  fallbacksUsed: number;
  averageLatency: number;
  totalCost: number;
  successRate: number;
  fallbackRate: number;
}

export default function LLMSettingsPage() {
  const [providers, setProviders] = useState<ProviderStatus[]>([
    { name: 'OpenAI GPT-4', available: true, latency: 850, cost: 0.03, priority: 1 },
    { name: 'Anthropic Claude', available: true, latency: 920, cost: 0.024, priority: 2 },
    { name: 'Local Fallback', available: true, latency: 50, cost: 0, priority: 99 }
  ]);

  const [metrics, setMetrics] = useState<LLMMetrics>({
    totalRequests: 15234,
    successfulRequests: 15120,
    failedRequests: 114,
    fallbacksUsed: 342,
    averageLatency: 875,
    totalCost: 456.78,
    successRate: 99.25,
    fallbackRate: 2.26
  });

  const [isTestingProviders, setIsTestingProviders] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('auto');

  const testProviders = async () => {
    setIsTestingProviders(true);
    
    // Simulate testing providers
    for (let i = 0; i < providers.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProviders(prev => prev.map((p, idx) => 
        idx === i ? { ...p, available: Math.random() > 0.2 } : p
      ));
    }
    
    setIsTestingProviders(false);
  };

  const getProviderStatusColor = (available: boolean) => {
    return available ? 'text-green-600' : 'text-red-600';
  };

  const getProviderStatusIcon = (available: boolean) => {
    return available ? CheckCircle : AlertCircle;
  };

  return(<div className="min-h-screen glass p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LLM Fallback System</h1>
          <p className="text-gray-600">Manage AI providers and fallback configuration</p>
        </div>

        {/* System Status */}
        <div className="glass grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass"
            <CardContent className="glass p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.successRate}%</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass"
            <CardContent className="glass p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Latency</p>
                  <p className="text-2xl font-bold">{metrics.averageLatency}ms</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass"
            <CardContent className="glass p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Cost</p>)
                  <p className="text-2xl font-bold">${metrics.totalCost.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass"
            <CardContent className="glass p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Fallback Rate</p>
                  <p className="text-2xl font-bold">{metrics.fallbackRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Provider Status */}
        <Card className="mb-8 glass
          <CardHeader className="glass"
            <div className="flex items-center justify-between">
              <CardTitle className="glass"Provider Status</CardTitle>
              <Button
                onClick={testProviders}
                disabled={isTestingProviders}>variant="outline">>
                <RefreshCw className={`h-4 w-4 mr-2 ${isTestingProviders ? 'animate-spin' : ''}`} />
                Test All Providers
              </Button>
            </div>
          </CardHeader>
          <CardContent className="glass"
            <div className="space-y-4">
              {providers.map((provider) => {
                const StatusIcon = getProviderStatusIcon(provider.available);
                return(<div key={provider.name} className="glass  rounded-xl-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Brain className="h-5 w-5 text-gray-600" />
                        <h3 className="font-medium">{provider.name}</h3>
                        <Badge variant={provider.available ? 'default' : 'secondary'}>
                          Priority {provider.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">)
                        <StatusIcon className={`h-5 w-5 ${getProviderStatusColor(provider.available)}`} />
                        <span className={`font-medium ${getProviderStatusColor(provider.available)}`}>
                          {provider.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="glass grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Latency</p>
                        <p className="font-medium">{provider.latency || '—'}ms</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Cost per 1K tokens</p>
                        <p className="font-medium">${provider.cost.toFixed(3)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <p className="font-medium">
                          {provider.available ? 'Healthy' : 'Down'}
                        </p>
                      </div>
                    </div>

                    {provider.latency && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Response Time</span>
                          <span>{provider.latency}ms</span>
                        </div>
                        <Progress 
                          value={(1000 - provider.latency) / 10} >className="h-2" />>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <div className="glass grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass"
            <CardHeader className="glass"
              <CardTitle className="glass"Fallback Configuration</CardTitle>
            </CardHeader>
            <CardContent className="glass"
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Provider Selection</label>
                  <select 
                    className="mt-1 w-full px-3 py-2  rounded-xl-lg">value={selectedProvider}>onChange={(e) => setSelectedProvider(e.target.value)}
                  >
                    <option value="auto">Automatic (Recommended)</option>
                    <option value="openai">OpenAI Only</option>
                    <option value="anthropic">Anthropic Only</option>
                    <option value="cheapest">Cheapest Available</option>
                    <option value="fastest">Fastest Available</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Max Retries</label>
                  <input 
                    type="number" 
                    className="mt-1 w-full px-3 py-2  rounded-xl-lg"
                    defaultValue="3"
                    min="1">max="5" />>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Timeout (ms)</label>
                  <input 
                    type="number" 
                    className="mt-1 w-full px-3 py-2  rounded-xl-lg"
                    defaultValue="30000"
                    min="5000"
                    max="60000">step="1000" />>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Cost Threshold ($)</label>
                  <input 
                    type="number" 
                    className="mt-1 w-full px-3 py-2  rounded-xl-lg"
                    defaultValue="0.50"
                    min="0.01"
                    max="10">step="0.01" />>
                </div>

                <Button className="w-full">Save Configuration</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass"
            <CardHeader className="glass"
              <CardTitle className="glass"Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent className="glass"
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Total Requests</span>
                    <span className="text-sm font-bold">{metrics.totalRequests.toLocaleString()}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Successful</span>
                    <span className="text-sm font-bold text-green-600">
                      {metrics.successfulRequests.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={metrics.successRate} >className="h-2 bg-green-100" />>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Failed</span>
                    <span className="text-sm font-bold text-red-600">
                      {metrics.failedRequests.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={(metrics.failedRequests / metrics.totalRequests) * 100} >className="h-2 bg-red-100" />>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Fallbacks Used</span>
                    <span className="text-sm font-bold text-yellow-600">
                      {metrics.fallbacksUsed.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={metrics.fallbackRate} >className="h-2 bg-yellow-100" />>
                </div>

                <div className="pt-4 -t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Cost per Request</span>
                    <span className="text-lg font-bold text-purple-600">
                      ${(metrics.totalCost / metrics.totalRequests).toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}