import { Component, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
    import('@sentry/react').then(m => {
      if (m?.captureException) m.captureException(error, { extra: { componentStack: info.componentStack } })
    }).catch(() => {})
  }

  render() {
    if (this.state.hasError) {
      const isArabic = document.documentElement.dir === 'rtl'
      return (
        <div className="section-obsidian min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-ivory mb-3">
              {isArabic ? 'حدث خطأ ما' : 'Something went wrong'}
            </h1>
            <p className="text-ivory/52 text-sm mb-8 font-mono">
              {this.state.error?.message || (isArabic ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred')}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-emerald px-5 py-2.5 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                {isArabic ? 'إعادة تحميل' : 'Reload'}
              </button>
              <Link to="/" className="btn-ghost px-5 py-2.5 text-sm text-ivory/70 hover:text-ivory">
                {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
              </Link>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
