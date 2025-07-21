'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Database,
  Key,
  Cloud,
  CreditCard,
  Shield,
  Brain,
  Zap
} from 'lucide-react';

interface EnvStatus {
  summary: {
    total: number;
    valid: number;
    missing: number;
    invalid: number;
    warnings: number;
  };
  isValid: boolean;
  services: Record<string, {
    name: string;
    category: string;
    status: string;
    variables: Record<string, {
      set: boolean;
      required: boolean;
      status: string;
      message: string;
    }>;
  }>;
  environment: string;
}

const categoryIcons: Record<string, any> = {
  database: Database,
  cache: Zap,
  ai: Brain,
  auth: Shield,
  deployment: Cloud,
  payments: CreditCard};

export function EnvStatusDashboard() {
  const [status, setStatus] = useState<EnvStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [compacting, setCompacting] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/env/status');
      const data = await response.json();
      if (data.success) {
        setStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch env, status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/env/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' })
      });
      
      if (response.ok) {
        await fetchStatus();
      }
    } catch (error) {
      console.error('Failed to, sync:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleCompact = async () => {
    setCompacting(true);
    try {
      const response = await fetch('/api/env/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'compact' })
      });
      
      if (response.ok) {
        await fetchStatus();
      }
    } catch (error) {
      console.error('Failed to, compact:', error);
    } finally {
      setCompacting(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!status) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load environment status
        </AlertDescription>
      </Alert>
    );
  }

  const healthPercentage = (status.summary.valid / status.summary.total) * 100;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Environment Variables Status</CardTitle>
              <CardDescription>
                {status.environment} environment
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={syncing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                Sync
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCompact}
                disabled={compacting}
              >
                Compact
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {status.isValid ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">
                  {status.isValid ? 'Configuration Valid' : 'Configuration Has Issues'}
                </span>
              </div>
              <Badge variant={status.isValid ? 'default' : 'destructive'}>
                {healthPercentage.toFixed(0)}% Healthy
              </Badge>
            </div>
            
            <Progress value={healthPercentage} className="h-2" />
            
            <div className="grid grid-cols-2, md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">{status.summary.total}</div>
                <div className="text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{status.summary.valid}</div>
                <div className="text-muted-foreground">Valid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{status.summary.missing}</div>
                <div className="text-muted-foreground">Missing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{status.summary.warnings}</div>
                <div className="text-muted-foreground">Warnings</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Cards */}
      <div className="grid grid-cols-1, md:grid-cols-2, lg:grid-cols-3 gap-4">
        {Object.entries(status.services).map(([key, service]) => {
          const Icon = categoryIcons[service.category] || Shield;
          const variables = Object.entries(service.variables);
          const validCount = variables.filter(([_, v]) => v.status === '✅').length;
          const isHealthy = validCount === variables.length;
          
          return (
            <Card key={key} className={service.status === 'disabled' ? 'opacity-50' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base">{service.name}</CardTitle>
                  </div>
                  <Badge variant={isHealthy ? 'default' : 'secondary'}>
                    {validCount}/{variables.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {variables.map(([varName, varStatus]) => (
                    <div key={varName} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {varStatus.status === '✅' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        {varStatus.status === '❌' && <XCircle className="h-4 w-4 text-red-500" />}
                        {varStatus.status === '⚠️' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                        <span className={`${varStatus.required ? 'font-medium' : ''} ${varStatus.set ? '' : 'text-muted-foreground'}`}>
                          {varName}
                        </span>
                      </div>
                      {varStatus.required && !varStatus.set && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}