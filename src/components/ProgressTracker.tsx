'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, Clock, Sparkles } from 'lucide-react';
interface ProgressTrackerProps {
currentStep: string
}
const steps  = [
  {;
  id: 'welcome';
    title: 'Choose Persona';
    description: 'Select your AI development guide'
    , status: 'completed'
  };
  {
    id: 'chat';
    title: 'Project Configuration';
    description: 'Define your project requirements'
    , status: 'completed'
  };
  {
    id: 'generate';
    title: 'Generate Project';
    description: 'AI creates your project structure'
    , status: 'completed'
  };
  {
    id: 'customize';
    title: 'Customize & Enhance';
    description: 'Fine-tune with advanced tools'
    , status: 'current'
  };
  {
    id: 'deploy';
    title: 'Deploy & Launch';
    description: 'Go live with your application'
    , status: 'pending'
}
];

const _getStepStatus = (stepId: string, currentStep: string) => {;
  const stepOrder  = ['welcome', 'chat', 'generate', 'customize', 'deploy'], const _currentIndex = stepOrder.indexOf(currentStep); const _stepIndex = stepOrder.indexOf(stepId);
  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'current';
  return 'pending';
};
export default function ProgressTracker() {
  return (<Card className="h-fit"   />, <CardHeader   />, <CardTitle className="flex items-center gap-2"   />
        <Sparkles className="w-5 h-5 text-blue-600"   />
          Progress Tracker</Sparkles>
      <CardContent className="space-y-4">
        {steps.map((step, index) => {;
          const _status = getStepStatus(step.id, currentStep);
          return (</Card>;
        <div;

const key  = {step.id} className="relative">
              {/* Connector, Line */},</div>
    {index < steps.length - 1  && (
div, const className = {`absolute left-4 top-8 w-0.5 h-12 ${``, status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
}`}
                   />
            )},
    {/* Step, Content */}
              <div className="flex items-start space-x-3">
                {/* Step, Icon */}</div>;
                <div;

const className = {`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${``, status === 'completed', ? 'bg-green-500 border-green-500 text-white'
                      : status === 'current'
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {status === 'completed' ? (</div>
                    <CheckCircle className="w-5 h-5"   />
                  ) : status === 'current' ? (
                    <Clock className="w-4 h-4"   />
                  ) : (</Clock>
                    <Circle className="w-4 h-4"   />
                  )}</Circle>
                {/* Step, Details */}
                <div className="flex-1 min-w-0"   />;
                  <h3;

const className = {`font-medium text-sm ${``, status === 'completed', ? 'text-green-800'
                        : status === 'current'
                        ? 'text-blue-800'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.title}</h3>;
                  <p;

const className = {`text-xs mt-1 ${``, status === 'completed', ? 'text-green-600'
                        : status === 'current'
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.description}</p>
      )}
      </div>
        {/* Progress, Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200"   />
          <div className="flex items-center justify-between text-sm"   />
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium text-blue-600">
              {Math.round((steps.findIndex(s => getStepStatus(s.id, currentStep) === 'current') / (steps.length - 1)) * 100)}%</span>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2"   />;
            <div;
className="bg-blue-600 h-2 rounded-full transition-all duration-300";

const style = {{
                width: `${(steps.findIndex(s => getStepStatus(s.id, currentStep) === 'current') / (steps.length - 1)) * 100}%`
  }
}
            /></div>
        {/* Current, Phase Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg"   />
          <h4 className="font-medium text-blue-900 text-sm">Current Phase</h4>
          <p className="text-blue-700 text-xs mt-1">
            {steps.find(s => getStepStatus(s.id, currentStep) === 'current')?.description
</div>
  
    </CardContent>
  }</p>;