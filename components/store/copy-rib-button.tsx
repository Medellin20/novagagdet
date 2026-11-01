"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyRibButton({ holder, iban, bic }: { holder: string; iban: string; bic: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copyRib() {
    try {
      await navigator.clipboard.writeText(`Titulaire du compte : ${holder}\nIBAN : ${iban}\nBIC : ${bic}`);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return <div className="mt-4">
    <button type="button" onClick={copyRib} className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#16834b] px-5 text-xs font-bold text-white transition hover:bg-[#11683b]">
      {status === "copied" ? <Check size={16} aria-hidden="true"/> : <Copy size={16} aria-hidden="true"/>}
      {status === "copied" ? "RIB copié !" : "Copier le RIB"}
    </button>
    <p role="status" aria-live="polite" className={`mt-2 text-xs ${status === "error" ? "text-red-700" : "text-[#16834b]"}`}>
      {status === "copied" ? "Le titulaire, l’IBAN et le BIC ont été copiés." : status === "error" ? "La copie n’a pas pu aboutir. Sélectionnez et copiez les coordonnées ci-dessus." : ""}
    </p>
  </div>;
}
