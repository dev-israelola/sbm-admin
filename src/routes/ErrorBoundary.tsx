import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info?.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.reset);
      return (
        <div className="card p-6 max-w-xl mx-auto my-12 text-center">
          <span className="inline-grid place-items-center h-9 w-9 rounded-full bg-danger/10 text-danger mb-3">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <h2 className="font-display text-lg text-ink">Something went wrong loading this page.</h2>
          <p className="text-[12px] text-ink-muted mt-1 leading-relaxed">
            {this.state.error.message}
          </p>
          <button
            type="button"
            onClick={this.reset}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 h-9 text-sm hover:bg-surface-muted"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
