import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Globe, ArrowUpRight, Sun, Moon } from 'lucide-react';
import AiChatbot from './AiChatbot';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from 'next-themes';
import { translations, CONTACT_INFO } from '@/lib/data-static';

interface LayoutProps { children: React.ReactNode; }

export function Layout({ children }: LayoutProps) {
  const { language, toggleLanguage, isArabic } = useLanguage();
  const { theme, setTheme } = useTheme();
  const t = translations[language];
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const pageLinks = [
    { href: '/cv',   label: language === 'ar' ? 'السيرة الذاتية' : 'CV' },
    { href: '/links', label: language === 'ar' ? 'الروابط' : 'Links' },
    { href: '/dashboard', label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard' },
    { href: '/assistant', label: language === 'ar' ? 'المساعد' : 'Assistant' },
  ];

  const navLinks = [
    { href: '#about',     label: t.nav.about },
    { href: '#expertise', label: t.nav.expertise },
    { href: '#projects',  label: t.nav.projects },
    { href: '#services',  label: t.nav.services },
    { href: '#contact',   label: t.nav.contact },
  ];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isArabic ? 'rtl' : 'ltr'}>

      {/* ── Scroll progress bar ── */}
      <motion.div
        className="scroll-progress-bar"
        style={{ scaleX, width: '100%' }}
      />

      {/* ── Header ── */}
      <motion.header
        ref={headerRef}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-ivory/95 backdrop-blur-md border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              to="/"
              aria-label={language === 'ar' ? 'الرئيسية' : 'Home'}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 bg-obsidian flex items-center justify-center rounded-sm transition-colors group-hover:bg-emerald-brand">
                <span className="text-ivory font-mono font-bold text-sm leading-none">SE</span>
              </div>
              <span className={`hidden md:block text-sm font-medium transition-colors ${isScrolled ? 'text-foreground/70' : 'text-muted-foreground'}`}>
                {t.nav.brand}
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {isHome && navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                  className="emerald-link text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {pageLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-foreground/70 hover:text-emerald-brand transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="hidden md:flex items-center text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 border border-border rounded-sm hover:border-emerald-brand"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={toggleLanguage}
                aria-label={language === 'ar' ? 'تغيير اللغة إلى الإنجليزية' : 'Switch language to Arabic'}
                className="hidden md:flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 border border-border rounded-sm hover:border-emerald-brand"
              >
                <Globe className="w-3.5 h-3.5" />
                {isArabic ? 'EN' : 'AR'}
              </button>

              <button
                onClick={() => scrollTo('#contact')}
                aria-label={t.nav.letsTalk}
                className="hidden md:flex btn-emerald py-2.5 px-5 text-sm"
              >
                {t.nav.letsTalk}
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={language === 'ar' ? 'القائمة' : 'Menu'}
                className="md:hidden p-2 text-foreground rounded-sm hover:bg-muted transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile menu (Bottom Sheet) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.15}
              onDragEnd={(_e, info) => {
                if (info.offset.y > 80) setMobileOpen(false)
              }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/98 backdrop-blur-2xl border-t border-border rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              {/* Drag handle */}
              <div className={`mx-auto mt-2 w-10 h-1 rounded-full bg-muted-foreground/20 ${isArabic ? 'ml-auto mr-auto' : ''}`} />

              <nav className="px-6 py-5 pb-8">
                {isHome && navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                    className="flex items-center gap-3 text-base font-medium text-foreground/75 hover:text-foreground py-[13px] border-b border-border/40 transition-colors"
                  >
                    {link.label}
                  </motion.a>
                ))}
                {pageLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (isHome ? navLinks.length : 0 + i) * 0.04 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 text-base font-medium text-foreground/75 hover:text-emerald-brand py-[13px] border-b border-border/40 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="flex items-center gap-3 pt-5">
                  <button
                    onClick={() => { setMobileOpen(false); scrollTo('#contact') }}
                    aria-label={t.nav.letsTalk}
                    className="btn-emerald flex-1 justify-center py-[13px] text-sm"
                  >
                    {t.nav.letsTalk}
                  </button>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    className="flex items-center text-muted-foreground p-[13px] border border-border rounded-sm"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={toggleLanguage}
                    aria-label={language === 'ar' ? 'تغيير اللغة إلى الإنجليزية' : 'Switch language to Arabic'}
                    className="flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground p-[13px] border border-border rounded-sm"
                  >
                    <Globe className="w-4 h-4" />
                    {isArabic ? 'EN' : 'AR'}
                  </button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Page content ── */}
      <main className="pt-16">{children}</main>

      {/* ── Footer ── */}
      <footer className="bg-obsidian text-ivory">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid md:grid-cols-3 gap-12 mb-12">

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-brand flex items-center justify-center rounded-sm">
                  <span className="text-white font-mono font-bold text-sm">SE</span>
                </div>
                <span className="font-heading font-bold text-lg">{t.nav.brand}</span>
              </div>
              <p className="text-sm text-ivory/50 leading-relaxed max-w-xs">
                {isArabic
                  ? 'بناء أنظمة برمجية متقدمة تحل مشاكل حقيقية.'
                  : 'Building advanced software systems that solve real-world problems.'}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono font-semibold text-ivory/35 uppercase tracking-widest mb-5">
                {isArabic ? 'روابط سريعة' : 'Quick Links'}
              </h4>
              <ul className="space-y-2.5">
                {isHome && navLinks.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                      className="emerald-link text-sm text-ivory/55 hover:text-emerald-brand transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                {pageLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-ivory/55 hover:text-emerald-brand transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono font-semibold text-ivory/35 uppercase tracking-widest mb-5">
                {isArabic ? 'تواصل' : 'Connect'}
              </h4>
              <div className="flex gap-3 mb-4">
                <a href={CONTACT_INFO.github} target="_blank" rel="noopener noreferrer"
                   aria-label="GitHub" className="p-3 border border-ivory/15 rounded-sm hover:border-emerald-brand hover:text-emerald-brand transition-colors text-ivory/50">
                  <SiGithub className="w-5 h-5" />
                </a>
                <a href={CONTACT_INFO.linkedin} target="_blank" rel="noopener noreferrer"
                   aria-label="LinkedIn" className="p-3 border border-ivory/15 rounded-sm hover:border-emerald-brand hover:text-emerald-brand transition-colors text-ivory/50">
                  <SiLinkedin className="w-5 h-5" />
                </a>
              </div>
              <a href={`mailto:${CONTACT_INFO.email}`}
                 className="text-sm text-ivory/55 hover:text-emerald-brand transition-colors font-mono">
                {CONTACT_INFO.email}
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-ivory/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-ivory/30 font-mono">{t.footer.copyright}</p>
            <p className="text-xs text-ivory/30">{t.footer.builtWith}</p>
          </div>
        </div>
      </footer>

      {/* ── AI Assistant chatbot ── */}
      {location.pathname !== '/dashboard' && <AiChatbot />}
    </div>
  );
}
