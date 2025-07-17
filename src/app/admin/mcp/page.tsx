'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Server, 
  Zap, 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  XCircle 
} from 'lucide-react';

interface MCPStatus {
  status: string;
  timestamp: string;
  version: string;
  services: {
    mcp_server: string;
    context_manager: string;
    protocol_handler: string;
  };
  metrics: {
    active_connections: number;
    total_requests: number;
    uptime: number;
  };
}

interface MCPServer {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  url: string;
  description: string;
  tools: string[];
  resources: string[];
}

export default function MCPPage() {
  const [mcpStatus, setMcpStatus] = useState<MCPStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock MCP servers data
  const [mcpServers] = useState<MCPServer[]>([
    {
      id: 'context7',
      name: 'Context7 MCP',
      status: 'running',
      url: 'npx -y --node-options=--experimental-vm-modules @upstash/context7-mcp@1.0.6',
      description: 'Provides up-to-date documentation for libraries and frameworks',
      tools: ['resolve-library-id', 'get-library-docs'],
      resources: ['library-documentation', 'api-references']
    },
    {
      id: 'memory',
      name: 'Memory MCP',
      status: 'running',
      url: 'npx -y @modelcontextprotocol/server-memory',
      description: 'Knowledge graph for persistent memory and context retention',
      tools: ['create_entities', 'create_relations', 'search_nodes', 'read_graph'],
      resources: ['knowledge-graph', 'entity-relationships']
    },
    {
      id: 'github',
      name: 'GitHub MCP',
      status: 'running',
      url: 'npx -y @modelcontextprotocol/server-github',
      description: 'GitHub repository management and operations',
      tools: ['create_repository', 'get_file_contents', 'create_pull_request', 'search_repositories'],
      resources: ['repositories', 'pull-requests', 'issues']
    },
    {
      id: 'stripe',
      name: 'Stripe Agent Toolkit',
      status: 'running',
      url: 'node C:/Users/Disaster Recovery 4/Documents/Cline/MCP/stripe-agent-toolkit-server/dist/index.js',
      description: 'Stripe payment processing and product management',
      tools: ['create_product', 'create_price', 'create_payment_link'],
      resources: ['products', 'prices', 'payment-links']
    },
    {
      id: 'fetch',
      name: 'Fetch MCP',
      status: 'running',
      url: 'node C:/Users/Disaster Recovery 4/Documents/Cline/MCP/fetch-mcp/dist/index.js',
      description: 'Web content fetching and processing',
      tools: ['fetch_html', 'fetch_markdown', 'fetch_txt', 'fetch_json'],
      resources: ['web-content', 'api-responses']
    }
  ]);

  const fetchMCPStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/mcp/status');
      if (!response.ok) {
        throw new Error('Failed to fetch MCP status');
      }
      
      const data = await response.json();
      setMcpStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMCPStatus();
    
    // Refresh status every 30 seconds
    const interval = setInterval(fetchMCPStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'running' || status === 'operational' ? 'default' : 
                   status === 'error' ? 'destructive' : 'secondary';
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Model Context Protocol (MCP)</h1>
            <p className="text-gray-600">Manage and monitor MCP servers and their capabilities</p>
          </div>
          <Button onClick={fetchMCPStatus} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-4 w-4" />
              <span>Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {mcpStatus ? getStatusBadge(mcpStatus.status) : <Badge variant="secondary">Loading...</Badge>}
                </div>
                {mcpStatus && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Version {mcpStatus.version}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mcpStatus?.metrics.active_connections ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mcpStatus?.metrics.total_requests ?? 0} total requests
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mcpStatus ? formatUptime(mcpStatus.metrics.uptime) : '0h 0m'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Since {mcpStatus ? new Date(mcpStatus.timestamp).toLocaleString() : 'N/A'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Services Status */}
          {mcpStatus && (
            <Card>
              <CardHeader>
                <CardTitle>Services Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(mcpStatus.services).map(([service, status]) => (
                    <div key={service} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{service.replace('_', ' ').toUpperCase()}</span>
                      {getStatusBadge(status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="servers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mcpServers.map(server => (
              <Card key={server.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{server.name}</CardTitle>
                    {getStatusBadge(server.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{server.description}</p>
                  
                  <div>
                    <h4 className="font-medium mb-2">Connection</h4>
                    <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                      {server.url}
                    </code>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Tools</h4>
                      <div className="space-y-1">
                        {server.tools.slice(0, 3).map(tool => (
                          <Badge key={tool} variant="outline" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                        {server.tools.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{server.tools.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Resources</h4>
                      <div className="space-y-1">
                        {server.resources.slice(0, 3).map(resource => (
                          <Badge key={resource} variant="secondary" className="text-xs">
                            {resource}
                          </Badge>
                        ))}
                        {server.resources.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{server.resources.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mcpServers.flatMap(server => 
                  server.tools.map(tool => (
                    <div key={`${server.id}-${tool}`} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{tool}</span>
                        <Badge variant="outline" className="text-xs">
                          {server.name}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Tool provided by {server.name}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mcpServers.flatMap(server => 
                  server.resources.map(resource => (
                    <div key={`${server.id}-${resource}`} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{resource}</span>
                        <Badge variant="secondary" className="text-xs">
                          {server.name}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Resource provided by {server.name}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
