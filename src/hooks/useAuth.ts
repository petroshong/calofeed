import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthService } from '../services/authService';
import type { User } from '../types';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
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
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user } = await AuthService.signIn(email, password);
      
      if (user) {
        const userData = await AuthService.getCurrentUser();
        setCurrentUser(userData);
        setIsAuthenticated(true);
        setIsGuest(false);
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
      await AuthService.signUp(email, password, userData);
      // User will need to verify email before being logged in
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
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
      // Update in database
      AuthService.updateProfile(currentUser.id, updates).catch(console.error);
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