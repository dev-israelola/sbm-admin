export type Platform = "naturale" | "holistic";

export interface PlatformConfig {
  label: string;
  shortLabel: string;
  adminLabel: string;
  logoLabel: string;
  logoInitial: string;
  overviewDescription: string;
  storefrontLabel: string;
  defaultBrand: string;
  sidebarTagline: string;
  settingsStoreName: string;
  settingsStoreEmail: string;
}
// export const ALL_PLATFORMS: Platform[] = ["naturale", "holistic"];
export const ALL_PLATFORMS: Platform[] = ["naturale"];

export const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
  naturale: {
    label: "SBM Naturales",
    shortLabel: "Naturale",
    adminLabel: "naturale admin",
    logoLabel: "naturale",
    logoInitial: "n",
    overviewDescription:
      "Last 30 days of storefront trading. Operational metrics update in real time as your team works.",
    storefrontLabel: "Naturale",
    defaultBrand: "SBM Naturales",
    sidebarTagline: "Herbal medicare - Lagos",
    settingsStoreName: "SBM Naturales",
    settingsStoreEmail: "hello@sbmnaturales.com.ng",
  },
  holistic: {
    label: "SBM Holistic Farmacy",
    shortLabel: "Holistic",
    adminLabel: "holistic admin",
    logoLabel: "holistic",
    logoInitial: "h",
    overviewDescription:
      "Last 30 days of holistic trading. Operational metrics update in real time as your team works.",
    storefrontLabel: "Holistic",
    defaultBrand: "SBM Holistic Farmacy",
    sidebarTagline: "Holistic wellness - Lagos",
    settingsStoreName: "SBM Holistic Farmacy",
    settingsStoreEmail: "hello@sbmholisticfarmacy.com",
  },
};

export const PLATFORM_LABEL: Record<Platform, string> = {
  naturale: PLATFORM_CONFIG.naturale.label,
  holistic: PLATFORM_CONFIG.holistic.label,
};

export const PLATFORM_SHORT_LABEL: Record<Platform, string> = {
  naturale: PLATFORM_CONFIG.naturale.shortLabel,
  holistic: PLATFORM_CONFIG.holistic.shortLabel,
};

export const PLATFORM_ADMIN_LABEL: Record<Platform, string> = {
  naturale: PLATFORM_CONFIG.naturale.adminLabel,
  holistic: PLATFORM_CONFIG.holistic.adminLabel,
};
