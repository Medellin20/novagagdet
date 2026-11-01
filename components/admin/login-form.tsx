"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { NovaMark } from "@/components/store/brand";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export function LoginForm({ configured, notice = "" }: { configured: boolean; notice?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(notice);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const { error: authError } = await createSupabaseBrowser().auth.signInWithPassword({ email, password });
      if (authError) { setError("Adresse ou mot de passe incorrect."); return; }
      router.replace("/admin"); router.refresh();
    } catch { setError("La connexion n’est pas disponible. Vérifiez les variables Supabase."); }
    finally { setLoading(false); }
  }

  return <div className="mx-auto w-full max-w-[460px] rounded-[26px] border border-black/[.045] bg-white p-7 shadow-[0_24px_80px_rgba(25,30,60,.08)] sm:p-10">
    <NovaMark/><div className="mt-9 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff0ff] text-brand"><LockKeyhole size={19}/></div>
    <p className="eyebrow mt-6">Espace sécurisé</p><h1 className="font-display mt-2 text-3xl font-extrabold tracking-[-.06em]">Connexion admin.</h1><p className="mt-2 text-sm leading-6 text-muted">Accédez au pilotage de votre boutique Nova.</p>
    {error && <div role="alert" className="mt-5 rounded-xl border border-[#efceca] bg-[#fff3f1] p-3.5 text-xs leading-5 text-[#9d4941]">{error}</div>}
    {!configured ? <div role="status" className="mt-6 rounded-xl border border-[#e5dfc7] bg-[#fffbee] p-4 text-xs leading-5 text-[#695d32]">Supabase n’est pas encore connecté. Renseignez les clés dans les variables d’environnement Netlify, appliquez la migration SQL, puis créez le compte administrateur.</div> : <form onSubmit={submit} className="mt-7 grid gap-4">
      <label className="grid gap-1.5 text-xs font-semibold">Adresse e-mail<input required type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 rounded-xl border border-line px-4 font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10" placeholder="admin@votre-boutique.fr"/></label>
      <label className="grid gap-1.5 text-xs font-semibold">Mot de passe<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 rounded-xl border border-line px-4 font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10" placeholder="••••••••••••"/></label>
      <button disabled={loading} className="mt-2 flex h-12 items-center justify-center gap-2 rounded-full bg-brand text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60">{loading ? "Connexion…" : "Se connecter"}<ArrowRight size={16}/></button>
    </form>}
    <p className="mt-7 flex items-center justify-center gap-1.5 text-[10px] text-muted"><ShieldCheck size={13} className="text-brand"/> Connexion protégée par Supabase Auth et vérification du rôle.</p><Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-brand"><ArrowLeft size={13}/> Retour à la boutique</Link>
  </div>;
}
