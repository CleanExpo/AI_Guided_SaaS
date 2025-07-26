'use client';
import React from 'react';
import { Button } from '../../ui/button';
import { HealthIssue, CheckpointState } from './types';

interface HeaderSectionProps {
  issues: HealthIssue[];
  isScanning: boolean;
  isProcessing: boolean;
  checkpoint: CheckpointState | null;
  onScanForIssues: () => void;
  onStartSafeProcessing: () => void;
  onPauseProcessing: () => void;
  onResumeProcessing: () => void;
  onResetProcessing: () => void;
}

export function HeaderSection({
  issues,
  isScanning,
  isProcessing,
  checkpoint,
  onScanForIssues,
  onStartSafeProcessing,
  onPauseProcessing,
  onResumeProcessing,
  onResetProcessing
}: HeaderSectionProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          🛡️ Safe Mode Health Check
        </h2>
        <p className="text-gray-600">
          Process errors in small batches to prevent system overload
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button
          onClick={onScanForIssues}
          disabled={isScanning || isProcessing}
          className="glass-button primary "
        >
          {isScanning ? '🔍 Scanning...' : '🔍 Scan for Issues'}
        </Button>

        {issues.length > 0 && !isProcessing && (
          <Button
            onClick={onStartSafeProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            🚀 Start Safe Processing
          </Button>
        )}

        {isProcessing && (
          <>
            <Button onClick={onPauseProcessing} variant="outline">
              ⏸️ Pause
            </Button>
            <Button
              onClick={onPauseProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              🛑 Stop
            </Button>
          </>
        )}

        {checkpoint && !isProcessing && (
          <Button
            onClick={onResumeProcessing}
            className="bg-orange-600 hover:bg-orange-700"
          >
            ▶️ Resume
          </Button>
        )}

        <Button onClick={onResetProcessing} variant="outline">
          🔄 Reset
        </Button>
      </div>
    </div>
  );
}