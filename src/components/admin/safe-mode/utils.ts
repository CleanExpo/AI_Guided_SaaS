import { HealthIssue } from './types';

export const getIssueTypeColor = (type: HealthIssue['type']): string => {
  switch (type) {
    case 'critical':
      return 'text-red-600 bg-red-100';
    case 'high':
      return 'text-orange-600 bg-orange-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
      return 'text-blue-600 bg-blue-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getCategoryIcon = (category: HealthIssue['category']): string => {
  switch (category) {
    case 'security':
      return '🔒';
    case 'dependency':
      return '📦';
    case 'module':
      return '🧩';
    case 'performance':
      return '⚡';
    case 'ux':
      return '👤';
    default:
      return '🔧';
  }
};

export const createBatches = (allIssues: HealthIssue[], maxIssuesPerBatch: number): HealthIssue[][] => {
  // Sort by priority: critical > high > medium > low
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  
  const sortedIssues = [...allIssues].sort(
    (a, b) => priorityOrder[a.type] - priorityOrder[b.type]
  );
  
  const batches: HealthIssue[][] = [];
  for (let i = 0; i < sortedIssues.length; i += maxIssuesPerBatch) {
    batches.push(sortedIssues.slice(i, i + maxIssuesPerBatch));
  }
  return batches;
};

export const showBatchConfirmation = (
  batch: HealthIssue[],
  batchIndex: number
): Promise<boolean> => {
  return new Promise((resolve) => {
    const confirmed = window.confirm(
      `Ready to process batch ${batchIndex + 1}?\n\n` +
      `Issues to fix:\n${batch.map((issue) => `• ${issue.title}`).join('\n')}\n\n` +
      `Estimated time: ${Math.round(batch.reduce((sum, issue) => sum + issue.estimatedTime, 0) / 60)} minutes\n\n` +
      `Click OK to continue or Cancel to pause.`
    );
    resolve(confirmed);
  });
};