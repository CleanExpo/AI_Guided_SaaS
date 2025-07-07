// apps/ui-builder/store/useBuilderStore.ts

import { create } from 'zustand';

type ComponentInstance = {
  id: string;
  type: string;
};

type BuilderStore = {
  components: ComponentInstance[];
  addComponent: (type: string) => void;
  reset: () => void;
};

export const useBuilderStore = create<BuilderStore>((set) => ({
  components: [],
  addComponent: (type) =>
    set((state) => ({
      components: [
        ...state.components,
        {
          id: `${type}-${Date.now()}`,
          type,
        },
      ],
    })),
  reset: () => set({ components: [] }),
}));
