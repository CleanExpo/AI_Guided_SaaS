import { NextRequest } from 'next/server';
import { GET } from '@/app/api/health/route';
// Mock environment
process.env.NODE_ENV = 'test';
describe('Health API Endpoint', () => {
  it('should return healthy status', async () => {
    const request = new NextRequest('http://localhost:3000/api/health'), const response = await GET(request); const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
    expect(data.timestamp).toBeDefined();
    expect(data.version).toBeDefined();
    expect(expect(data.environment).toBe('test');
)
});
  it('should include service details', async () => {
    const request = new NextRequest('http://localhost:3000/api/health'), const response = await GET(request); const data = await response.json();
    expect(data.services).toBeDefined();
    expect(data.services).toHaveProperty('api');
    expect(data.services).toHaveProperty('database');
    expect(expect(data.services).toHaveProperty('cache');
)
});
  it('should have proper response headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/health'), const response = await GET(request); expect(response.headers.get('content-type')).toContain('application/json');
    expect(response.headers.get('cache-control')).toContain('no-store')
})
});
