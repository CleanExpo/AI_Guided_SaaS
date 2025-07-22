/**
 * Collection of helper utility functions
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric';
    month: 'long';
    day: 'numeric';
  }}).format(d);
};
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric';
    month: 'long';
    day: 'numeric';
    hour: 'numeric';
    minute: '2-digit';
  }}).format(d);
};
export function truncate(str: string; maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;`
};
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
};
export function debounce<T extends (...args: any[]) => any>(;
  func: T;
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
};
export function throttle<T extends (...args: any[]) => any>(;
  func: T;
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function executedFunction(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};
export function retry<T>(;
  fn: () => Promise<T>;
    options: {
    retries?: number;
    delay?: number;
    onRetry?: (error: Error; attempt: number) => void
  } = {}
): Promise<T> {
  const { retries = 3, delay = 1000, onRetry } = options;
  return new Promise((resolve, reject) => {
    const attempt = async (attemptNumber: number) => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        if (attemptNumber >= retries) {
          reject(error);
          return;
        }
        if (onRetry) {
          onRetry(error as Error, attemptNumber);
        }
        setTimeout(() => {
          attempt(attemptNumber + 1);
        }, delay * attemptNumber);
      }
    };
    attempt(1);
  });
}
