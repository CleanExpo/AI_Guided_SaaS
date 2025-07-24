// @ts-nocheck
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
        <h1 className="text-3xl font-bold">Agent Monitoring
      

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview
          <TabsTrigger value="agents">Agents
          <TabsTrigger value="containers">Containers
          <TabsTrigger value="metrics">System Metrics
          <TabsTrigger value="queue">Task Queue
          <TabsTrigger value="alerts">Alerts
        

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SystemMetrics  />
          <AlertsPanel   />
          
          <TaskQueueVisualizer  />
          

        <TabsContent value="agents">
          <AgentPulseMonitor   />
        

        <TabsContent value="containers">
          <ContainerMonitor   />
        

        <TabsContent value="metrics">
          <SystemMetrics   />
        

        <TabsContent value="queue">
          <TaskQueueVisualizer   />
        

        <TabsContent value="alerts">
          <AlertsPanel   />
        
      
    
  )
}
