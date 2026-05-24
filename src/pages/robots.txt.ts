import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const sitemapUrl = new URL("/sitemap-index.xml", context.site!).href;
  const body = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
