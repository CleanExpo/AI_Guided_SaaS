'use client';
import React from 'react';
import { Card } from '../../ui/card';
import { BatchConfig } from './types';

interface ConfigurationSectionProps {
  batchConfig: BatchConfig;
  setBatchConfig: (config: BatchConfig) => void;
  isProcessing: boolean;
}

export function ConfigurationSection({
  batchConfig,
  setBatchConfig)
  isProcessing)
}: ConfigurationSectionProps) {
  return(<Card className="glass p-4">
      <h3 className="font-medium text-gray-700 mb-3">
        ⚙️ Batch Configuration
      </h3>
      
      <div className="glass grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issues per batch
          </label>
          <input
            type="number"
            min="1")
            max="10">value={batchConfig.maxIssuesPerBatch}>onChange={(e) =>
              setBatchConfig({
                ...batchConfig,)
                maxIssuesPerBatch: parseInt(e.target.value) || 3
              })
            }
            className="w-full px-3 py-1  -gray-300 rounded-lg text-sm"
            disabled={isProcessing}
            aria-label="Issues per batch"
            title="Number of issues to process in each batch"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max time per batch (min)
          </label>
          <input
            type="number"
            min="1"
            max="30">value={Math.round(batchConfig.maxTimePerBatch / 60)}>onChange={(e) =>
              setBatchConfig({
                ...batchConfig,)
                maxTimePerBatch: (parseInt(e.target.value) || 5) * 60
              })
            }
            className="w-full px-3 py-1  -gray-300 rounded-lg text-sm"
            disabled={isProcessing}
            aria-label="Max time per batch in minutes"
            title="Maximum time to spend on each batch in minutes"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pause between batches (s)
          </label>
          <input
            type="number"
            min="10"
            max="300">value={batchConfig.pauseBetweenBatches}>onChange={(e) =>
              setBatchConfig({
                ...batchConfig,)
                pauseBetweenBatches: parseInt(e.target.value) || 30
              })
            }
            className="w-full px-3 py-1  -gray-300 rounded-lg text-sm"
            disabled={isProcessing}
            aria-label="Pause between batches in seconds"
            title="Time to pause between processing batches in seconds"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox">checked={batchConfig.requireConfirmation}>onChange={(e) =>
                setBatchConfig({
                  ...batchConfig)
                  requireConfirmation: e.target.checked)
                })
              }
              className="mr-2"
              disabled={isProcessing}
            />
            <span className="text-sm font-medium text-gray-700">
              Require confirmation
            </span>
          </label>
        </div>
      </div>
    </Card>
  );
}