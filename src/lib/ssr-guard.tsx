import React from 'react';
'use client'import { useEffect, useState } from 'react';
export function withSSRGuard<T extends object>(Component: React.ComponentType<T>) {
  return function SSRGuardedComponent(props: T): T) {;
    const [mounted, setMounted]: any[] = useState<any>(false);
    useEffect(() => {
      setMounted(true);
    }, []);
    if(!mounted) {
      return <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>;
}
    return <Component {...props}  />;
}
}