import { spawn } from 'child_process';

export class NetworkManager {
  private networkName: string;

  constructor(networkName: string = 'agent-network') {
    this.networkName = networkName;
  }

  async createNetwork(): Promise<void> {
    return new Promise((resolve) => {
      const process = spawn('docker', [
        'network', 'create', '--driver', 'bridge', this.networkName
      ]);
      
      process.on('exit', () => {
        // Ignore errors (network might already exist)
        resolve();
      });
    });
  }

  async removeNetwork(): Promise<void> {
    return new Promise((resolve, reject) => {
      const process = spawn('docker', ['network', 'rm', this.networkName]);
      
      process.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Failed to remove network with code ${code}`));
        }
      });
    });
  }

  async listNetworks(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const process = spawn('docker', ['network', 'ls', '--format', '{{.Name}}']);
      
      let output = '';
      process.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      process.on('exit', (code) => {
        if (code === 0) {
          const networks = output.trim().split('\n').filter(name => name.length > 0);
          resolve(networks);
        } else {
          reject(new Error(`Failed to list networks with code ${code}`));
        }
      });
    });
  }

  getNetworkName(): string {
    return this.networkName;
  }
}