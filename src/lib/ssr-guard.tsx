'use client'
import { useEffect, useState } from 'react';

export function withSSRGuard<T extends object>(Component: React.ComponentType<T>) {
  return function SSRGuardedComponent(props: T) {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
      setMounted(true);
    }, []);
    
    if (!mounted) {
      return <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>;
    }
    
    return <Component {...props} />;
  };
}