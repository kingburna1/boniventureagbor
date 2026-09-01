'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getBrowserSupabase } from '@/lib/supabaseClient';
import { playNotificationChime } from '@/lib/sound';

export type RealtimeStatus = 'connected' | 'connecting' | 'disconnected';

export interface RealtimeMessagePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new?: any;
  old?: any;
}

interface UseAdminRealtimeOptions {
  enabled: boolean;
  onNewMessage?: (message: any) => void;
  onMessageUpdated?: (message: any) => void;
  onMessageDeleted?: (id: string) => void;
  onDataChanged?: (table: string, eventType: string) => void;
  onToast?: (msg: string, type?: 'success' | 'error') => void;
}

export function useAdminRealtime({
  enabled,
  onNewMessage,
  onMessageUpdated,
  onMessageDeleted,
  onDataChanged,
  onToast,
}: UseAdminRealtimeOptions) {
  const [status, setStatus] = useState<RealtimeStatus>('disconnected');
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const channelRef = useRef<any>(null);

  const callbacksRef = useRef({
    onNewMessage,
    onMessageUpdated,
    onMessageDeleted,
    onDataChanged,
    onToast,
  });

  useEffect(() => {
    callbacksRef.current = {
      onNewMessage,
      onMessageUpdated,
      onMessageDeleted,
      onDataChanged,
      onToast,
    };
  });

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setStatus('disconnected');
      return;
    }

    const supabase = getBrowserSupabase();
    if (!supabase) {
      console.warn('Realtime: Supabase client not configured');
      setStatus('disconnected');
      return;
    }

    setStatus('connecting');

    // Create single unified channel for all admin realtime events
    const channel = supabase.channel('ba-admin-realtime', {
      config: {
        broadcast: { self: false },
        presence: { key: 'admin-dashboard' },
      },
    });

    // 1. Listen to Contact Messages (INSERT, UPDATE, DELETE)
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'ContactMessage' },
      (payload: any) => {
        setLastActivity(new Date());

        if (payload.eventType === 'INSERT') {
          const newMessage = payload.new;
          // Play audio notification chime
          playNotificationChime();

          // Show alert toast
          callbacksRef.current.onToast?.(
            `🔔 New inquiry received from ${newMessage.senderName || 'a visitor'}!`,
            'success'
          );

          callbacksRef.current.onNewMessage?.(newMessage);
          window.dispatchEvent(
            new CustomEvent('ba_realtime_message_insert', { detail: newMessage })
          );
        } else if (payload.eventType === 'UPDATE') {
          const updatedMessage = payload.new;
          callbacksRef.current.onMessageUpdated?.(updatedMessage);
          window.dispatchEvent(
            new CustomEvent('ba_realtime_message_update', { detail: updatedMessage })
          );
        } else if (payload.eventType === 'DELETE') {
          const deletedId = payload.old?.id;
          if (deletedId) {
            callbacksRef.current.onMessageDeleted?.(deletedId);
            window.dispatchEvent(
              new CustomEvent('ba_realtime_message_delete', { detail: { id: deletedId } })
            );
          }
        }

        callbacksRef.current.onDataChanged?.('ContactMessage', payload.eventType);
        window.dispatchEvent(new CustomEvent('ba_realtime_refresh_stats'));
      }
    );

    // 2. Listen to Projects & Case Studies Changes
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'Project' },
      (payload: any) => {
        setLastActivity(new Date());
        callbacksRef.current.onDataChanged?.('Project', payload.eventType);
        window.dispatchEvent(new CustomEvent('ba_realtime_refresh_stats'));
        window.dispatchEvent(new CustomEvent('ba_realtime_projects_changed'));
      }
    );

    // 3. Listen to Experience, Skills, Stats, Profile changes
    const otherTables = [
      'PersonalProfile',
      'Experience',
      'Skill',
      'SkillCategory',
      'Stat',
      'Philosophy',
    ];

    otherTables.forEach((table) => {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload: any) => {
          setLastActivity(new Date());
          callbacksRef.current.onDataChanged?.(table, payload.eventType);
          window.dispatchEvent(new CustomEvent('ba_realtime_refresh_stats'));
          window.dispatchEvent(new CustomEvent(`ba_realtime_${table.toLowerCase()}_changed`));
        }
      );
    });

    // 4. Track WebSocket connection lifecycle
    channel.subscribe((channelStatus: string, err?: Error) => {
      if (channelStatus === 'SUBSCRIBED') {
        setStatus('connected');
        console.log('⚡ Supabase WebSocket Realtime connected successfully!');
      } else if (channelStatus === 'CLOSED' || channelStatus === 'CHANNEL_ERROR') {
        setStatus('disconnected');
        if (err) console.warn('Supabase Realtime Channel Status:', channelStatus, err);
      } else if (channelStatus === 'TIMED_OUT') {
        setStatus('connecting');
      }
    });

    channelRef.current = channel;

    // Fallback heartbeat sync every 20s to ensure zero stale state
    const syncInterval = setInterval(() => {
      window.dispatchEvent(new CustomEvent('ba_realtime_refresh_stats'));
    }, 20000);

    return () => {
      clearInterval(syncInterval);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [enabled]);

  return {
    status,
    lastActivity,
  };
}
