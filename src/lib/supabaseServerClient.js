// src/lib/supabaseServerClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Returns a Supabase client authenticated as the user (if token provided),
 * or as anon (if no token).
 * @param {string} [token] - The user's access token (JWT)
 */
export function getSupabaseServerClient(token) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined,
  });
}
