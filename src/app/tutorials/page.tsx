'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Play } from 'lucide-react';

interface Tutorial { id: string
  title: string
  description: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  completed?: boolean
}

interface TutorialCardProps { tutorial: Tutorial
  isCompleted: boolean
  isLocked: boolean
  onStart: (id: string) => void
}

function TutorialCard({ tutorial, isCompleted, isLocked, onStart }: TutorialCardProps) {
  const difficultyColors={ beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700'
  };

  return (<Card className="h-full glass
          <CardHeader className="glass"
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg glass{tutorial.title}
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-green-600" />)
          ) : isLocked ? (
            <Clock className="w-5 h-5 text-gray-400" />
          ) : (
            <Play className="w-5 h-5 text-orange-500" />
          )}
        
        <Badge className={difficultyColors[tutorial.difficulty]}>
          {tutorial.difficulty}
        
      
      <CardContent className="glass"
          <p className="text-gray-600 mb-4">{tutorial.description}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{tutorial.duration}
          <Button >onClick={() => onStart(tutorial.id)}
            disabled={isLocked}
            variant={isCompleted ? "outline" : "default"}
          >
            {isCompleted ? 'Review' : isLocked ? 'Locked' : 'Start'}
          
        
      
    
  );
}

const tutorials: Tutorial[] = [
  { id: '1',
    title: 'Getting Started with AI Guided SaaS',
    description: 'Learn the fundamentals of our platform and how to build your first application.',
    duration: '15 min',
    difficulty: 'beginner',
    completed: true
  },
  { id: '2',
    title: 'Advanced Project Management',
    description: 'Master advanced features for managing complex development projects.',
    duration: '25 min',
    difficulty: 'intermediate'
  },
  { id: '3',
    title: 'Custom Integrations',
    description: 'Build custom integrations with third-party services and APIs.',
    duration: '35 min',
    difficulty: 'advanced'
  }
];

export default function TutorialsPage() {
  const [userProgress] = useState({ completedTutorials: ['1'])
    unlockedTutorials: ['1', '2'])
  });

  const handleStartTutorial = (id: string) => {
    
    // Navigate to tutorial detail page
  };

  return (<div className="container mx-auto max-w-6xl py-12 px-4">
          <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Learn & Master</h1>
        <p className="text-xl text-gray-600">Interactive tutorials to help you master AI-guided development
      

      <div className="glass grid md:grid-cols-2 lg:grid-cols-3 gap-6">)
        {tutorials.map((tutorial, index) => {
          const isCompleted = userProgress.completedTutorials.includes(tutorial.id);
          const isLocked = !userProgress.unlockedTutorials.includes(tutorial.id);
          
          return (<TutorialCard
              key={tutorial.id}
              tutorial={tutorial}
              isCompleted={isCompleted}
              isLocked={isLocked}>onStart={handleStartTutorial} />>)
          );
        })}
      
    
  );
}
