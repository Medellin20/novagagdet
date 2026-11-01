import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";

export const metadata: Metadata = {
  title: { default: "Nova — La technologie, bien choisie.", template: "%s · Nova" },
  description: "iPhone, consoles PlayStation et accessoires soigneusement sélectionnés. Commandez simplement chez Nova.",
  applicationName: "Nova",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nova.example"),
  openGraph: { title: "Nova — La technologie, bien choisie.", description: "Une sélection tech soignée, une commande simple.", type: "website", locale: "fr_FR" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body><CartProvider>{children}</CartProvider></body></html>;
}
