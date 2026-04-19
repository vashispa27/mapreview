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
const LOCATION    = "Dehradun, India"
const MAX_RESULTS = 1000
// ────────────────────────────────────────────────────────────────────────────

if (APIFY_TOKEN === "YOUR_TOKEN_HERE") {
  console.error("❌  Set your Apify token: APIFY_TOKEN=xxx node scrape-restaurants.mjs")
  console.error("    Get it free at https://console.apify.com/account/integrations")
  process.exit(1)
}

const client = new ApifyClient({ token: APIFY_TOKEN })

console.log(`🔍  Searching for gyms near: ${LOCATION}`)
console.log(`    Target: ${MAX_RESULTS} results\n`)

const run = await client.actor("compass/crawler-google-places").call({
  searchStringsArray: ["gym", "fitness center"],
  locationQuery: LOCATION,
  maxCrawledPlacesPerSearch: Math.ceil(MAX_RESULTS / 2),
  language: "en",
  scrapeReviews: false,
  scrapeImages: false,
})

console.log(`✅  Run finished. Fetching results...`)

const { items } = await client.dataset(run.defaultDatasetId).listItems()

// Deduplicate by Google Maps URL, filter for Instagram or Phone, then trim
const seen = new Set()
const places = items
  .filter((p) => {
    if (seen.has(p.url)) return false
    seen.add(p.url)
    
    // Filter for Instagram or Phone
    const hasInstagram = p.instagramUrl || (p.website && p.website.includes("instagram.com"));
    const hasPhone = !!p.phone;
    
    return hasInstagram || hasPhone;
  })
  .slice(0, MAX_RESULTS)

console.log(`📦  Got ${places.length} unique gyms with Instagram or Phone\n`)

// ─── Build rows ──────────────────────────────────────────────────────────────
const rows = places.map((p) => ({
  name:          p.title        ?? "",
  google_maps:   p.url          ?? "",
  rating:        p.totalScore   ?? "",
  review_count:  p.reviewsCount ?? 0,
  website:       p.website      ?? "",
  instagram:     p.instagramUrl ?? (p.website?.includes("instagram.com") ? p.website : ""),
  phone:         p.phone        ?? "",
  address:       p.address      ?? "",
  category:      p.categoryName ?? "",
}))

// ─── Write JSON ──────────────────────────────────────────────────────────────
writeFileSync("gyms.json", JSON.stringify(rows, null, 2))
console.log("📄  gyms.json written")

// ─── Write CSV ───────────────────────────────────────────────────────────────
const escape = (v) => `"${String(v).replace(/"/g, '""')}"`
const header = Object.keys(rows[0]).join(",")
const csvRows = rows.map((r) => Object.values(r).map(escape).join(","))
writeFileSync("gyms.csv", [header, ...csvRows].join("\n"))
console.log("📊  gyms.csv written")

// ─── Quick preview ───────────────────────────────────────────────────────────
console.log("\nTop 5 preview:")
rows.slice(0, 5).forEach((r, i) =>
  console.log(`  ${i + 1}. ${r.name} — ⭐ ${r.rating} (${r.review_count} reviews) — ${r.website || "no website"}`)
)

console.log(`\n✅  Done. Open restaurants.csv to see all ${rows.length} results.`)
