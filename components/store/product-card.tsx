"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/cart-context";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const firstVariant = product.variants.find((variant) => variant.stock > 0) ?? product.variants[0];
  const price = product.price + (firstVariant?.priceDelta ?? 0);
  const salePercent = product.compareAtPrice && product.compareAtPrice > price ? Math.round((1 - price / product.compareAtPrice) * 100) : 0;

  function addToCart() {
    if (!firstVariant) return;
    addItem(product, firstVariant);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="card-lift group relative flex flex-col rounded-[22px] border border-black/[.045] bg-white p-3.5 sm:p-4">
      {product.badge && <span className="absolute left-5 top-5 z-10 rounded-full bg-[#fff0e9] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.1em] text-[#d85d36]">{product.badge}</span>}
      {!product.badge && salePercent > 0 && <span className="absolute left-5 top-5 z-10 rounded-full bg-brand px-2.5 py-1 text-[9px] font-bold text-white">−{salePercent}%</span>}
      <Link href={`/produit/${product.slug}`} className="block overflow-hidden rounded-[16px] bg-[#f4f4f2] focus-ring">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden p-5 sm:aspect-[.96/1] sm:p-7">
          <img src={product.imageUrl} alt={product.name} loading={index < 3 ? "eager" : "lazy"} className="h-full w-full object-contain transition duration-500 ease-out group-hover:scale-[1.04]" />
          <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink shadow-sm transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><ArrowUpRight size={15} /></span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[#9295a0]">{product.categoryName}</p>
        <Link href={`/produit/${product.slug}`} className="mt-1.5 text-[15px] font-bold tracking-[-.03em] text-ink hover:text-brand">{product.name}</Link>
        <p className="mt-1 line-clamp-1 text-xs text-muted">{product.subtitle}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div><p className="text-[15px] font-extrabold tabular-nums text-ink">{formatPrice(price)}</p>{product.compareAtPrice && product.compareAtPrice > price && <p className="mt-0.5 text-[11px] text-[#a7a9b0] line-through">{formatPrice(product.compareAtPrice)}</p>}</div>
          <button type="button" onClick={addToCart} disabled={!firstVariant || product.stock <= 0} aria-label={`Ajouter ${product.name} au panier`} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f8] text-ink transition hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-40">{added ? <Check size={17} /> : <Plus size={17} />}</button>
        </div>
      </div>
    </article>
  );
}
