import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
  console.warn('Supabase credentials missing or invalid. Please update your .env file.');
}

// Provide fallback to avoid crash during initialization
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-id.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);
