"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/cart-context";

export function ProductDetail({ product }: { product: Product }) {
  const [variantIndex, setVariantIndex] = useState(() => Math.max(0, product.variants.findIndex((item) => item.stock > 0)));
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const variant = product.variants[variantIndex];
  const price = product.price + (variant?.priceDelta ?? 0);
  const stock = variant?.stock ?? product.stock;
  const canBuy = Boolean(variant && stock > 0);

  function add() {
    if (!variant || !canBuy) return;
    addItem(product, variant, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return <div className="page-shell pb-20 pt-8 sm:pt-12">
    <Link href="/catalogue" className="inline-flex items-center gap-2 text-xs font-semibold text-muted transition hover:text-brand"><ArrowLeft size={14}/> Retour au catalogue</Link>
    <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_.86fr] lg:gap-16">
      <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[28px] bg-[#eeefed] p-8 sm:min-h-[580px] sm:p-14"><img src={product.imageUrl} alt={product.name} className="max-h-[490px] w-full object-contain drop-shadow-[0_25px_35px_rgba(20,24,40,.12)]" />{product.badge && <span className="absolute left-5 top-5 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-brand">{product.badge}</span>}</div>
      <div className="flex flex-col justify-center py-1 lg:py-8"><p className="eyebrow">{product.categoryName}</p><h1 className="font-display mt-4 text-[clamp(38px,5vw,58px)] font-extrabold leading-[1.02] tracking-[-.07em]">{product.name}</h1><p className="mt-3 text-sm text-muted">{product.subtitle}</p><div className="mt-6 flex items-baseline gap-3"><span className="font-display text-3xl font-extrabold tracking-[-.04em]">{formatPrice(price)}</span>{product.compareAtPrice && product.compareAtPrice > price && <span className="text-sm text-muted line-through">{formatPrice(product.compareAtPrice)}</span>}</div>
        <p className="mt-6 max-w-xl text-sm leading-7 text-[#686c79]">{product.description}</p>
        {product.variants.length > 0 && <div className="mt-8"><div className="mb-3 flex items-center justify-between"><p className="text-xs font-bold">{product.variants[0].name}</p><span className="text-[11px] text-muted">{product.variants.length} options</span></div><div className="flex flex-wrap gap-2">{product.variants.map((item, index) => <button key={item.id} type="button" onClick={() => { setVariantIndex(index); setQuantity(1); }} className={`rounded-xl border px-4 py-3 text-left transition ${variantIndex === index ? "border-brand bg-[#f0f1ff] text-brand" : "border-line bg-white text-ink hover:border-[#bdc4ff]"}`}><span className="block text-xs font-bold">{item.value}</span>{item.priceDelta !== 0 && <span className="mt-1 block text-[10px]">{item.priceDelta > 0 ? "+" : "−"}{formatPrice(Math.abs(item.priceDelta))}</span>}</button>)}</div></div>}
        <div className="mt-8 flex flex-wrap items-center gap-3"><div className="flex h-12 items-center rounded-full border border-line bg-white"><button aria-label="Diminuer la quantité" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex h-11 w-10 items-center justify-center text-muted disabled:opacity-30"><Minus size={15}/></button><span className="min-w-7 text-center text-xs font-bold">{quantity}</span><button aria-label="Augmenter la quantité" disabled={quantity >= Math.min(20, stock)} onClick={() => setQuantity((value) => Math.min(Math.min(20, stock), value + 1))} className="flex h-11 w-10 items-center justify-center text-muted disabled:opacity-30"><Plus size={15}/></button></div><button type="button" disabled={!canBuy} onClick={add} className="focus-ring flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand px-7 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-[#b6bbd8]">{added ? <><Check size={17}/> Ajouté au panier</> : <><ShoppingBag size={17}/> {canBuy ? "Ajouter au panier" : "Indisponible"}</>}</button></div>
        <div className="mt-5 text-xs">{stock > 0 ? <span className="font-semibold text-[#318065]">● En stock — {stock} disponible{stock > 1 ? "s" : ""}</span> : <span className="font-semibold text-[#b24d47]">● Indisponible actuellement</span>}</div>
        <div className="mt-8 grid gap-3 border-t border-line pt-6 text-xs text-[#686c79] sm:grid-cols-2"><p className="flex items-center gap-2"><Truck size={15} className="text-brand"/> Livraison suivie</p><p className="flex items-center gap-2"><ShieldCheck size={15} className="text-brand"/> Garantie constructeur</p></div>
      </div>
    </div>
  </div>;
}
