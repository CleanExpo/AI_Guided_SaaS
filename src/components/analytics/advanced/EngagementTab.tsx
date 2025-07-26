import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from './ProgressBar';

interface EngagementTabProps {
  dashboardData: any;
}

export function EngagementTab({ dashboardData }: EngagementTabProps) {
  const maxFeatureUsage = Math.max(...dashboardData.top.features.map((f: any) => f.usage));

  return (
    <div className="space-y-6">
      <div className="glass grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Top Pages
          
          <CardContent className="glass">
            <div className="space-y-3">
              {dashboardData.top.pages.map((page: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{index + 1}
                    <span className="text-sm">{page.url}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{page.views.toLocaleString()}
                    <span className="text-xs text-gray-500">views
                  
                
              ))}
            
          
        

        {/* Feature Usage */}
        <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Feature Usage
          
          <CardContent className="glass">
            <div className="space-y-3">
              {dashboardData.top.features.map((feature: any, index: number) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{feature.name}
                    <span className="text-sm font-medium">{feature.usage}
                  
                  <div className="w-full glass-sidebar rounded-lg-full h-2">
                    <div 
                      className="glass-button primary h-2 rounded-lg-full"
                      style={{ width: `${(feature.usage / maxFeatureUsage) * 100}%` }}
                    />
                  
                
              ))}
            
          
        
      
    
  );
}