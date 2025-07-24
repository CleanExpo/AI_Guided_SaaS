'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock, Play } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed?: boolean;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  tutorials: Tutorial[];
}

const learningPaths: LearningPath[] = [
  {
    id: 'beginner',
    title: 'Getting Started',
    description: 'Perfect for newcomers to AI-guided development',
    tutorials: [
      {
        id: '1',
        title: 'Platform Overview',
        description: 'Learn the basics of AI Guided SaaS',
        duration: '10 min',
        difficulty: 'beginner',
        completed: true
      },
      {
        id: '2',
        title: 'Your First Project',
        description: 'Create your first AI-powered application',
        duration: '20 min',
        difficulty: 'beginner'
      }
    ]
  },
  {
    id: 'intermediate',
    title: 'Advanced Features',
    description: 'Deep dive into powerful development tools',
    tutorials: [
      {
        id: '3',
        title: 'Advanced Configuration',
        description: 'Customize your development environment',
        duration: '30 min',
        difficulty: 'intermediate'
      }
    ]
  }
];

export default function LearningPathPage() {
  const [selectedPath, setSelectedPath] = useState<string>('beginner');
  
  const currentPath = learningPaths.find(path => path.id === selectedPath);

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Learning Paths</h1>
        <p className="text-xl text-gray-600">Structured learning journeys to master AI-guided development</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="space-y-4">
            {learningPaths.map((path) => (
              <Card 
                key={path.id} 
                className={selectedPath === path.id ? 'ring-2 ring-orange-500' : ''}
              >
                <CardHeader className="cursor-pointer" onClick={() => setSelectedPath(path.id)}>
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <p className="text-sm text-gray-600">{path.description}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          {currentPath && (
            <Card>
              <CardHeader>
                <CardTitle>{currentPath.title}</CardTitle>
                <p className="text-gray-600">{currentPath.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentPath.tutorials.map((tutorial, index) => (
                    <div key={tutorial.id} className="flex items-center p-4 border rounded-lg">
                      <div className="mr-4">
                        {tutorial.completed ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : index === 0 || currentPath.tutorials[index - 1]?.completed ? (
                          <Play className="w-6 h-6 text-orange-500" />
                        ) : (
                          <Lock className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{tutorial.title}</h3>
                        <p className="text-sm text-gray-600">{tutorial.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{tutorial.duration}</Badge>
                          <Badge variant="outline">{tutorial.difficulty}</Badge>
                        </div>
                      </div>
                      <Button 
                        disabled={!tutorial.completed && index > 0 && !currentPath.tutorials[index - 1]?.completed}
                        className="ml-4"
                      >
                        {tutorial.completed ? 'Review' : 'Start'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
