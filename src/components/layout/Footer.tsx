'use client';

import React from 'react';
import { PERSONAL_DATA } from '@/data/personalData';
import { SocialLinks } from './SocialLinks';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-surface-border bg-surface/30 py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-mono font-bold text-foreground">
            {PERSONAL_DATA.name}
          </p>
          <p className="text-xs text-foreground/60 mt-1">
            Built with Next.js 14 (App Router), TypeScript & Tailwind CSS.
          </p>
        </div>

        <SocialLinks socials={PERSONAL_DATA.socials} />

        <p className="text-xs text-foreground/50 font-mono">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};
