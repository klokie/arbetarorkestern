#!/usr/bin/env node
// Uploads a local image to the aark-media R2 bucket and prints the public URL
// + a ready-to-paste frontmatter snippet.
//
// Usage:
//   node scripts/upload-media.mjs <local-file> [<key>]
//
// Examples:
//   node scripts/upload-media.mjs ~/Downloads/tida.png posters/2026-06-06-tida.png
//   node scripts/upload-media.mjs ~/Downloads/tida.png          # key auto-derived
//
// Requirements: wrangler logged in, sips (macOS, for image dimensions),
// pbcopy (macOS, optional — URL is copied to clipboard).

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { basename } from "node:path";

const BUCKET = "aark-media";
const PUBLIC_HOST = "media.arbetarorkestern.klokie.com";

const args = process.argv.slice(2);
if (args.length < 1 || args.includes("--help") || args.includes("-h")) {
  console.error(
    [
      "Usage: node scripts/upload-media.mjs <local-file> [<key>]",
      "",
      "  <local-file>   path to image on disk",
      "  <key>          optional R2 key (e.g. posters/2026-06-06-tida.png).",
      "                 Defaults to <basename>.",
    ].join("\n"),
  );
  process.exit(args.length < 1 ? 1 : 0);
}

const [file, keyArg] = args;
if (!existsSync(file)) {
  console.error(`File not found: ${file}`);
  process.exit(1);
}

const key = keyArg ?? basename(file);
const sizeBytes = statSync(file).size;
const sizeKb = (sizeBytes / 1024).toFixed(1);

// Try to read pixel dimensions via macOS sips. Non-fatal if missing.
function readDimensions(path) {
  try {
    const out = execFileSync(
      "sips",
      ["-g", "pixelWidth", "-g", "pixelHeight", path],
      { encoding: "utf8" },
    );
    const w = /pixelWidth:\s*(\d+)/.exec(out)?.[1];
    const h = /pixelHeight:\s*(\d+)/.exec(out)?.[1];
    if (w && h) return { width: Number(w), height: Number(h) };
  } catch {}
  return null;
}

const dims = readDimensions(file);

console.log(`Uploading ${file} (${sizeKb} KB) → r2://${BUCKET}/${key}`);

const result = spawnSync(
  "npx",
  ["wrangler", "r2", "object", "put", `${BUCKET}/${key}`, `--file=${file}`],
  { stdio: "inherit" },
);

if (result.status !== 0) {
  console.error("\nUpload failed.");
  console.error("If you're not logged in, run: npx wrangler login");
  process.exit(result.status ?? 1);
}

const url = `https://${PUBLIC_HOST}/${key}`;

// Copy URL to clipboard (macOS).
try {
  spawnSync("pbcopy", { input: url, encoding: "utf8" });
} catch {}

console.log("");
console.log(`Public URL: ${url}`);
console.log("(copied to clipboard)");
console.log("");
console.log("Frontmatter snippet:");
console.log("---");
console.log(`image: ${url}`);
console.log("imageAlt: ");
if (dims) {
  console.log(`imageWidth: ${dims.width}`);
  console.log(`imageHeight: ${dims.height}`);
}
console.log("---");
