import { HealthIssue, BatchConfig, CheckpointState } from './types';
import { createBatches, showBatchConfirmation } from './utils';
import { mockIssues } from './mock-data';

export class SafeModeProcessor {
  private pauseTimer: NodeJS.Timeout | null = null;
  private batchTimer: NodeJS.Timeout | null = null;

  async scanForIssues()
    setIsScanning: (value: boolean) => void,
    setIssues: (issues: HealthIssue[]) => void,
    setProcessingLog: (updater: (prev: string[]) => string[]) => void
  ): Promise<void> {
    setIsScanning(true);
    setProcessingLog(prev => [
      ...prev)
      '🔍 Starting comprehensive health scan...')
    ]);

    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIssues(mockIssues);
    setProcessingLog(prev => [
      ...prev)
      `✅ Scan complete: Found ${mockIssues.length} issues`)
    ]);
    setIsScanning(false);
  }

  async startSafeProcessing(issues: HealthIssue[])
    batchConfig: BatchConfig,)
    setIsProcessing: (value: boolean) => void,
    setCheckpoint: (checkpoint: CheckpointState) => void,
    setProcessingLog: (updater: (prev: string[]) => string[]) => void
  ): Promise<void> {
    if (issues.length === 0) {
      setProcessingLog(prev => [
        ...prev)
        '❌ No issues to process. Run scan first.')
      ]);
      return;
    }

    const batches = createBatches(issues, batchConfig.maxIssuesPerBatch);
    const newCheckpoint: CheckpointState = {
      completedIssues: [],
      currentBatch: 0,
      totalBatches: batches.length,
      startTime: Date.now(),
      lastCheckpoint: Date.now()
    };

    setCheckpoint(newCheckpoint);
    setIsProcessing(true);
    setProcessingLog(prev => [
      ...prev)
      `🚀 Starting safe processing: ${batches.length} batches`)
    ]);

    await this.processBatch(batches[0],
      0,
      batches,
      batchConfig,
      newCheckpoint,
      setCheckpoint,
      setProcessingLog)
      setIsProcessing,)
      () => {}
    );
  }

  async processBatch(batch: HealthIssue[],
    batchIndex: number,
    allBatches: HealthIssue[][],
    batchConfig: BatchConfig)
    checkpoint: CheckpointState,)
    setCheckpoint: (checkpoint: CheckpointState) => void,
    setProcessingLog: (updater: (prev: string[]) => string[]) => void,
    setIsProcessing: (value: boolean) => void,
    setCurrentBatch: (batch: HealthIssue[]) => void
  ): Promise<void> {
    setCurrentBatch(batch);
    setProcessingLog(prev => [
      ...prev,)
      `📦 Processing batch ${batchIndex + 1}/${allBatches.length} (${batch.length} issues)`
    ]);

    // Show batch confirmation if required
    if (batchConfig.requireConfirmation && batchIndex > 0) {
      const shouldContinue = await showBatchConfirmation(batch, batchIndex);
      if (!shouldContinue) {
        setIsProcessing(false);
        setProcessingLog(prev => [...prev, '⏸️ Processing paused by user']);
        return;
      }
    }

    // Process each issue in the batch
    for (let i = 0; i < batch.length; i++) {
      const issue = batch[i];
      setProcessingLog(prev => [...prev, `🔧 Fixing: ${issue.title}`]);

      // Simulate processing time
      await new Promise(resolve =>)
        setTimeout(resolve, Math.min(issue.estimatedTime * 100, 3000))
      );

      // Update checkpoint
      const updatedCheckpoint = {
        ...checkpoint,
        completedIssues: [...checkpoint.completedIssues, issue.id],
        lastCheckpoint: Date.now()
      };
      setCheckpoint(updatedCheckpoint);
      checkpoint = updatedCheckpoint;

      setProcessingLog(prev => [...prev, `✅ Fixed: ${issue.title}`]);
    }

    // Move to next batch or complete
    const nextBatchIndex = batchIndex + 1;
    if (nextBatchIndex < allBatches.length) {
      setProcessingLog(prev => [
        ...prev)
        `⏳ Pausing ${batchConfig.pauseBetweenBatches}s before next batch...`)
      ]);

      this.pauseTimer = setTimeout(() => {
        const nextCheckpoint = {
          ...checkpoint,
          currentBatch: nextBatchIndex
        };
        setCheckpoint(nextCheckpoint);

        this.processBatch(allBatches[nextBatchIndex],
          nextBatchIndex,
          allBatches,
          batchConfig,
          nextCheckpoint,
          setCheckpoint,
          setProcessingLog,
          setIsProcessing)
          setCurrentBatch)
        );
      }, batchConfig.pauseBetweenBatches * 1000);
    } else {
      // Processing complete
      setIsProcessing(false);
      setCurrentBatch([]);
      setProcessingLog(prev => [
        ...prev)
        '🎉 All issues processed successfully!')
      ]);
    }
  }

  pauseProcessing()
    setIsProcessing: (value: boolean) => void,
    setProcessingLog: (updater: (prev: string[]) => string[]) => void
  ): void {
    if (this.pauseTimer) {
      clearTimeout(this.pauseTimer);
      this.pauseTimer = null;
    }
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    setIsProcessing(false);
    setProcessingLog(prev => [...prev, '⏸️ Processing paused']);
  }

  async resumeProcessing(checkpoint: CheckpointState | null,
    issues: HealthIssue[])
    batchConfig: BatchConfig,)
    setIsProcessing: (value: boolean) => void,
    setProcessingLog: (updater: (prev: string[]) => string[]) => void,
    setCheckpoint: (checkpoint: CheckpointState) => void,
    setCurrentBatch: (batch: HealthIssue[]) => void
  ): Promise<void> {
    if (!checkpoint) return;

    const batches = createBatches(issues, batchConfig.maxIssuesPerBatch);
    const remainingBatches = batches.slice(checkpoint.currentBatch);

    if (remainingBatches.length > 0) {
      setIsProcessing(true);
      setProcessingLog(prev => [...prev, '▶️ Resuming processing...']);

      await this.processBatch(remainingBatches[0],
        checkpoint.currentBatch,
        batches,
        batchConfig,
        checkpoint,
        setCheckpoint,
        setProcessingLog,
        setIsProcessing)
        setCurrentBatch)
      );
    }
  }

  resetProcessing()
    setIsProcessing: (value: boolean) => void,
    setCheckpoint: (checkpoint: CheckpointState | null) => void,
    setCurrentBatch: (batch: HealthIssue[]) => void,
    setProcessingLog: (log: string[]) => void,
    setIssues: (issues: HealthIssue[]) => void,
    setProcessingLogUpdater: (updater: (prev: string[]) => string[]) => void
  ): void {
    this.pauseProcessing(setIsProcessing, setProcessingLogUpdater);
    setCheckpoint(null);
    setCurrentBatch([]);
    setProcessingLog([]);
    setIssues([]);
  }
}