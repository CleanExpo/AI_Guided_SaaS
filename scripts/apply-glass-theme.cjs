#!/usr/bin/env node

/**
 * Apply Apple Glass theme to all components
 * Transforms existing styles to glassmorphic design
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🍎 AI Guided SaaS - Apple Glass Theme Applicator');
console.log('================================================\n');

// Find all component files
const componentFiles = glob.sync('src/**/*.{tsx,jsx}', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
});

console.log(`Found ${componentFiles.length} component files to transform\n`);

let filesModified = 0;
let componentsTransformed = 0;

// Glass class mappings
const classTransformations = {
  // Cards
  'card': 'glass-card',
  'bg-white': 'glass',
  'bg-gray-50': 'glass',
  'bg-gray-100': 'glass',
  'shadow': 'shadow-md',
  'shadow-sm': 'shadow-sm',
  'shadow-lg': 'shadow-lg',
  'rounded': 'rounded-lg',
  'rounded-md': 'rounded-lg',
  'rounded-lg': 'rounded-xl',
  
  // Buttons
  'btn': 'glass-button',
  'button': 'glass-button',
  'bg-blue-500': 'glass-button primary',
  'bg-blue-600': 'glass-button primary',
  'bg-primary': 'glass-button primary',
  'bg-indigo-600': 'glass-button primary',
  'hover:bg-blue-600': '',
  'hover:bg-blue-700': '',
  
  // Inputs
  'input': 'glass-input',
  'form-control': 'glass-input',
  'border': '',
  'border-gray-300': '',
  'focus:border-blue-500': '',
  'focus:ring-blue-500': '',
  
  // Navigation
  'navbar': 'glass-navbar',
  'nav': 'glass-navbar',
  'header': 'glass-navbar',
  'bg-gray-800': 'glass-navbar',
  'bg-gray-900': 'glass-navbar',
  
  // Sidebar
  'sidebar': 'glass-sidebar',
  'aside': 'glass-sidebar',
  'bg-gray-200': 'glass-sidebar',
  
  // Modal
  'modal': 'glass-modal',
  'dialog': 'glass-modal',
  'modal-backdrop': 'glass-modal-backdrop',
  'backdrop': 'glass-modal-backdrop'
};

// Style property transformations
const styleTransformations = {
  backgroundColor: (value) => {
    if (value.includes('white') || value.includes('#fff')) {
      return 'var(--glass-bg)';
    }
    if (value.includes('gray')) {
      return 'var(--glass-bg)';
    }
    return value;
  },
  boxShadow: (value) => {
    if (value.includes('sm')) return 'var(--shadow-sm)';
    if (value.includes('lg')) return 'var(--shadow-lg)';
    if (value.includes('xl')) return 'var(--shadow-xl)';
    return 'var(--shadow-md)';
  },
  borderRadius: (value) => {
    const num = parseInt(value);
    if (num <= 4) return 'var(--radius-sm)';
    if (num <= 8) return 'var(--radius-md)';
    if (num <= 16) return 'var(--radius-lg)';
    return 'var(--radius-xl)';
  },
  border: (value) => {
    if (value.includes('1px')) {
      return '1px solid var(--glass-border)';
    }
    return value;
  }
};

// Process each file
componentFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let fileModified = false;
  
  // Transform className attributes
  const classNameRegex = /className=["']([^"']+)["']/g;
  content = content.replace(classNameRegex, (match, classes) => {
    let newClasses = classes;
    let modified = false;
    
    // Apply transformations
    Object.entries(classTransformations).forEach(([oldClass, newClass]) => {
      if (classes.includes(oldClass)) {
        newClasses = newClasses.replace(new RegExp(`\\b${oldClass}\\b`, 'g'), newClass);
        modified = true;
      }
    });
    
    // Add glass effects to certain elements
    if (classes.includes('p-4') || classes.includes('p-6') || classes.includes('p-8')) {
      if (!newClasses.includes('glass')) {
        newClasses = `glass ${newClasses}`;
        modified = true;
      }
    }
    
    if (modified) {
      fileModified = true;
      componentsTransformed++;
    }
    
    return `className="${newClasses}"`;
  });
  
  // Transform inline styles
  const styleRegex = /style={{([^}]+)}}/g;
  content = content.replace(styleRegex, (match, styles) => {
    let modified = false;
    let transformedStyles = styles;
    
    Object.entries(styleTransformations).forEach(([prop, transformer]) => {
      const propRegex = new RegExp(`${prop}:\\s*["']([^"']+)["']`, 'g');
      transformedStyles = transformedStyles.replace(propRegex, (m, value) => {
        const newValue = transformer(value);
        if (newValue !== value) {
          modified = true;
        }
        return `${prop}: "${newValue}"`;
      });
    });
    
    // Add backdrop filter to elements with background
    if (styles.includes('backgroundColor') && !styles.includes('backdropFilter')) {
      transformedStyles += `, backdropFilter: "blur(var(--glass-blur))"`;
      modified = true;
    }
    
    if (modified) {
      fileModified = true;
    }
    
    return `style={{${transformedStyles}}}`;
  });
  
  // Add glass utility classes to specific components
  if (content.includes('Card') || content.includes('Panel')) {
    content = content.replace(/<(Card|Panel)([^>]*?)>/g, (match, comp, attrs) => {
      if (!attrs.includes('glass')) {
        fileModified = true;
        return `<${comp}${attrs} className="glass${attrs.includes('className') ? '' : '"'}`;
      }
      return match;
    });
  }
  
  if (fileModified) {
    fs.writeFileSync(filePath, content);
    filesModified++;
    console.log(`✓ ${path.relative(process.cwd(), filePath)}`);
  }
});

// Update global styles import
const layoutFiles = glob.sync('src/**/layout.{tsx,jsx}');
layoutFiles.forEach(layoutFile => {
  let content = fs.readFileSync(layoutFile, 'utf8');
  
  // Add glass theme import if not present
  if (!content.includes('glass-theme.css')) {
    const importRegex = /(import[^;]+;[\s\n]*)/;
    content = content.replace(importRegex, `$1import '@/styles/glass-theme.css';\n`);
    fs.writeFileSync(layoutFile, content);
    console.log(`✓ Added glass theme to ${path.relative(process.cwd(), layoutFile)}`);
  }
});

// Create component transformation guide
const transformationGuide = `
# Glass Theme Transformation Guide

## Applied Transformations

### Components Transformed: ${componentsTransformed}
### Files Modified: ${filesModified}

## Class Mappings Applied:
${Object.entries(classTransformations).map(([old, neu]) => `- ${old} → ${neu}`).join('\n')}

## Next Steps:

1. Review transformed components for visual consistency
2. Adjust blur intensity if needed: --glass-blur
3. Customize gradients in glass-theme.css
4. Add hover animations to interactive elements
5. Test in both light and dark modes

## Manual Adjustments Needed:

1. Complex components may need manual glass effect application
2. Check z-index stacking for overlapping glass elements
3. Ensure sufficient contrast for accessibility
4. Add loading states with glass-loading class
5. Apply gradient backgrounds to hero sections

## Glass Component Classes Available:

- .glass - Basic glass effect
- .glass-card - Card with glass effect
- .glass-button - Button with glass effect
- .glass-input - Input with glass effect
- .glass-navbar - Navigation with glass effect
- .glass-sidebar - Sidebar with glass effect
- .glass-modal - Modal with glass effect
- .glass-badge - Badge with glass effect
- .glass-tabs - Tabs with glass effect

## Utility Classes:

- .blur-light, .blur-medium, .blur-heavy
- .gradient-primary, .gradient-secondary, .gradient-mesh
- .shadow-sm, .shadow-md, .shadow-lg, .shadow-xl
- .hover-lift, .hover-glow
`;

fs.writeFileSync('glass-theme-guide.md', transformationGuide);

console.log('\n' + '='.repeat(50));
console.log('✨ Glass Theme Application Complete!');
console.log(`Files modified: ${filesModified}`);
console.log(`Components transformed: ${componentsTransformed}`);
console.log('\n📄 Transformation guide saved to: glass-theme-guide.md');

// Generate example showcase
const showcaseContent = `import React from 'react';

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
`;

fs.writeFileSync('src/components/GlassShowcase.tsx', showcaseContent);
console.log('✓ Created glass theme showcase component');