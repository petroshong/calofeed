import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthService } from '../services/authService';
import type { User } from '../types';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      setError('');
      const { user } = await AuthService.signIn(email, password);
      
      if (user) {
        const userData = await AuthService.getCurrentUser();
        setCurrentUser(userData);
        setIsAuthenticated(true);
        setIsGuest(false);
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Handle specific auth errors
      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials or create a new account.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a few minutes and try again.');
        } else {
          throw new Error('Login failed. Please try again or contact support if the problem persists.');
        }
      }
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
      setError('');
      await AuthService.signUp(email, password, userData);
      // User will need to verify email before being logged in
      return { success: true, message: 'Account created successfully! Please check your email to verify your account.' };
    } catch (error) {
      console.error('Signup failed:', error);
      // Handle specific signup errors
      if (error instanceof Error) {
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('Password should be at least 6 characters')) {
          throw new Error('Password must be at least 6 characters long.');
        } else if (error.message.includes('duplicate key')) {
          throw new Error('This username is already taken. Please choose a different username.');
        } else {
          throw new Error('Failed to create account. Please try again or contact support.');
        }
      }
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
    error,
    login,
    signUp,
    logout,
    updateUser,
    requireAuth
  };
};