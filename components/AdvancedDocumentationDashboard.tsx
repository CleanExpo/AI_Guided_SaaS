'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectConfig } from '@/types'
import { BookOpen } from 'lucide-react'

interface AdvancedDocumentationDashboardProps {
  projectConfig: ProjectConfig
  onDocumentationComplete: (result: unknown) => void
}

export default function AdvancedDocumentationDashboard({ projectConfig }: AdvancedDocumentationDashboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-green-600" />
          Advanced Documentation Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Advanced documentation features for {projectConfig.name} coming soon...
        </p>
      </CardContent>
    </Card>
  )
}
