import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const gigs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/gigs" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    venue: z.string(),
    city: z.string().optional(),
    ticketUrl: z.string().url().optional(),
    ctaLabel: z.string().optional(),
    status: z.enum(["upcoming", "past", "cancelled"]).default("upcoming"),
    published: z.boolean().default(true),
    image: z.string().url().optional(),
    imageAlt: z.string().optional(),
    imageWidth: z.number().int().positive().optional(),
    imageHeight: z.number().int().positive().optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    published: z.boolean().default(true),
    tags: z.array(z.string()).optional(),
    image: z.string().url().optional(),
    imageAlt: z.string().optional(),
    imageWidth: z.number().int().positive().optional(),
    imageHeight: z.number().int().positive().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

const videos = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/videos" }),
  schema: z.object({
    title: z.string(),
    videoId: z.string(),
    date: z.coerce.date(),
    uploadedAt: z.coerce.date().optional(),
    recordedAt: z.coerce.date().optional(),
    duration: z.number().optional(),
    description: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

export const collections = { gigs, news, pages, videos };
