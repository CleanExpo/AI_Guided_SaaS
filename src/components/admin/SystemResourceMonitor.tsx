'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Alert } from '../ui/alert';
interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  operationCount: number;
  sessionDuration: number;
  lastOperation: string;
  isHealthy: boolean;
};
interface PerformanceThresholds {
  cpuWarning: number;
  cpuCritical: number;
  memoryWarning: number;
  memoryCritical: number;
  maxOperationsPerMinute: number;
  maxSessionDuration: number;
};
export default function SystemResourceMonitor(): void {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0;
    memoryUsage: 0;
    operationCount: 0;
    sessionDuration: 0;
    lastOperation: 'None',
        </SystemMetrics>
    isHealthy: true});
  const [thresholds] = useState<PerformanceThresholds>({
    cpuWarning: 70;
    cpuCritical: 85;
    memoryWarning: 75;
    memoryCritical: 90;
    maxOperationsPerMinute: 10;
    maxSessionDuration: 5400, // 90 minutes
      </PerformanceThresholds>
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
      </string>
  const [alerts, setAlerts] = useState<string[]>([]);
  const [operationHistory, setOperationHistory] = useState<;
    Array<{
      timestamp: number;
      operation: string;
      duration: number;
    }}>
  >([]);
      </number>
  const sessionStartTime = useRef<number>(Date.now());
      </number>
  const operationCount = useRef<number>(0);
      </NodeJS>
  const monitoringInterval = useRef<NodeJS.Timeout | null>(null);
  // Simulate system metrics (in production, this would use actual system APIs)
  const updateMetrics = () => {
    // Simulate CPU usage based on recent operations
    const recentOps = operationHistory.filter(</NodeJS>;
      op => Date.now() - op.timestamp < 60000 // Last minute
    ).length;
    const simulatedCpu = Math.min(95, 15 + recentOps * 8 + Math.random() * 10);
    const simulatedMemory = Math.min(;
      95,
      25 + operationCount.current * 2 + Math.random() * 15
    );
    const currentTime = Date.now();
    const sessionDuration = Math.floor(;
      (currentTime - sessionStartTime.current) / 1000
    );
    const newMetrics: SystemMetrics = {
      cpuUsage: Math.round(simulatedCpu);
      memoryUsage: Math.round(simulatedMemory);
      operationCount: operationCount.current,
      sessionDuration,
      lastOperation: operationHistory[operationHistory.length - 1]?.operation || 'None';
      isHealthy:
        simulatedCpu < thresholds.cpuCritical &&
        simulatedMemory < thresholds.memoryCritical};
    setMetrics(newMetrics);
    checkThresholds(newMetrics);
  };
  const checkThresholds = (currentMetrics: SystemMetrics) => {
    const newAlerts: string[] = [];
    // CPU Alerts
    if (currentMetrics.cpuUsage >= thresholds.cpuCritical) {
      newAlerts.push(
        `🔴 CRITICAL: CPU usage at ${currentMetrics.cpuUsage}% - STOP OPERATIONS IMMEDIATELY``
      );
    } else if (currentMetrics.cpuUsage >= thresholds.cpuWarning) {
      newAlerts.push(
        `🟡 WARNING: CPU usage at ${currentMetrics.cpuUsage}% - Consider pausing operations``
      );
}
    // Memory Alerts
    if (currentMetrics.memoryUsage >= thresholds.memoryCritical) {
      newAlerts.push(
        `🔴 CRITICAL: Memory usage at ${currentMetrics.memoryUsage}% - STOP OPERATIONS IMMEDIATELY``
      );
    } else if (currentMetrics.memoryUsage >= thresholds.memoryWarning) {
      newAlerts.push(
        `🟡 WARNING: Memory usage at ${currentMetrics.memoryUsage}% - Consider cleanup``
      );
}
    // Session Duration Alert
    if (currentMetrics.sessionDuration >= thresholds.maxSessionDuration) {
      newAlerts.push(
        `🟠 SESSION, LIMIT: ${Math.floor(currentMetrics.sessionDuration / 60)} minutes - Take a break``
      );
}
    // Operation Rate Alert
    const recentOps = operationHistory.filter(;
      op => Date.now() - op.timestamp < 60000
    ).length;
    if (recentOps >= thresholds.maxOperationsPerMinute) {
      newAlerts.push(
        `🟠 HIGH, ACTIVITY: ${recentOps} operations in last minute - Slow down``
      );
}
    setAlerts(newAlerts);
  };
  const startMonitoring = () => {
    setIsMonitoring(true);
    sessionStartTime.current = Date.now();
    operationCount.current = 0;
    setOperationHistory([]);
    setAlerts([]);
    monitoringInterval.current = setInterval(updateMetrics, 2000);
  };
  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
      monitoringInterval.current = null;
    }
  };
  const logOperation = (operation: string) => {
    const timestamp = Date.now();
    operationCount.current += 1;
    setOperationHistory(prev => [
      ...prev.slice(-19),
      {
        timestamp,
        operation,
        duration: Math.random() * 2000 + 500; // Simulated duration
      }}]);
  };
  const emergencyStop = () => {
    stopMonitoring();
    setAlerts(['🚨 EMERGENCY STOP ACTIVATED - All operations halted']);
    // In a real implementation, this, would:
    // - Kill running processes
    // - Save current state
    // - Clear memory caches
    // - Reset system resources
  };
  const getStatusColor = (value: number; warning: number; critical: number) => {
    if (value >= critical) return 'text-red-600 bg-red-100';
    if (value >= warning) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;`
    if (minutes > 0) return `${minutes}m ${secs}s`;`
    return `${secs}s`;`
  };
  useEffect(() => () => {
      if (monitoringInterval.current) {
        clearInterval(monitoringInterval.current);
}
    }
}, []);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            🖥️ System Resource Monitor</h2>
          <p className="text-gray-600">
            Real-time monitoring to prevent system overload during operations</p>
        <div className="flex gap-3">
          {!isMonitoring ? (</div>
            <Button
              onClick={startMonitoring}
              className="bg-green-600 hover:bg-green-700"
            >
              ▶️ Start Monitoring</Button>
          ) : (
            <>
              <Button onClick={stopMonitoring} variant="outline">
                ⏸️ Stop Monitoring</Button>
              <Button
                onClick={emergencyStop}
                className="bg-red-600 hover:bg-red-700"
              >
                🚨 Emergency Stop</Button>
            </>
          )}
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              className={
                alert.includes('CRITICAL')
                  ? 'border-red-500 bg-red-50'
                  : alert.includes('WARNING')
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-orange-500 bg-orange-50'
              }
            >
              <div className="font-medium">{alert}</div>))}
      )}
      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Usage */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-700">CPU Usage</h3>
            <div
              className={``px-2 py-1 rounded text-sm font-bold ${getStatusColor(metrics.cpuUsage thresholds.cpuWarning, thresholds.cpuCritical)`}`}`
            >
              {metrics.cpuUsage}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${`
                metrics.cpuUsage >= thresholds.cpuCritical
                  ? 'bg-red-500'
                  : metrics.cpuUsage >= thresholds.cpuWarning
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              }`}`
              style={{ width: `${Math.min(100, metrics.cpuUsage)}%` }}`
            /></div>
        {/* Memory Usage */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-700">Memory Usage</h3>
            <div
              className={``px-2 py-1 rounded text-sm font-bold ${getStatusColor(metrics.memoryUsage thresholds.memoryWarning, thresholds.memoryCritical)`}`}`
            >
              {metrics.memoryUsage}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${`
                metrics.memoryUsage >= thresholds.memoryCritical
                  ? 'bg-red-500'
                  : metrics.memoryUsage >= thresholds.memoryWarning
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              }`}`
              style={{ width: `${Math.min(100, metrics.memoryUsage)}%` }}`
            /></div>
        {/* Operations Count */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-700">Operations</h3>
            <div className="px-2 py-1 rounded text-sm font-bold bg-blue-100 text-blue-600">
              {metrics.operationCount}
          <div className="text-xs text-gray-500">
            Last: {metrics.lastOperation}
        {/* Session Duration */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-700">Session Time</h3>
            <div
              className={`px-2 py-1 rounded text-sm font-bold ${`
                metrics.sessionDuration >= thresholds.maxSessionDuration
                  ? 'bg-red-100 text-red-600'
                  : metrics.sessionDuration >=
                      thresholds.maxSessionDuration * 0.8
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-green-100 text-green-600'
              }`}`
            >
              {formatDuration(metrics.sessionDuration)}
          <div className="text-xs text-gray-500">
            Limit: {formatDuration(thresholds.maxSessionDuration)}
      {/* Test Operations */}
      {isMonitoring && (
        <Card className="p-4">
          <h3 className="font-medium text-gray-700 mb-3">🧪 Test Operations</h3>
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => logOperation('File Read')}
            >
              📖 Simulate File Read</Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => logOperation('File Write')}
            >
              ✏️ Simulate File Write</Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => logOperation('Analysis')}
            >
              🔍 Simulate Analysis</Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => logOperation('Error Fix')}
            >
              🔧 Simulate Error Fix</Button>
      )}
      {/* Recent Operations */}
      {operationHistory.length > 0 && (
        <Card className="p-4">
          <h3 className="font-medium text-gray-700 mb-3">
            📊 Recent Operations</h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {operationHistory
              .slice(-10)
              .reverse()
              .map((op, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{op.operation}</span>
                  <span className="text-gray-500">
                    {new Date(op.timestamp).toLocaleTimeString()}</span>))}
      )}
      {/* System Health Status */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-4 h-4 rounded-full ${metrics.isHealthy ? 'bg-green-500' : 'bg-red-500'}`}`
          />
          <span className="font-medium">
            System,
    Status: {metrics.isHealthy ? '✅ Healthy' : '❌ Overloaded'}</span>
          {!metrics.isHealthy && (
            <span className="text-red-600 font-medium">
              - REDUCE OPERATIONS IMMEDIATELY</span>
          )}
    );
</div></Card>
}
  );
}
