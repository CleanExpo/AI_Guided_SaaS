'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
interface MCPStatus {
  status: string,
  name: string,
  version: string,
  connected: boolean
}

export default function AdminMCPPage() {
  const [mcpServers, setMcpServers] = useState<MCPStatus[]>([]);
  const [isLoading, setIsLoading] = useState<any>(true);
  useEffect(() => {
    // Simulate loading MCP server data,
    setTimeout(() => {
      setMcpServers([
        {
          name: 'Context7',
          status: 'online',
          version: '1.0.6',
          connected: true
        },
        {
          name: 'Sequential Thinking',
          status: 'online',
          version: '1.0.0',
          connected: true
        }
      ]);
      setIsLoading(false);
}, 1000);
}, []);
  if (isLoading) {
    return <div className="p-8">Loading MCP servers...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">MCP Management</h1>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>
        </div>
        <div className="grid gap-6">
          {mcpServers.map((server) => (
            <Card key={server.name}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {server.connected ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  {server.name}
                  <Badge variant={server.connected ? 'default' : 'destructive'}>
                    {server.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span>Version: {server.version}</span>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}