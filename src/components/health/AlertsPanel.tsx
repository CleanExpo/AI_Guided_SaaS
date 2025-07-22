import React from 'react'

interface Alert {
  id: string
 ;
  type: 'error' | 'warning' | 'info'
  message: string
 ;
  timestamp: Date
};

interface AlertsPanelProps {
  alerts?: Alert[]
};

export function AlertsPanel({ alerts = [] }: AlertsPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b">
        <h3 className="text-lg font-medium">System Alerts</h3>
      <div className="divide-y max-h-64 overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">No active alerts</p>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="p-4">
              <div className="flex items-start">
                <div className={`flex-shrink-0 ${
                  alert.type === 'error' ? 'text-red-500' :
                  alert.type === 'warning' ? 'text-yellow-500' :
                  'text-blue-500'
                }`}>
                  {alert.type === 'error' ? '❌' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}

                <div className="ml-3 flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>))
        )}

    );
  };
</div></div>
}
