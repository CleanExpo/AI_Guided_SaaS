// apps/ui-builder/components/CodeViewer.tsx
import React from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { generateCodeFromComponent } from '../utils/generateCode';

export default function CodeViewer() {
  const components = useBuilderStore((state) => state.components);

  const code = components
    .map((c) => generateCodeFromComponent(c.type, c.props))
    .join('\n\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = 'exported-ui-builder-code.jsx';
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-black text-green-300 font-mono p-4 overflow-auto max-h-64">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-white text-lg font-semibold">Generated Code</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Copy
          </button>
          <button
            onClick={handleDownload}
            className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            Download
          </button>
        </div>
      </div>
      <pre className="text-sm whitespace-pre-wrap">{code || '// Add components to generate code'}</pre>
    </section>
  );
}
