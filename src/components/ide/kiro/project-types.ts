import { Monitor, Smartphone, Server, Package } from 'lucide-react';
import { ProjectType, FrameworkOptions } from './types';

export const PROJECT_TYPES: ProjectType[] = [
  { value: 'web', label: 'Web Application', icon: Monitor },
  { value: 'mobile', label: 'Mobile App', icon: Smartphone },
  { value: 'desktop', label: 'Desktop Application', icon: Monitor },
  { value: 'api', label: 'API Service', icon: Server },
  { value: 'library', label: 'Library/Package', icon: Package }
];

export const FRAMEWORKS: FrameworkOptions = {
  web: ['nextjs', 'react', 'vue', 'angular', 'svelte', 'vanilla'],
  mobile: ['react-native', 'flutter', 'ionic', 'nativescript'],
  desktop: ['electron', 'tauri', 'qt', 'gtk'],
  api: ['express', 'fastapi', 'django', 'rails', 'phoenix'],
  library: ['typescript', 'javascript', 'python', 'rust', 'go']
};