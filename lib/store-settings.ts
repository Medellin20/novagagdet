import "server-only";
import { paymentSettingsSchema } from "@/lib/payment-settings";
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

export async function getPaymentSettings() {
  if (!hasSupabaseServerConfig()) return null;
  try {
    const { data, error } = await createSupabaseAdmin().from("store_settings").select("key,value").in("key", ["payment_mode", "payment_account_holder", "payment_iban", "payment_bic", "payment_url"]);
    if (error) return null;
    const parsed = paymentSettingsSchema.safeParse(Object.fromEntries((data ?? []).map(row => [row.key, row.value])));
    if (!parsed.success) return null;
    const value = parsed.data;
    if (value.payment_mode === "rib" && (!value.payment_iban || !value.payment_bic || !value.payment_account_holder)) return null;
    return value;
  } catch { return null; }
}
