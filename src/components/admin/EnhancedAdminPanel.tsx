'use client';

import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert } from '../ui/alert';
import SelfCheckTrigger from './SelfCheckTrigger';
import SystemResourceMonitor from './SystemResourceMonitor';
import SafeModeHealthCheck from './SafeModeHealthCheck';

export default function EnhancedAdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🛡️</span>
              </div>
              <h1 className="text-xl font-semibold">Enhanced Admin Panel</h1>
              <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Performance Optimized</div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                System Management Dashboard</span>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance Monitor</TabsTrigger>
            <TabsTrigger value="safe-mode">Safe Mode Health Check</TabsTrigger>
            <TabsTrigger value="system-check">System Health</TabsTrigger>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Performance Status */}

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    🖥️ Performance Status</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>System Load</span>
                    <span className="font-medium">Normal</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Active Sessions</span>
                    <span className="font-medium">3</span>
                  </div>
                <Button
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => setActiveTab('performance')}
                >
                  View Details</Button>

              {/* Safe Mode Status */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">🛡️ Safe Mode</h3>
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    Ready</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Batch Processing</span>
                    <span className="font-medium">Enabled</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Max Batch Size</span>
                    <span className="font-medium">3 issues</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Safety Checks</span>
                    <span className="font-medium">Active</span>
                  </div>
                <Button
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => setActiveTab('safe-mode')}
                >
                  Start Safe Check</Button>

              {/* System Health */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">🔍 System Health</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Score</span>
                    <span className="font-medium">92/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Check</span>
                    <span className="font-medium">2 hours ago</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Issues Found</span>
                    <span className="font-medium">3 minor</span>
                  </div>
                <Button
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => setActiveTab('system-check')}
                >
                  Run Health Check</Button>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">⚡ Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => setActiveTab('performance')}
                ></Button>
                  <span className="text-2xl mb-1">📊</span>
                  <span className="text-sm">Monitor Resources</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => setActiveTab('safe-mode')}
                ></Button>
                  <span className="text-2xl mb-1">🛡️</span>
                  <span className="text-sm">Safe Processing</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => setActiveTab('system-check')}
                ></Button>
                  <span className="text-2xl mb-1">🔍</span>
                  <span className="text-sm">System Check</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <span className="text-2xl mb-1">📋</span>
                  <span className="text-sm">View Logs</span>
                </Button>

            {/* Emergency Procedures */}
            <Alert className="border-orange-200 bg-orange-50">
              <div className="flex items-start space-x-3">
                <span className="text-orange-600 text-lg">⚠️</span>
                <div>
                  <h4 className="font-medium text-orange-900">
                    Emergency Procedures Available</h4>
                  <p className="text-sm text-orange-800 mt-1">
                    If you experience system freezing or performance issues,
                    refer to the emergency procedures documentation. Always use
                    Safe Mode for processing large numbers of issues.</p>
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-orange-700 border-orange-300"
                    >
                      📖 View Emergency Guide</Button>

          {/* Performance Monitor Tab */}
          <TabsContent value="performance" className="space-y-6">
            <SystemResourceMonitor />
          </TabsContent>

          {/* Safe Mode Health Check Tab */}
          <TabsContent value="safe-mode" className="space-y-6">
            <SafeModeHealthCheck />
          </TabsContent>

          {/* System Health Check Tab */}
          <TabsContent value="system-check" className="space-y-6">
            <SelfCheckTrigger />
          </TabsContent>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>System, Status: ✅ Healthy</span>
              <span>•</span>
              <span>Last,
    Updated: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button size="sm" variant="ghost">
                📚 Documentation</Button>
              <Button size="sm" variant="ghost">
                🆘 Support</Button>
  }

    
  );
}
