export interface KiroProjectSetupProps {
  onProjectCreated?: (projectId: string) => void;
  initialData?: {
    name?: string;
    description?: string;
    type?: string;
    framework?: string;
  };
}

export interface ProjectData {
  name: string;
  description: string;
  type: 'web' | 'mobile' | 'desktop' | 'api' | 'library';
  framework: string;
  language: string;
  settings: {
    buildCommand: string;
    startCommand: string;
    testCommand: string;
    outputDirectory: string;
    environment: Record<string, string>;
    dependencies: Record<string, string>;
  };
}

export interface ProjectFeatures {
  typescript: boolean;
  eslint: boolean;
  prettier: boolean;
  testing: boolean;
  docker: boolean;
  ci_cd: boolean;
  authentication: boolean;
  database: boolean;
}

export interface ProjectType {
  value: string;
  label: string;
  icon: any;
}

export interface ProjectStructure {
  name: string;
  type: 'file' | 'directory';
  path: string;
  content?: string;
  children?: ProjectStructure[];
}

export interface GeneratedProject {
  id: string;
  name: string;
  structure: ProjectStructure;
}

export type FrameworkOptions = {
  web: string[];
  mobile: string[];
  desktop: string[];
  api: string[];
  library: string[];
};