import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { siteConfig } from "@/site/config";
import { t } from "@/i18n/ui";
import { localizedEntries, localizeUrl, type Locale } from "@/i18n";

/** Build a per-locale news RSS feed (Swedish content falls back in when an item
 *  isn't translated). */
export async function newsFeed(context: APIContext, lang: Locale) {
  const news = localizedEntries(
    await getCollection("news", ({ data }) => data.published),
    lang,
  ).sort((a, b) => b.entry.data.date.getTime() - a.entry.data.date.getTime());

  return rss({
    title: siteConfig.title,
    description: t(lang, "site.description"),
    site: context.site!,
    items: news.map(({ slug, entry }) => ({
      title: entry.data.title,
      pubDate: entry.data.date,
      description: entry.data.description ?? "",
      link: localizeUrl(`${siteConfig.paths.news}/${slug}`, lang),
    })),
  });
}
