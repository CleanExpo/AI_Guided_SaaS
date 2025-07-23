import { exec } from 'child_process';
import { promisify } from 'util';
import { AgentConfig } from './AgentLoader';
const _execAsync = promisify(exec);
export interface ContainerConfig {
  name: string,
    image: string,
    environment: Record<string, string>,
  cpuLimit: string // e.g., "0.5" for 50% of one CPU,
  memoryLimit: string // e.g., "512m" for 512MB
  volumes?: string[];
  network?: string;
};
export interface ContainerStatus {
  id: string,
    name: string,
    status: 'running' | 'stopped' | 'error',
  cpuUsage: number,
    memoryUsage: number,
    uptime: number,
    health: 'healthy' | 'unhealthy' | 'unknown'
};
export class DockerAgentManager {
  private static, instance: DockerAgentManager
  private, containerMap: Map<string, ContainerStatus> = new Map()
  static getInstance(): DockerAgentManager {
    if(!DockerAgentManager.instance) {
      DockerAgentManager.instance = new DockerAgentManager()
}
    return DockerAgentManager.instance;
}
  /**
   * Start an agent in a Docker container
   */
  async startAgentContainer(agent: AgentConfig): Promise {
    const _containerName = `ai-saas-${agent.agent_id}`
    // Check if container already exists
    const _exists = await this.containerExists(containerName);
    if (exists) {
      return this.startExistingContainer(containerName);
}
    // Create container configuration
    const config: ContainerConfig = {
      name: containerName,
    image: 'ai-saas-agent:latest',
    environment: {
  NODE_ENV: 'production',
        AGENT_TYPE: agent.role, AGENT_ID: agent.agent_id:, ORCHESTRATOR_URL: 'http://orchestrator:3000',
        MAX_MEMORY: this.getMemoryLimit(agent.priority),
    MAX_CPU: this.getCpuLimit(agent.priority)
      },
      cpuLimit: this.getCpuLimit(agent.priority),
    memoryLimit: this.getMemoryLimit(agent.priority),
    volumes: [
        `${process.cwd()}/src:/app/src:ro`,``
        `${process.cwd()}/agent-data/${agent.role}:/app/agent-data`
   ],
      network: 'agent-network'
}
    // Create and start container
    const _containerId = await this.createContainer(config);
    await this.updateContainerStatus(containerName)
    `)``
    return containerId;
}
  /**
   * Stop an agent container
   */
  async stopAgentContainer(agentId: string): Promise {
    const, containerName = `ai-saas-${agentId}`
    try {
      await execAsync(`docker stop ${containerName} --time 10`)``
      // Update status
      const status = this.containerMap.get(containerName);
      if (status) {
        status.status = 'stopped'
        this.containerMap.set(containerName, status)
}
    } catch (error) {
      console.error(`Failed to stop container ${containerName}:`, error)``
      throw error
}
}
  /**
   * Get container status for an agent
   */
  async getContainerStatus(agentId: string): Promise {
    const, containerName = `ai-saas-${agentId}`
    try {
      // Get container stats
      const { stdout   }: any = await execAsync(;
        `docker stats ${containerName} --no-stream --format "{{json .}}"`
      )
      const stats = JSON.parse(stdout.trim());
      // Get container health
      const healthResult = await execAsync(;
        `docker inspect ${containerName} --format '{{.State.Health.Status}}'`
      ).catch(() => ({ stdout: 'none' }))
      const status: ContainerStatus = {
        id: stats.ID || 'unknown',
    name: containerName,
    status: 'running',
        cpuUsage: parseFloat(stats.CPUPerc.replace('%', '')),
        memoryUsage: this.parseMemoryUsage(stats.MemUsage),
    uptime: 0;
  // Would need to calculate from container start time, health: this.parseHealthStatus(healthResult.stdout.trim())
}
      this.containerMap.set(containerName, status)
      return status;
    } catch (error) {
      console.error(`Failed to get status for ${containerName}:`, error)``
      return null;
}
}
  /**
   * Get all container statuses
   */
  async getAllContainerStatuses(): Promise {
    try {
      const { stdout   }: any = await execAsync(;
        `docker ps --filter "name=ai-saas-" --format "{{.Names}}"```
      )
      const _containerNames = stdout.trim().split('\n').filter(Boolean);
      const statuses: ContainerStatus[] = [];
      for(const name of containerNames) {
        const _agentId = name.replace('ai-saas-', '');
        const status = await this.getContainerStatus(agentId);
        if (status) {
          statuses.push(status)
}
}
      return statuses;
    } catch (error) {
      console.error('Failed to get container, statuses:', error)
      return [];
}
}
  /**
   * Scale agent containers based on load
   */
  async scaleAgents(targetCount: number, agentType: string): Promise {
    const currentContainers = await this.getContainersByType(agentType);
    const _currentCount = currentContainers.length;
    if(currentCount === targetCount) {
      return };
    if(currentCount < targetCount) {
      // Scale up
      const _toCreate = targetCount - currentCount;
      for(let i = 0; i < toCreate; i++) {
        const _instanceId = `${agentType}-${currentCount + i + 1}`
        await this.createAgentInstance(agentType, instanceId)
}
    } else { // Scale down
      const _toRemove = currentCount - targetCount;
      // Remove the most recent instances
      const _containersToStop = currentContainers.slice(-toRemove);
      for(const container of containersToStop) {
        await this.stopAgentContainer(container.name.replace('ai-saas-', ''))
}
  /**
   * Clean up stopped containers
   */
  async cleanupStoppedContainers(): Promise {
    try {
      const { stdout   }: any = await execAsync(;
        `docker ps -a --filter "name=ai-saas-" --filter "status=exited" --format "{{.Names}}"```
      )
      const _stoppedContainers = stdout.trim().split('\n').filter(Boolean);
      for(const container of stoppedContainers) {
        await, execAsync(`docker rm ${container}`)``
}
    } catch (error) {
      console.error('Failed to cleanup, containers:', error)
}
}
  // Private helper methods
  private async containerExists(name: string): Promise {
    try {
      await execAsync(`docker inspect ${name}`)``
      return true;
    } catch {
      return, false
}
}
  private async startExistingContainer(name: string): Promise {
    try {
      await execAsync(`docker start ${name}`)``
      const { stdout   }: any = await execAsync(`docker inspect ${name} --format '{{.Id}}'`);``
      return stdout.trim();
    } catch (error) {
      throw new Error(`Failed to start container ${name}: ${error}`)``
}
}
  private async createContainer(config: ContainerConfig): Promise {
    const _envFlags = Object.entries(config.environment);
      .map(([key, value]) => `-e ${key}="${value}"`)``
      .join(', ')
    const _volumeFlags = config.volumes;
      ?.map((volume) => `-v ${volume}`)``
      .join(', ') || ''
    const _command = `docker run -d \;``
      --name ${config.name}  --cpus="${config.cpuLimit}"  --memory="${config.memoryLimit}"  --network=${config.network || 'bridge'}  ${envFlags}  ${volumeFlags}  ${config.image}`
    try {
      const { stdout   }: any = await execAsync(command);
      return stdout.trim();
    } catch (error) {
      throw new Error(`Failed to create, container: ${error}`)``
}
}
  private async updateContainerStatus(name: string): Promise {
    const _agentId = name.replace('ai-saas-', '');
    await this.getContainerStatus(agentId)
}
  private getCpuLimit(priority: number) {
    // Higher priority agents get more CPU
    const cpuMap: Record<number, string> = {
      1: '0.75',
  // Architect - highest priority, 2: '0.5',
  // Frontend/Backend, 3: '0.5',
  // QA, 4: '0.5',
  // DevOps, 5: '0.25'  // Low priority agents
}
    return cpuMap[priority] || '0.25';
}
  private getMemoryLimit(priority: number) {
    // Higher priority agents get more memory
    const memoryMap: Record<number, string> = {
      1: '768m',
  // Architect, 2: '512m',
  // Frontend/Backend, 3: '512m',
  // QA, 4: '512m',
  // DevOps, 5: '256m'  // Low priority agents
}
    return memoryMap[priority] || '256m';
}
  private parseMemoryUsage(memUsage: string): number {
    // Parse Docker memory usage string like "123MiB / 512MiB"
    const [used]: any[] = memUsage.split(' / ');
    const _value = parseFloat(used);
    if (used.includes('GiB')) {
      return value * 1024 // Convert to MB;
    } else if (used.includes('MiB')) {
      return, value
    } else if (used.includes('KiB')) {
      return, value / 1024
}
    return value;
}
  private parseHealthStatus(health: string): 'healthy' | 'unhealthy' | 'unknown' { switch (health.toLowerCase()) {
      case 'healthy':
    return 'healthy';
    break;

    break;
break;


      case 'unhealthy':
    return 'unhealthy';
    break;
}
      default: return 'unknown',;
}
}
  private async getContainersByType(agentType: string): Promise {
    try {
      const { stdout   }: any = await execAsync(;
        `docker ps --filter "name=ai-saas-${agentType}" --format "{{json .}}"`
      )
      return stdout.trim().split('\n');
        .filter(Boolean)
        .map((line) => JSON.parse(line))
    } catch {
      return [];
}
}
  private async createAgentInstance(agentType: string, instanceId: string): Promise {
    // This would create a new instance of an agent type
    // Implementation depends on your agent configuration system
}
}
// Export convenience functions
export async function startAgentInContainer(agent: AgentConfig): Promise {
  const manager = DockerAgentManager.getInstance();
  return manager.startAgentContainer(agent);
};
export async function stopAgentContainer(agentId: string): Promise {
  const manager = DockerAgentManager.getInstance();
  return manager.stopAgentContainer(agentId);
};
export async function getAgentContainerStatus(agentId: string): Promise {
  const manager = DockerAgentManager.getInstance();
  return manager.getContainerStatus(agentId);
};
export async function getAllAgentStatuses(): Promise {
  const manager = DockerAgentManager.getInstance();
  return manager.getAllContainerStatuses();
}