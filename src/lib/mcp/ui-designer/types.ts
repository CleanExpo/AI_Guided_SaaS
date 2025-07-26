/**
 * Type definitions for MCP UI Designer
 */

export type ThemePreset = 
  | 'appleGlass'
  | 'retro60s'
  | 'retro70s'
  | 'retro80s'
  | 'minimal'
  | 'maximal'
  | 'depth'
  | 'gradient'
  | 'neon'
  | 'brutalist'
  | 'organic'
  | 'futuristic'
  | 'hybrid';

export interface DesignToken {
  name: string;
  value: string;
  category: 'color' | 'spacing' | 'typography' | 'effect' | 'shadow' | 'gradient' | 'animation' | 'border';
  description?: string;
}

export interface UIComponent {
  name: string;
  type: 'button' | 'card' | 'navbar' | 'sidebar' | 'modal' | 'input' | 'table' | 'hero' | 'footer' | 'custom';
  path: string;
  props?: Record<string, any>;
  children?: UIComponent[];
}

export interface ThemeOptions {
  variant?: 'light' | 'dark' | 'auto';
  accentColor?: string;
  customizations?: Record<string, any>;
}