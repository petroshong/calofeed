import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client when environment variables are missing
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Running in demo mode.');
  
  // Create a mock Supabase client for demo purposes
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }) }) }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }),
      update: () => ({ eq: () => Promise.resolve({ error: { message: 'Demo mode' } }) }),
      delete: () => ({ eq: () => Promise.resolve({ error: { message: 'Demo mode' } }) })
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }),
        remove: () => Promise.resolve({ error: { message: 'Demo mode' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  };
} else {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}

export { supabase };