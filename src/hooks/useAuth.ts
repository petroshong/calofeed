import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isGuest: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    isGuest: true
  });

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth session error:', error);
        }

        if (mounted) {
          if (session?.user) {
            // Try to get profile
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              setState({
                user: session.user,
                profile: profile || null,
                loading: false,
                isGuest: false
              });
            } catch (profileError) {
              console.error('Profile fetch error:', profileError);
              setState({
                user: session.user,
                profile: null,
                loading: false,
                isGuest: false
              });
            }
          } else {
            setState({
              user: null,
              profile: null,
              loading: false,
              isGuest: true
            });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setState({
            user: null,
            profile: null,
            loading: false,
            isGuest: true
          });
        }
      }
    }

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            setState({
              user: session.user,
              profile: profile || null,
              loading: false,
              isGuest: false
            });
          } catch (error) {
            console.error('Profile fetch error:', error);
            setState({
              user: session.user,
              profile: null,
              loading: false,
              isGuest: false
            });
          }
        } else {
          setState({
            user: null,
            profile: null,
            loading: false,
            isGuest: true
          });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    ...state,
    signOut
  };
}