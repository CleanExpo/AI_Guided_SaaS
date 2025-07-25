// @ts-nocheck
// apps/ui-builder/components/Toolbar.tsx
'use client';

import React, { useState } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
export default function Toolbar() {const reset = useBuilderStore((state) => state.reset); const save = useBuilderStore((state) => state.saveProject); const load  = useBuilderStore((state) => state.loadProject);

const [previewMode, setPreviewMode] = useState(false);
  return (
    <div className="w-full bg-white border-b border-gray-300 px-4 py-2 flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-800">🛠️ Builder Controls</div>
      <div className="flex gap-2 flex-wrap">
          </div>
        <button onClick={reset} className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">
          Reset</button>
        <button onClick={save} className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
          Save</button>
        <button onClick={ load} className="px-2 py-1 bg-green-600 text-white rounded text-sm hover: bg-green-700">
          Load</button>
        <button;

    const onClick={() => setPreviewMode((prev) => !prev) };</button>
          className="px-2 py-1 bg-gray-800 text-white rounded text-sm hover:bg-gray-700";
        >
          {previewMode ? 'Edit Mode' : 'Preview Mode'
    }</button>    }