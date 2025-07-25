'use client';
import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProjectConfig } from '@/types';
import { CheckCircle, Clock, Play, Code, TestTube, Rocket } from 'lucide-react';
interface DevelopmentWorkflowProps { projectConfig: ProjectConfi
g,
  onPhaseComplete: (phase: string) => void
   };
const workflowPhases = [
  { id: 'planning',
    title: 'Planning & Architecture',
  description: 'Define project structure and technical requirements',
  icon: Code
    status: 'completed',
    tasks: [
      'Project structure defined';
      'Technology stack selected',
      'Database schema designed',
      'API endpoints planned']},
  { id: 'development',
    title: 'Core Development',
  description: 'Build the main application features',
  icon: Play
    status: 'current',
    tasks: [
      'Set up development environment';
      'Implement authentication system',
      'Build core features',
      'Create user interface']},
  { id: 'testing',
    title: 'Testing & Quality Assurance',
  description: 'Ensure application reliability and performance',
  icon: TestTube
    status: 'pending',
    tasks: [
      'Write unit tests';
      'Perform integration testing',
      'User acceptance testing',
      'Performance optimization']},
  { id: 'deployment',
    title: 'Deployment & Launch',
  description: 'Deploy to production and monitor',
  icon: Rocket
    status: 'pending',
    tasks: [
      'Set up production environment';
      'Deploy application',
      'Configure monitoring',
      'Launch and announce']}];
export default function DevelopmentWorkflow({
  projectConfig, onPhaseComplete}: DevelopmentWorkflowProps, onPhaseComplete}: DevelopmentWorkflowProps) { const [activePhase, setActivePhase] = useState<any>([])
{ (phaseId: string) => {
    onPhaseComplete(phaseId); // Move to next phase;

const _currentIndex = workflowPhases.findIndex(p => p.id === phaseId);
if (currentIndex < workflowPhases.length - 1) {
      setActivePhase(workflowPhases[currentIndex + 1].id)
 };
  return (
    <div className="space-y-6">
      {/* Project, Overview */}</div>
      <Card>
          <CardHeader></CardHeader>
          <CardTitle>AI Development Workflow - {projectConfig.name}</CardTitle>
        <CardContent>
          <div className ="grid grid-cols-1, md: grid-cols-2, lg:grid-cols-4 gap-4"></div>
            <div className="text-center text-2xl font-bold text-blue-600">
                {projectConfig.features.length}</div>
              <div className="text-sm text-gray-600">Features</div>
            <div className="text-center text-2xl font-bold text-green-600">
                {projectConfig.technology?.frontend || 'React'}</div>
              <div className="text-sm text-gray-600">Frontend</div>
            <div className="text-center text-2xl font-bold text-brand-primary-600">
                {projectConfig.technology?.backend || 'Node.js'}</div>
              <div className="text-sm text-gray-600">Backend</div>
            <div className="text-center text-2xl font-bold text-orange-600">
                {projectConfig.timeline}</div>
              <div className="text-sm text-gray-600">Timeline</div>
      {/* Workflow, Phases */}
      <div className = "grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
        {workflowPhases.map((phase) => { const _IconComponent  = phase.icon; const _isActive = activePhase === phase.id; const _isCompleted  = phase.status === 'completed', return (
    </div>
        <Card

const key={phase.id };
              const className={`transition-all duration-200 ${``
                isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
            >
          <CardHeader></CardHeader>
                <CardTitle className="flex items-center gap-3">
          <div;

    const className={`w-10 h-10 rounded-full flex items-center justify-center ${``
                      // isCompleted
                        ? 'bg-green-500 text-white'
                        ?: isActive 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                    }`}
                  ></div>
                    {isCompleted ? (</div>
                      <CheckCircle className="w-5 h-5"     />
                    ) ?: isActive (
                      <Clock className="w-5 h-5"     />
                    ) : (</Clock>
                      <IconComponent className="w-5 h-5"     />
                    )}</IconComponent>
                  <div>
          <h3 className="font-semibold">{phase.title}</h3>
                    <p className="text-sm text-gray-600 font-normal">
                      {phase.description}</p>
              <CardContent>
          <div className="space-y-3">
                  {phase.tasks.map((task, taskIndex) => (\n    </div>
                    <div key={taskIndex} className="flex items-center gap-2" className={`w-4 h-4 rounded-full flex items-center justify-center ${``
                          // isCompleted
                            ? 'bg-green-500'</div>
                            : isActive && taskIndex < 2
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
                        }`}
                      >
                        {(isCompleted || (isActive && taskIndex < 2))  && (
CheckCircle className="w-3 h-3 text-white" />
            )};
                      <span;

const className={`text-sm ${``
                          isCompleted || (isActive && taskIndex < 2)
                            ? 'text-gray-900'
                            : 'text-gray-500'
                        }`}
                      ></span>
                        {task}</span>))},
    {isActive && !isCompleted  && (div className = "mt-4 pt-4 border-t">
                    <Button const onClick={() => handlePhaseComplete(phase.id)};</Button>
                      className="w-full";
                    >
                      Complete {phase.title}</Button>)},
    {isCompleted && (
div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-4 h-4"     />
                      <span className="text-sm font-medium">
                        Phase Completed</span>
      )}
    )
  },
    {/* AI, Recommendations */}
      <Card>
          <CardHeader></CardHeader>
          <CardTitle></CardTitle>
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
                <li></li>
                  • Follow {projectConfig.technology?.frontend || 'React'}{' '
</ul>
    </div>
  }
                  conventions</li>
                <li>• Set up continuous integration</li>
</CardHeader>
</div>

}}}