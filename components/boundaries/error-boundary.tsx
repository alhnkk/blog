"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (
        resetKeys?.some((key, index) => key !== prevProps.resetKeys?.[index])
      ) {
        this.resetErrorBoundary();
      }
    }

    if (
      hasError &&
      resetOnPropsChange &&
      prevProps.children !== this.props.children
    ) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({ hasError: false, error: undefined });
    }, 0);
  };

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            We encountered an unexpected error. Please try refreshing the page
            or contact support if the problem persists.
          </p>
          <div className="flex gap-4">
            <Button onClick={this.resetErrorBoundary} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs bg-muted p-4 rounded overflow-auto max-w-2xl">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for easier usage
interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export function ErrorBoundaryWrapper({
  children,
  fallback,
  onError,
}: ErrorBoundaryWrapperProps) {
  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}

// Route-level error boundary
export function RouteErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to monitoring service in production
        console.error("Route error:", error, errorInfo);
      }}
      fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Page Error</h1>
          <p className="text-xl text-muted-foreground mb-8">
            This page encountered an error and couldn't be displayed.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.history.back()} variant="outline">
              Go Back
            </Button>
            <Button onClick={() => (window.location.href = "/")}>
              Go Home
            </Button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// Component-specific error boundaries
export function ComponentErrorBoundary({
  children,
  componentName,
}: {
  children: ReactNode;
  componentName: string;
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="border border-destructive/20 rounded-lg p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Component Error</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The {componentName} component failed to load.
          </p>
          <Button size="sm" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      }
      onError={(error) => {
        console.error(`${componentName} component error:`, error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
