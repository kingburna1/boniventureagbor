'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Locale, TranslationDictionary } from './types';
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, LOCALES } from './config';
import { en } from './locales/en';
import { fr } from './locales/fr';

const DICTIONARIES: Record<Locale, TranslationDictionary> = {
  en,
  fr,
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  dictionary: TranslationDictionary;
  t: <T = string>(path: (dict: TranslationDictionary) => T) => T;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
      if (savedLocale && LOCALES.includes(savedLocale)) {
        setLocaleState(savedLocale);
      }
    } catch {
      // Ignore localStorage access errors
    } finally {
      setMounted(true);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    if (!LOCALES.includes(newLocale)) return;
    setLocaleState(newLocale);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'fr' : 'en');
  }, [locale, setLocale]);

  const dictionary = DICTIONARIES[locale] || DICTIONARIES[DEFAULT_LOCALE];

  const t = useCallback(
    <T = string>(selector: (dict: TranslationDictionary) => T): T => {
      try {
        return selector(dictionary);
      } catch {
        return selector(DICTIONARIES[DEFAULT_LOCALE]);
      }
    },
    [dictionary]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, dictionary, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      toggleLocale: () => {},
      dictionary: DICTIONARIES[DEFAULT_LOCALE],
      t: <T = string>(selector: (dict: TranslationDictionary) => T): T => selector(DICTIONARIES[DEFAULT_LOCALE]),
    };
  }
  return context;
};

export const useLanguage = useTranslation;
