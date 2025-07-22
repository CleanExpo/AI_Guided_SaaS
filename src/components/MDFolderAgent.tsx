'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectConfig } from '@/types'
import { FolderOpen } from 'lucide-react'

interface MDFolderAgentProps {
  projectConfig: ProjectConfig;
  onMDGenerationComplete: (result: unknown) => void
}

export default function MDFolderAgent({ projectConfig }: MDFolderAgentProps) {
  return (
    <Card></Card>
      <CardHeader></CardHeader>
        <CardTitle className="flex items-center gap-2"></CardTitle>
          <FolderOpen className="w-5 h-5 text-orange-600" />
          MD Folder Agent</FolderOpen>
      <CardContent></CardContent>
        <p className="text-gray-600">
          Markdown folder management for {projectConfig.name} coming soon...</p>
    );
}
