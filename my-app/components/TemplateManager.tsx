'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectConfig, ProjectFile } from '@/types'
import { Files } from 'lucide-react'

interface TemplateManagerProps {
  currentConfig: ProjectConfig
  currentFiles: ProjectFile[]
  onLoadTemplate: (config: ProjectConfig, files: ProjectFile[]) => void
}

export default function TemplateManager({ currentConfig }: TemplateManagerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Files className="w-5 h-5 text-indigo-600" />
          Template Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Template management for {currentConfig.name} coming soon...
        </p>
      </CardContent>
    </Card>
  )
}
