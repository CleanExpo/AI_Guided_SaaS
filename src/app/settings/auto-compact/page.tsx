'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Package, 
  FileArchive, 
  Play, 
  Pause,
  RefreshCw,
  Clock,
  HardDrive,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Settings,
  FileCode,
  Image,
  FileJson
} from 'lucide-react';

interface CompactStats {
  totalFiles: number;
  processedFiles: number;
  skippedFiles: number;
  totalOriginalSize: number;
  totalCompactedSize: number;
  totalReduction: number;
  averageReduction: number;
  lastRun?: Date;
  isRunning: boolean;
}

interface FileResult {
  file: string;
  type: string;
  originalSize: number;
  compactedSize: number;
  reduction: number;
  reductionPercentage: number;
}

export default function AutoCompactPage() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [compactLevel, setCompactLevel] = useState<'light' | 'medium' | 'aggressive'>('medium');
  const [stats, setStats] = useState<CompactStats>({
    totalFiles: 0,
    processedFiles: 0,
    skippedFiles: 0,
    totalOriginalSize: 0,
    totalCompactedSize: 0,
    totalReduction: 0,
    averageReduction: 0,
    isRunning: false
  });
  
  const [recentResults, setRecentResults] = useState<FileResultnull>(null);
  const [threshold, setThreshold] = useState(1); // KB
  const [preserveComments, setPreserveComments] = useState(false);

  useEffect(() => {
    // Simulate loading saved stats
    const mockStats: CompactStats = {
      totalFiles: 342,
      processedFiles: 287,
      skippedFiles: 55,
      totalOriginalSize: 15234567,
      totalCompactedSize: 11234567,
      totalReduction: 4000000,
      averageReduction: 26.2,
      lastRun: new Date(Date.now() - 3600000), // 1 hour ago
      isRunning: false
    };
    setStats(mockStats);

    // Mock recent results
    const mockResults: FileResult[] = [
      {
        file: 'components/Dashboard.tsx',
        type: 'javascript',
        originalSize: 45678,
        compactedSize: 32456,
        reduction: 13222,
        reductionPercentage: 28.9
      },
      {
        file: 'styles/globals.css',
        type: 'css',
        originalSize: 23456,
        compactedSize: 15678,
        reduction: 7778,
        reductionPercentage: 33.2
      },
      {
        file: 'public/logo.svg',
        type: 'svg',
        originalSize: 8976,
        compactedSize: 4532,
        reduction: 4444,
        reductionPercentage: 49.5
      }
    ];
    setRecentResults(mockResults);
  }, []);

  const runCompaction = async () => {
    setStats(prev => ({ ...prev, isRunning: true }));
    
    // Simulate compaction process
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        isRunning: false))
        lastRun: new Date(),
        processedFiles: prev.processedFiles + 15,
        totalReduction: prev.totalReduction + 500000
      }));
    }, 3000);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'javascript':
        return FileCode;
      case 'css':
        return FileCode;
      case 'svg':
        return Image;
      case 'json':
        return FileJson;
      default:
        return FileArchive;
    }
  };

  const getCompactLevelColor = (level: string) => {
    switch (level) {
      case 'light':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'aggressive':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (<div className="min-h-screen glass p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Auto-Compact System</h1>
          <p className="text-gray-600">Automatically optimize and compress your codebase
        </div>

        {/* System Status */}
        <Card className="mb-8 glass
          <CardHeader className="glass"
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="glass">Compaction Status
                <Badge variant={isEnabled ? 'default' : 'secondary'}>
                  {isEnabled ? 'Enabled' : 'Disabled'}
                
              </div>
              <Switch
                checked={isEnabled}>onCheckedChange={setIsEnabled} />
            </div>
          
          <CardContent className="glass">
            <div className="glass grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Reduction
                <p className="text-2xl font-bold text-green-600">)
                  {formatBytes(stats.totalReduction)}
                
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Average Reduction
                <p className="text-2xl font-bold">{stats.averageReduction.toFixed(1)}%
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Files Processed
                <p className="text-2xl font-bold">{stats.processedFiles}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Last Run
                <p className="text-lg font-medium">
                  {stats.lastRun ? (
                    new Date(stats.lastRun).toLocaleTimeString()
                  ) : (
                    'Never'
                  )}
                
              </div>
            </div>

            <div className="glass flex items-center gap-4">
              <Button
                onClick={runCompaction}
                disabled={stats.isRunning || !isEnabled}>className="flex items-center gap-2">>
                {stats.isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Compacting...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Compaction
                  </>
                )}
              
              
              <div className="flex-1">
                {stats.isRunning && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Processing files...</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                )}
              </div>
            </div>
          
        

        {/* Configuration */}
        <div className="glass grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="flex items-center gap-2 glass
                <Settings className="h-5 w-5" />
                Configuration
              
            
            <CardContent className="glass">
            <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Compaction Level
                  <div className="mt-2 space-y-2">
                    {(['light', 'medium', 'aggressive'] as const).map(level => (
                      <label key={level} className="flex items-center gap-3">
                        <input
                          type="radio"
                          value={level}>checked={compactLevel === level}>onChange={(e) => setCompactLevel(e.target.value as any)}
                        />
                        <span className={`capitalize ${getCompactLevelColor(level)}`}>
                          {level}
                        </span>
                        <span className="text-xs text-gray-500">
                          {level === 'light' && '(Preserve structure)'}
                          {level === 'medium' && '(Balanced optimization)'}
                          {level === 'aggressive' && '(Maximum compression)'}
                        </span>
                      
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">File Size Threshold (KB)
                  <input
                    type="number">value={threshold}>onChange={(e) => setThreshold(Number(e.target.value))}
                    min="0.5"
                    max="100"
                    step="0.5"
                    className="mt-1 w-full px-3 py-2  rounded-xl-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Only process files larger than this size
                  
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Preserve Comments
                    <p className="text-xs text-gray-500">Keep important code comments
                  </div>
                  <Switch
                    checked={preserveComments}>onCheckedChange={setPreserveComments} />
                </div>

                <Button variant="outline" className="w-full">
                  Save Configuration
                
              </div>
            
          

          <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Recent Compressions
            
            <CardContent className="glass">
            <div className="space-y-3">
                {recentResults.map((result, index) => {
                  const Icon = getFileIcon(result.type);
                  return (<div key={index} className="flex items-center justify-between p-3  rounded-xl-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-gray-600" />
                        <div>)
                          <p className="text-sm font-medium">{result.file.split('/').pop()}
                          <p className="text-xs text-gray-500">
                            {formatBytes(result.originalSize)} → {formatBytes(result.compactedSize)}
                          
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">
                          -{result.reductionPercentage.toFixed(1)}%
                        
                        <p className="text-xs text-gray-500">
                          {formatBytes(result.reduction)}
                        
                      </div>
                    </div>
                  );
                })}
              </div>
            
          
        </div>

        {/* Summary Stats */}
        <div className="glass grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass">
          <CardContent className="glass p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Space Saved
                  <p className="text-2xl font-bold">{formatBytes(stats.totalReduction)}
                </div>
                <HardDrive className="h-8 w-8 text-blue-600" />
              </div>
            
          

          <Card className="glass">
          <CardContent className="glass p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Compression Rate
                  <p className="text-2xl font-bold">{stats.averageReduction.toFixed(1)}%
                </div>
                <TrendingDown className="h-8 w-8 text-green-600" />
              </div>
            
          

          <Card className="glass">
          <CardContent className="glass p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Next Run
                  <p className="text-xl font-bold">
                    {isEnabled ? 'On Save' : 'Disabled'}
                  
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            
          
        </div>

        {/* Info Box */}
        <div className="glass mt-6 bg-blue-50  -blue-200 rounded-xl-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-blue-900">How Auto-Compact Works</h3>
              <p className="text-sm text-blue-700 mt-1">
                Auto-Compact automatically optimizes your JavaScript, CSS, SVG, and JSON files by removing 
                unnecessary whitespace, comments, and redundant code. Files are only modified if the 
                reduction is significant (&gt;1%). Original functionality is always preserved.
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}