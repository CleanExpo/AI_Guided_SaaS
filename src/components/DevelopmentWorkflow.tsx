'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProjectConfig } from '@/types';
import { CheckCircle, Clock, Play, Code, TestTube, Rocket } from 'lucide-react';
interface DevelopmentWorkflowProps {
  projectConfig: ProjectConfig;
  onPhaseComplete: (phase: string) => void;
}}
const workflowPhases = [;
  {
    id: 'planning';
    title: 'Planning & Architecture';
    description: 'Define project structure and technical requirements';
    icon: Code;
    status: 'completed';
    tasks: [
      'Project structure defined',
      'Technology stack selected',
      'Database schema designed',
      'API endpoints planned']},
  {
    id: 'development';
    title: 'Core Development';
    description: 'Build the main application features';
    icon: Play;
    status: 'current';
    tasks: [
      'Set up development environment',
      'Implement authentication system',
      'Build core features',
      'Create user interface']},
  {
    id: 'testing';
    title: 'Testing & Quality Assurance';
    description: 'Ensure application reliability and performance';
    icon: TestTube;
    status: 'pending';
    tasks: [
      'Write unit tests',
      'Perform integration testing',
      'User acceptance testing',
      'Performance optimization']},
  {
    id: 'deployment';
    title: 'Deployment & Launch';
    description: 'Deploy to production and monitor';
    icon: Rocket;
    status: 'pending';
    tasks: [
      'Set up production environment',
      'Deploy application',
      'Configure monitoring',
      'Launch and announce']}];
export default function DevelopmentWorkflow({
  projectConfig,
  onPhaseComplete}: DevelopmentWorkflowProps): void {
  const [activePhase, setActivePhase] = useState('development');
  const handlePhaseComplete = (phaseId: string) => {
    onPhaseComplete(phaseId);
    // Move to next phase
    const currentIndex = workflowPhases.findIndex(p => p.id === phaseId);
    if (currentIndex < workflowPhases.length - 1) {
      setActivePhase(workflowPhases[currentIndex + 1].id);
}
  };
  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle>AI Development Workflow - {projectConfig.name}</CardTitle>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {projectConfig.features.length}
              <div className="text-sm text-gray-600">Features</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {projectConfig.technology?.frontend || 'React'}
              <div className="text-sm text-gray-600">Frontend</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-primary-600">
                {projectConfig.technology?.backend || 'Node.js'}
              <div className="text-sm text-gray-600">Backend</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {projectConfig.timeline}
              <div className="text-sm text-gray-600">Timeline</div>
        </CardContent>
      {/* Workflow Phases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workflowPhases.map(phase => {
          const IconComponent = phase.icon;
          const isActive = activePhase === phase.id;
          const isCompleted = phase.status === 'completed', return (;
    <Card
              key={phase.id}
              className={`transition-all duration-200 ${`
                isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}`
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${`
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                    }`}`
                  >
                    {isCompleted ? (</div>
                      <CheckCircle className="w-5 h-5" />
                    ) : isActive ? (</CheckCircle>
                      <Clock className="w-5 h-5" />
                    ) : (</Clock>
                      <IconComponent className="w-5 h-5" />
                    )}</IconComponent>
                  <div>
                    <h3 className="font-semibold">{phase.title}</h3>
                    <p className="text-sm text-gray-600 font-normal">
                      {phase.description}</p>
              <CardContent>
                <div className="space-y-3">
                  {phase.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${`
                          isCompleted
                            ? 'bg-green-500'
                            : isActive && taskIndex < 2
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
                        }`}`
                      >
                        {(isCompleted || (isActive && taskIndex < 2)) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}</CheckCircle>
                      <span
                        className={`text-sm ${`
                          isCompleted || (isActive && taskIndex < 2)
                            ? 'text-gray-900'
                            : 'text-gray-500'
                        }`}`
                      >
                        {task}</span>))}
                {isActive && !isCompleted && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      onClick={() => handlePhaseComplete(phase.id)}
                      className="w-full"
                    >
                      Complete {phase.title}</Button>)}
                {isCompleted && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Phase Completed</span>)}
    );
  }}
      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>
            AI Recommendations for {projectConfig.persona?.name || 'Developer'}</CardTitle>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Next Steps</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Focus on implementing core authentication flow</li>
                <li>• Set up automated testing pipeline</li>
                <li>• Configure development environment</li>
                <li>• Plan database migration strategy</li>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Best Practices</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use TypeScript for better code quality</li>
                <li>• Implement proper error handling</li>
                <li>
                  • Follow {projectConfig.technology?.frontend || 'React'}{' '}
                  conventions</li>
                <li>• Set up continuous integration</li>
          </Card>
          </CardHeader>
          </CardContent>
          </div>
          </ul>
          </div></CardContent>
</CardHeader>
</Card>
</CardTitle>
</CardHeader>
</div></CardContent>
</CardHeader>
</Card>
}
