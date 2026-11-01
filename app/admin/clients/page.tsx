import type { Metadata } from "next";
import { CustomersManager } from "@/components/admin/customers-manager";
export const metadata: Metadata = { title: "Gestion des clients" };
export default function AdminCustomersPage() { return <div><p className="eyebrow admin-eyebrow">Relation client</p><h1 className="font-display mt-3 text-3xl font-extrabold tracking-[-.06em] sm:text-[40px]">Clients.</h1><p className="mb-7 mt-2 text-sm text-muted">Coordonnées et historique des commandes.</p><CustomersManager/></div>; }
