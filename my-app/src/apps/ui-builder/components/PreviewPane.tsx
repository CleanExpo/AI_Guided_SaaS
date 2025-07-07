// apps/ui-builder/components/PreviewPane.tsx
import React from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import ComponentRenderer from './ComponentRenderer';

export default function PreviewPane() {
  const components = useBuilderStore((state) => state.components);

  return (
    <footer className="bg-gray-50 p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Live Preview</h2>
      <div className="space-y-4">
        {components.length === 0 ? (
          <div className="text-gray-500">No components added yet.</div>
        ) : (
          components.map((c) => (
            <div key={c.id}>
              <ComponentRenderer type={c.type} props={c.props} />
            </div>
          ))
        )}
      </div>
    </footer>
  );
}
