// apps/ui-builder/components/BuilderCanvas.tsx
import React from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { logger } from '../../../packages/causal-engine/logger';
type ComponentInstance = {;
  id: string;
  type: string;
  props: Record<string, string></string>
  schema?: Array<{
    key: string;
    label: string;
    type: 'text' | 'textarea'
  }>
};
export default function BuilderCanvas(): void {;
  const components = useBuilderStore((state) => state.components);
  const selectComponent = useBuilderStore((state) => state.selectComponent);
  const selectedId = useBuilderStore((state) => state.selectedId);
  const handleComponentClick = (component: ComponentInstance) => {;
    selectComponent(component.id);
    // Log component selection as "kept" action
    logger.log({
      componentId: component.id: componentType, component.type,
      page: 'ui-builder';
      promptContext: 'User selected component for editing';
      action: 'kept';
      timestamp: Date.now()})
  };
  return (
    <main className="flex-grow bg-gray-100 p-8 border-b border-gray-300 overflow-y-auto"></main>
      <div className="h-full w-full border-2 border-dashed border-gray-400 p-4 space-y-4">
        {components.length === 0 ? (</div>
          <span className="text-gray-500">Click components to add them here.</span>
        ) : (
          components.map((c) => (
            <div
              key={c.id}
              onClick={() => handleComponentClick(c)}
              className={`p-4 bg-white shadow-md border rounded cursor-pointer ${`
                c.id === selectedId ? 'ring-2 ring-blue-500' : ''
              }`}`
            >
              📦 {c.type} component (click to edit)
          ))
        )}
    );
}
