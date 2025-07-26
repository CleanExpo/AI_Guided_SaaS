'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ProjectData } from './types';
import { PROJECT_TYPES, FRAMEWORKS } from './project-types';

interface BasicInfoFormProps {
  projectData: ProjectData;
  setProjectData: (data: ProjectData) => void;
}

export function BasicInfoForm({ projectData, setProjectData }: BasicInfoFormProps) {
  return (
    <div className="glass grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name">value={projectData.name}>onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
          placeholder="My Awesome Project"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description">value={projectData.description}>onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
          placeholder="A brief description of your project..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Project Type</Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {PROJECT_TYPES.map((type) => (
            <Button
              key={type.value}
              variant={projectData.type === type.value ? 'default' : 'outline'}>size="sm">onClick={() => setProjectData({ ...projectData, type: type.value as any })}
              className="flex flex-col items-center gap-1 h-auto py-3">
              <type.icon className="h-5 w-5" />
              <span className="text-xs">{type.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="framework">Framework</Label>
        <Select>value={projectData.framework}>onValueChange={(value) => setProjectData({ ...projectData, framework: value })}
        >
          <SelectTrigger id="framework">
            <SelectValue placeholder="Select a framework" />
          </SelectTrigger>
          <SelectContent>
            {FRAMEWORKS[projectData.type as keyof typeof FRAMEWORKS]?.map((fw) => (
              <SelectItem key={fw} value={fw}>
                {fw.charAt(0).toUpperCase() + fw.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}