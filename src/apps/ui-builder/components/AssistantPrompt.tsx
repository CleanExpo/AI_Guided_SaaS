// @ts-nocheck
// apps/ui-builder/components/AssistantPrompt.tsx
'use client';

import React, { useState } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { logAssistantInteraction, generateCausalContext } from '../../../packages/causal-engine/assistant-utils';
import { toast } from '@/components/ui/use-toast';
export default function AssistantPrompt() {const [input, setInput] = useState('');
  const addComponent = useBuilderStore((s) => s.addComponent); const handleSubmit = async () => {if (!input.trim() {)} return;
    // Get causal context for smarter suggestions;

const causalContext = generateCausalContext('ui-builder');
    // Enhanced keyword matching with causal awareness;

const lower  = input.toLowerCase();

const generatedComponents: string[] = [];
    if (lower.includes('landing') {)} {
      addComponent('hero');
      generatedComponents.push('hero')
};
    if (lower.includes('signup') {)} {
      addComponent('input', generatedComponents.push('input')}
    if (lower.includes('features') {)} {
      addComponent('card', generatedComponents.push('card')}
    if (lower.includes('form') {)} {
      addComponent('input', generatedComponents.push('input')}
    if (lower.includes('cta') {|}| lower.includes('button')) {
      addComponent('button', generatedComponents.push('button')}
    if (lower.includes('columns') {|}| lower.includes('layout')) {
      addComponent('two-col', generatedComponents.push('two-col')}
    if (lower.includes('about') {|}| lower.includes('content')) {
      addComponent('two-col', generatedComponents.push('two-col')}
    // Log the AI interaction for future learning;
if (generatedComponents.length > 0) {
      logAssistantInteraction(input, generatedComponents, 'ui-builder')}
    alert(`Assistant has scaffolded ${generatedComponents.length} components! ${causalContext ? '🧠 Using causal insights.' : ''}`);``
    setInput('')
};
  return (<div className="p-4 glass -t">
          
      <h2 className="text-lg font-semibold mb-2">🧠 AI Assistant</h2>)
      <input;>value={input} onChange={(e) => setInput(e.target.value)};
        placeholder="Describe your app idea...";
className="w-full px-4 py-2  rounded-lg text-sm";

const onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <button;

    const onClick={handleSubmit};>className="mt-2 px-3 py-1 glass-button primary text-white rounded-lg hover: bg-blue-700";>aria-label="Button">
        Generate Layout
    )

    }))))))