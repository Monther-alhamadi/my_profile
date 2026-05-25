import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface Message {
  role: 'assistant' | 'user'
  content: string
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hello! I'm Monther's AI assistant. I can tell you about his skills, experience, projects, and how he can help with your software needs. What would you like to know?"
}

const INITIAL_MESSAGE_AR: Message = {
  role: 'assistant',
  content: 'مرحباً! أنا المساعد الذكي لمنذر. يمكنني إخبارك عن مهاراته، خبراته، مشاريعه، وكيف يمكنه مساعدتك في احتياجاتك البرمجية. ماذا تريد أن تعرف؟'
}

const RESPONSES_EN: Record<string, string> = {
  'hello': "Hi there! Monther is a Software Engineer with 4+ years of experience in full-stack development and AI integration. How can I help you?",
  'hi': "Hi there! Monther is a Software Engineer with 4+ years of experience in full-stack development and AI integration. How can I help you?",
  'skills': "Monther's core skills include: React, Next.js, TypeScript, Node.js, Python, Flutter, PostgreSQL, Docker, and AI/ML integration. He specializes in building scalable, production-ready systems.",
  'experience': "Monther has 4+ years of experience. He currently works as a Senior Full-Stack Engineer (Freelance/Contract) since 2022, and previously worked at a Tech Startup (2020-2022) building core product features for SaaS platforms.",
  'projects': "Monther has delivered 20+ projects including: Cachear POS (enterprise mobile POS), HeicConverter (privacy-first image conversion), University Scheduler (AI-powered), NextVendors (e-commerce platform), Kayany7 (business management), and AI Tools Hub (orchestration platform).",
  'contact': "You can reach Monther at montheralhamadi7@gmail.com. He's available for freelance projects and remote work globally.",
  'default': "I'm not sure about that. Feel free to ask about Monther's skills, experience, projects, or how to contact him!"
}

const RESPONSES_AR: Record<string, string> = {
  'مرحبا': 'مرحباً! منذر هو مهندس برمجيات مع أكثر من 4 سنوات من الخبرة في التطوير الشامل ودمج الذكاء الاصطناعي. كيف يمكنني مساعدتك؟',
  'اهلا': 'مرحباً! منذر هو مهندس برمجيات مع أكثر من 4 سنوات من الخبرة في التطوير الشامل ودمج الذكاء الاصطناعي. كيف يمكنني مساعدتك؟',
  'المهارات': 'تشمل مهارات منذر الأساسية: React، Next.js، TypeScript، Node.js، Python، Flutter، PostgreSQL، Docker، ودمج الذكاء الاصطناعي. يتخصص في بناء أنظمة قابلة للتوسع وجاهزة للإنتاج.',
  'الخبرات': 'لدى منذر أكثر من 4 سنوات من الخبرة. يعمل حالياً كمهندس برمجيات أول (عمل حر) منذ 2022، وعمل سابقاً في شركة تقنية ناشئة (2020-2022) لبناء ميزات المنتج الأساسية لمنصات SaaS.',
  'المشاريع': 'قدم منذر أكثر من 20 مشروعاً منها: Cachear POS (نظام نقاط بيع مؤسسي)، HeicConverter (تحويل الصور مع خصوصية)، University Scheduler (جدولة ذكية)، NextVendors (تجارة إلكترونية)، Kayany7 (إدارة أعمال)، و AI Tools Hub.',
  'تواصل': 'يمكنك التواصل مع منذر على montheralhamadi7@gmail.com. وهو متاح لمشاريع العمل الحر والعمل عن بعد عالمياً.',
  'default': 'لست متأكداً من ذلك. اسأل عن مهارات منذر، خبراته، مشاريعه، أو كيفية التواصل معه!'
}

function getResponse(input: string, lang: string): string {
  const responses = lang === 'ar' ? RESPONSES_AR : RESPONSES_EN
  const lower = input.toLowerCase().trim()
  for (const [key, value] of Object.entries(responses)) {
    if (lower.includes(key)) return value
  }
  return responses['default']
}

export default function Assistant() {
  const { language } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([language === 'ar' ? INITIAL_MESSAGE_AR : INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = getResponse(input, language)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 800)
  }

  return (
    <div className="section-ivory min-h-screen py-20 flex flex-col">
      <div className="max-w-3xl mx-auto px-6 lg:px-12 w-full flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <Sparkles className="w-6 h-6 text-emerald-brand" />
          <h1 className="text-2xl font-bold text-obsidian">
            {language === 'ar' ? 'المساعد الذكي' : 'AI Assistant'}
          </h1>
        </motion.div>
        <p className="text-sm text-muted-foreground mb-8 font-mono">
          {language === 'ar'
            ? 'اسأل عن مهارات منذر، خبراته، ومشاريعه'
            : 'Ask about Monther\'s skills, experience, and projects'}
        </p>

        {/* Chat area */}
        <div className="flex-1 bg-white/50 border border-border rounded-sm p-6 mb-4 overflow-y-auto max-h-[60vh] space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-emerald-brand/10 text-emerald-brand'
                    : 'bg-obsidian text-ivory'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] p-3 rounded-sm text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-brand text-white'
                    : 'bg-obsidian/5 text-foreground border border-border/40'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-sm bg-obsidian flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-ivory" />
                </div>
                <div className="bg-obsidian/5 border border-border/40 rounded-sm p-3">
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="text-sm text-muted-foreground"
                  >
                    {language === 'ar' ? 'يكتب...' : 'Typing...'}
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={language === 'ar' ? 'اكتب سؤالك...' : 'Type your question...'}
            className="flex-1 h-12 px-4 rounded-sm border border-border bg-white text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-brand focus:outline-none transition-colors text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="btn-emerald px-6 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
