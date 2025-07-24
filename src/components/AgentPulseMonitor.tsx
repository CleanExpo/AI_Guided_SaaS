// @ts-nocheck
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Cpu, HardDrive, Users, Clock, AlertCircle } from 'lucide-react';

interface AgentMetrics { agentId: string;
  isAvailable: boolean;
  executionCount: number;
  averageExecutionTime: number;
  cooldownRemaining: number
}

interface PulseStatus { pulse: {
    config: {
      maxConcurrentAgents: number;
      pulseInterval: number;
      cooldownPeriod: number;
      maxMemoryUsage: number;
      maxCpuUsage: number
    },
    taskQueue: { length: number;
      priorities: {
        low?: number, medium?: number, high?: number;
        critical?: number
}};
    resources: { cpuUsage: number;
      memoryUsage: number };
    activeAgents: string[]},
  agents: AgentMetrics[]}

export function AgentPulseMonitor() {
  const [pulseStatus, setPulseStatus] = useState<PulseStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true);
  
const [error, setError] = useState<string | null>(null) { async () => {
    try {;
      const response = await fetch('/api/agents/pulse-status');
      if (!response.ok) throw new Error('Failed to fetch status');
      
const data = await response.json();
      setPulseStatus(data);
      setError(null);
} catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pulse status')
} finally {
      setIsLoading(false);
}
  };

  
const updateConfig = async (updates: Record<string, any>) => {
    try {
      const response = await fetch('/api/agents/pulse-config', { method: 'POST',
        headers: { 'Content-Type': 'application/json'  },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update config');
      await fetchStatus()
} catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update')
}
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval)
}, []);

  if (isLoading) {r}eturn <div>Loading pulse monitor...
  if (error) {r}eturn <div className="text-red-600">Error: {error}
  if (!pulseStatus) {r}eturn <div>No pulse data available

  
const { pulse, agents } = pulseStatus;

  return (
    <div className="space-y-4">
      {/* Resource Usage */}
      <Card>
          <CardHeader>
          <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5"     />
            System Resources
          
          <CardDescription>Real-time resource utilization
        
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4"    />
          <span className="text-sm">CPU Usage
              
              <span className="text-sm font-medium">
                {pulse.resources.cpuUsage.toFixed(1)}%
              
            <Progress
              value={pulse.resources.cpuUsage}
              className={pulse.resources.cpuUsage > pulse.config.maxCpuUsage ? 'bg-red-100' : ''}
            />
          
          
          <div>
          <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4"     />
                <span className="text-sm">Memory Usage
              
              <span className="text-sm font-medium">
                {pulse.resources.memoryUsage.toFixed(1)}%
              
            <Progress value={pulse.resources.memoryUsage} className={pulse.resources.memoryUsage > pulse.config.maxMemoryUsage ? 'bg-red-100' : ''} />
          

      {/* Agent Status */}
      <Card>
          <CardHeader>
          <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5"     />
            Agent Status
          
          <CardDescription>
            {pulse.activeAgents.length}/{pulse.config.maxConcurrentAgents} agents active
          
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <div key={agent.agentId} className="border rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{agent.agentId}
                  <Badge variant={agent.isAvailable ? "success" : "secondary"}>
                    {agent.isAvailable ? "Available" : "Busy"}
                  
                
                <div className="text-sm text-gray-600 space-y-1">
          <div>Executions: { agent.executionCount }
                  <div>Avg Time: { agent.averageExecutionTime.toFixed(0) }ms
                  {agent.cooldownRemaining > 0 && (
                    <div className="flex items-center gap-1 text-amber-600">
          <Clock className="h-3 w-3"    />, Cooldown: { agent.cooldownRemaining }ms
                    
                  )}
                
            ))}
          

      {/* Task Queue */}
      <Card>
          <CardHeader>
          <CardTitle>Task Queue
          <CardDescription>
            {pulse.taskQueue.length} tasks pending
          
        
        <CardContent>
          <div className="space-y-2">
            {Object.entries(pulse.taskQueue.priorities).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
          <span className="capitalize">{priority}
                <Badge>{count || 0}
              
            ))}
          

      {/* Configuration */}
      <Card>
          <CardHeader>
          <CardTitle>Pulse Configuration
        
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
          <span className="text-gray-600">Max Concurrent:
              <span className="ml-2 font-medium">{pulse.config.maxConcurrentAgents}
            
            <div>
          <span className="text-gray-600">Pulse Interval:
              <span className="ml-2 font-medium">{pulse.config.pulseInterval}ms
            
            <div>
          <span className="text-gray-600">Cooldown Period:
              <span className="ml-2 font-medium">{pulse.config.cooldownPeriod}ms
            
            <div>
          <span className="text-gray-600">CPU Limit:
              <span className="ml-2 font-medium">{pulse.config.maxCpuUsage}%
            
          <Button
            onClick={() => updateConfig({ maxConcurrentAgents: pulse.config.maxConcurrentAgents + 1 })}
            size="sm"
            className="mt-4"
          >
            Increase Agent Limit
          
        
      
    
  )
}
}