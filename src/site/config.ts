import { jordsang } from "@klokie/theme";
import type { ThemePreset } from "@klokie/theme/presets/types";

export const siteConfig = {
  title: "Arbetarorkestern",
  tagline: "Världsmusik från Stockholm",
  description:
    "Arbetarorkestern är en kollektiv världsmusikensemble från Stockholm. Sydafrikansk körtradition, roots reggae och svensk visa delar samma scen.",
  url: process.env.PUBLIC_SITE_URL ?? "http://localhost:4321",
  monogram: "AO",
  copyrightName: "Arbetarorkestern",
  locale: "sv-SE",
  preset: jordsang as ThemePreset,
  // Nav items reference a UI dictionary key + a default-locale path; SiteLayout
  // localizes both per request.
  nav: [
    { key: "nav.gigs", path: "/spelningar" },
    { key: "nav.media", path: "/media" },
    { key: "nav.news", path: "/nyheter" },
    { key: "nav.about", path: "/om" },
  ] as const,
  social: {
    facebook: "https://www.facebook.com/profile.php?id=100085614741269",
  } as Record<string, string>,
  paths: {
    gigs: "/spelningar",
    news: "/nyheter",
    media: "/media",
    about: "/om",
  },
};

export type SiteConfig = typeof siteConfig;
