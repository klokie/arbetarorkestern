#!/usr/bin/env node
// Imports YouTube channel videos into the vault as one markdown per video.
//
// Usage:
//   node scripts/import-videos.mjs [--channel <url>] [--out <dir>] [--keep-tmp]
//
// Defaults:
//   --channel  https://www.youtube.com/@Arbetarorkestern-j1d/videos
//   --out      <vault>/personal/music/Arbetarorkestern/PUBLIC/videos
//
// Requires `yt-dlp` on PATH. Uses Chrome cookies to bypass YouTube's bot gate.
// Re-runs are idempotent for existing files: a video already on disk is left
// alone (so manual edits to recordedAt/title/description survive). Pass
// --overwrite to force regeneration.

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir, homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const has = (name) => args.includes(`--${name}`);

const CHANNEL = flag("channel", "https://www.youtube.com/@Arbetarorkestern-j1d/videos");
const DEFAULT_OUT = join(
  homedir(),
  "Library/Mobile Documents/iCloud~md~obsidian/Documents/vault/personal/music/Arbetarorkestern/PUBLIC/videos",
);
const OUT = flag("out", DEFAULT_OUT);
const OVERWRITE = has("overwrite");
const KEEP_TMP = has("keep-tmp");

mkdirSync(OUT, { recursive: true });

const tmp = mkdtempSync(join(tmpdir(), "aovideos-"));
console.log(`Working in ${tmp}`);
console.log(`Pulling metadata from ${CHANNEL} ...`);

try {
  execFileSync(
    "yt-dlp",
    [
      "--cookies-from-browser", "chrome",
      "--skip-download",
      "--write-info-json",
      "--no-write-thumbnail",
      "-o", `${tmp}/%(id)s.%(ext)s`,
      CHANNEL,
    ],
    { stdio: "inherit" },
  );
} catch (e) {
  console.error("yt-dlp failed:", e.message);
  process.exit(1);
}

const files = readdirSync(tmp).filter((f) => f.endsWith(".info.json") && !f.startsWith("UC"));
console.log(`Got ${files.length} videos.`);

const SLUG_TX = (s) =>
  s
    .toLowerCase()
    .replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o")
    .replace(/é/g, "e").replace(/è/g, "e").replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const stripPrefix = (title) =>
  title
    .replace(/^Arbetarorkestern\s*[-–—]\s*/i, "")
    .replace(/^Orkestern\s*[-–—]\s*medlemmar ur Arbetarorkestern\s*[-–—]\s*/i, "")
    .replace(/^CTS\s*[-–—]\s*medlemmar ur Arbetarorkestern\s*[-–—]\s*/i, "");

const usedSlugs = new Map();

const records = files.map((f) => {
  const d = JSON.parse(readFileSync(join(tmp, f), "utf8"));
  const dateRaw = d.upload_date || "";
  const date = dateRaw.length === 8
    ? `${dateRaw.slice(0, 4)}-${dateRaw.slice(4, 6)}-${dateRaw.slice(6, 8)}`
    : "";
  const titleNoPrefix = stripPrefix(d.title || d.id);
  let slug = `${date}-${SLUG_TX(titleNoPrefix)}`;
  const count = usedSlugs.get(slug) || 0;
  usedSlugs.set(slug, count + 1);
  if (count > 0) slug = `${slug}-${d.id.slice(0, 6).toLowerCase()}`;
  return { d, date, titleNoPrefix, slug };
});

let written = 0;
let skipped = 0;

for (const { d, date, titleNoPrefix, slug } of records) {
  const file = join(OUT, `${slug}.md`);
  if (existsSync(file) && !OVERWRITE) {
    skipped++;
    continue;
  }

  const desc = (d.description || "").trim();
  const body = desc
    ? desc.split("\n").map((line) => line.trimEnd()).join("  \n")
    : "";

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(d.title)}`,
    `videoId: ${d.id}`,
    `date: ${date}`,
    `uploadedAt: ${date}`,
    `# recordedAt:  # optional override if known`,
    `duration: ${d.duration ?? 0}`,
    `published: true`,
    "---",
    "",
    body,
    "",
  ].join("\n");

  writeFileSync(file, frontmatter);
  written++;
}

console.log(`Wrote ${written} new file(s); skipped ${skipped} existing.`);
console.log(`Output: ${OUT}`);

if (!KEEP_TMP) rmSync(tmp, { recursive: true, force: true });
