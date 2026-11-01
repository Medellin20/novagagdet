import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { hasSupabaseServerConfig } from "@/lib/supabase/env";
import { getAdminUser } from "@/lib/supabase/auth";
import { productInputSchema, promotionInputSchema } from "@/lib/validators";

export const runtime = "nodejs";
type Context = { params: Promise<{ slug: string[] }> };
const statusSchema = z.enum(["pending", "confirmed", "preparing", "shipped", "delivered", "cancelled"]);
const jsonError = (message: string, status = 400) => NextResponse.json({ ok: false, error: message }, { status, headers: { "Cache-Control": "no-store" } });
const jsonOk = (data: unknown, status = 200) => NextResponse.json({ ok: true, data }, { status, headers: { "Cache-Control": "no-store" } });

async function dispatch(request: NextRequest, context: Context, method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE") {
  if (!await getAdminUser()) return jsonError("Connexion administrateur requise.", 401);
  if (!hasSupabaseServerConfig()) return jsonError("Supabase n’est pas configuré.", 503);
  const { slug = [] } = await context.params;
  const [resource, id] = slug;
  const supabase = createSupabaseAdmin();
  const body = method === "GET" || method === "DELETE" ? null : await request.json().catch(() => null);

  if (method === "GET") {
    if (resource === "products") {
      const { data, error } = await supabase.from("products")
        .select("id,slug,name,subtitle,description,price,compare_at_price,image_url,stock,featured,active,category_id,categories(slug,name),product_variants(id,name,value,price_delta,stock,sku)")
        .order("created_at", { ascending: false });
      if (error) return jsonError("Impossible de charger les produits.", 500);
      return jsonOk(data ?? []);
    }
    if (resource === "orders") {
      const query = supabase.from("orders").select("id,order_number,status,subtotal,discount_amount,total,promo_code,created_at,customer:customers(full_name,email,phone,address,postal_code,city,country),order_items(product_name,variant_name,variant_value,quantity,unit_price,line_total)").order("created_at", { ascending: false }).limit(250);
      const { data, error } = await query;
      if (error) return jsonError("Impossible de charger les commandes.", 500);
      return jsonOk(data ?? []);
    }
    if (resource === "customers") {
      const { data, error } = await supabase.from("customers").select("id,full_name,email,phone,address,postal_code,city,country,created_at,orders(id,order_number,total,status,created_at)").order("created_at", { ascending: false }).limit(500);
      if (error) return jsonError("Impossible de charger les clients.", 500);
      return jsonOk(data ?? []);
    }
    if (resource === "promotions") {
      const { data, error } = await supabase.from("promotions").select("*").order("created_at", { ascending: false });
      if (error) return jsonError("Impossible de charger les promotions.", 500);
      return jsonOk(data ?? []);
    }
    if (resource === "settings") {
      const { data, error } = await supabase.from("store_settings").select("key,value");
      if (error) return jsonError("Impossible de charger les paramètres.", 500);
      return jsonOk(Object.fromEntries((data ?? []).map((row) => [row.key, row.value])));
    }
    if (resource === "metrics") {
      const [ordersResult, customerResult, productResult] = await Promise.all([
        supabase.from("orders").select("id,total,status,created_at").order("created_at", { ascending: false }).limit(1000),
        supabase.from("customers").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id,stock,active", { count: "exact" }),
      ]);
      if (ordersResult.error || customerResult.error || productResult.error) return jsonError("Impossible de calculer les statistiques.", 500);
      const orders = ordersResult.data ?? [];
      const validOrders = orders.filter((order) => order.status !== "cancelled");
      const revenue = validOrders.reduce((sum, order) => sum + Number(order.total), 0);
      const monthPrefix = new Date().toISOString().slice(0, 7);
      const currentMonthRevenue = validOrders.filter((order) => order.created_at.startsWith(monthPrefix)).reduce((sum, order) => sum + Number(order.total), 0);
      const lowStock = (productResult.data ?? []).filter((product) => product.active && Number(product.stock) <= 5).length;
      return jsonOk({ totalOrders: orders.length, validOrders: validOrders.length, revenue, currentMonthRevenue, customers: customerResult.count ?? 0, activeProducts: (productResult.data ?? []).filter((product) => product.active).length, lowStock, recentOrders: orders.slice(0, 6) });
    }
    return jsonError("Ressource administrateur inconnue.", 404);
  }

  if (resource === "products" && (method === "POST" || method === "PUT" || method === "PATCH")) {
    const parsed = productInputSchema.safeParse(body);
    if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Vérifiez les informations du produit.");
    if (method !== "POST" && !id) return jsonError("Identifiant produit manquant.");
    const { variants, category_slug, ...fields } = parsed.data;
    const { data: category, error: categoryError } = await supabase.from("categories").select("id").eq("slug", category_slug).maybeSingle();
    if (categoryError || !category) return jsonError("Catégorie inconnue. Exécutez d’abord la migration Supabase.", 422);

    if (method === "POST") {
      const { data: product, error } = await supabase.from("products").insert({ ...fields, category_id: category.id }).select("id").single();
      if (error || !product) return jsonError(error?.code === "23505" ? "Ce slug est déjà utilisé." : "Le produit n’a pas pu être créé.", error?.code === "23505" ? 409 : 500);
      const { error: variantError } = await supabase.rpc("replace_product_variants", { p_product_id: product.id, p_variants: variants });
      if (variantError) {
        await supabase.from("products").delete().eq("id", product.id);
        return jsonError("Le produit a été annulé, car ses variantes n’ont pas pu être créées.", 500);
      }
      return jsonOk({ id: product.id }, 201);
    }

    const { error: updateError } = await supabase.from("products").update({ ...fields, category_id: category.id, updated_at: new Date().toISOString() }).eq("id", id);
    if (updateError) return jsonError(updateError.code === "23505" ? "Ce slug est déjà utilisé." : "Le produit n’a pas pu être modifié.", updateError.code === "23505" ? 409 : 500);
    const { error: variantError } = await supabase.rpc("replace_product_variants", { p_product_id: id, p_variants: variants });
    if (variantError) return jsonError("Le produit a été mis à jour, mais les variantes n’ont pas pu être enregistrées.", 500);
    return jsonOk({ id });
  }

  if (resource === "products" && method === "DELETE" && id) {
    const { error } = await supabase.from("products").update({ active: false, updated_at: new Date().toISOString() }).eq("id", id);
    return error ? jsonError("Le produit n’a pas pu être archivé.", 500) : jsonOk({ id, archived: true });
  }

  if (resource === "orders" && method === "PATCH" && id) {
    const parsed = z.object({ status: statusSchema }).safeParse(body);
    if (!parsed.success) return jsonError("Statut de commande invalide.");
    const { error } = await supabase.rpc("update_order_status", { p_order_id: id, p_status: parsed.data.status });
    if (error?.message.includes("order_not_found")) return jsonError("Commande introuvable.", 404);
    if (error?.message.includes("invalid_order_transition")) return jsonError("Cette transition n’est pas autorisée. Les commandes expédiées, livrées ou annulées sont terminales.", 409);
    return error ? jsonError("Le statut de commande n’a pas pu être modifié.", 500) : jsonOk({ id, status: parsed.data.status });
  }

  if (resource === "promotions" && method === "POST") {
    const parsed = promotionInputSchema.safeParse(body);
    if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Vérifiez la promotion.");
    const input = parsed.data;
    const { data, error } = await supabase.from("promotions").insert({ ...input, code: input.code.toUpperCase() }).select("id").single();
    if (error) return jsonError(error.code === "23505" ? "Ce code promo existe déjà." : "La promotion n’a pas pu être créée.", error.code === "23505" ? 409 : 500);
    return jsonOk(data, 201);
  }

  if (resource === "promotions" && method === "PUT" && id) {
    const parsed = promotionInputSchema.safeParse(body);
    if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Vérifiez la promotion.");
    const { error } = await supabase.from("promotions").update({ ...parsed.data, code: parsed.data.code.toUpperCase() }).eq("id", id);
    return error ? jsonError(error.code === "23505" ? "Ce code promo existe déjà." : "La promotion n’a pas pu être modifiée.", error.code === "23505" ? 409 : 500) : jsonOk({ id });
  }

  if (resource === "promotions" && method === "DELETE" && id) {
    const { error } = await supabase.from("promotions").delete().eq("id", id);
    return error ? jsonError("La promotion n’a pas pu être supprimée.", 500) : jsonOk({ id });
  }

  if (resource === "settings" && (method === "PUT" || method === "PATCH")) {
    const parsed = z.object({
      store_name: z.string().trim().min(1).max(80),
      announcement: z.string().trim().max(180),
      support_email: z.string().trim().email().max(254),
    }).strict().safeParse(body);
    if (!parsed.success) return jsonError("Paramètres invalides.");
    const values = Object.entries(parsed.data).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
    const { error } = await supabase.from("store_settings").upsert(values, { onConflict: "key" });
    return error ? jsonError("Les paramètres n’ont pas pu être enregistrés.", 500) : jsonOk({ saved: values.length });
  }

  return jsonError("Opération administrateur inconnue.", 404);
}

export const GET = (request: NextRequest, context: Context) => dispatch(request, context, "GET");
export const POST = (request: NextRequest, context: Context) => dispatch(request, context, "POST");
export const PATCH = (request: NextRequest, context: Context) => dispatch(request, context, "PATCH");
export const PUT = (request: NextRequest, context: Context) => dispatch(request, context, "PUT");
export const DELETE = (request: NextRequest, context: Context) => dispatch(request, context, "DELETE");
