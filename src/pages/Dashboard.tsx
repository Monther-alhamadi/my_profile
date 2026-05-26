import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, Briefcase, Code2, Star, Users, Mail, LogOut, CheckCircle2, Eye } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { usePortfolio } from '@/hooks/usePortfolio'
import { fetchMessages, markMessageRead } from '@/services/portfolio-api'
import type { ContactMessage } from '@/lib'

export default function Dashboard() {
  const { language } = useLanguage()
  const { user, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const { projects, skills, experience, stats, testimonials } = usePortfolio()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [messagesLoading, setMessagesLoading] = useState(true)
  const [messagesError, setMessagesError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/dashboard/login')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      setMessagesError(null)
      fetchMessages()
        .then(setMessages)
        .catch(err => {
          console.error(err)
          setMessagesError(err instanceof Error ? err.message : language === 'ar' ? 'فشل جلب الرسائل' : 'Failed to load messages')
        })
        .finally(() => setMessagesLoading(false))
    }
  }, [user])

  const handleMarkRead = async (id: string, isRead: boolean) => {
    try {
      await markMessageRead(id, isRead)
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: isRead } : m))
    } catch (err) {
      console.error('Failed to mark message:', err)
    }
  }

  if (authLoading) {
    return (
      <div className="section-obsidian min-h-screen flex items-center justify-center">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="inline-block w-8 h-8 border-2 border-emerald-brand/30 border-t-emerald-brand rounded-full"
        />
      </div>
    )
  }

  if (!user) return null

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.is_read
    if (filter === 'read') return m.is_read
    return true
  })
  const unreadCount = messages.filter(m => !m.is_read).length
  const cards = [
    { icon: Briefcase, value: projects.length.toString(), label: language === 'ar' ? 'المشاريع' : 'Projects', color: 'text-blue-400' },
    { icon: Code2, value: skills.length.toString(), label: language === 'ar' ? 'المهارات' : 'Skills', color: 'text-emerald-brand' },
    { icon: Users, value: experience.length.toString(), label: language === 'ar' ? 'الخبرات' : 'Experience', color: 'text-purple-400' },
    { icon: Star, value: testimonials.length.toString(), label: language === 'ar' ? 'التوصيات' : 'Testimonials', color: 'text-amber-400' },
  ]

  return (
    <div className="section-obsidian min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-emerald-brand" />
              <h1 className="text-2xl font-bold text-ivory">
                {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
              </h1>
            </div>
            <p className="text-sm text-ivory/45 font-mono">
              {language === 'ar' ? 'مرحباً، ' : 'Welcome, '}{user.email}
            </p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-ivory/50 hover:text-red-400 transition-colors font-mono"
          >
            <LogOut className="w-4 h-4" />
            {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
          </button>
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="border border-ivory/10 rounded-sm p-6 bg-obsidian/50"
              >
                <Icon className={`w-8 h-8 ${card.color} mb-3 opacity-80`} />
                <div className="text-3xl font-bold text-ivory font-heading">{card.value}</div>
                <div className="text-xs text-ivory/45 mt-1">{card.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-emerald-brand" />
              <h2 className="text-xs font-mono font-semibold text-emerald-brand uppercase tracking-widest">
                {language === 'ar' ? 'رسائل الاتصال' : 'Contact Messages'}
              </h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-mono font-semibold">
                  {unreadCount} {language === 'ar' ? 'غير مقروءة' : 'unread'}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {(['all', 'unread', 'read'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-[11px] font-mono rounded-sm transition-colors ${
                    filter === f
                      ? 'bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/30'
                      : 'text-ivory/40 border border-transparent hover:text-ivory/60'
                  }`}
                >
                  {f === 'all' ? (language === 'ar' ? 'الكل' : 'All')
                    : f === 'unread' ? (language === 'ar' ? 'غير مقروءة' : 'Unread')
                    : (language === 'ar' ? 'مقروءة' : 'Read')}
                </button>
              ))}
            </div>
          </div>

          {messagesError && (
            <div className="border border-red-500/20 bg-red-500/5 rounded-sm p-4 mb-4">
              <p className="text-red-400 text-sm font-mono">{messagesError}</p>
            </div>
          )}

          {messagesLoading ? (
            <div className="border border-ivory/10 rounded-sm p-12 text-center">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block w-6 h-6 border-2 border-emerald-brand/30 border-t-emerald-brand rounded-full"
              />
            </div>
          ) : messages.length === 0 && !messagesError ? (
            <div className="border border-ivory/10 rounded-sm p-12 text-center">
              <p className="text-ivory/30 text-sm font-mono">
                {language === 'ar' ? 'لا توجد رسائل بعد' : 'No messages yet'}
              </p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="border border-ivory/10 rounded-sm p-12 text-center">
              <p className="text-ivory/30 text-sm font-mono">
                {language === 'ar' ? 'لا توجد رسائل في هذا التصنيف' : 'No messages in this filter'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMessages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`border rounded-sm transition-colors ${
                    msg.is_read
                      ? 'border-ivory/5 bg-obsidian/30'
                      : 'border-emerald-brand/20 bg-emerald-brand/5'
                  }`}
                >
                  <button
                    onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                    className="w-full text-left p-5 flex items-start justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-sm font-semibold ${msg.is_read ? 'text-ivory/50' : 'text-ivory'}`}>
                          {msg.name}
                        </span>
                        {!msg.is_read && <span className="w-2 h-2 rounded-full bg-emerald-brand flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-ivory/35 font-mono">{msg.email}</p>
                      <p className={`text-sm mt-2 truncate ${msg.is_read ? 'text-ivory/35' : 'text-ivory/55'}`}>
                        {msg.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[10px] text-ivory/25 font-mono whitespace-nowrap">
                        {new Date(msg.created_at).toLocaleDateString(language === 'ar' ? 'ar' : 'en-US', {
                          month: 'short', day: 'numeric'
                        })}
                      </span>
                    </div>
                  </button>

                  {expandedId === msg.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t border-ivory/5 px-5 py-4"
                    >
                      <p className="text-sm text-ivory/60 leading-relaxed mb-4 whitespace-pre-wrap">
                        {msg.message}
                      </p>
                      <div className="flex items-center gap-4">
                        {msg.message_type && (
                          <span className="text-[10px] font-mono text-ivory/30 bg-ivory/5 px-2 py-1 rounded-sm">
                            {msg.message_type}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMarkRead(msg.id, !msg.is_read)
                          }}
                          className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${
                            msg.is_read
                              ? 'text-ivory/30 hover:text-ivory/50'
                              : 'text-emerald-brand hover:text-emerald-bright'
                          }`}
                        >
                          {msg.is_read ? <Eye className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          {msg.is_read
                            ? (language === 'ar' ? 'تحديث كغير مقروء' : 'Mark as unread')
                            : (language === 'ar' ? 'تحديد كمقروء' : 'Mark as read')
                          }
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Stats from Supabase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border border-ivory/10 rounded-sm p-8 mt-8"
        >
          <h2 className="text-xs font-mono font-semibold text-emerald-brand uppercase tracking-widest mb-6">
            {language === 'ar' ? 'الإحصائيات' : 'Statistics'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(stat => (
              <div key={stat.id} className="text-center">
                <div className="text-2xl font-bold text-ivory">
                  {stat.value}<span className="text-emerald-brand">{stat.suffix}</span>
                </div>
                <div className="text-xs text-ivory/45 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
