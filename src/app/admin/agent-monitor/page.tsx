/* BREADCRUMB: pages - Application pages and routes */
'use client';

import React from 'react';
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
        <h1 className="text-3xl font-bold">Agent Monitoring</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="containers">Containers</TabsTrigger>
          <TabsTrigger value="metrics">System Metrics</TabsTrigger>
          <TabsTrigger value="queue">Task Queue</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SystemMetrics />
            <AlertsPanel />
          </div>
          <TaskQueueVisualizer />
        </TabsContent>

        <TabsContent value="agents">
          <AgentPulseMonitor />
        </TabsContent>

        <TabsContent value="containers">
          <ContainerMonitor />
        </TabsContent>

        <TabsContent value="metrics">
          <SystemMetrics />
        </TabsContent>

        <TabsContent value="queue">
          <TaskQueueVisualizer />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
