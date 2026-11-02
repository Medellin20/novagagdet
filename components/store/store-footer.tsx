import Link from "next/link";
import { ArrowUpRight, Camera, ShieldCheck } from "lucide-react";
import { NovaMark } from "@/components/store/brand";

export function StoreFooter({ storeName = "Nova", supportEmail = "bonjour@nova.example" }: { storeName?: string; supportEmail?: string }) {
  return (
    <footer className="mt-16 bg-[#151722] text-white">
      <div className="page-shell grid gap-12 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:py-20">
        <div><NovaMark light label={storeName} /><p className="mt-5 max-w-[270px] text-sm leading-6 text-white/55">La technologie, bien choisie. Une sélection soignée, des informations claires, une commande simple.</p><div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[11px] text-white/70"><ShieldCheck size={14} className="text-[#92a0ff]" /> Paiement sécurisé lors de la mise en service</div></div>
        <div><h3 className="text-xs font-bold uppercase tracking-[.12em] text-white/45">Boutique</h3><div className="mt-5 grid gap-3 text-sm text-white/75"><Link href="/catalogue?categorie=smartphones">iPhone</Link><Link href="/catalogue?categorie=consoles">Consoles</Link><Link href="/catalogue?categorie=accessoires">Accessoires &amp; Jeux</Link><Link href="/catalogue">Toutes les offres</Link></div></div>
        <div><h3 className="text-xs font-bold uppercase tracking-[.12em] text-white/45">Aide</h3><div className="mt-5 grid gap-3 text-sm text-white/75"><a href={`mailto:${supportEmail}`}>Nous contacter <ArrowUpRight size={13} className="ml-1 inline" /></a><span>Modalités de livraison</span><span>Conditions de retour</span><span>Informations de garantie</span></div></div>
        <div><h3 className="text-xs font-bold uppercase tracking-[.12em] text-white/45">Suivre Nova</h3><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm text-white/75"><Camera size={16} /> Instagram <ArrowUpRight size={13} /></a><p className="mt-6 text-xs leading-5 text-white/40">Les modalités définitives de vente et de livraison sont à renseigner avant la mise en ligne.</p></div>
      </div>
        <div className="border-t border-white/10"><div className="page-shell flex flex-col gap-2 py-5 text-[11px] text-white/40 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} {storeName}. Tous droits réservés.</span><span>Une boutique pensée pour choisir sereinement.</span></div></div>
    </footer>
  );
}
