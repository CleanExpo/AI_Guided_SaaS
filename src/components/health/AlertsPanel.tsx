// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface Alert { id: string
  type: 'error' | 'warning' | 'info',
  message: string
  timestamp: Date
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    // Simulate loading alerts
    setAlerts([
      { id: '1',
        type: 'info',
        message: 'System running normally',
        timestamp: new Date()
}
    ])
}, []);

  return (
    <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
        <h3 className="text-lg font-medium">System Alerts</h3>
      </div>
      <div className="divide-y max-h-64 overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">No active alerts</p>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="p-4 flex items-start gap-3">
              {alert.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500 mt-0.5"  />}
              {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5"  />}
              {alert.type === 'info' && <Info className="h-5 w-5 text-blue-500 mt-0.5"  />}
              <div className="flex-1">
                <p className="text-sm">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {alert.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}