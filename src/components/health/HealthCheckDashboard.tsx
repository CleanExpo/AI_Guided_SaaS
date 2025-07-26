'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, CheckCircle, AlertCircle, XCircle, RefreshCw, Clock, Database, Globe, Server, Cpu, HardDrive, Zap } from 'lucide-react';
interface HealthCheck { name: string
  status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown'
  responseTime?: number,
  details?,
  error?: string,
  timestamp: string
};
interface SystemMetrics { cpu: {
  usage: number
  cores: number
  loadAverage: number[]
}
  memory: { total: number, used: number, free: number, percentage: number
  },
  disk: { total: number, used: number, free: number, percentage: number
  },
  uptime: number
};
interface HealthStatus { status: 'healthy' | 'unhealthy' | 'degraded',
  checks: HealthCheck[], metrics: SystemMetric
s,
  version: string
  environment: string
  timestamp: string
};
export function HealthCheckDashboard() { , const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState<any>(null)
  
const [isRefreshing, setIsRefreshing]  = useState<any>(null)

const [autoRefresh, setAutoRefresh] = useState<any>(null)
  
const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchHealthData();
if (autoRefresh) {
      const _interval = setInterval(fetchHealthData, 30000) // 30 seconds;
      return () => clearInterval(interval)
}, [autoRefresh]);

const _fetchHealthData = async () => {
    try {;
      setIsRefreshing(true); const response = await fetch('/api/health', if (!response.ok) {
        throw new Error(`Health check, failed: ${response.status };`)``
  };
      const _data = await response.json();
      setHealthData(data);
      setError(null)
} catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health data')} finally {
      setIsLoading(false, setIsRefreshing(false)}
  const _getStatusIcon = (status: string) =>  { switch (status) {
      case 'healthy':;
    break, return <CheckCircle className="h-5 w-5 text-green-500"    />, break;
      case 'degraded':
      return <AlertCircle className="h-5 w-5 text-yellow-500"     />
    break;
      case 'unhealthy':
      
    break;
        return <XCircle className="h-5 w-5 text-red-500"     />
break
};
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500"     />
}
}
  const _getStatusColor = (status: string) =>  { switch (status) {
      case 'healthy':;
      return 'bg-green-100 text-green-800', break, case 'degraded':;
      return 'bg-yellow-100 text-yellow-800';
    break;
      case 'unhealthy': return 'bg-red-100 text-red-800'
    break
break
};
      default: return 'bg-gray-100 text-gray-800'}}
  const _formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'], if (bytes = == 0) {r}eturn '0 B'; const _i = Math.floor(Math.log(bytes) / Math.log(1024);
    return `${(bytes / Math.pow(1024, i)).toFixed(2)}${sizes[i]}`
}
  const _formatUptime = (seconds: number) => {
    const _days = Math.floor(seconds / 86400); const _hours = Math.floor((seconds % 86400) / 3600); const _minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) {r}eturn `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) {r}eturn `${hours}h ${minutes}m`;
    return `${minutes}m`
}
  if (isLoading) {
    return (<div className="flex items-center justify-center min-h-[400px]">, <RefreshCw className="h-8 w-8 animate-spin text-primary"    />
          </div>)
  if (error) {;
    return (<Card className="-red-200 bg-red-50 glass">
          <CardHeader className="glass"
          <CardTitle className="text-red-800 glassHealth Check Error">
        <CardContent className="glass">
              <p className="text-red-600">{error}
          <Button

const onClick={fetchHealthData};
            className="mt-4";>variant="outline";>>
            Retry)
  if (!healthData) {r}eturn null;
  return (<div className="space-y-6">
      {/* Header */}</div>
      <div className="glass flex items-center justify-between flex items-center gap-4">
          <div className="flex items-center gap-2">)
            {getStatusIcon(healthData.status)}</div>
            <h2 className="text-2xl font-bold">System Health</h2>
          <Badge className={getStatusColor(healthData.status)} />
            {healthData.status.toUpperCase()}/>
        <div className="glass flex items-center gap-4 flex items-center gap-2"    />
          <input type="checkbox"
id="autoRefresh";>checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded-lg" />
        <label htmlFor="autoRefresh", className="text-sm">
              Auto-refresh
          <Button

onClick={fetchHealthData} disabled={isRefreshing};
            variant="outline";>size="sm";>>
            {isRefreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2"     />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2"     />
            )}
            Refresh {/* System, Info */}
      <Card className="glass">
            <CardHeader className="glass"
          <CardTitle className="text-lg glassSystem Information">
        <CardContent className="glass">
              <div className="glass grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
          <p className="text-sm text-muted-foreground">Version
              <p className="font-medium">{healthData.version}
            <div>
          <p className="text-sm text-muted-foreground">Environment
              <p className="font-medium capitalize">{healthData.environment}
            <div>
          <p className="text-sm text-muted-foreground">Uptime
              <p className="font-medium">{formatUptime(healthData.metrics.uptime)}
            <div>
          <p className="text-sm text-muted-foreground">Last Check
              <p className="font-medium">
                {new Date(healthData.timestamp).toLocaleTimeString()}
      {/* Tabs */}
      <Tabs defaultValue="services", className="space-y-4">
          <TabsList></TabsList>
          <TabsTrigger value="services">Services
          <TabsTrigger value="metrics">System Metrics
          <TabsTrigger value="details">Detailed Checks
        <TabsContent value="services", className="space-y-4">
          <div className="glass grid grid-cols-1, md: grid-cols-2 lg:grid-cols-3 gap-4">
            {healthData.checks.map((check) => (\n    </div>
              <Card key={check.name} className="relative glass">
          <CardHeader className="pb-3 glass">
                  <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 glass">
                      {check.name === 'database' && <Database className="h-4 w-4"    />}
                      {check.name === 'system' && <Server className="h-4 w-4"    />}
                      {check.name === 'process' && <Cpu className="h-4 w-4"    />}
                      {check.name.includes('external') && <Globe className="h-4 w-4"    />},
    {check.name}
                    {getStatusIcon(check.status)}
                <CardContent className="glass"
                  {check.error ? (
          <p className="{check.error}"    />
          </div>
    ); : (
                    <div className="space-y-2">
                      {check.responseTime  && (
/div></div>
                        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Response Time
                          <span className="font-medium">{check.responseTime}ms
            )},
    {check.details && typeof check.details === 'object'  && (div className="text-sm space-y-1">
                          {Object.entries(check.details).slice(0, 3).map(([key, value]) => (\n    <div key={key} className="flex items-center justify-between">
          <span className="text-muted-foreground capitalize">
                                {key.replace(/_/g, ', ')}
                              <span className="font-medium">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}))})}

            ))}
        <TabsContent value="metrics", className="space-y-4"><div className="glass grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CPU, Metrics */}</div>
            <Card className="glass">
            <CardHeader className="glass"
                <CardTitle className="text-base flex items-center gap-2 glass">
          <Cpu className="h-4 w-4"     />
                  CPU Usage
              <CardContent className="space-y-4 glass>
              <div></div>">
                  <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Usage
                    <span className="text-sm font-medium">
                      {healthData.metrics.cpu.usage.toFixed(1)}%
                  <Progress value={healthData.metrics.cpu.usage/>
          </div>
        <div className="glass grid grid-cols-2 gap-4 text-sm"     />
          <p className="text-muted-foreground">Cores
                    <p className="font-medium">{healthData.metrics.cpu.cores}
                  <div>
          <p className="text-muted-foreground">Load Average
                    <p className="font-medium">
                      {healthData.metrics.cpu.loadAverage[0].toFixed(2)}
            {/* Memory, Metrics */}
            <Card className="glass">
            <CardHeader className="glass"
                <CardTitle className = "text-base flex items-center gap-2" className="glass">
          <HardDrive className="h-4 w-4"     />
                  Memory Usage
              <CardContent className="space-y-4 glass>
              <div></div>">
                  <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Usage
                    <span className="text-sm font-medium">
                      {healthData.metrics.memory.percentage.toFixed(1)}%
                  <Progress value={healthData.metrics.memory.percentage/>
          </div>
        <div className="glass grid grid-cols-2 gap-4 text-sm"     />
          <p className="text-muted-foreground">Used
                    <p className="font-medium">
                      {formatBytes(healthData.metrics.memory.used)}
                  <div>
          <p className="text-muted-foreground">Total
                    <p className="font-medium">
                      {formatBytes(healthData.metrics.memory.total)}
        <TabsContent value="details">
          <Card className="glass"
            <CardHeader className="glass">
              <CardTitle className="glass">All Health Checks
              <CardDescription className="glass"
                Detailed view of all system health checks
            <CardContent className="glass">
              <div className="space-y-4">
                {healthData.checks.map((check) => (\n    </div>
                  <div; const key={check.name}>className="glass  rounded-xl-lg p-4 space-y-2 flex items-center justify-between"    />
          <h4 className="font-medium flex items-center gap-2">
                        {getStatusIcon(check.status)},
    {check.name}</h4>
                      <Badge className={getStatusColor(check.status)} />
                        {check.status}/>
                    {check.error  && (
p className="text-sm text-red-600 mt-2">{check.error}
  },
    {check.details  && (pre className="text-xs bg-muted p-2 rounded-lg overflow-x-auto">
                        {JSON.stringify(check.details, null, 2)
            )}
      )}
                    <p className="text-xs text-muted-foreground">
                      Last,
    checked: {new, Date(check.timestamp).toLocaleString()}))}
    );
</div>
  
    
    
    </div>
  }

}}}