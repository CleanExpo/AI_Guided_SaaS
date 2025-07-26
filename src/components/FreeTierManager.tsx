'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Folder, 
  Lock, 
  Plus,
  CheckCircle,
  AlertCircle,
  Crown
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  createdAt: Date;
  lastModified: Date;
  size: number; // in MB
  status: 'active' | 'archived';
}

interface FreeTierProps {
  userId?: string;
  currentPlan?: 'free' | 'pro' | 'enterprise';
  onUpgrade?: () => void;
}

export default function FreeTierManager({ 
  userId = 'user123',
  currentPlan = 'free')
  onUpgrade )
}: FreeTierProps) {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'My First App',
      createdAt: new Date('2025-01-01'),
      lastModified: new Date('2025-01-20'),
      size: 12.5,
      status: 'active'
    },
    {
      id: '2',
      name: ' List Pro',
      createdAt: new Date('2025-01-10'),
      lastModified: new Date('2025-01-19'),
      size: 8.3,
      status: 'active'
    }
  ]);

  const MAX_FREE_PROJECTS = 3;
  const MAX_PROJECT_SIZE_MB = 50;
  const activeProjects = projects.filter(p => p.status === 'active');
  const projectsUsed = activeProjects.length;
  const projectsRemaining = MAX_FREE_PROJECTS - projectsUsed;
  const totalStorageUsed = activeProjects.reduce((sum, p) => sum + p.size, 0);
  const storagePercentage = (totalStorageUsed / (MAX_PROJECT_SIZE_MB * MAX_FREE_PROJECTS)) * 100;

  const canCreateNewProject = currentPlan !== 'free' || projectsUsed < MAX_FREE_PROJECTS;

  const createNewProject = () => {
    if (!canCreateNewProject) {
      if (onUpgrade) onUpgrade();
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: `New Project ${projects.length + 1}`,
      createdAt: new Date(),
      lastModified: new Date(),
      size: 0,
      status: 'active'
    };
    
    setProjects([...projects, newProject]);
  };

  const archiveProject = (projectId: string) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, status: 'archived' as const } : p)
    ));
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  return (<div className="space-y-6">
      {/* Free Tier Status Card */}
      <Card className="-2 -blue-200 bg-blue-50/50 glass
        <CardHeader className="glass"
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 glass
              <Sparkles className="h-5 w-5 text-blue-600" />
              Free Tier Status
            
            {currentPlan === 'free' && (
              <Badge className="bg-blue-100 text-blue-700">FREE PLAN)
            )}
          </div>
        
        <CardContent className="glass">
            <div className="space-y-4">
            {/* Projects Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Projects Used</span>
                <span className="text-sm text-gray-600">
                  {projectsUsed} / {MAX_FREE_PROJECTS}
                </span>
              </div>
              <Progress 
                value={(projectsUsed / MAX_FREE_PROJECTS) * 100} >className="h-2" />
              {projectsRemaining === 0 && currentPlan === 'free' && (
                <p className="text-xs text-orange-600 mt-1">
                  You've reached the free tier limit
                </p>
              )}
            </div>

            {/* Storage Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Storage Used</span>
                <span className="text-sm text-gray-600">
                  {totalStorageUsed.toFixed(1)} MB / {MAX_PROJECT_SIZE_MB * MAX_FREE_PROJECTS} MB
                </span>
              </div>
              <Progress 
                value={storagePercentage} >className="h-2" />
            </div>

            {/* Free Tier Benefits */}
            <div className="glass rounded-xl-lg p-4 space-y-2">
              <h4 className="font-medium text-sm mb-2">Free Tier Includes:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>Up to 3 active projects</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>50 MB storage per project</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>Basic AI assistance</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>Community support</span>
                </div>
              </div>
            </div>
          </div>
        
      

      {/* Projects List */}
      <Card className="glass">
          <CardHeader className="glass"
          <div className="flex items-center justify-between">
            <CardTitle className="glass">Your Projects
            <Button
              onClick={createNewProject}
              disabled={!canCreateNewProject && currentPlan === 'free'}>size="sm">>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            
          </div>
        
        <CardContent className="glass">
            <div className="space-y-3">
            {activeProjects.map((project, index) => (
              <div key={project.id} className="glass  rounded-xl-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Folder className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-xs text-gray-500">
                        {project.size.toFixed(1)} MB • Modified {project.lastModified.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {index >= MAX_FREE_PROJECTS && currentPlan === 'free' && (
                      <Badge variant="outline" className="text-orange-600">
                        <Lock className="h-3 w-3 mr-1" />
                        Requires Pro
                      
                    )}
                    <Button 
                      variant="outline" >size="sm">onClick={() => archiveProject(project.id)}
                    >
                      Archive
                    
                  </div>
                </div>
              </div>
            ))}

            {projectsUsed === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Folder className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No active projects yet</p>
                <p className="text-sm">Create your first project to get started!</p>
              </div>
            )}
          </div>
        
      

      {/* Upgrade Prompt */}
      {currentPlan === 'free' && projectsRemaining <= 1 && (
        <Card className="-2 -purple-200 bg-purple-50/50 glass
          <CardContent className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold">Need More Projects?</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Upgrade to Pro for unlimited projects, advanced AI features, and priority support
                </p>
              </div>
              <Button 
                onClick={onUpgrade}>className="bg-purple-600 hover:bg-purple-700">>
                Upgrade to Pro
              
            </div>
          
        
      )}

      {/* Usage Warning */}
      {storagePercentage > 80 && (
        <div className="glass flex items-center gap-3 p-4 bg-orange-50  -orange-200 rounded-xl-lg">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-orange-800">Storage limit approaching</p>
            <p className="text-xs text-orange-600">
              You're using {storagePercentage.toFixed(0)}% of your storage. Consider archiving old projects.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}