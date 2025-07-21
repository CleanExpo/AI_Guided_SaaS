// apps/ui-builder/components/ComponentPropsEditor.tsx
import React from 'react';
import { useBuilderStore } from '../store/useBuilderStore';

export default function ComponentPropsEditor() {
  const components = useBuilderStore((state) => state.components);
  const selectedId = useBuilderStore((state) => state.selectedId);
  const updateProps = useBuilderStore((state) => state.updateComponentProps);

  const selectedComponent = components.find((c) => c.id === selectedId);

  if (!selectedComponent) return null;

  const { type, props, schema } = selectedComponent;

  const handleChange = (key: string, value: string) => {
    updateProps(selectedComponent.id, { [key]: value });
  };

  return (
    <div className="p-4 bg-white border-t border-gray-300">
      <h2 className="text-lg font-semibold mb-2">Edit {type} Properties</h2>
      <form className="space-y-3">
        {schema?.map(({ key, label: type: inputType }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {inputType === 'textarea' ? (
              <textarea
                className="w-full px-3 py-1 border rounded text-sm"
                value={props[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                rows={3}
              />
            ) : (
              <input
                className="w-full px-3 py-1 border rounded text-sm"
                value={props[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            )}
          </div>
        ))}
      </form>
    </div>
  );
}
