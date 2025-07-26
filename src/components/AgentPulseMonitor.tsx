// Type checking disabled for this file
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
  cooldownRemaining: number;
}

interface PulseStatus {
  pulse: {
    config: {
      maxConcurrentAgents: number;
      pulseInterval: number;
      cooldownPeriod: number;
      maxMemoryUsage: number;
      maxCpuUsage: number;
    };
    taskQueue: {
      length: number;
      priorities: {
        low?: number;
        medium?: number;
        high?: number;
        critical?: number;
      };
    };
    resources: {
      cpuUsage: number;
      memoryUsage: number;
    };
    activeAgents: string[];
  };
  agents: AgentMetrics[];
}

export function AgentPulseMonitor() {
  const [pulseStatus, setPulseStatus] = useState<PulseStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/agents/pulse-status');
      if (!response.ok) throw new Error('Failed to fetch pulse status');
      const data = await response.json();
      setPulseStatus(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching pulse status:', error);
      setError('Failed to load pulse status');
    }
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
    } catch (error) {
      console.error('Error updating config:', error);
      setError('Failed to update configuration');
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [pulseStatus]);

  if (isLoading) {
    return (
      <Card className="glass">
        <CardContent className="p-6">
          <div className="animate-pulse">Loading pulse monitor...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !pulseStatus) {
    return (
      <Card className="glass">
        <CardContent className="p-6">
          <div className="text-red-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error || 'No pulse data available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  const { pulse, agents } = pulseStatus;

  return (
    <div className="space-y-4">
      {/* Resource Usage */}
      <Card className="glass">
        <CardHeader className="glass">
          <CardTitle className="flex items-center gap-2 glass">
            <Activity className="h-5 w-5" />
            System Resources
          </CardTitle>
          <CardDescription className="glass">Real-time resource utilization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 glass">
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

      {/* Task Queue */}
      <Card className="glass">
        <CardHeader className="glass">
          <CardTitle className="flex items-center gap-2 glass">
            <Clock className="h-5 w-5" />
            Task Queue ({pulse.taskQueue.length})
          </CardTitle>
          <CardDescription className="glass">Pending tasks by priority</CardDescription>
        </CardHeader>
        <CardContent className="glass">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {pulse.taskQueue.priorities.critical || 0}
              </div>
              <div className="text-xs text-gray-600">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {pulse.taskQueue.priorities.high || 0}
              </div>
              <div className="text-xs text-gray-600">High</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {pulse.taskQueue.priorities.medium || 0}
              </div>
              <div className="text-xs text-gray-600">Medium</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {pulse.taskQueue.priorities.low || 0}
              </div>
              <div className="text-xs text-gray-600">Low</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Agents */}
      <Card className="glass">
        <CardHeader className="glass">
          <CardTitle className="flex items-center gap-2 glass">
            <Users className="h-5 w-5" />
            Active Agents ({pulse.activeAgents.length}/{pulse.config.maxConcurrentAgents})
          </CardTitle>
          <CardDescription className="glass">Currently running agent instances</CardDescription>
        </CardHeader>
        <CardContent className="glass">
          <div className="space-y-3">
            {agents.map((agent) => (
              <div key={agent.agentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{agent.agentId}</div>
                  <div className="text-sm text-gray-600">
                    Executions: {agent.executionCount} | Avg: {agent.averageExecutionTime}ms
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={agent.isAvailable ? 'default' : 'secondary'}>
                    {agent.isAvailable ? 'Available' : 'Busy'}
                  </Badge>
                  {agent.cooldownRemaining > 0 && (
                    <Badge variant="outline">
                      Cooldown: {agent.cooldownRemaining}s
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card className="glass">
        <CardHeader className="glass">
          <CardTitle className="glass">Pulse Configuration</CardTitle>
          <CardDescription className="glass">System limits and intervals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 glass">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Max Concurrent Agents</label>
              <div className="text-lg">{pulse.config.maxConcurrentAgents}</div>
            </div>
            <div>
              <label className="text-sm font-medium">Pulse Interval</label>
              <div className="text-lg">{pulse.config.pulseInterval}ms</div>
            </div>
            <div>
              <label className="text-sm font-medium">Cooldown Period</label>
              <div className="text-lg">{pulse.config.cooldownPeriod}ms</div>
            </div>
            <div>
              <label className="text-sm font-medium">Max CPU Usage</label>
              <div className="text-lg">{pulse.config.maxCpuUsage}%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}