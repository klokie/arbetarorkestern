// UI chrome strings. Keys are shared across locales; `t()` falls back to Swedish
// for any key missing in another locale.
import type { Locale } from "./index";

export const ui = {
  sv: {
    "nav.gigs": "Spelningar",
    "nav.media": "Media",
    "nav.news": "Nyheter",
    "nav.about": "Om",

    "site.tagline": "Världsmusik från Stockholm",
    "site.description":
      "Arbetarorkestern är en kollektiv världsmusikensemble från Stockholm. Sydafrikansk körtradition, roots reggae och svensk visa delar samma scen.",

    "home.bio":
      "En kollektiv världsmusikensemble — svensk progg, västafrikanska grooves, sydafrikansk körsång och roots reggae delar samma scen.",
    "home.aboutLink": "→ Mer om oss",
    "home.upcoming": "Kommande spelningar",
    "home.upcomingEmpty":
      "Inga spelningar planerade just nu — kom tillbaka snart.",
    "home.allGigs": "→ Alla spelningar",
    "home.news": "Nyheter",
    "home.allNews": "→ Alla nyheter",

    "gigs.title": "Spelningar",
    "gigs.metaDesc": "Kommande och tidigare spelningar",
    "gigs.upcoming": "Kommande",
    "gigs.past": "Tidigare",
    "gigs.empty": "Inga spelningar planerade just nu.",
    "gig.tickets": "Biljetter",
    "gig.cancelled": "Inställd",
    "gig.back": "← Alla spelningar",
    "gig.posterAlt": "affisch",

    "news.title": "Nyheter",
    "news.metaDesc": "Nyheter och uppdateringar",
    "news.empty": "Inga nyheter än — kom tillbaka snart.",

    "media.title": "Media",
    "media.metaDesc": "Videoinspelningar från Arbetarorkestern",
    "media.empty": "Inga videor ännu.",
    "media.play": "Spela",
    "media.videoDescPrefix": "Video från Arbetarorkestern —",
    "media.published": "Publicerad på YouTube",
    "media.openYouTube": "→ Öppna på YouTube",
    "media.back": "← Alla videor",
  },
  en: {
    "nav.gigs": "Shows",
    "nav.media": "Media",
    "nav.news": "News",
    "nav.about": "About",

    "site.tagline": "World music from Stockholm",
    "site.description":
      "Arbetarorkestern is a collective world-music ensemble from Stockholm. South African choral tradition, roots reggae, and Swedish folk song share the stage.",

    "home.bio":
      "A collective world-music ensemble — Swedish prog, West African grooves, South African choral singing, and roots reggae share the stage.",
    "home.aboutLink": "→ More about us",
    "home.upcoming": "Upcoming shows",
    "home.upcomingEmpty": "No shows planned right now — check back soon.",
    "home.allGigs": "→ All shows",
    "home.news": "News",
    "home.allNews": "→ All news",

    "gigs.title": "Shows",
    "gigs.metaDesc": "Upcoming and past shows",
    "gigs.upcoming": "Upcoming",
    "gigs.past": "Past",
    "gigs.empty": "No shows planned right now.",
    "gig.tickets": "Tickets",
    "gig.cancelled": "Cancelled",
    "gig.back": "← All shows",
    "gig.posterAlt": "poster",

    "news.title": "News",
    "news.metaDesc": "News and updates",
    "news.empty": "No news yet — check back soon.",

    "media.title": "Media",
    "media.metaDesc": "Video recordings from Arbetarorkestern",
    "media.empty": "No videos yet.",
    "media.play": "Play",
    "media.videoDescPrefix": "Video from Arbetarorkestern —",
    "media.published": "Published on YouTube",
    "media.openYouTube": "→ Open on YouTube",
    "media.back": "← All videos",
  },
} as const;

export type UIKey = keyof (typeof ui)["sv"];

export function t(lang: Locale, key: UIKey): string {
  return ui[lang][key] ?? ui.sv[key];
}
