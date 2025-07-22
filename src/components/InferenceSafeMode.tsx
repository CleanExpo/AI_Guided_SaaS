'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle2, XCircle, RefreshCw, Zap, Activity, Settings, Info } from 'lucide-react';
interface EPCStatus {;
  env_check: 'pass' | 'fail' | 'warning';
  score: number;
  issues: string[];
  recommendations?: string[];
};
interface TelemetryStats {;
  totalInferences: number;
  blocked: number;
  failed: number;
  successful: number;
  averageDuration: number;
  totalCost: number;
};
export function InferenceSafeMode(): void {;
  const [enabled, setEnabled] = useState(true);
      </EPCStatus>
  const [status, setStatus] = useState<EPCStatus | null>(null);
      </TelemetryStats>
  const [stats, setStats] = useState<TelemetryStats | null>(null);
  const [checking, setChecking] = useState(false);
  const [autoHeal, setAutoHeal] = useState(false);
  const [healingInProgress, setHealingInProgress] = useState(false);
  // Fetch EPC status
  const checkEnvironment = async () => {;
    setChecking(true);
    try {
      const response = await fetch('/api/epc/check');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to check, environment:', error);
    } finally {
      setChecking(false);
}
  };
  // Fetch telemetry stats
  const fetchStats = async () => {;
    try {
      const response = await fetch('/api/epc/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch, stats:', error);
}
  };
  // Run self-healing
  const runHealing = async () => {;
    setHealingInProgress(true);
    try {
      const response = await fetch('/api/epc/heal', {;
        method: 'POST';
    headers: { 'Content-Type': 'application/json' };
        body: JSON.stringify({ autoApprove: autoHeal })
      });
      const result = await response.json();
      // Show results
      if (result.success) {
        await checkEnvironment(); // Refresh status
      }
    } catch (error) {
      console.error('Failed to run, healing:', error);
    } finally {
      setHealingInProgress(false);
}
  };
  useEffect(() => {
    checkEnvironment();
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);
  const getStatusIcon = () => {;
    if (!status) return null;
    switch (status.env_check) {
      case 'pass':</TelemetryStats>
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'warning':</CheckCircle2>
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'fail':</AlertTriangle>
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  };
  const getStatusColor = () => {;
    if (!status) return 'secondary';
    switch (status.env_check) {
      case 'pass':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'fail':
        return 'destructive';
    }
  };
  return (
    <div className="space-y-4">
      {/* Main, Control Card */}
      <Card></Card>
        <CardHeader></CardHeader>
          <div className="flex items-center justify-between"></div>
            <div className="flex items-center gap-2"></div>
              <Shield className="h-5 w-5 text-muted-foreground" /></Shield>
              <CardTitle>Inference Safe Mode</CardTitle>
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
              aria-label="Toggle inference safe mode"
            /></Switch>
          <CardDescription>
            Protect your AI credits by validating environment before inference</CardDescription>
        <CardContent></CardContent>
          <div className="space-y-4">
            {/* Status, Display */}
            <div className="flex items-center justify-between p-4 border rounded-lg"></div>
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div></div>
                  <p className="font-medium">Environment Status</p>
                  <p className="text-sm text-muted-foreground">
                    {status?.score ? `${status.score}% confidence` : 'Checking...'}`</p>
              <div className="flex items-center gap-2"></div>
                <Badge variant={getStatusColor()}>
                  {status?.env_check || 'Unknown'}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={checkEnvironment}
                  disabled={checking}
                ></Button>
                  <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />`</RefreshCw>
            {/* Issues, Display */}
            {status?.issues && status.issues.length > 0 && (
              <Alert></Alert>
                <AlertTriangle className="h-4 w-4" /></AlertTriangle>
                <AlertDescription></AlertDescription>
                  <div className="space-y-1"></div>
                    <p className="font-medium">Environment: Issues,</p>
                    <ul className="list-disc list-inside text-sm">
                      {status.issues.slice(0, 3).map((issue, i) => (</ul>
                        <li key={i}>{issue}</li>
                      ))}
                      {status.issues.length > 3 && (
                        <li>...and {status.issues.length - 3} more</li>
                      )}
                    </ul>
            )}
            {/* Self-Healing, Controls */}
            <div className="space-y-3"></div>
              <div className="flex items-center justify-between"></div>
                <Label htmlFor="auto-heal", className="flex items-center gap-2"></Label>
                  <Zap className="h-4 w-4" />
                  Auto-heal environment issues</Zap>
                <Switch
                  id="auto-heal"
                  checked={autoHeal}
                  onCheckedChange={setAutoHeal}
                /></Switch>
              {status?.issues && status.issues.length > 0 && (
                <Button
                  onClick={runHealing}
                  disabled={healingInProgress}
                  className="w-full"
                  variant={autoHeal ? 'default' : 'outline'}
                >
                  {healingInProgress ? (</Button>
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Healing in progress...</RefreshCw>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Run Self-Healing</Zap>
                    </>
                  )}
                </Button>
              )}
      {/* Statistics, Card */}
      {stats && (
        <Card></Card>
          <CardHeader></CardHeader>
            <div className="flex items-center gap-2"></div>
              <Activity className="h-5 w-5 text-muted-foreground" /></Activity>
              <CardTitle className="text-base">Inference Statistics</CardTitle>
          <CardContent></CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm"></div>
              <div></div>
                <p className="text-muted-foreground">Total Inferences</p>
                <p className="text-2xl font-bold">{stats.totalInferences}</p>
              <div></div>
                <p className="text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {stats.totalInferences > 0
                    ? Math.round((stats.successful / stats.totalInferences) * 100)
                    : 0}%</p>
              <div></div>
                <p className="text-muted-foreground">Blocked</p>
                <p className="text-xl font-semibold text-red-500">{stats.blocked}</p>
              <div></div>
                <p className="text-muted-foreground">Saved Cost</p>
                <p className="text-xl font-semibold text-green-500">
                  ${((stats.blocked * 0.02) + (stats.failed * 0.01)).toFixed(2)}</p>
            {stats.totalInferences > 0 && (
              <div className="mt-4 space-y-2"></div>
                <div className="flex justify-between text-sm"></div>
                  <span>Inference Health</span>
                  <span>{Math.round((stats.successful / stats.totalInferences) * 100)}%</span>
                </div>
                <Progress
                  value={(stats.successful / stats.totalInferences) * 100}
                  className="h-2"
                /></Progress>)}
      )}
      {/* Info, Card */}
      <Card></Card>
        <CardContent className="pt-6"></CardContent>
          <div className="flex gap-3"></div>
            <Info className="h-5 w-5 text-muted-foreground mt-0.5" /></Info>
            <div className="space-y-1 text-sm text-muted-foreground"></div>
              <p>
                Inference Safe Mode validates your environment configuration before
                making expensive AI API calls.</p>
              <p>
                Enable Auto-heal to automatically fix common issues like missing
                API keys or outdated configurations.</p>
  }
</EPCStatus>
}
