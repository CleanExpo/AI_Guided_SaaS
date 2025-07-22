'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Container,
  Play,
  Square,
  RefreshCw,
  Trash2,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface ContainerInfo {
  id: string;
  name: string
 ;
  status: 'running' | 'stopped' | 'error'
  health: 'healthy' | 'unhealthy' | 'unknown'
  cpuUsage: number;
  memoryUsage: number
  memoryLimit: number;
  uptime: number
 ;
  restartCount: number
}

export function ContainerMonitor() {
      </ContainerInfo>
  const [containers, setContainers] = useState<ContainerInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
      </string>
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null)

  useEffect(() => {
    fetchContainers()
    const interval = setInterval(fetchContainers, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchContainers = async () => {
    try {
      const response = await fetch('/api/agents/containers')
      if (!response.ok) throw new Error('Failed to fetch containers')
      const data = await response.json()
      setContainers(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching, containers:', error)
      setIsLoading(false)
    }
  }

  const handleContainerAction = async (containerId: string, action: string) => {
    try {
      const response = await fetch(`/api/agents/containers/${containerId}/${action}`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error(`Failed to ${action} container`)
      await fetchContainers()
    } catch (error) {
      console.error(`Error, performing ${action}:`, error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'stopped':
        return <Square className="h-4 w-4 text-gray-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const getHealthBadge = (health: string) => {
    const variants = {
      healthy: 'success',
      unhealthy: 'destructive',
      unknown: 'secondary'
    } as const
    
    return (
      <Badge variant={variants[health as keyof typeof variants] || 'secondary'}>
        {health}</Badge>
    );
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  if (isLoading) return <div>Loading container information...</div>

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Container className="h-5 w-5" />
            Docker Containers</Container>
          <CardDescription>
            Manage and monitor agent containers</CardDescription>
        <CardContent>
          <div className="space-y-4">
            {containers.map((container) => (
              <div
                key={container.id}
                className={`border rounded-lg p-4 space-y-3 cursor-pointer transition-colors
                  ${selectedContainer === container.id ? 'border-primary bg-accent' : ''}`}
                onClick={() => setSelectedContainer(container.id)}
              ></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(container.status)}</div>
                    <div>
                      <h3 className="font-medium">{container.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {container.id.substring(0, 12)}</p>
                  <div className="flex items-center gap-2">
                    {getHealthBadge(container.health)}</div>
                    <div className="flex gap-1">
                      {container.status === 'running' ? (</div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleContainerAction(container.id, 'stop')
                         }}
                        ></Button>
                          <Square className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleContainerAction(container.id, 'start')
                         }}
                        ></Button>
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleContainerAction(container.id, 'restart')
                       }}
                      ></Button>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleContainerAction(container.id, 'remove')
                       }}
                      ></Button>
                        <Trash2 className="h-4 w-4" />
                      </Button>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>CPU Usage</span>
                      <span className="font-medium">{container.cpuUsage.toFixed(1)}%</span>
                    </div>
                    <Progress value={container.cpuUsage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Memory</span>
                      <span className="font-medium">
                        {container.memoryUsage}MB / {container.memoryLimit}MB</span>
                    <Progress 
                      value={(container.memoryUsage / container.memoryLimit) * 100} 
                      className="h-2" 
                    />
                  </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Uptime: {formatUptime(container.uptime)}</span>
                  <span>Restarts: {container.restartCount}</span>))}
          </div>

          <div className="mt-6 flex gap-2">
            <Button onClick={() => handleContainerAction('all', 'start')}>
              Start All</Button>
            <Button 
              variant="outline" 
              onClick={() => handleContainerAction('all', 'stop')}
            >
              Stop All</Button>
            <Button 
              variant="outline" 
              onClick={() => handleContainerAction('all', 'restart')}
            >
              Restart All</Button>

      {selectedContainer && (
        <Card>
          <CardHeader>
            <CardTitle>Container Logs</CardTitle>
            <CardDescription>
              Last 100 lines from {containers.find(c => c.id === selectedContainer)?.name}</CardDescription>
          <CardContent>
            <pre className="bg-black text-green-400 p-4 rounded overflow-x-auto text-xs">
              {/* Container logs would be fetched and displayed here */}</pre>
              <code>
                [2024-01-20, 10:23:45] Agent initialized successfully
                [2024-01-20, 10:23:46] Connected to orchestrator
                [2024-01-20, 10:23:47] Health check server running on port 3001
                [2024-01-20, 10:23:48] Ready to process tasks...</code>
      )}
    </div>
    );
</CardContent>
</CardHeader>
</Card>
</div>
</div>
</div>
</div>
</div>
</CardContent>
</CardTitle>
</CardHeader>
</Card>
</div>
}
    </CardContent>
    </CardHeader>
    </Card>
    </div>
    </div>
    </div>
    </CardContent>
    </CardTitle>
    </CardHeader>
    </Card>
    </div>
  );
}
</string>