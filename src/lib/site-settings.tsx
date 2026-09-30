import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  logo_url: string | null;
  favicon_url: string | null;
  admin_email: string;
};

// Safe fallback values let the site render while settings are loading or if the
// project has not yet been configured with its first singleton settings row.
const DEFAULT: SiteSettings = { logo_url: null, favicon_url: null, admin_email: "admin@domain.com" };

const SiteSettingsCtx = createContext<{
  settings: SiteSettings;
  refresh: () => Promise<void>;
}>({ settings: DEFAULT, refresh: async () => {} });

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT);

  const load = async () => {
    // This table has one row (id = 1); public reads are allowed by RLS.
    const { data } = await supabase
      .from("site_settings")
      .select("logo_url, favicon_url, admin_email")
      .eq("id", 1)
      .maybeSingle();
    if (data) setSettings({ ...DEFAULT, ...data });
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    // Keep the browser tab icon aligned with the value saved by an administrator.
    if (!settings.favicon_url) return;
    const link: HTMLLinkElement =
      document.querySelector("link[rel='icon']") ?? document.createElement("link");
    link.rel = "icon";
    link.href = settings.favicon_url;
    if (!link.isConnected) document.head.appendChild(link);
  }, [settings.favicon_url]);

  return (
    <SiteSettingsCtx.Provider value={{ settings, refresh: load }}>
      {children}
    </SiteSettingsCtx.Provider>
  );
}

export const useSiteSettings = () => useContext(SiteSettingsCtx);
