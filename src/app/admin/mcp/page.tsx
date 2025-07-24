/* BREADCRUMB: app - Application page or route */
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
  lastHealthCheck: string
}

export default function AdminMCPPage() {
  const [mcpServers, setMcpServers] = useState<MCPStatus[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading MCP server status
    setTimeout(() => {
      setMcpServers([
        { status: 'running', name: 'context7', version: '1.0.0', lastHealthCheck: new Date().toISOString() },
        { status: 'running', name: 'serena', version: '2.1.0', lastHealthCheck: new Date().toISOString() },
        { status: 'running', name: 'sequential-thinking', version: '1.2.0', lastHealthCheck: new Date().toISOString() }
      ]);
      setLoading(false)
}, 1000)
}, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">MCP Server Management</h1>
        <Button>
          <RefreshCw className="w-4 h-4 mr-2"   />
          Refresh Status
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div>Loading MCP servers...</div>
        ) : (
          mcpServers.map(server => (
            <Card key={server.name}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{server.name}</span>
                  <Badge variant={server.status === 'running' ? 'default' : 'destructive'}>
                    {server.status === 'running' ? (
                      <CheckCircle className="w-3 h-3 mr-1"   />
                    ) : (
                      <XCircle className="w-3 h-3 mr-1"   />
                    )}
                    {server.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Version: {server.version}</p>
                <p>Last Check: {new Date(server.lastHealthCheck).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
