'use client'

import { DynamicDocumentationSystem } from '@/lib/docs/DynamicDocumentationSystem';
import { InteractiveTutorialSystem } from '@/lib/tutorials/InteractiveTutorialSystem';
import { DocumentationViewer } from '@/components/docs/DocumentationViewer';
import { AISupportChat } from '@/components/support/AISupportChat';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
export default function DocsPage() {
  const { data: session } = useSession()
  const [docSystem, setDocSystem] = useState<DynamicDocumentationSystem | null>(null)
  const [tutorialSystem, setTutorialSystem] = useState<InteractiveTutorialSystem | null>(null)
  
  useEffect(() => {
    // Initialize documentation and tutorial systems
    const docs = new DynamicDocumentationSystem()
    const tutorials = new InteractiveTutorialSystem(docs)
    
    setDocSystem(docs)
    setTutorialSystem(tutorials)
    
    return () => {
      docs.destroy()
    }
  }, [])
  
  if (!docSystem || !tutorialSystem) {
    return (
    <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading documentation...</p>
  }
  
  return (
    <div className="h-screen flex flex-col">
      <header className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Documentation</h1>
            <p className="text-muted-foreground">Learn how to use AI Guided SaaS</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.href = '/tutorials'}
              className="text-sm text-primary hover:underline"
            >
              Interactive Tutorials →</button>
      
      <div className="flex-1 overflow-hidden">
        <DocumentationViewer
          documentationSystem={docSystem}
          tutorialSystem={tutorialSystem}
          userId={session?.user?.id || 'anonymous'}
          initialSectionId={undefined}
        />
      </div>
      
      {/* AI Support Chat */}
      <AISupportChat
        documentationSystem={docSystem}
        tutorialSystem={tutorialSystem}
        userId={session?.user?.id || 'anonymous'}
      />
    
  }

    
  );
}
