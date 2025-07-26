import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerformanceTabProps {
  dashboardData: any;
}

const pageLoadMetrics = [
  { label: 'Average', value: '1.2s' },
  { label: 'Median', value: '0.9s' },
  { label: '95th Percentile', value: '2.8s' }
];

const apiMetrics = [
  { label: 'Avg Response Time', value: '45ms' },
  { label: 'Success Rate', value: '99.8%', isSuccess: true },
  { label: 'Requests/min', value: '1,234' }
];

export function PerformanceTab({ dashboardData }: PerformanceTabProps) {
  return (
    <div className="space-y-6">
      <div className="glass grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Page Load Times */}
        <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Page Load Times
          
          <CardContent className="glass">
            <div className="space-y-3">
              {pageLoadMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between">
                  <span className="text-sm">{metric.label}
                  <span className="text-sm font-medium">{metric.value}
                
              ))}
            
          
        

        {/* API Performance */}
        <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">API Performance
          
          <CardContent className="glass">
            <div className="space-y-3">
              {apiMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between">
                  <span className="text-sm">{metric.label}
                  <span className={`text-sm font-medium ${metric.isSuccess ? 'text-green-600' : ''}`}>
                    {metric.value}
                  
                
              ))}
            
          
        

        {/* Error Tracking */}
        <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Recent Errors
          
          <CardContent className="glass">
            <div className="space-y-3">
              {dashboardData.top.errors.map((error: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-red-600">{error.message}
                  <Badge variant="secondary">{error.count}
                
              ))}
            
          
        
      
    
  );
}