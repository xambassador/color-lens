import { Component, type ComponentChildren, type ErrorInfo } from "preact";

interface ErrorBoundaryProps {
  children: ComponentChildren;
  label?: string;
  hint?: ComponentChildren;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[color-lens] ${this.props.label ?? "app"} crashed:`, error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return <ErrorFallback label={this.props.label} hint={this.props.hint} error={error} onReset={this.reset} />;
  }
}

function ErrorFallback({
  label,
  hint,
  error,
  onReset
}: {
  label?: string;
  hint?: ComponentChildren;
  error: Error;
  onReset: () => void;
}) {
  return (
    <div class="error-boundary">
      <div class="error-boundary-icon">!</div>
      <div class="error-boundary-title">{label ? `${label} crashed` : "Something went wrong"}</div>
      <div class="error-boundary-message">{error.message || "Unknown error"}</div>
      {hint && <div class="error-boundary-hint">{hint}</div>}
      <button class="error-boundary-retry" onClick={onReset}>
        Try again
      </button>
    </div>
  );
}
