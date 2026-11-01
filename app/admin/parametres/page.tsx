import type { Metadata } from "next";
import { SettingsManager } from "@/components/admin/settings-manager";
export const metadata: Metadata = { title: "Paramètres de la boutique" };
export default function AdminSettingsPage() { return <div><p className="eyebrow">Configuration</p><h1 className="font-display mt-3 text-3xl font-extrabold tracking-[-.06em] sm:text-[40px]">Paramètres.</h1><p className="mb-7 mt-2 text-sm text-muted">Coordonnées, identité et règles générales.</p><SettingsManager/></div>; }
