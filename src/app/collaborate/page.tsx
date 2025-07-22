'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import CollaborationWorkspace from '@/components/collaboration/CollaborationWorkspace';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Plus, Share2, MessageCircle, Clock, Globe, Lock, Zap } from 'lucide-react';
export default function CollaboratePage(): void {
  const { data: session, status } = useSession();
      </string>
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [showWorkspace, setShowWorkspace] = useState(false);
  if (status === 'loading') {
    return (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  }
  if (!session) {
    redirect('/auth/signin');
}
  const handleCreateProject = () => {
    if (!projectName.trim()) return;
    const projectId = `project-${Date.now()}`;`
    setActiveProject(projectId);
    setShowWorkspace(true);
  };
  const handleJoinDemo = () => {
    setActiveProject('demo-project');
    setShowWorkspace(true);
  };
  if (showWorkspace && activeProject) {
    return (
    <div className="h-screen">
        <CollaborationWorkspace
          projectId={activeProject}
          onRoomCreated={roomId => {
         }}
        /></CollaborationWorkspace>
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">Real-time Collaboration</h1>
              <Badge variant="outline">Beta</Badge>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() =>
                  (window.location.href = '/collaborate/dashboard')
               }
              >
                Dashboard</Button>
              <span className="text-sm text-gray-600">
                Welcome, {session.user?.name}</span>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Collaborate in Real-time</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Work together on projects with live cursors, synchronized editing,
            and instant comments. Experience the future of collaborative
            development.</p>
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Live Collaboration</CardTitle>
            <CardContent>
              <CardDescription>
                See team members&apos; cursors in real-time, track who&apos;s
                working on what, and collaborate seamlessly across different
                time zones.</CardDescription>
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Instant Comments</CardTitle>
            <CardContent>
              <CardDescription>
                Add contextual comments anywhere in your project. Discuss ideas,
                provide feedback, and resolve issues directly in the workspace.</CardDescription>
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-brand-primary-600" />
                <CardTitle className="text-lg">Change Tracking</CardTitle>
            <CardContent>
              <CardDescription>
                Monitor all project changes in real-time. See who made what
                changes and when, with full version history.</CardDescription>
        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create New Project */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Start New Collaboration</span>
              </CardTitle>
              <CardDescription>
                Create a new collaborative project and invite team members to
                work together.</CardDescription>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name</label>
                <Input
                  placeholder="Enter project name..."
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleCreateProject()}
                /></Input>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Globe className="h-4 w-4" />
                <span>Public collaboration room</span>
              </div>
              <Button
                onClick={handleCreateProject}
                disabled={!projectName.trim()}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Project</Plus>
          {/* Join Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Try Demo Workspace</span>
              </CardTitle>
              <CardDescription>
                Experience real-time collaboration features with our interactive
                demo project.</CardDescription>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Live cursor tracking</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <span>Real-time comments</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Share2 className="h-4 w-4 text-brand-primary-600" />
                  <span>Instant sharing</span>
                </div>
              <Alert>
                <AlertDescription>
                  Demo mode uses simulated data to showcase collaboration
                  features.</AlertDescription>
              <Button
                onClick={handleJoinDemo}
                variant="outline"
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                Launch Demo</Zap>
        {/* Technical Features */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Powered by Modern Technology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">WebSocket Technology</h4>
              <p className="text-sm text-gray-600">
                Real-time bidirectional communication</p>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Multi-user Support</h4>
              <p className="text-sm text-gray-600">
                Unlimited concurrent collaborators</p>
            <div className="text-center">
              <div className="bg-brand-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Lock className="h-6 w-6 text-brand-primary-600" />
              </div>
              <h4 className="font-semibold mb-2">Secure & Private</h4>
              <p className="text-sm text-gray-600">
                End-to-end encrypted collaboration</p>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">Version Control</h4>
              <p className="text-sm text-gray-600">
                Complete change history tracking</p>
</div></Alert>
</div>
</CardContent>
</CardHeader>
</Card>
</div>
</CardContent>
</CardHeader>
</Card>
</CardContent>
</div>
</CardHeader>
</Card>
</CardContent>
</div>
</CardHeader>
</Card>
</CardContent>
</div>
</CardHeader>
</Card>
</div></div>
}
  );
}
