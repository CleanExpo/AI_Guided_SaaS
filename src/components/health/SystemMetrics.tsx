// // Type checking disabled for this file
'use client';

import React from 'react';

interface SystemMetricsData { cpu: number
  memory: number
  disk: number
  network: number
}

interface SystemMetricsProps {
  metrics?: SystemMetricsData
}

export function SystemMetrics({ metrics }: SystemMetricsProps) {
  const defaultMetrics: SystemMetricsData = { cpu: 45,
    memory: 62,
    disk: 78,
    network: 23
   };
  
  const data = metrics || defaultMetrics;
  
  return (
    <div className="glass grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass p-4 rounded-xl-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">CPU Usage</h3>
        <p className="mt-1 text-2xl font-semibold">{data.cpu.toFixed(1)}%
      
      <div className="glass p-4 rounded-xl-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Memory Usage</h3>
        <p className="mt-1 text-2xl font-semibold">{data.memory.toFixed(1)}%
      
      <div className="glass p-4 rounded-xl-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Disk Usage</h3>
        <p className="mt-1 text-2xl font-semibold">{data.disk.toFixed(1)}%
      
      <div className="glass p-4 rounded-xl-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Network I/O</h3>
        <p className="mt-1 text-2xl font-semibold">{data.network.toFixed(1)} MB/s
      
    
  );
}