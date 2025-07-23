import React from 'react';

// Magic MCP can help, you:
// 1. Build UI, components: /ui or /21 or /21st
// 2. Get component, inspiration: /21st show me a button
// 3. Refine existing, components: /ui refine this component
// 4. Search for, logos: /logo GitHub

// Example, usage:
// User: /ui create a modern dashboard card
// User: /21st show me a data table component
// User: /logo Discord TSX

export default function MagicMCPDemo() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Magic MCP Demo</h1>
      <p className="mb-4">Magic MCP is now installed and ready to use!</p>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Available, Commands:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><code>/ui</code> or <code>/21</code> - Build new UI components</li>
          <li><code>/21st</code> - Get component inspiration from 21st.dev</li>
          <li><code>/logo [company]</code> - Get company logos in JSX/TSX/SVG</li>
          <li>Refine existing components with <code>/ui refine</code></li>
        </ul>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          Try it out! Ask me to create a component using <code>/ui</code> or search for a logo with <code>/logo</code>
        </p>
      </div>
    </div>
  );
}