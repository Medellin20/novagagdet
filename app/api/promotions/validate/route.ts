import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { hasSupabaseServerConfig } from "@/lib/supabase/env";

const requestSchema = z.object({ code: z.string().trim().min(3).max(40), subtotal: z.number().nonnegative().max(1000000) });

export async function POST(request: NextRequest) {
  if (!hasSupabaseServerConfig()) return NextResponse.json({ ok: false, error: "Les codes promo seront disponibles après connexion à Supabase." }, { status: 503 });
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Code promotionnel ou panier invalide." }, { status: 400 });
  const { code, subtotal } = parsed.data;
  const { data, error } = await createSupabaseAdmin().from("promotions").select("code,description,discount_type,discount_value,active,starts_at,ends_at,usage_limit,used_count").ilike("code", code).maybeSingle();
  if (error || !data || !data.active || (data.starts_at && new Date(data.starts_at) > new Date()) || (data.ends_at && new Date(data.ends_at) < new Date()) || (data.usage_limit && data.used_count >= data.usage_limit)) {
    return NextResponse.json({ ok: false, error: "Ce code promotionnel n’est pas valide." }, { status: 404 });
  }
  const rawDiscount = data.discount_type === "percent" ? subtotal * Number(data.discount_value) / 100 : Number(data.discount_value);
  return NextResponse.json({ ok: true, code: data.code, description: data.description, discount: Math.min(subtotal, Math.round(rawDiscount * 100) / 100) }, { headers: { "Cache-Control": "no-store" } });
}
