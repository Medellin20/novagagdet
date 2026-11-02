"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { productCategories, categoryDisplayName } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import { Boxes, Check, Gamepad2, ImagePlus, LoaderCircle, Pencil, Plus, Save, Trash2, Upload, X } from "lucide-react";

type VariantRow = { id: string; name: string; value: string; price_delta: number; stock: number; sku: string | null };
type ProductRow = { id: string; slug: string; name: string; subtitle: string; description: string; price: number; compare_at_price: number | null; image_url: string; stock: number; featured: boolean; active: boolean; category_id: string; categories: { slug: string; name: string } | null; product_variants: VariantRow[] };
type FormState = { id: string; name: string; slug: string; category_slug: string; subtitle: string; description: string; price: string; compare_at_price: string; image_url: string; featured: boolean; active: boolean; variantsText: string };
const blank: FormState = { id: "", name: "", slug: "", category_slug: "smartphones", subtitle: "", description: "", price: "", compare_at_price: "", image_url: "", featured: false, active: true, variantsText: "Version|Standard|0|10|" };
const categories = productCategories;

export function ProductsManager() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [form, setForm] = useState<FormState>(blank);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/products", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Chargement impossible.");
      setProducts(result.data as ProductRow[]);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Chargement impossible."); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  function startEdit(product: ProductRow) {
    setError(""); setMessage("");
    setForm({ id: product.id, name: product.name, slug: product.slug, category_slug: product.categories?.slug ?? "accessoires", subtitle: product.subtitle ?? "", description: product.description ?? "", price: String(product.price), compare_at_price: product.compare_at_price == null ? "" : String(product.compare_at_price), image_url: product.image_url, featured: product.featured, active: product.active, variantsText: (product.product_variants ?? []).map((variant) => `${variant.name}|${variant.value}|${variant.price_delta}|${variant.stock}|${variant.sku ?? ""}`).join("\n") || blank.variantsText });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImage(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) { setError("Choisissez une image PNG, JPEG ou WebP de 5 Mo maximum."); return; }
    setError(""); setUploading(true);
    try {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${crypto.randomUUID()}.${extension}`;
      const storage = createSupabaseBrowser().storage.from("product-images");
      const { data, error: uploadError } = await storage.upload(path, file, { upsert: false, contentType: file.type });
      if (uploadError) throw uploadError;
      const { data: publicUrl } = storage.getPublicUrl(data.path);
      setForm((current) => ({ ...current, image_url: publicUrl.publicUrl }));
      setMessage("Image envoyée dans Supabase Storage.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "L’image n’a pas pu être envoyée."); }
    finally { setUploading(false); }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage(""); setSaving(true);
    const variants = form.variantsText.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
      const [name, value, price_delta, stock, sku] = line.split("|").map((part) => part.trim());
      return { name, value, price_delta: Number(price_delta), stock: Number(stock), sku: sku || null };
    });
    if (!variants.length || variants.some((variant) => !variant.name || !variant.value || !Number.isFinite(variant.price_delta) || !Number.isInteger(variant.stock) || variant.stock < 0)) {
      setError("Vérifiez les variantes : Nom|Valeur|Supplément|Stock|SKU."); setSaving(false); return;
    }
    const payload = { name: form.name, slug: form.slug, category_slug: form.category_slug, subtitle: form.subtitle, description: form.description, price: Number(form.price), compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null, image_url: form.image_url, featured: form.featured, active: form.active, variants };
    try {
      const response = await fetch(form.id ? `/api/admin/products/${form.id}` : "/api/admin/products", { method: form.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Enregistrement impossible.");
      setMessage(form.id ? "Produit mis à jour." : "Produit ajouté au catalogue."); setForm(blank); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Enregistrement impossible."); }
    finally { setSaving(false); }
  }

  async function archive(product: ProductRow) {
    if (!window.confirm(`Archiver « ${product.name} » ? Il ne sera plus visible en boutique.`)) return;
    setError("");
    const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok || !result.ok) { setError(result.error ?? "Archivage impossible."); return; }
    if (form.id === product.id) setForm(blank);
    setMessage("Produit archivé."); await load();
  }

  return <div className="grid items-start gap-6 xl:grid-cols-[.9fr_1.1fr]">
    <section className="rounded-[20px] border border-black/[.045] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3"><div><p className="eyebrow admin-eyebrow">Catalogue</p><h2 className="font-display mt-2 text-xl font-extrabold tracking-[-.05em]">{form.id ? "Modifier le produit" : "Ajouter un produit"}</h2><p className="mt-1 text-[11px] text-muted">Les variantes définissent le prix additionnel et le stock réel.</p></div>{form.id && <button type="button" onClick={() => { setForm(blank); setMessage(""); setError(""); }} aria-label="Annuler la modification" className="rounded-full p-2 text-muted hover:bg-[#f4f4f7]"><X size={16}/></button>}</div>
      {!form.id && <button type="button" onClick={() => { setForm({ ...blank, category_slug: "accessoires", variantsText: "Édition|Standard|0|0|" }); setMessage(""); setError(""); }} className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-bold text-brand hover:bg-[#eff0ff]"><Gamepad2 size={16}/>Ajouter un jeu</button>}
      {form.category_slug === "accessoires" && <p className="mt-3 text-xs leading-5 text-muted">Ajoutez vos accessoires et jeux ici. Pour un jeu, précisez la plateforme dans l’accroche (PS5, PS4, Xbox, Switch, PC…) et renseignez le stock dans les variantes.</p>}
      {error && <div role="alert" className="mt-5 rounded-xl bg-[#fff1ef] p-3 text-xs leading-5 text-[#a3433b]">{error}</div>}{message && <div role="status" className="mt-5 rounded-xl bg-[#ecf8f0] p-3 text-xs leading-5 text-[#39785e]">{message}</div>}
      <form onSubmit={save} className="mt-5 grid gap-3.5">
        <div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-1.5 text-[10px] font-bold">Nom<input required minLength={2} maxLength={120} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="h-10 rounded-lg border border-line px-3 text-xs font-normal outline-none focus:border-brand" placeholder="iPhone 16 Pro"/></label><label className="grid gap-1.5 text-[10px] font-bold">Slug URL<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="h-10 rounded-lg border border-line px-3 text-xs font-normal outline-none focus:border-brand" placeholder="iphone-16-pro"/></label></div>
        <label className="grid gap-1.5 text-[10px] font-bold">Catégorie<select value={form.category_slug} onChange={(event) => setForm({ ...form, category_slug: event.target.value })} className="h-10 rounded-lg border border-line bg-white px-3 text-xs font-normal outline-none focus:border-brand">{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
        <div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-1.5 text-[10px] font-bold">Prix de base (€)<input required type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="h-10 rounded-lg border border-line px-3 text-xs font-normal outline-none focus:border-brand" placeholder="1229"/></label><label className="grid gap-1.5 text-[10px] font-bold">Prix barré (€)<input type="number" min="0" step="0.01" value={form.compare_at_price} onChange={(event) => setForm({ ...form, compare_at_price: event.target.value })} className="h-10 rounded-lg border border-line px-3 text-xs font-normal outline-none focus:border-brand" placeholder="Optionnel"/></label></div>
        <label className="grid gap-1.5 text-[10px] font-bold">Accroche<input maxLength={180} value={form.subtitle} onChange={(event) => setForm({ ...form, subtitle: event.target.value })} className="h-10 rounded-lg border border-line px-3 text-xs font-normal outline-none focus:border-brand" placeholder="Titane naturel · 128 Go"/></label>
        <label className="grid gap-1.5 text-[10px] font-bold">Description<textarea rows={3} maxLength={3000} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="rounded-lg border border-line px-3 py-2.5 text-xs font-normal leading-5 outline-none focus:border-brand" placeholder="Description produit…"/></label>
        <div className="grid gap-2"><label className="grid gap-1.5 text-[10px] font-bold">URL de l’image<input required maxLength={800} value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} className="h-10 rounded-lg border border-line px-3 text-xs font-normal outline-none focus:border-brand" placeholder="https://…"/></label><label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-line px-3.5 py-2 text-[10px] font-bold transition hover:border-brand hover:text-brand">{uploading ? <LoaderCircle size={14} className="animate-spin"/> : <ImagePlus size={14}/>}Téléverser vers Supabase Storage<input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={(event) => void uploadImage(event.target.files?.[0])} className="sr-only"/></label></div>
        <label className="grid gap-1.5 text-[10px] font-bold">Variantes — une ligne par choix<textarea required rows={4} value={form.variantsText} onChange={(event) => setForm({ ...form, variantsText: event.target.value })} className="rounded-lg border border-line px-3 py-2.5 font-mono text-[10px] leading-5 outline-none focus:border-brand" placeholder="Stockage|128 Go|0|8|SKU-128"/><span className="font-normal text-muted">Format : Nom|Valeur|Supplément €|Stock|SKU. Les champs se séparent par une barre verticale.</span></label>
        <div className="flex flex-wrap gap-4 text-[10px] font-semibold"><label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} className="accent-[#4f63f7]"/>Visible en boutique</label><label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} className="accent-[#4f63f7]"/>À la une</label></div>
        <button disabled={saving || uploading} className="mt-1 flex h-11 items-center justify-center gap-2 rounded-full bg-brand text-xs font-bold text-white transition hover:bg-brand-dark disabled:opacity-60">{saving ? <LoaderCircle size={15} className="animate-spin"/> : form.id ? <Save size={15}/> : <Plus size={15}/>} {saving ? "Enregistrement…" : form.id ? "Enregistrer les modifications" : "Ajouter au catalogue"}</button>
      </form>
    </section>
    <section className="overflow-hidden rounded-[20px] border border-black/[.045] bg-white">
      <div className="flex items-center justify-between border-b border-line px-5 py-4"><div><h2 className="font-display text-sm font-extrabold">Produits</h2><p className="mt-1 text-[10px] text-muted">{products.length} référence{products.length > 1 ? "s" : ""}</p></div><button type="button" onClick={() => void load()} aria-label="Actualiser les produits" className="rounded-full p-2 text-muted hover:bg-[#f4f4f7]"><Boxes size={16}/></button></div>
      {loading ? <p className="p-8 text-center text-xs text-muted">Chargement du catalogue…</p> : products.length ? <div className="divide-y divide-[#f0f0ef]">{products.map((product) => <article key={product.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5"><div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f2f2f0]"><img src={product.image_url} alt="" className="h-full w-full object-contain p-1.5"/></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="truncate text-xs font-bold">{product.name}</p><span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${product.active ? "bg-[#eaf6ef] text-[#36815e]" : "bg-[#f1f1f3] text-[#888b94]"}`}>{product.active ? "Actif" : "Archivé"}</span></div><p className="mt-1 text-[10px] text-muted">{categoryDisplayName(product.categories?.slug, product.categories?.name ?? "—")} · {product.stock} en stock · {formatPrice(Number(product.price))}</p></div><button type="button" onClick={() => startEdit(product)} aria-label={`Modifier ${product.name}`} className="rounded-full p-2.5 text-muted transition hover:bg-[#eff0ff] hover:text-brand"><Pencil size={14}/></button><button type="button" onClick={() => void archive(product)} aria-label={`Archiver ${product.name}`} className="rounded-full p-2.5 text-muted transition hover:bg-[#fff0ee] hover:text-[#b54b44]"><Trash2 size={14}/></button></article>)}</div> : <div className="p-10 text-center"><p className="text-xs text-muted">Aucun produit trouvé.</p><p className="mt-1 text-[10px] text-muted">Exécutez la migration Supabase pour charger les références d’exemple.</p></div>}
    </section>
  </div>;
}
