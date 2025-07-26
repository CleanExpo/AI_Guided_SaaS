import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image } from 'lucide-react';
import { BrandingConfig, fontOptions } from './types';

interface BrandingTabProps {
  config: BrandingConfig;
  updateConfig: (field: keyof BrandingConfig, value: any) => void;
}

export function BrandingTab({ config, updateConfig }: BrandingTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Brand Identity</h3>
        
        <div className="space-y-4">
          <div>
            <Label>Company Name</Label>
            <Input>value={config.companyName}>onChange={(e) => updateConfig('companyName', e.target.value)}
              placeholder="Your Company Name"
            />
          </div>
          
          <div>
            <Label>Tagline</Label>
            <Input>value={config.tagline}>onChange={(e) => updateConfig('tagline', e.target.value)}
              placeholder="Your inspiring tagline"
            />
          </div>
          
          <div>
            <Label>Description</Label>
            <textarea
              className="w-full px-3 py-2  rounded-xl-lg"
              rows={3}>value={config.description}>onChange={(e) => updateConfig('description', e.target.value)}
              placeholder="Brief description of your platform"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Logo & Favicon</h3>
        
        <div className="glass grid grid-cols-2 gap-4">
          <div>
            <Label>Logo</Label>
            <div className="glass mt-2 -2 -dashed rounded-xl-lg p-6 text-center">
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
            <div className="glass mt-2 -2 -dashed rounded-xl-lg p-6 text-center">
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
        
        <div className="glass grid grid-cols-2 gap-4">
          <div>
            <Label>Header Font</Label>
            <select
              className="w-full px-3 py-2  rounded-xl-lg">value={config.headerFont}>onChange={(e) => updateConfig('headerFont', e.target.value)}
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          
          <div>
            <Label>Body Font</Label>
            <select
              className="w-full px-3 py-2  rounded-xl-lg">value={config.bodyFont}>onChange={(e) => updateConfig('bodyFont', e.target.value)}
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}