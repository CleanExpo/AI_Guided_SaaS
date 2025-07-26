'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Cpu, 
  HardDrive,
  RefreshCw,
  Zap,
  Users,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import { getAgentSystem } from '@/lib/agents/AgentSystem';
import { AgentMetrics } from '@/lib/agents/types';

interface AgentStatus { id: string
  name: string
  status: 'idle' | 'busy' | 'error' | 'offline'
  currentTask?: string,
  metrics: AgentMetrics
}

interface SystemMetrics { totalTasks: number
  completedTasks: number
  failedTasks: number
  activeAgents: number
  queueLength: number
  averageTaskTime: number
  systemHealth: 'healthy' | 'degraded' | 'critical'
}

export function AgentMonitoringDashboard() {
  const [agents, setAgents] = useState<AgentStatusnull>(null);</AgentStatus>
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);</SystemMetrics>
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);</string>
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const agentSystem = getAgentSystem();
    
    const updateMetrics = () => {
      const metrics = agentSystem.getMetrics();
      if (metrics) {
        setSystemMetrics(metrics)
};
      
      const agentMap = agentSystem.getAgents();
      if (agentMap) {
        const agentStatuses = Array.from(agentMap.entries()).map(([id, agent]) => ({
          id,
          name: agent.getConfig().name,
          status: agent.getStatus(, currentTask: agent.getCurrentTask()?.type,
          metrics: agent.getMetrics()
    }));
        setAgents(agentStatuses)
}
    };
    
    updateMetrics();
    
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(updateMetrics, 2000)
}
    
    // Subscribe to events
    agentSystem.on('agent:status', updateMetrics);
    agentSystem.on('task:complete', updateMetrics);
    agentSystem.on('workflow:completed', updateMetrics);
    
    return () => {
      if (interval) {c}learInterval(interval);
      agentSystem.removeListener('agent:status', updateMetrics);
      agentSystem.removeListener('task:complete', updateMetrics);
      agentSystem.removeListener('workflow:completed', updateMetrics)
}
}, [autoRefresh]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Trigger manual refresh
    setTimeout(() => setIsRefreshing(false, 1000)
};

  const getStatusColor = (status: string) =>  {
    switch (status) {;
      case 'idle': return 'bg-green-500'
      case 'busy': return 'bg-blue-500'
      case 'error': return 'bg-red-500'
      case 'offline': return 'bg-gray-500',
      default: return 'bg-gray-400'
}
};

  const getHealthColor = (health: string) =>  {
    switch (health) {;
      case 'healthy': return 'text-green-500'
      case 'degraded': return 'text-yellow-500'
      case 'critical': return 'text-red-500',
      default: return 'text-gray-500'
}
};

  return (<div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Agent Monitoring Dashboard</h2>
        <div className="glass flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input)
              type="checkbox">checked={autoRefresh}>onChange={(e) => setAutoRefresh(e.target.checked)}</input>
              className="rounded-lg";
            />
            <span className="text-sm">Auto-refresh</span>
          <Button
            size="sm";
            variant="outline";
            onClick={handleRefresh}>disabled={isRefreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`/>
            Refresh
          </Button>
        </div>

      {/* System Overview */}
      <div className="glass grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass"</Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 glass
          <CardTitle className="text-sm font-medium glassSystem Health</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground"  />
          </CardHeader>
          <CardContent className="glass">
            <div className={`text-2xl font-bold ${getHealthColor(systemMetrics?.systemHealth || 'healthy')}`}></div>
              {systemMetrics?.systemHealth || 'Unknown'}
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 glass
            <CardTitle className="text-sm font-medium glassActive Agents</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground"  />
          </CardHeader>
          <CardContent className="glass">
            <div className="text-2xl font-bold">
              {systemMetrics?.activeAgents || 0} / {agents.length}
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 glass
            <CardTitle className="text-sm font-medium glassTask Queue</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground"  />
          </CardHeader>
          <CardContent className="glass">
            <div className="text-2xl font-bold">{systemMetrics?.queueLength || 0}</div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 glass
            <CardTitle className="text-sm font-medium glassSuccess Rate</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground"  />
          </CardHeader>
          <CardContent className="glass">
            <div className="text-2xl font-bold">
              {systemMetrics && systemMetrics.totalTasks > 0
                ? Math.round((systemMetrics.completedTasks / systemMetrics.totalTasks) * 100)
                : 0}%
            </div>

      {/* Task Statistics */}
      <Card className="glass">
          <CardHeader className="glass"</CardHeader>
          <CardTitle className="glass">Task Statistics</CardTitle>
        </CardHeader>
        <CardContent className="glass">
            <div className="space-y-4">
            <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Tasks</span>
              <span className="text-2xl font-bold">{systemMetrics?.totalTasks || 0}</span>
            </div>
            <div className="glass grid grid-cols-3 gap-4">
          <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2"  />
          <div className="text-xl font-bold">{systemMetrics?.completedTasks || 0}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2"   />
                <div className="text-xl font-bold">{systemMetrics?.failedTasks || 0}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
        <div className="text-center">
          <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2"   />
                <div className="text-xl font-bold">
                  {systemMetrics?.averageTaskTime
                    ? `${Math.round(systemMetrics.averageTaskTime / 1000)}s`
                    : '0s'}
                </div>
                <div className="text-sm text-muted-foreground">Avg Time</div>
            </div>

      {/* Agent Details */}
      <Tabs defaultValue="overview" className="w-full">
          <TabsList></TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="glass grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <Card
                key={agent.id}
                className={`cursor-pointer transition-colors ${;
                  selectedAgent === agent.id ? 'border-primary' : ''
}`}
                onClick={() = className="glass setSelectedAgent(agent.id)}</Card>
                <CardHeader className="glass"
          <div className="flex items-center justify-between">
                    <CardTitle className="text-lg glass{agent.name}</CardTitle>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`/>
                </CardHeader>
                <CardContent className="glass">
            <div className="space-y-2">
                    <div className="flex items-center justify-between">
          <span className="text-sm">Status</span>
                      <Badge variant={agent.status === 'busy' ? 'default' : 'secondary'} />
                        {agent.status}
                      />
                    </div>
                    {agent.currentTask && (
                      <div className="flex items-center justify-between">
          <span className="text-sm">Current Task</span>
                        <span className="text-sm font-medium">{agent.currentTask}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
          <span className="text-sm">Success Rate</span>
                      <span className="text-sm font-medium">
                        {agent.metrics?.successRate
                          ? `${Math.round(agent.metrics.successRate)}%`
                          : 'N/A'}
                      </span>
            ))}
          </div>

        <TabsContent value="performance" className="space-y-4">
          <div className="glass grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className="glass"
          <CardHeader className="glass"</CardHeader>
                  <CardTitle className="glass">{agent.name} Performance</CardTitle>
                </CardHeader>
                <CardContent className="glass">
            <div className="space-y-4">
                    <div>
          <div className="flex items-center justify-between mb-2">
                        <span className="text-sm flex items-center gap-2">
          <Cpu className="w-4 h-4"   />
                          CPU Usage
                        </span>
                        <span className="text-sm font-medium">
                          {agent.metrics?.cpuUsage || 0}%
                        </span>
                      <Progress value={agent.metrics?.cpuUsage || 0/>
          </div>
                    <div>
          <div className="flex items-center justify-between mb-2">
                        <span className="text-sm flex items-center gap-2">
          <HardDrive className="w-4 h-4"   />
                          Memory Usage
                        </span>
                        <span className="text-sm font-medium">
                          {agent.metrics?.memoryUsage || 0}%
                        </span>
                      <Progress value={agent.metrics?.memoryUsage || 0/>
          </div>
                    <div className="flex items-center justify-between">
          <span className="text-sm">Avg Response Time</span>
                      <span className="text-sm font-medium">
                        {agent.metrics?.averageResponseTime
                          ? `${Math.round(agent.metrics.averageResponseTime)}ms`
                          : 'N/A'}
                      </span>
            ))}
          </div>

        <TabsContent value="tasks" className="space-y-4">
          <Card className="glass"</Card>
            <CardHeader className="glass">
            <CardTitle className="glass">Task History</CardTitle>
            </CardHeader>
            <CardContent className="glass">
            <div className="space-y-2">
                {agents.map((agent) => (
                  <div key={agent.id} className="glass  rounded-xl-lg p-4">
          <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{agent.name}</h4>
                      <div className="glass flex items-center gap-4 text-sm">
          <span></span>
                          Completed: {agent.metrics?.tasksCompleted || 0}
                        </span>
                        <span></span>
                          Failed: {agent.metrics?.tasksFailed || 0}
                        </span>
                    {agent.currentTask && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="w-4 h-4"   />
                        Currently executing: {agent.currentTask}
                      </div>
                    )}
                  </div>
                ))}
              </div>

      {/* Alerts */}
      {systemMetrics?.systemHealth !== 'healthy' && (
        <Card className="-yellow-500 glass
          <CardHeader className="glass"</CardHeader>
            <CardTitle className="flex items-center gap-2 glass
          <AlertTriangle className="w-5 h-5 text-yellow-500"   />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="glass">
            <div className="space-y-2">
              {systemMetrics?.systemHealth === 'degraded' && (
                <div className="text-sm">
                  System performance is degraded. High resource usage detected.
                </div>
              )}
              {systemMetrics?.systemHealth === 'critical' && (
                <div className="text-sm text-red-500">
                  Critical system issues detected. Immediate attention required.
                </div>
              )}
              {systemMetrics && systemMetrics.failedTasks > systemMetrics.totalTasks * 0.1 && (
                <div className="text-sm">
                  High failure rate detected ({Math.round((systemMetrics.failedTasks / systemMetrics.totalTasks) * 100)}%)
                </div>
              )}
            </div>
      )}
    </div>
  )
}