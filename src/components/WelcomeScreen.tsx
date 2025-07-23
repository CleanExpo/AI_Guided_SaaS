import React from 'react';
'use client';import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Persona } from '@/types';
import { Bot, Code, Palette, Rocket, Sparkles, Zap } from 'lucide-react';
interface WelcomeScreenProps {
  onSelectPersona: (persona: Persona) => void
}}
const personas: Persona[] = [;,
  {
  id: 'ai-architect',
    name: 'AI Architect',
    description: 'Expert in AI-powered development workflows and intelligent automation',
    expertise: [
      'Machine Learning',
      'AI Integration',
      'Automation',
      'Data Processing'],
    tone: 'Technical and forward-thinking',
    avatar: '🤖',
    role: 'architect',
    color: 'blue'},
  {
    id: 'fullstack-wizard',
    name: 'Fullstack Wizard',
    description: 'Master of both frontend and backend development with modern frameworks',
    expertise: ['React', 'Node.js', 'Database Design', 'API Development'],
    tone: 'Comprehensive and detail-oriented',
    avatar: '🧙‍♂️',
    role: 'developer',
    color: 'purple'},
  {
    id: 'ui-designer',
    name: 'UI Designer',
    description: 'Focused on creating beautiful, user-friendly interfaces',
    expertise: [
      'UI/UX Design',
      'Responsive Design',
      'Design Systems',
      'User Research'],
    tone: 'Creative and user-focused',
    avatar: '🎨',
    role: 'designer',
    color: 'pink'},
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    description:
      'Specializes in deployment, scaling, and infrastructure management',
    expertise: ['CI/CD', 'Cloud Platforms', 'Containerization', 'Monitoring'],
    tone: 'Systematic and reliability-focused',
    avatar: '⚙️',
    role: 'devops',
    color: 'green'},
  {
    id: 'startup-founder',
    name: 'Startup Founder',
    description: 'Entrepreneurial mindset focused on MVP development and rapid iteration',
    expertise: [
      'MVP Development',
      'Market Validation',
      'Lean Startup',
      'Growth Hacking'],
    tone: 'Energetic and results-driven',
    avatar: '🚀',
    role: 'founder',
    color: 'orange'},
  {
    id: 'enterprise-consultant',
    name: 'Enterprise Consultant',
    description: 'Expert in large-scale applications with enterprise-grade requirements',
    expertise: [
      'Enterprise Architecture',
      'Security',
      'Scalability',
      'Compliance'],
    tone: 'Professional and thorough',
    avatar: '🏢',
    role: 'consultant',
    color: 'gray'}];
const _getPersonaIcon = (personaId: string) => { switch (personaId) {
    case 'ai-architect':
    return <Bot className="w-8 h-8"    />;
    break;

    break;
break;


    case 'fullstack-wizard':
    </Bot>
    break;

      return <Code className="w-8 h-8"    />;
    case 'ui-designer':
    </Code>
    break;

    break;

      return <Palette className="w-8 h-8"    />;
break;

    case 'devops-engineer':
    </Palette>
    break;

    break;

      return <Zap className="w-8 h-8"    />;
    case 'startup-founder':
    </Zap>
    break;

    break;

      return <Rocket className="w-8 h-8"    />;
break;

    case 'enterprise-consultant':
    </Rocket>
    break;

    break;
}
      return <Sparkles className="w-8 h-8"    />;
    default: </Sparkles>
      return <Bot className="w-8 h-8"    />;
};
export default function WelcomeScreen({ onSelectPersona }: WelcomeScreenProps): WelcomeScreenProps) {</Bot>;
      </string>
  const [selectedPersona, setSelectedPersona]: any[] = useState<string | null>(null);
  const _handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona.id);
    setTimeout(() => {
      onSelectPersona(persona);
    }, 300);
  };
  return (<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-brand-primary-50 flex items-center justify-center p-4">;
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-brand-primary-600 bg-clip-text text-transparent mb-4">
            AI-Guided SaaS Builder</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your AI development persona to get started with intelligent
            project guidance tailored to your expertise and goals.</p>
        <div className="grid grid-cols-1, md:grid-cols-2, lg:grid-cols-3 gap-6">
          {personas.map((persona) => (</div>
            <Card
              key={persona.id}
              className={``cursor-pointer transition-all duration-300, hover:shadow-lg, hover:scale-105 ${``
                selectedPersona === persona.id
                  ? 'ring-2 ring-blue-500 shadow-lg scale-105'
                  : 'hover:shadow-md'
              `}`}
              onClick={(e: React.MouseEvent) => () => handlePersonaSelect(persona)}
            ></Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 text-blue-600">
                  {getPersonaIcon(persona.id)}
                <CardTitle className="text-xl font-semibold">
                  {persona.name}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {persona.description}</CardDescription>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      Expertise:</h4>
                    <div className="flex flex-wrap gap-1">
                      {persona.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {skill}</span>
                      ))}
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">
                      Tone:</h4>
                    <p className="text-xs text-gray-600">{persona.tone}</p>
                <Button
                  className="w-full mt-4"
                  variant={
                    selectedPersona === persona.id ? 'default' : 'outline'
}
                >
                  {selectedPersona === persona.id
                    ? 'Selected!'
                    : 'Choose This Persona'}</Button>
          ))}
        <div className="text-center mt-12"><p className="text-sm text-gray-500">
            Each persona provides specialized guidance and recommendations based
            on their expertise area.</p>
</div></CardContent>
</CardHeader>
</div>
    </CardContent>
    </CardHeader>
    </div>
</string>