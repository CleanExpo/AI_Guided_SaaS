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
  reset: () => void;
};

export const useBuilderStore = create<BuilderStore>((set) => ({
  components: [],
  selectedId: null,
  addComponent: (type) =>
    set((state) => ({
      components: [
        ...state.components,
        {
          id: `${type}-${Date.now()}`,
          type,
          props: {
            ...(type === 'button' && { label: 'Click Me' }),
            ...(type === 'input' && { placeholder: 'Enter text...' }),
            ...(type === 'card' && { title: 'Card Title', body: 'Card body text.' }),
            ...(type === 'hero' && { heading: 'Welcome!', subheading: 'Start building.' }),
          },
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
  reset: () => set({ components: [], selectedId: null }),
}));
