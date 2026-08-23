'use client';

import React from 'react';
import { NavItem } from '@/types/navigation';
import { NavLink } from './NavLink';

export interface NavbarProps {
  items: NavItem[];
  activeId: string;
}

export const Navbar: React.FC<NavbarProps> = ({ items, activeId }) => {
  return (
    <nav className="hidden md:flex items-center gap-1 bg-surface/50 border border-surface-border p-1.5 rounded-full backdrop-blur-md">
      {items.map((item) => (
        <NavLink
          key={item.id}
          href={item.href}
          label={item.label}
          isActive={activeId === item.id}
        />
      ))}
    </nav>
  );
};
