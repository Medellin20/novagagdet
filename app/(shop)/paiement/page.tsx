import type { Metadata } from "next";
import Link from "next/link";
import { getPaymentSettings } from "@/lib/store-settings";

export const metadata: Metadata = { title: "Paiement", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const settings = await getPaymentSettings();
  const { reference: rawReference } = await searchParams;
  const reference = typeof rawReference === "string" && /^NV-\d{1,12}$/.test(rawReference) ? rawReference : null;
  return <div className="page-shell py-12 sm:py-20"><section className="mx-auto max-w-xl rounded-[26px] border border-black/[.045] bg-white p-6 sm:p-10">
    <h1 className="font-display text-3xl font-extrabold tracking-[-.05em]">🔒 Votre paiement</h1>
    {reference && <p className="mt-3 text-sm text-muted">Référence de commande : <strong className="text-ink">{reference}</strong></p>}
    {!settings ? <p role="status" className="mt-6 rounded-xl bg-paper p-4 text-sm leading-6">Les instructions de paiement ne sont pas encore disponibles. Veuillez contacter la boutique avant de régler votre commande.</p> : settings.payment_mode === "rib" ? <div className="mt-7">
      <h2 className="text-lg font-bold">Paiement par virement bancaire</h2><p className="mt-2 text-sm leading-6 text-muted">Indiquez votre référence de commande dans le libellé du virement.</p>
      <dl className="mt-5 grid gap-4 rounded-2xl bg-paper p-5"><div><dt className="text-xs text-muted">Titulaire du compte</dt><dd className="mt-1 break-words font-semibold">{settings.payment_account_holder}</dd></div><div><dt className="text-xs text-muted">IBAN</dt><dd className="mt-1 break-all font-mono text-sm font-semibold select-all">{settings.payment_iban.replace(/(.{4})/g, "$1 ").trim()}</dd></div><div><dt className="text-xs text-muted">BIC</dt><dd className="mt-1 font-mono text-sm font-semibold select-all">{settings.payment_bic}</dd></div></dl>
    </div> : <div className="mt-7"><h2 className="text-lg font-bold">Paiement en ligne</h2><p className="mt-2 text-sm leading-6 text-muted">Poursuivez sur la page de notre prestataire pour régler votre commande.</p><a href={settings.payment_url} rel="noreferrer" className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[#16834b] px-6 text-sm font-bold text-white transition hover:bg-[#11683b]">🔒 Accéder au paiement sécurisé</a></div>}
    <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700">🔒 Vérifiez le bénéficiaire et le montant avant de valider votre paiement. Les conditions de protection dépendent de votre banque ou du prestataire de paiement.</p>
    <Link href="/catalogue" className="mt-6 inline-flex text-xs font-bold text-brand">Revenir à la boutique →</Link>
  </section></div>;
}
