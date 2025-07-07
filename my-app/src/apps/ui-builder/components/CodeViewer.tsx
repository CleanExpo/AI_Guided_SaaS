// apps/ui-builder/components/CodeViewer.tsx
import React from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { generateCodeFromComponent } from '../utils/generateCode';

export default function CodeViewer() {
  const components = useBuilderStore((state) => state.components);

  const code = components
    .map((c) => generateCodeFromComponent(c.type, c.props))
    .join('\n\n');

  return (
    <section className="bg-black text-green-300 font-mono p-4 overflow-auto max-h-64">
      <h2 className="text-white mb-2 text-lg font-semibold">Generated Code</h2>
      <pre className="text-sm whitespace-pre-wrap">{code || '// Add components to generate code'}</pre>
    </section>
  );
}
