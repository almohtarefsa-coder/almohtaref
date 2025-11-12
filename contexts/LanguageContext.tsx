'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: { returnObjects?: boolean }) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Import translations
import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';

const translations = {
  en: enTranslations,
  ar: arTranslations,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Get language from localStorage or default to 'ar'
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage === 'en' || savedLanguage === 'ar') {
        setLanguageState(savedLanguage);
      }
    }
    setIsHydrated(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      // Update HTML lang attribute
      document.documentElement.lang = lang;
      // Update HTML dir attribute for RTL support
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  };

  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language, isHydrated]);

  const t = (key: string, options?: { returnObjects?: boolean }): any => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in value) {
            value = value[k2];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }
    
    // If returnObjects is true and value is an object/array, return it as-is
    if (options?.returnObjects && (typeof value === 'object' && value !== null)) {
      return value;
    }
    
    return value !== undefined ? value : key;
  };

  // Always provide context, even during hydration
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

