"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { NovaMark } from "@/components/store/brand";
import { useCart } from "@/context/cart-context";
import { LanguageSelector } from "@/components/store/language-selector";

export function StoreHeader({ storeName = "Nova", announcement = "La sélection du moment, à prix léger." }: { storeName?: string; announcement?: string }) {
  const { itemCount } = useCart();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/catalogue?q=${encodeURIComponent(value)}` : "/catalogue");
    setMenuOpen(false);
  }

  return (
    <>
      <div className="bg-ink text-white">
        <div className="page-shell flex min-h-9 items-center justify-center gap-2 text-center text-[11px] tracking-wide sm:text-xs">
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[.13em]">{storeName}</span>
          <span>{announcement}</span>
          <Link href="/catalogue" className="hidden font-semibold text-white/75 underline underline-offset-4 sm:inline">Découvrir</Link>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-black/[.055] bg-paper/95 backdrop-blur-xl">
        <div className="page-shell flex h-[76px] items-center gap-3 xl:gap-8">
          <NovaMark label={storeName} />
          <nav aria-label="Navigation principale" className="hidden items-center gap-7 text-[13px] font-medium text-[#4e5260] lg:flex">
            <Link className="transition hover:text-brand" href="/catalogue?categorie=smartphones">iPhone</Link>
            <Link className="transition hover:text-brand" href="/catalogue?categorie=consoles">Consoles</Link>
            <Link className="transition hover:text-brand" href="/catalogue?categorie=accessoires">Accessoires &amp; Jeux</Link>
            <Link className="transition hover:text-brand" href="/catalogue?offres=1">Offres</Link>
          </nav>
          <form onSubmit={search} className="ml-auto hidden w-full max-w-[310px] items-center rounded-full border border-[#e7e7e3] bg-white px-4 py-2.5 md:flex">
            <Search size={16} className="shrink-0 text-[#8b8e99]" />
            <input aria-label="Rechercher un produit" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Un produit, une envie…" className="ml-2.5 min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#a0a3ad]" />
            <kbd className="rounded border border-[#eee] px-1.5 py-0.5 text-[9px] text-[#9b9da7]">↵</kbd>
          </form>
          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <LanguageSelector />
            <Link href="/panier" aria-label={`Panier, ${itemCount} article${itemCount > 1 ? "s" : ""}`} className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink transition hover:bg-[#eceefb]">
              <ShoppingBag size={18} strokeWidth={1.8} />
              {itemCount > 0 && <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{itemCount > 9 ? "9+" : itemCount}</span>}
            </Link>
            <button type="button" aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setMenuOpen((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-full text-ink md:hidden">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
        {menuOpen && <div className="border-t border-line bg-paper px-4 pb-5 pt-4 md:hidden">
          <form onSubmit={search} className="mb-4 flex items-center rounded-xl border border-line bg-white px-3 py-3"><Search size={16} className="text-muted" /><input aria-label="Rechercher un produit" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un produit…" className="ml-2 min-w-0 flex-1 bg-transparent text-sm outline-none" /></form>
          <div className="grid gap-1 text-sm font-semibold">{[["iPhone", "smartphones"], ["Consoles", "consoles"], ["Accessoires & Jeux", "accessoires"], ["Toutes les offres", "tous"]].map(([label, slug]) => <Link onClick={() => setMenuOpen(false)} key={slug} className="rounded-lg px-3 py-3 hover:bg-white" href={`/catalogue?categorie=${slug}`}>{label}</Link>)}</div>
        </div>}
      </header>
    </>
  );
}
