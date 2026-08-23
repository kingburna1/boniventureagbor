'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  User,
  TrendingUp,
  Lightbulb,
  FolderGit2,
  Briefcase,
  Wrench,
  Mail,
  FileText,
  ExternalLink,
  LogOut,
  X,
  Database,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export type AdminTab =
  | 'overview'
  | 'profile'
  | 'stats'
  | 'philosophy'
  | 'projects'
  | 'experience'
  | 'skills'
  | 'resume'
  | 'messages';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  unreadMessagesCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  userEmail: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  unreadMessagesCount,
  isOpenMobile,
  onCloseMobile,
  onLogout,
  userEmail,
}) => {
  const navItems = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'profile' as AdminTab, label: 'Personal Profile', icon: User },
    { id: 'stats' as AdminTab, label: 'Hero Stats', icon: TrendingUp },
    { id: 'philosophy' as AdminTab, label: 'Principles & Philosophy', icon: Lightbulb },
    { id: 'projects' as AdminTab, label: 'Projects & Case Studies', icon: FolderGit2 },
    { id: 'experience' as AdminTab, label: 'Career Experience', icon: Briefcase },
    { id: 'skills' as AdminTab, label: 'Skills Matrix', icon: Wrench },
    { id: 'resume' as AdminTab, label: 'Resume & CV', icon: FileText },
    {
      id: 'messages' as AdminTab,
      label: 'Contact Inquiries',
      icon: Mail,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-surface border-r border-surface-border z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white font-bold font-mono text-sm flex items-center justify-center shadow-md">
              BA
            </div>
            <div>
              <h2 className="font-bold text-sm text-foreground tracking-tight leading-none">
                Admin Operations
              </h2>
              <span className="text-[11px] text-foreground/50 font-mono flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                PostgreSQL Live
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-foreground/60 hover:text-foreground hover:bg-surface-border/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-accent text-white shadow-md shadow-accent/20 font-semibold'
                    : 'text-foreground/70 hover:text-foreground hover:bg-surface-border/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-foreground/60'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white text-accent'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom Footer */}
        <div className="p-4 border-t border-surface-border space-y-3 bg-surface-border/10">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-foreground/70 hover:text-accent hover:bg-surface transition-colors border border-surface-border/40"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> View Public Site
            </span>
            <span className="text-[10px] text-foreground/40">New tab</span>
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="truncate max-w-[170px]">
              <p className="text-[11px] font-mono text-foreground/50 truncate">Logged in as</p>
              <p className="text-xs font-bold text-foreground truncate" title={userEmail}>
                {userEmail || 'agborboniventure@gmail.com'}
              </p>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
