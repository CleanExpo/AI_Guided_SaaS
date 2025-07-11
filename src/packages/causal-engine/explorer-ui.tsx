// packages/causal-engine/explorer-ui.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { logger } from './logger';
import { CausalScorer } from './scorer';

interface CausalInsight {
  key: string;
  score: number;
  confidence: string;
  total: number;
  componentType: string;
  page: string;
}

export default function CausalExplorerUI() {
  const [insights, setInsights] = useState<CausalInsight[]>([]);
  const [topComponents, setTopComponents] = useState<CausalInsight[]>([]);
  const [lowComponents, setLowComponents] = useState<CausalInsight[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const logs = logger.getLogs();
    const scorer = new CausalScorer(logs);

    setTotalLogs(logs.length);

    // Get all scores and format for display
    const allScores = scorer.getAllScores();
    const formattedInsights: CausalInsight[] = Object.entries(allScores).map(
      ([key, data]) => {
        const [page, componentType] = key.split(':');
        return {
          key,
          ...data,
          componentType,
          page,
        };
      }
    );

    setInsights(formattedInsights.sort((a, b) => b.score - a.score));
    setTopComponents(scorer.getTopComponents(5) as CausalInsight[]);
    setLowComponents(scorer.getLowPerformingComponents(0.4) as CausalInsight[]);
  };

  const clearAllLogs = () => {
    if (
      confirm(
        'Are you sure you want to clear all causal logs? This cannot be undone.'
      )
    ) {
      logger.clearLogs();
      refreshData();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600 bg-green-100';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceColor = (confidence: string) => {
    if (confidence === 'high') return 'text-blue-600 bg-blue-100';
    if (confidence === 'medium')
      return 'text-brand-primary-600 bg-brand-primary-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧠 Causal Intelligence Explorer
        </h1>
        <p className="text-gray-600">
          Analyze user behavior patterns and component performance using causal
          inference.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">
            Total Interactions
          </h3>
          <p className="text-2xl font-bold text-gray-900">{totalLogs}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">
            Components Tracked
          </h3>
          <p className="text-2xl font-bold text-gray-900">{insights.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">High Performers</h3>
          <p className="text-2xl font-bold text-green-600">
            {topComponents.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">
            Need Improvement
          </h3>
          <p className="text-2xl font-bold text-red-600">
            {lowComponents.length}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🔄 Refresh Data
        </button>
        <button
          onClick={clearAllLogs}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          🗑️ Clear All Logs
        </button>
      </div>

      {/* Top Performers */}
      {topComponents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            🏆 Top Performing Components
          </h2>
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Component
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Confidence
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Interactions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topComponents.map(comp => (
                  <tr key={comp.key}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {comp.key.split(':')[1]}{' '}
                      <span className="text-gray-500">
                        ({comp.key.split(':')[0]})
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(comp.score)}`}
                      >
                        {(comp.score * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(comp.confidence)}`}
                      >
                        {comp.confidence}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {comp.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Low Performers */}
      {lowComponents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            ⚠️ Components Needing Improvement
          </h2>
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Component
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Confidence
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Interactions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lowComponents.map(comp => (
                  <tr key={comp.key}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {comp.key.split(':')[1]}{' '}
                      <span className="text-gray-500">
                        ({comp.key.split(':')[0]})
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(comp.score)}`}
                      >
                        {(comp.score * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(comp.confidence)}`}
                      >
                        {comp.confidence}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {comp.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Components */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          📊 All Component Insights
        </h2>
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Component
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Page
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Confidence
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Interactions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {insights.map(insight => (
                <tr key={insight.key}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {insight.componentType}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {insight.page}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(insight.score)}`}
                    >
                      {(insight.score * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(insight.confidence)}`}
                    >
                      {insight.confidence}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {insight.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {insights.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No component data available. Start using the UI builder to
              generate insights!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
