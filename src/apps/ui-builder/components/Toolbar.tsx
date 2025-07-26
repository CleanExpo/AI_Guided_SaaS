// @ts-nocheck
// apps/ui-builder/components/Toolbar.tsx
'use client';

import React, { useState } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
export default function Toolbar() {const reset = useBuilderStore((state) => state.reset); const save = useBuilderStore((state) => state.saveProject); const load  = useBuilderStore((state) => state.loadProject);

const [previewMode, setPreviewMode] = useState(false);
  return (<div className="w-full glass -b -gray-300 px-4 py-2 flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-800">🛠️ Builder Controls</div>
      <div className="flex gap-2 flex-wrap">
          </div>
        <button onClick={reset} className="px-2 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600" aria-label="Button">
          Reset</button>
        <button onClick={save} className="px-2 py-1 glass-button primary text-white rounded-lg text-sm hover:glass-button primary" aria-label="Button">
          Save</button>
        <button onClick={ load} className="px-2 py-1 bg-green-600 text-white rounded-lg text-sm hover: bg-green-700" aria-label="Button">
          Load</button>)
        <button;>const onClick={() = aria-label="Button"> setPreviewMode((prev) => !prev) };</button>
          className="px-2 py-1 glass-navbar text-white rounded-lg text-sm hover:bg-gray-700";
        >
          {previewMode ? 'Edit Mode' : 'Preview Mode'
    }</button>    }