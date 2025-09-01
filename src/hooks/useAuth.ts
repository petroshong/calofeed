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
          console.warn('Auth session error (demo mode):', error.message);
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
              console.warn('Profile fetch error (demo mode):', profileError);
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
        console.warn('Auth initialization error (demo mode):', error);
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

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (updates: Partial<any>) => {
    if (state.profile) {
      setState(prev => ({
        ...prev,
        profile: { ...prev.profile, ...updates }
      }));
    }
  };

  const requireAuth = (action: string) => {
    if (state.isGuest) {
      return false;
    }
    return true;
  };

  const signUp = async (email: string, password: string, userData: { username: string; displayName: string; bio?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            display_name: userData.displayName,
            bio: userData.bio || ''
          }
        }
      });

      if (error) throw error;

      // Create profile after successful signup
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: userData.username,
            display_name: userData.displayName,
            bio: userData.bio || '',
            avatar_url: `https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      return { success: true, message: 'Account created successfully! Please check your email to verify your account.' };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };
  return {
    ...state,
    currentUser: state.profile,
    isAuthenticated: !state.isGuest && !!state.user,
    login,
    logout,
    updateUser,
    requireAuth,
    signOut,
    signUp
  }
}