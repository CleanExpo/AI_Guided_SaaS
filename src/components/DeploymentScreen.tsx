'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectConfig, ProjectFile } from '@/types';
import { Rocket } from 'lucide-react';
interface DeploymentScreenProps { config: ProjectConfi
g,
  files: ProjectFile[]
};
export default function DeploymentScreen() {
  return (Card>, <CardHeader className="glass"
          
        <CardTitle className="flex items-center gap-2 glass
          <Rocket className="w-5 h-5 text-green-600"     />
          Deployment Dashboard
      <CardContent className="glass"
          
        <p className="text-gray-600">
          Deployment features for {config.name} coming soon...    }