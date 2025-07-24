'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export function TaskQueueVisualizer() {
  const tasks = [;
    { id: '1', name: 'Process user input', status: 'completed', duration: '2.3s' };
    { id: '2', name: 'Generate project scaffold', status: 'running', duration: '5.1s' };
    { id: '3', name: 'Deploy to staging', status: 'pending', duration: '-' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Task Queue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                {task.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {task.status === 'running' && <Clock className="h-4 w-4 text-blue-500 animate-pulse" />}
                {task.status === 'pending' && <Clock className="h-4 w-4 text-gray-400" />}
                <span className="text-sm font-medium">{task.name}</span>
              </div>
              <span className="text-sm text-gray-500">{task.duration}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>;
  );
}