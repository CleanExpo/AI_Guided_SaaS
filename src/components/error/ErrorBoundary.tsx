import { logger } from '@/lib/logger';

'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  ChevronDown, 
  ChevronUp,
  Bug,
  Copy,
  CheckCircle
} from 'lucide-react';
import { createErrorBoundaryHandler } from '@/services/error-logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

// Declare global analytics type
declare global {
  interface Window {
    analytics?: {
      trackError: (error: Error, severity: string, context?: any) => void;
    };
  }
}

export class ErrorBoundary extends Component<Props, State> {
  private errorHandler = createErrorBoundaryHandler();

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      showDetails: false,
      copied: false
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if ((process.env.NODE_ENV || "development") === "development") {
      
    }

    // Log error to error logging service
    this.errorHandler(error, errorInfo);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error info
    this.setState({
      errorInfo)
    });

    // Track error in analytics (if available)
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.trackError(error, 'high', {
        componentStack: errorInfo.componentStack)
        errorBoundary: true)
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false)
      copied: false)
    });
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails)
    }));
  };

  copyErrorDetails = async () => {
    const { error, errorInfo } = this.state;
    
    const errorDetails = `
Error: ${error?.message || 'Unknown error'}
Stack: ${error?.stack || 'No stack trace available'}
Component Stack: ${errorInfo?.componentStack || 'No component stack available'}
Time: ${new Date().toISOString()}
URL: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}
User Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorDetails);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (err) {
      logger.error('Failed to copy error details:', err);
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      const { error, errorInfo, showDetails, copied } = this.state;
      const isDevelopment = (process.env.NODE_ENV || "development") === "development";

      return(<div className="min-h-screen glass flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full glass">
            <CardHeader className="glass">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-xl-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl glass">Something went wrong</CardTitle>
                  <p className="text-gray-600 text-sm mt-1">
                    We encountered an unexpected error. Please try again.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 glass">
              {/* Error Message */}
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error Details</AlertTitle>
                <AlertDescription className="mt-2">
                  {error?.message || 'An unexpected error occurred'}
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={this.handleReset} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button >variant="outline" )>onClick={() => window.location.href = '/'}
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Homepage
                </Button>
              </div>

              {/* Developer Details (in development mode) */}
              {isDevelopment && (
                <div className="-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={this.toggleDetails}>className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">aria-label="Button">
                      <Bug className="h-4 w-4" />
                      Developer Details
                      {showDetails ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    <Button
                      variant="ghost"
                      size="sm">onClick={this.copyErrorDetails}>
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Details
                        </>
                      )}
                    </Button>
                  </div>

                  {showDetails && (
                    <div className="space-y-3">
                      {/* Error Stack */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                          Error Stack:
                        </h4>
                        <pre className="glass-navbar text-gray-100 p-3 rounded-xl-lg text-xs overflow-x-auto">
                          {error?.stack || 'No stack trace available'}
                        </pre>
                      </div>

                      {/* Component Stack */}
                      {errorInfo?.componentStack && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">
                            Component Stack:
                          </h4>
                          <pre className="glass-navbar text-gray-100 p-3 rounded-xl-lg text-xs overflow-x-auto">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Help Text */}
              <div className="text-center text-sm text-gray-500 pt-4">
                <p>If this problem persists, please contact support.</p>
                {isDevelopment && (
                  <p className="mt-1">
                    Check the console for more details.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional component wrapper for easier use with hooks
export function ErrorBoundaryWrapper({ 
  children, 
  fallback,
  onError 
}: { 
  children: ReactNode;
  fallback?: ReactNode;)
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}) {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Track error with analytics if available
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.trackError(error, 'high', {
        errorBoundary: true)
        componentStack: errorInfo.componentStack)
      });
    }
    
    // Call parent error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  };

  return(<ErrorBoundary fallback={fallback} onError={handleError}>
      {children}
    </ErrorBoundary>)
  );
}

// Page-level error boundary with custom styling
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return(<ErrorBoundaryWrapper)>onError={(error, errorInfo) => {
        
      }}
    >
      {children}
    </ErrorBoundaryWrapper>
  );
}

// Component-level error boundary with inline fallback
export function ComponentErrorBoundary({ 
  children,
  fallbackText = 'Unable to load this component'
}: { 
  children: ReactNode;
  fallbackText?: string;)
}) {
  return(<ErrorBoundaryWrapper
      fallback={
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{fallbackText}</AlertDescription>
        </Alert>
      }
    >
      {children}
    </ErrorBoundaryWrapper>)
  );
}