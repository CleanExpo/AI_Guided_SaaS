import React from 'react';
import { Alert } from 'lucide-react';

export interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

interface AlertsPanelProps {
  alerts?: SystemAlert[];
}

export function AlertsPanel({ alerts = [] }: AlertsPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b">
        <h3 className="text-lg font-medium">System Alerts</h3>
      </div>
      <div className="divide-y max-h-64 overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">No active alerts</p>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="p-4 flex items-start">
              <Alert 
                className={`h-5 w-5 mr-3 ${
                  alert.type === 'error' ? 'text-red-500' :
                  alert.type === 'warning' ? 'text-yellow-500' :
                  'text-blue-500'
                }`} 
              />
              <div className="">
        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}