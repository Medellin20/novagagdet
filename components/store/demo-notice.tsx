import Link from "next/link";
import { Info } from "lucide-react";

export function DemoNotice() {
  return <div className="border-b border-[#e7e8f1] bg-[#eef0ff] text-[#444b79]"><div className="page-shell flex items-center gap-2 py-2 text-[11px] leading-5 sm:text-xs"><Info size={14} className="shrink-0" /><span>Mode aperçu : connectez Supabase pour enregistrer les commandes et gérer la boutique.</span><Link href="/admin" className="ml-auto hidden shrink-0 font-bold underline underline-offset-2 sm:inline">Configuration</Link></div></div>;
}
