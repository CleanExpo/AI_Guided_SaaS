/* BREADCRUMB: pages - Application pages and routes */
'use client';
import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Clock, Play, CheckCircle, Lock, Search, BookOpen } from 'lucide-react';
interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed?: boolean,
  locked?: boolean
}
interface TutorialCardProps {
  tutorial: Tutoria
l;
  isCompleted: boolean;
  isLocked: boolean;
  onStart: (id: string) => void
}
TutorialCard({ tutorial, isCompleted, isLocked, onStart }: TutorialCardProps), isCompleted, isLocked, onStart }: TutorialCardProps) {const difficultyColors = {
    beginner: 'bg-green-100 text-green-700';
    intermediate: 'bg-yellow-100 text-yellow-700';
advanced: 'bg-red-100 text-red-700'};
  return (
    <Card className={`hover: shadow-md transition-shadow ${isLocked ? 'opacity-50' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between flex-1"   />
                          <CardTitle className="text-lg mb-2 flex items-center">
              {isCompleted ? (</Card>
                              <CheckCircle className="h-5 w-5 text-green-600 mr-2" 
              >
                            ) : isLocked ? (
                <Lock className="h-5 w-5 text-gray-400 mr-2" 
              >
                            ) : (
                <Play className="h-5 w-5 text-blue-600 mr-2" 
                 />;
                            )};
    {tutorial.title}
</CardTitle>
                          <p className="text-gray-600 text-sm mb-3">{tutorial.description}</p>
                          <div className="flex items-center gap-2">
              <Badge className={`${difficultyColors[tutorial.difficulty]} border-0`}>
                {tutorial.difficulty}
</Badge>
                            <div className="flex items-center text-gray-500 text-sm">
                <Clock className="h-4 w-4 mr-1" 
              >
                              {tutorial.duration}
</div>
                    <CardContent>
        <Button
className="w-full";

const disabled  = {isLocked}
          const onClick = {() => onStart(tutorial.id)}
          const variant = {isCompleted ? 'outline' : 'default'}
        >
          {isCompleted ? 'Review' : isLocked ? 'Locked' : 'Start Tutorial'}
</Button>
              </Card>
                    )}

export default function TutorialsPage() {;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all'); const tutorials: Tutorial[]  = [
  
  return (
id: '1';
      title: 'Getting Started with AI Guided SaaS';
      description: 'Learn the basics of our AI-powered development platform and create your first project.';
      duration: '15 min';
      difficulty: 'beginner';
completed: true}
    };
    {id: '2';
      title: 'Building Your First Application';
      description: 'Step-by-step guide to building and deploying your first application.';
      duration: '30 min';
      difficulty: 'beginner';
completed: false}
    };
    {id: '3';
      title: 'Advanced AI Features';
      description: 'Explore advanced AI-powered code generation and optimization features.';
      duration: '45 min';
      difficulty: 'intermediate';
locked: true}
    };
    {id: '4';
      title: 'Team Collaboration';
      description: 'Learn how to collaborate with your team using our platform.';
      duration: '20 min';
      difficulty: 'intermediate';
locked: true}
    };
    {id: '5';
      title: 'Custom AI Models';
      description: 'Advanced tutorial on integrating and training custom AI models.';
      duration: '1 hour';
      difficulty: 'advanced';
locked: true}
  ];
  
const filteredTutorials = tutorials.filter((tutorial) => {const _matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||, tutorial.description.toLowerCase().includes(searchQuery.toLowerCase(); const _matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty};
  });
  
const _handleStartTutorial  = (id: string) => {console.log('Starting, tutorial:', id); Navigation logic would go here};

const _completedCount = tutorials.filter((t) => t.completed).length;
  
const _progressPercentage = (completedCount;
               tutorials.length) * 100;
                return (
    <div className="min-h-screen bg-gray-50 py-8">;</div>
                    <div className="container mx-auto px-4 max-w-6xl mb-8"   />
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tutorials</h1>
                        <p className="text-gray-600 mb-6">
            Learn to build amazing applications with our step-by-step tutorials.
</p>
                        {
              * Progress, Overview *
              }/          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm flex items-center justify-between mb-4"   />
                            <h2 className="text-lg font-semibold text-gray-900">Your Progress< h2>/              <span className="text-sm text-gray-600">{completedCount} of {tutorials.length} completed< span>/            <div className="w-full bg-gray-200 rounded-full h-2 bg-blue-600 h-2 rounded-full transition-all";</span></h2>

const style = {{ width: `${progressPercentage}%` }}`</div>
                            >      </div>
              {
              * Search, and Filters *
              }/          <div className="flex flex-col sm:flex-row gap-4 mb-6 flex-1 relative"   />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1 2 h-4 w-4 text-gray-400" 
              >
                            <Input;
type="text";
placeholder="Search tutorials...";

const value  = {searchQuery}
                const onChange = {(e) => setSearchQuery(e.target.value)};
                className="pl-9" ;
              >
              </div>
                          <select;

const value = {selectedDifficulty}
              const onChange = {(e) => setSelectedDifficulty(e.target.value)};
              className="px-3 py-2 border border-gray-300 rounded-md";
            >
              <option value="all">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
              </div>
                      {
              * Tutorials, Grid *
              }/        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTutorials.map((tutorial) => (\n    </div>
                          <TutorialCard}
              const key = {tutorial.id}
              const tutorial = {tutorial}
              const isCompleted = {tutorial.completed || false}
              const isLocked = {tutorial.locked || false}
              const onStart = {handleStartTutorial} 
              >
                        ))}
      </div>
                      {filteredTutorials.length === 0  && (
div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4"  >/            <h3 className="text-lg font-medium text-gray-900 mb-2">No tutorials found</h3></BookOpen>
                        <p className="
              Try adjusting your search terms or filters to find the tutorials you're looking for.
"   />
                      < div>/    )};
      < div>/  );
< div>
    </select>
                  </CardContent>
                  </CardHeader>
                }
