import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { hasSupabasePublicConfig } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Connexion administrateur" };
type Params = Promise<{ reason?: string }>;

export default async function ConnexionPage({ searchParams }: { searchParams: Params }) {
  const params = await searchParams;
  const notice = params.reason === "unauthorized" ? "Ce compte est connecté, mais n’a pas le rôle administrateur Nova." : params.reason === "configuration" ? "La configuration de l’administration est incomplète. Vérifiez Supabase et sa migration." : "";
  return <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#e7eaff_0,transparent_35%),radial-gradient(circle_at_90%_85%,#ffe9df_0,transparent_28%)] px-4 py-12 sm:py-20"><LoginForm configured={hasSupabasePublicConfig()} notice={notice}/></div>;
}
