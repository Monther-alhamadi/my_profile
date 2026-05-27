import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Sparkles, MessageSquare } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { askAssistant } from '@/services/gemini-service'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

const suggestions = [
  { key: 'skills', en: 'What are his skills?', ar: 'ما هي مهاراته؟' },
  { key: 'experience', en: 'Tell me about his experience', ar: 'حدثني عن خبراته' },
  { key: 'projects', en: 'What projects has he done?', ar: 'ما هي مشاريعه؟' },
  { key: 'contact', en: 'How to contact him?', ar: 'كيف أتواصل معه؟' },
]

export default function AiChatbot() {
  const { language, isArabic } = useLanguage()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', text: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const reply = await askAssistant(text.trim(), language)
      setMessages(prev => [...prev, { role: 'assistant', text: reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: language === 'ar'
          ? 'عذراً، حدث خطأ. حاول مرة أخرى.'
          : 'Sorry, something went wrong. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      {/* ── Floating button ── */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {/* Glow ring */}
        <motion.div
          className="absolute -inset-3 rounded-full bg-emerald-brand/20 blur-xl pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Tooltip */}
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`mb-3 px-3.5 py-2 bg-foreground text-background text-xs font-medium rounded-lg shadow-lg whitespace-nowrap relative ${isArabic ? 'self-start ml-2' : 'self-end mr-2'}`}
            >
              {isArabic ? 'تحدث مع المساعد الذكي' : 'Chat with AI Assistant'}
              <div className={`absolute -bottom-1 w-2 h-2 bg-foreground rotate-45 ${isArabic ? 'left-5' : 'right-5'}`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button */}
        <motion.button
          onClick={() => setOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: [0, -6, 0],
          }}
          transition={{
            scale: { delay: 1.5, type: 'spring', stiffness: 260, damping: 20 },
            opacity: { delay: 1.5 },
            y: { delay: 2.5, duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          whileHover={{ scale: 1.1, y: -8 }}
          whileTap={{ scale: 0.92 }}
          aria-label={isArabic ? 'فتح المساعد' : 'Open AI Assistant'}
          className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full shadow-xl shadow-emerald-brand/40 flex items-center justify-center transition-colors"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Bot className="w-7 h-7" />
          </motion.div>
        </motion.button>
      </div>

      {/* ── Chat drawer ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbot"
            initial={{ opacity: 0, y: 80, scale: 0.92, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 60, scale: 0.95, x: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="fixed bottom-24 right-6 z-40 w-[380px] max-w-[calc(100vw-2rem)] bg-background/90 backdrop-blur-xl border border-border/60 rounded-xl shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: '560px' }}
          >
            {/* ── Header ── */}
            <div className="relative flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-white rounded-full" />
                <div className="absolute -bottom-8 -left-4 w-16 h-16 bg-white rounded-full" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-semibold font-heading block leading-tight">
                    {isArabic ? 'المساعد الذكي' : 'AI Assistant'}
                  </span>
                  <span className="text-[10px] text-white/70 font-mono">
                    {isArabic ? 'مدعوم بالذكاء الاصطناعي' : 'Powered by Gemini AI'}
                  </span>
                </div>
              </div>
              <motion.button
                onClick={() => setOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isArabic ? 'إغلاق' : 'Close'}
                className="relative z-10 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4" style={{ minHeight: 0 }}>
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center pt-8 pb-6"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-brand/10 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-7 h-7 text-emerald-brand" />
                  </div>
                  <p className="text-sm text-foreground font-medium mb-1">
                    {isArabic ? 'مرحباً! كيف يمكنني مساعدتك؟' : 'Hi there! How can I help?'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-5">
                    {isArabic
                      ? 'اسألني عن المهارات، الخبرات، المشاريع أو التواصل'
                      : 'Ask about skills, experience, projects, or contact'}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map((s, i) => (
                      <motion.button
                        key={s.key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 * i }}
                        onClick={() => send(s[isArabic ? 'ar' : 'en'])}
                        className="text-xs px-3.5 py-2 rounded-full border border-border bg-muted/60 hover:bg-emerald-brand/10 hover:border-emerald-brand/30 text-muted-foreground hover:text-emerald-brand transition-all"
                      >
                        {s[isArabic ? 'ar' : 'en']}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-foreground/60">
                        {isArabic ? 'أ' : 'Y'}
                      </span>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl rounded-br-md shadow-sm'
                        : 'bg-muted/80 text-foreground rounded-2xl rounded-bl-md border border-border/40'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-muted/80 border border-border/40 rounded-2xl rounded-bl-md px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <motion.span className="w-2 h-2 bg-emerald-brand/60 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                      <motion.span className="w-2 h-2 bg-emerald-brand/60 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} />
                      <motion.span className="w-2 h-2 bg-emerald-brand/60 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* ── Input ── */}
            <form onSubmit={handleSubmit} className="border-t border-border/60 px-4 py-3 bg-background/50">
              <div className="flex items-center gap-2 bg-muted/60 border border-border/50 rounded-xl px-3 py-1 focus-within:border-emerald-brand/40 focus-within:ring-1 focus-within:ring-emerald-brand/20 transition-all">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={isArabic ? 'اكتب سؤالك...' : 'Type your question...'}
                  disabled={loading}
                  className="flex-1 py-2 text-sm bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50"
                />
                <motion.button
                  type="submit"
                  disabled={loading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-8 h-8 rounded-lg bg-emerald-brand text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
