import { NextRequest, NextResponse } from "next/server"

const cache = new Map<string, { results: unknown[]; ts: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000

// IP rate limit: 30 requests per minute
const rateLimit = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 30
const RATE_WINDOW = 60 * 1000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
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
      url: `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
    }))

    cache.set(cacheKey, { results, ts: Date.now() })
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
