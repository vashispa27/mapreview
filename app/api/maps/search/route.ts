import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 3) {
      return NextResponse.json({ results: [] })
    }

    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY
    if (!GOOGLE_MAPS_API_KEY) {
      console.error("Missing GOOGLE_MAPS_API_KEY")
      return NextResponse.json({ error: "Search engine not configured" }, { status: 500 })
    }

    // Using Google Places API Text Search
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&key=${GOOGLE_MAPS_API_KEY}`
    )

    if (!response.ok) {
      throw new Error("Failed to fetch from Google Maps API")
    }

    const data = await response.json()

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(`Google Maps API error: ${data.status}`)
    }

    // Map Google results to our frontend structure
    const results = (data.results || []).map((place: any) => {
      // Construct a clean Google Maps URL using the Place ID
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        place.name + " " + (place.formatted_address || "")
      )}&query_place_id=${place.place_id}`

      return {
        id: place.place_id,
        name: place.name || "Unknown Business",
        address: place.formatted_address || "No address provided",
        rating: place.rating || 0,
        reviews: place.user_ratings_total || 0,
        url: url,
      }
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search Error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
