import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

const SITE = process.env.PUBLIC_SITE_URL ?? "http://localhost:4321";

export default defineConfig({
  site: SITE,
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: "sv",
        locales: { sv: "sv-SE", en: "en-US" },
      },
    }),
  ],
  output: "static",
  i18n: {
    locales: ["sv", "en"],
    defaultLocale: "sv",
    routing: { prefixDefaultLocale: false },
  },
  build: {
    format: "directory",
  },
  trailingSlash: "ignore",
});
