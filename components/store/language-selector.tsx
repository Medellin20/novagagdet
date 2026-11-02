"use client";

import Script from "next/script";
import { Languages } from "lucide-react";
import { useEffect, useState } from "react";

const languages = [
  ["fr", "Français"], ["en", "English"], ["zh-CN", "中文"],
  ["hi", "हिन्दी"], ["es", "Español"], ["ar", "العربية"],
  ["bn", "বাংলা"], ["pt", "Português"], ["ru", "Русский"], ["ur", "اردو"],
] as const;

declare global {
  interface Window {
    novaTranslateInit?: () => void;
    google?: { translate?: { TranslateElement: new (
      options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
      element: string,
    ) => unknown } };
  }
}

export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    window.novaTranslateInit = () => {
      if (!window.google?.translate || document.querySelector("#nova-translate select")) return;
      new window.google.translate.TranslateElement({
        pageLanguage: "fr",
        includedLanguages: languages.map(([code]) => code).join(","),
        autoDisplay: false,
      }, "nova-translate");
    };
    // Restore the translator on subsequent pages when Google has saved a language.
    if (document.cookie.split(";").some((cookie) => cookie.trim().startsWith("googtrans="))) {
      setEnabled(true);
    }
    return () => { delete window.novaTranslateInit; };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => {
      if (!document.querySelector("#nova-translate select")) setFailed(true);
    }, 15000);
    return () => window.clearTimeout(timer);
  }, [enabled]);

  return (
    <div className="relative notranslate" translate="no">
      <button type="button" aria-label="Choisir la langue / Choose language" aria-expanded={open} aria-controls="nova-language-panel"
        onClick={() => { setOpen(!open); setEnabled(true); }}
        className="focus-ring flex h-10 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-semibold text-ink hover:bg-[#eceefb]">
        <Languages size={17} /><span className="hidden xl:inline">Langues</span>
      </button>
      <div id="nova-language-panel" hidden={!open} className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-line bg-white p-4 shadow-xl">
        <p className="mb-3 text-sm font-semibold">Langue / Language</p>
        <div id="nova-translate" className="min-h-12" />
        {failed && <p role="status" className="mt-2 text-xs text-muted">Traduction indisponible. Vérifiez votre connexion ou réessayez en rechargeant la page.</p>}
        <p className="mt-3 text-[11px] leading-relaxed text-muted">Traduction automatique par Google. 10 langues disponibles.</p>
        <button type="button" onClick={() => setOpen(false)} className="mt-3 text-xs font-semibold text-brand">Fermer / Close</button>
      </div>
      {enabled && <Script id="nova-google-translate" src="https://translate.google.com/translate_a/element.js?cb=novaTranslateInit" strategy="afterInteractive"
        onReady={() => window.novaTranslateInit?.()} onError={() => setFailed(true)} />}
    </div>
  );
}
