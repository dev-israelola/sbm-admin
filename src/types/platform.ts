export type Platform = "harbs" | "holistic";

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

export const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
  harbs: {
    label: "naturale",
    shortLabel: "Naturale",
    adminLabel: "naturale admin",
    logoLabel: "naturale",
    logoInitial: "n",
    overviewDescription:
      "Last 30 days of storefront trading. Operational metrics update in real time as your team works.",
    storefrontLabel: "naturale",
    defaultBrand: "naturale.",
    sidebarTagline: "Herbal medicare · Lagos",
    settingsStoreName: "naturale",
    settingsStoreEmail: "hello@naturale.studio",
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
    sidebarTagline: "Holistic wellness · Lagos",
    settingsStoreName: "SBM Holistic Farmacy",
    settingsStoreEmail: "hello@sbmholisticfarmacy.com",
  },
};

export const PLATFORM_LABEL: Record<Platform, string> = {
  harbs: PLATFORM_CONFIG.harbs.label,
  holistic: PLATFORM_CONFIG.holistic.label,
};

export const PLATFORM_SHORT_LABEL: Record<Platform, string> = {
  harbs: PLATFORM_CONFIG.harbs.shortLabel,
  holistic: PLATFORM_CONFIG.holistic.shortLabel,
};

export const PLATFORM_ADMIN_LABEL: Record<Platform, string> = {
  harbs: PLATFORM_CONFIG.harbs.adminLabel,
  holistic: PLATFORM_CONFIG.holistic.adminLabel,
};
