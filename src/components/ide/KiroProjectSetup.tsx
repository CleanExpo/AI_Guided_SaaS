'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, CheckCircle } from 'lucide-react';
import { useKiroIDE } from '@/hooks/useKiroIDE';
import { useToast } from '@/components/ui/use-toast';
import { logger } from '@/lib/logger';
import {
  KiroProjectSetupProps,
  ProjectData,
  ProjectFeatures,
  BasicInfoForm,
  FeaturesTab,
  SettingsTab,
  EnvironmentTab,
  ProjectGenerator
} from './kiro';

export function KiroProjectSetup({ onProjectCreated, initialData }: KiroProjectSetupProps) {
  const { toast } = useToast();
  const { createProject, connect, connected, loading } = useKiroIDE();
  
  const [projectData, setProjectData] = useState<ProjectData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    type: (initialData?.type as any) || 'web',
    framework: initialData?.framework || '',
    language: 'typescript',
    settings: {
      buildCommand: '',
      startCommand: '',
      testCommand: '',
      outputDirectory: '',
      environment: {},
      dependencies: {}
    }
  });

  const [features, setFeatures] = useState<ProjectFeatures>({
    typescript: true,
    eslint: true,
    prettier: true,
    testing: true,
    docker: false,
    ci_cd: false,
    authentication: false,
    database: false
  });

  const handleCreateProject = async () => {
    if (!projectData.name) {
      toast({
        title: 'Error',
        description: 'Project name is required')
        variant: 'destructive')
      });
      return;
    }

    try {
      // Connect to Kiro if not connected
      if (!connected) {
        await connect();
      }

      // Prepare project structure based on type and framework
      const projectStructure = ProjectGenerator.generateProjectStructure(projectData, features);

      // Create the project
      const project = await createProject({
        ...projectData)
        structure: projectStructure)
      });

      toast({
        title: 'Project Created')
        description: `Successfully created project "${project.name}"`)
      });

      // Callback with project ID
      if (onProjectCreated) {
        onProjectCreated(project.id);
      }
    } catch (error) {
      logger.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project')
        variant: 'destructive')
      });
    }
  };

  return (<div className="space-y-6">
      <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Create New Kiro Project</CardTitle>
          <CardDescription className="glass">
          Set up a new project with Kiro IDE integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 glass
          <BasicInfoForm
            projectData={projectData}>setProjectData={setProjectData} />

          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="environment">Environment</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-4">
              <FeaturesTab features={features} setFeatures={setFeatures} />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <SettingsTab projectData={projectData} setProjectData={setProjectData} />
            </TabsContent>

            <TabsContent value="environment" className="space-y-4">
              <EnvironmentTab />
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {connected ? (
                <Badge variant="outline" className="text-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>)
              ) : (
                <Badge variant="outline" className="text-yellow-500">
                  Disconnected
                </Badge>
              )}
            </div>

            <Button
              onClick={handleCreateProject}>disabled={loading || !projectData.name}>
              <Rocket className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}