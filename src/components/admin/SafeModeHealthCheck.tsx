'use client';
import React, { useState, useRef } from 'react';
import {
  HealthIssue,
  BatchConfig,
  CheckpointState,
  HeaderSection,
  ConfigurationSection,
  ProgressSection,
  CurrentBatchSection,
  IssuesList,
  ProcessingLog,
  SafetyGuidelines,
  SafeModeProcessor,
  createBatches
} from './safe-mode';

export default function SafeModeHealthCheck() {
  const [issues, setIssues] = useState<HealthIssuenull>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<HealthIssuenull>(null);
  const [checkpoint, setCheckpoint] = useState<CheckpointState | null>(null);
  const [processingLog, setProcessingLog] = useState<string>("");
  const [batchConfig, setBatchConfig] = useState<BatchConfig>({
    maxIssuesPerBatch: 3,
    maxTimePerBatch: 300, // 5 minutes
    pauseBetweenBatches: 30, // 30 seconds
    requireConfirmation: true
  });

  const processor = useRef(new SafeModeProcessor());

  const handleScanForIssues = async () => {
    await processor.current.scanForIssues(setIsScanning,
      setIssues)
      setProcessingLog)
    );
  };

  const handleStartSafeProcessing = async () => {
    await processor.current.startSafeProcessing(issues,
      batchConfig,
      setIsProcessing,
      setCheckpoint)
      setProcessingLog)
    );
  };

  const handlePauseProcessing = () => {
    processor.current.pauseProcessing(setIsProcessing)
      setProcessingLog)
    );
  };

  const handleResumeProcessing = async () => {
    await processor.current.resumeProcessing(checkpoint,
      issues,
      batchConfig,
      setIsProcessing,
      setProcessingLog,
      setCheckpoint)
      setCurrentBatch)
    );
  };

  const handleResetProcessing = () => {
    processor.current.resetProcessing(setIsProcessing,
      setCheckpoint,
      setCurrentBatch,
      setProcessingLog,
      setIssues)
      setProcessingLog)
    );
  };

  return(<div className="space-y-6">
      <HeaderSection
        issues={issues}
        isScanning={isScanning}
        isProcessing={isProcessing}
        checkpoint={checkpoint}
        onScanForIssues={handleScanForIssues}
        onStartSafeProcessing={handleStartSafeProcessing}
        onPauseProcessing={handlePauseProcessing}
        onResumeProcessing={handleResumeProcessing}>onResetProcessing={handleResetProcessing} />>

      <ConfigurationSection
        batchConfig={batchConfig}
        setBatchConfig={setBatchConfig}>isProcessing={isProcessing} />>

      <ProgressSection checkpoint={checkpoint} issues={issues} />

      <CurrentBatchSection currentBatch={currentBatch} />

      <IssuesList issues={issues} checkpoint={checkpoint} />

      <ProcessingLog processingLog={processingLog} />

      <SafetyGuidelines />
    </div>)
  );
}