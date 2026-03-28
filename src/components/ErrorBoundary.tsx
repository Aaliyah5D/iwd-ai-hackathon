import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'Something went wrong. Please try again later.';
      
      try {
        // Check if it's a Firestore JSON error
        const parsed = JSON.parse(this.state.error?.message || '');
        if (parsed.error) {
          errorMessage = `Firestore Error: ${parsed.error}`;
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
          <div className="w-20 h-20 bg-coral rounded-full flex items-center justify-center text-red-500 mb-6">
            <AlertCircle size={48} />
          </div>
          <h1 className="text-2xl font-black text-text mb-2">Oops!</h1>
          <p className="text-muted mb-8 max-w-xs">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full max-w-xs"
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
