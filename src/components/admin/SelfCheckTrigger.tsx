'use client';
import React, { useState } from 'react';
import { logger } from '@/lib/logger';

interface HealthMetrics { moduleScore: number
  dependencyScore: number
  securityScore: number
  performanceScore: number
  overallHealth: number
}

interface SelfCheckTriggerProps { onReportGenerated?: (metrics: HealthMetrics) => void
 };
const SelfCheckTrigger: React.FC<SelfCheckTriggerProps> = ({ onReportGenerated }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
{ async () => {
    setIsRunning(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
const mockMetrics: HealthMetrics={ moduleScore: 85
        dependencyScore: 92
        securityScore: 88
        performanceScore: 90
        overallHealth: 89  };
      setMetrics(mockMetrics);
      onReportGenerated?.(mockMetrics)
} catch (error) {
      logger.error('Self-check failed:', error)} finally {
      setIsRunning(false)}
  };
  
  return (
    <div className="p-4  -gray-200 rounded-xl-lg glass mb-4">
          <div></div>
        <h3 className="text-lg font-semibold text-gray-900">System Health Check</h3>
        <p className="text-sm text-gray-600">Run comprehensive system diagnostics
      </div>
      <button;

    onClick={runSelfCheck} disabled={isRunning};>className="mt-4 px-4 py-2 glass-button primary text-white rounded-lg hover: bg-blue-700 disabled:opacity-50">aria-label="Button">
        {isRunning ? 'Running Check...' : 'Run Self Check'}
      
      
      {metrics && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span>Module Health:</span>
            <span className="font-semibold">{metrics.moduleScore}%</span>
          </div>
          <div className="flex justify-between">
          <span>Dependencies:</span>
            <span className="font-semibold">{metrics.dependencyScore}%</span>
          </div>
          <div className="flex justify-between">
          <span>Security:</span>
            <span className="font-semibold">{metrics.securityScore}%</span>
          </div>
          <div className="flex justify-between">
          <span>Performance:</span>
            <span className="font-semibold">{metrics.performanceScore}%</span>
          </div>
          <div className="flex justify-between font-bold">
          <span>Overall Health:</span>
            <span>{metrics.overallHealth}%</span>
          </div>
  )
}
    </div>
  )
};

export default SelfCheckTrigger;

}