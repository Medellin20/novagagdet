import { Resend } from "resend";
import { NextResponse, type NextRequest } from "next/server";
import { checkoutSchema } from "@/lib/validators";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { hasSupabaseServerConfig } from "@/lib/supabase/env";
import { orderReference } from "@/lib/format";

export const runtime = "nodejs";

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

function errorResponse(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!hasSupabaseServerConfig()) return errorResponse("La boutique n’est pas encore connectée à Supabase. La commande n’a pas été enregistrée.", 503);
  let input: unknown;
  try { input = await request.json(); } catch { return errorResponse("Le formulaire de commande est illisible.", 400); }
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? "Vérifiez les informations de votre commande.", 400);

  const supabase = createSupabaseAdmin();
  const { data: savedOrder, error: saveError } = await supabase.rpc("place_order", {
    p_customer: parsed.data.customer,
    p_items: parsed.data.items.map((item) => ({ variant_id: item.variantId, quantity: item.quantity })),
    p_promo_code: parsed.data.promoCode || null,
  });

  if (saveError || !savedOrder || typeof savedOrder !== "object") {
    const message = saveError?.message ?? "La commande n’a pas pu être enregistrée.";
    if (message.includes("insufficient_stock")) return errorResponse("Le stock a changé. Actualisez votre panier puis réessayez.", 409);
    if (message.includes("invalid_promotion")) return errorResponse("Ce code promotionnel n’est plus valide.", 400);
    if (message.includes("product_unavailable")) return errorResponse("Un produit de votre panier n’est plus disponible.", 409);
    if (message.includes("invalid_customer") || message.includes("invalid_delivery") || message.includes("invalid_quantity")) return errorResponse("Vérifiez les coordonnées et les quantités indiquées.", 400);
    console.error("Échec d’enregistrement de la commande Supabase", { code: saveError?.code });
    return errorResponse("La commande n’a pas pu être enregistrée. Réessayez dans quelques instants.", 500);
  }

  const saved = savedOrder as { id?: string; order_number?: number; total?: number };
  if (!saved.id || !saved.order_number) return errorResponse("La commande a été enregistrée, mais sa référence ne peut pas être récupérée.", 500);
  const reference = orderReference(saved.order_number);

  // La lecture détaillée et l’email arrivent après le retour réussi de la transaction place_order.
  const { data: order, error: detailsError } = await supabase.from("orders")
    .select("id,order_number,subtotal,discount_amount,total,promo_code,created_at,customer:customers(full_name,email,phone,address,postal_code,city,country),order_items(product_name,variant_name,variant_value,quantity,unit_price,line_total)")
    .eq("id", saved.id).single();

  let emailSent = false;
  if (detailsError || !order) {
    console.error("Commande enregistrée; détails indisponibles pour l’alerte email", { order: reference, code: detailsError?.code });
  } else if (process.env.RESEND_API_KEY && process.env.ALERT_EMAIL) {
    type CustomerInfo = { full_name: string; email: string; phone: string; address: string; postal_code: string; city: string; country: string };
    const customerRows = order.customer as unknown as CustomerInfo | CustomerInfo[] | null;
    const customer = Array.isArray(customerRows) ? customerRows[0] : customerRows;
    const items = (order.order_items as { product_name: string; variant_name: string; variant_value: string; quantity: number; unit_price: number; line_total: number }[]) ?? [];
    const linesText = items.map((item) => `${item.quantity} × ${item.product_name} — ${item.variant_name} ${item.variant_value} (${Number(item.line_total).toFixed(2)} €)`).join("\n");
    const linesHtml = items.map((item) => `<tr><td style="padding:10px 8px;border-bottom:1px solid #eee">${escapeHtml(item.product_name)}<br><span style="color:#777;font-size:12px">${escapeHtml(item.variant_name)} : ${escapeHtml(item.variant_value)}</span></td><td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:center">${Number(item.quantity)}</td><td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right">${Number(item.line_total).toFixed(2)} €</td></tr>`).join("");
    const safeName = escapeHtml(customer?.full_name);
    const safeAddress = escapeHtml([customer?.address, `${customer?.postal_code ?? ""} ${customer?.city ?? ""}`, customer?.country].filter(Boolean).join(", "));
    const emailHtml = `<div style="font-family:Arial,sans-serif;color:#171923;max-width:680px;margin:auto"><div style="background:#171923;color:white;padding:24px 28px;border-radius:16px 16px 0 0"><p style="margin:0 0 8px;color:#aab3ff;font-size:12px;letter-spacing:2px;text-transform:uppercase">Nouvelle commande</p><h1 style="margin:0;font-size:26px">${escapeHtml(reference)}</h1></div><div style="padding:24px 28px;border:1px solid #eee;border-top:0"><h2 style="font-size:17px">${safeName}</h2><p style="line-height:1.7;color:#555">${escapeHtml(customer?.email)}<br>${escapeHtml(customer?.phone)}<br>${safeAddress}</p><table style="width:100%;border-collapse:collapse;margin:24px 0"><thead><tr><th style="text-align:left;padding:8px">Produit</th><th>Qté</th><th style="text-align:right">Total</th></tr></thead><tbody>${linesHtml}</tbody></table><p style="text-align:right;font-size:19px;font-weight:bold">Total : ${Number(order.total).toFixed(2)} €</p></div></div>`;
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Nova Boutique <onboarding@resend.dev>",
        to: [process.env.ALERT_EMAIL],
        subject: `Nouvelle commande ${reference} · ${Number(order.total).toFixed(2)} €`,
        html: emailHtml,
        text: `Nouvelle commande ${reference}\nClient : ${customer?.full_name}\nEmail : ${customer?.email}\nTéléphone : ${customer?.phone}\nAdresse : ${safeAddress}\n\nProduits :\n${linesText}\n\nTotal : ${Number(order.total).toFixed(2)} €`,
      });
      if (error) console.error("Resend n’a pas accepté l’alerte de commande", { name: error.name, statusCode: error.statusCode });
      else emailSent = true;
    } catch (error) {
      console.error("Erreur Resend après enregistrement de la commande", error instanceof Error ? error.message : "unknown");
    }
  }

  return NextResponse.json({ ok: true, order: { id: saved.id, reference, total: Number(saved.total ?? order?.total ?? 0) }, emailSent }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
