import React, { ErrorInfo, ReactNode, ReactElement } from 'react';
import { ErrorFallback } from './ErrorFallback';

interface Props {
  children?: ReactNode;
  fallback?: ReactElement;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
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
  }

  handleReset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (React.isValidElement(this.props.fallback)) {
             return React.cloneElement(this.props.fallback as ReactElement<any>, {
                error: this.state.error,
                resetErrorBoundary: this.handleReset,
             });
        }
        return this.props.fallback;
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