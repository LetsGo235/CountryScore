import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// URL and KEY are read from Vite environment variables (.env.local)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase credentials not found in environment variables. ' +
    'Make sure .env.local contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Helper to safely handle Supabase responses
 * Returns { data, error } consistent with Supabase's API
 */
export function handleSupabaseResponse(response) {
  const { data, error } = response;
  return { data, error };
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured() {
  return !!supabaseUrl && !!supabaseKey;
}
