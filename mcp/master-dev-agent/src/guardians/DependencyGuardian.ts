import * as fs from 'fs/promises';
import * as path from 'path';
import * as semver from 'semver';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface DependencyReport {
  summary: {
    total: number;
    outdated: number;
    vulnerable: number;
    conflicts: number;
  };
  outdated: OutdatedDependency[];
  vulnerabilities: Vulnerability[];
  conflicts: DependencyConflict[];
  recommendations: string[];
}

interface OutdatedDependency {
  name: string;
  current: string;
  latest: string;
  wanted: string;
  type: 'dependencies' | 'devDependencies';
  severity: 'major' | 'minor' | 'patch';
}

interface Vulnerability {
  name: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  title: string;
  affectedVersions: string;
  fixedIn: string;
}

interface DependencyConflict {
  dependency: string;
  requestedBy: string[];
  versions: string[];
}

export class DependencyGuardian {
  async check(projectPath: string, options: { checkSecurity: boolean; checkUpdates: boolean }): Promise<DependencyReport> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    try {
      await fs.access(packageJsonPath);
    } catch (error: any) {
      return this.createEmptyReport('No package.json found');
    }

    const [outdatedDeps, vulnerabilities, conflicts] = await Promise.all([
      options.checkUpdates ? this.checkOutdated(projectPath) : [],
      options.checkSecurity ? this.checkVulnerabilities(projectPath) : [],
      this.checkConflicts(projectPath),
    ]);

    const report: DependencyReport = {
      summary: {
        total: await this.getTotalDependencies(packageJsonPath),
        outdated: outdatedDeps.length,
        vulnerable: vulnerabilities.length,
        conflicts: conflicts.length,
      },
      outdated: outdatedDeps,
      vulnerabilities,
      conflicts,
      recommendations: this.generateRecommendations(outdatedDeps, vulnerabilities, conflicts),
    };

    return report;
  }

  private async checkOutdated(projectPath: string): Promise<OutdatedDependency[]> {
    try {
      const { stdout } = await execAsync('npm outdated --json', { cwd: projectPath });
      const outdatedData = JSON.parse(stdout || '{}');
      
      return Object.entries(outdatedData).map(([name, info]: [string, any]) => ({
        name,
        current: info.current,
        latest: info.latest,
        wanted: info.wanted,
        type: info.type || 'dependencies',
        severity: this.determineSeverity(info.current, info.latest),
      }));
    } catch (error) {
      // npm outdated exits with code 1 when outdated packages exist
      if ((error as any).stdout) {
        try {
          const outdatedData = JSON.parse((error as any).stdout);
          return Object.entries(outdatedData).map(([name, info]: [string, any]) => ({
            name,
            current: info.current,
            latest: info.latest,
            wanted: info.wanted,
            type: info.type || 'dependencies',
            severity: this.determineSeverity(info.current, info.latest),
          }));
        } catch (parseError) {
          return [];
        }
      }
      return [];
    }
  }

  private async checkVulnerabilities(projectPath: string): Promise<Vulnerability[]> {
    try {
      const { stdout } = await execAsync('npm audit --json', { cwd: projectPath });
      const auditData = JSON.parse(stdout);
      
      if (!auditData.vulnerabilities) return [];

      return Object.entries(auditData.vulnerabilities)
        .filter(([_, vuln]: [string, any]) => vuln.severity !== 'info')
        .map(([name, vuln]: [string, any]) => ({
          name,
          severity: vuln.severity,
          title: vuln.title || 'Security vulnerability',
          affectedVersions: vuln.range || 'Unknown',
          fixedIn: vuln.fixAvailable ? vuln.fixAvailable.version : 'No fix available',
        }));
    } catch (error) {
      return [];
    }
  }

  private async checkConflicts(projectPath: string): Promise<DependencyConflict[]> {
    try {
      const { stdout } = await execAsync('npm ls --json', { cwd: projectPath });
      const treeData = JSON.parse(stdout);
      
      const conflicts: DependencyConflict[] = [];
      const versionMap = new Map<string, Set<string>>();
      const requesters = new Map<string, Set<string>>();

      // Traverse dependency tree to find conflicts
      this.traverseDependencyTree(treeData.dependencies, '', versionMap, requesters);

      // Identify conflicts
      versionMap.forEach((versions, depName) => {
        if (versions.size > 1) {
          conflicts.push({
            dependency: depName,
            requestedBy: Array.from(requesters.get(depName) || []),
            versions: Array.from(versions),
          });
        }
      });

      return conflicts;
    } catch (error) {
      return [];
    }
  }

  private traverseDependencyTree(
    deps: any,
    parent: string,
    versionMap: Map<string, Set<string>>,
    requesters: Map<string, Set<string>>
  ) {
    if (!deps) return;

    Object.entries(deps).forEach(([name, info]: [string, any]) => {
      if (info.version) {
        if (!versionMap.has(name)) {
          versionMap.set(name, new Set());
          requesters.set(name, new Set());
        }
        versionMap.get(name)!.add(info.version);
        requesters.get(name)!.add(parent || 'root');
      }

      if (info.dependencies) {
        this.traverseDependencyTree(info.dependencies, name, versionMap, requesters);
      }
    });
  }

  private determineSeverity(current: string, latest: string): 'major' | 'minor' | 'patch' {
    if (!semver.valid(current) || !semver.valid(latest)) return 'major';

    const currentMajor = semver.major(current);
    const latestMajor = semver.major(latest);
    
    if (currentMajor < latestMajor) return 'major';
    
    const currentMinor = semver.minor(current);
    const latestMinor = semver.minor(latest);
    
    if (currentMinor < latestMinor) return 'minor';
    
    return 'patch';
  }

  private async getTotalDependencies(packageJsonPath: string): Promise<number> {
    try {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      const deps = Object.keys(packageJson.dependencies || {}).length;
      const devDeps = Object.keys(packageJson.devDependencies || {}).length;
      return deps + devDeps;
    } catch (error) {
      return 0;
    }
  }

  private generateRecommendations(
    outdated: OutdatedDependency[],
    vulnerabilities: Vulnerability[],
    conflicts: DependencyConflict[]
  ): string[] {
    const recommendations: string[] = [];

    // Critical vulnerabilities
    const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical');
    if (criticalVulns.length > 0) {
      recommendations.push(`CRITICAL: Fix ${criticalVulns.length} critical vulnerabilities immediately`);
      criticalVulns.forEach(v => {
        recommendations.push(`  - Update ${v.name} to ${v.fixedIn}`);
      });
    }

    // Major version updates
    const majorUpdates = outdated.filter(d => d.severity === 'major');
    if (majorUpdates.length > 0) {
      recommendations.push(`Consider ${majorUpdates.length} major version updates (may contain breaking changes)`);
    }

    // Conflicts
    if (conflicts.length > 0) {
      recommendations.push(`Resolve ${conflicts.length} dependency conflicts to ensure stability`);
    }

    // General maintenance
    if (outdated.length > 10) {
      recommendations.push('Schedule regular dependency updates to avoid technical debt');
    }

    // Security best practices
    if (vulnerabilities.length === 0) {
      recommendations.push('✅ No known vulnerabilities - keep monitoring regularly');
    }

    return recommendations;
  }

  private createEmptyReport(message: string): DependencyReport {
    return {
      summary: {
        total: 0,
        outdated: 0,
        vulnerable: 0,
        conflicts: 0,
      },
      outdated: [],
      vulnerabilities: [],
      conflicts: [],
      recommendations: [message],
    };
  }
}