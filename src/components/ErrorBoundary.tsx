import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; toolName?: string; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-lg font-bold text-surface-800 dark:text-surface-100 mb-2">Something went wrong</h2>
          <p className="text-sm text-surface-500 mb-6">
            {this.props.toolName ? `The ${this.props.toolName} tool` : 'This tool'} encountered an unexpected error.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
