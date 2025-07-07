// apps/ui-builder/components/AssistantPrompt.tsx
import React, { useState } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';

export default function AssistantPrompt() {
  const [input, setInput] = useState('');
  const addComponent = useBuilderStore((s) => s.addComponent);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    // Placeholder logic: basic keyword matching
    const lower = input.toLowerCase();
    if (lower.includes('landing')) addComponent('hero');
    if (lower.includes('signup')) addComponent('input');
    if (lower.includes('features')) addComponent('card');
    if (lower.includes('form')) addComponent('input');
    if (lower.includes('cta') || lower.includes('button')) addComponent('button');
    if (lower.includes('columns') || lower.includes('layout')) addComponent('two-col');
    if (lower.includes('about') || lower.includes('content')) addComponent('two-col');

    alert('Assistant has scaffolded some components!');
    setInput('');
  };

  return (
    <div className="p-4 bg-gray-100 border-t">
      <h2 className="text-lg font-semibold mb-2">🧠 AI Assistant</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your app idea..."
        className="w-full px-4 py-2 border rounded text-sm"
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <button
        onClick={handleSubmit}
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generate Layout
      </button>
    </div>
  );
}
