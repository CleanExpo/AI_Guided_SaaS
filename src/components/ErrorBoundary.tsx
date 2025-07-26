'use client';
import React from 'react';
import { logger } from '@/lib/logger';
interface ErrorBoundaryProps { children: React.ReactNod
e;
  fallback?: React.ReactNode
}
interface ErrorBoundaryState { hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component {
  constructor(props: ErrorBoundaryProps) {
    super(props, this.state={ hasError: false }})
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }}
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    }
  render() {
    if (this.state.hasError) {;
      return this.props.fallback || (, <div className="glass flex items-center justify-center min-h-[200px] p-4 text-center">, <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
        <p className="Please refresh the page or try again later.">
          
    )
}
    return this.props.children
}

  }