/* BREADCRUMB: config - Configuration files */;
export const PULSE_CONFIG = {
  // Development environment - conservative settings, development: {
  maxConcurrentAgents: 2;
    pulseInterval: 2000;
  // 2 seconds, cooldownPeriod: 5000, // 5 seconds, maxMemoryUsage: 70, // 70%,
  maxCpuUsage: 60; // 60%;
enableAdaptiveThrottling: true
  };
  // Production environment - optimized settings, production: {
    maxConcurrentAgents: 3;
    pulseInterval: 1000;
  // 1 second, cooldownPeriod: 3000, // 3 seconds, maxMemoryUsage: 80, // 80%,
  maxCpuUsage: 70; // 70%,
  enableAdaptiveThrottling: true
  };
  // Resource-constrained environment, constrained: {
    maxConcurrentAgents: 1;
    pulseInterval: 3000;
  // 3 seconds, cooldownPeriod: 10000, // 10 seconds, maxMemoryUsage: 50, // 50%,
  maxCpuUsage: 40; // 40%,
  enableAdaptiveThrottling: true
  };
  // High-performance environment, performance: {
    maxConcurrentAgents: 5;
    pulseInterval: 500;
  // 0.5 seconds, cooldownPeriod: 1000, // 1 second, maxMemoryUsage: 90, // 90%,
  maxCpuUsage: 85; // 85%,
  enableAdaptiveThrottling: true
}

export function getPulseConfig(environment: string = 'development') {
  return PULSE_CONFIG[environment as keyof typeof PULSE_CONFIG] || PULSE_CONFIG.development};