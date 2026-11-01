"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine, RefreshCw } from "lucide-react";
import { formatDate, formatPrice, orderReference } from "@/lib/format";
import type { AdminOrder, OrderStatus } from "@/lib/types";

const statuses: { id: OrderStatus; label: string }[] = [{ id: "pending", label: "À traiter" }, { id: "confirmed", label: "Confirmée" }, { id: "preparing", label: "En préparation" }, { id: "shipped", label: "Expédiée" }, { id: "delivered", label: "Livrée" }, { id: "cancelled", label: "Annulée" }];
const allowedTransitions: Record<OrderStatus, OrderStatus[]> = { pending: ["confirmed", "cancelled"], confirmed: ["preparing", "cancelled"], preparing: ["shipped", "cancelled"], shipped: ["delivered"], delivered: [], cancelled: [] };
type Order = AdminOrder & { promo_code?: string | null; customer?: { address: string; postal_code: string; city: string; country: string } | null };

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true);
    try { const response = await fetch("/api/admin/orders", { cache: "no-store" }); const result = await response.json(); if (!response.ok || !result.ok) throw new Error(result.error ?? "Chargement impossible."); setOrders(result.data as Order[]); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Chargement impossible."); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  async function setStatus(order: Order, status: OrderStatus) {
    if (status === "cancelled" && !window.confirm(`Annuler ${orderReference(order.order_number)} avant son expédition ? Le stock sera réintégré.`)) return;
    setError(""); const response = await fetch(`/api/admin/orders/${order.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); const result = await response.json();
    if (!response.ok || !result.ok) { setError(result.error ?? "Le statut n’a pas pu être modifié."); return; }
    setOrders((current) => current.map((entry) => entry.id === order.id ? { ...entry, status } : entry));
  }
  return <section className="overflow-hidden rounded-[20px] border border-black/[.045] bg-white">
    {error && <div role="alert" className="m-4 rounded-xl bg-[#fff1ef] p-3 text-xs text-[#a3433b]">{error}</div>}
    <div className="flex items-center justify-between border-b border-line px-5 py-4"><div><h2 className="font-display text-sm font-extrabold">Commandes récentes</h2><p className="mt-1 text-[10px] text-muted">{orders.length} dernières commandes</p></div><button type="button" onClick={() => void load()} className="flex items-center gap-1.5 rounded-full bg-[#f3f4f8] px-3 py-2 text-[10px] font-bold text-muted hover:text-ink"><RefreshCw size={13}/> Actualiser</button></div>
    {loading ? <p className="p-10 text-center text-xs text-muted">Chargement…</p> : orders.length ? <div className="divide-y divide-[#f0f0ef]">{orders.map((order) => { const items = order.order_items ?? []; const customer = order.customer; const nextStatuses = allowedTransitions[order.status]; return <article key={order.id} className="px-4 py-4 sm:px-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-display text-sm font-extrabold">{orderReference(order.order_number)}</p><p className="mt-1 text-[10px] text-muted">{formatDate(order.created_at)} · {customer?.full_name ?? "Client"}</p><p className="mt-1 text-[10px] text-muted">{customer?.email} · {customer?.phone}</p></div><div className="flex items-center gap-2"><span className="hidden text-xs font-extrabold sm:inline">{formatPrice(Number(order.total))}</span><label className="sr-only" htmlFor={`status-${order.id}`}>Statut de {orderReference(order.order_number)}</label><select id={`status-${order.id}`} disabled={!nextStatuses.length} value={order.status} onChange={(event) => void setStatus(order, event.target.value as OrderStatus)} className="h-9 rounded-full border border-line bg-white px-3 text-[10px] font-bold outline-none focus:border-brand disabled:opacity-70"><option value={order.status}>{statuses.find((status) => status.id === order.status)?.label}</option>{nextStatuses.map((next) => <option key={next} value={next}>{statuses.find((status) => status.id === next)?.label}</option>)}</select></div></div><details className="mt-3"><summary className="flex cursor-pointer items-center gap-1.5 text-[10px] font-bold text-brand"><ArrowDownToLine size={12}/> Détails · {items.reduce((sum, item) => sum + item.quantity, 0)} article(s)</summary><div className="mt-3 grid gap-2 rounded-xl bg-[#f7f7f8] p-3 text-[10px] sm:grid-cols-2"><div>{items.map((item, index) => <p key={`${item.product_name}-${index}`} className="mb-1.5 leading-5"><strong>{item.quantity} × {item.product_name}</strong><span className="text-muted"> · {item.variant_name} {item.variant_value}</span> — {formatPrice(Number(item.line_total))}</p>)}<p className="mt-2 border-t border-[#e7e7e8] pt-2 font-bold">Total : {formatPrice(Number(order.total))}</p></div><p className="leading-5 text-muted">{customer?.address}<br/>{customer?.postal_code} {customer?.city}<br/>{customer?.country}<br/>{order.promo_code ? `Code : ${order.promo_code}` : "Aucun code promo"}</p></div></details></article>; })}</div> : <p className="p-10 text-center text-xs text-muted">Aucune commande pour le moment.</p>}
  </section>;
}
