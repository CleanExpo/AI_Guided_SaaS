'use client';
import React from 'react';
import { notFound } from 'next/navigation';

interface Tutorial { id: string;
  title: string;
  description: string;
  content: string;
  duration: string;
  difficulty: string
}

const tutorials: Tutorial[] = [;
  { id: '1',
    title: 'Getting Started with AI Guided SaaS',
    description: 'Learn the basics of using our platform',
    content: 'This tutorial will guide you through the fundamentals...',
    duration: '10 min',
    difficulty: 'Beginner'
  },
  { id: '2',
    title: 'Advanced Project Configuration',
    description: 'Deep dive into project settings and customization',
    content: 'Advanced configuration options allow you to...',
    duration: '25 min',
    difficulty: 'Advanced'
  }
];

interface TutorialPageProps { params: {
    id: string
 }

export default function TutorialPage({ params }: TutorialPageProps) {
  const tutorial = tutorials.find(t => t.id === params.id);

  if (!tutorial) {
    notFound()
}

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
          <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{tutorial.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{tutorial.description}</p>
        <div className="flex gap-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {tutorial.difficulty}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            {tutorial.duration}
          </span>
        <div className="prose max-w-none">
          <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Tutorial Content</h2>
          <p>{tutorial.content}</p>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">What you will learn:</h3>
            <ul className="list-disc ml-6 space-y-1">
          <li>Platform navigation and basic features</li>
              <li>Creating your first project</li>
              <li>Understanding the development workflow</li>
              <li>Best practices and tips</li>
            </ul>
          </div>
  )
}
}