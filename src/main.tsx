import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const sentryDsn = import.meta.env.VITE_SENTRY_DSN
if (sentryDsn) {
  import('./services/sentry')
}

createRoot(document.getElementById("root")!).render(<App />);
