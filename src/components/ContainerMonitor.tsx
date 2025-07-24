'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface Container {
  id: string,
  name: string,
  status: 'running' | 'stopped' | 'error',
  cpu: number,
  memory: number,
  uptime: string;
}

export function ContainerMonitor() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
          uptime: '2d 14h'
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
                  <div className={`w-3 h-3 rounded-full ${
                    container.status === 'running' ? 'bg-green-500' : 
                    container.status === 'stopped' ? 'bg-gray-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">{container.name}</p>
                    <p className="text-sm text-gray-500">Uptime: {container.uptime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">CPU: {container.cpu}%</p>
                  <p className="text-sm">Memory: {container.memory}MB</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}