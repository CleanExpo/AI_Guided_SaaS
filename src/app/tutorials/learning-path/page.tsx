'use client';
import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Lock, Play } from 'lucide-react';
interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
interface LearningPath {
  id: string;
  title: string;
  description: string;
  totalDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tutorials: Array<Tutorial & {
    completed?: boolean;
}
}>
}
const learningPaths: LearningPath[] = [
  {id: 'beginner',
    title: 'Complete Beginner Path',
    description: 'Perfect for developers new to AI-powered development platforms',
    totalDuration: '2 hours',
    difficulty: 'beginner',
    tutorials: [
      {
  id: '1',
        title: 'Introduction to AI Guided SaaS',
        description: 'Learn the basics of our platform',
        duration: '15 min',
        difficulty: 'beginner'
        completed: true}
  },
      {id: '2',
        title: 'Your First Project',
        description: 'Create and deploy your first application',
        duration: '30 min',
        difficulty: 'beginner'
        completed: false}
      },
      {id: '3',
        title: 'Understanding AI Features',
        description: 'Explore AI-powered code generation',
        duration: '45 min',
        difficulty: 'beginner'
        completed: false}
    ]
  },
  {id: 'intermediate',
    title: 'Intermediate Development',
    description: 'Advanced features and best practices',
    totalDuration: '4 hours',
    difficulty: 'intermediate',
    tutorials: [{
  id: '4',
        title: 'Advanced Project Configuration',
        description: 'Configure complex project settings',
        duration: '1 hour',
        difficulty: 'intermediate'
        completed: false}
},
      {id: '5',
        title: 'Team Collaboration',
        description: 'Work with teams effectively',
        duration: '45 min',
        difficulty: 'intermediate'
        completed: false}
    ]
}
];
export default function LearningPathPage() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const _getDifficultyColor = (difficulty: string) => 
  return (
    switch (difficulty) {
      case 'beginner':
    return 'bg-green-100 text-green-800';
    break;
      case 'intermediate':
    return 'bg-yellow-100 text-yellow-800';
    break;
      case 'advanced':
return 'bg-red-100 text-red-800',
    break
break}
    default: return 'bg-gray-100 text-gray-800'}
  const _getProgressPercentage = (path: LearningPath) => {const _completed = path.tutorials.filter((t) => t.completed).length
    return (completed 
               path.tutorials.length) * 100};
  return (
    <div className="min-h-screen bg-gray-50 py-8">;<
              div>
                    <div className="container mx-auto px-4 max-w-6xl mb-8"><
              div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Paths<
              h1>
                        <p className="text-gray-600">
            Structured learning journeys to master AI Guided SaaS development.
<
              p>
                      <div className="grid gap-6 lg:grid-cols-2">
          {learningPaths.map((path) => (\n    <
              div>}
                          <Card key={path.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between" >><
              div>
                                  <CardTitle className="text-xl mb-2">{path.title}<
              CardTitle>
                                  <p className="text-gray-600 mb-4">{path.description}<
              p>
                                  <div className="flex items-center gap-4">
                      <Badge className={`${getDifficultyColor(path.difficulty)} border-0`}>
                        {path.difficulty}
<
              Badge>
                                    <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" 
              >
                                      {path.totalDuration}
<
              div>
              <div className="text-right text-2xl font-bold text-blue-600">
                      {Math.round(getProgressPercentage(path))}%<
              div>
                                  <div className="text-sm text-gray-500">Complete      <
              div>
                            <CardContent>
                <div className="space-y-3 mb-6">
                  {path.tutorials.map((tutorial, index) => {
                    const _isCompleted = tutorial.completed;
                    const _isLocked = index > 0 && !path.tutorials[index - 1].completed
                    return (
    <
              div>
                  <div}
                        key={tutorial.id}
                        className={`flex items-center p-3 rounded border ${`
                          isCompleted ? 'bg-green-50 border-green-200' :
                          isLocked ? 'bg-gray-50 border-gray-200 opacity-50' :
                          'bg-white border-gray-200, hover:bg-gray-50'}
                        }`}`
                       className="flex-shrink-0 mr-3">
                          {isCompleted ? (<
              div>
                                          <CheckCircle className="h-5 w-5 text-green-600" 
              >
                                        ) : isLocked ? (
                            <Lock className="h-5 w-5 text-gray-400" 
              >
                                        ) : (
                            <Play className="h-5 w-5 text-blue-600" 
              >}
                                        )}
      <
              div>
                                      <div className="flex-1 font-medium text-gray-900">{tutorial.title}<
              div>
                                        <div className="text-sm text-gray-600">{tutorial.description}<
              div>
                                      <div className="text-sm text-gray-500">{tutorial.duration}<
              div>
                    )}
)}
      <
              div>
                              <Button
                  className="w-full"
                  onClick={() => setSelectedPath(path.id)}
                >
                  {getProgressPercentage(path) > 0 ? 'Continue Path' : 'Start Learning Path'}
<
              Button>
              <
              Card>
                        ))}
      <
              div>
              );
<
              div>
              <
              Tutorial>
                
    <
              CardContent>
                  <
              CardHeader>
                  <
              string>
                }