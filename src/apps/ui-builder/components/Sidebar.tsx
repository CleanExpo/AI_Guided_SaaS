// apps/ui-builder/components/Sidebar.tsx
import React from 'react';
import { componentList } from '../lib/componentList';
import { useBuilderStore } from '../store/useBuilderStore';

export default function Sidebar() {
  const addComponent = useBuilderStore((state) => state.addComponent);

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Components</h2>
      <ul>
        {componentList.map((comp) => (
          <li
            key={comp.id}
            onClick={() => addComponent(comp.id)}
            className="mb-3 p-2 rounded hover:bg-gray-700 cursor-pointer transition"
          >
            <div className="text-sm font-medium">{comp.name}</div>
            <div className="text-xs text-gray-300">{comp.description}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
