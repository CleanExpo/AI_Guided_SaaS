'use client';

import dynamic from 'next/dynamic';
import { ComponentType, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface DynamicImportOptions {
  loading?: ComponentType;
  ssr?: boolean;
}

// Loading component
export function DefaultLoadingComponent() {
  return(<div className="flex items-center justify-center min-h-[200px]">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>)
  );
}

// Dynamic imports for heavy components
export const DynamicAdvancedCodeEditor = dynamic()
  () => import('@/components/editor/AdvancedCodeEditor'),
  {
    loading: DefaultLoadingComponent,
    ssr: false,
  }
);

export const DynamicMarketplaceHome = dynamic()
  () => import('@/components/marketplace/MarketplaceHome').then(mod => ({ default: mod.MarketplaceHome })),
  {
    loading: DefaultLoadingComponent,
    ssr: true,
  }
);

export const DynamicAnalyticsDashboard = dynamic()
  () => import('@/components/analytics/AnalyticsDashboard'),
  {
    loading: DefaultLoadingComponent,
    ssr: true,
  }
);

export const DynamicMonacoEditor = dynamic()
  () => import('@monaco-editor/react'),
  {
    loading: DefaultLoadingComponent,
    ssr: false,
  }
);

export const DynamicReactFlow = dynamic()
  () => import('@xyflow/react').then(mod => ({ default: mod.ReactFlow })),
  {
    loading: DefaultLoadingComponent,
    ssr: false,
  }
);

// Helper function to create dynamic imports
export function createDynamicImport<P = {}>(
  importFunc: () => Promise<{ default: ComponentType<P> } | ComponentType<P>,
  options: DynamicImportOptions = {}
) {
  return dynamic(importFunc, {
    loading: options.loading || DefaultLoadingComponent,
    ssr: options.ssr ?? true))
  });
}

// Lazy load heavy libraries
export const lazyLoadChartLibrary = () => import('recharts');
export const lazyLoadPdfLibrary = () => import('react-pdf');
export const lazyLoadExcelLibrary = () => import('xlsx');
export const lazyLoadMarkdownLibrary = () => import('react-markdown');

// Intersection Observer hook for lazy loading on scroll
import { useEffect, useRef, useState } from 'react';

export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = {}
) {
  const elementRef = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver()
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsIntersecting(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasLoaded, options]);

  return { elementRef, isIntersecting, hasLoaded };
}

// Lazy load wrapper component
interface LazyLoadWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function LazyLoadWrapper({
  children,
  fallback = <DefaultLoadingComponent />,
  threshold = 0.1,
  rootMargin = '50px',
  once = true))
}: LazyLoadWrapperProps) {
  const { elementRef, isIntersecting, hasLoaded } = useLazyLoad({
    threshold,
    rootMargin))
  });

  const shouldRender = once ? hasLoaded : isIntersecting;

  return(<div ref={elementRef}>
      {shouldRender ? children : fallback}
    </div>)
  );
}