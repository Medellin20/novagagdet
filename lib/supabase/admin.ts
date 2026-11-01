import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { hasSupabaseServerConfig, supabasePublicConfig } from "@/lib/supabase/env";

let adminClient: SupabaseClient | null = null;

export function createSupabaseAdmin(): SupabaseClient {
  if (!hasSupabaseServerConfig()) throw new Error("Supabase doit être configuré côté serveur.");
  if (adminClient) return adminClient;
  const { url } = supabasePublicConfig();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY est manquant.");
  adminClient = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
  return adminClient;
}
