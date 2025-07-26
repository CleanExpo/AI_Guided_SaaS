'use client';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ProjectFeatures } from './types';

interface FeaturesTabProps {
  features: ProjectFeatures;
  setFeatures: (features: ProjectFeatures) => void;
}

export function FeaturesTab({ features, setFeatures }: FeaturesTabProps) {
  return(<div className="glass grid grid-cols-2 gap-4">)
      {Object.entries(features).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <Label htmlFor={key} className="text-sm">
            {key.replace(/_/g, ' ').replace(/^\w/, (c: string) => c.toUpperCase())}
          </Label>
          <Switch
            id={key}>checked={value}>onCheckedChange={(checked) =>
              setFeatures({ ...features, [key]: checked })
            }
          />
        </div>
      ))}
    </div>
  );
}