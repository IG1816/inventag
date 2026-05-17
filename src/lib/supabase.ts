import { createClient } from '@supabase/supabase-js';

// Fallback to placeholder values when env vars are not set
// (app runs fully on local mock data — supabase is not called in production demo mode)
const url = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://placeholder.supabase.co';
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'placeholder-anon-key';

export const supabase = createClient(url, key);
