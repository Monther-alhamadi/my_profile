import { motion } from 'framer-motion'
import {
  LayoutDashboard, Mail, FolderKanban, Wrench, Briefcase,
  FileText, BarChart3, Star, User, LogOut,
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export type TabId = 'overview' | 'messages' | 'projects' | 'skills' | 'services'
  | 'experience' | 'stats' | 'testimonials' | 'profile'

interface SidebarTab {
  id: TabId
  icon: typeof LayoutDashboard
  label: string
  badge?: number
}

interface SidebarProps {
  active: TabId
  onSelect: (tab: TabId) => void
  unreadCount?: number
  onSignOut: () => void
}

export default function Sidebar({ active, onSelect, unreadCount = 0, onSignOut }: SidebarProps) {
  const { language } = useLanguage()

  const tabs: SidebarTab[] = [
    { id: 'overview', icon: LayoutDashboard, label: language === 'ar' ? 'نظرة عامة' : 'Overview' },
    { id: 'messages', icon: Mail, label: language === 'ar' ? 'الرسائل' : 'Messages', badge: unreadCount },
    { id: 'projects', icon: FolderKanban, label: language === 'ar' ? 'المشاريع' : 'Projects' },
    { id: 'skills', icon: Wrench, label: language === 'ar' ? 'المهارات' : 'Skills' },
    { id: 'services', icon: Briefcase, label: language === 'ar' ? 'الخدمات' : 'Services' },
    { id: 'experience', icon: FileText, label: language === 'ar' ? 'الخبرات' : 'Experience' },
    { id: 'stats', icon: BarChart3, label: language === 'ar' ? 'الإحصائيات' : 'Stats' },
    { id: 'testimonials', icon: Star, label: language === 'ar' ? 'الآراء' : 'Testimonials' },
    { id: 'profile', icon: User, label: language === 'ar' ? 'الملف الشخصي' : 'Profile' },
  ]

  return (
    <aside className="w-56 lg:w-60 flex-shrink-0 bg-white border-r border-border/60 flex flex-col">
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-obsidian rounded-sm flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-ivory" />
          </div>
          <span className="text-sm font-bold text-obsidian">
            {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
          </span>
        </div>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative ${
                isActive
                  ? 'text-emerald-brand bg-emerald-brand/5 font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-brand rounded-r"
                />
              )}
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-left flex-1">{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="text-[10px] font-mono font-bold text-white bg-emerald-brand px-1.5 py-0.5 rounded-full leading-none">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="p-3 border-t border-border/40">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-muted-foreground hover:text-red-500 rounded-sm hover:bg-red-50 transition-colors font-mono"
        >
          <LogOut className="w-3.5 h-3.5" />
          {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
        </button>
      </div>
    </aside>
  )
}
