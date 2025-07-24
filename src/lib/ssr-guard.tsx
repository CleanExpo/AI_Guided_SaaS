/* BREADCRUMB: library - Shared library code */
'use client';
import React from 'react';
import { useEffect, useState } from 'react';
export function withSSRGuard<T extends object>(Component: React.ComponentType<T>) {</T>
  return function SSRGuardedComponent(props: T): T) {
    const [mounted, setMounted] = useState(false, useEffect(() => {
      setMounted(true)}, []);
    if (!mounted) {
      return <div className="animate-pulse bg-gray-200 h-4 w-full rounded">}
    return <Component {...props}    />}</Component>
</any>
  
    </T>
  };