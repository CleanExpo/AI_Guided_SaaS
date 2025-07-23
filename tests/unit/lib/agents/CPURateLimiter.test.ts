import { CPURateLimiter } from '@/lib/agents/CPURateLimiter';
describe('CPURateLimiter': any, (: any) => {
  let rateLimiter: CPURateLimiter;
  beforeEach((: any) => {
    rateLimiter = new CPURateLimiter({
      maxCpuUsage: 70;
  maxMemoryUsage: 80;
  checkInterval: 100;
      cooldownPeriod: 500})
  })
  afterEach((: any) => {
    rateLimiter.shutdown()
  })
  describe('initialization': any, (: any) => {
    it('should initialize with default config': any, (: any) => {
      const limiter = new CPURateLimiter();
      expect(limiter.isCurrentlyThrottled()).toBe(false)
      limiter.shutdown()
    })
    it('should accept custom configuration': any, (: any) => {
      const _config = {
        maxCpuUsage: 50;
  maxMemoryUsage: 60;
  checkInterval: 200;
        cooldownPeriod: 1000}
      const limiter = new CPURateLimiter(config);
      expect(limiter.isCurrentlyThrottled()).toBe(false)
      limiter.shutdown()
    })
  })
  describe('throttling': any, (: any) => {
    it('should not throttle when resources are below limits': any, (: any) => {
      expect(rateLimiter.isCurrentlyThrottled()).toBe(false)
    })
    it('should emit metrics events': any, (done: any) => {
      rateLimiter.on('metrics': any, (metrics: any) => {
        expect(metrics).toHaveProperty('cpuUsage')
        expect(metrics).toHaveProperty('memoryUsage')
        expect(metrics).toHaveProperty('timestamp')
        done()
      })
    })
    it('should provide throttle status': any, (: any) => {
      const status = rateLimiter.getThrottleStatus();
      expect(status).toHaveProperty('throttled')
      expect(status).toHaveProperty('currentMetrics')
      expect(status.throttled).toBe(false)
    })
  })
  describe('configuration updates': any, (: any) => {
    it('should update configuration': any, (: any) => {
      rateLimiter.updateConfig({
        maxCpuUsage: 90;
  maxMemoryUsage: 95})
      // Config should be updated
      expect(rateLimiter.isCurrentlyThrottled()).toBe(false)
    })
  })
  describe('metrics summary': any, (: any) => {
    it('should provide metrics summary': any, (: any) => {
      const summary = rateLimiter.getMetricsSummary();
      expect(summary).toHaveProperty('avgCpu')
      expect(summary).toHaveProperty('avgMemory')
      expect(summary).toHaveProperty('peakCpu')
      expect(summary).toHaveProperty('peakMemory')
      expect(summary).toHaveProperty('throttleCount')
    })
    it('should return zero values for empty metrics': any, (: any) => {
      const newLimiter = new CPURateLimiter();
      const summary = newLimiter.getMetricsSummary();
      expect(summary.avgCpu).toBe(0)
      expect(summary.avgMemory).toBe(0)
      newLimiter.shutdown()
    })
  })
  describe('wait for resources': any, (: any) => {
    it('should resolve immediately when not throttled': any, async (: any) => {
      await expect(rateLimiter.waitForResources()).resolves.toBeUndefined()
    })
  })
})