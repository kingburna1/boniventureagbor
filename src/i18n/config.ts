import { Locale } from './types';

export const LOCALES: readonly Locale[] = ['en', 'fr'] as const;
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_STORAGE_KEY = 'ba_portfolio_locale';

export interface LocaleMeta {
  code: Locale;
  label: string;
  fullName: string;
}

export const LOCALE_CONFIG: Record<Locale, LocaleMeta> = {
  en: {
    code: 'en',
    label: 'EN',
    fullName: 'English',
  },
  fr: {
    code: 'fr',
    label: 'FR',
    fullName: 'Français',
  },
};
