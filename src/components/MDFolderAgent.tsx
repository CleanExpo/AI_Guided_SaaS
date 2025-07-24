'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectConfig } from '@/types';
import { FolderOpen } from 'lucide-react';
interface MDFolderAgentProps { projectConfig: ProjectConfi
g,
  onMDGenerationComplete: (result: unknown: any) => void
};
export default function MDFolderAgent() {
  return (Card></Card>, <CardHeader>
          </CardHeader>
        <CardTitle className="flex items-center gap-2">
          </CardTitle><FolderOpen className="w-5 h-5 text-orange-600"     />
          MD Folder Agent</FolderOpen>
      <CardContent>
          </CardContent>
        <p className="text-gray-600">
          Markdown folder management for {projectConfig.name} coming soon...</p>

})