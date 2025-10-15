import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

let supabaseInstance: SupabaseClient<Database> | null = null;

export function validateEnvironment(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!import.meta.env.VITE_SUPABASE_URL) {
    errors.push('VITE_SUPABASE_URL is not defined');
  }

  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    errors.push('VITE_SUPABASE_ANON_KEY is not defined');
  }

  if (!import.meta.env.VITE_SUPABASE_URL?.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must start with https://');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function getSupabaseClient(): SupabaseClient<Database> {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const validation = validateEnvironment();
  if (!validation.valid) {
    const errorMessage = `Supabase configuration error:\n${validation.errors.join('\n')}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'X-Client-Info': 'thinkzo-web-app'
      }
    },
    db: {
      schema: 'public'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });

  return supabaseInstance;
}

export function resetSupabaseClient(): void {
  supabaseInstance = null;
}

export const supabase = getSupabaseClient();
