// apps/ui-builder/components/ComponentRenderer.tsx
import React from 'react';

type Props = {
  type: string;
  props?: { [key: string]: string };
};

export default function ComponentRenderer({ type, props = {} }: Props) {
  switch (type) {
    case 'button':
      return (
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {props.label || 'Click Me'}
        </button>
      );

    case 'card':
      return (
        <div className="p-6 border rounded shadow bg-white w-full max-w-md">
          <h3 className="text-lg font-semibold mb-2">{props.title || 'Card Title'}</h3>
          <p className="text-sm text-gray-600">{props.body || 'This is a sample card component.'}</p>
        </div>
      );

    case 'input':
      return (
        <input
          type="text"
          placeholder={props.placeholder || 'Enter text...'}
          className="px-3 py-2 border rounded w-full max-w-sm"
        />
      );

    case 'hero':
      return (
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-8 rounded shadow-md w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">{props.heading || 'Welcome to Your SaaS!'}</h1>
          <p className="text-lg">{props.subheading || 'Start building something amazing without code.'}</p>
        </div>
      );

    case 'two-col':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="p-4 border rounded bg-gray-50">
            {props.left || 'Left side content'}
          </div>
          <div className="p-4 border rounded bg-gray-50">
            {props.right || 'Right side content'}
          </div>
        </div>
      );

    default:
      return (
        <div className="text-red-500 font-mono">Unknown component: {type}</div>
      );
  }
}
