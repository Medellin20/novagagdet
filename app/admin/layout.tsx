import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/supabase/auth";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireAdmin();
  return <div className="min-h-screen bg-[#f6f7fa]"><AdminNav name={profile.full_name || profile.email}/><div className="min-h-screen lg:pl-[230px]"><header className="hidden h-[72px] items-center justify-between border-b border-black/[.05] bg-white px-8 lg:flex"><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-muted">Nova · Back-office</p><p className="mt-1 text-xs font-semibold text-ink">Bonjour {profile.full_name?.split(" ")[0] || ""}, votre boutique en un coup d’œil.</p></div><span className="rounded-full border border-[#e8e9ef] px-3 py-1.5 text-[10px] font-semibold text-[#687087]">Données Supabase</span></header><main className="mx-auto max-w-[1380px] px-4 py-7 sm:px-7 sm:py-9 lg:px-9">{children}</main></div></div>;
}
