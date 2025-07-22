'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Share2, MessageCircle, Clock, Globe, Lock, Zap } from 'lucide-react';

export default function CollaboratePage() {
  const { data: session, status } = useSession();
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [showWorkspace, setShowWorkspace] = useState(false);

  const mockProjects = [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Building a modern e-commerce solution with AI-powered recommendations',
      members: 5,
      lastActivity: '2 hours ago',
      status: 'active',
      isPublic: false
    },
    {
      id: '2',
      name: 'Mobile App UI',
      description: 'Designing intuitive mobile interfaces for productivity app',
      members: 3,
      lastActivity: '1 day ago',
      status: 'review',
      isPublic: true
    },
    {
      id: '3',
      name: 'API Documentation',
      description: 'Comprehensive API documentation with interactive examples',
      members: 2,
      lastActivity: '3 days ago',
      status: 'completed',
      isPublic: true
    }
  ];

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Collaborative Workspace
          </h1>
          <p className="text-gray-600">
            Work together with your team to build amazing applications.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Share2 className="h-4 w-4" />
              <span>Join Project</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>12 Active Members</span>
            </Badge>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockProjects.map((project) => (
            <Card 
              key={project.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setActiveProject(project.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  {project.isPublic ? (
                    <Globe className="h-4 w-4 text-green-600" />
                  ) : (
                    <Lock className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{project.members}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{project.lastActivity}</span>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={
                      project.status === 'active' ? 'default' :
                      project.status === 'review' ? 'secondary' : 'outline'
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Collaboration Features
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Chat</h3>
              <p className="text-sm text-gray-600">
                Communicate with your team instantly while working on projects.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Sharing</h3>
              <p className="text-sm text-gray-600">
                Share your projects with team members or make them public.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Collaboration</h3>
              <p className="text-sm text-gray-600">
                Work together in real-time with live cursors and instant updates.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Team Management</h3>
              <p className="text-sm text-gray-600">
                Manage team roles, permissions, and project access easily.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}