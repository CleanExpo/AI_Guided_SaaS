// apps/ui-builder/components/DeploymentPanel.tsx
import React from 'react';
import { exportProjectAsZip } from '../utils/exportProject';
import { useBuilderStore } from '../store/useBuilderStore';

export default function DeploymentPanel() {
  const components = useBuilderStore(s => s.components);

  const deploy = () => {
    exportProjectAsZip(components);
    setTimeout(() => {
      window.open('https://vercel.com/new', '_blank');
    }, 1000);
  };

  return (
    <div className="p-4 border-t bg-white">
      <h2 className="text-lg font-semibold mb-2">🚀 Deploy Your Project</h2>
      <p className="text-sm text-gray-600 mb-3">
        Export your project and open Vercel to host it live.
      </p>
      <button
        onClick={deploy}
        className="px-4 py-2 bg-brand-primary-600 text-white rounded hover:bg-brand-primary-700"
      >
        Export & Deploy to Vercel
      </button>
    </div>
  );
}
