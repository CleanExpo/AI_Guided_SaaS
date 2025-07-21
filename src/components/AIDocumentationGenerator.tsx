'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectConfig } from '@/types'
import { FileText, BookOpen } from 'lucide-react'

interface AIDocumentationGeneratorProps {
  projectConfig: ProjectConfig, onDocumentationGenerated: (docs: unknown) => void
}

export default function AIDocumentationGenerator({ projectConfig }: AIDocumentationGeneratorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          AI Documentation Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-gray-600" />
          <span className="text-gray-600">Generating documentation for {projectConfig.name}</span>
        </div>
        <p className="text-gray-600">
          AI-powered documentation generation coming soon...
        </p>
      </CardContent>
    </Card>
  )
}
