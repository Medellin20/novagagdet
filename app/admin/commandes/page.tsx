import type { Metadata } from "next";
import { OrdersManager } from "@/components/admin/orders-manager";
export const metadata: Metadata = { title: "Gestion des commandes" };
export default function AdminOrdersPage() { return <div><p className="eyebrow admin-eyebrow">Activité</p><h1 className="font-display mt-3 text-3xl font-extrabold tracking-[-.06em] sm:text-[40px]">Commandes.</h1><p className="mb-7 mt-2 text-sm text-muted">Suivez chaque demande et faites évoluer son statut.</p><OrdersManager/></div>; }
