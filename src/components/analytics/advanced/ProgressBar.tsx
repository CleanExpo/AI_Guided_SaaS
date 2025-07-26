import React from 'react';

interface ProgressBarProps {
  label: string;
  percentage: number;
  color: string;
}

export function ProgressBar({ label, percentage, color }: ProgressBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm">{label}
        <span className="text-sm font-medium">{percentage}%
      </div>
      <div className="w-full glass-sidebar rounded-lg-full h-2">
        <div 
          className={`${color} h-2 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}