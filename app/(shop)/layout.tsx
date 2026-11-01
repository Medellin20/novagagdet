import type { ReactNode } from "react";
import { StoreHeader } from "@/components/store/store-header";
import { StoreFooter } from "@/components/store/store-footer";
import { DemoNotice } from "@/components/store/demo-notice";
import { hasSupabaseServerConfig } from "@/lib/supabase/env";
import { getStoreSettings } from "@/lib/store-settings";

export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: ReactNode }) {
  const settings = await getStoreSettings();
  const demoMode = !hasSupabaseServerConfig();
  return <><StoreHeader storeName={settings.storeName} announcement={settings.announcement}/>{demoMode && <DemoNotice/>}<main>{children}</main><StoreFooter storeName={settings.storeName} supportEmail={settings.supportEmail}/></>;
}
