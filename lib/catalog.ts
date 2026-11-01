import "server-only";
import { demoProducts } from "@/lib/catalog-demo";
import { hasSupabaseServerConfig } from "@/lib/supabase/env";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { Product } from "@/lib/types";

const selection = "id,slug,name,subtitle,description,price,compare_at_price,image_url,featured,active,categories(slug,name),product_variants(id,name,value,price_delta,stock,sku)";

function mapProduct(row: Record<string, unknown>): Product {
  const category = row.categories as { slug?: string; name?: string } | null;
  const variants = (row.product_variants as Record<string, unknown>[] | null) ?? [];
  return {
    id: String(row.id), slug: String(row.slug), name: String(row.name), subtitle: String(row.subtitle ?? ""), description: String(row.description ?? ""),
    price: Number(row.price), compareAtPrice: row.compare_at_price == null ? null : Number(row.compare_at_price), imageUrl: String(row.image_url ?? "/images/iphone-16-pro.png"),
    categorySlug: String(category?.slug ?? "accessoires"), categoryName: String(category?.name ?? "Accessoires"), featured: Boolean(row.featured),
    stock: variants.reduce((sum, variant) => sum + Number(variant.stock ?? 0), 0), badge: null,
    variants: variants.map((variant) => ({ id: String(variant.id), name: String(variant.name), value: String(variant.value), priceDelta: Number(variant.price_delta ?? 0), stock: Number(variant.stock ?? 0), sku: variant.sku ? String(variant.sku) : undefined })),
  };
}

export async function getProducts(options: { includeInactive?: boolean } = {}): Promise<Product[]> {
  if (!hasSupabaseServerConfig()) return demoProducts;
  const client = createSupabaseAdmin();
  let query = client.from("products").select(selection).order("featured", { ascending: false }).order("created_at", { ascending: false });
  if (!options.includeInactive) query = query.eq("active", true);
  const { data, error } = await query;
  if (error) throw new Error(`Impossible de charger le catalogue : ${error.message}`);
  return (data ?? []).map((row) => mapProduct(row as unknown as Record<string, unknown>));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export async function isDemoCatalog(): Promise<boolean> {
  return !hasSupabaseServerConfig();
}
