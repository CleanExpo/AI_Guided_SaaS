'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Cpu, HardDrive, Users, Clock, AlertCircle } from 'lucide-react';
interface AgentMetrics {
agentId: string;
    isAvailable: boolean;
    executionCount: number;
    averageExecutionTime: number;
    cooldownRemaining: number 
}
interface PulseStatus {
pulse: {
  config: {
  maxConcurrentAgents: number;
    pulseInterval: number;
    cooldownPeriod: number;
    maxMemoryUsage: number;
    maxCpuUsage: number

}
  taskQueue: {
      length: number,
    priorities: { low?: number;
        medium?: number;
        high?: number;
        critical?: number };
}
    resources: { cpuUsage: number,
    memoryUsage: number,
    activeAgents: number,
    queuedTasks: number };
  agentPool: AgentMetrics[];
  };
}
export function AgentPulseMonitor() {
  const [status, setStatus] = useState<PulseStatus | null>(null);
  const [isLoading, setIsLoading] = useState<any>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { fetchStatus();
    const interval = setInterval(fetchStatus, 2000); // Update every 2 seconds
    return () => clearInterval(interval) }, []);
  const fetchStatus = async () => {
    try { const response = await fetch('/api/agents/pulse-status');
      if (!response.ok) throw new Error('Failed to fetch status');
      const data = await response.json();
      setStatus(data);
      setIsLoading(false) } catch (err) { setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false) }
  };

  const updateConfig = async (updates: Record<string, any>) => {
    try {
      const response = await fetch('/api/agents/pulse-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update config');
      await fetchStatus();
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to update') }
  };

  if (isLoading) return <div>Loading pulse monitor...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!status) return <div>No status data available</div>;
  const { pulse   }: any = status;
  return (
    <div className="space-y-4">
      {/* Resource, Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Resources
          </CardTitle>
          <CardDescription>Real-time resource utilization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                <span className="text-sm">CPU Usage</span>
              </div>
              <span className="text-sm font-medium">
                {pulse.resources.cpuUsage.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={pulse.resources.cpuUsage}
              className={pulse.resources.cpuUsage > pulse.config.maxCpuUsage ? 'bg-red-100' : ''}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                <span className="text-sm">Memory Usage</span>
              </div>
              <span className="text-sm font-medium">
                {pulse.resources.memoryUsage.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={pulse.resources.memoryUsage}
              className={pulse.resources.memoryUsage > pulse.config.maxMemoryUsage ? 'bg-red-100' : ''}
            />
          </div>
        </CardContent>
      </Card>
      {/* Agent, Pool Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Agent Pool
          </CardTitle>
          <CardDescription>
            {pulse.resources.activeAgents} / {pulse.config.maxConcurrentAgents} agents active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pulse.agentPool.map((agent) => (
              <div key={agent.agentId} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={agent.isAvailable ? 'default' : 'secondary'}>
                    {agent.isAvailable ? 'Available' : 'Busy'}
                  </Badge>
                  <span className="text-sm font-medium">{agent.agentId}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{agent.executionCount} runs</span>
                  <span>{agent.averageExecutionTime}ms avg</span>
                  {agent.cooldownRemaining > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{(agent.cooldownRemaining / 1000).toFixed(1)}s</span>
                    </div>
                  )}
                      </div>
))}
          </div>
        </CardContent>
      </Card>
      {/* Task, Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Task Queue
          </CardTitle>
          <CardDescription>
            {pulse.taskQueue.length} tasks pending
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {['critical', 'high', 'medium', 'low'].map((priority) => (
              <div key={priority} className="text-center p-2 border rounded">
                <div className="text-sm font-medium capitalize">{priority}</div>
                <div className="text-2xl font-bold">
                  {pulse.taskQueue.priorities[priority as keyof typeof pulse.taskQueue.priorities] || 0}
                      </div>
))}
          </div>
        </CardContent>
      </Card>
      {/* Configuration, Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Pulse Configuration</CardTitle>
          <CardDescription>Adjust agent execution parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => updateConfig({ maxConcurrentAgents: Math.max(1, pulse.config.maxConcurrentAgents - 1) })}
            >
              Reduce Agents (-1)
            </Button>
            <Button
              variant="outline"
              onClick={() => updateConfig({ maxConcurrentAgents: pulse.config.maxConcurrentAgents + 1 })}
            >
              Increase Agents (+1)
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <div>Pulse Interval: {pulse.config.pulseInterval}ms</div>
            <div>Cooldown Period: {pulse.config.cooldownPeriod}ms</div>
            <div>Max CPU: {pulse.config.maxCpuUsage}%</div>
            <div>Max Memory: {pulse.config.maxMemoryUsage}%      </div>
</CardContent>
      </Card>
          </div>

        );

      }
