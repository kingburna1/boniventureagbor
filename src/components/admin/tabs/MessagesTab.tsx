'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Clock,
  Archive,
  Trash2,
  RefreshCw,
  Eye,
  CheckCircle,
  AlertCircle,
  Search,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  createdAt: string;
}

interface MessagesTabProps {
  token: string;
  onToast: (msg: string, type?: 'success' | 'error') => void;
  onRefreshStats: () => void;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({
  token,
  onToast,
  onRefreshStats,
}) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'READ' | 'ARCHIVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.data.messages);
        onRefreshStats();
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      onToast('Failed to load contact messages', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, status: 'UNREAD' | 'READ' | 'ARCHIVED') => {
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, status } : msg))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status } : null));
        }
        onRefreshStats();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
        onToast('Message deleted successfully', 'success');
        onRefreshStats();
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
      onToast('Failed to delete message', 'error');
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesFilter = activeFilter === 'ALL' || msg.status === activeFilter;
    const matchesSearch =
      msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.senderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.status === 'UNREAD').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contact Inquiries</h1>
          <p className="text-xs text-foreground/60 mt-1">
            Incoming messages, hiring requests, and project inquiries received from visitors.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          disabled={isLoading}
          className="p-2 rounded-lg bg-surface border border-surface-border text-foreground/70 hover:text-accent transition-colors"
          title="Refresh Messages"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div className="flex items-center gap-2">
          {(['ALL', 'UNREAD', 'READ', 'ARCHIVED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeFilter === tab
                  ? 'bg-accent text-white shadow-sm shadow-accent/20'
                  : 'bg-surface text-foreground/70 border border-surface-border hover:text-foreground'
              }`}
            >
              {tab}
              {tab === 'UNREAD' && unreadCount > 0 ? ` (${unreadCount})` : ''}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries..."
            className="w-full pl-8 pr-3 py-1.5 bg-surface border border-surface-border rounded-lg text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Inquiries Split View */}
      {isLoading ? (
        <div className="p-12 text-center text-foreground/60 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-accent" />
          <span>Loading messages...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Messages List */}
          <div className="lg:col-span-6 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {filteredMessages.length === 0 ? (
              <Card className="p-8 text-center text-foreground/50">
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No inquiries in this folder.</p>
              </Card>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status === 'UNREAD') {
                        updateMessageStatus(msg.id, 'READ');
                      }
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-accent/10 border-accent shadow-md'
                        : 'bg-surface border-surface-border hover:border-accent/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {msg.status === 'UNREAD' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                        <span className="font-bold text-sm text-foreground truncate">
                          {msg.senderName}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-foreground/50 shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-foreground/90 truncate mb-1">
                      {msg.subject}
                    </p>
                    <p className="text-xs text-foreground/60 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-surface-border/40 text-[11px] font-mono">
                      <span className="text-accent truncate">{msg.senderEmail}</span>
                      <span
                        className={`px-2 py-0.5 rounded border text-[10px] ${
                          msg.status === 'UNREAD'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : msg.status === 'ARCHIVED'
                            ? 'bg-foreground/5 text-foreground/50 border-surface-border'
                            : 'bg-accent/10 text-accent border-accent/20'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Details Panel */}
          <div className="lg:col-span-6">
            {selectedMessage ? (
              <Card className="sticky top-20 p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-surface-border pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {selectedMessage.subject}
                    </h2>
                    <p className="text-xs font-mono text-foreground/50 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        updateMessageStatus(
                          selectedMessage.id,
                          selectedMessage.status === 'ARCHIVED' ? 'READ' : 'ARCHIVED'
                        )
                      }
                      className="p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-surface-border/50 transition-colors"
                      title="Archive message"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 bg-surface-border/20 p-4 rounded-xl border border-surface-border text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-foreground/50">Sender:</span>
                    <span className="font-bold text-foreground">{selectedMessage.senderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/50">Email:</span>
                    <a
                      href={`mailto:${selectedMessage.senderEmail}`}
                      className="text-accent underline"
                    >
                      {selectedMessage.senderEmail}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/50">Status:</span>
                    <Badge variant={selectedMessage.status === 'UNREAD' ? 'accent' : 'outline'}>
                      {selectedMessage.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono text-foreground/50 uppercase tracking-wider">
                    Message Body
                  </span>
                  <div className="p-4 rounded-xl bg-surface border border-surface-border text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-border flex items-center justify-between">
                  <a
                    href={`mailto:${selectedMessage.senderEmail}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject
                    )}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent-hover shadow-md shadow-accent/20 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" /> Reply by Email
                  </a>

                  <button
                    onClick={() =>
                      updateMessageStatus(
                        selectedMessage.id,
                        selectedMessage.status === 'READ' ? 'UNREAD' : 'READ'
                      )
                    }
                    className="text-xs font-mono text-foreground/60 hover:text-foreground transition-colors"
                  >
                    Mark as {selectedMessage.status === 'READ' ? 'Unread' : 'Read'}
                  </button>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center text-foreground/50">
                <Eye className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Select an inquiry from the left to view details.</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
