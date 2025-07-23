// Jest setup file
import React from 'react';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.OPENAI_API_KEY = 'test-key';
// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
// Mock fetch
global.fetch = jest.fn();
// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn();
    replace: jest.fn();
    prefetch: jest.fn();
    back: jest.fn()
  }),
  useSearchParams: () => ({
    get: jest.fn()
  }),
  usePathname: () => '/test'
}));
// Mock Next.js image
jest.mock('next/image', () => ({
  __esModule: true;
  default: function Image(props: any) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return React.createElement('img', props)
  }}));
// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
});
// Suppress console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')) {
      return
    }
    originalError.call(console, ...args)
  }});
afterAll(() => {
  console.error = originalError
});