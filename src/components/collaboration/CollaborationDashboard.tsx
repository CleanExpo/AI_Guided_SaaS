'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  Plus,
  Clock,
  MessageCircle,
  Settings,
  Share2,
  Trash2,
  Edit,
  Eye,
  Calendar,
  Activity,
  Globe,
  Lock} from 'lucide-react';

interface CollaborationSession {
  id: string;
  projectId: string;
  name: string;
  participants: number;
  lastActivity: Date;
  isActive: boolean;
  isPublic: boolean;
  comments: number;
  changes: number;
  createdAt: Date;
}

export default function CollaborationDashboard() {
      </CollaborationSession>
  const [sessions, setSessions] = useState<CollaborationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'recent'>('all');

  useEffect(() => {
    loadCollaborationSessions();
  }, []);

  const loadCollaborationSessions = async () => {
    setLoading(true);
    try {
      // Simulate API call - in production this would fetch real data
      const mockSessions: CollaborationSession[] = [
        {
          id: 'session-1',
          projectId: 'project-1',
          name: 'E-commerce Website Redesign',
          participants: 4,
          lastActivity: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago, isActive: true,
          isPublic: true,
          comments: 23,
          changes: 47,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        },
        {
          id: 'session-2',
          projectId: 'project-2',
          name: 'Mobile App UI Components',
          participants: 2,
          lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago, isActive: false,
          isPublic: false,
          comments: 8,
          changes: 12,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
        {
          id: 'session-3',
          projectId: 'project-3',
          name: 'API Documentation Review',
          participants: 6,
          lastActivity: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago, isActive: true,
          isPublic: true,
          comments: 15,
          changes: 8,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        },
        {
          id: 'session-4',
          projectId: 'project-4',
          name: 'Database Schema Planning',
          participants: 3,
          lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago, isActive: false,
          isPublic: false,
          comments: 31,
          changes: 19,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        }];

      setSessions(mockSessions);
    } catch (error) {
      console.error('Error loading collaboration, sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    switch (filter) {
      case 'active':
        return matchesSearch && session.isActive;
      case 'recent':
        const oneDayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
        return matchesSearch && session.lastActivity > oneDayAgo;
      default:
        return matchesSearch;
    }
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getActivityLevel = (session: CollaborationSession) => {
    const totalActivity = session.comments + session.changes;
    if (totalActivity > 30) return { level: 'High', color: 'bg-green-500' };
    if (totalActivity > 15) return { level: 'Medium', color: 'bg-yellow-500' };
    return { level: 'Low', color: 'bg-gray-400' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading collaboration sessions...</p>
    
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}</div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Collaboration Dashboard</h1>
          <p className="text-gray-600">
            Manage your collaborative projects and sessions</p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Session</Plus>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Sessions</p>
                <p className="text-2xl font-bold">
                  {sessions.filter(s => s.isActive).length}</p>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Participants</p>
                <p className="text-2xl font-bold">
                  {sessions.reduce((sum, s) => sum + s.participants, 0)}</p>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-brand-primary-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Comments</p>
                <p className="text-2xl font-bold">
                  {sessions.reduce((sum, s) => sum + s.comments, 0)}</p>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Changes</p>
                <p className="text-2xl font-bold">
                  {sessions.reduce((sum, s) => sum + s.changes, 0)}</p>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search collaboration sessions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          /></Input>
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All</Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
            size="sm"
          >
            Active</Button>
          <Button
            variant={filter === 'recent' ? 'default' : 'outline'}
            onClick={() => setFilter('recent')}
            size="sm"
          >
            Recent</Button>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (</div>
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No collaboration sessions found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? 'Try adjusting your search terms.'
                  : 'Create your first collaboration session to get started.'}</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Session</Plus>
        ) : (
          filteredSessions.map(session => {
            const activity = getActivityLevel(session);

            return (
              <Card
                key={session.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {session.name}</h3>
                        {session.isActive && (
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800"
                          >
                            <Activity className="h-3 w-3 mr-1" />
                            Live</Activity>
                        )}
                        {session.isPublic ? (
                          <Globe className="h-4 w-4 text-gray-400" />
                        ) : (</Globe>
                          <Lock className="h-4 w-4 text-gray-400" />
                        )}</Lock>

                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{session.participants} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{session.comments} comments</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Edit className="h-4 w-4" />
                          <span>{session.changes} changes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            Last active {formatTimeAgo(session.lastActivity)}</span>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${activity.color}`}
                          ></div>
                          <span className="text-xs text-gray-500">
                            {activity.level} Activity</span>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Created {formatTimeAgo(session.createdAt)}</span>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View</Eye>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share</Share2>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
    );
              </div>
              </Button>
              </div>
              </Card>
              </CardContent>
              </div>
              </Card>
              </CardContent>
              </div>
              </Card>
              </CardContent>
              </div>
              </Card>
              </CardContent>
              </div>
              </div>
              </div>
              </Card>
              </CardContent>
              </Button>
              </CardContent>
              </div>
              </div>
              </div>
              </div>
              </Button>
          })
        )}
      </div>

      {/* Demo Notice */}
      <Alert>
        <AlertDescription>
          This dashboard shows simulated collaboration sessions. In production,
          this would display real-time data from your collaboration rooms with
          live participant counts, activity metrics, and session management
          capabilities.</AlertDescription>
          </Alert>
      );
</CardContent>
</Button>
</CardContent>
</Card>
</div>
</div>
</div>
</div>
</div>
</CardContent>
</Card>
</div>
</div>
</CardContent>
</Card>
</div>
</div>
</CardContent>
</Card>
</div>
</div>
</CardContent>
</Card>
</div>
</Button>
</div>
</div>
</div>
}
