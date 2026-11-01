"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, RefreshCw, Users } from "lucide-react";
import { formatDate, formatPrice, orderReference } from "@/lib/format";

type Customer = { id: string; full_name: string; email: string; phone: string; address: string; postal_code: string; city: string; country: string; created_at: string; orders: { id: string; order_number: number; total: number; status: string; created_at: string }[] };

export function CustomersManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true); setError("");
    try { const response = await fetch("/api/admin/customers", { cache: "no-store" }); const result = await response.json(); if (!response.ok || !result.ok) throw new Error(result.error ?? "Chargement impossible."); setCustomers(result.data as Customer[]); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Chargement impossible."); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  return <section className="overflow-hidden rounded-[20px] border border-black/[.045] bg-white">
    {error && <div role="alert" className="m-4 rounded-xl bg-[#fff1ef] p-3 text-xs text-[#a3433b]">{error}</div>}
    <div className="flex items-center justify-between border-b border-line px-5 py-4"><div><h2 className="font-display text-sm font-extrabold">Clients enregistrés</h2><p className="mt-1 text-[10px] text-muted">Les coordonnées proviennent des commandes.</p></div><button type="button" onClick={() => void load()} className="rounded-full p-2 text-muted hover:bg-[#f3f4f8]" aria-label="Actualiser les clients"><RefreshCw size={15}/></button></div>
    {loading ? <p className="p-10 text-center text-xs text-muted">Chargement…</p> : customers.length ? <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead><tr className="bg-[#fafafa] text-[9px] uppercase tracking-[.12em] text-muted"><th className="px-5 py-3 font-bold">Client</th><th className="px-3 py-3 font-bold">Coordonnées</th><th className="px-3 py-3 font-bold">Commandes</th><th className="px-3 py-3 font-bold">Total cumulé</th><th className="px-5 py-3 text-right font-bold">Depuis le</th></tr></thead><tbody>{customers.map((customer) => { const orders = customer.orders ?? []; const total = orders.filter((order) => order.status !== "cancelled").reduce((sum, order) => sum + Number(order.total), 0); return <tr key={customer.id} className="border-t border-[#f0f0ef] text-xs"><td className="px-5 py-4"><p className="font-bold">{customer.full_name}</p><p className="mt-1 text-[10px] text-muted">{customer.postal_code} {customer.city}</p></td><td className="px-3 py-4"><a className="inline-flex items-center gap-1.5 text-brand" href={`mailto:${customer.email}`}><Mail size={12}/>{customer.email}</a><p className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] text-muted"><Phone size={11}/>{customer.phone}</p></td><td className="px-3 py-4"><span className="font-semibold">{orders.length}</span>{orders[0] && <span className="mt-1 block text-[9px] text-muted">Dernière : {orderReference(orders[0].order_number)}</span>}</td><td className="px-3 py-4 font-bold tabular-nums">{formatPrice(total)}</td><td className="px-5 py-4 text-right text-muted">{formatDate(customer.created_at)}</td></tr>; })}</tbody></table></div> : <div className="p-12 text-center"><Users size={22} className="mx-auto text-[#a5a9b6]"/><p className="mt-3 text-xs text-muted">Les clients apparaîtront après la première commande.</p></div>}
  </section>;
}
