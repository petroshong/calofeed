import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export const useRealTimeUpdates = (userId: string) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Subscribe to real-time updates
    const newChannel = supabase
      .channel('user-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          // Handle new notification
          console.log('New notification:', payload.new);
          
          // Dispatch custom event for notification
          window.dispatchEvent(new CustomEvent('newNotification', {
            detail: payload.new
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'likes'
        },
        (payload) => {
          // Handle new like
          console.log('New like:', payload.new);
          
          window.dispatchEvent(new CustomEvent('newLike', {
            detail: payload.new
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments'
        },
        (payload) => {
          // Handle new comment
          console.log('New comment:', payload.new);
          
          window.dispatchEvent(new CustomEvent('newComment', {
            detail: payload.new
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'follows',
          filter: `following_id=eq.${userId}`
        },
        (payload) => {
          // Handle new follower
          console.log('New follower:', payload.new);
          
          window.dispatchEvent(new CustomEvent('newFollower', {
            detail: payload.new
          }));
        }
      )
      .subscribe();

    setChannel(newChannel);

    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel);
      }
    };
  }, [userId]);

  return { channel };
};