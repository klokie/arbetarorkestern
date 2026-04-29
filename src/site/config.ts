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
  nav: [
    { label: "Spelningar", href: "/spelningar" },
    { label: "Nyheter", href: "/nyheter" },
    { label: "Om", href: "/om" },
  ],
  social: {
    instagram: "https://instagram.com/arbetarorkestern",
    facebook: "https://facebook.com/arbetarorkestern",
  } as Record<string, string>,
  paths: {
    gigs: "/spelningar",
    news: "/nyheter",
  },
};

export type SiteConfig = typeof siteConfig;
