import type { Metadata } from "next";
import { CheckoutForm } from "@/components/store/checkout-form";
import { isDemoCatalog } from "@/lib/catalog";

export const metadata: Metadata = { title: "Finaliser ma commande" };
export default async function CommandePage() {
  const demoMode = await isDemoCatalog();
  return <div className="page-shell pb-20 pt-12 sm:pt-16"><p className="eyebrow">Un dernier détail</p><h1 className="font-display mt-3 text-4xl font-extrabold tracking-[-.06em] sm:text-5xl">Finaliser la commande.</h1><p className="mb-8 mt-3 text-sm text-muted">Vos coordonnées, et nous nous occupons de la suite.</p><CheckoutForm demoMode={demoMode}/></div>;
}
