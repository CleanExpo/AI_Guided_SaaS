// apps/ui-builder/components/BuilderCanvas.tsx
import React from 'react';

export default function BuilderCanvas() {
  return (
    <main className="flex-grow bg-gray-100 p-8 border-b border-gray-300">
      <div className="h-full w-full border-2 border-dashed border-gray-400 flex items-center justify-center">
        <span className="text-gray-500">Drop components here</span>
      </div>
    </main>
  );
}
