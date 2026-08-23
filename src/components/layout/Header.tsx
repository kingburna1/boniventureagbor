'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { NAV_ITEMS } from '@/data/navigationData';
import { PERSONAL_DATA } from '@/data/personalData';
import { useScrollspy } from '@/hooks/useScrollspy';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

export interface HeaderProps {
  resumeUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  resumeUrl = PERSONAL_DATA.resumeUrl,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useScrollspy(NAV_ITEMS.map((item) => item.id));
  const isScrolled = useHeaderScroll();

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-surface-border py-3 shadow-md'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-2 font-mono font-bold text-lg text-foreground hover:text-accent transition-colors">
          <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-sm shadow-sm">
            BA
          </span>
          <span>Boniventure<span className="text-accent">.dev</span></span>
        </a>

        {/* Desktop Navbar */}
        <Navbar items={NAV_ITEMS} activeId={activeId} />

        {/* Action Button & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Button href={resumeUrl} isExternal variant="outline" size="sm" className="hidden sm:inline-flex">
            Resume
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
        items={NAV_ITEMS}
        activeId={activeId}
        resumeUrl={resumeUrl}
      />
    </header>
  );
};
