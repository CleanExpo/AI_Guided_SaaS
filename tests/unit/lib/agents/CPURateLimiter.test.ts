import { CPURateLimiter } from '@/lib/agents/CPURateLimiter'

describe('CPURateLimiter', () => {
  let rateLimiter: CPURateLimiter

  beforeEach(() => {
    rateLimiter = new CPURateLimiter({
      maxCpuUsage: 70,
      maxMemoryUsage: 80,
      checkInterval: 100,
      cooldownPeriod: 500})
  })

  afterEach(() => {
    rateLimiter.shutdown()
  })

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const limiter = new CPURateLimiter()
      expect(limiter.isCurrentlyThrottled()).toBe(false)
      limiter.shutdown()
    })

    it('should accept custom configuration', () => {
      const config = {
        maxCpuUsage: 50,
        maxMemoryUsage: 60,
        checkInterval: 200,
        cooldownPeriod: 1000}
      const limiter = new CPURateLimiter(config)
      expect(limiter.isCurrentlyThrottled()).toBe(false)
      limiter.shutdown()
    })
  })

  describe('throttling', () => {
    it('should not throttle when resources are below limits', () => {
      expect(rateLimiter.isCurrentlyThrottled()).toBe(false)
    })

    it('should emit metrics events', (done) => {
      rateLimiter.on('metrics', (metrics) => {
        expect(metrics).toHaveProperty('cpuUsage')
        expect(metrics).toHaveProperty('memoryUsage')
        expect(metrics).toHaveProperty('timestamp')
        done()
      })
    })

    it('should provide throttle status', () => {
      const status = rateLimiter.getThrottleStatus()
      expect(status).toHaveProperty('throttled')
      expect(status).toHaveProperty('currentMetrics')
      expect(status.throttled).toBe(false)
    })
  })

  describe('configuration updates', () => {
    it('should update configuration', () => {
      rateLimiter.updateConfig({
        maxCpuUsage: 90,
        maxMemoryUsage: 95})
      
      // Config should be updated
      expect(rateLimiter.isCurrentlyThrottled()).toBe(false)
    })
  })

  describe('metrics summary', () => {
    it('should provide metrics summary', () => {
      const summary = rateLimiter.getMetricsSummary()
      expect(summary).toHaveProperty('avgCpu')
      expect(summary).toHaveProperty('avgMemory')
      expect(summary).toHaveProperty('peakCpu')
      expect(summary).toHaveProperty('peakMemory')
      expect(summary).toHaveProperty('throttleCount')
    })

    it('should return zero values for empty metrics', () => {
      const newLimiter = new CPURateLimiter()
      const summary = newLimiter.getMetricsSummary()
      expect(summary.avgCpu).toBe(0)
      expect(summary.avgMemory).toBe(0)
      newLimiter.shutdown()
    })
  })

  describe('wait for resources', () => {
    it('should resolve immediately when not throttled', async () => {
      await expect(rateLimiter.waitForResources()).resolves.toBeUndefined()
    })
  })
})