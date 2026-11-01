import type { Metadata } from "next";
import { CartPage } from "@/components/store/cart-page";

export const metadata: Metadata = { title: "Panier" };
export default function PanierPage() { return <CartPage />; }
