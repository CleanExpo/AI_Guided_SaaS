#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface ProjectStatus {
  completedFeatures: string[];
  pendingFeatures: string[];
  currentErrors: number;
  lastBuildStatus: 'success' | 'failure';
  healthScore: number;
  recentChanges: string[];
}

interface MemorySection {
  title: string;
  content: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

class ClaudeMemoryUpdater {
  private claudeMdPath = path.join(process.cwd(), 'CLAUDE.md');
  private sections: MemorySection[] = [];

  async updateMemory(): Promise<void> {
    // Gather current project status
    const status = await this.gatherProjectStatus();
    
    // Build memory sections
    this.buildMemorySections(status);
    
    // Update CLAUDE.md
    await this.updateClaudeMd();
  }

  private async gatherProjectStatus(): Promise<ProjectStatus> {
    const status: ProjectStatus = {
      completedFeatures: [],
      pendingFeatures: [],
      currentErrors: 0,
      lastBuildStatus: 'success',
      healthScore: 0,
      recentChanges: []
    };

    // Check TypeScript errors
    try {
      execSync('npm run typecheck', { stdio: 'pipe' });
      status.currentErrors = 0;
    } catch (error) {
      const output = error.stdout?.toString() || '';
      const errorCount = (output.match(/error TS/g) || []).length;
      status.currentErrors = errorCount;
    }

    // Check build status
    try {
      execSync('npm run build', { stdio: 'pipe' });
      status.lastBuildStatus = 'success';
    } catch {
      status.lastBuildStatus = 'failure';
    }

    // Get recent git commits
    try {
      const commits = execSync('git log --oneline -5', { encoding: 'utf-8' });
      status.recentChanges = commits.split('\n').filter(Boolean);
    } catch {
      // Git might not be available
    }

    // Calculate health score
    status.healthScore = this.calculateHealthScore(status);

    // Get feature status from existing CLAUDE.md
    if (fs.existsSync(this.claudeMdPath)) {
      const content = fs.readFileSync(this.claudeMdPath, 'utf-8');
      status.completedFeatures = this.extractFeatures(content, 'Completed Features');
      status.pendingFeatures = this.extractFeatures(content, 'Pending Features');
    }

    return status;
  }

  private calculateHealthScore(status: ProjectStatus): number {
    let score = 100;
    
    // Deduct for TypeScript errors
    score -= Math.min(50, status.currentErrors * 2);
    
    // Deduct for build failure
    if (status.lastBuildStatus === 'failure') {
      score -= 30;
    }
    
    return Math.max(0, score);
  }

  private extractFeatures(content: string, section: string): string[] {
    const regex = new RegExp(`${section}.*?\\n([\\s\\S]*?)(?=\\n##|$)`, 'i');
    const match = content.match(regex);
    
    if (match) {
      return match[1]
        .split('\n')
        .filter(line => line.trim().startsWith('✅') || line.trim().startsWith('⏳'))
        .map(line => line.replace(/^[✅⏳]\s*/, '').trim());
    }
    
    return [];
  }

  private buildMemorySections(status: ProjectStatus): void {
    // Project Identity
    this.sections.push({
      title: '🧠 PROJECT IDENTITY',
      content: `**Name**: AI Guided SaaS
**Purpose**: Revolutionary AI-powered platform combining Lovable.dev's intuitive UI/UX with VS Code's power and Claude Code's intelligence
**Status**: ${status.lastBuildStatus === 'success' ? '✅ BUILD PASSING' : '❌ BUILD FAILING'} - ${status.currentErrors} TypeScript errors
**Health Score**: ${status.healthScore}/100`,
      priority: 'CRITICAL'
    });

    // Implementation Status
    const completedCount = status.completedFeatures.length;
    const totalCount = completedCount + status.pendingFeatures.length;
    
    this.sections.push({
      title: '🎯 IMPLEMENTATION STATUS',
      content: `**Progress**: ${completedCount}/${totalCount} features complete (${Math.round(completedCount/totalCount * 100)}%)
**TypeScript Errors**: ${status.currentErrors}
**Build Status**: ${status.lastBuildStatus}
**Last Updated**: ${new Date().toISOString()}

**Completed Features**:
${status.completedFeatures.map(f => `✅ ${f}`).join('\n')}

**Pending Features**:
${status.pendingFeatures.map(f => `⏳ ${f}`).join('\n')}`,
      priority: 'HIGH'
    });

    // Recent Activity
    if (status.recentChanges.length > 0) {
      this.sections.push({
        title: '📊 RECENT ACTIVITY',
        content: `**Recent Commits**:
${status.recentChanges.map(c => `- ${c}`).join('\n')}`,
        priority: 'MEDIUM'
      });
    }

    // Critical Issues
    if (status.currentErrors > 0 || status.lastBuildStatus === 'failure') {
      this.sections.push({
        title: '🚨 CRITICAL ISSUES',
        content: `**TypeScript Errors**: ${status.currentErrors}
**Build Status**: ${status.lastBuildStatus}
**Action Required**: Run health check and fix errors before deployment`,
        priority: 'CRITICAL'
      });
    }

    // Architecture Summary
    this.sections.push({
      title: '🏗️ ARCHITECTURE SUMMARY',
      content: `**Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
**Backend**: Next.js API Routes, Supabase, Redis
**AI Integration**: OpenAI GPT-4, Anthropic Claude, Open-source fallbacks
**Key Libraries**: Monaco Editor (VS Code), Faker.js (Mock Data), React Flow (Visual Builder)
**Architecture Pattern**: Hybrid Lovable.dev + VS Code approach with dual-mode interface`,
      priority: 'HIGH'
    });
  }

  private async updateClaudeMd(): Promise<void> {
    let content = `# CLAUDE.md - AI Guided SaaS Memory Core

*Last, Updated: ${new Date().toISOString()}*
*Auto-generated by update-claude-memory.ts*

`;

    // Add sections by priority
    const priorityOrder: Array<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'> = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    
    for (const priority of priorityOrder) {
      const prioritySections = this.sections.filter(s => s.priority === priority);
      for (const section of prioritySections) {
        content += `## ${section.title}\n\n${section.content}\n\n`;
      }
    }

    // Add static sections that should always be preserved
    content += `## 🔄 AUTO-COMPACT RULES
- Preserve implementation status and error counts
- Maintain architecture decisions and patterns
- Keep critical issues and action items
- Update feature progress automatically
- Preserve error prevention protocols

## 🚀 MEMORY PRIORITIES
1. **CRITICAL**: Build status, error counts, blocking issues
2. **HIGH**: Feature progress, architecture decisions, recent changes
3. **MEDIUM**: Implementation details, component references
4. **LOW**: Historical information, resolved issues

## 📝 USAGE NOTES
This file is automatically updated by scripts/update-claude-memory.ts
Run \`npm run, update:memory\` to refresh with latest project status

---
*Use this memory to maintain context about the project's current state, recent changes, and critical issues*`;

    // Write the updated content
    fs.writeFileSync(this.claudeMdPath, content);
  }
}

// Main execution
async function main() {
  const updater = new ClaudeMemoryUpdater();
  await updater.updateMemory();
}

if (require.main === module) {
  main().catch(console.error);
}

export { ClaudeMemoryUpdater };