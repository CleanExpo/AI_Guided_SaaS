import path from 'path';
import fs from 'fs/promises';
import { spawn } from 'child_process';
import { DockerfileTemplateManager } from './DockerfileTemplateManager';

export class DockerImageBuilder {
  private templateManager: DockerfileTemplateManager;

  constructor(baseImage?: string) {
    this.templateManager = new DockerfileTemplateManager(baseImage);
  }

  async buildAgentImage(agent: any): Promise<string> {
    const agentType = agent.getConfig().type;
    const imageName = `agent-${agent.getConfig().id}:latest`;
    
    // Get appropriate Dockerfile template
    const dockerfile = this.templateManager.getTemplate(agentType);
    
    // Create temporary build directory
    const buildDir = path.join(process.cwd(), '.docker-build', agent.getConfig().id);
    await fs.mkdir(buildDir, { recursive: true });
    
    try {
      // Write Dockerfile
      await fs.writeFile(path.join(buildDir, 'Dockerfile'), dockerfile);
      
      // Copy necessary files
      await this.copyAgentFiles(buildDir);
      
      // Build image
      await this.buildDockerImage(buildDir, imageName);
      
      return imageName;
    } finally {
      // Clean up build directory
      await fs.rm(buildDir, { recursive: true, force: true });
    }
  }

  private async copyAgentFiles(buildDir: string): Promise<void> {
    // Copy package files
    await fs.copyFile('package.json', path.join(buildDir, 'package.json'));
    await fs.copyFile('package-lock.json', path.join(buildDir, 'package-lock.json'));
    
    // Copy agent source files
    const srcDir = path.join(buildDir, 'src', 'lib', 'agents');
    await fs.mkdir(srcDir, { recursive: true });
    await this.copyDirectory(path.join('src', 'lib', 'agents'), srcDir);
    
    // Create health check script
    const healthCheckScript = `const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('healthy');
});

server.listen(3000);`;
    
    await fs.writeFile(path.join(buildDir, 'healthcheck.js'), healthCheckScript);
  }

  private async copyDirectory(src: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  private async buildDockerImage(buildDir: string, imageName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const process = spawn('docker', ['build', '-t', imageName, '.'], {
        cwd: buildDir,
                stdio: 'inherit')
      });
      
      process.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Docker build failed with code ${code}`));
        }
      });
    });
  }
}