'use client';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ProjectData } from './types';

interface SettingsTabProps {
  projectData: ProjectData;
  setProjectData: (data: ProjectData) => void;
}

export function SettingsTab({ projectData, setProjectData }: SettingsTabProps) {
  const updateSettings = (field: string, value: string) => {
    setProjectData({
      ...projectData,
      settings: {
        ...projectData.settings,
        [field]: value
      }
    });
  };

  return (
    <div className="glass grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="buildCommand">Build Command</Label>
        <Input
          id="buildCommand">value={projectData.settings.buildCommand}>onChange={(e) => updateSettings('buildCommand', e.target.value)}
          placeholder="npm run build"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startCommand">Start Command</Label>
        <Input
          id="startCommand">value={projectData.settings.startCommand}>onChange={(e) => updateSettings('startCommand', e.target.value)}
          placeholder="npm run dev"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="testCommand">Test Command</Label>
        <Input
          id="testCommand">value={projectData.settings.testCommand}>onChange={(e) => updateSettings('testCommand', e.target.value)}
          placeholder="npm test"
        />
      </div>
    </div>
  );
}