'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  ShieldCheck,
  Menu,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AdminSidebar, AdminTab } from '@/components/admin/AdminSidebar';
import { useAdminRealtime } from '@/hooks/useAdminRealtime';
import { OverviewTab } from '@/components/admin/tabs/OverviewTab';
import { ProfileTab } from '@/components/admin/tabs/ProfileTab';
import { StatsTab } from '@/components/admin/tabs/StatsTab';
import { PhilosophyTab } from '@/components/admin/tabs/PhilosophyTab';
import { ProjectsTab } from '@/components/admin/tabs/ProjectsTab';
import { ExperienceTab } from '@/components/admin/tabs/ExperienceTab';
import { SkillsTab } from '@/components/admin/tabs/SkillsTab';
import { ResumeTab } from '@/components/admin/tabs/ResumeTab';
import { MessagesTab } from '@/components/admin/tabs/MessagesTab';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('agborboniventure@gmail.com');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [stats, setStats] = useState<{
    totalMessages: number;
    unreadMessages: number;
    projectsCount: number;
    skillsCount: number;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ⚡ Supabase WebSocket Real-Time Subscription Hook
  const { status: realtimeStatus } = useAdminRealtime({
    enabled: isAuthenticated,
    onToast: showToast,
    onDataChanged: () => {
      if (token) fetchStats();
    },
    onNewMessage: () => {
      if (token) fetchStats();
    },
    onMessageUpdated: () => {
      if (token) fetchStats();
    },
    onMessageDeleted: () => {
      if (token) fetchStats();
    },
  });

  // Check existing session token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('ba_admin_token');
    const savedEmail = localStorage.getItem('ba_admin_email');
    if (savedToken) {
      setToken(savedToken);
      if (savedEmail) setUserEmail(savedEmail);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch KPI stats when authenticated and listen to custom refresh events
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchStats();

      const handleRefresh = () => fetchStats();
      window.addEventListener('ba_realtime_refresh_stats', handleRefresh);
      return () => {
        window.removeEventListener('ba_realtime_refresh_stats', handleRefresh);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setStats(data.data.stats);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed.');
      }

      setToken(data.token);
      localStorage.setItem('ba_admin_token', data.token);
      localStorage.setItem('ba_admin_email', userEmail);
      setIsAuthenticated(true);
      setPassword('');
      showToast('Welcome back, Boniventure!', 'success');
    } catch (err: any) {
      setLoginError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ba_admin_token');
    localStorage.removeItem('ba_admin_email');
    setToken('');
    setIsAuthenticated(false);
    setStats(null);
  };

  // 1. Unauthenticated Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-foreground/60 hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Portfolio
            </Link>
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-accent/25">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Operations Portal</h1>
            <p className="text-xs text-foreground/60">
              Sign in with your administrator credentials to manage all portfolio data.
            </p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoggingIn}
                icon={<ShieldCheck className="w-4 h-4" />}
              >
                {isLoggingIn ? 'Authenticating...' : 'Sign In to Operations'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard Workspace
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-mono transition-all animate-bounce ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40 backdrop-blur-md'
              : 'bg-rose-950/90 text-rose-300 border-rose-500/40 backdrop-blur-md'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Persistent Left Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadMessagesCount={stats?.unreadMessages ?? 0}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        onLogout={handleLogout}
        userEmail={userEmail}
        realtimeStatus={realtimeStatus}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Mobile Header Bar */}
        <header className="lg:hidden p-4 border-b border-surface-border bg-surface flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setIsOpenMobile(true)}
            className="p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-surface-border/40"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm">BA Operations</span>
          <div className="w-5" />
        </header>

        {/* Tab Workspace Body */}
        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewTab stats={stats} onNavigate={setActiveTab} />
          )}
          {activeTab === 'profile' && (
            <ProfileTab token={token} onToast={showToast} />
          )}
          {activeTab === 'stats' && (
            <StatsTab token={token} onToast={showToast} />
          )}
          {activeTab === 'philosophy' && (
            <PhilosophyTab token={token} onToast={showToast} />
          )}
          {activeTab === 'projects' && (
            <ProjectsTab token={token} onToast={showToast} />
          )}
          {activeTab === 'experience' && (
            <ExperienceTab token={token} onToast={showToast} />
          )}
          {activeTab === 'skills' && (
            <SkillsTab token={token} onToast={showToast} />
          )}
          {activeTab === 'resume' && (
            <ResumeTab token={token} onToast={showToast} />
          )}
          {activeTab === 'messages' && (
            <MessagesTab
              token={token}
              onToast={showToast}
              onRefreshStats={fetchStats}
            />
          )}
        </main>
      </div>
    </div>
  );
}
