'use client';
import React from 'react';
import { Card } from '../../ui/card';

interface ProcessingLogProps {
  processingLog: string[];
}

export function ProcessingLog({ processingLog }: ProcessingLogProps) {
  if (processingLog.length === 0) return null;

  return (
    <Card className="glass p-4">
      <h3 className="font-medium text-gray-700 mb-3">📝 Processing Log</h3>
      <div className="glass-navbar text-green-200 p-4 rounded-lg font-mono text-sm max-h-48 overflow-y-auto">
        {processingLog.map((log, index) => (
          <div key={index} className="mb-1">
            [{new Date().toLocaleTimeString()}] {log}
          </div>
        ))}
      </div>
    </Card>
  );
}