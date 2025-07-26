import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface RevenueTabProps {
  userTrendData: any[];
}

const revenueMetrics = [
  { title: 'MRR', value: '$45,678', change: '+23% from last month', changeColor: 'text-green-600' },
  { title: 'ARR', value: '$548,136', change: '+18% YoY', changeColor: 'text-green-600' },
  { title: 'ARPU', value: '$186', change: '+$12 from last month', changeColor: 'text-green-600' },
  { title: 'LTV', value: '$2,232', change: '3.8 months payback', changeColor: 'text-green-600' }
];

export function RevenueTab({ userTrendData }: RevenueTabProps) {
  return (<div className="space-y-6">
      <div className="glass grid grid-cols-1 md:grid-cols-4 gap-4">
        {revenueMetrics.map((metric) => (
          <Card key={metric.title} className="glass">
            <CardContent className="glass p-6">
              <p className="text-sm text-gray-600">{metric.title}
              <p className="text-2xl font-bold">{metric.value}
              <p className={`text-sm ${metric.changeColor} mt-1`}>{metric.change}
            
          
        ))}
      

      {/* Revenue Growth Chart */}
      <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Revenue Growth
        
        <CardContent className="glass">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={userTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                fill="#10b98133"
                strokeWidth={2}
              />
            
          
        
      
    
  );
}