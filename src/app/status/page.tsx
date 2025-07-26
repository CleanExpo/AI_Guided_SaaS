'use client';

// Force dynamic rendering to avoid SSG errors
export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function StatusPage() {
  const services = [
    { name: 'API Gateway', status: 'operational', uptime: '99.98%' },
    { name: 'Web Application', status: 'operational', uptime: '99.95%' },
    { name: 'Database', status: 'operational', uptime: '99.99%' },
    { name: 'File Storage', status: 'operational', uptime: '99.97%' },
    { name: 'Authentication', status: 'operational', uptime: '99.96%' },
    { name: 'AI Processing', status: 'maintenance', uptime: '99.92%' }
  ];

  const getStatusIcon = (status) =>  {
    switch (status) {
      case 'operational': return <CheckCircle className="w-5 h-5 text-green-600"   />
      case 'maintenance': return <Clock className="w-5 h-5 text-yellow-600"   />
      default: return <AlertCircle className="w-5 h-5 text-red-600"   />
    }
};

  const getStatusBadge = (status) =>  {
    const colors={ operational: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      degraded: 'bg-red-100 text-red-800'
};
    return <Badge className={colors[status] || colors.degraded}>{status}
};

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
          <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">System Status</h1>
        <p className="text-xl text-gray-600">Current status of all our services
      

      <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Service Status
        
        <CardContent className="glass">
            <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="glass flex items-center justify-between p-4  rounded-xl-lg">
          <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <span className="font-medium">{service.name}
                
                <div className="glass flex items-center gap-4">
          <span className="text-sm text-gray-600">{service.uptime}
                  {getStatusBadge(service.status)}
                
              
            ))}
          
        
      
    
  );
}