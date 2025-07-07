// apps/ui-builder/components/PreviewPane.tsx
import React from 'react';

export default function PreviewPane() {
  return (
    <footer className="bg-white p-4 shadow-inner">
      <h2 className="text-lg font-medium">Live Preview</h2>
      <div className="mt-2 text-gray-500">Component output will be shown here.</div>
    </footer>
  );
}
