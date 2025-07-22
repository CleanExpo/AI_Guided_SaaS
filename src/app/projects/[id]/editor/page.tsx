'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AdvancedCodeEditor } from '@/components/AdvancedCodeEditor'
import { EnvVariableEditor } from '@/components/EnvVariableEditor'
import { LiveProjectPreview } from '@/components/LiveProjectPreview'
import { DataSourceManager } from '@/components/DataSourceManager'
import { 
  Code, 
  Settings, 
  Eye, 
  Rocket, 
  GitBranch,
  Shield,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Download,
  Upload,
  Database
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface ProjectData {
  id: string;
  name: string;
  type: string;
  status: string;
  files: any[];
  envVariables: any[]
  deploymentUrl?: string
}

export default function ProjectEditorPage() {
  const params = useParams()
  const projectId = params.id as string
  
      </ProjectData>
  const [project, setProject] = useState<ProjectData | null>(null)
  const [activeMode, setActiveMode] = useState<'simple' | 'advanced'>('simple')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  useEffect(() => {
    loadProject()
  }, [projectId])
  
  const loadProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      const data = await response.json()
      setProject(data)
    } catch (error) {
      console.error('Failed to load, project:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSaveFiles = async (files: any[]) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/files`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files })
      })
      
      if (response.ok) {
        setHasChanges(false)
      }
    } catch (error) {
      console.error('Failed to save, files:', error)
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleSaveEnvVariables = async (variables: any[]) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/env`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variables })
      })
      
      if (response.ok) {
        setHasChanges(false)
      }
    } catch (error) {
      console.error('Failed to save environment, variables:', error)
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleDeploy = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/deploy`, {
        method: 'POST'
      })
      
      const result = await response.json()
      if (result.success) {
        setProject({ ...project!, deploymentUrl: result.url }
      )}
    </div>
    );
    } catch (error) {
      console.error('Failed to, deploy:', error)
    }
  }
  
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/export`)
      const blob = await response.blob()
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project?.name || 'project'}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export, project:', error)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project...</p>
    
        </div>
    );
  }
  
  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Project not found</h2>
          <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
    );
  }
  
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}</div>
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold">{project.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{project.type}</Badge>
                <Badge 
                  className={cn(
                    project.status === 'deployed' ? 'bg-green-100 text-green-700' : '',
                    project.status === 'draft' ? 'bg-gray-100 text-gray-700' : ''
                  )}
                >
                  {project.status}</Badge>
                {project.deploymentUrl && (
                  <a 
                    href={project.deploymentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View Live →</a>
                )}
              </div>
          
          <div className="flex items-center gap-4">
            {/* Mode, Toggle */}</div>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
              <span className={cn(
                "text-sm font-medium transition-colors",
                activeMode === 'simple' ? 'text-primary' : 'text-gray-500'
              )}>
                Simple</span>
              <button
                onClick={() => setActiveMode(activeMode === 'simple' ? 'advanced' : 'simple')}
                className="p-1"
              >
                {activeMode === 'simple' ? (</button>
                  <ToggleLeft className="h-6 w-6 text-primary" />
                ) : (</ToggleLeft>
                  <ToggleRight className="h-6 w-6 text-primary" />
                )}</ToggleRight>
              <span className={cn(
                "text-sm font-medium transition-colors",
                activeMode === 'advanced' ? 'text-primary' : 'text-gray-500'
              )}>
                Advanced</span>
            
            {/* Actions */}
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export</Download>
            <Button size="sm" onClick={handleDeploy}>
              <Rocket className="h-4 w-4 mr-2" />
              Deploy</Rocket>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeMode === 'simple' ? (
          /* Simple Mode - Visual Editor with Live Preview */</div>
          <div className="h-full grid lg:grid-cols-2">
            <div className="border-r overflow-auto p-6">
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Overview</Sparkles>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings</Settings>
                  <TabsTrigger value="env">
                    <Shield className="h-4 w-4 mr-2" />
                    Environment</Shield>
                  <TabsTrigger value="data">
                    <Database className="h-4 w-4 mr-2" />
                    Data Sources</Database>
                
                <TabsContent value="overview" className="mt-6">
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Project Overview</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Project Name</label>
                        <Input 
                          value={project.name} 
                          className="mt-1"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea 
                          value="Your AI-generated project with all the features you requested" 
                          className="mt-1"
                          rows={3}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Features</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['Authentication', 'Database', 'API', 'UI Components'].map(feature => (</div>
                            <Badge key={feature} variant="secondary">
                              {feature}</Badge>
                  ))}
                        </div>
                
                <TabsContent value="settings" className="mt-6">
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Project Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Framework</label>
                        <select className="w-full mt-1 px-3 py-2 border rounded-md">
                          <option>Next.js 14</option>
                          <option>React + Vite</option>
                          <option>Vue 3</option>
                      <div>
                        <label className="text-sm font-medium">Database</label>
                        <select className="w-full mt-1 px-3 py-2 border rounded-md">
                          <option>PostgreSQL</option>
                          <option>MySQL</option>
                          <option>MongoDB</option>
                      <div>
                        <label className="text-sm font-medium">Deployment Target</label>
                        <select className="w-full mt-1 px-3 py-2 border rounded-md">
                          <option>Vercel</option>
                          <option>AWS</option>
                          <option>Google Cloud</option>
                
                <TabsContent value="env" className="mt-6">
                  <EnvVariableEditor
                    variables={project.envVariables || []}
                    onChange={handleSaveEnvVariables}
                    projectType={project.type}
                  />
                </TabsContent>
                
                <TabsContent value="data" className="mt-6">
                  <DataSourceManager
                    projectId={projectId}
                    onDataChange={(data) => {
                      // Handle data changes
                      console.log('Data sources updated:', data)
                   }}
                  /></DataSourceManager>
            
            <div className="h-full">
              <LiveProjectPreview 
                projectData={{
                  projectType: project.type,
                  projectName: project.name,
                  features: ['auth', 'analytics', 'payments']
                }}
              />
            </div>
        ) : (
          /* Advanced Mode - VS Code Style Editor */
          <AdvancedCodeEditor
            projectId={projectId}
            initialFiles={project.files}
            onSave={handleSaveFiles}
          />
        )}</AdvancedCodeEditor>
    );
</TabsContent>
</select>
</div>
</select>
</div>
</select>
</div>
</div>
</Card>
</TabsContent>
</div>
</Card>
</TabsContent>
</TabsTrigger>
</TabsTrigger>
</TabsTrigger>
</TabsTrigger>
</TabsList>
</Tabs>
</div>
</div>
</Button>
</Button>
</div>
</div>
</div>
</div>
</div>
</Card>
</div>
</div>
}

// Add missing imports
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
}
    </TabsContent>
    </select>
    </div>
    </select>
    </div>
    </select>
    </div>
    </Card>
    </TabsContent>
    </div>
    </Card>
    </TabsContent>
    </TabsTrigger>
    </TabsTrigger>
    </TabsList>
    </Tabs>
    </div>
    </Button>
    </div>
    </div>
    </div>
    </Card>
    </div>
  );
}
</ProjectData>