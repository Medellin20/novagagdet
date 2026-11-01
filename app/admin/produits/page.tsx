import type { Metadata } from "next";
import { ProductsManager } from "@/components/admin/products-manager";
export const metadata: Metadata = { title: "Gestion des produits" };
export default function AdminProductsPage() { return <div><p className="eyebrow">Votre sélection</p><h1 className="font-display mt-3 text-3xl font-extrabold tracking-[-.06em] sm:text-[40px]">Produits.</h1><p className="mb-7 mt-2 text-sm text-muted">Prix, variantes, images et disponibilités.</p><ProductsManager/></div>; }
