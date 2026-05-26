import * as Sentry from '@sentry/react'

const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined

if (dsn) {
  Sentry.init({
    dsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
}

export { Sentry }
export const isSentryEnabled = !!dsn
