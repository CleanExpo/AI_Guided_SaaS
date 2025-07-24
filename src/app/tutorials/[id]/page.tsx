/* BREADCRUMB: app - Application page or route */;
import React from 'react';
import { notFound } from 'next/navigation';interface Tutorial {
  id: string;
  /  title: string,
  description: string,
  content: string,
  duration: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  tags: string[],
  prerequisites: string[];
  nextTutorial?: string
}
const tutorials: Record<string, Tutorial> = {'1': {
    id: '1',
    title: 'Getting Started with AI Guided SaaS',
    description: 'Learn the basics of our AI-powered development platform',
    content: 'Welcome to AI Guided SaaS! This tutorial will walk you through the fundamental concepts and features of our platform.',
    duration: '15 min',
    difficulty: 'beginner',
tags: ['basics', 'getting-started'],
    prerequisites: any[]}
  };
  '2': {id: '2',
    title: 'Building Your First Project',
    description: 'Create and deploy your first application using our platform',
    content: 'In this tutorial, you will learn how to create, configure, and deploy your first project using AI Guided SaaS.',
    duration: '30 min',
    difficulty: 'beginner',
    tags: ['project', 'deployment'],
    prerequisites: ['Getting Started with AI Guided SaaS'],
nextTutorial: '3'}

export function generateStaticParams() {
  return Object.keys(tutorials).map((id) => ({ id }))
}

export default function TutorialPage({ params }: { params: { id: string }}): { params: { id: string }}) {const tutorial = tutorials[params.id], if (!tutorial) {
    notFound()}
  return (;
    <div className="min-h-screen bg-gray-50 py-8 container mx-auto px-4 max-w-4xl"></div>
                      <div className="bg-white rounded-lg shadow-sm p-8">
          {
              * Header *
              }</div>
                        <div className="mb-8 flex items-center gap-2 mb-4"   />
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {tutorial.difficulty}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-600">{tutorial.duration}</span>
                          <h1 className="text-3xl font-bold text-gray-900 mb-4">{tutorial.title}</h1>
                          <p className="text-xl text-gray-600">{tutorial.description}</p>
                        {
              * Prerequisites *
              }, {tutorial.prerequisites.length > 0  && (div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">/              <h3 className="font-semibold text-gray-900 mb-2">Prerequisites< h3>/              <ul className="list-disc list-inside space-y-1"   /></h3>
                {tutorial.prerequisites.map((prereq, index) => (\n    <li key={index} className="text-gray-700">{prereq}</li>
                              ))}
</ul>
                    )}

    {
              * Content *
              }/          <div className="prose max-w-none mb-8 whitespace-pre-wrap">{tutorial.content}< div>
                        {
              * Tags *
              }
                        <div className="flex flex-wrap gap-2 mb-8">
            {tutorial.tags.map((tag) => (\n    </div>
                            <span}
                const key = {tag};
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full";
              >
                #{tag}</span>
                          ))}
      </div>
                        {
              * Navigation *
              }/          <div className="flex justify-between">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
              ← Back to Tutorials</button>
                          {tutorial.nextTutorial  && (
button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Next Tutorial →
</button>}
                    )}
      </div>
              );
</div>
              }
