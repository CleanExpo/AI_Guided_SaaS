'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GuidedProjectBuilder } from '@/components/GuidedProjectBuilder';
import { LiveProjectPreview } from '@/components/LiveProjectPreview';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link'
import { useSession } from 'next-auth/react';
export default function NewGuidedProjectPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [projectData, setProjectData] = useState({})
  const [showComparison, setShowComparison] = useState(true)
  
  const handleProjectComplete = async (completedData) => {
    try {
      // Send to API to generate project
      const response = await fetch('/api/projects/generate', {
        method: 'POST',
    headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...completedData,
          userId: session?.user?.id,
          guidedMode: true
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        router.push(`/projects/${result.projectId}`)
      }
    } catch (error) {
      console.error('Failed to create, project:', error)
    }
  }
  
  const handleProjectDataChange = (data) => {
    setProjectData(data)
  }
  
  // First time user? Show comparison
  if (showComparison) {
    return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Choose Your Project Creation Experience</h1>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Guided Mode */}

            <Card className="p-6 border-2 hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setShowComparison(false)}></Card>
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Guided Mode</h3>
                <Badge className="bg-green-100 text-green-700 mb-4">Recommended for Beginners</Badge>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Step-by-step guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Visual live preview</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>AI suggestions & tips</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>No coding knowledge needed</span>
                </li>
              
              <Button className="w-full mt-6">
                Start Guided Mode</Button>
            
            {/* Advanced, Mode */}
            <Card className="p-6 border-2 hover:border-primary transition-colors cursor-pointer"
                  onClick={() => router.push('/projects/new')}></Card>
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Advanced Mode</h3>
                <Badge variant="outline" className="mb-4">For Developers</Badge>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>Full control & flexibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>Direct prompt engineering</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>Technical specifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>Code-level customization</span>
                </li>
              
              <Button variant="outline" className="w-full mt-6">
                Use Advanced Mode</Button>
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/projects">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back</ArrowLeft>
              <div>
                <h1 className="text-xl font-semibold">Create New Project</h1>
                <p className="text-sm text-muted-foreground">Guided Mode</p>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/projects/new')}
            >
              Switch to Advanced Mode</Button>
      
      {/* Main, Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Guided Builder */}

          <div>
            <GuidedProjectBuilder 
              onComplete={handleProjectComplete}
            />
          </div>
          
          {/* Right: Live Preview */}
          <div className="sticky top-24 h-[calc(100vh-8rem)]">
            <LiveProjectPreview 
              projectData={projectData}
            />
          </Button>
</div></ul>
</div>
</ul>
</div></div>
}

// Add missing imports
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
}

    
  );
}
