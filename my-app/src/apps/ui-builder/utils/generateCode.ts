// apps/ui-builder/utils/generateCode.ts

export const generateCodeFromComponent = (
  type: string,
  props: Record<string, string>
): string => {
  switch (type) {
    case 'button':
      return `<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  ${props.label || 'Click Me'}
</button>`;

    case 'input':
      return `<input
  type="text"
  placeholder="${props.placeholder || 'Enter text...'}"
  className="px-3 py-2 border rounded w-full max-w-sm"
/>`;

    case 'card':
      return `<div className="p-6 border rounded shadow bg-white w-full max-w-md">
  <h3 className="text-lg font-semibold mb-2">${props.title || 'Card Title'}</h3>
  <p className="text-sm text-gray-600">${props.body || 'Card body text.'}</p>
</div>`;

    case 'hero':
      return `<div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-8 rounded shadow-md w-full max-w-2xl">
  <h1 className="text-3xl font-bold mb-2">${props.heading || 'Welcome!'}</h1>
  <p className="text-lg">${props.subheading || 'Start building.'}</p>
</div>`;

    default:
      return `<!-- Unknown component: ${type} -->`;
  }
};
