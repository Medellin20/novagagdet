"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, Gauge, LogOut, Settings, ShoppingCart, TicketPercent, Users } from "lucide-react";
import { NovaMark } from "@/components/store/brand";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

const links = [
  { href: "/admin", label: "Vue d’ensemble", icon: Gauge },
  { href: "/admin/produits", label: "Produits", icon: Boxes },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/promotions", label: "Promotions", icon: TicketPercent },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export function AdminNav({ name }: { name?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  async function signOut() {
    try { await createSupabaseBrowser().auth.signOut(); } finally { router.replace("/connexion"); router.refresh(); }
  }
  return <>
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[230px] flex-col border-r border-black/[.055] bg-white px-4 py-5 lg:flex">
      <div className="flex items-center justify-between px-2"><NovaMark/><span className="rounded-full bg-[#f0f1ff] px-2 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-brand">Admin</span></div>
      <p className="mb-3 mt-10 px-3 text-[9px] font-bold uppercase tracking-[.16em] text-[#a0a3ad]">Gestion de la boutique</p>
      <nav className="grid gap-1">{links.map(({ href, label, icon: Icon }) => { const active = href === "/admin" ? pathname === href : pathname.startsWith(href); return <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-semibold transition ${active ? "bg-[#f0f1ff] text-brand" : "text-[#757987] hover:bg-[#f7f7fa] hover:text-ink"}`}><Icon size={16} strokeWidth={1.8}/>{label}{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand"/>}</Link>; })}</nav>
      <div className="mt-auto rounded-[16px] bg-[#f5f6fa] p-3.5"><p className="truncate text-xs font-bold">{name || "Administrateur"}</p><p className="mt-1 text-[10px] text-muted">Espace sécurisé</p><button onClick={signOut} className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-[#7a7e8b] hover:text-[#b64947]"><LogOut size={13}/> Se déconnecter</button></div>
    </aside>
    <div className="sticky top-0 z-30 border-b border-black/[.055] bg-white/95 px-4 py-3 backdrop-blur lg:hidden"><div className="flex items-center justify-between"><NovaMark compact/><button onClick={signOut} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted"><LogOut size={14}/> Sortir</button></div><nav className="mt-3 flex gap-1 overflow-x-auto pb-1">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-bold ${pathname === href || (href !== "/admin" && pathname.startsWith(href)) ? "bg-brand text-white" : "bg-[#f3f4f7] text-[#666b7a]"}`}><Icon size={13}/>{label}</Link>)}</nav></div>
  </>;
}
