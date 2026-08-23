'use client';

import React from 'react';
import {
  Mail,
  Inbox,
  FolderGit2,
  Briefcase,
  Wrench,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminTab } from '../AdminSidebar';

interface OverviewTabProps {
  stats: {
    totalMessages: number;
    unreadMessages: number;
    projectsCount: number;
    skillsCount: number;
  } | null;
  onNavigate: (tab: AdminTab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ stats, onNavigate }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-pink-900/20 border border-surface-border relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" /> Full Stack CMS Live
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            Welcome back, Boniventure
          </h1>
          <p className="text-sm text-foreground/70 max-w-2xl leading-relaxed">
            Manage your personal profile, hero numerical metrics, engineering philosophy, projects, case studies, career experience, and technical skill matrix in real-time.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-foreground/60">
            <span className="text-xs font-mono">Total Inquiries</span>
            <Mail className="w-4 h-4 text-accent" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-foreground">
            {stats?.totalMessages ?? 0}
          </p>
          <button
            onClick={() => onNavigate('messages')}
            className="text-xs font-mono text-accent hover:underline flex items-center gap-1 pt-1"
          >
            View inbox <ArrowRight className="w-3 h-3" />
          </button>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-foreground/60">
            <span className="text-xs font-mono">Unread Inquiries</span>
            <Inbox className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-emerald-400">
            {stats?.unreadMessages ?? 0}
          </p>
          <p className="text-xs text-foreground/50 font-mono">
            {(stats?.unreadMessages ?? 0) > 0 ? 'Requires attention' : 'All caught up'}
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-foreground/60">
            <span className="text-xs font-mono">Live Projects</span>
            <FolderGit2 className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-foreground">
            {stats?.projectsCount ?? 0}
          </p>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-mono text-accent hover:underline flex items-center gap-1 pt-1"
          >
            Manage projects <ArrowRight className="w-3 h-3" />
          </button>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-foreground/60">
            <span className="text-xs font-mono">Skills Count</span>
            <Wrench className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-foreground">
            {stats?.skillsCount ?? 0}
          </p>
          <button
            onClick={() => onNavigate('skills')}
            className="text-xs font-mono text-accent hover:underline flex items-center gap-1 pt-1"
          >
            Manage stack <ArrowRight className="w-3 h-3" />
          </button>
        </Card>
      </div>

      {/* Quick Launchpad */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Quick Management Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            className="p-5 hover:border-accent/50 cursor-pointer transition-all space-y-2 group"
            onClick={() => onNavigate('profile')}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground group-hover:text-accent transition-colors">
                Personal Profile & Bio
              </h3>
              <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-foreground/60">
              Update your name, title, bio, availability badge, and social links.
            </p>
          </Card>

          <Card
            className="p-5 hover:border-accent/50 cursor-pointer transition-all space-y-2 group"
            onClick={() => onNavigate('projects')}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground group-hover:text-accent transition-colors">
                Add / Edit Projects
              </h3>
              <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-foreground/60">
              Publish new portfolio projects, images, tags, and case study architecture.
            </p>
          </Card>

          <Card
            className="p-5 hover:border-accent/50 cursor-pointer transition-all space-y-2 group"
            onClick={() => onNavigate('experience')}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground group-hover:text-accent transition-colors">
                Career History
              </h3>
              <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-foreground/60">
              Add new career roles, company highlights, and milestones.
            </p>
          </Card>

          <Card
            className="p-5 hover:border-accent/50 cursor-pointer transition-all space-y-2 group"
            onClick={() => onNavigate('skills')}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground group-hover:text-accent transition-colors">
                Skills & Tech Stack
              </h3>
              <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-foreground/60">
              Update technical categories and skill levels (Core, Hands-on, Explored).
            </p>
          </Card>

          <Card
            className="p-5 hover:border-accent/50 cursor-pointer transition-all space-y-2 group"
            onClick={() => onNavigate('stats')}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground group-hover:text-accent transition-colors">
                Hero Stats & Counters
              </h3>
              <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-foreground/60">
              Change key metrics (e.g. Years of Experience, Production Apps, Uptime).
            </p>
          </Card>

          <Card
            className="p-5 hover:border-accent/50 cursor-pointer transition-all space-y-2 group"
            onClick={() => onNavigate('philosophy')}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground group-hover:text-accent transition-colors">
                Principles & Philosophy
              </h3>
              <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-foreground/60">
              Refine your engineering and design philosophy statements.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
