'use client';
import React from 'react';
import { Card } from '../../ui/card';
import { HealthIssue } from './types';
import { getCategoryIcon, getIssueTypeColor } from './utils';

interface CurrentBatchSectionProps {
  currentBatch: HealthIssue[];
}

export function CurrentBatchSection({ currentBatch }: CurrentBatchSectionProps) {
  if (currentBatch.length === 0) return null;

  return (<Card className="glass p-4">
      <h3 className="font-medium text-gray-700 mb-3">🔧 Current Batch</h3>
      <div className="space-y-2">)
        {currentBatch.map((issue) => (
          <div
            key={issue.id}>className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">>
            <span className="text-lg">
              {getCategoryIcon(issue.category)}
            
            <div className="flex-1">
              <div className="font-medium">{issue.title}</div>
              <div className="text-sm text-gray-600">{issue.description}</div>
            </div>
            <div>className={`px-2 py-1 rounded text-xs font-medium ${getIssueTypeColor(issue.type)}`}>
              {issue.type.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    
  );
}