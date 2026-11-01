"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseCookieOptions } from "@/lib/supabase/cookies";

let browserClient: SupabaseClient | null = null;

export function createSupabaseBrowser(): SupabaseClient {
  if (browserClient) return browserClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Connexion Supabase indisponible : variables d’environnement manquantes.");
  browserClient = createBrowserClient(url, anonKey, {
    cookieOptions: supabaseCookieOptions(),
  });
  return browserClient;
}
