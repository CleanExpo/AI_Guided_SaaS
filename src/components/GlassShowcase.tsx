import React from 'react';

export const GlassShowcase = () => {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Apple Glass Theme Showcase</h1>
      
      {/* Card Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Glass Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-2">Basic Glass Card</h3>
            <p className="text-gray-600">Beautiful glassmorphic effect with blur and transparency.</p>
          </div>
          <div className="glass-card p-6 hover-lift">
            <h3 className="text-lg font-semibold mb-2">Hover Effect Card</h3>
            <p className="text-gray-600">Lifts up on hover with enhanced shadow.</p>
          </div>
          <div className="glass-card p-6 gradient-mesh">
            <h3 className="text-lg font-semibold mb-2">Gradient Mesh Card</h3>
            <p className="text-gray-600">Combines glass effect with gradient mesh background.</p>
          </div>
        </div>
      </section>
      
      {/* Button Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Glass Buttons</h2>
        <div className="flex gap-4 flex-wrap">
          <button className="glass-button">Default Button</button>
          <button className="glass-button primary">Primary Button</button>
          <button className="glass-button gradient-secondary text-white">Gradient Button</button>
          <button className="glass-button hover-glow">Glow on Hover</button>
        </div>
      </section>
      
      {/* Input Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Glass Inputs</h2>
        <div className="max-w-md space-y-4">
          <input type="text" className="glass-input" placeholder="Enter your name" />
          <input type="email" className="glass-input" placeholder="Enter your email" />
          <textarea className="glass-input" rows="4" placeholder="Enter your message"></textarea>
        </div>
      </section>
      
      {/* Tab Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Glass Tabs</h2>
        <div className="glass-tabs max-w-md">
          <button className="glass-tab active">Tab 1</button>
          <button className="glass-tab">Tab 2</button>
          <button className="glass-tab">Tab 3</button>
        </div>
      </section>
      
      {/* Badge Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Glass Badges</h2>
        <div className="flex gap-2 flex-wrap">
          <span className="glass-badge">New</span>
          <span className="glass-badge gradient-primary text-white">Featured</span>
          <span className="glass-badge gradient-success text-white">Active</span>
          <span className="glass-badge gradient-warning text-white">Pending</span>
        </div>
      </section>
    </div>
  );
};
