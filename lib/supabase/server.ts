import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabasePublicConfig } from "@/lib/supabase/env";
import { supabaseCookieAttributes, supabaseCookieOptions } from "@/lib/supabase/cookies";

export async function createSupabaseServer() {
  const { url, anonKey } = supabasePublicConfig();
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookieOptions: supabaseCookieOptions(),
    cookies: {
      getAll() { return cookieStore.getAll().map(({ name, value }) => ({ name, value })); },
      setAll(values) {
        try {
          const cookieOptions = supabaseCookieAttributes();
          values.forEach(({ name, value, options }) => cookieStore.set(name, value, { ...options, ...cookieOptions }));
        } catch {
          // Les composants serveur en lecture seule ne peuvent pas écrire les cookies ; proxy.ts les actualise.
        }
      },
    },
  });
}
