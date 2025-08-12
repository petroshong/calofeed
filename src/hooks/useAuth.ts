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

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
    };
    
    initAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const user = await AuthService.getCurrentUser();
          setCurrentUser(user);
          setIsAuthenticated(true);
          setIsGuest(false);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setIsAuthenticated(false);
          setIsGuest(true);
          setLoading(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        try {
          const user = await AuthService.getCurrentUser();
          setCurrentUser(user);
        } catch (profileError) {
          console.error('Failed to load user profile:', profileError);
          // If profile doesn't exist, user is still authenticated but needs profile setup
          setCurrentUser(null);
        }
        setIsAuthenticated(true);
        setIsGuest(false);
      } else {
        setIsGuest(true);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsGuest(true);
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await AuthService.signIn(email, password);
      
      if (result.user) {
        const userData = await AuthService.getCurrentUser();
        setCurrentUser(userData);
        setIsAuthenticated(true);
        setIsGuest(false);
        showSuccessToast('Welcome back!');
      }
    } catch (error) {
      console.error('Login failed:', error);
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
    } catch (error) {
      console.error('Signup failed:', error);
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
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      
      // Update in database
      AuthService.updateProfile(currentUser.id, updates)
        .then(() => showSuccessToast('Profile updated successfully'))
        .catch((error) => {
          console.error('Profile update failed:', error);
          showErrorToast(error);
        });
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
    login,
    signUp,
    logout,
    updateUser,
    requireAuth
  };
};