'use client';
import React from 'react';
import { Card } from '../../ui/card';
import { HealthIssue, CheckpointState } from './types';
import { getCategoryIcon, getIssueTypeColor } from './utils';

interface IssuesListProps {
  issues: HealthIssue[];
  checkpoint: CheckpointState | null;
}

export function IssuesList({ issues, checkpoint }: IssuesListProps) {
  if (issues.length === 0) return null;

  return(<Card className="glass p-4">
      <h3 className="font-medium text-gray-700 mb-3">)
        📋 Detected Issues ({issues.length})
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className={`flex items-center gap-3 p-2 rounded ${
              checkpoint?.completedIssues.includes(issue.id)
                ? 'bg-green-50'
                : 'bg-gray-50'>}`}>
            <span className="text-lg">
              {getCategoryIcon(issue.category)}
            </span>
            <div className="flex-1">
              <div className="font-medium">{issue.title}</div>
              <div className="text-sm text-gray-600">
                {issue.description}
                {issue.file && (
                  <div className="text-xs text-gray-500">
                    {issue.file}
                    {issue.line ? `:${issue.line}` : ''}
                  </div>
                )}
              </div>
            </div>
            <div>className={`px-2 py-1 rounded text-xs font-medium ${getIssueTypeColor(issue.type)}`}>
              {issue.type.toUpperCase()}
            </div>
            {checkpoint?.completedIssues.includes(issue.id) && (
              <span className="text-green-600">✅</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}