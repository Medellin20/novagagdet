"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole, TicketPercent } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";

export function CheckoutForm({ demoMode }: { demoMode: boolean }) {
  const { lines, subtotal, clear } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderReference, setOrderReference] = useState("");

  async function applyPromo() {
    setPromoMessage("");
    if (!promoCode.trim()) return;
    try {
      const response = await fetch("/api/promotions/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: promoCode, subtotal }) });
      const result = await response.json();
      if (!response.ok || !result.ok) { setDiscount(0); setPromoMessage(result.error ?? "Code non valide."); return; }
      setPromoCode(result.code);
      setDiscount(Number(result.discount));
      setPromoMessage(`Code appliqué : −${formatPrice(Number(result.discount))}`);
    } catch { setDiscount(0); setPromoMessage("La vérification du code a échoué."); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (demoMode) { setError("La commande n’a pas été envoyée : connectez d’abord le projet Supabase à l’application."); return; }
    if (!lines.length) { setError("Votre panier est vide."); return; }
    const form = new FormData(event.currentTarget);
    const customer = Object.fromEntries(form.entries());
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, promoCode: promoCode.trim() || undefined, items: lines.map((line) => ({ variantId: line.variant.id, quantity: line.quantity })) }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) { setError(result.error ?? "La commande n’a pas pu être enregistrée."); return; }
      setOrderReference(result.order.reference);
      clear();
    } catch { setError("Une erreur de connexion est survenue. Votre panier a été conservé."); }
    finally { setLoading(false); }
  }

  if (orderReference) return <div className="mx-auto max-w-xl rounded-[26px] border border-black/[.045] bg-white p-8 text-center sm:p-12"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf8f0] text-[#2f9469]"><CheckCircle2 size={30}/></div><p className="eyebrow mt-7 justify-center">Commande confirmée</p><h1 className="font-display mt-3 text-3xl font-extrabold tracking-[-.06em]">Merci pour votre confiance.</h1><p className="mt-3 text-sm leading-6 text-muted">Votre demande a été enregistrée. La référence à conserver est <strong className="text-ink">{orderReference}</strong>. L’équipe Nova vous contactera pour la suite.</p><Link href={`/paiement?reference=${encodeURIComponent(orderReference)}`} className="mt-7 inline-flex items-center justify-center rounded-full bg-[#16834b] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#11683b]">🔒 Faire le paiement sécurisé</Link><br/><Link href="/catalogue" className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-xs font-bold text-white">Revenir à la boutique <ArrowRight size={15}/></Link></div>;

  if (!lines.length) return <div className="rounded-[22px] border border-black/[.045] bg-white p-8 text-center"><p className="font-display text-xl font-extrabold">Votre panier est vide.</p><Link href="/catalogue" className="mt-4 inline-flex text-xs font-bold text-brand underline underline-offset-4">Retourner au catalogue</Link></div>;

  return <form onSubmit={submit} className="grid items-start gap-6 lg:grid-cols-[1fr_360px] lg:gap-10">
    <div className="rounded-[22px] border border-black/[.045] bg-white p-5 sm:p-8">
      <h2 className="font-display text-xl font-extrabold tracking-[-.04em]">Vos coordonnées</h2><p className="mt-1 text-xs text-muted">Pour traiter et préparer votre commande.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-xs font-semibold sm:col-span-2">Nom complet<input required name="full_name" autoComplete="name" minLength={2} maxLength={120} className="h-12 rounded-xl border border-line px-4 font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10" placeholder="Camille Martin"/></label>
        <label className="grid gap-1.5 text-xs font-semibold">Adresse e-mail<input required type="email" name="email" autoComplete="email" maxLength={254} className="h-12 rounded-xl border border-line px-4 font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10" placeholder="camille@exemple.fr"/></label>
        <label className="grid gap-1.5 text-xs font-semibold">Téléphone<input required type="tel" name="phone" autoComplete="tel" minLength={7} maxLength={30} className="h-12 rounded-xl border border-line px-4 font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10" placeholder="06 12 34 56 78"/></label>
        <label className="grid gap-1.5 text-xs font-semibold sm:col-span-2">Adresse<input required name="address" autoComplete="street-address" maxLength={180} className="h-12 rounded-xl border border-line px-4 font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10" placeholder="12 rue des Lilas"/></label>
        <label className="grid gap-1.5 text-xs font-semibold">Code postal<input required name="postal_code" autoComplete="postal-code" maxLength={20} className="h-12 rounded-xl border border-line px-4 font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10" placeholder="75011"/></label>
        <label className="grid gap-1.5 text-xs font-semibold">Ville<input required name="city" autoComplete="address-level2" maxLength={100} className="h-12 rounded-xl border border-line px-4 font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10" placeholder="Paris"/></label>
        <label className="grid gap-1.5 text-xs font-semibold sm:col-span-2">Pays<input required name="country" defaultValue="France" autoComplete="country-name" maxLength={80} className="h-12 rounded-xl border border-line px-4 font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"/></label>
      </div>
      {demoMode && <div role="status" className="mt-6 rounded-xl border border-[#e4dcae] bg-[#fffbe9] p-4 text-xs leading-5 text-[#706234]">Mode aperçu : la commande sera activée dès que Supabase aura été configuré dans les variables d’environnement Netlify.</div>}
      {error && <div role="alert" className="mt-5 rounded-xl border border-[#f4cdca] bg-[#fff0ee] p-4 text-xs leading-5 text-[#a13f37]">{error}</div>}
      <p className="mt-5 text-[10px] leading-5 text-muted">En validant, vous demandez l’enregistrement de votre commande. Les instructions de paiement seront disponibles après la confirmation.</p>
    </div>
    <aside className="rounded-[22px] border border-black/[.045] bg-white p-5 sm:p-6 lg:sticky lg:top-28"><h2 className="font-display text-lg font-extrabold tracking-[-.04em]">Récapitulatif</h2><div className="mt-5 grid gap-3">{lines.map((line) => <div key={line.variant.id} className="flex items-start justify-between gap-3 text-xs"><span className="leading-5 text-muted">{line.product.name}<span className="block text-[10px]">{line.variant.value} × {line.quantity}</span></span><span className="shrink-0 font-semibold tabular-nums">{formatPrice((line.product.price + line.variant.priceDelta) * line.quantity)}</span></div>)}</div>
      <div className="mt-5 border-y border-line py-4"><label htmlFor="promo" className="mb-2 flex items-center gap-1.5 text-[11px] font-bold"><TicketPercent size={14} className="text-brand"/> Code promotionnel</label><div className="flex gap-2"><input id="promo" value={promoCode} onChange={(event) => setPromoCode(event.target.value)} maxLength={40} placeholder="Code promo" className="h-10 min-w-0 flex-1 rounded-full border border-line px-3 text-xs outline-none focus:border-brand"/><button type="button" onClick={applyPromo} className="rounded-full bg-[#f1f2f5] px-4 text-[10px] font-bold transition hover:bg-[#e7e9f3]">Appliquer</button></div>{promoMessage && <p aria-live="polite" className={`mt-2 text-[10px] ${discount ? "text-[#318065]" : "text-muted"}`}>{promoMessage}</p>}</div>
      <div className="mt-4 flex items-center justify-between text-xs"><span className="text-muted">Sous-total</span><span className="font-semibold tabular-nums">{formatPrice(subtotal)}</span></div>{discount > 0 && <div className="mt-2 flex items-center justify-between text-xs text-[#318065]"><span>Réduction</span><span>−{formatPrice(discount)}</span></div>}<div className="mt-4 flex items-center justify-between border-t border-line pt-4"><span className="text-sm font-bold">Total estimé</span><span className="font-display text-xl font-extrabold tabular-nums">{formatPrice(Math.max(0, subtotal - discount))}</span></div>
      <button type="submit" disabled={loading} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-65">{loading ? "Enregistrement…" : "Confirmer la commande"}<ArrowRight size={16}/></button><p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted"><LockKeyhole size={12}/> Vos données restent confidentielles.</p>
    </aside>
  </form>;
}
