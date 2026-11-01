"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import type { Product } from "@/lib/types";

const categories = [{ slug: "tous", name: "Tout voir" }, { slug: "smartphones", name: "iPhone" }, { slug: "consoles", name: "Consoles" }, { slug: "audio", name: "Audio" }, { slug: "accessoires", name: "Accessoires" }];

export function CatalogBrowser({ products, initialQuery = "", initialCategory = "tous", offersOnly = false }: { products: Product[]; initialQuery?: string; initialCategory?: string; offersOnly?: boolean }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("featured");
  const [discountOnly, setDiscountOnly] = useState(offersOnly);
  const visible = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("fr");
    return products.filter((product) => {
      const matchesCategory = category === "tous" || product.categorySlug === category;
      const matchesSearch = !term || `${product.name} ${product.subtitle} ${product.categoryName}`.toLocaleLowerCase("fr").includes(term);
      const matchesSale = !discountOnly || Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
      return matchesCategory && matchesSearch && matchesSale;
    }).sort((a, b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : Number(b.featured) - Number(a.featured));
  }, [products, query, category, sort, discountOnly]);

  return <div>
    <div className="flex flex-col gap-4 border-y border-black/[.06] py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">{categories.map((item) => <button type="button" key={item.slug} onClick={() => setCategory(item.slug)} className={`rounded-full px-4 py-2.5 text-[11px] font-bold transition ${category === item.slug ? "bg-ink text-white" : "bg-white text-[#747885] hover:bg-[#eeeff5]"}`}>{item.name}</button>)}</div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex h-10 min-w-[200px] items-center gap-2 rounded-full border border-line bg-white px-3.5"><Search size={14} className="text-muted"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher…" aria-label="Rechercher dans le catalogue" className="w-full bg-transparent text-xs outline-none" />{query && <button aria-label="Effacer la recherche" onClick={() => setQuery("")}><X size={14} /></button>}</label>
        <label className="flex h-10 items-center gap-2 rounded-full border border-line bg-white px-3.5 text-xs"><SlidersHorizontal size={14} className="text-muted"/><span className="sr-only">Trier</span><select aria-label="Trier les produits" value={sort} onChange={(event) => setSort(event.target.value)} className="max-w-[135px] bg-transparent outline-none"><option value="featured">Pertinence</option><option value="price-asc">Prix croissant</option><option value="price-desc">Prix décroissant</option></select></label>
      </div>
    </div>
    <div className="flex items-center justify-between py-5"><p className="text-xs text-muted">{visible.length} {visible.length > 1 ? "produits" : "produit"}</p><button type="button" onClick={() => setDiscountOnly((value) => !value)} className={`rounded-full px-3.5 py-2 text-[10px] font-bold transition ${discountOnly ? "bg-[#fff0e9] text-[#d85d36]" : "bg-white text-muted hover:text-ink"}`}>{discountOnly ? "Offres activées" : "Voir les offres"}</button></div>
    {visible.length ? <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">{visible.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div> : <div className="rounded-[22px] border border-dashed border-[#d9dbe3] bg-white py-20 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0f1ff] text-brand"><Search size={19} /></div><h2 className="mt-4 font-display text-lg font-bold">Aucun résultat</h2><p className="mt-2 text-sm text-muted">Modifiez les filtres ou essayez un autre terme.</p><button type="button" onClick={() => { setQuery(""); setCategory("tous"); setDiscountOnly(false); }} className="mt-5 text-xs font-bold text-brand underline underline-offset-4">Réinitialiser les filtres</button></div>}
  </div>;
}
