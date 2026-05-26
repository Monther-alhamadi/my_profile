import { motion } from 'framer-motion'
import { Briefcase, Code2, Mail, MessageSquare, Star, Users } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface StatsSummaryProps {
  projectCount: number
  skillCount: number
  serviceCount: number
  experienceCount: number
  testimonialCount: number
  messageCount: number
  unreadCount: number
}

const cards = [
  { key: 'projects', icon: Briefcase, color: 'text-emerald-brand', bg: 'bg-emerald-brand/8' },
  { key: 'skills', icon: Code2, color: 'text-blue-500', bg: 'bg-blue-50' },
  { key: 'services', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
  { key: 'experience', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
  { key: 'testimonials', icon: MessageSquare, color: 'text-rose-500', bg: 'bg-rose-50' },
  { key: 'messages', icon: Mail, color: 'text-sky-500', bg: 'bg-sky-50' },
]

export default function StatsSummary({ projectCount, skillCount, serviceCount, experienceCount, testimonialCount, messageCount, unreadCount }: StatsSummaryProps) {
  const { language } = useLanguage()

  const values: Record<string, { value: number; label: string }> = {
    projects: { value: projectCount, label: language === 'ar' ? 'المشاريع' : 'Projects' },
    skills: { value: skillCount, label: language === 'ar' ? 'المهارات' : 'Skills' },
    services: { value: serviceCount, label: language === 'ar' ? 'الخدمات' : 'Services' },
    experience: { value: experienceCount, label: language === 'ar' ? 'الخبرات' : 'Experience' },
    testimonials: { value: testimonialCount, label: language === 'ar' ? 'الآراء' : 'Testimonials' },
    messages: { value: messageCount, label: language === 'ar' ? 'الرسائل' : 'Messages', extra: unreadCount > 0 ? `${unreadCount} ${language === 'ar' ? 'غير مقروء' : 'unread'}` : undefined },
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, i) => {
        const v = values[card.key]
        const Icon = card.icon
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="bg-white border border-border/60 rounded-sm p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 ${card.bg} rounded-sm flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-obsidian">{v.value}</div>
            <div className="text-xs text-muted-foreground font-mono mt-0.5">
              {v.label}
              {v.extra && <span className="ml-2 text-emerald-brand font-semibold">({v.extra})</span>}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
