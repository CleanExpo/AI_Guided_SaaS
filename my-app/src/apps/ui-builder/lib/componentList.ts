// apps/ui-builder/lib/componentList.ts

export type ComponentType = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
};

export const componentList: ComponentType[] = [
  {
    id: 'button',
    name: 'Button',
    description: 'A simple CTA button',
  },
  {
    id: 'card',
    name: 'Card',
    description: 'A container with padding and shadow',
  },
  {
    id: 'input',
    name: 'Input',
    description: 'A basic text input field',
  },
  {
    id: 'hero',
    name: 'Hero Section',
    description: 'A large header with optional call to action',
  },
];
