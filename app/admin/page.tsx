import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Boxes, CircleDollarSign, PackageCheck, ShoppingBag, Users } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { formatDate, formatPrice, orderReference } from "@/lib/format";

export default async function AdminDashboard() {
  await requireAdmin();
  const supabase = createSupabaseAdmin();
  const [ordersResponse, customersResponse, productsResponse, recentResponse] = await Promise.all([
    supabase.from("orders").select("id,total,status,created_at").order("created_at", { ascending: false }).limit(1000),
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id,stock,active", { count: "exact" }),
    supabase.from("orders").select("id,order_number,status,total,created_at,customer:customers(full_name,email)").order("created_at", { ascending: false }).limit(6),
  ]);
  const errorMessage = ordersResponse.error || customersResponse.error || productsResponse.error || recentResponse.error;
  const orders = ordersResponse.data ?? [];
  const activeOrders = orders.filter((order) => order.status !== "cancelled");
  const revenue = activeOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthRevenue = activeOrders.filter((order) => order.created_at.startsWith(thisMonth)).reduce((sum, order) => sum + Number(order.total), 0);
  const activeProducts = (productsResponse.data ?? []).filter((product) => product.active);
  const lowStock = activeProducts.filter((product) => Number(product.stock) <= 5).length;
  const metrics = [
    { label: "Chiffre d’affaires", value: formatPrice(revenue), helper: `${formatPrice(monthRevenue)} ce mois`, icon: CircleDollarSign, tone: "text-brand bg-[#eff0ff]" },
    { label: "Commandes reçues", value: String(orders.length), helper: `${orders.filter((order) => order.status === "pending").length} à traiter`, icon: ShoppingBag, tone: "text-[#c46a3d] bg-[#fff1e9]" },
    { label: "Clients", value: String(customersResponse.count ?? 0), helper: "comptes et commandes invités", icon: Users, tone: "text-[#318065] bg-[#e9f6ef]" },
    { label: "Produits actifs", value: String(activeProducts.length), helper: lowStock ? `${lowStock} stock(s) bas` : "stocks suivis", icon: Boxes, tone: lowStock ? "text-[#c56a3d] bg-[#fff1e9]" : "text-[#5d68bd] bg-[#eff0ff]" },
  ];
  return <div>
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow">Pilotage</p><h1 className="font-display mt-3 text-3xl font-extrabold tracking-[-.06em] sm:text-[40px]">Vue d’ensemble.</h1><p className="mt-2 text-sm text-muted">Les chiffres de votre boutique en un coup d’œil.</p></div><span className="rounded-full border border-[#e7e8ee] bg-white px-3 py-2 text-[10px] font-semibold text-muted">Mis à jour à l’ouverture</span></div>
    {errorMessage && <div role="alert" className="mt-7 rounded-xl border border-[#efceca] bg-[#fff3f1] p-4 text-sm text-[#9d4941]">La base Nova n’est pas prête. Exécutez le fichier de migration SQL dans Supabase, puis rechargez le tableau de bord.</div>}
    <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, helper, icon: Icon, tone }) => <article key={label} className="rounded-[19px] border border-black/[.045] bg-white p-5"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-muted">{label}</span><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}><Icon size={17}/></span></div><p className="font-display mt-5 text-[28px] font-extrabold tracking-[-.06em]">{value}</p><p className="mt-1 text-[10px] text-muted">{helper}</p></article>)}</div>
    <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
      <section className="overflow-hidden rounded-[20px] border border-black/[.045] bg-white"><div className="flex items-center justify-between border-b border-line px-5 py-4"><div><h2 className="font-display text-sm font-extrabold">Commandes récentes</h2><p className="mt-1 text-[10px] text-muted">Suivez les demandes en cours.</p></div><Link href="/admin/commandes" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand">Tout voir <ArrowRight size={13}/></Link></div>
        {errorMessage ? <p className="p-7 text-center text-xs text-muted">Les commandes apparaîtront après la configuration de Supabase.</p> : recentResponse.data?.length ? <div className="overflow-x-auto"><table className="w-full min-w-[590px] text-left"><thead><tr className="text-[9px] uppercase tracking-[.12em] text-muted"><th className="px-5 py-3 font-bold">Référence</th><th className="px-3 py-3 font-bold">Client</th><th className="px-3 py-3 font-bold">Date</th><th className="px-3 py-3 font-bold">Statut</th><th className="px-5 py-3 text-right font-bold">Total</th></tr></thead><tbody>{recentResponse.data.map((order) => { const customer = Array.isArray(order.customer) ? order.customer[0] : order.customer; return <tr key={order.id} className="border-t border-[#f0f0ef] text-xs"><td className="px-5 py-3.5 font-bold">{orderReference(order.order_number)}</td><td className="px-3 py-3.5 text-muted">{customer?.full_name ?? "Client"}</td><td className="px-3 py-3.5 text-muted">{formatDate(order.created_at)}</td><td className="px-3 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${order.status === "pending" ? "bg-[#fff1e9] text-[#bb643f]" : order.status === "delivered" ? "bg-[#e9f6ef] text-[#318065]" : "bg-[#eff0ff] text-brand"}`}>{order.status}</span></td><td className="px-5 py-3.5 text-right font-bold tabular-nums">{formatPrice(Number(order.total))}</td></tr>; })}</tbody></table></div> : <p className="p-8 text-center text-xs text-muted">Aucune commande pour le moment.</p>}
      </section>
      <section className="rounded-[20px] border border-black/[.045] bg-white p-5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f1ff] text-brand"><PackageCheck size={18}/></span><div><h2 className="font-display text-sm font-extrabold">À garder en vue</h2><p className="mt-1 text-[10px] text-muted">Le bon réflexe, chaque jour.</p></div></div><div className="mt-5 grid gap-3">{lowStock ? <div className="flex items-center justify-between rounded-xl bg-[#fff5ee] p-3.5"><span className="text-xs font-semibold text-[#9b5c3d]">Références au stock bas</span><span className="flex items-center gap-1 text-xs font-bold text-[#ba633e]"><ArrowDownRight size={14}/>{lowStock}</span></div> : <div className="flex items-center justify-between rounded-xl bg-[#f1f7f2] p-3.5"><span className="text-xs font-semibold text-[#418063]">Niveaux de stock</span><span className="flex items-center gap-1 text-xs font-bold text-[#418063]"><ArrowUpRight size={14}/>Sains</span></div>}<div className="flex items-center justify-between rounded-xl bg-[#f7f7f8] p-3.5"><span className="text-xs font-semibold text-muted">Commandes à traiter</span><span className="text-xs font-bold">{orders.filter((order) => order.status === "pending").length}</span></div></div><Link href="/admin/produits" className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-brand">Gérer le catalogue <ArrowRight size={14}/></Link></section>
    </div>
  </div>;
}
