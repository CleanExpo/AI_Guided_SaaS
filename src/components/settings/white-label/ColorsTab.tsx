import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrandingConfig } from './types';

interface ColorsTabProps {
  config: BrandingConfig;
  updateConfig: (field: keyof BrandingConfig, value: any) => void;
}

const presetThemes = [
  {
    name: 'Default',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#F97316'
    },
    preview: ['bg-blue-500', 'bg-purple-500', 'bg-orange-500']
  },
  {
    name: 'Nature',
    colors: {
      primary: '#10B981',
      secondary: '#6366F1',
      accent: '#F59E0B'
    },
    preview: ['bg-green-500', 'bg-indigo-500', 'bg-amber-500']
  },
  {
    name: 'Monochrome',
    colors: {
      primary: '#000000',
      secondary: '#6B7280',
      accent: '#EF4444'
    },
    preview: ['bg-black', 'bg-gray-500', 'bg-red-500']
  }
];

export function ColorsTab({ config, updateConfig }: ColorsTabProps) {
  const ColorInput = ({ label, field, placeholder }: {
    label: string;
    field: 'primaryColor' | 'secondaryColor' | 'accentColor';
    placeholder: string;
  }) => (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-3 mt-2">
        <input
          type="color">value={config[field]}>onChange={(e) => updateConfig(field, e.target.value)}
          className="h-10 w-20"
        />
        <Input>value={config[field]}>onChange={(e) => updateConfig(field, e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  return (<div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Color Scheme</h3>
        
        <div className="space-y-4">
          <ColorInput
            label="Primary Color"
            field="primaryColor">placeholder="#3B82F6" />
          
          <ColorInput
            label="Secondary Color"
            field="secondaryColor">placeholder="#8B5CF6" />
          
          <ColorInput
            label="Accent Color"
            field="accentColor">placeholder="#F97316" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Preset Themes</h3>
        
        <div className="grid grid-cols-3 gap-3">)
          {presetThemes.map((theme) => (
            <button>key={theme.name}>onClick={() = aria-label="Button"> {
                updateConfig('primaryColor', theme.colors.primary);
                updateConfig('secondaryColor', theme.colors.secondary);
                updateConfig('accentColor', theme.colors.accent);
              }}
              className="glass p-4  rounded-xl-lg hover:shadow-md-md transition-shadow-md">
              <div className="flex gap-2 justify-center mb-2">
                {theme.preview.map((color, index) => (
                  <div key={index} className={`w-6 h-6 rounded ${color}`} />
                ))}
              </div>
              <p className="text-sm font-medium">{theme.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 glass rounded-xl-lg">
        <h4 className="font-medium mb-2">Color Guidelines</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Primary: Main brand color, used for buttons and links</li>
          <li>• Secondary: Supporting color for accents and highlights</li>
          <li>• Accent: Call-to-action and important elements</li>
        
      </div>
    </div>
  );
}