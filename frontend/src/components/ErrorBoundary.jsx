import React from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
          <div className="saas-card max-w-md w-full p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
              <AlertTriangle className="text-red-500 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text)] mb-2">Something went wrong</h1>
            <p className="text-sm text-[var(--text-muted)] mb-8">
              We encountered an unexpected error while rendering this page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 font-bold"
            >
              <RefreshCcw size={16} />
              Reload Application
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 text-left w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 overflow-auto text-xs font-mono text-red-500/80">
                {this.state.error.toString()}
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
