'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Wifi,
  Battery,
  Zap,
  AlertCircle,
  CheckCircle,
  Activity,
  Gauge,
  Settings,
  TrendingUp,
  TrendingDown,
  Pause,
  Play
} from 'lucide-react';

interface ResourceData {
  cpu: {
    usage: number;
    cores: number;
    model: string;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  network: {
    bandwidth: number;
    latency: number;
  };
  battery?: {
    level: number;
    isCharging: boolean;
  };
}

interface PerformanceProfile {
  name: string;
  cpuLimit: number;
  memoryLimit: number;
  concurrentTasks: number;
  enableBackground: boolean;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceData>({
    cpu: { usage: 45, cores: 8, model: 'Intel Core i7-10700K' },
    memory: { total: 16 * 1024 * 1024 * 1024, used: 9 * 1024 * 1024 * 1024, free: 7 * 1024 * 1024 * 1024, percentage: 56.25 },
    disk: { total: 500 * 1024 * 1024 * 1024, used: 350 * 1024 * 1024 * 1024, free: 150 * 1024 * 1024 * 1024, percentage: 70 },
    network: { bandwidth: 10 * 1024 * 1024, latency: 20 },
    battery: { level: 65, isCharging: true }
  });

  const [currentProfile, setCurrentProfile] = useState('balanced');
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [history, setHistory] = useState<number[]>(Array(20).fill(0));
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const profiles: Record<string, PerformanceProfile> = {
    'high-performance': {
      name: 'High Performance',
      cpuLimit: 90,
      memoryLimit: 85,
      concurrentTasks: 10,
      enableBackground: true
    },
    'balanced': {
      name: 'Balanced',
      cpuLimit: 70,
      memoryLimit: 70,
      concurrentTasks: 5,
      enableBackground: true
    },
    'power-saver': {
      name: 'Power Saver',
      cpuLimit: 50,
      memoryLimit: 60,
      concurrentTasks: 3,
      enableBackground: false
    },
    'minimal': {
      name: 'Minimal',
      cpuLimit: 30,
      memoryLimit: 50,
      concurrentTasks: 1,
      enableBackground: false
    }
  };

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Simulate resource changes
      setResources(prev => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          usage: Math.max(0, Math.min(100, prev.cpu.usage + (Math.random() - 0.5) * 10))
        },
        memory: {
          ...prev.memory,
          percentage: Math.max(0, Math.min(100, prev.memory.percentage + (Math.random() - 0.5) * 5))
        }
      }));

      setHistory(prev => [...prev.slice(1), resources.cpu.usage]);

      // Update recommendations
      const newRecs: string[] = [];
      if (resources.cpu.usage > 80) {
        newRecs.push('High CPU usage detected. Consider closing intensive applications.');
      }
      if (resources.memory.percentage > 85) {
        newRecs.push('Memory usage is high. Close unused browser tabs.');
      }
      if (resources.battery && !resources.battery.isCharging && resources.battery.level < 20) {
        newRecs.push('Battery low. Connect to power or enable power saving.');
      }
      setRecommendations(newRecs);
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring, resources]);

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const getResourceStatus = (percentage: number) => {
    if (percentage >= 90) return { color: 'text-red-600', bg: 'bg-red-100', status: 'Critical' };
    if (percentage >= 75) return { color: 'text-orange-600', bg: 'bg-orange-100', status: 'Warning' };
    return { color: 'text-green-600', bg: 'bg-green-100', status: 'Optimal' };
  };

  const cpuStatus = getResourceStatus(resources.cpu.usage);
  const memoryStatus = getResourceStatus(resources.memory.percentage);
  const diskStatus = getResourceStatus(resources.disk.percentage);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resource-Aware System</h1>
          <p className="text-gray-600">Monitor and optimize system resource usage</p>
        </div>

        {/* Adaptive Mode Toggle */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold">Adaptive Resource Management</h3>
                  <Badge variant={adaptiveMode ? 'default' : 'secondary'}>
                    {adaptiveMode ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Automatically adjust performance based on available resources
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMonitoring(!isMonitoring)}
                >
                  {isMonitoring ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </>
                  )}
                </Button>
                <Switch
                  checked={adaptiveMode}
                  onCheckedChange={setAdaptiveMode}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* CPU */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">CPU</span>
                </div>
                <Badge className={`${cpuStatus.bg} ${cpuStatus.color}`}>
                  {cpuStatus.status}
                </Badge>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{resources.cpu.usage.toFixed(1)}%</span>
                  <span className="text-gray-500">{resources.cpu.cores} cores</span>
                </div>
                <Progress value={resources.cpu.usage} className="h-2" />
              </div>
              <p className="text-xs text-gray-500">{resources.cpu.model}</p>
            </CardContent>
          </Card>

          {/* Memory */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Memory</span>
                </div>
                <Badge className={`${memoryStatus.bg} ${memoryStatus.color}`}>
                  {memoryStatus.status}
                </Badge>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{resources.memory.percentage.toFixed(1)}%</span>
                  <span className="text-gray-500">{formatBytes(resources.memory.used)} / {formatBytes(resources.memory.total)}</span>
                </div>
                <Progress value={resources.memory.percentage} className="h-2" />
              </div>
              <p className="text-xs text-gray-500">{formatBytes(resources.memory.free)} free</p>
            </CardContent>
          </Card>

          {/* Disk */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Disk</span>
                </div>
                <Badge className={`${diskStatus.bg} ${diskStatus.color}`}>
                  {diskStatus.status}
                </Badge>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{resources.disk.percentage.toFixed(1)}%</span>
                  <span className="text-gray-500">{formatBytes(resources.disk.used)} / {formatBytes(resources.disk.total)}</span>
                </div>
                <Progress value={resources.disk.percentage} className="h-2" />
              </div>
              <p className="text-xs text-gray-500">{formatBytes(resources.disk.free)} free</p>
            </CardContent>
          </Card>

          {/* Network/Battery */}
          {resources.battery ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Battery className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">Battery</span>
                  </div>
                  {resources.battery.isCharging && (
                    <Zap className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{resources.battery.level}%</span>
                    <span className="text-gray-500">
                      {resources.battery.isCharging ? 'Charging' : 'On Battery'}
                    </span>
                  </div>
                  <Progress value={resources.battery.level} className="h-2" />
                </div>
                <p className="text-xs text-gray-500">
                  {resources.battery.isCharging ? 'AC Power' : 'Estimated 2h 30m remaining'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-cyan-600" />
                    <span className="font-medium">Network</span>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Bandwidth</span>
                    <span className="font-medium">{formatBytes(resources.network.bandwidth)}/s</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Latency</span>
                    <span className="font-medium">{resources.network.latency}ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Profiles */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Performance Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(profiles).map(([key, profile]) => (
                  <div
                    key={key}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentProfile === key ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentProfile(key)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{profile.name}</span>
                      {currentProfile === key && (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>CPU Limit: {profile.cpuLimit}%</div>
                      <div>Memory Limit: {profile.memoryLimit}%</div>
                      <div>Tasks: {profile.concurrentTasks}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Real-time Monitor */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Real-time CPU Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-end gap-1">
                {history.map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-blue-500 rounded-t transition-all duration-500"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>-40s</span>
                <span>-20s</span>
                <span>Now</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">Performance Recommendations</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Resource Settings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Resource Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium">CPU Warning Level</label>
                <input
                  type="range"
                  min="50"
                  max="90"
                  defaultValue="70"
                  className="w-full mt-2"
                />
                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                  <span>50%</span>
                  <span>70%</span>
                  <span>90%</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Memory Warning Level</label>
                <input
                  type="range"
                  min="50"
                  max="90"
                  defaultValue="75"
                  className="w-full mt-2"
                />
                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                  <span>50%</span>
                  <span>75%</span>
                  <span>90%</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Disk Warning Level</label>
                <input
                  type="range"
                  min="70"
                  max="95"
                  defaultValue="85"
                  className="w-full mt-2"
                />
                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                  <span>70%</span>
                  <span>85%</span>
                  <span>95%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}