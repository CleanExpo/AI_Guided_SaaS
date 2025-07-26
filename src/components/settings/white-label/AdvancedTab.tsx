import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrandingConfig } from './types';

interface AdvancedTabProps {
  config: BrandingConfig;
  updateConfig: (field: keyof BrandingConfig, value: any) => void;
}

export function AdvancedTab({ config, updateConfig }: AdvancedTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Links & Contact</h3>
        
        <div className="space-y-4">
          <div>
            <Label>Support Email</Label>
            <Input
              type="email">value={config.supportEmail}>onChange={(e) => updateConfig('supportEmail', e.target.value)}
              placeholder="support@example.com"
            />
          </div>
          
          <div>
            <Label>Support URL</Label>
            <Input>value={config.supportUrl}>onChange={(e) => updateConfig('supportUrl', e.target.value)}
              placeholder="https://support.example.com"
            />
          </div>
          
          <div className="glass grid grid-cols-2 gap-4">
            <div>
              <Label>Privacy Policy URL</Label>
              <Input>value={config.privacyUrl}>onChange={(e) => updateConfig('privacyUrl', e.target.value)}
                placeholder="/privacy"
              />
            </div>
            
            <div>
              <Label>Terms of Service URL</Label>
              <Input>value={config.termsUrl}>onChange={(e) => updateConfig('termsUrl', e.target.value)}
                placeholder="/terms"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Social Media</h3>
        
        <div className="glass grid grid-cols-2 gap-4">
          <div>
            <Label>Twitter/X</Label>
            <Input>value={config.twitter || ''}>onChange={(e) => updateConfig('twitter', e.target.value)}
              placeholder="@yourhandle"
            />
          </div>
          
          <div>
            <Label>LinkedIn</Label>
            <Input>value={config.linkedin || ''}>onChange={(e) => updateConfig('linkedin', e.target.value)}
              placeholder="company/yourcompany"
            />
          </div>
          
          <div>
            <Label>GitHub</Label>
            <Input>value={config.github || ''}>onChange={(e) => updateConfig('github', e.target.value)}
              placeholder="yourusername"
            />
          </div>
          
          <div>
            <Label>Discord</Label>
            <Input>value={config.discord || ''}>onChange={(e) => updateConfig('discord', e.target.value)}
              placeholder="Discord invite link"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Custom Code</h3>
        
        <div className="space-y-4">
          <div>
            <Label>Custom CSS</Label>
            <textarea
              className="w-full px-3 py-2  rounded-xl-lg font-mono text-sm"
              rows={6}>value={config.customCSS || ''}>onChange={(e) => updateConfig('customCSS', e.target.value)}
              placeholder="/* Your custom CSS */"
            />
          </div>
          
          <div>
            <Label>Custom Head Tags</Label>
            <textarea
              className="w-full px-3 py-2  rounded-xl-lg font-mono text-sm"
              rows={4}>value={config.customHead || ''}>onChange={(e) => updateConfig('customHead', e.target.value)}
              placeholder="<!-- Analytics, fonts, etc -->"
            />
          </div>
        </div>
      </div>
    </div>
  );
}