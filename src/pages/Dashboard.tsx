import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { usePortfolio } from '@/hooks/usePortfolio'
import { fetchMessages } from '@/services/portfolio-api'
import type { ContactMessage } from '@/lib'
import { useNoIndex } from '@/hooks/useNoIndex'

import Sidebar, { type TabId } from '@/components/dashboard/Sidebar'
import StatsSummary from '@/components/dashboard/StatsSummary'
import MessagesTab from '@/components/dashboard/MessagesTab'
import ProjectsTab from '@/components/dashboard/ProjectsTab'
import SkillsTab from '@/components/dashboard/SkillsTab'
import ServicesTab from '@/components/dashboard/ServicesTab'
import ExperienceTab from '@/components/dashboard/ExperienceTab'
import StatsTab from '@/components/dashboard/StatsTab'
import TestimonialsTab from '@/components/dashboard/TestimonialsTab'
import ProfileTab from '@/components/dashboard/ProfileTab'

export default function Dashboard() {
  useNoIndex()
  const { language } = useLanguage()
  const { user, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const { projects, skills, services, experience, testimonials } = usePortfolio()
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!authLoading && !user) navigate('/dashboard/login')
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (!user) return
    fetchMessages()
      .then(data => { setMessages(data); setUnreadCount(data.filter(m => !m.is_read).length) })
      .catch(() => {})
  }, [user])

  if (authLoading) {
    return (
      <div className="section-ivory min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-emerald-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-obsidian">{language === 'ar' ? 'نظرة عامة' : 'Overview'}</h2>
            </div>
            <StatsSummary
              projectCount={projects.length}
              skillCount={skills.length}
              serviceCount={services.length}
              experienceCount={experience.length}
              testimonialCount={testimonials.length}
              messageCount={messages.length}
              unreadCount={unreadCount}
            />
          </motion.div>
        )
      case 'messages': return <motion.div key="messages" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><MessagesTab /></motion.div>
      case 'projects': return <motion.div key="projects" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><ProjectsTab /></motion.div>
      case 'skills': return <motion.div key="skills" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><SkillsTab /></motion.div>
      case 'services': return <motion.div key="services" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><ServicesTab /></motion.div>
      case 'experience': return <motion.div key="experience" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><ExperienceTab /></motion.div>
      case 'stats': return <motion.div key="stats" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><StatsTab /></motion.div>
      case 'testimonials': return <motion.div key="testimonials" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><TestimonialsTab /></motion.div>
      case 'profile': return <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><ProfileTab /></motion.div>
    }
  }

  return (
    <div className="section-ivory min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-border/60 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-obsidian rounded-sm flex items-center justify-center lg:hidden">
            <span className="text-ivory font-mono font-bold text-xs">D</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground/50">
            {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono hidden sm:block">{user.email}</span>
          <button
            onClick={signOut}
            className="text-[10px] font-mono text-red-400 hover:text-red-500 px-2 py-1 border border-red-200 rounded-sm hover:bg-red-50 transition-colors"
          >
            {language === 'ar' ? 'خروج' : 'Sign Out'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — hidden on small screens via mobile toggle */}
        <div className="hidden lg:block">
          <Sidebar active={activeTab} onSelect={setActiveTab} unreadCount={unreadCount} onSignOut={signOut} />
        </div>

        {/* Mobile tabs */}
        <div className="lg:hidden w-full">
          <div className="flex overflow-x-auto gap-1 px-4 py-3 border-b border-border/40 bg-white">
            {(['overview', 'messages', 'projects', 'skills', 'services', 'experience', 'stats', 'testimonials', 'profile'] as TabId[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] font-mono whitespace-nowrap px-2.5 py-1.5 rounded-sm transition-colors ${
                  activeTab === tab ? 'bg-emerald-brand/10 text-emerald-brand font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'overview' ? (language === 'ar' ? 'نظرة' : 'Overview')
                  : tab === 'messages' ? (language === 'ar' ? 'رسائل' : 'Messages')
                  : tab === 'projects' ? (language === 'ar' ? 'مشاريع' : 'Projects')
                  : tab === 'skills' ? (language === 'ar' ? 'مهارات' : 'Skills')
                  : tab === 'services' ? (language === 'ar' ? 'خدمات' : 'Services')
                  : tab === 'experience' ? (language === 'ar' ? 'خبرات' : 'Experience')
                  : tab === 'stats' ? (language === 'ar' ? 'إحصائيات' : 'Stats')
                  : tab === 'testimonials' ? (language === 'ar' ? 'آراء' : 'Testimonials')
                  : (language === 'ar' ? 'بروفايل' : 'Profile')}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {renderTab()}
        </div>
      </div>
    </div>
  )
}
