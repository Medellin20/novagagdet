import type { Metadata } from "next";
import { PromotionsManager } from "@/components/admin/promotions-manager";
export const metadata: Metadata = { title: "Promotions" };
export default function AdminPromotionsPage() { return <div><p className="eyebrow admin-eyebrow">Opérations commerciales</p><h1 className="font-display mt-3 text-3xl font-extrabold tracking-[-.06em] sm:text-[40px]">Promotions.</h1><p className="mb-7 mt-2 text-sm text-muted">Créez et suivez les codes utilisés en boutique.</p><PromotionsManager/></div>; }
