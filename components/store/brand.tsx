import Link from "next/link";

export function NovaMark({ light = false, compact = false, label = "Nova" }: { light?: boolean; compact?: boolean; label?: string }) {
  const textColor = light ? "#ffffff" : "#171923";
  return (
    <Link href="/" aria-label={`${label} — accueil`} className="inline-flex items-center gap-2.5">
      <svg aria-hidden="true" viewBox="0 0 40 40" width={compact ? 31 : 37} height={compact ? 31 : 37} fill="none">
        <rect x="1" y="1" width="38" height="38" rx="13" fill="#4F63F7" />
        <path d="M11 28V12l18 16V12" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {!compact && <span className="font-display max-w-[150px] truncate text-[23px] font-extrabold tracking-[-.075em]" style={{ color: textColor }}>{label.toLocaleLowerCase("fr-FR")}<span className="ml-0.5 text-brand">.</span></span>}
    </Link>
  );
}
