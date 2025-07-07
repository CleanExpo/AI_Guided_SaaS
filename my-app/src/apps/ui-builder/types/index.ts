export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ComponentConfig {
  id: string;
  type: string;
  name: string;
  position: Position;
  size: Size;
  props: Record<string, any>;
  children?: ComponentConfig[];
  style?: Record<string, any>;
  className?: string;
}

export interface BuilderState {
  components: ComponentConfig[];
  selectedComponent: string | null;
  history: ComponentConfig[][];
  historyIndex: number;
  zoom: number;
  gridEnabled: boolean;
  previewMode: boolean;
}

export interface MotiaComponent {
  type: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  defaultProps: Record<string, any>;
  propTypes: Record<string, PropType>;
  preview: string;
}

export interface PropType {
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'array' | 'object';
  default?: any;
  options?: string[];
  required?: boolean;
  description?: string;
}

export interface DragItem {
  type: string;
  componentType: string;
  config?: ComponentConfig;
}

export interface DropResult {
  position: Position;
  targetId?: string;
}
