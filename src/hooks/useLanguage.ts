import { useState, useEffect } from 'react';
import { type Language } from '@/lib/index';

const STORAGE_KEY = 'preferred-language';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored === 'ar' || stored === 'en') ? stored : 'en';
  });

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const isArabic = language === 'ar';
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  return {
    language,
    toggleLanguage,
    isArabic,
    direction,
  };
}
