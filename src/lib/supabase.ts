import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This is the client used by the browser (authenticated via Clerk token)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We use Clerk for auth, so Supabase doesn't need to persist its own session
  }
});

// To use Supabase securely with Clerk, we pass the Clerk token to Supabase headers
// This function creates a dynamic client per request
export const createClerkSupabaseClient = (clerkToken: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${clerkToken}` } },
    auth: { persistSession: false },
  });
};

// Admin client for backend operations (bypasses RLS)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false }
});
