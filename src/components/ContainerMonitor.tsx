'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

interface Container {
  id: string,
  name: string,
  status: 'running' | 'stopped' | 'error',
  cpu: number,
  memory: number,
  uptime: string
}

export function ContainerMonitor() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [isLoading, setIsLoading] = useState<any>(true);
  
  useEffect(() => {
    // Simulate loading container data
    setTimeout(() => {
      setContainers([
        {
          id: '1',
          name: 'web-server',
          status: 'running',
          cpu: 45,
          memory: 512,
          uptime: '2h 15m'
        },
        {
          id: '2',
          name: 'database',
          status: 'running',
          cpu: 23,
          memory: 1024,
          uptime: '5h 32m'
        }
      ]);
      setIsLoading(false);
}, 1000);
}, []);
  
  if (isLoading) {
    return <div>Loading container information...</div>;
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Container Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {containers.map((container) => (
              <div key={container.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {container.status === 'running' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">{container.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>CPU: {container.cpu}%</span>
                  <span>Memory: {container.memory}MB</span>
                  <Badge variant={container.status === 'running' ? 'default' : 'destructive'}>
                    {container.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}