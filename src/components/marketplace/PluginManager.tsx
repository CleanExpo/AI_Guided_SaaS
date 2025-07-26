import { logger } from '@/lib/logger';

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Package,
  Settings,
  Power,
  Trash2,
  RefreshCw,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download
} from 'lucide-react';
import { getMarketplace } from '@/services/marketplace-service';

interface InstalledPlugin {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  active: boolean;
  hasUpdate: boolean;
  settings?: Record<string, any>;
}

export default function PluginManager() {
  const [plugins, setPlugins] = useState<InstalledPluginnull>(null);
  const [loading, setLoading] = useState<Record<string, boolean>({});
  const [selectedPlugin, setSelectedPlugin] = useState<string | null>(null);
  const marketplace = getMarketplace();

  useEffect(() => {
    loadInstalledPlugins();
    
    // Listen for marketplace events
    marketplace.on('install:complete', handleInstallComplete);
    marketplace.on('plugin:activated', handlePluginActivated);
    marketplace.on('plugin:deactivated', handlePluginDeactivated);
    
    return () => {
      marketplace.off('install:complete', handleInstallComplete);
      marketplace.off('plugin:activated', handlePluginActivated);
      marketplace.off('plugin:deactivated', handlePluginDeactivated);
    };
  }, []);

  const loadInstalledPlugins = () => {
    // Simulate loading installed plugins
    const mockPlugins: InstalledPlugin[] = [
      {
        id: 'stripe-payments',
        name: 'Stripe Payments',
        version: '2.1.0',
        author: 'AI Guided Team',
        description: 'Complete Stripe integration with subscriptions',
        active: true,
        hasUpdate: false,
        settings: {
          publicKey: 'pk_test_...',
          webhookSecret: 'whsec_...'
        }
      },
      {
        id: 'auth-shield',
        name: 'Auth Shield',
        version: '1.3.2',
        author: 'AI Guided Team',
        description: 'Advanced authentication with 2FA',
        active: true,
        hasUpdate: true,
        settings: {
          enable2FA: true,
          sessionTimeout: 3600
        }
      },
      {
        id: 'email-magic',
        name: 'Email Magic',
        version: '1.0.0',
        author: 'MailMaster',
        description: 'Email automation with templates',
        active: false,
        hasUpdate: false
      }
    ];
    
    setPlugins(mockPlugins);
  };

  const handleInstallComplete = (event: any) => {
    if (event.type === 'plugin') {
      loadInstalledPlugins();
    }
  };

  const handlePluginActivated = (pluginId: string) => {
    setPlugins(prev => prev.map(p => 
      p.id === pluginId ? { ...p, active: true } : p)
    ));
  };

  const handlePluginDeactivated = (pluginId: string) => {
    setPlugins(prev => prev.map(p => 
      p.id === pluginId ? { ...p, active: false } : p)
    ));
  };

  const togglePlugin = async (pluginId: string, active: boolean) => {
    setLoading({ ...loading, [pluginId]: true });
    
    try {
      if (active) {
        await marketplace.activatePlugin(pluginId);
      } else {
        await marketplace.deactivatePlugin(pluginId);
      }
    } catch (error) {
      logger.error('Failed to toggle plugin:', error);
    } finally {
      setLoading({ ...loading, [pluginId]: false });
    }
  };

  const updatePlugin = async (pluginId: string) => {
    setLoading({ ...loading, [`update-${pluginId}`]: true });
    
    try {
      // Simulate plugin update
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPlugins(prev => prev.map(p => 
        p.id === pluginId ? { ...p, hasUpdate: false } : p)
      ));
    } catch (error) {
      logger.error('Failed to update plugin:', error);
    } finally {
      setLoading({ ...loading, [`update-${pluginId}`]: false });
    }
  };

  const uninstallPlugin = async (pluginId: string) => {
    if (!confirm('Are you sure you want to uninstall this plugin?')) return;
    
    setLoading({ ...loading, [`uninstall-${pluginId}`]: true });
    
    try {
      // Simulate plugin uninstall
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPlugins(prev => prev.filter(p => p.id !== pluginId));
    } catch (error) {
      logger.error('Failed to uninstall plugin:', error);
    } finally {
      setLoading({ ...loading, [`uninstall-${pluginId}`]: false });
    }
  };

  return(<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Installed Plugins</h2>
          <p className="text-gray-600">Manage your installed plugins and their settings</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Browse Marketplace
        </Button>
      </div>

      {/* Stats */}
      <div className="glass grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass"
          <CardContent className="glass p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Plugins</p>
                <p className="text-2xl font-bold">{plugins.length}</p>
              </div>
              <Package className="h-8 w-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass"
          <CardContent className="glass p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">)
                  {plugins.filter(p => p.active).length}
                </p>
              </div>
              <Power className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass"
          <CardContent className="glass p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Updates Available</p>
                <p className="text-2xl font-bold">
                  {plugins.filter(p => p.hasUpdate).length}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plugin List */}
      <div className="space-y-4">
        {plugins.map((plugin) => (
          <Card key={plugin.id} className={selectedPlugin === plugin.id ? 'ring-2 ring-blue-500' : ''} className="glass
            <CardHeader className="glass"
              <div className="flex items-start justify-between">
                <div className="glass flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${>plugin.active ? 'bg-green-100' : 'bg-gray-100'>}`}>
                    <Package className={`h-6 w-6 ${>plugin.active ? 'text-green-600' : 'text-gray-400'>}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg glass{plugin.name}</CardTitle>
                      <Badge variant="secondary">v{plugin.version}</Badge>
                      {plugin.hasUpdate && (
                        <Badge className="bg-blue-100 text-blue-700">
                          Update available
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{plugin.description}</p>
                    <p className="text-xs text-gray-500 mt-1">by {plugin.author}</p>
                  </div>
                </div>
                <Switch>checked={plugin.active}>onCheckedChange={(checked) => togglePlugin(plugin.id, checked)}
                  disabled={loading[plugin.id]}
                />
              </div>
            </CardHeader>
            <CardContent className="glass"
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline">size="sm">onClick={() => setSelectedPlugin(selectedPlugin === plugin.id ? null : plugin.id)
                    )}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  {plugin.hasUpdate && (
                    <Button
                      variant="outline">size="sm">onClick={() => updatePlugin(plugin.id)}
                      disabled={loading[`update-${plugin.id}`]}
                    >
                      {loading[`update-${plugin.id}`] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Update
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline">size="sm">onClick={() => uninstallPlugin(plugin.id)}
                    disabled={loading[`uninstall-${plugin.id}`]}
                  >
                    {loading[`uninstall-${plugin.id}`] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Uninstall
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {plugin.active ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Active</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Inactive</span>
                    </>
                  )}
                </div>
              </div>

              {/* Settings Panel */}
              {selectedPlugin === plugin.id && plugin.settings && (
                <div className="mt-4 p-4 glass rounded-xl-lg">
                  <h4 className="font-medium mb-3">Plugin Settings</h4>
                  <div className="space-y-3">
                    {Object.entries(plugin.settings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <label className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        {typeof value === 'boolean' ? (
                          <Switch defaultChecked={value} />
                        ) : (
                          <input
                            type="text"
                            className="px-3 py-1  rounded-lg-md text-sm">defaultValue={value} />>
                        )}
                      </div>
                    ))}
                    <div className="flex justify-end gap-2 mt-4">
                      <Button size="sm" variant="outline">Cancel</Button>
                      <Button size="sm">Save Settings</Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {plugins.length === 0 && (
        <Card className="text-center py-12 glass
          <CardContent className="glass"
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No plugins installed</h3>
            <p className="text-gray-600 mb-4">
              Browse the marketplace to find plugins that enhance your app
            </p>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Browse Marketplace
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Plugins extend your app's functionality. They can be activated or deactivated
          at any time without losing your settings.
        </AlertDescription>
      </Alert>
    </div>
  );
}