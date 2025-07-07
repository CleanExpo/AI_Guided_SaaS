// apps/ui-builder/store/useBuilderStore.ts

import { create } from 'zustand';

type ComponentProps = {
  [key: string]: string;
};

type ComponentInstance = {
  id: string;
  type: string;
  props: ComponentProps;
};

type BuilderStore = {
  components: ComponentInstance[];
  selectedId: string | null;
  addComponent: (type: string) => void;
  selectComponent: (id: string) => void;
  updateComponentProps: (id: string, newProps: ComponentProps) => void;
  saveProject: () => void;
  loadProject: () => void;
  reset: () => void;
};

function getDefaultProps(type: string): ComponentProps {
  switch (type) {
    case 'button':
      return { label: 'Click Me' };
    case 'input':
      return { placeholder: 'Enter text...' };
    case 'card':
      return { title: 'Card Title', body: 'Card body text.' };
    case 'hero':
      return { heading: 'Welcome!', subheading: 'Start building.' };
    default:
      return {};
  }
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  components: [],
  selectedId: null,
  addComponent: (type) =>
    set((state) => ({
      components: [
        ...state.components,
        {
          id: `${type}-${Date.now()}`,
          type,
          props: getDefaultProps(type),
        },
      ],
    })),
  selectComponent: (id) => set({ selectedId: id }),
  updateComponentProps: (id, newProps) =>
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, props: { ...c.props, ...newProps } } : c
      ),
    })),
  saveProject: () => {
    const { components } = get();
    localStorage.setItem('ai_builder_project', JSON.stringify(components));
    alert('Project saved successfully!');
  },
  loadProject: () => {
    const saved = localStorage.getItem('ai_builder_project');
    if (saved) {
      const parsed = JSON.parse(saved);
      set({ components: parsed, selectedId: null });
      alert('Project loaded successfully!');
    } else {
      alert('No saved project found!');
    }
  },
  reset: () => set({ components: [], selectedId: null }),
}));
