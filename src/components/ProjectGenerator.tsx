'use client';

import React from 'react';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectConfig, ProjectFile } from '@/types';
import { CheckCircle, FileText, Folder, Code, Settings, Palette, Database, Globe } from 'lucide-react';
interface ProjectGeneratorProps {
config: ProjectConfi;g;
    onFilesGenerated: (files: ProjectFile[]) => voi;d

}
const _generateProjectFiles = (config: ProjectConfig): ProjectFile[] => {
  const files: ProjectFile[] = [];
  // Generate package.json
  files.push({
    name: 'package.json',
    path: 'package.json',
    type: 'config',
    content: JSON.stringify({
  name: config.name.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: config.description,
    main: 'index.js',
    scripts: {,
  dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      },
    dependencies: {
        'react': '^18.0.0',
        'react-dom': '^18.0.0',
        'next': '^14.0.0',
        'typescript': '^5.0.0',
        '@types/react': '^18.0.0',
        '@types/node': '^20.0.0'
}, null, 2)
  })
  // Generate README.md
  files.push({
    name: 'README.md',
    path: 'README.md',
    type: 'documentation',
    content: `# ${config.name}``
${config.description}
## Features
${config.features.map((feature) => `- ${feature}`).join('\n')}``
## Technology Stack
- **Frontend:** ${config.technology?.frontend || 'React'}
- **Backend:** ${config.technology?.backend || 'Node.js'}
- **Database:** ${config.technology?.database || 'PostgreSQL'}
- **Hosting:** ${config.technology?.hosting || 'Vercel'}
## Target Audience
${config.targetAudience}
## Timeline
${config.timeline}
## Getting Started
\`\`\`bash``
npm install
npm run dev
\`\`\```
## Development
This project was generated using AI-Guided SaaS Builder with the ${config.persona?.name || 'Developer'} persona.
`
  })
  // Generate main page component
  files.push({
    name: 'page.tsx',
    path: 'app/page.tsx',
    type: 'page',
    content: `export default function Home() {``
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"></main>
      <div className="container mx-auto px-4 py-16"></div>
        <div className="text-center"></div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to ${config.name}</h1>
          <p className="text-xl text-gray-600 mb-8">
            ${config.description}</p>
          <div className="grid grid-cols-1, md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            ${config.features.slice(0, 6).map((feature) => `</div>
            <div className="bg-white p-6 rounded-lg shadow-md"></div>
              <h3 className="text-lg font-semibold mb-2">${feature}</h3>
              <p className="text-gray-600">Coming soon...</p>
            </div>`).join('')}``
    );
}```
  })
  // Generate layout component
  files.push({
    name: 'layout.tsx',
    path: 'app/layout.tsx',
    type: 'component',
    content: `import type {  Metadata  } from 'next'``
import { Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
    title: '${config.name}',
  description: '${config.description}'},
    export default function RootLayout() {
  return (
    <html lang="en"></html>
      <body className={inter.className}>{children}</body>
  }`
  })
  // Generate global CSS
  files.push({
    name: 'globals.css',
    path: 'app/globals.css',
    type: 'style',
    content: `@tailwind base;``
@tailwind components;
@tailwind utilities;
:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255}
@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
}
}
body {
  color: rgb(var(--foreground-rgb)),
    background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
@layer utilities { .text-balance {
    text-wrap: balance
   }```
  })
  // Generate API route if backend features are selected
  if (config.features.some(f => f.includes('API') || f.includes('Authentication'))) {
    files.push({
      name: 'route.ts',
      path: 'app/api/hello/route.ts',
      type: 'api',
      content: `import { NextRequest, NextResponse } from 'next/server'``
export async function GET(request: NextRequest): Promise<any> {
  return NextResponse.json({
    message: 'Hello from ${config.name} API!',
    timestamp: new Date().toISOString()
}
      )}
  );
export async function POST(request: NextRequest): Promise<any> {
  const _body = await request.json();
  return NextResponse.json({
    message: 'Data received successfully',
    data: body,
    timestamp: new Date().toISOString()
  })
}`
  }
      )}
    );
  return files;
}
const generationSteps = [
  { id: 'structure', label: 'Creating project structure', icon: Folder },
  { id: 'config', label: 'Generating configuration files', icon: Settings },
  { id: 'components', label: 'Building React components', icon: Code },
  { id: 'styles', label: 'Setting up styling', icon: Palette },
  { id: 'api', label: 'Creating API endpoints', icon: Database },
  { id: 'docs', label: 'Writing documentation', icon: FileText },
  { id: 'deploy', label: 'Preparing for deployment', icon: Globe }
]
export default function ProjectGenerator({ config, onFilesGenerated }: ProjectGeneratorProps), onFilesGenerated }: ProjectGeneratorProps) {
  const [currentStep, setCurrentStep] = useState<any>(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<any>(true);
  useEffect(() => {
    const _generateFiles = async () => {</string>;
      for(let i = 0; i < generationSteps.length, i++) {
        const step = generationSteps[i];
        setCurrentStep(i)
        // Simulate generation time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
        setCompletedSteps(prev => [...prev, step.id])
}
      // Generate the actual files
      const files = generateProjectFiles(config);
      setIsGenerating(false)
      // Wait a moment before calling the callback
      setTimeout(() => {
        onFilesGenerated(files)
      }, 1500)
}
    generateFiles()
  }, [config, onFilesGenerated])
  return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"></div>;
      <Card className="w-full max-w-2xl"></Card>
        <CardHeader className="text-center"></CardHeader>
          <CardTitle className="text-2xl font-bold">
            Generating Your Project</CardTitle>
          <p className="text-gray-600 mt-2"></p>
            Creating <span className="font-semibold">{config.name}</span> with your selected features...
          </p>
        <CardContent className="space-y-6">
          {/* Project, Overview */}</CardContent>
          <div className="bg-blue-50 p-4 rounded-lg"></div>
            <h3 className="font-semibold text-blue-900 mb-2">Project Overview</h3>
            <div className="grid grid-cols-2 gap-4 text-sm"></div>
              <div></div>
                <span className="text-blue-700 font-medium">Frontend:</span>
                <span className="ml-2">{config.technology?.frontend || 'React'}</span>
              </div>
              <div></div>
                <span className="text-blue-700 font-medium">Backend:</span>
                <span className="ml-2">{config.technology?.backend || 'Node.js'}</span>
              </div>
              <div></div>
                <span className="text-blue-700 font-medium">Database:</span>
                <span className="ml-2">{config.technology?.database || 'PostgreSQL'}</span>
              </div>
              <div></div>
                <span className="text-blue-700 font-medium">Hosting:</span>
                <span className ="ml-2">{config.technology?.hosting || 'Vercel'}</span>
              </div>
          {/* Generation, Steps */}
          <div className="space-y-3">
            {generationSteps.map((step, index) => {
              const _isCompleted = completedSteps.includes(step.id);
              const _isCurrent = currentStep === index && isGenerating;
              const _IconComponent = step.icon;
              return (
    <div
                key={step.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${``
                    // isCompleted
                      ? 'bg-green-50 border border-green-200'
                      : isCurrent
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                ></div>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${``
                      // isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {isCompleted ? (</div>
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <IconComponent className="w-4 h-4" />
                    )}</IconComponent>
                  <div className="flex-1"></div>
                    <p
                      className={`font-medium ${``
                        // isCompleted
                          ? 'text-green-800'
                          : isCurrent
                          ? 'text-blue-800'
                          : 'text-gray-600'
                      }`}
                    >
                      {step.label}</p>
                  {isCurrent  && (
div className="flex space-x-1"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  
              
            )}
    );
};
          {/* Features, List */}
          <div className="bg-gray-50 p-4 rounded-lg"></div><h3 className="font-semibold text-gray-900 mb-2">Selected Features</h3>
            <div className="grid grid-cols-2 gap-2">
              {config.features.map((feature, index) => (</div>
                <div key={index} className="flex items-center space-x-2"></div>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">{feature}</span>))
    </any>
    },
    {!isGenerating  && (div className="text-center"></div>
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full"></div>
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Generation Complete!</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Redirecting to your project dashboard...</p>
        </CardContent>
