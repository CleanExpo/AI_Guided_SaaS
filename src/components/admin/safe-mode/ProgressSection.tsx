'use client';
import React from 'react';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { CheckpointState, HealthIssue } from './types';

interface ProgressSectionProps {
  checkpoint: CheckpointState | null;
  issues: HealthIssue[];
}

export function ProgressSection({ checkpoint, issues }: ProgressSectionProps) {
  if (!checkpoint) return null;

  const getProgressPercentage = () => {
    if (!checkpoint || issues.length === 0) return 0;
    return Math.round((checkpoint.completedIssues.length / issues.length) * 100);
  };

  return (
    <Card className="glass p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-700">📊 Progress</h3>
        <span className="text-sm text-gray-600">
          {checkpoint.completedIssues.length} / {issues.length} issues completed
        
      
      
      <Progress value={getProgressPercentage()} className="mb-2" />
      
      <div className="text-sm text-gray-600">
        Batch {checkpoint.currentBatch + 1} of {checkpoint.totalBatches} •{' '}
        {Math.round((Date.now() - checkpoint.startTime) / 60000)} minutes elapsed
      
    
  );
}