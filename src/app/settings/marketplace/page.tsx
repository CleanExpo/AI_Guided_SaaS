'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package,
  Puzzle,
  Zap,
  Download
} from 'lucide-react';
import PluginManager from '@/components/marketplace/PluginManager';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function MarketplaceSettingsPage() {
  const [activeTab, setActiveTab] = useState('plugins');
  const { trackFeature } = useAnalytics();

  return (
    <div className="min-h-screen glass py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Marketplace Settings</h1>
          <p className="mt-1 text-gray-600">
            Manage your installed templates, plugins, and integrations
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          trackFeature('marketplace_settings', 'tab_switch', value);
        }}>
          <TabsList>
            <TabsTrigger value="plugins">
              <Package className="h-4 w-4 mr-2" />
              Plugins
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Puzzle className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Zap className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plugins" className="mt-6">
            <PluginManager />
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <Card className="glass"
              <CardHeader className="glass"
                <CardTitle className="glass"Installed Templates</CardTitle>
              </CardHeader>
              <CardContent className="glass"
                <div className="text-center py-12">
                  <Puzzle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No templates installed yet
                  </h3>
                  <p className="text-gray-600">
                    Templates you install from the marketplace will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <Card className="glass"
              <CardHeader className="glass"
                <CardTitle className="glass"Active Integrations</CardTitle>
              </CardHeader>
              <CardContent className="glass"
                <div className="space-y-4">
                  <div className="glass flex items-center justify-between p-4  rounded-xl-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">OpenAI GPT-4</h4>
                        <p className="text-sm text-gray-600">AI text generation</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600">Connected</span>
                  </div>
                  <div className="glass flex items-center justify-between p-4  rounded-xl-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Supabase</h4>
                        <p className="text-sm text-gray-600">Database & Auth</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600">Connected</span>
                  </div>
                  <div className="glass flex items-center justify-between p-4  rounded-xl-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Stripe</h4>
                        <p className="text-sm text-gray-600">Payment processing</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600">Connected</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}