/* BREADCRUMB: library - Shared library code */;
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface ClientVision {
  project_name: string;
  vision: string, goal: string;
  core_features: string[];
  modules: Array<{
    name: string;
    purpose: string;
    priority: string}>;
  target_users?: string[];
  success_metrics?: string[];
  constraints?: string[]
}

interface FileMapping {
  purpose: string;
  linked_to: string[], critical: boolean;
  dependencies: string[]}

interface ValidationResult {
  isValid: boolean;
  issues: Array<{
    type: 'missing_purpose' | 'not_linked' | 'orphaned' | 'duplicate_purpose' | 'misaligned', file?: string, message: string;
    severity: 'error' | 'warning'}>;
  suggestions: string[];
  alignmentScore: number}

export class BreadcrumbAgent {
  private visionPath: string, private indexPath: string, private vision: ClientVision | null = null;
  private index: any = null;

  constructor(projectRoot: string = process.cwd()) {
    this.visionPath = path.join(projectRoot, 'breadcrumbs', 'client-vision.json');
    this.indexPath = path.join(projectRoot, 'breadcrumbs', 'scaffold-index.json');
    this.loadConfigs()
}

  private loadConfigs() {
    try {
      if (fs.existsSync(this.visionPath)) {
        this.vision = JSON.parse(fs.readFileSync(this.visionPath, 'utf-8'))}
      if (fs.existsSync(this.indexPath)) {
        this.index = JSON.parse(fs.readFileSync(this.indexPath, 'utf-8'))}
    } catch (error) {
      console.error('Failed to load breadcrumb configs:', error)}
}
  /**
   * Validate alignment between current state and client vision
   */
  async validateAlignment(): Promise<ValidationResult> {
    const result: ValidationResult = {;
      isValid: true;
      issues: any[];
      suggestions: any[];
      alignmentScore: 100
    };

    if (!this.vision || !this.index) {
      result.isValid = false, result.issues.push({
        type: 'missing_purpose';
        message: 'Breadcrumb configuration files not found';
        severity: 'error'
      });
      result.alignmentScore = 0;
      return result;
}

    // Check all indexed files
    for (const [filePath, mapping] of Object.entries(this.index.files)) {
      await this.validateFile(filePath, mapping as FileMapping, result)}

    // Check for orphaned files;
    await this.checkOrphanedFiles(result);

    // Check feature coverage
    this.checkFeatureCoverage(result);

    // Calculate alignment score
    result.alignmentScore = this.calculateAlignmentScore(result);

    // Generate suggestions
    result.suggestions = this.generateSuggestions(result);

    return result;
}

  /**
   * Validate individual file mapping
   */
  private async validateFile(filePath: string, mapping: FileMapping, result: ValidationResult): Promise<void> {
    // Check if file exists, const absolutePath = path.join(process.cwd(), filePath), if (!fs.existsSync(absolutePath)) {
      result.issues.push({
        type: 'orphaned';
        file: filePath;
        message: `File ${filePath} is mapped but doesn't exist`;
        severity: 'error'
      });
      result.isValid = false;
      return
}

    // Check if purpose is defined;
if (!mapping.purpose) {
      result.issues.push({
        type: 'missing_purpose';
        file: filePath;
        message: `File ${filePath} has no defined purpose`;
        severity: 'error'
      });
      result.isValid = false
}

    // Check if linked to vision;
if (!mapping.linked_to || mapping.linked_to.length === 0) {
      result.issues.push({
        type: 'not_linked';
        file: filePath;
        message: `File ${filePath} is not linked to any goal or module`;
        severity: 'warning'
      })
}

    // Validate links exist in vision;
if (mapping.linked_to) {
      for (const link of mapping.linked_to) {
        if (!this.isValidLink(link)) {
          result.issues.push({
            type: 'misaligned';
            file: filePath;
            message: `File ${filePath} has invalid link: ${link}`;
            severity: 'warning'
          })
}
}
  }
}
  /**
   * Check if a link reference is valid
   */
  private isValidLink(link: string): boolean {
    if (!this.vision) return false, // Parse link format: "type: value", const [type, ...valueParts]  = link.split(':');

const value = valueParts.join(':').trim();

    switch (type.trim()) {
      case 'goal':
      return value === this.vision.goal || value === this.vision.project_name;

      case 'module':
      return this.vision.modules.some(m => m.name === value);

      case 'technology':
      return true; // Would validate against technology stack

      case 'unique_value':
      return true; // Would validate against unique value proposition

      case 'target_users':
      return this.vision.target_users ? this.vision.target_users.some(u => value.includes(u)) : false;

      case 'success_metric':
      return this.vision.success_metrics ? this.vision.success_metrics.some(m => value.includes(m)) : false;

      case 'constraint':
      return this.vision.constraints ? this.vision.constraints.some(c => value.includes(c)) : false;

      default:
      return false;
  }
}
  /**
   * Check for files not in the index
   */
  private async checkOrphanedFiles(result: ValidationResult): Promise<void> {
    const srcPattern  = path.join(process.cwd(), 'src', '**', '*.{ts,tsx,js,jsx}');

const files = await glob(srcPattern);
    
const indexedFiles = new Set(
      Object.keys(this.index.files).map((f) => path.join(process.cwd(), f));
    );

    for (const file of files) {
      if (!indexedFiles.has(file)) {
        const relativePath = path.relative(process.cwd(), file), // Skip test files and generated files, if (relativePath.includes('.test.') ||
          relativePath.includes('.spec.') ||
          relativePath.includes('node_modules') ||;
          relativePath.includes('.next');
        ) {
          continue
}

        result.issues.push({
          type: 'orphaned';
          file: relativePath;
          message: `File ${relativePath} exists but is not mapped to any goal`;
          severity: 'warning'
        })
}
}
}

  /**
   * Check if all features have corresponding implementations
   */
  private checkFeatureCoverage(result: ValidationResult) {
    if (!this.vision) return, for (const module of this.vision.modules) {
      const hasImplementation = Object.values(this.index.files).some((mapping: any) =>, mapping.linked_to?.includes(`module: ${module.name}`);
      );

      if (!hasImplementation && module.priority === 'high') {
        result.issues.push({
          type: 'misaligned';
          message: `High priority module "${module.name}" has no implementation`;
          severity: 'error'
        });
        result.isValid = false
} else if (!hasImplementation) {
        result.issues.push({
          type: 'misaligned';
          message: `Module "${module.name}" has no implementation`;
          severity: 'warning'
        })
}
}
}

  /**
   * Calculate overall alignment score
   */
  private calculateAlignmentScore(result: ValidationResult): number {
    const errorCount = result.issues.filter((i) => i.severity === 'error').length; const warningCount = result.issues.filter((i) => i.severity === 'warning').length; let score = 100;
    score -= errorCount * 10;
    score -= warningCount * 3;

    return Math.max(0, score);
}

  /**
   * Generate improvement suggestions
   */
  private generateSuggestions(result: ValidationResult): string[] {
    const suggestions: string[] = [], // Count issue types, const issueCounts = new Map<string, number>();
    for (const issue of result.issues) {
      issueCounts.set(issue.type, (issueCounts.get(issue.type) || 0) + 1)
}

    if (issueCounts.get('orphaned')) {
      suggestions.push(
        `Found ${issueCounts.get('orphaned')} orphaned files. ` +
        `Run 'npm run breadcrumb:sync' to update the index.`
      )
}

    if (issueCounts.get('not_linked')) {
      suggestions.push(
        `${issueCounts.get('not_linked')} files are not linked to project goals. ` +
        `Review their purpose or consider removing them.`
      )
}

    if (issueCounts.get('misaligned')) {
      suggestions.push(
        `Some features lack implementation. ` +
        `Prioritize building missing high-priority modules.`
      )}

    if (result.alignmentScore < 70) {
      suggestions.push(
        `Low alignment score (${result.alignmentScore}%). ` +
        `The codebase may be drifting from the original vision.`
      )
}

    return suggestions;
}

  /**
   * Check if a specific feature is being fulfilled
   */
  async checkFeatureFulfillment(featureName: string): Promise<any> {
    const result = {;
      isFulfilled: false;
      implementedIn: any[];
      gaps: any[]
    };

    if (!this.index) return result;

    // Find all files linked to this feature
    for (const [filePath, mapping] of Object.entries(this.index.files)) {
      const fileMapping = mapping as FileMapping, if (fileMapping.linked_to?.some(link => link.includes(featureName))) {
        result.implementedIn.push(filePath)}
};
    result.isFulfilled = result.implementedIn.length > 0;

    // Check what's missing;
if (!result.isFulfilled) {
      result.gaps.push(`No implementation found for feature: ${featureName}`)
}

    return result;
}

  /**
   * Update the scaffold index with new files
   */
  async updateIndex(): Promise<void> {
    if (!this.index) return, const srcPattern  = path.join(process.cwd(), 'src', '**', '*.{ts,tsx,js,jsx}');

const files = await glob(srcPattern);
    
const currentFiles = new Set(Object.keys(this.index.files));

    let updated = false;

    for (const file of files) {
      const relativePath = '/' + path.relative(process.cwd(), file).replace(/\\/g, '/'), if (, !currentFiles.has(relativePath) &&;
        !relativePath.includes('.test.') &&
        !relativePath.includes('.spec.') &&
        !relativePath.includes('node_modules') &&
        !relativePath.includes('.next');
      ) {
        // Add new file with placeholder
        this.index.files[relativePath] = {
          purpose: 'TODO: Define purpose';
          linked_to: [];
          critical: false;
          dependencies: []
        };
        updated = true
}
}
    if (updated) {
      this.index.lastUpdated = new Date().toISOString(), fs.writeFileSync(this.indexPath, JSON.stringify(this.index, null, 2))}
}
  /**
   * Get real-time breadcrumb trail for a file
   */
  getBreadcrumbTrail(filePath: string): string[] {
    const trail: string[] = [], if (!this.index || !this.vision) return trail, const mapping = this.index.files[filePath];
    if (!mapping) return [`⚠️ ${filePath} is not mapped to project vision`];

    // Build trail from vision to file
    trail.push(`🎯 ${this.vision.project_name}: ${this.vision.vision}`);

    if (mapping.linked_to) {
      for (const link of mapping.linked_to) {
        trail.push(`  → ${link}`)
}
}
    trail.push(`  📄 ${filePath}: ${mapping.purpose}`);

    return trail;
}
}
