import { MotiaComponent } from '../types';

export const motiaComponents: MotiaComponent[] = [
  // Layout Components
  {
    type: 'Container',
    name: 'Container',
    category: 'Layout',
    description: 'A flexible container component for layout',
    icon: '📦',
    defaultProps: {
      className: 'container mx-auto px-4',
      maxWidth: 'lg'
    },
    propTypes: {
      maxWidth: {
        type: 'select',
        options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
        default: 'lg',
        description: 'Maximum width of the container'
      },
      padding: {
        type: 'select',
        options: ['none', 'sm', 'md', 'lg', 'xl'],
        default: 'md',
        description: 'Padding around the container'
      }
    },
    preview: '<div className="container mx-auto px-4 py-8 bg-gray-100 rounded">Container</div>'
  },
  {
    type: 'Grid',
    name: 'Grid',
    category: 'Layout',
    description: 'CSS Grid layout component',
    icon: '⚏',
    defaultProps: {
      columns: 3,
      gap: 4,
      className: 'grid'
    },
    propTypes: {
      columns: {
        type: 'number',
        default: 3,
        description: 'Number of grid columns'
      },
      gap: {
        type: 'number',
        default: 4,
        description: 'Gap between grid items'
      }
    },
    preview: '<div className="grid grid-cols-3 gap-4"><div className="bg-blue-100 p-4 rounded">1</div><div className="bg-blue-100 p-4 rounded">2</div><div className="bg-blue-100 p-4 rounded">3</div></div>'
  },
  {
    type: 'Flex',
    name: 'Flex',
    category: 'Layout',
    description: 'Flexbox layout component',
    icon: '↔️',
    defaultProps: {
      direction: 'row',
      justify: 'start',
      align: 'start',
      gap: 2,
      className: 'flex'
    },
    propTypes: {
      direction: {
        type: 'select',
        options: ['row', 'column', 'row-reverse', 'column-reverse'],
        default: 'row',
        description: 'Flex direction'
      },
      justify: {
        type: 'select',
        options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
        default: 'start',
        description: 'Justify content'
      },
      align: {
        type: 'select',
        options: ['start', 'center', 'end', 'stretch', 'baseline'],
        default: 'start',
        description: 'Align items'
      }
    },
    preview: '<div className="flex gap-2"><div className="bg-green-100 p-2 rounded">Item 1</div><div className="bg-green-100 p-2 rounded">Item 2</div></div>'
  },

  // UI Components
  {
    type: 'Button',
    name: 'Button',
    category: 'UI',
    description: 'Interactive button component',
    icon: '🔘',
    defaultProps: {
      text: 'Click me',
      variant: 'primary',
      size: 'md',
      disabled: false
    },
    propTypes: {
      text: {
        type: 'string',
        default: 'Click me',
        description: 'Button text'
      },
      variant: {
        type: 'select',
        options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
        default: 'primary',
        description: 'Button style variant'
      },
      size: {
        type: 'select',
        options: ['sm', 'md', 'lg'],
        default: 'md',
        description: 'Button size'
      },
      disabled: {
        type: 'boolean',
        default: false,
        description: 'Disable the button'
      }
    },
    preview: '<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Click me</button>'
  },
  {
    type: 'Input',
    name: 'Input',
    category: 'UI',
    description: 'Text input field',
    icon: '📝',
    defaultProps: {
      placeholder: 'Enter text...',
      type: 'text',
      label: '',
      required: false
    },
    propTypes: {
      placeholder: {
        type: 'string',
        default: 'Enter text...',
        description: 'Placeholder text'
      },
      type: {
        type: 'select',
        options: ['text', 'email', 'password', 'number', 'tel', 'url'],
        default: 'text',
        description: 'Input type'
      },
      label: {
        type: 'string',
        default: '',
        description: 'Input label'
      },
      required: {
        type: 'boolean',
        default: false,
        description: 'Required field'
      }
    },
    preview: '<input className="border border-gray-300 rounded px-3 py-2 w-full" placeholder="Enter text..." />'
  },
  {
    type: 'Card',
    name: 'Card',
    category: 'UI',
    description: 'Card container component',
    icon: '🃏',
    defaultProps: {
      title: 'Card Title',
      content: 'Card content goes here...',
      showHeader: true,
      showFooter: false
    },
    propTypes: {
      title: {
        type: 'string',
        default: 'Card Title',
        description: 'Card title'
      },
      content: {
        type: 'string',
        default: 'Card content goes here...',
        description: 'Card content'
      },
      showHeader: {
        type: 'boolean',
        default: true,
        description: 'Show card header'
      },
      showFooter: {
        type: 'boolean',
        default: false,
        description: 'Show card footer'
      }
    },
    preview: '<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"><h3 className="text-lg font-semibold mb-2">Card Title</h3><p className="text-gray-600">Card content goes here...</p></div>'
  },

  // Typography
  {
    type: 'Heading',
    name: 'Heading',
    category: 'Typography',
    description: 'Heading text component',
    icon: 'H',
    defaultProps: {
      text: 'Heading Text',
      level: 1,
      color: 'default'
    },
    propTypes: {
      text: {
        type: 'string',
        default: 'Heading Text',
        description: 'Heading text'
      },
      level: {
        type: 'select',
        options: ['1', '2', '3', '4', '5', '6'],
        default: '1',
        description: 'Heading level (h1-h6)'
      },
      color: {
        type: 'select',
        options: ['default', 'primary', 'secondary', 'muted'],
        default: 'default',
        description: 'Text color'
      }
    },
    preview: '<h1 className="text-3xl font-bold text-gray-900">Heading Text</h1>'
  },
  {
    type: 'Text',
    name: 'Text',
    category: 'Typography',
    description: 'Text paragraph component',
    icon: 'T',
    defaultProps: {
      text: 'This is a text paragraph.',
      size: 'base',
      weight: 'normal',
      color: 'default'
    },
    propTypes: {
      text: {
        type: 'string',
        default: 'This is a text paragraph.',
        description: 'Text content'
      },
      size: {
        type: 'select',
        options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl'],
        default: 'base',
        description: 'Text size'
      },
      weight: {
        type: 'select',
        options: ['light', 'normal', 'medium', 'semibold', 'bold'],
        default: 'normal',
        description: 'Font weight'
      },
      color: {
        type: 'select',
        options: ['default', 'primary', 'secondary', 'muted', 'destructive'],
        default: 'default',
        description: 'Text color'
      }
    },
    preview: '<p className="text-base text-gray-700">This is a text paragraph.</p>'
  },

  // Media
  {
    type: 'Image',
    name: 'Image',
    category: 'Media',
    description: 'Image component',
    icon: '🖼️',
    defaultProps: {
      src: 'https://via.placeholder.com/300x200',
      alt: 'Placeholder image',
      width: 300,
      height: 200,
      rounded: 'md'
    },
    propTypes: {
      src: {
        type: 'string',
        default: 'https://via.placeholder.com/300x200',
        description: 'Image source URL'
      },
      alt: {
        type: 'string',
        default: 'Placeholder image',
        description: 'Alt text for accessibility'
      },
      width: {
        type: 'number',
        default: 300,
        description: 'Image width'
      },
      height: {
        type: 'number',
        default: 200,
        description: 'Image height'
      },
      rounded: {
        type: 'select',
        options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
        default: 'md',
        description: 'Border radius'
      }
    },
    preview: '<img src="https://via.placeholder.com/300x200" alt="Placeholder" className="rounded-md" />'
  },

  // Navigation
  {
    type: 'Navbar',
    name: 'Navbar',
    category: 'Navigation',
    description: 'Navigation bar component',
    icon: '🧭',
    defaultProps: {
      brand: 'Brand',
      links: ['Home', 'About', 'Contact'],
      position: 'top'
    },
    propTypes: {
      brand: {
        type: 'string',
        default: 'Brand',
        description: 'Brand name'
      },
      links: {
        type: 'array',
        default: ['Home', 'About', 'Contact'],
        description: 'Navigation links'
      },
      position: {
        type: 'select',
        options: ['top', 'fixed-top', 'sticky-top'],
        default: 'top',
        description: 'Navbar position'
      }
    },
    preview: '<nav className="bg-white border-b border-gray-200 px-4 py-3"><div className="flex items-center justify-between"><span className="font-bold">Brand</span><div className="space-x-4"><a href="#" className="text-gray-600 hover:text-gray-900">Home</a><a href="#" className="text-gray-600 hover:text-gray-900">About</a></div></div></nav>'
  }
];

export const getComponentsByCategory = () => {
  const categories: Record<string, MotiaComponent[]> = {};
  
  motiaComponents.forEach(component => {
    if (!categories[component.category]) {
      categories[component.category] = [];
    }
    categories[component.category].push(component);
  });
  
  return categories;
};

export const getComponentByType = (type: string): MotiaComponent | undefined => {
  return motiaComponents.find(component => component.type === type);
};
