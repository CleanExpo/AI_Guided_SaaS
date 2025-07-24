/* BREADCRUMB: unknown - Purpose to be determined */
// @ts-nocheck;
import { BuilderState } from './types';export const initialBuilderState: BuilderState = {
  components: [] as any[],
    selectedComponent: null,
    history: [] as any[],
    historyIndex: -1,
    zoom: 100,
    gridEnabled: true,
    previewMode: false
};
export const builderConfig = {
  canvas: {
  minZoom: 25,
    maxZoom: 200,
    zoomStep: 25,
    gridSize: 20,
    snapToGrid: true
  },
    components: {
    minWidth: 50,
    minHeight: 30,
    defaultWidth: 200,
    defaultHeight: 100 }
    history: {
    maxSteps: 50 }
    autosave: {
    enabled: true,
    interval: 30000, // 30 seconds
  }

export const shortcuts = {
  undo: 'Ctrl+Z',
  redo: 'Ctrl+Y',
  copy: 'Ctrl+C',
  paste: 'Ctrl+V',
  delete: 'Delete',
  selectAll: 'Ctrl+A',
  save: 'Ctrl+S',
  export: 'Ctrl+E',
  preview: 'Ctrl+P'
};
