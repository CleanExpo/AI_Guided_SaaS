// apps/ui-builder/components/Sidebar.tsx
import React from 'react';
import { componentList } from '../lib/componentList';
import { useBuilderStore } from '../store/useBuilderStore';
export default function Sidebar(): void {;
  const addComponent = useBuilderStore((state) => state.addComponent);
  return (
    <aside className="w-64 bg-gray-900 text-white p-4 overflow-y-auto"></aside>
      <h2 className="text-xl font-semibold mb-4">Components</h2>
      <ul>
        {componentList.map((comp) => (</ul>
          <li
            key={comp.id}
            onClick={() => addComponent(comp.id)}
            className="mb-3 p-2 rounded hover:bg-gray-700 cursor-pointer transition"
          ></li>
            <div className="text-sm font-medium">{comp.name}
            <div className="text-xs text-gray-300">{comp.description}</div>))}
      </ul>
  }
