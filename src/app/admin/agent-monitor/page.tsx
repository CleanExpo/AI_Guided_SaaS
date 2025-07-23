'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentPulseMonitor } from '@/components/AgentPulseMonitor';
import { ContainerMonitor } from '@/components/ContainerMonitor';
import { SystemMetrics } from '@/components/health/SystemMetrics';
import { TaskQueueVisualizer } from '@/components/health/TaskQueueVisualizer';
import { AlertsPanel } from '@/components/health/AlertsPanel';

export default function AgentMonitorPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agent Monitoring Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Real-time monitoring of AI agents with pulse control and Docker containerization
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pulse">Pulse Control</TabsTrigger>
          <TabsTrigger value="containers">Containers</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5 / 8</div>
                <p className="text-xs text-muted-foreground">2 throttled, 1 offline</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Task Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">8 high priority</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">System Load</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">CPU: 72% Memory: 64%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pulse Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Healthy</div>
                <p className="text-xs text-muted-foreground">2s interval, 5s cooldown</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SystemMetrics />
            <TaskQueueVisualizer />
          </div>
        </TabsContent>
        
        <TabsContent value="pulse">
          <AgentPulseMonitor />
        </TabsContent>
        
        <TabsContent value="containers">
          <ContainerMonitor />
        </TabsContent>
        
        <TabsContent value="metrics">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Detailed performance metrics from Prometheus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <iframe
                  src="http://localhost:9090/graph"
                  className="w-full h-[600px] border rounded"
                  title="Prometheus Metrics" 
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="alerts">
          <AlertsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}