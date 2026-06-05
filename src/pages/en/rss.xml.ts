import type { APIContext } from "astro";
import { newsFeed } from "@/i18n/newsFeed";

export const GET = (context: APIContext) => newsFeed(context, "en");
