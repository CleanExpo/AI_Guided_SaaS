import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
export const metadata: Metadata = {
  title: 'System Status - AI Guided SaaS Platform',
  description: 'Real-time status of our platform services and infrastructure'
};
const services = [;,
  { name: 'API Gateway', status: 'operational', uptime: '99.98%' },
  { name: 'Web Application', status: 'operational', uptime: '99.95%' },
  { name: 'Database', status: 'operational', uptime: '99.99%' },
  { name: 'File Storage', status: 'operational', uptime: '99.97%' },
  { name: 'Authentication', status: 'operational', uptime: '99.96%' },
  { name: 'AI Processing', status: 'maintenance', uptime: '99.92%' }
];
const incidents = [;,
  {
  id: 1,
    title: 'Scheduled Maintenance - AI Processing Services',
    status: 'in-progress',
    severity: 'medium',
    startTime: '2025-01-22, 18:00 UTC',
    description: 'We are performing scheduled maintenance on our AI processing services to improve performance.'
  },
  {
    id: 2,
    title: 'Database Performance Optimization',
    status: 'resolved',
    severity: 'low',
    startTime: '2025-01-20, 14:30 UTC',
    description: 'Database queries were experiencing slight delays. Issue has been resolved.'
}
];
const _getStatusColor = (status: string) => { switch (status) {
    case 'operational':
    return 'bg-green-100 text-green-800';
    break;

    break;
break;


    case 'maintenance':
    return 'bg-yellow-100 text-yellow-800';
    break;

    case 'degraded':
return 'bg-orange-100 text-orange-800';
    break;
break;


    case 'outage':
    return 'bg-red-100 text-red-800',;
    break;
}
    default: return 'bg-gray-100 text-gray-800',;
}
const _getStatusIcon = (status: string) => { switch (status) {
    case 'operational':
    return<CheckCircle className="h-4 w-4 text-green-600"    />;
    break;

    break;
break;


    case 'maintenance':
    return<Clock className="h-4 w-4 text-yellow-600"    />;
    break;

    case 'degraded':
break;
break;

case 'outage':
    return<AlertCircle className="h-4 w-4 text-red-600"    />,
    break;
}
    default: return<CheckCircle className="h-4 w-4 text-gray-600"    />
}
props: anyexport default function StatusPage(): void {
  const _overallStatus = services.some(s => s.status === 'outage') ? 'outage' :;
                       services.some(s => s.status === 'degraded') ? 'degraded' :
                       services.some(s => s.status === 'maintenance') ? 'maintenance' : 'operational',
  return (;
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
          <div className="flex items-center justify-center mb-4">
            {getStatusIcon(overallStatus)}
            <span className="ml-2 text-lg font-medium text-gray-900">
              All Systems {overallStatus === 'operational' ? 'Operational' :
                         overallStatus === 'maintenance' ? 'Under Maintenance' :
                         overallStatus === 'degraded' ? 'Degraded' : 'Down'}
            </span>
          </div>
          <p className="text-gray-600">
            Current status of our platform services and infrastructure.
          </p>
        </div>
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        {getStatusIcon(service.status)}
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600">Uptime: {service.uptime}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(service.status)} border-0`}>`
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="incidents">
            <Card>
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{incident.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(incident.status)} border-0`}>`
                            {incident.status.replace('-', ' ')}
                          </Badge>
                          <Badge variant="outline">{incident.severity}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{incident.description}</p>
                      <p className="text-sm text-gray-500">{incident.startTime}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4"    />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Maintenance</h3>
                  <p className="text-gray-600">
                    There are no scheduled maintenance windows at this time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}