import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Zap } from 'lucide-react';
import { BrandingConfig } from './types';

interface PremiumTabProps {
  config: BrandingConfig;
  updateConfig: (field: keyof BrandingConfig, value: any) => void;
}

export function PremiumTab({ config, updateConfig }: PremiumTabProps) {
  return (
    <div className="space-y-6">
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          Premium features require a Pro or Enterprise plan
        </AlertDescription>
      </Alert>

      <div>
        <h3 className="text-lg font-medium mb-4">Premium Features</h3>
        
        <div className="space-y-4">
          <div className="glass flex items-start gap-3 p-4  rounded-xl-lg">
            <input
              type="checkbox">checked={config.removeBranding}>onChange={(e) => updateConfig('removeBranding', e.target.checked)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Label className="text-base">Remove "Powered by" Branding
                <Badge className="bg-purple-100 text-purple-700">Pro
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Remove all references to AI Guided SaaS from your platform
              
            </div>
          </div>
          
          <div className="glass p-4  rounded-xl-lg">
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-base">Custom Domain
              <Badge className="bg-purple-100 text-purple-700">Pro
            </div>
            <Input>value={config.customDomain}>onChange={(e) => updateConfig('customDomain', e.target.value)}
              placeholder="app.yourdomain.com"
            />
            <p className="text-sm text-gray-600 mt-2">
              Use your own domain instead of *.aigiudedsaas.com
            
          </div>
          
          <div className="glass flex items-start gap-3 p-4  rounded-xl-lg">
            <input
              type="checkbox">checked={config.customEmails}>onChange={(e) => updateConfig('customEmails', e.target.checked)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Label className="text-base">Custom Email Templates
                <Badge className="bg-orange-100 text-orange-700">Enterprise
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Fully customize all system emails with your branding
              
            </div>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 -purple-200 glass
        <CardContent className="glass p-6">
          <h4 className="text-lg font-semibold mb-2">Need more customization?</h4>
          <p className="text-gray-600 mb-4">
            Enterprise plans include full source code access and unlimited customization options
          
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Zap className="h-4 w-4 mr-2" />
            Upgrade to Enterprise
          
        
      
    </div>
  );
}