import "server-only";
import { hasSupabaseServerConfig } from "@/lib/supabase/env";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export type StoreSettings = { storeName: string; announcement: string; supportEmail: string };
const defaults: StoreSettings = { storeName: "Nova", announcement: "La sélection du moment, à prix léger.", supportEmail: "bonjour@nova.example" };

export async function getStoreSettings(): Promise<StoreSettings> {
  if (!hasSupabaseServerConfig()) return defaults;
  try {
    const { data, error } = await createSupabaseAdmin().from("store_settings").select("key,value").in("key", ["store_name", "announcement", "support_email"]);
    if (error) return defaults;
    const settings = Object.fromEntries((data ?? []).map((row) => [row.key, row.value])) as Record<string, unknown>;
    const readString = (key: string, fallback: string) => {
      const value = settings[key];
      return typeof value === "string" && value.trim() ? value.trim() : fallback;
    };
    return {
      storeName: readString("store_name", defaults.storeName),
      announcement: readString("announcement", defaults.announcement),
      supportEmail: readString("support_email", defaults.supportEmail),
    };
  } catch { return defaults; }
}
