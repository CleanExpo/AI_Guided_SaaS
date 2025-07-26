'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette,
  Globe,
  Code2,
  Download,
  Save,
  RotateCcw,
  AlertCircle,
  Loader2,
  Building2
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useToast } from '@/hooks/use-toast';
import {
  BrandingTab,
  ColorsTab,
  AdvancedTab,
  PremiumTab,
  PreviewPanel,
  BrandingConfig,
  defaultConfig
} from '@/components/settings/white-label';

export default function WhiteLabelPage() {
  const [activeTab, setActiveTab] = useState('branding');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { trackFeature, trackConversion } = useAnalytics();
  const { toast } = useToast();
  
  const [config, setConfig] = useState<BrandingConfig>(defaultConfig);

  const updateConfig = (field: keyof BrandingConfig, value: string | boolean | Record<string, unknown>) => {
    setConfig({ ...config, [field]: value });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    trackFeature('white_label', 'save_config', 'all');
    
    try {
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Track conversion for premium features
      if (config.removeBranding || config.customDomain || config.customEmails) {
        trackConversion('white_label_premium');
      }
      
      setHasChanges(false);
      toast({ title: "Success", description: "White-label configuration saved successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save configuration", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default branding?')) {
      setConfig(defaultConfig);
      setHasChanges(false);
    }
  };

  const handleExport = () => {
    const exportData = JSON.stringify(config, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'white-label-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    trackFeature('white_label', 'export_config', 'json');
  };

  return (
    <div className="min-h-screen glass py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">White-Label Settings</h1>
              <p className="mt-1 text-gray-600">
                Customize branding and make this platform your own
              </p>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <Badge className="bg-yellow-100 text-yellow-700">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Unsaved changes
                </Badge>
              )}
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <div className="glass grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <Card className="glass"
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="branding">
                    <Building2 className="h-4 w-4 mr-2" />
                    Branding
                  </TabsTrigger>
                  <TabsTrigger value="colors">
                    <Palette className="h-4 w-4 mr-2" />
                    Colors
                  </TabsTrigger>
                  <TabsTrigger value="advanced">
                    <Code2 className="h-4 w-4 mr-2" />
                    Advanced
                  </TabsTrigger>
                  <TabsTrigger value="premium">
                    <Globe className="h-4 w-4 mr-2" />
                    Premium
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="branding">
                  <BrandingTab config={config} updateConfig={updateConfig} />
                </TabsContent>

                <TabsContent value="colors">
                  <ColorsTab config={config} updateConfig={updateConfig} />
                </TabsContent>

                <TabsContent value="advanced">
                  <AdvancedTab config={config} updateConfig={updateConfig} />
                </TabsContent>

                <TabsContent value="premium">
                  <PremiumTab config={config} updateConfig={updateConfig} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <PreviewPanel config={config} />
          </div>
        </div>
      </div>
    </div>
  );
}