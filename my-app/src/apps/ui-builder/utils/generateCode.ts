import { ComponentConfig } from '../types';
import { getComponentByType } from '../lib/componentList';

export const generateCode = (components: ComponentConfig[]): string => {
  const imports = new Set<string>();
  imports.add("import React from 'react';");
  
  // Generate component JSX
  const componentJSX = components.map(component => generateComponentJSX(component, imports)).join('\n');
  
  // Generate the complete React component
  const code = `${Array.from(imports).join('\n')}

const GeneratedComponent: React.FC = () => {
  return (
    <div className="generated-component">
${componentJSX.split('\n').map(line => line ? `      ${line}` : '').join('\n')}
    </div>
  );
};

export default GeneratedComponent;`;

  return code;
};

const generateComponentJSX = (component: ComponentConfig, imports: Set<string>): string => {
  const motiaComponent = getComponentByType(component.type);
  
  if (!motiaComponent) {
    return `{/* Unknown component type: ${component.type} */}`;
  }

  const style = generateInlineStyle(component);
  const className = generateClassName(component);
  const props = generateProps(component);

  switch (component.type) {
    case 'Container':
      return generateContainer(component, props, style, className);
    case 'Grid':
      return generateGrid(component, props, style, className);
    case 'Flex':
      return generateFlex(component, props, style, className);
    case 'Button':
      return generateButton(component, props, style, className);
    case 'Input':
      return generateInput(component, props, style, className);
    case 'Card':
      return generateCard(component, props, style, className);
    case 'Heading':
      return generateHeading(component, props, style, className);
    case 'Text':
      return generateText(component, props, style, className);
    case 'Image':
      return generateImage(component, props, style, className);
    case 'Navbar':
      return generateNavbar(component, props, style, className);
    default:
      return `<div${className}${style}>{/* ${component.type} component */}</div>`;
  }
};

const generateInlineStyle = (component: ComponentConfig): string => {
  const styles: string[] = [];
  
  if (component.position) {
    styles.push(`left: ${component.position.x}px`);
    styles.push(`top: ${component.position.y}px`);
    styles.push('position: absolute');
  }
  
  if (component.size) {
    styles.push(`width: ${component.size.width}px`);
    styles.push(`height: ${component.size.height}px`);
  }
  
  if (component.style) {
    Object.entries(component.style).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      styles.push(`${cssKey}: ${value}`);
    });
  }
  
  return styles.length > 0 ? ` style={{${styles.map(s => {
    const [key, value] = s.split(': ');
    const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    return `${camelKey}: '${value.replace('px', '').replace(';', '')}'`;
  }).join(', ')}}}` : '';
};

const generateClassName = (component: ComponentConfig): string => {
  const classes: string[] = [];
  
  if (component.className) {
    classes.push(component.className);
  }
  
  return classes.length > 0 ? ` className="${classes.join(' ')}"` : '';
};

const generateProps = (component: ComponentConfig): Record<string, unknown> => {
  return { ...component.props };
};

// Component-specific generators
const generateContainer = (component: ComponentConfig, props: Record<string, unknown>, style: string, className: string): string => {
  const maxWidth = props.maxWidth || 'lg';
  const padding = props.padding || 'md';
  
  const paddingClass = {
    none: '',
    sm: 'px-2 py-1',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
    xl: 'px-8 py-4'
  }[padding as string] || 'px-4 py-2';
  
  const maxWidthClass = maxWidth === 'full' ? 'w-full' : `max-w-${maxWidth}`;
  
  return `<div className="container mx-auto ${maxWidthClass} ${paddingClass}${className}"${style}>
  {/* Container content */}
</div>`;
};

const generateGrid = (component: ComponentConfig, props: Record<string, unknown>, style: string, className: string): string => {
  const columns = props.columns || 3;
  const gap = props.gap || 4;
  
  return `<div className="grid grid-cols-${columns} gap-${gap}${className}"${style}>
  {/* Grid items */}
</div>`;
};

const generateFlex = (component: ComponentConfig, props: Record<string, unknown>, style: string, className: string): string => {
  const direction = props.direction || 'row';
  const justify = props.justify || 'start';
  const align = props.align || 'start';
  const gap = props.gap || 2;
  
  const directionClass = direction === 'row' ? '' : `flex-${direction}`;
  const justifyClass = justify === 'start' ? '' : `justify-${justify}`;
  const alignClass = align === 'start' ? '' : `items-${align}`;
  
  return `<div className="flex ${directionClass} ${justifyClass} ${alignClass} gap-${gap}${className}"${style}>
  {/* Flex items */}
</div>`;
};

const generateButton = (component: ComponentConfig, props: Record<string, unknown>, style: string, className: string): string => {
  const text = props.text || 'Click me';
  const variant = props.variant || 'primary';
  const size = props.size || 'md';
  const disabled = props.disabled || false;
  
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50',
    ghost: 'text-blue-500 hover:bg-blue-50',
    destructive: 'bg-red-500 hover:bg-red-600 text-white'
  }[variant as string] || 'bg-blue-500 hover:bg-blue-600 text-white';
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }[size as string] || 'px-4 py-2';
  
  const disabledClass = disabled ? ' opacity-50 cursor-not-allowed' : '';
  
  return `<button className="${variantClasses} ${sizeClasses} rounded font-medium transition-colors${disabledClass}${className}"${disabled ? ' disabled' : ''}${style}>
  ${text}
</button>`;
};

const generateInput = (component: ComponentConfig, props: Record<string, unknown>, style: string, className: string): string => {
  const placeholder = props.placeholder || 'Enter text...';
  const type = props.type || 'text';
  const label = props.label || '';
  const required = props.required || false;
  
  const labelElement = label ? `<label className="block text-sm font-medium text-gray-700 mb-1">${label}${required ? ' *' : ''}</label>` : '';
  
  return `${labelElement ? `${labelElement}\n` : ''}<input
  type="${type}"
  placeholder="${placeholder}"
  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent${className}"${required ? ' required' : ''}${style}
/>`;
};

const generateCard = (component: ComponentConfig, props: Record<string, unknown>, style: string, className: string): string => {
  const title = props.title || 'Card Title';
  const content = props.content || 'Card content goes here...';
  const showHeader = props.showHeader !== false;
  const showFooter = props.showFooter === true;
  
  const header = showHeader ? `  <div className="card-header border-b border-gray-200 pb-3 mb-4">
    <h3 className="text-lg font-semibold text-gray-900">${title}</h3>
  </div>` : '';
  
  const footer = showFooter ? `  <div className="card-footer border-t border-gray-200 pt-3 mt-4">
    <div className="flex justify-end space-x-2">
      <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
      <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
    </div>
  </div>` : '';
  
  return `<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6${className}"${style}>
${header}  <div className="card-content">
    <p className="text-gray-600">${content}</p>
  </div>
${footer}</div>`;
};

const generateHeading = (component: ComponentConfig, props: Record<string, unknown>, style: string, className: string): string => {
  const text = props.text || 'Heading Text';
  const level = props.level || '1';
  const color = props.color || 'default';
  
  const colorClasses = {
    default: 'text-gray-900',
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    muted: 'text-gray-500'
  }[color as string] || 'text-gray-900';
  
  const sizeClasses = {
    '1': 'text-4xl font-bold',
    '2': 'text-3xl font-bold',
    '3': 'text-2xl font-semibold',
    '4': 'text-xl font-semibold',
    '5': 'text-lg font-medium',
    '6': 'text-base font-medium'
  }[level as string] || 'text-4xl font-bold';
  
  return `<h${level} className="${sizeClasses} ${colorClasses}${className}"${style}>${text}</h${level}>`;
};

const generateText = (component: ComponentConfig, props: Record<string, unknown>, style: string, className: string): string => {
  const text = props.text || 'This is a text paragraph.';
  const size = props.size || 'base';
  const weight = props.weight || 'normal';
  const color = props.color || 'default';
  
  const sizeClass = `text-${size}`;
  const weightClass = weight === 'normal' ? '' : `font-${weight}`;
  
  const colorClasses = {
    default: 'text-gray-700',
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    muted: 'text-gray-500',
    destructive: 'text-red-600'
  }[color as string] || 'text-gray-700';
  
  return `<p className="${sizeClass} ${weightClass} ${colorClasses}${className}"${style}>${text}</p>`;
};

const generateImage = (component: ComponentConfig, props: Record<string, unknown>, style: string, className: string): string => {
  const src = props.src || 'https://via.placeholder.com/300x200';
  const alt = props.alt || 'Placeholder image';
  const width = props.width || 300;
  const height = props.height || 200;
  const rounded = props.rounded || 'md';
  
  const roundedClass = rounded === 'none' ? '' : `rounded-${rounded}`;
  
  return `<img
  src="${src}"
  alt="${alt}"
  width={${width}}
  height={${height}}
  className="${roundedClass}${className}"${style}
/>`;
};

const generateNavbar = (component: ComponentConfig, props: Record<string, unknown>, style: string, className: string): string => {
  const brand = props.brand || 'Brand';
  const links = (props.links as string[]) || ['Home', 'About', 'Contact'];
  const position = props.position || 'top';
  
  const positionClass = {
    top: '',
    'fixed-top': 'fixed top-0 left-0 right-0 z-50',
    'sticky-top': 'sticky top-0 z-50'
  }[position as string] || '';
  
  const linkElements = links.map(link => 
    `<a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">${link}</a>`
  ).join('\n        ');
  
  return `<nav className="bg-white border-b border-gray-200 ${positionClass}${className}"${style}>
  <div className="container mx-auto px-4 py-3">
    <div className="flex items-center justify-between">
      <div className="font-bold text-xl text-gray-900">${brand}</div>
      <div className="hidden md:flex space-x-6">
        ${linkElements}
      </div>
      <div className="md:hidden">
        <button className="text-gray-600 hover:text-gray-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</nav>`;
};
