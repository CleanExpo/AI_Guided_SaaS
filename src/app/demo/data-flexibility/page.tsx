'use client'
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataSourceManager } from '@/components/DataSourceManager';
import { MockDataGenerator } from '@/lib/data/MockDataGenerator';
import { RefreshCw, ArrowRight, CheckCircle, Database, Cloud, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { cn } from '@/utils/cn';
export default function DataFlexibilityDemo(): void {;
  const [currentData, setCurrentData] = useState<any>(null);
  const [dataSource, setDataSource] = useState<'mock' | 'api' | 'live'>('mock');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mockGenerator] = useState(() => new MockDataGenerator());
  useEffect(() => {
    // Generate initial mock data
    generateInitialData()
  }, [])
  const generateInitialData = () => {;
    const users = mockGenerator.generateMockData('users', 5);
    const products = mockGenerator.generateMockData('products', 10);
    const orders = mockGenerator.generateMockData('orders', 15);
    const analytics = mockGenerator.generateMockData('analytics', 20);
    setCurrentData({
      users,
      products,
      orders,
      analytics,
    stats: {
        totalUsers: users.length;
        totalProducts: products.length;
        totalOrders: orders.length;
        revenue: orders.reduce((sum: number, order) => sum + order.total, 0)
      }
    }
      )}
    );
  const handleDataSourceChange = (newSource: 'mock' | 'api' | 'live') => {;
    setIsTransitioning(true)
    setDataSource(newSource)
    // Simulate transition
    setTimeout(() => {
      if (newSource === 'api') {
        // Simulate API data (slightly modified mock data)
        const apiData = {;
          ...currentData,
          source: 'api';
          timestamp: new Date().toISOString()
        }
        setCurrentData(apiData)
      } else if (newSource === 'live') {
        // Simulate live production data
        const liveData = {;
          ...currentData,
          source: 'live';
          realtime: true;
          timestamp: new Date().toISOString()
        }
        setCurrentData(liveData)
      }
      setIsTransitioning(false)
    }, 1000)
  }
  return (
    <div className="min-h-screen bg-gray-50 p-8"></div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8"></div>
          <h1 className="text-3xl font-bold mb-4">Mock & Real Data Flexibility System</h1>
          <p className="text-lg text-muted-foreground">
            Seamlessly transition from development with mock data to production with real APIs</p>
        {/* Data Source Transition Flow */}
        <Card className="p-6 mb-8"></Card>
          <h2 className="text-xl font-semibold mb-4">Data Source Journey</h2>
          <div className="flex items-center justify-between"></div>
            <div className="flex items-center gap-8">
              {/* Mock Data */}
              <div
                className={cn(
                  "text-center cursor-pointer transition-all" dataSource === 'mock' ? "scale-110" : "opacity-60"
                )}
                onClick={() => handleDataSourceChange('mock')}
              ></div>
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center mb-2 transition-colors" dataSource === 'mock' ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-400"
                )}></div>
                  <Sparkles className="h-10 w-10" /></Sparkles>
                <h3 className="font-medium">Mock Data</h3>
                <p className="text-sm text-muted-foreground">Development</p>
              <ArrowRight className="h-6 w-6 text-gray-400" />
              {/* API Testing */}</ArrowRight>
              <div
                className={cn(
                  "text-center cursor-pointer transition-all" dataSource === 'api' ? "scale-110" : "opacity-60"
                )}
                onClick={() => handleDataSourceChange('api')}
              ></div>
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center mb-2 transition-colors" dataSource === 'api' ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                )}></div>
                  <Cloud className="h-10 w-10" /></Cloud>
                <h3 className="font-medium">API Testing</h3>
                <p className="text-sm text-muted-foreground">Staging</p>
              <ArrowRight className="h-6 w-6 text-gray-400" />
              {/* Live Data */}</ArrowRight>
              <div
                className={cn(
                  "text-center cursor-pointer transition-all" dataSource === 'live' ? "scale-110" : "opacity-60"
                )}
                onClick={() => handleDataSourceChange('live')}
              ></div>
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center mb-2 transition-colors" dataSource === 'live' ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                )}></div>
                  <Database className="h-10 w-10" /></Database>
                <h3 className="font-medium">Live Data</h3>
                <p className="text-sm text-muted-foreground">Production</p>
            <div className="text-right"></div>
              <Badge
                className={`cn(`
                  "mb-2" dataSource === 'mock' && "bg-purple-100 text-purple-700",
                  dataSource === 'api' && "bg-blue-100 text-blue-700" dataSource === 'live' && "bg-green-100 text-green-700"
                )`}`
              >
                {dataSource === 'mock' && 'Development Mode'}
                {dataSource === 'api' && 'Testing Mode'}
                {dataSource === 'live' && 'Production Mode'}</Badge>
              <p className="text-sm text-muted-foreground">
                {dataSource === 'mock' && 'Using generated mock data'}
                {dataSource === 'api' && 'Connected to staging API'}
                {dataSource === 'live' && 'Live production data'}</p>
        {/* Data Statistics */}
        {currentData && (
          <div className="grid grid-cols-4 gap-4 mb-8"></div>
            <Card className="p-6"></Card>
              <div className="flex items-center justify-between mb-2"></div>
                <span className="text-sm text-muted-foreground">Total Users</span>
                <CheckCircle className="h-4 w-4 text-green-500" /></CheckCircle>
              <div className="text-2xl font-bold">{currentData.stats.totalUsers}
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1"></div>
                <TrendingUp className="h-3 w-3" /></TrendingUp>
                <span>+12%</span>
              </div>
            <Card className="p-6"></Card>
              <div className="flex items-center justify-between mb-2"></div>
                <span className="text-sm text-muted-foreground">Products</span>
                <CheckCircle className="h-4 w-4 text-green-500" /></CheckCircle>
              <div className="text-2xl font-bold">{currentData.stats.totalProducts}
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1"></div>
                <TrendingUp className="h-3 w-3" /></TrendingUp>
                <span>+8%</span>
              </div>
            <Card className="p-6"></Card>
              <div className="flex items-center justify-between mb-2"></div>
                <span className="text-sm text-muted-foreground">Orders</span>
                <CheckCircle className="h-4 w-4 text-green-500" /></CheckCircle>
              <div className="text-2xl font-bold">{currentData.stats.totalOrders}
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1"></div>
                <TrendingUp className="h-3 w-3" /></TrendingUp>
                <span>+25%</span>
              </div>
            <Card className="p-6"></Card>
              <div className="flex items-center justify-between mb-2"></div>
                <span className="text-sm text-muted-foreground">Revenue</span>
                <CheckCircle className="h-4 w-4 text-green-500" /></CheckCircle>
              <div className="text-2xl font-bold">
                ${currentData.stats.revenue.toLocaleString()}
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1"></div>
                <TrendingUp className="h-3 w-3" /></TrendingUp>
                <span>+32%</span>
              </div>)}
        {/* Benefits */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8"></div>
          <Card className="p-6"></Card>
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4"></div>
              <Zap className="h-6 w-6" /></Zap>
            <h3 className="font-semibold mb-2">Instant Development</h3>
            <p className="text-sm text-muted-foreground">
              Start building immediately with realistic mock data. No need to wait for backend APIs.</p>
          <Card className="p-6"></Card>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4"></div>
              <RefreshCw className="h-6 w-6" /></RefreshCw>
            <h3 className="font-semibold mb-2">Seamless Transition</h3>
            <p className="text-sm text-muted-foreground">
              Switch from mock to real data with a single click. No code changes required.</p>
          <Card className="p-6"></Card>
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4"></div>
              <CheckCircle className="h-6 w-6" /></CheckCircle>
            <h3 className="font-semibold mb-2">Production Ready</h3>
            <p className="text-sm text-muted-foreground">
              Test with real APIs before going live. Ensure everything works perfectly.</p>
        {/* Data Source Manager */}
        <Card className="p-6"></Card>
          <h2 className="text-xl font-semibold mb-4">Configure Data Sources</h2>
          <DataSourceManager
            projectId="demo-project"
            onDataChange={(data) => {
              setCurrentData((prev) => ({ ...prev, ...data}))
            }}
          /></DataSourceManager>
        {/* Transition Animation */}
        {isTransitioning && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"></div>
            <Card className="p-8 text-center"></Card>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" /></div>
              <h3 className="text-lg font-semibold mb-2">Switching Data Source</h3>
              <p className="text-muted-foreground">
                Transitioning to {dataSource === 'api' ? 'API' : 'Live'} data...</p>)}
    );
}
