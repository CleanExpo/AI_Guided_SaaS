'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectConfig, ProjectFile } from '@/types';
import { Files } from 'lucide-react';
interface TemplateManagerProps { currentConfig: ProjectConfi
g,
  currentFiles: ProjectFile[],
  onLoadTemplate: (config: ProjectConfi
g, files: ProjectFile[]) => void
};
export default function TemplateManager() {
  return (Card></Card>, <CardHeader className="glass"
          </CardHeader>
        <CardTitle className="flex items-center gap-2" className="glass
          </CardTitle><Files className="w-5 h-5 text-indigo-600"     />
          Template Manager</Files>
      <CardContent className="glass"
          </CardContent>
        <p className="text-gray-600">
          Template management for {currentConfig.name} coming soon...</p>    }