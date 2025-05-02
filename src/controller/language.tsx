import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Defined supported languages
export const LANGUAGES = {
  EN: 'en',
  DA: 'da',
  DE: 'de',
  IT: 'it'
} as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: LANGUAGES.EN,
  setLanguage: () => {}
});


export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('appLanguage') as Language;
      return savedLanguage in LANGUAGES ? savedLanguage : LANGUAGES.EN;
    }
    return LANGUAGES.EN;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLanguage', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);