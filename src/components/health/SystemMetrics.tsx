import React from 'react'

interface SystemMetricsProps {
  metrics?: {
    cpu: number;
  memory: number
    uptime: number
   ;
  activeAgents: number
  }
}

export function SystemMetrics({ metrics }: SystemMetricsProps) {
  if (!metrics) {
    return <div>Loading metrics...</div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">CPU Usage</h3>
        <p className="mt-1 text-2xl font-semibold">{metrics.cpu.toFixed(1)}%</p>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Memory Usage</h3>
        <p className="mt-1 text-2xl font-semibold">{metrics.memory.toFixed(1)}%</p>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Uptime</h3>
        <p className="mt-1 text-2xl font-semibold">{Math.floor(metrics.uptime / 3600)}h</p>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Active Agents</h3>
        <p className="mt-1 text-2xl font-semibold">{metrics.activeAgents}</p>
    );
}
  );
</div>
</div>
</div>
</div>
</div>
}
</div>