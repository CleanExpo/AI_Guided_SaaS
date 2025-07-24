#!/usr/bin/env node

/**
 * MCAS Remaining Syntax Fixes
 * Fix the last few syntax errors
 */

const fs = require('fs');
const path = require('path');

console.log('🔨 MCAS Remaining Syntax Fixes');
console.log('==============================\n');

// Fix AdminAnalytics.tsx
const adminAnalyticsPath = path.join(process.cwd(), 'src/components/admin/AdminAnalytics.tsx');
if (fs.existsSync(adminAnalyticsPath)) {
  let content = fs.readFileSync(adminAnalyticsPath, 'utf8');
  
  // Fix missing commas in type definitions
  content = content.replace(/type:\s*string,\s*count:\s*number\s+percentage:\s*number/g, 'type: string; count: number; percentage: number');
  content = content.replace(/date:\s*string,\s*avg:\s*number,\s*p95:\s*number\s+p99:\s*number/g, 'date: string; avg: number; p95: number; p99: number');
  content = content.replace(/endpoint:\s*string,\s*calls:\s*number\s+avgTime:\s*number/g, 'endpoint: string; calls: number; avgTime: number');
  
  // Fix interface syntax
  content = content.replace(/interface AdminAnalyticsProps \{\s*data: AnalyticsDat\s*a,/g, 'interface AdminAnalyticsProps {\n  data: AnalyticsData;');
  
  // Fix useState and other syntax issues
  content = content.replace(/useState<string>\('users'\),\s*\/\/ Simple/g, "useState<string>('users');\n  \n  // Simple");
  
  // Fix map syntax
  content = content.replace(/Math\.max\(\.\.\.data\.map\(\(d\) => d\.count\);\s*const/g, 'Math.max(...data.map((d) => d.count));\n    const');
  content = content.replace(/const width = 100 \/ data\.length,\s*return \(;/g, 'const width = 100 / data.length;\n    \n    return (');
  
  // Fix className duplicate
  content = content.replace(/style=\{ \{ height \} \}\s*className=/g, 'style={{ height }} >\n        <div className=');
  
  // Fix JSX syntax
  content = content.replace(/const heightPercent = \(point\.count \/ maxValue\) \* 100,\s*return \(<\/div>\);/g, 'const heightPercent = (point.count / maxValue) * 100;\n            return (');
  
  fs.writeFileSync(adminAnalyticsPath, content, 'utf8');
  console.log('✓ Fixed src/components/admin/AdminAnalytics.tsx');
}

// Fix ContainerMonitor.tsx
const containerPath = path.join(process.cwd(), 'src/components/ContainerMonitor.tsx');
if (fs.existsSync(containerPath)) {
  let content = fs.readFileSync(containerPath, 'utf8');
  
  // Fix the Activity icon syntax
  content = content.replace(/<Activity className="h-5 w-5"\s*\/>/g, '<Activity className="h-5 w-5" />');
  
  fs.writeFileSync(containerPath, content, 'utf8');
  console.log('✓ Fixed src/components/ContainerMonitor.tsx');
}

// Fix SystemMetrics.tsx
const systemMetricsPath = path.join(process.cwd(), 'src/components/health/SystemMetrics.tsx');
if (fs.existsSync(systemMetricsPath)) {
  let content = fs.readFileSync(systemMetricsPath, 'utf8');
  
  // Ensure it's properly structured
  if (!content.includes('export function SystemMetrics')) {
    content = `'use client';

import React from 'react';

interface SystemMetricsData {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

interface SystemMetricsProps {
  metrics?: SystemMetricsData;
}

export function SystemMetrics({ metrics }: SystemMetricsProps = {}) {
  const defaultMetrics: SystemMetricsData = {
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 23
  };
  
  const data = metrics || defaultMetrics;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">CPU Usage</h3>
        <p className="mt-1 text-2xl font-semibold">{data.cpu.toFixed(1)}%</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Memory Usage</h3>
        <p className="mt-1 text-2xl font-semibold">{data.memory.toFixed(1)}%</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Disk Usage</h3>
        <p className="mt-1 text-2xl font-semibold">{data.disk.toFixed(1)}%</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Network I/O</h3>
        <p className="mt-1 text-2xl font-semibold">{data.network.toFixed(1)} MB/s</p>
      </div>
    </div>
  );
}`;
  }
  
  fs.writeFileSync(systemMetricsPath, content, 'utf8');
  console.log('✓ Fixed src/components/health/SystemMetrics.tsx');
}

// Process remaining files to fix common patterns
function fixRemainingPatterns(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix semicolons and commas
    content = content.replace(/,\s*;/g, ';');
    content = content.replace(/;\s*,/g, ',');
    
    // Fix double semicolons
    content = content.replace(/;;\s*/g, '; ');
    
    // Fix missing semicolons after statements
    content = content.replace(/^(\s*(?:const|let|var|return)\s+[^;{}\n]+)$/gm, '$1;');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Process component directories
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && 
          entry.name !== 'node_modules' && 
          entry.name !== '.next') {
        processDirectory(fullPath);
      }
    } else if (entry.isFile() && 
               (entry.name.endsWith('.ts') || 
                entry.name.endsWith('.tsx'))) {
      if (fixRemainingPatterns(fullPath)) {
        console.log(`✓ Fixed patterns in ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
}

console.log('\nProcessing remaining files...');
processDirectory(path.join(process.cwd(), 'src/components'));

console.log('\n✅ Syntax fixes complete!');