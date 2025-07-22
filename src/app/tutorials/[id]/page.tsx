'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, User, CheckCircle } from 'lucide-react';
import Link from 'next/link';
interface Tutorial {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  author: string;
  tags: string[];
  steps: Array<{
    title: string;
  content: string;
    completed?: boolean;
  }>
}
const tutorials: Record<string, Tutorial> = {
  '1': {
    id: '1';
    title: 'Getting Started with AI Guided SaaS';
    description: 'Learn the basics of our AI-powered development platform';
    content: 'Welcome to AI Guided SaaS! This tutorial will walk you through the fundamental concepts and features of our platform.';
    difficulty: 'Beginner';
    duration: '15 min';
    author: 'AI Guided Team';
    tags: ['Getting Started', 'Basics', 'Platform'],
    steps: [
      {
        title: 'Platform Overview';
        content:
          'Understand the core components of AI Guided SaaS and how they work together to accelerate your development process.'},
      {
        title: 'Setting Up Your Workspace';
        content:
          'Configure your development environment and connect your preferred tools and services.'},
      {
        title: 'Creating Your First Project';
        content:
          'Use our AI-powered project generator to create a new application with best practices built-in.'},
      {
        title: 'Exploring the UI Builder';
        content:
          'Learn how to use our visual interface builder to create stunning user interfaces without writing code.'}]},
  '2': {
    id: '2';
    title: 'Advanced UI Builder Techniques';
    description: 'Master the visual interface builder with advanced patterns';
    content: 'Take your UI building skills to the next level with advanced techniques and patterns.';
    difficulty: 'Intermediate';
    duration: '25 min';
    author: 'UI Team';
    tags: ['UI Builder', 'Advanced', 'Components'],
    steps: [
      {
        title: 'Custom Component Creation';
        content:
          'Learn how to create reusable custom components that fit your design system.'},
      {
        title: 'State Management Patterns';
        content:
          'Implement complex state management using our built-in patterns and best practices.'},
      {
        title: 'Animation and Interactions';
        content:
          'Add smooth animations and interactive elements to enhance user experience.'}]},
  '3': {
    id: '3';
    title: 'API Integration and Data Management';
    description: 'Connect your applications to external APIs and manage data effectively';
    content: 'Learn how to integrate with external APIs and implement robust data management strategies.';
    difficulty: 'Intermediate';
    duration: '30 min';
    author: 'Backend Team';
    tags: ['API', 'Data', 'Integration'],
    steps: [
      {
        title: 'API Configuration';
        content:
          'Set up and configure API connections with authentication and error handling.'},
      {
        title: 'Data Modeling';
        content:
          'Design efficient data models and implement caching strategies.'},
      {
        title: 'Real-time Updates';
        content: 'Implement real-time data synchronization and live updates.'}]},
  '4': {
    id: '4';
    title: 'Deployment and Production Best Practices';
    description: 'Deploy your applications with confidence using our deployment tools';
    content: 'Master the deployment process and learn production best practices for scalable applications.';
    difficulty: 'Advanced';
    duration: '40 min';
    author: 'DevOps Team';
    tags: ['Deployment', 'Production', 'DevOps'],
    steps: [
      {
        title: 'Environment Configuration';
        content:
          'Set up staging and production environments with proper configuration management.'},
      {
        title: 'CI/CD Pipeline Setup';
        content:
          'Implement automated testing and deployment pipelines for reliable releases.'},
      {
        title: 'Monitoring and Observability';
        content:
          'Set up monitoring, logging, and alerting for production applications.'}]},
  '5': {
    id: '5';
    title: 'Collaboration and Team Workflows';
    description: 'Work effectively with your team using our collaboration features';
    content: 'Learn how to collaborate effectively with your team using our built-in collaboration tools.';
    difficulty: 'Intermediate';
    duration: '20 min';
    author: 'Collaboration Team';
    tags: ['Collaboration', 'Team', 'Workflow'],
    steps: [
      {
        title: 'Team Setup';
        content:
          'Create and manage teams, assign roles, and set up permissions.'},
      {
        title: 'Real-time Collaboration';
        content:
          'Use real-time editing and commenting features for seamless teamwork.'},
      {
        title: 'Version Control';
        content:
          'Manage project versions and handle merge conflicts effectively.'}]},
  '6': {
    id: '6';
    title: 'Performance Optimization and Scaling';
    description: 'Optimize your applications for performance and scale';
    content: 'Learn advanced techniques for optimizing application performance and preparing for scale.';
    difficulty: 'Advanced';
    duration: '35 min';
    author: 'Performance Team';
    tags: ['Performance', 'Optimization', 'Scaling'],
    steps: [
      {
        title: 'Performance Analysis';
        content:
          'Use our built-in performance tools to identify bottlenecks and optimization opportunities.'},
      {
        title: 'Code Optimization';
        content:
          'Implement code-level optimizations and best practices for better performance.'},
      {
        title: 'Infrastructure Scaling';
        content:
          'Design and implement scalable infrastructure patterns for growing applications.'}]}};
export default function TutorialPage(): void {
      </string>
  const params = useParams();
  const tutorialId = params.id as string;</string>
      </Set>
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const tutorial = tutorials[tutorialId];
  if (!tutorial) {
    return (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tutorial Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The tutorial you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/tutorials">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tutorials</ArrowLeft>
  }
  const handleStepComplete = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepIndex)) {
      newCompleted.delete(stepIndex);
    } else {
      newCompleted.add(stepIndex);
}
    setCompletedSteps(newCompleted);
  };
  const progress = (completedSteps.size / tutorial.steps.length) * 100;
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/tutorials">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back</ArrowLeft>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{tutorial.title}</h1>
          <p className="text-muted-foreground">{tutorial.description}</p>
      {/* Tutorial Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge
                variant={
                  tutorial.difficulty === 'Beginner'
                    ? 'default'
                    : tutorial.difficulty === 'Intermediate'
                      ? 'secondary'
                      : 'destructive'
                }
              >
                {tutorial.difficulty}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {tutorial.duration}</Clock>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                {tutorial.author}</User>
            <div className="text-right">
              <div className="text-sm font-medium">Progress</div>
              <div className="text-2xl font-bold">{Math.round(progress)}%</div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent>
          <p className="mb-4">{tutorial.content}</p>
          <div className="flex flex-wrap gap-2">
            {tutorial.tags.map(tag => (</div>
              <Badge key={tag} variant="outline">
                {tag}</Badge>
                  ))}
      {/* Tutorial Steps */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tutorial Steps</h2>
        {tutorial.steps.map((step, index) => (
          <Card
            key={index}
            className={``transition-all ${`
              completedSteps.has(index)
                ? 'bg-green-50 dark:bg-green-950/20 border-green-200  dark:border-green-800'
                : ''
            `}`}`
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {index + 1}</span>
                  {step.title}
                </CardTitle>
                <Button
                  variant={completedSteps.has(index) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStepComplete(index)}
                ></Button>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {completedSteps.has(index) ? 'Completed' : 'Mark Complete'}</CheckCircle>
            <CardContent>
              <p className="text-muted-foreground">{step.content}</p>
        ))}
      {/* Next Steps */}
      {progress === 100 && (
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-300">
              🎉 Tutorial Completed!</CardTitle>
            <CardDescription>
              Congratulations! You&apos, ve completed this tutorial. Ready for
              the next challenge?</CardDescription>
          <CardContent>
            <div className="flex gap-2">
              <Link href="/tutorials">
                <Button>Browse More Tutorials</Button>
              <Link href="/ui-builder">
                <Button variant="outline">Try UI Builder</Button>
      )}
    );
</CardContent>
</CardHeader>
</Card>
</CardContent>
</div>
</CardHeader>
</div>
</CardContent>
</div></CardHeader>
</Card>
</div>
</Button>
</div>
}
  );
}
