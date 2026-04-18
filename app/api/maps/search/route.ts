import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// Simple in-memory cache: query → { results, ts }
const cache = new Map<string, { results: unknown[]; ts: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.trim() ?? ""

    if (query.length < 3) {
      return NextResponse.json({ results: [] })
    }

    const cacheKey = query.toLowerCase()
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      return NextResponse.json({ results: cached.results })
    }

    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY
    if (!GOOGLE_MAPS_API_KEY) {
      return NextResponse.json({ error: "Search not configured" }, { status: 500 })
    }

    // Autocomplete is ~11× cheaper than Text Search ($2.83 vs $32 per 1000 requests)
    // `components=country:XX` biases results to that country (ISO 3166-1 alpha-2).
    // Cost is the same regardless — restriction only improves relevance.
    // To target multiple countries: country:us|country:ca|country:gb
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
        `?input=${encodeURIComponent(query)}` +
        `&types=establishment` +
        `&components=country:in` +
        `&key=${GOOGLE_MAPS_API_KEY}`
    )

    if (!res.ok) throw new Error("Google API error")

    const data = await res.json()

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(`Google API: ${data.status}`)
    }

    const results = (data.predictions ?? []).slice(0, 6).map((p: any) => ({
      id: p.place_id,
      name: p.structured_formatting?.main_text ?? p.description,
      address: p.structured_formatting?.secondary_text ?? "",
      // Canonical place URL — accepted by Apify and passes our updated validation
      url: `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
    }))

    // Cache before returning
    cache.set(cacheKey, { results, ts: Date.now() })
    // Prune cache if it grows too large
    if (cache.size > 200) {
      const oldest = [...cache.entries()].sort((a, b) => a[1].ts - b[1].ts)[0]
      cache.delete(oldest[0])
    }

    return NextResponse.json({ results })
  } catch (err) {
    console.error("[Maps Search]", err)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
