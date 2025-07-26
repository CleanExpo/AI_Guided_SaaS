'use client';
import React from 'react';
import { Card } from '../../ui/card';

export function SafetyGuidelines() {
  return (
    <Card className="glass p-4 bg-blue-50">
      <h3 className="font-medium text-blue-900 mb-2">🛡️ Safety Guidelines</h3>
      <ul className="text-sm text-blue-800 space-y-1">
        <li>
          • <strong>Small batches</strong>: Process only 3-5 issues at a time
        </li>
        <li>
          • <strong>Regular breaks</strong>: 30-second pause between batches
        </li>
        <li>
          • <strong>Manual confirmation</strong>: Review each batch before processing
        </li>
        <li>
          • <strong>Progress tracking</strong>: Resume from any checkpoint
        </li>
        <li>
          • <strong>Emergency stop</strong>: Pause immediately if system becomes slow
        </li>
      </ul>
    </Card>
  );
}