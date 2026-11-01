import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function getAdminUser() {
  try {
    const sessionClient = await createSupabaseServer();
    const { data: { user }, error } = await sessionClient.auth.getUser();
    if (error || !user) return null;
    const { data: profile, error: profileError } = await createSupabaseAdmin()
      .from("profiles").select("role,full_name,email").eq("id", user.id).maybeSingle();
    if (profileError || profile?.role !== "admin") return null;
    return { user, profile };
  } catch { return null; }
}

export async function requireAdmin() {
  const result = await getAdminUser();
  if (!result) redirect("/connexion");
  return result;
}
