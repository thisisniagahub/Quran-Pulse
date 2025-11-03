import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';

interface Props {
  children: ReactNode;
  // FIX: Explicitly type the ReactElement generic to `any` to avoid type inference issues
  // with React.cloneElement in some TypeScript configurations. This resolves the overload error.
  fallback?: React.ReactElement<any>;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service like Sentry
    console.error("Uncaught error:", error, errorInfo);
    // TODO: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return React.cloneElement(this.props.fallback, {
          error: this.state.error,
          resetErrorBoundary: this.handleReset,
        });
      }
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}