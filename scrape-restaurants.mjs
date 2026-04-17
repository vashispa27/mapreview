/**
 * Scrape 100 restaurants near a location using Apify Google Maps Scraper.
 * Outputs: restaurants.csv + restaurants.json
 *
 * Setup:
 *   npm install apify-client   (one-time)
 *
 * Run:
 *   APIFY_TOKEN=your_token node scrape-restaurants.mjs
 *   -- or --
 *   set APIFY_TOKEN in the CONFIG block below and just run:
 *   node scrape-restaurants.mjs
 */

import { ApifyClient } from "apify-client"
import { writeFileSync } from "fs"

// ─── CONFIG — edit these ────────────────────────────────────────────────────
const APIFY_TOKEN = process.env.APIFY_TOKEN || "YOUR_TOKEN_HERE"
const LOCATION    = "Bengaluru, India"  // e.g. "Bengaluru, India" or "Austin, TX"
const MAX_RESULTS = 100
// ────────────────────────────────────────────────────────────────────────────

if (APIFY_TOKEN === "YOUR_TOKEN_HERE") {
  console.error("❌  Set your Apify token: APIFY_TOKEN=xxx node scrape-restaurants.mjs")
  console.error("    Get it free at https://console.apify.com/account/integrations")
  process.exit(1)
}

const client = new ApifyClient({ token: APIFY_TOKEN })

console.log(`🔍  Searching for restaurants near: ${LOCATION}`)
console.log(`    Target: ${MAX_RESULTS} results\n`)

const run = await client.actor("compass/crawler-google-places").call({
  searchStringsArray: ["restaurant", "cafe"],
  locationQuery: LOCATION,
  maxCrawledPlacesPerSearch: Math.ceil(MAX_RESULTS / 2), // split across 2 search terms
  language: "en",
  // Only fetch the fields we need — faster + cheaper
  scrapeReviews: false,
  scrapeImages: false,
})

console.log(`✅  Run finished. Fetching results...`)

const { items } = await client.dataset(run.defaultDatasetId).listItems()

// Deduplicate by Google Maps URL, then trim to MAX_RESULTS
const seen = new Set()
const places = items
  .filter((p) => {
    if (seen.has(p.url)) return false
    seen.add(p.url)
    return true
  })
  .slice(0, MAX_RESULTS)

console.log(`📦  Got ${places.length} unique restaurants\n`)

// ─── Build rows ──────────────────────────────────────────────────────────────
const rows = places.map((p) => ({
  name:          p.title        ?? "",
  google_maps:   p.url          ?? "",
  rating:        p.totalScore   ?? "",
  review_count:  p.reviewsCount ?? 0,
  website:       p.website      ?? "",
  phone:         p.phone        ?? "",
  address:       p.address      ?? "",
  category:      p.categoryName ?? "",
}))

// ─── Write JSON ──────────────────────────────────────────────────────────────
writeFileSync("restaurants.json", JSON.stringify(rows, null, 2))
console.log("📄  restaurants.json written")

// ─── Write CSV ───────────────────────────────────────────────────────────────
const escape = (v) => `"${String(v).replace(/"/g, '""')}"`
const header = Object.keys(rows[0]).join(",")
const csvRows = rows.map((r) => Object.values(r).map(escape).join(","))
writeFileSync("restaurants.csv", [header, ...csvRows].join("\n"))
console.log("📊  restaurants.csv written")

// ─── Quick preview ───────────────────────────────────────────────────────────
console.log("\nTop 5 preview:")
rows.slice(0, 5).forEach((r, i) =>
  console.log(`  ${i + 1}. ${r.name} — ⭐ ${r.rating} (${r.review_count} reviews) — ${r.website || "no website"}`)
)

console.log(`\n✅  Done. Open restaurants.csv to see all ${rows.length} results.`)
