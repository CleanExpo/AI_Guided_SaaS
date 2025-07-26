'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="glass min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full glass
            <CardHeader className="glass">
            <CardTitle className="flex items-center gap-2 text-red-600 glass
                <AlertCircle className="h-5 w-5" />
                Something went wrong
              
            
            <CardContent className="glass"
              <p className="text-gray-600 mb-4">
                We apologize for the inconvenience. Please try again.
              
              <div className="glass p-3 rounded-lg text-sm text-gray-700 mb-4">
                {this.state.error?.message || 'Unknown error'}
              
              <Button onClick={this.handleReset} className="w-full">
                Try Again
              
            
          
        
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
