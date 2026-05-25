import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, LogIn, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'

export default function DashboardLogin() {
  const { language } = useLanguage()
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signIn(email, password)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="section-obsidian min-h-screen flex items-center justify-center py-20">
      <div className="max-w-md mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-ivory/50 hover:text-emerald-brand transition-colors mb-10 font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-emerald-brand" />
            <h1 className="text-2xl font-bold text-ivory">
              {language === 'ar' ? 'تسجيل الدخول' : 'Dashboard Login'}
            </h1>
          </div>
          <p className="text-sm text-ivory/45 mb-8 font-mono">
            {language === 'ar' ? 'الرجاء تسجيل الدخول للوصول إلى لوحة التحكم' : 'Sign in to access the dashboard'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono font-semibold text-ivory/35 uppercase tracking-widest mb-2">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 rounded-sm border border-ivory/15 bg-obsidian text-ivory placeholder:text-ivory/30 focus:border-emerald-brand focus:outline-none transition-colors text-sm"
                placeholder="monther@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-ivory/35 uppercase tracking-widest mb-2">
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full h-12 px-4 rounded-sm border border-ivory/15 bg-obsidian text-ivory placeholder:text-ivory/30 focus:border-emerald-brand focus:outline-none transition-colors text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm font-mono bg-red-500/10 border border-red-500/20 rounded-sm p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-emerald w-full justify-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  {language === 'ar' ? 'جاري تسجيل الدخول...' : 'Signing in...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                </span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
