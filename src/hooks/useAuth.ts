import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthService } from '../services/authService';
import { showErrorToast, showSuccessToast } from '../utils/errorHandler';
import type { User } from '../types';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session?.user) {
            setIsAuthenticated(true);
            setIsGuest(false);
            // Try to get user profile, but don't block on it
            try {
              const user = await AuthService.getCurrentUser();
              if (mounted && user) {
                setCurrentUser(user);
              }
            } catch (profileError) {
              console.log('Profile not found, user needs to complete setup');
            }
          } else {
            setIsAuthenticated(false);
            setIsGuest(true);
            setCurrentUser(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsGuest(true);
          setCurrentUser(null);
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          setIsAuthenticated(true);
          setIsGuest(false);
          try {
            const user = await AuthService.getCurrentUser();
            if (mounted && user) {
              setCurrentUser(user);
            }
          } catch (error) {
            console.log('Profile setup needed');
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setIsAuthenticated(false);
          setIsGuest(true);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await AuthService.signIn(email, password);
      
      if (result.user) {
        showSuccessToast('Welcome back!');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      showErrorToast(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: {
    username: string;
    displayName: string;
    bio?: string;
  }) => {
    try {
      setLoading(true);
      const result = await AuthService.signUp(email, password, userData);
      
      if (result.user) {
        showSuccessToast('Account created! Please check your email to verify.');
        return { success: true, message: 'Account created successfully! Please check your email to verify your account.' };
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      showErrorToast(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.signOut();
      setCurrentUser(null);
      setIsAuthenticated(false);
      setIsGuest(true);
      showSuccessToast('Signed out successfully');
    } catch (error: any) {
      console.error('Logout failed:', error);
      showErrorToast(error);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      
      try {
        await AuthService.updateProfile(currentUser.id, updates);
        showSuccessToast('Profile updated successfully');
      } catch (error: any) {
        console.error('Profile update failed:', error);
        showErrorToast(error);
        // Revert the optimistic update
        setCurrentUser(currentUser);
      }
    }
  };

  const requireAuth = () => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
  };

  return {
    currentUser,
    isAuthenticated,
    isGuest,
    loading,
    error,
    login,
    signUp,
    logout,
    updateUser,
    requireAuth
  };
};