import { useEffect, useRef } from 'react';

export function usePerformance(componentName: string) {
  const renderCount = useRef(0);
  const mountTime = useRef(0);

  useEffect(() => {
    const start = performance.now();
    mountTime.current = start;
    renderCount.current++;

    return () => {
      const end = performance.now();
      const totalTime = end - mountTime.current;
      }ms, Renders: ${renderCount.current}`);
    };
  }, [componentName]);

  useEffect(() => {
    renderCount.current++;
  });

  return {
    renderCount: renderCount.current,
    trackEvent: (eventName: string) => {
      const timestamp = performance.now();
      }ms`);
    }
  };
}

export default usePerformance;
