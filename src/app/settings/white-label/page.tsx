'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Palette,
  Upload,
  Globe,
  Mail,
  Code2,
  Eye,
  Download,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Building2,
  Image,
  Type,
  Link2,
  Shield,
  Zap,
  Smartphone,
  Monitor
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface BrandingConfig {
  // Basic Info
  companyName: string;
  tagline: string;
  description: string;
  
  // Visual Identity
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  
  // Typography
  headerFont: string;
  bodyFont: string;
  
  // Contact Info
  supportEmail: string;
  supportUrl: string;
  privacyUrl: string;
  termsUrl: string;
  
  // Social Media
  twitter?: string;
  linkedin?: string;
  github?: string;
  discord?: string;
  
  // Advanced
  customCSS?: string;
  customJS?: string;
  customHead?: string;
  
  // Features
  removeBranding: boolean;
  customDomain: string;
  customEmails: boolean;
}

export default function WhiteLabelPage() {
  const [activeTab, setActiveTab] = useState('branding');
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [hasChanges, setHasChanges] = useState(false);
  const { trackFeature, trackConversion } = useAnalytics();
  
  const [config, setConfig] = useState<BrandingConfig>({
    companyName: 'AI Guided SaaS',
    tagline: 'Ship Your SaaS 10x Faster',
    description: 'The fastest way to build and deploy your SaaS',
    logo: '/logo.png',
    favicon: '/favicon.ico',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#F97316',
    headerFont: 'Inter',
    bodyFont: 'Inter',
    supportEmail: 'support@example.com',
    supportUrl: 'https://support.example.com',
    privacyUrl: '/privacy',
    termsUrl: '/terms',
    removeBranding: false,
    customDomain: '',
    customEmails: false
  });

  const updateConfig = (field: keyof BrandingConfig, value: any) => {
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
      alert('White-label configuration saved successfully!');
    } catch (error) {
      alert('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default branding?')) {
      window.location.reload();
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

  const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 
    'Montserrat', 'Playfair Display', 'Raleway', 'Ubuntu'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="branding">Branding</TabsTrigger>
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    <TabsTrigger value="premium">Premium</TabsTrigger>
                  </TabsList>

                  {/* Branding Tab */}
                  <TabsContent value="branding" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Brand Identity</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Company Name</Label>
                          <Input
                            value={config.companyName}
                            onChange={(e) => updateConfig('companyName', e.target.value)}
                            placeholder="Your Company Name"
                          />
                        </div>
                        
                        <div>
                          <Label>Tagline</Label>
                          <Input
                            value={config.tagline}
                            onChange={(e) => updateConfig('tagline', e.target.value)}
                            placeholder="Your inspiring tagline"
                          />
                        </div>
                        
                        <div>
                          <Label>Description</Label>
                          <textarea
                            className="w-full px-3 py-2 border rounded-lg"
                            rows={3}
                            value={config.description}
                            onChange={(e) => updateConfig('description', e.target.value)}
                            placeholder="Brief description of your platform"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Logo & Favicon</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Logo</Label>
                          <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                            <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Logo
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">
                              PNG or SVG, max 2MB
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Favicon</Label>
                          <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                            <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Favicon
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">
                              ICO or PNG, 32x32px
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Typography</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Header Font</Label>
                          <select
                            className="w-full px-3 py-2 border rounded-lg"
                            value={config.headerFont}
                            onChange={(e) => updateConfig('headerFont', e.target.value)}
                          >
                            {fontOptions.map(font => (
                              <option key={font} value={font}>{font}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <Label>Body Font</Label>
                          <select
                            className="w-full px-3 py-2 border rounded-lg"
                            value={config.bodyFont}
                            onChange={(e) => updateConfig('bodyFont', e.target.value)}
                          >
                            {fontOptions.map(font => (
                              <option key={font} value={font}>{font}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Colors Tab */}
                  <TabsContent value="colors" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Color Scheme</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Primary Color</Label>
                          <div className="flex gap-3 mt-2">
                            <input
                              type="color"
                              value={config.primaryColor}
                              onChange={(e) => updateConfig('primaryColor', e.target.value)}
                              className="h-10 w-20"
                            />
                            <Input
                              value={config.primaryColor}
                              onChange={(e) => updateConfig('primaryColor', e.target.value)}
                              placeholder="#3B82F6"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Secondary Color</Label>
                          <div className="flex gap-3 mt-2">
                            <input
                              type="color"
                              value={config.secondaryColor}
                              onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                              className="h-10 w-20"
                            />
                            <Input
                              value={config.secondaryColor}
                              onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                              placeholder="#8B5CF6"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Accent Color</Label>
                          <div className="flex gap-3 mt-2">
                            <input
                              type="color"
                              value={config.accentColor}
                              onChange={(e) => updateConfig('accentColor', e.target.value)}
                              className="h-10 w-20"
                            />
                            <Input
                              value={config.accentColor}
                              onChange={(e) => updateConfig('accentColor', e.target.value)}
                              placeholder="#F97316"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Preset Themes</h3>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => {
                            updateConfig('primaryColor', '#3B82F6');
                            updateConfig('secondaryColor', '#8B5CF6');
                            updateConfig('accentColor', '#F97316');
                          }}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex gap-2 justify-center mb-2">
                            <div className="w-6 h-6 rounded bg-blue-500" />
                            <div className="w-6 h-6 rounded bg-purple-500" />
                            <div className="w-6 h-6 rounded bg-orange-500" />
                          </div>
                          <p className="text-sm font-medium">Default</p>
                        </button>
                        
                        <button
                          onClick={() => {
                            updateConfig('primaryColor', '#10B981');
                            updateConfig('secondaryColor', '#6366F1');
                            updateConfig('accentColor', '#F59E0B');
                          }}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex gap-2 justify-center mb-2">
                            <div className="w-6 h-6 rounded bg-green-500" />
                            <div className="w-6 h-6 rounded bg-indigo-500" />
                            <div className="w-6 h-6 rounded bg-amber-500" />
                          </div>
                          <p className="text-sm font-medium">Nature</p>
                        </button>
                        
                        <button
                          onClick={() => {
                            updateConfig('primaryColor', '#000000');
                            updateConfig('secondaryColor', '#6B7280');
                            updateConfig('accentColor', '#EF4444');
                          }}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex gap-2 justify-center mb-2">
                            <div className="w-6 h-6 rounded bg-black" />
                            <div className="w-6 h-6 rounded bg-gray-500" />
                            <div className="w-6 h-6 rounded bg-red-500" />
                          </div>
                          <p className="text-sm font-medium">Dark Pro</p>
                        </button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Advanced Tab */}
                  <TabsContent value="advanced" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Links & Contact</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Support Email</Label>
                          <Input
                            type="email"
                            value={config.supportEmail}
                            onChange={(e) => updateConfig('supportEmail', e.target.value)}
                            placeholder="support@example.com"
                          />
                        </div>
                        
                        <div>
                          <Label>Support URL</Label>
                          <Input
                            value={config.supportUrl}
                            onChange={(e) => updateConfig('supportUrl', e.target.value)}
                            placeholder="https://support.example.com"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Privacy Policy URL</Label>
                            <Input
                              value={config.privacyUrl}
                              onChange={(e) => updateConfig('privacyUrl', e.target.value)}
                              placeholder="/privacy"
                            />
                          </div>
                          
                          <div>
                            <Label>Terms of Service URL</Label>
                            <Input
                              value={config.termsUrl}
                              onChange={(e) => updateConfig('termsUrl', e.target.value)}
                              placeholder="/terms"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Custom Code</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Custom CSS</Label>
                          <textarea
                            className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                            rows={6}
                            value={config.customCSS}
                            onChange={(e) => updateConfig('customCSS', e.target.value)}
                            placeholder="/* Your custom CSS */"
                          />
                        </div>
                        
                        <div>
                          <Label>Custom Head Tags</Label>
                          <textarea
                            className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                            rows={4}
                            value={config.customHead}
                            onChange={(e) => updateConfig('customHead', e.target.value)}
                            placeholder="<!-- Analytics, fonts, etc -->"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Premium Tab */}
                  <TabsContent value="premium" className="space-y-6">
                    <Alert>
                      <Sparkles className="h-4 w-4" />
                      <AlertDescription>
                        Premium features require a Pro or Enterprise plan
                      </AlertDescription>
                    </Alert>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Premium Features</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 border rounded-lg">
                          <input
                            type="checkbox"
                            checked={config.removeBranding}
                            onChange={(e) => updateConfig('removeBranding', e.target.checked)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Label className="text-base">Remove "Powered by" Branding</Label>
                              <Badge className="bg-purple-100 text-purple-700">Pro</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Remove all references to AI Guided SaaS from your platform
                            </p>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Label className="text-base">Custom Domain</Label>
                            <Badge className="bg-purple-100 text-purple-700">Pro</Badge>
                          </div>
                          <Input
                            value={config.customDomain}
                            onChange={(e) => updateConfig('customDomain', e.target.value)}
                            placeholder="app.yourdomain.com"
                          />
                          <p className="text-sm text-gray-600 mt-2">
                            Use your own domain instead of *.aigiudedsaas.com
                          </p>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 border rounded-lg">
                          <input
                            type="checkbox"
                            checked={config.customEmails}
                            onChange={(e) => updateConfig('customEmails', e.target.checked)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Label className="text-base">Custom Email Templates</Label>
                              <Badge className="bg-orange-100 text-orange-700">Enterprise</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Fully customize all system emails with your branding
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                      <CardContent className="p-6">
                        <h4 className="text-lg font-semibold mb-2">Need more customization?</h4>
                        <p className="text-gray-600 mb-4">
                          Enterprise plans include full source code access and unlimited customization options
                        </p>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <Zap className="h-4 w-4 mr-2" />
                          Upgrade to Enterprise
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Live Preview</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={previewMode === 'desktop' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={previewMode === 'mobile' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`border rounded-lg overflow-hidden ${
                  previewMode === 'mobile' ? 'max-w-xs mx-auto' : ''
                }`}>
                  {/* Preview Header */}
                  <div 
                    className="p-4 text-white"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 
                          className="text-lg font-bold"
                          style={{ fontFamily: config.headerFont }}
                        >
                          {config.companyName}
                        </h3>
                        <p 
                          className="text-sm opacity-90"
                          style={{ fontFamily: config.bodyFont }}
                        >
                          {config.tagline}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-white/20 rounded-lg" />
                    </div>
                  </div>
                  
                  {/* Preview Content */}
                  <div className="p-4 bg-white">
                    <div className="mb-4">
                      <h4 
                        className="font-semibold mb-2"
                        style={{ 
                          fontFamily: config.headerFont,
                          color: config.primaryColor 
                        }}
                      >
                        Welcome to Your Dashboard
                      </h4>
                      <p 
                        className="text-sm text-gray-600"
                        style={{ fontFamily: config.bodyFont }}
                      >
                        {config.description}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 text-white rounded text-sm"
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        Primary Button
                      </button>
                      <button
                        className="px-4 py-2 text-white rounded text-sm"
                        style={{ backgroundColor: config.accentColor }}
                      >
                        Accent Button
                      </button>
                    </div>
                    
                    {!config.removeBranding && (
                      <p className="text-xs text-gray-400 mt-4 text-center">
                        Powered by AI Guided SaaS
                      </p>
                    )}
                  </div>
                </div>

                {/* Preview Info */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Colors</span>
                    <div className="flex gap-2">
                      <div 
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: config.primaryColor }}
                      />
                      <div 
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: config.secondaryColor }}
                      />
                      <div 
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: config.accentColor }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fonts</span>
                    <span className="font-medium">{config.headerFont}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Domain</span>
                    <span className="font-medium">
                      {config.customDomain || 'app.aiguidedsaas.com'}
                    </span>
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