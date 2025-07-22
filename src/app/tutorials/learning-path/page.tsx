'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  ArrowRight,
  BookOpen} from 'lucide-react';
import Link from 'next/link';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  tutorials: Array<{
    id: string;
  title: string;
    duration: string;
    completed?: boolean;
  }>;
}

const learningPaths: LearningPath[] = [
  {
    id: 'beginner',
    title: 'Complete Beginner Path',
    description:
      'Start your journey with AI Guided SaaS from the very beginning',
    difficulty: 'Beginner',
    estimatedTime: '2-3 hours',
    tutorials: [
      {
        id: '1',
        title: 'Getting Started with AI Guided SaaS',
        duration: '15 min'},
      { id: '2', title: 'Advanced UI Builder Techniques', duration: '25 min' },
      {
        id: '5',
        title: 'Collaboration and Team Workflows',
        duration: '20 min'}]},
  {
    id: 'developer',
    title: 'Full-Stack Developer Path',
    description:
      'Master both frontend and backend development with our platform',
    difficulty: 'Intermediate',
    estimatedTime: '4-5 hours',
    tutorials: [
      {
        id: '1',
        title: 'Getting Started with AI Guided SaaS',
        duration: '15 min'},
      { id: '2', title: 'Advanced UI Builder Techniques', duration: '25 min' },
      {
        id: '3',
        title: 'API Integration and Data Management',
        duration: '30 min'},
      {
        id: '4',
        title: 'Deployment and Production Best Practices',
        duration: '40 min'},
      {
        id: '6',
        title: 'Performance Optimization and Scaling',
        duration: '35 min'}]},
  {
    id: 'team-lead',
    title: 'Team Lead & Project Manager Path',
    description:
      'Learn to manage teams and projects effectively using our collaboration tools',
    difficulty: 'Intermediate',
    estimatedTime: '3-4 hours',
    tutorials: [
      {
        id: '1',
        title: 'Getting Started with AI Guided SaaS',
        duration: '15 min'},
      {
        id: '5',
        title: 'Collaboration and Team Workflows',
        duration: '20 min'},
      {
        id: '4',
        title: 'Deployment and Production Best Practices',
        duration: '40 min'},
      {
        id: '6',
        title: 'Performance Optimization and Scaling',
        duration: '35 min'}]},
  {
    id: 'enterprise',
    title: 'Enterprise & DevOps Path',
    description: 'Advanced topics for enterprise deployment and operations',
    difficulty: 'Advanced',
    estimatedTime: '5-6 hours',
    tutorials: [
      {
        id: '3',
        title: 'API Integration and Data Management',
        duration: '30 min'},
      {
        id: '4',
        title: 'Deployment and Production Best Practices',
        duration: '40 min'},
      {
        id: '6',
        title: 'Performance Optimization and Scaling',
        duration: '35 min'},
      {
        id: '5',
        title: 'Collaboration and Team Workflows',
        duration: '20 min'}]}];

export default function LearningPathPage() {
      </string>
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<Set<string>>(
        </Set>
    new Set()
  );

  const handleTutorialComplete = (tutorialId: string) => {
    const newCompleted = new Set(completedTutorials);
    if (newCompleted.has(tutorialId)) {
      newCompleted.delete(tutorialId);
    } else {
      newCompleted.add(tutorialId);
    }
    setCompletedTutorials(newCompleted);
  };

  const getPathProgress = (path: LearningPath) => {
    const completed = path.tutorials.filter(t =>
      completedTutorials.has(t.id)
    ).length;
    return (completed / path.tutorials.length) * 100;
  };

  if (selectedPath) {
    const path = learningPaths.find(p => p.id === selectedPath);
    if (!path) return null;

    const progress = getPathProgress(path);

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}</div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedPath(null)}
          ></Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Paths</ArrowLeft>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{path.title}</h1>
            <p className="text-muted-foreground">{path.description}</p>

        {/* Path Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge
                  variant={
                    path.difficulty === 'Beginner'
                      ? 'default'
                      : path.difficulty === 'Intermediate'
                        ? 'secondary'
                        : 'destructive'
                  }
                >
                  {path.difficulty}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {path.estimatedTime}</Clock>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  {path.tutorials.length} tutorials</BookOpen>
              <div className="text-right">
                <div className="text-sm font-medium">Progress</div>
                <div className="text-2xl font-bold">
                  {Math.round(progress)}%</div>
            <Progress value={progress} className="mt-4" />
          </CardHeader>

        {/* Tutorial List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Learning Path Tutorials</h2>
          {path.tutorials.map((tutorial, index) => (
            <Card
              key={tutorial.id}
              className={`transition-all ${
                completedTutorials.has(tutorial.id)
                  ? 'bg-green-50, dark:bg-green-950/20 border-green-200  dark:border-green-800'
                  : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}</span>
                    {tutorial.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{tutorial.duration}</Badge>
                    <Button
                      variant={
                        completedTutorials.has(tutorial.id)
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => handleTutorialComplete(tutorial.id)}
                    ></Button>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {completedTutorials.has(tutorial.id)
                        ? 'Completed'
                        : 'Mark Complete'}</CheckCircle>
                    <Link href="/tutorials/${tutorial.id}">
                      <Button size="sm">
                        Start Tutorial</Button>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
          ))}
        </div>

        {/* Completion */}
        {progress === 100 && (
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-300">
                🎉 Learning Path Completed!</CardTitle>
              <CardDescription>
                Congratulations! You&apos;ve completed the {path.title}. Ready
                to explore more?</CardDescription>
            <CardContent>
              <div className="flex gap-2">
                <Button onClick={() => setSelectedPath(null)}>
                  Explore Other Paths</Button>
                <Link href="/ui-builder">
                  <Button variant="outline">Try UI Builder</Button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}</div>
      <div className="flex items-center gap-4">
        <Link href="/tutorials">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tutorials</ArrowLeft>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Learning Paths</h1>
          <p className="text-muted-foreground">
            Structured learning journeys to master AI Guided SaaS</p>

      {/* Learning Paths Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {learningPaths.map(path => {
          const progress = getPathProgress(path);
          return (
            <Card
              key={path.id}
              className="cursor-pointer hover:shadow-lg transition-all"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{path.title}</CardTitle>
                  <Badge
                    variant={
                      path.difficulty === 'Beginner'
                        ? 'default'
                        : path.difficulty === 'Intermediate'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {path.difficulty}</Badge>
                <CardDescription>{path.description}</CardDescription>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {path.estimatedTime}</Clock>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {path.tutorials.length} tutorials</BookOpen>
                    <div className="font-medium">
                      {Math.round(progress)}% complete</div>
                  <Progress value={progress} />
                  <Button
                    className="w-full"
                    onClick={() => setSelectedPath(path.id)}
                  >
                    {progress > 0 ? 'Continue Path' : 'Start Path'}</Button>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
    );
        }
      )}
    </div>
        </div>
        </Card>
        </CardHeader>
        </div>
        </div>
        </div>
        </CardHeader>
        </div>
        </Link>
        </Card>
        </CardHeader>
        </CardContent>
        </div>
        </Link>
        </div>
        </Link>
        </Button>
        </div>
        </CardHeader>
        </div>
        </CardContent>
        </div>
        </div>
    );

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle>Not sure where to start?</CardTitle>
          <CardDescription>
            Take our quick assessment to find the perfect learning path for you</CardDescription>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={() => setSelectedPath('beginner')}>
              Start with Beginner Path</Button>
            <Link href="/tutorials">
              <Button variant="outline">Browse All Tutorials</Button>
          </Card>
          </CardHeader>
          </CardContent>
          </div>
          </Link>
      );
</CardContent>
</CardHeader>
</Card>
</Button>
</div>
</CardContent>
</CardHeader>
</Card>
</div>
</CardHeader>
</div>
</div>
</div>
</div>
</div>
</div>
</CardHeader>
</Card>
</div>
</div>
}

</string>
</string>