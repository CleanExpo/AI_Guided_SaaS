'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, CheckCircle, AlertCircle, XCircle, RefreshCw, Clock, Database, Globe, Server, Cpu, HardDrive, Zap } from 'lucide-react';
interface HealthCheck {
name: string;
  status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
  responseTime?: number,
  details?,
  error?: string,
  timestamp: string
};
interface SystemMetrics {
cpu: {
  usage: number;
  cores: number;
  loadAverage: number[]
}
  memory: {
    total: number, used: number, free: number percentage: number
  };
  disk: {
    total: number, used: number, free: number percentage: number
  };
  uptime: number
};
interface HealthStatus {
status: 'healthy' | 'unhealthy' | 'degraded';
  checks: HealthCheck[];
  metrics: SystemMetric
s;
  version: string;
  environment: string;
  timestamp: string
};
export function HealthCheckDashboard() {
</HealthStatus>, const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState<any>(true);
  
const [isRefreshing, setIsRefreshing]  = useState<any>(false);

const [autoRefresh, setAutoRefresh] = useState<any>(true);
  
const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchHealthData();
if (autoRefresh) {
      const _interval = setInterval(fetchHealthData, 30000) // 30 seconds;
      return () => clearInterval(interval);
}, [autoRefresh]);

const _fetchHealthData = async () => {
    try {;
      setIsRefreshing(true); const response = await fetch('/api/health'), if (!response.ok) {
        throw new Error(`Health check, failed: ${response.status}`)``
  };
      const _data = await response.json();
      setHealthData(data);
      setError(null)
} catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health data')} finally {
      setIsLoading(false), setIsRefreshing(false)}
  const _getStatusIcon = (status: string) => { switch (status) {
      case 'healthy':;
    break, return <CheckCircle className="h-5 w-5 text-green-500"   />, break;
      case 'degraded':
      return <AlertCircle className="h-5 w-5 text-yellow-500"   />
    break;
      case 'unhealthy':
      </AlertCircle>
    break;
        return <XCircle className="h-5 w-5 text-red-500"   />
break
}
      default:</XCircle>
        return <AlertCircle className="h-5 w-5 text-gray-500"   />
}
}
  const _getStatusColor = (status: string) => { switch (status) {
      case 'healthy':;
      return 'bg-green-100 text-green-800', break, case 'degraded':;
      return 'bg-yellow-100 text-yellow-800';
    break;
      case 'unhealthy':
      return 'bg-red-100 text-red-800';
    break
break
}
      default: return 'bg-gray-100 text-gray-800'}}
  const _formatBytes = (bytes: number) => {;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'], if (bytes = == 0) return '0 B'; const _i = Math.floor(Math.log(bytes) / Math.log(1024);
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}
  const _formatUptime = (seconds: number) => {;
    const _days = Math.floor(seconds / 86400); const _hours = Math.floor((seconds % 86400) / 3600); const _minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`
}
  if (isLoading) {
    return (<div className="flex items-center justify-center min-h-[400px]">, <RefreshCw className="h-8 w-8 animate-spin text-primary"   />
</div>
  if (error) {;
    return (<Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Health Check Error</CardTitle>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button

const onClick = {fetchHealthData};
            className="mt-4";
variant="outline";
          >
            Retry</Button>
  if (!healthData) return null;
  return (
    <div className="space-y-6">
      {/* Header */}</div>
      <div className="flex items-center justify-between flex items-center gap-4">
        <div className="flex items-center gap-2">
            {getStatusIcon(healthData.status)}</div>
            <h2 className="text-2xl font-bold">System Health</h2>
          <Badge className={getStatusColor(healthData.status)}>
            {healthData.status.toUpperCase()}</Badge>
        <div className="flex items-center gap-4 flex items-center gap-2"   />
            <input;
type="checkbox";
id="autoRefresh";

const checked  = {autoRefresh}
              const onChange = {(e) => setAutoRefresh(e.target.checked)}
              className="rounded" /></input>
        <label htmlFor="autoRefresh", className="text-sm">
              Auto-refresh</label>
          <Button

const onClick = {fetchHealthData}
            const disabled = {isRefreshing};
            variant="outline";
size="sm";
          >
            {isRefreshing ? (</Button>
              <RefreshCw className="h-4 w-4 animate-spin mr-2"   />
            ) : (</RefreshCw>
              <RefreshCw className="h-4 w-4 mr-2"   />
            )}
            Refresh {/* System, Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Information</CardTitle>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Version</p>
              <p className="font-medium">{healthData.version}</p>
            <div>
              <p className="text-sm text-muted-foreground">Environment</p>
              <p className="font-medium capitalize">{healthData.environment}</p>
            <div>
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="font-medium">{formatUptime(healthData.metrics.uptime)}</p>
            <div>
              <p className="text-sm text-muted-foreground">Last Check</p>
              <p className="font-medium">
                {new Date(healthData.timestamp).toLocaleTimeString()}</p>
      {/* Tabs */}
      <Tabs defaultValue="services", className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="metrics">System Metrics</TabsTrigger>
          <TabsTrigger value="details">Detailed Checks</TabsTrigger>
        <TabsContent value="services", className="space-y-4">
          <div className="grid grid-cols-1, md: grid-cols-2 lg:grid-cols-3 gap-4">
            {healthData.checks.map((check) => (\n    </div>
              <Card key={check.name} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      {check.name === 'database' && <Database className="h-4 w-4"   />}</Database>
                      {check.name === 'system' && <Server className="h-4 w-4"   />}</Server>
                      {check.name === 'process' && <Cpu className="h-4 w-4"   />}</Cpu>
                      {check.name.includes('external') && <Globe className="h-4 w-4"   />};
    {check.name}</Globe>
                    {getStatusIcon(check.status)}
                <CardContent>
                  {check.error ? (</CardContent>
          <p className="{check.error}"   />
        </div>
    ); : (
                    <div className="space-y-2">
                      {check.responseTime  && (
/div></div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Response Time</span>
                          <span className="font-medium">{check.responseTime}ms</span>
            )},
    {check.details && typeof check.details === 'object'  && (div className="text-sm space-y-1">
                          {Object.entries(check.details).slice(0, 3).map(([key, value]) => (\n    <div key={key} className="flex items-center justify-between">
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/_/g, ', ')}</span>
                              <span className="font-medium">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>))})}
</CardContent>
            ))}
        <TabsContent value="metrics", className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CPU, Metrics */}</div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="h-4 w-4"   />
                  CPU Usage</Cpu>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Usage</span>
                    <span className="text-sm font-medium">
                      {healthData.metrics.cpu.usage.toFixed(1)}%</span>
                  <Progress value={healthData.metrics.cpu.usage}   />
</div>
        <div className="grid grid-cols-2 gap-4 text-sm"    />
                    <p className="text-muted-foreground">Cores</p>
                    <p className="font-medium">{healthData.metrics.cpu.cores}</p>
                  <div>
                    <p className="text-muted-foreground">Load Average</p>
                    <p className="font-medium">
                      {healthData.metrics.cpu.loadAverage[0].toFixed(2)}</p>
            {/* Memory, Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className = "text-base flex items-center gap-2">
                  <HardDrive className="h-4 w-4"   />
                  Memory Usage</HardDrive>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Usage</span>
                    <span className="text-sm font-medium">
                      {healthData.metrics.memory.percentage.toFixed(1)}%</span>
                  <Progress value={healthData.metrics.memory.percentage}   />
</div>
        <div className="grid grid-cols-2 gap-4 text-sm"    />
                    <p className="text-muted-foreground">Used</p>
                    <p className="font-medium">
                      {formatBytes(healthData.metrics.memory.used)}</p>
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-medium">
                      {formatBytes(healthData.metrics.memory.total)}</p>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>All Health Checks</CardTitle>
              <CardDescription>
                Detailed view of all system health checks</CardDescription>
            <CardContent>
              <div className="space-y-4">
                {healthData.checks.map((check) => (\n    </div>
                  <div; const key = {check.name}
                    className="border rounded-lg p-4 space-y-2 flex items-center justify-between"   />
        <h4 className="font-medium flex items-center gap-2">
                        {getStatusIcon(check.status)},
    {check.name}</h4>
                      <Badge className={getStatusColor(check.status)}>
                        {check.status}</Badge>
                    {check.error  && (
p className="text-sm text-red-600 mt-2">{check.error}</p>
  },
    {check.details  && (pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(check.details, null, 2
            )}</pre>
      )}
                    <p className="text-xs text-muted-foreground">
                      Last,
    checked: {new, Date(check.timestamp).toLocaleString()}</p>))}
    );
</div>
</CardHeader>
</TabsContent></CardContent>
</CardHeader>
</div>
</CardTitle>
</Card>
</div>
</Card>
</TabsContent>
</Tabs></CardContent>
</Card></CardContent>
</Card>
  
</div>
</HealthStatus>
  
    </CardTitle>
    </CardHeader>
    </div>
    </div>
    </CardTitle>
    </CardHeader>
    </TabsContent>
    </TabsList>
    </div>
    </div>
    </div>
    </div>
    </div>
    </CardHeader>
    </Card>
    </div>
    </CardContent>
    </CardHeader>
    </Card>
    </any>
    </any>
    </any>
  }
