import { Metadata } from 'next';
import { HealthCheckDashboard } from '@/components/health/HealthCheckDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'System Status - AI Guided SaaS Platform',
  description: 'Real-time status of our platform services and infrastructure'};

const services = [
  { name: 'API Gateway', status: 'operational', uptime: '99.98%' },
  { name: 'AI Generation Service', status: 'operational', uptime: '99.95%' },
  { name: 'Database', status: 'operational', uptime: '99.99%' },
  { name: 'Authentication', status: 'operational', uptime: '99.97%' },
  { name: 'File Storage', status: 'operational', uptime: '99.96%' },
  { name: 'CDN', status: 'operational', uptime: '99.99%' }];

const incidents = [
  {
    title: 'Scheduled Maintenance',
    description: 'Database optimization and security updates',
    status: 'scheduled',
    date: '2024-01-20, 02:00 UTC',
    duration: '2 hours'},
  {
    title: 'API Latency Issues Resolved',
    description: 'Increased response times due to high traffic volume',
    status: 'resolved',
    date: '2024-01-15, 14:30 UTC',
    duration: '45 minutes'}];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'degraded':</CheckCircle>
      return <AlertCircle className="h-5 w-5 text-yellow-500" />
    case 'outage':</AlertCircle>
      return <AlertCircle className="h-5 w-5 text-red-500" />
    default: </AlertCircle>
      return <Clock className="h-5 w-5 text-gray-500" />,
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'operational':</Clock>
      return <Badge className="bg-green-100 text-green-800">Operational</Badge>
    case 'scheduled':
      return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
    case 'resolved':
      return <Badge className="bg-gray-100 text-gray-800">Resolved</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
};

export default function StatusPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">System Status</h1>
          <p className="text-xl text-muted-foreground">
            Real-time status of our platform services and infrastructure</p>
        
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-[600px] mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health Monitor</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="text-center">
              <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                All Systems Operational</Badge>

            {/* Overall Status */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Overall System Health</CardTitle>
                <CardDescription>
                  Current status of all platform services</CardDescription>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    99.97%</div>
                  <div className="text-muted-foreground">30-day uptime</div>
              </CardContent>

            {/* Service Status */}
            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>
                  Individual service health and uptime</CardDescription>
              <CardContent>
                <div className="space-y-4">
                  {services.map(service => (</div>
                    <div
                      key={service.name}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(service.status)}

                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">
                          {service.uptime} uptime</span>
                        {getStatusBadge(service.status)}

                  ))}

          <TabsContent value="health">
            <HealthCheckDashboard />
          </TabsContent>
          
          <TabsContent value="incidents" className="space-y-8">
            {/* Recent Incidents */}</TabsContent>
            <Card>
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
                <CardDescription>
                  Past and scheduled maintenance events</CardDescription>
              <CardContent>
                <div className="space-y-4">
                  {incidents.map((incident, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{incident.title}</h3>
                        {getStatusBadge(incident.status)}

                      <p className="text-muted-foreground mb-2">
                        {incident.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{incident.date}</span>
                        <span>Duration: {incident.duration}</span>))}

            {/* Subscribe to Updates */}
            <div className="text-center bg-muted rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Stay Updated</h2>
              <p className="text-muted-foreground mb-4">
                Subscribe to status updates and incident notifications</p>
              <div className="flex flex-col sm: flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
                />
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  Subscribe</button>
  }

    
  );
}
