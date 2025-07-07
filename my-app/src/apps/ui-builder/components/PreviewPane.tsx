'use client';

import React from 'react';
import { ComponentConfig } from '../types';
import { getComponentByType } from '../lib/componentList';

interface PreviewPaneProps {
  components: ComponentConfig[];
  className?: string;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ components, className = '' }) => {
  const renderComponent = (component: ComponentConfig) => {
    const motiaComponent = getComponentByType(component.type);
    if (!motiaComponent) {
      return (
        <div key={component.id} className="bg-red-100 border border-red-300 rounded p-4 text-red-600">
          Unknown component: {component.type}
        </div>
      );
    }

    // Render components in a responsive layout for preview
    switch (component.type) {
      case 'Container':
        const maxWidth = component.props.maxWidth || 'lg';
        const padding = component.props.padding || 'md';
        
        const paddingClass = {
          none: '',
          sm: 'px-2 py-1',
          md: 'px-4 py-2',
          lg: 'px-6 py-3',
          xl: 'px-8 py-4'
        }[padding as string] || 'px-4 py-2';
        
        const maxWidthClass = maxWidth === 'full' ? 'w-full' : `max-w-${maxWidth}`;
        
        return (
          <div key={component.id} className={`container mx-auto ${maxWidthClass} ${paddingClass} bg-gray-50 border border-gray-200 rounded`}>
            Container Component
          </div>
        );

      case 'Grid':
        const columns = component.props.columns || 3;
        const gap = component.props.gap || 4;
        
        return (
          <div key={component.id} className={`grid grid-cols-${columns} gap-${gap}`}>
            {Array.from({ length: columns }, (_, i) => (
              <div key={i} className="bg-blue-100 p-4 rounded text-center">
                Grid Item {i + 1}
              </div>
            ))}
          </div>
        );

      case 'Flex':
        const direction = component.props.direction || 'row';
        const justify = component.props.justify || 'start';
        const align = component.props.align || 'start';
        const flexGap = component.props.gap || 2;
        
        const directionClass = direction === 'row' ? '' : `flex-${direction}`;
        const justifyClass = justify === 'start' ? '' : `justify-${justify}`;
        const alignClass = align === 'start' ? '' : `items-${align}`;
        
        return (
          <div key={component.id} className={`flex ${directionClass} ${justifyClass} ${alignClass} gap-${flexGap}`}>
            <div className="bg-green-100 p-3 rounded">Flex Item 1</div>
            <div className="bg-green-100 p-3 rounded">Flex Item 2</div>
            <div className="bg-green-100 p-3 rounded">Flex Item 3</div>
          </div>
        );

      case 'Button':
        const variant = component.props.variant || 'primary';
        const size = component.props.size || 'md';
        const disabled = component.props.disabled || false;
        
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
        
        return (
          <button
            key={component.id}
            className={`${variantClasses} ${sizeClasses} rounded font-medium transition-colors ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={disabled}
          >
            {component.props.text || 'Button'}
          </button>
        );

      case 'Input':
        const inputType = component.props.type || 'text';
        const placeholder = component.props.placeholder || 'Enter text...';
        const label = component.props.label || '';
        const required = component.props.required || false;
        
        return (
          <div key={component.id} className="w-full max-w-md">
            {label && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}{required ? ' *' : ''}
              </label>
            )}
            <input
              type={inputType}
              placeholder={placeholder}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={required}
            />
          </div>
        );

      case 'Card':
        const title = component.props.title || 'Card Title';
        const content = component.props.content || 'Card content goes here...';
        const showHeader = component.props.showHeader !== false;
        const showFooter = component.props.showFooter === true;
        
        return (
          <div key={component.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-md">
            {showHeader && (
              <div className="border-b border-gray-200 pb-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              </div>
            )}
            <div className="text-gray-600 mb-4">
              {content}
            </div>
            {showFooter && (
              <div className="border-t border-gray-200 pt-3 flex justify-end space-x-2">
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
                  Cancel
                </button>
                <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                  Save
                </button>
              </div>
            )}
          </div>
        );

      case 'Heading':
        const text = component.props.text || 'Heading Text';
        const level = component.props.level || '1';
        const color = component.props.color || 'default';
        
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
        
        const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
        
        return (
          <HeadingTag key={component.id} className={`${sizeClasses} ${colorClasses} mb-4`}>
            {text}
          </HeadingTag>
        );

      case 'Text':
        const textContent = component.props.text || 'This is a text paragraph.';
        const textSize = component.props.size || 'base';
        const weight = component.props.weight || 'normal';
        const textColor = component.props.color || 'default';
        
        const textSizeClass = `text-${textSize}`;
        const weightClass = weight === 'normal' ? '' : `font-${weight}`;
        
        const textColorClasses = {
          default: 'text-gray-700',
          primary: 'text-blue-600',
          secondary: 'text-gray-600',
          muted: 'text-gray-500',
          destructive: 'text-red-600'
        }[textColor as string] || 'text-gray-700';
        
        return (
          <p key={component.id} className={`${textSizeClass} ${weightClass} ${textColorClasses} mb-4`}>
            {textContent}
          </p>
        );

      case 'Image':
        const src = component.props.src || 'https://via.placeholder.com/300x200';
        const alt = component.props.alt || 'Placeholder image';
        const width = component.props.width || 300;
        const height = component.props.height || 200;
        const rounded = component.props.rounded || 'md';
        
        const roundedClass = rounded === 'none' ? '' : `rounded-${rounded}`;
        
        return (
          <img
            key={component.id}
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`${roundedClass} mb-4`}
          />
        );

      case 'Navbar':
        const brand = component.props.brand || 'Brand';
        const links = (component.props.links as string[]) || ['Home', 'About', 'Contact'];
        const position = component.props.position || 'top';
        
        const positionClass = {
          top: '',
          'fixed-top': 'fixed top-0 left-0 right-0 z-50',
          'sticky-top': 'sticky top-0 z-50'
        }[position as string] || '';
        
        return (
          <nav key={component.id} className={`bg-white border-b border-gray-200 ${positionClass} mb-4`}>
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xl text-gray-900">{brand}</div>
                <div className="hidden md:flex space-x-6">
                  {links.map((link, index) => (
                    <a key={index} href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                      {link}
                    </a>
                  ))}
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
          </nav>
        );

      default:
        return (
          <div key={component.id} className="bg-gray-100 border border-gray-300 rounded p-4 text-gray-600 mb-4">
            {component.type} Component
          </div>
        );
    }
  };

  return (
    <div className={`bg-white overflow-auto ${className}`}>
      <div className="p-6">
        {components.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👁️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Preview Mode</h3>
            <p className="text-gray-500">
              Add components to see how they look in a real layout
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Component Preview</h2>
              <p className="text-gray-600 mt-1">
                This is how your components will look in a real application
              </p>
            </div>
            
            <div className="space-y-6">
              {components.map(renderComponent)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPane;
