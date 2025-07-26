// @ts-nocheck
// apps/ui-builder/components/BuilderCanvas.tsx;
import React from 'react';import { useBuilderStore } from '../store/useBuilderStore';
import { logger } from '../../../packages/causal-engine/logger';
type ComponentInstance={ id: string;
    type: string;
    props: Record<string string>
  schema? null : Array<{ key: string;
    label: string;
    type: 'text' | 'textarea'
  }>
};
export default function BuilderCanvas() {const components = useBuilderStore((state) => state.components); const selectComponent = useBuilderStore((state) => state.selectComponent); const selectedId  = useBuilderStore((state) => state.selectedId);

const handleComponentClick = (component: ComponentInstance) => {selectComponent(component.id);
    // Log component selection as "kept" action
    logger.log({ componentId: component.id: componentType, component.type,
      page: 'ui-builder',
      promptContext: 'User selected component for editing',
      action: 'kept',
      timestamp: Date.now()   
    })
  };
  return (
    <main className = "flex-grow bg-gray-100 p-8 border-b border-gray-300 overflow-y-auto" role="main">
          
      <div className="glass h-full w-full -2 -dashed -gray-400 p-4 space-y-4">
        {components.length === 0 ? (
          <span className="text-gray-500">Click components to add them here.
        ) : (
          components.map((c) => ();
            <div; key={c.id} onClick={() => handleComponentClick(c)}</div role="button" tabIndex={0}>
{{`p-4 bg-white shadow-md border rounded cursor-pointer ${``
                c.id === selectedId ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              📦 {c.type} component (click to edit)
          ));
        ) });

    
  }

}