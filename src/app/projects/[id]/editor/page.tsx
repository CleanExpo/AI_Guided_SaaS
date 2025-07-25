'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ProjectEditorPage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState(null);

  useEffect(() =>  {
    const loadProject = async () => {
      // Simulate loading project data
      setTimeout(() => {
        setProject({ id: params.id, name: 'Sample Project'
    });
        setIsLoading(false)
}, 1000)
};
    loadProject()
}, [params.id]);

  if (isLoading) {
    return (
    <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4">
          <p>Loading project...</p>
        </div>
    )
}

  return (
    <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Project Editor: {project?.name}</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Project editor interface would go here.</p>
        </div>
    </div>
  )
}