import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import LemmaAuthGate from './components/LemmaAuthGate.jsx'

const queryClient = new QueryClient()

function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
      <div className="text-center">
        <div className="text-2xl mb-3">✨</div>
        <p className="text-sm text-[var(--text-muted)]">Connecting to Lemma…</p>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LemmaAuthGate loadingFallback={<AuthLoading />}>
          <App />
        </LemmaAuthGate>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
