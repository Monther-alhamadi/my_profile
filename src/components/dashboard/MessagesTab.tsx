import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Eye, CheckCircle2, Trash2 } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { fetchMessages, markMessageRead, deleteMessage } from '@/services/portfolio-api'
import type { ContactMessage } from '@/lib'
import { toast } from 'sonner'

const filterTabs = ['all', 'unread', 'read'] as const
type Filter = typeof filterTabs[number]

export default function MessagesTab() {
  const { language } = useLanguage()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')

  const load = () => {
    setLoading(true)
    fetchMessages()
      .then(setMessages)
      .catch(() => toast.error(language === 'ar' ? 'فشل تحميل الرسائل' : 'Failed to load messages'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleMarkRead = async (id: string, isRead: boolean) => {
    try {
      await markMessageRead(id, isRead)
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: isRead } : m))
    } catch { toast.error(language === 'ar' ? 'فشل التحديث' : 'Update failed') }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id)
      setMessages(prev => prev.filter(m => m.id !== id))
      toast.success(language === 'ar' ? 'تم الحذف' : 'Deleted')
    } catch { toast.error(language === 'ar' ? 'فشل الحذف' : 'Delete failed') }
  }

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.is_read
    if (filter === 'read') return m.is_read
    return true
  })

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-emerald-brand" />
          <h2 className="text-lg font-bold text-obsidian">
            {language === 'ar' ? 'الرسائل' : 'Messages'}
          </h2>
          {unreadCount > 0 && (
            <span className="text-[10px] font-mono font-bold text-white bg-emerald-brand px-1.5 py-0.5 rounded-full leading-none ml-1">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 border-b border-border">
        {filterTabs.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pb-3 px-3 text-xs font-mono font-semibold uppercase tracking-wider transition-colors relative ${
              filter === f ? 'text-emerald-brand' : 'text-muted-foreground/60 hover:text-foreground'
            }`}
          >
            {f === 'all' ? (language === 'ar' ? 'الكل' : 'All') : f === 'unread' ? (language === 'ar' ? 'غير مقروء' : 'Unread') : (language === 'ar' ? 'مقروء' : 'Read')}
            {filter === f && (
              <motion.div layoutId="msg-filter" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-brand rounded-t" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground font-mono">
          {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Mail className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-mono">
            {language === 'ar' ? 'لا توجد رسائل' : 'No messages'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(msg => (
            <motion.div
              key={msg.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-sm transition-colors ${
                !msg.is_read ? 'border-emerald-brand/20 bg-emerald-brand/3' : 'border-border/60'
              }`}
            >
              <button
                onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                className="w-full flex items-center gap-4 px-4 py-3 text-left"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${!msg.is_read ? 'bg-emerald-brand' : 'bg-transparent'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-medium truncate ${!msg.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {msg.name}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/50">
                      {msg.message_type ?? msg.subject ?? 'general'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/60 truncate">{msg.message}</p>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground/40 flex-shrink-0">
                  {new Date(msg.created_at).toLocaleDateString(language === 'ar' ? 'ar' : 'en', { day: 'numeric', month: 'short' })}
                </div>
              </button>

              {expandedId === msg.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-4 pb-4 border-t border-border/30"
                >
                  <div className="pt-3 space-y-2">
                    <div className="flex gap-4 text-xs text-muted-foreground font-mono">
                      <span><span className="text-foreground/50">{language === 'ar' ? 'البريد' : 'Email'}:</span> {msg.email}</span>
                      {msg.subject && (
                        <span><span className="text-foreground/50">{language === 'ar' ? 'الموضوع' : 'Subject'}:</span> {msg.subject}</span>
                      )}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleMarkRead(msg.id, !msg.is_read)}
                        className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-emerald-brand transition-colors py-1 px-2 rounded-sm hover:bg-muted"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {msg.is_read
                          ? (language === 'ar' ? 'تحديد كغير مقروء' : 'Mark unread')
                          : (language === 'ar' ? 'تحديد كمقروء' : 'Mark read')}
                      </button>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-red-500 transition-colors py-1 px-2 rounded-sm hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                        {language === 'ar' ? 'حذف' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
