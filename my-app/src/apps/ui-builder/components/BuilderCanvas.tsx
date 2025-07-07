// apps/ui-builder/components/BuilderCanvas.tsx
import React from 'react';
import { useBuilderStore } from '../store/useBuilderStore';

export default function BuilderCanvas() {
  const components = useBuilderStore((state) => state.components);

  return (
    <main className="flex-grow bg-gray-100 p-8 border-b border-gray-300 overflow-y-auto">
      <div className="h-full w-full border-2 border-dashed border-gray-400 p-4 space-y-4">
        {components.length === 0 ? (
          <span className="text-gray-500">Click components to add them here.</span>
        ) : (
          components.map((c) => (
            <div
              key={c.id}
              className="p-4 bg-white shadow-md border rounded text-gray-700"
            >
              📦 {c.type} component placeholder
            </div>
          ))
        )}
      </div>
    </main>
  );
}
