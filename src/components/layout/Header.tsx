'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { NAV_ITEMS } from '@/data/navigationData';
import { PERSONAL_DATA } from '@/data/personalData';
import { useScrollspy } from '@/hooks/useScrollspy';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/i18n/context';
import { Navbar } from './Navbar';
import { Button } from '../ui/Button';
import Image from 'next/image';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageToggle } from '../ui/LanguageToggle';

const MobileMenu = dynamic(
  () => import('./MobileMenu').then((mod) => mod.MobileMenu),
  { ssr: false }
);

export interface HeaderProps {
  resumeUrl?: string;
  name?: string;
}

export const Header: React.FC<HeaderProps> = ({
  resumeUrl = PERSONAL_DATA.resumeUrl,
  name = PERSONAL_DATA.name,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useScrollspy(NAV_ITEMS.map((item) => item.id));
  const isScrolled = useHeaderScroll();
  const { dictionary } = useTranslation();

  // Create localized navigation items
  const localizedNavItems = NAV_ITEMS.map((item) => {
    let label = item.label;
    if (item.id === 'hero') label = dictionary.nav.home;
    else if (item.id === 'about') label = dictionary.nav.about;
    else if (item.id === 'pricing') label = dictionary.nav.pricing;
    else if (item.id === 'projects') label = dictionary.nav.projects;
    else if (item.id === 'experience') label = dictionary.nav.experience;
    else if (item.id === 'skills') label = dictionary.nav.skills;
    else if (item.id === 'contact') label = dictionary.nav.contact;
    return { ...item, label };
  });

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-surface-border/60 py-3 shadow-md shadow-black/5'
          : 'bg-transparent py-4 border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-2.5 font-mono font-bold text-lg text-foreground hover:text-accent transition-colors group">
          <Image
            src="/images/logoname.jpeg"
            alt="Boniventure Agbor"
            width={32}
            height={32}
            className="w-full h-9 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
            priority
          />
          {/* <span>Boniventure</span> */}
        </a>

        {/* Desktop Navbar */}
        <Navbar items={localizedNavItems} activeId={activeId} />

        {/* Action Button, Language Switcher & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <LanguageToggle />
          <ThemeToggle />
          <Button href={resumeUrl} isExternal variant="outline" size="sm" className="hidden sm:inline-flex">
            {dictionary.nav.resume}
          </Button>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 md:hidden text-foreground/80 hover:text-foreground focus:outline-none"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={localizedNavItems}
        activeId={activeId}
        resumeUrl={resumeUrl}
      />
    </header>
  );
};
