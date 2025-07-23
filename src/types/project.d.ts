export interface ProjectFormData {
  projectType: 'api' | 'web' | 'mobile' | 'desktop' | 'fullstack' | 'web-app',
  name: string,
  description: string,
  features: string[],
  technology: string,
  complexity: 'simple' | 'moderate' | 'complex'
};
export interface ValidationResult {
  isValid: boolean,
  errors: Record<string, string>
}